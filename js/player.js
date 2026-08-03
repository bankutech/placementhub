/* ==========================================================================
   VIDEO PLAYER CONTROLLER - IN-PAGE SEAMLESS EMBED (NO TAB SWITCHING)
   ========================================================================== */

class VideoPlayerController {
  constructor() {
    this.currentTrackId = 'java';
    this.currentVideoIndex = 0;
    this.isAutoplayEnabled = true;
    this.isTheaterMode = false;
    this.watchedVideos = new Set();

    // DOM Elements
    this.videoIframe = document.getElementById('videoIframe');
    this.videoPlaceholder = document.getElementById('videoPlaceholder');
    this.videoTitleElem = document.getElementById('currentVideoTitle');
    this.videoDescElem = document.getElementById('currentVideoDesc');
    this.videoTrackBadge = document.getElementById('videoTrackBadge');
    this.videoLevelBadge = document.getElementById('videoLevelBadge');
    this.videoCategoryBadge = document.getElementById('videoCategoryBadge');
    this.btnMarkWatched = document.getElementById('btnMarkWatched');
    this.playlistItemsContainer = document.getElementById('playlistItemsContainer');
    this.playlistCountChip = document.getElementById('playlistCountChip');
    this.learningStageGrid = document.getElementById('learningStageGrid');

    this.currentPlaylistLectureIndex = 0;
    this.currentPlaylistId = null;

    this.loadWatchedState();
  }

  // --------------------------------------------------------------------------
  // Intelligent YouTube URL / ID Parser
  // --------------------------------------------------------------------------
  static parseYouTubeUrl(urlOrId) {
    if (!urlOrId || typeof urlOrId !== 'string') return null;
    const clean = urlOrId.trim();

    // 1. Direct Playlist ID (starts with PL, RD, UU, FL, LP, OLAK5uy_ or length > 11)
    if (/^(?:PL|RD|UU|FL|LP|OLAK5uy_)[a-zA-Z0-9_-]+$/.test(clean) || (clean.startsWith('PL') && clean.length > 11)) {
      return { type: 'playlist', id: clean };
    }

    // 2. Direct 11-character video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return { type: 'video', id: clean };
    }

    // 3. Extract list= parameter from any full URL
    const playlistMatch = clean.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    
    // 4. youtu.be/ID format
    const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) {
      return { 
        type: 'video', 
        id: shortMatch[1],
        playlistId: playlistMatch ? playlistMatch[1] : null 
      };
    }

    // 5. Standard watch?v=ID format
    const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) {
      return { 
        type: 'video', 
        id: watchMatch[1],
        playlistId: playlistMatch ? playlistMatch[1] : null 
      };
    }

    // 6. Embed URL format (youtube.com/embed/videoseries?list=ID or youtube.com/embed/ID)
    const embedSeriesMatch = clean.match(/youtube\.com\/embed\/videoseries\?list=([a-zA-Z0-9_-]+)/);
    if (embedSeriesMatch) {
      return { type: 'playlist', id: embedSeriesMatch[1] };
    }

    const embedMatch = clean.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) {
      return { 
        type: 'video', 
        id: embedMatch[1],
        playlistId: playlistMatch ? playlistMatch[1] : null 
      };
    }

    // 7. Playlist URL (with list= parameter and no video ID)
    if (playlistMatch) {
      return { type: 'playlist', id: playlistMatch[1] };
    }

    // Fallback: If longer than standard video ID (11 chars), treat as playlist
    if (clean.length > 11) {
      return { type: 'playlist', id: clean };
    }

    return { type: 'video', id: clean };
  }

  // --------------------------------------------------------------------------
  // Render / Play Video In-Place Without Leaving Page
  // --------------------------------------------------------------------------
  loadVideo(video, trackId, index = 0, lectureIndex = 0) {
    if (!video) {
      this.showPlaceholder("No video selected", "Choose a video from the playlist to start learning.");
      return;
    }

    this.currentTrackId = trackId;
    this.currentVideoIndex = index;
    this.currentPlaylistLectureIndex = lectureIndex;

    // Parse the stored ID or URL — must happen BEFORE building embedUrl
    const parsed = VideoPlayerController.parseYouTubeUrl(video.youtubeId || video.youtubeUrl);

    let embedUrl = "";
    let rawWatchUrl = video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeId}`;

    // Standard clean YouTube embed format — minimizes clutter, cards & popups
    const BASE = 'https://www.youtube.com/embed';
    const CLEAN = 'rel=0&iv_load_policy=3&modestbranding=1&cc_load_policy=0';

    if (parsed) {
      if (parsed.type === 'playlist') {
        this.currentPlaylistId = parsed.id;
        embedUrl = `${BASE}/videoseries?list=${parsed.id}&${CLEAN}&index=${lectureIndex}`;
        rawWatchUrl = `https://www.youtube.com/playlist?list=${parsed.id}`;
      } else {
        this.currentPlaylistId = null;
        const listParam = parsed.playlistId ? `&list=${parsed.playlistId}` : '';
        embedUrl = `${BASE}/${parsed.id}?${CLEAN}${listParam}`;
        rawWatchUrl = parsed.playlistId
          ? `https://www.youtube.com/watch?v=${parsed.id}&list=${parsed.playlistId}`
          : `https://www.youtube.com/watch?v=${parsed.id}`;
      }
    } else {
      this.currentPlaylistId = null;
      embedUrl = `${BASE}/${video.youtubeId}?${CLEAN}`;
    }

    // Show iframe, hide placeholder
    if (this.videoPlaceholder) this.videoPlaceholder.style.display = 'none';
    if (this.videoIframe) {
      // Reload by blanking first so navigating to same playlist re-triggers load
      this.videoIframe.src = '';
      this.videoIframe.src = embedUrl;
    }

    // Keep "Open in YouTube" button wired to correct watch URL
    const btnOpenYouTube = document.getElementById('btnOpenYouTube');
    if (btnOpenYouTube) {
      btnOpenYouTube.onclick = () => window.open(rawWatchUrl, '_blank', 'noopener,noreferrer');
    }

    // Update metadata titles and badges
    if (this.videoTitleElem) this.videoTitleElem.textContent = video.title;
    if (this.videoDescElem) this.videoDescElem.textContent = video.description || "Comprehensive placement preparation video lecture.";
    if (this.videoTrackBadge) this.videoTrackBadge.textContent = this.currentTrackId.toUpperCase();
    if (this.videoLevelBadge) this.videoLevelBadge.textContent = video.level || "All Levels";
    if (this.videoCategoryBadge) this.videoCategoryBadge.textContent = video.category || "Placement Module";

    // Update Mark as Watched button state
    const isWatched = this.watchedVideos.has(video.id);
    this.updateMarkWatchedButton(isWatched);

    // Re-render sidebar fully so sub-lectures expand for the active playlist item
    if (typeof window.renderPlaylistSidebar === 'function') {
      window.renderPlaylistSidebar(trackId);
    }

    this.scrollToActivePlaylistItem();
  }

  jumpToPlaylistLecture(lectureIndex) {
    if (!this.currentPlaylistId) return;
    this.currentPlaylistLectureIndex = Math.max(0, lectureIndex);

    // Retrieve real video details from cache if available
    const cached = window.appState.playlistItemsCache[this.currentPlaylistId];
    if (cached && cached[this.currentPlaylistLectureIndex]) {
      const lec = cached[this.currentPlaylistLectureIndex];
      window.selectPlaylistLecture(null, this.currentPlaylistId, this.currentPlaylistLectureIndex, lec.id, lec.title);
      return;
    }

    const BASE = 'https://www.youtube.com/embed';
    const CLEAN = 'rel=0&iv_load_policy=3&modestbranding=1&cc_load_policy=0';
    const embedUrl = `${BASE}/videoseries?list=${this.currentPlaylistId}&${CLEAN}&index=${this.currentPlaylistLectureIndex}&autoplay=1&t=${Date.now()}`;

    if (this.videoIframe) {
      this.videoIframe.src = '';
      this.videoIframe.src = embedUrl;
    }


    window.showToast(`Switched to Lecture #${this.currentPlaylistLectureIndex + 1}`, 'info');

    // Sync sub-lectures active highlight in sidebar
    if (typeof window.renderPlaylistSidebar === 'function') {
      window.renderPlaylistSidebar(this.currentTrackId);
    }
  }

  playNextPlaylistLecture() {
    if (this.currentPlaylistId) {
      this.jumpToPlaylistLecture(this.currentPlaylistLectureIndex + 1);
    } else {
      this.playNext();
    }
  }

  playPrevPlaylistLecture() {
    if (this.currentPlaylistId) {
      const cached = window.appState.playlistItemsCache[this.currentPlaylistId];
      const prevIdx = (this.currentPlaylistLectureIndex || 0) - 1;
      if (prevIdx >= 0) {
        this.jumpToPlaylistLecture(prevIdx);
      } else {
        window.showToast("You are already at Lecture #1", "info");
      }
    } else {
      this.playPrev();
    }
  }

  showPlaceholder(title, subtitle) {
    if (this.videoPlaceholder) {
      this.videoPlaceholder.style.display = 'flex';
      this.videoPlaceholder.innerHTML = `
        <i class="fa-solid fa-play-circle"></i>
        <h3>${title}</h3>
        <p>${subtitle}</p>
      `;
    }
    if (this.videoIframe) {
      this.videoIframe.src = "";
    }
  }

  // --------------------------------------------------------------------------
  // Navigation Controls (Prev / Next)
  // --------------------------------------------------------------------------
  playNext() {
    // If currently playing a sub-lecture playlist, go to next lecture within it
    if (this.currentPlaylistId) {
      const cached = window.appState.playlistItemsCache[this.currentPlaylistId];
      const currentIdx = this.currentPlaylistLectureIndex || 0;
      const nextIdx = currentIdx + 1;
      if (cached && Array.isArray(cached) && nextIdx < cached.length) {
        this.jumpToPlaylistLecture(nextIdx);
        return;
      } else if (cached && Array.isArray(cached) && nextIdx >= cached.length) {
        window.showToast("🎉 You've finished all lectures in this playlist!", 'success');
        return;
      }
    }

    // Otherwise navigate between main course items
    const track = window.appState.tracks[this.currentTrackId];
    if (!track || !track.videos.length) return;

    if (this.currentVideoIndex < track.videos.length - 1) {
      const nextIndex = this.currentVideoIndex + 1;
      const nextVideo = track.videos[nextIndex];
      this.loadVideo(nextVideo, this.currentTrackId, nextIndex);
      window.showToast(`Now Playing: ${nextVideo.title}`, 'info');
    } else {
      window.showToast("🎉 You've reached the end of this track!", 'success');
    }
  }

  playPrev() {
    // If currently playing a sub-lecture playlist, go to previous lecture within it
    if (this.currentPlaylistId) {
      const currentIdx = this.currentPlaylistLectureIndex || 0;
      const prevIdx = currentIdx - 1;
      if (prevIdx >= 0) {
        this.jumpToPlaylistLecture(prevIdx);
        return;
      } else {
        window.showToast("You are already at Lecture #1", "info");
        return;
      }
    }

    // Otherwise navigate between main course items
    const track = window.appState.tracks[this.currentTrackId];
    if (!track || !track.videos.length) return;

    if (this.currentVideoIndex > 0) {
      const prevIndex = this.currentVideoIndex - 1;
      const prevVideo = track.videos[prevIndex];
      this.loadVideo(prevVideo, this.currentTrackId, prevIndex);
      window.showToast(`Now Playing: ${prevVideo.title}`, 'info');
    } else {
      window.showToast("Already at the first video in this track.", "info");
    }
  }

  // --------------------------------------------------------------------------
  // Progress & Watched State
  // --------------------------------------------------------------------------
  toggleCurrentWatched() {
    const track = window.appState.tracks[this.currentTrackId];
    if (!track || !track.videos[this.currentVideoIndex]) return;

    const currentVideo = track.videos[this.currentVideoIndex];
    const isNowWatched = !this.watchedVideos.has(currentVideo.id);

    if (isNowWatched) {
      this.watchedVideos.add(currentVideo.id);
      window.showToast("Marked as Completed! 🎉", "success");
    } else {
      this.watchedVideos.delete(currentVideo.id);
      window.showToast("Unmarked as Completed", "info");
    }

    this.saveWatchedState();
    this.updateMarkWatchedButton(isNowWatched);
    this.highlightActivePlaylistItem();
    window.updateOverallProgress();
  }

  toggleVideoWatched(videoId) {
    const isWatched = this.watchedVideos.has(videoId);
    if (isWatched) {
      this.watchedVideos.delete(videoId);
    } else {
      this.watchedVideos.add(videoId);
    }
    this.saveWatchedState();
    this.updateMarkWatchedButton(this.watchedVideos.has(videoId));
    this.highlightActivePlaylistItem();
    window.updateOverallProgress();
  }

  updateMarkWatchedButton(isWatched) {
    if (!this.btnMarkWatched) return;
    if (isWatched) {
      this.btnMarkWatched.classList.add('watched');
      this.btnMarkWatched.innerHTML = `<i class="fa-solid fa-circle-check"></i> Completed`;
    } else {
      this.btnMarkWatched.classList.remove('watched');
      this.btnMarkWatched.innerHTML = `<i class="fa-regular fa-circle-check"></i> Mark Completed`;
    }
  }

  highlightActivePlaylistItem() {
    const allItems = document.querySelectorAll('.playlist-item');
    const track = window.appState.tracks[this.currentTrackId];
    if (!track || !track.videos[this.currentVideoIndex]) return;
    const currentVideo = track.videos[this.currentVideoIndex];

    allItems.forEach(item => {
      const vId = item.getAttribute('data-video-id');
      if (vId === currentVideo.id) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }

      // Update checkmark state
      const checkBtn = item.querySelector('.playlist-item-check i');
      if (checkBtn) {
        if (this.watchedVideos.has(vId)) {
          checkBtn.className = 'fa-solid fa-circle-check checked';
        } else {
          checkBtn.className = 'fa-regular fa-circle';
        }
      }
    });
  }

  scrollToActivePlaylistItem() {
    // Scroll active item into view
    setTimeout(() => {
      // 1. Scroll inner container if the active item is a sub-lecture
      const activeSubLec = document.querySelector('.playlist-sub-lecture.active');
      if (activeSubLec) {
        const subContainer = activeSubLec.closest('.playlist-sub-lectures-container');
        if (subContainer) {
          const subRect = activeSubLec.getBoundingClientRect();
          const containerRect = subContainer.getBoundingClientRect();
          const relativeTop = subRect.top - containerRect.top;
          const targetScroll = subContainer.scrollTop + relativeTop - 20;
          subContainer.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      }

      // 2. Scroll outer sidebar for the main playlist item wrapper
      const activeItem = activeSubLec ? activeSubLec.closest('.playlist-item-wrapper') : document.querySelector('.playlist-item-wrapper.is-active');
      const sidebar = document.getElementById('playlistItemsContainer');
      if (activeItem && sidebar) {
        const itemRect = activeItem.getBoundingClientRect();
        const sidebarRect = sidebar.getBoundingClientRect();
        const relativeTop = itemRect.top - sidebarRect.top;
        const targetScrollTop = sidebar.scrollTop + relativeTop - 20;
        
        sidebar.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
      }
    }, 150);
  }

  // --------------------------------------------------------------------------
  // Theater / Focus Mode
  // --------------------------------------------------------------------------
  toggleTheaterMode() {
    this.isTheaterMode = !this.isTheaterMode;
    if (this.learningStageGrid) {
      if (this.isTheaterMode) {
        this.learningStageGrid.classList.add('theater-mode');
        window.showToast("Theater Mode Enabled", "info");
      } else {
        this.learningStageGrid.classList.remove('theater-mode');
        window.showToast("Normal View Restored", "info");
      }
    }
  }

  // --------------------------------------------------------------------------
  // Persistence
  // --------------------------------------------------------------------------
  saveWatchedState() {
    try {
      localStorage.setItem('placementhub_watched_videos', JSON.stringify(Array.from(this.watchedVideos)));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  loadWatchedState() {
    try {
      const saved = localStorage.getItem('placementhub_watched_videos');
      if (saved) {
        this.watchedVideos = new Set(JSON.parse(saved));
      }
    } catch (e) {
      this.watchedVideos = new Set();
    }
  }
}

window.VideoPlayerController = VideoPlayerController;
