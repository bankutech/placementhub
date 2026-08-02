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

    this.playlistLectureNav = document.getElementById('playlistLectureNav');
    this.playlistCurrentLectureText = document.getElementById('playlistCurrentLectureText');
    this.lectureIndexSelect = document.getElementById('lectureIndexSelect');
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

    // Standard clean YouTube embed format — works universally across desktop & mobile
    const BASE = 'https://www.youtube.com/embed';

    if (parsed) {
      if (parsed.type === 'playlist') {
        this.currentPlaylistId = parsed.id;
        embedUrl = `${BASE}/videoseries?list=${parsed.id}&rel=0&index=${lectureIndex}`;
        rawWatchUrl = `https://www.youtube.com/playlist?list=${parsed.id}`;
        this.setupPlaylistLectureNav(parsed.id, lectureIndex);
      } else {
        this.currentPlaylistId = null;
        this.hidePlaylistLectureNav();
        const listParam = parsed.playlistId ? `&list=${parsed.playlistId}` : '';
        embedUrl = `${BASE}/${parsed.id}?rel=0${listParam}`;
        rawWatchUrl = parsed.playlistId
          ? `https://www.youtube.com/watch?v=${parsed.id}&list=${parsed.playlistId}`
          : `https://www.youtube.com/watch?v=${parsed.id}`;
      }
    } else {
      this.currentPlaylistId = null;
      this.hidePlaylistLectureNav();
      embedUrl = `${BASE}/${video.youtubeId}?rel=0`;
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

    // Re-highlight active playlist item in sidebar
    this.highlightActivePlaylistItem();

    // Scroll active item into view inside sidebar
    const activeItem = document.querySelector(`.playlist-item[data-video-id="${video.id}"]`);
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // --------------------------------------------------------------------------
  // Playlist Lecture Specific Navigation (index=N parameter)
  // --------------------------------------------------------------------------
  setupPlaylistLectureNav(playlistId, lectureIndex = 0) {
    if (!this.playlistLectureNav) {
      this.playlistLectureNav = document.getElementById('playlistLectureNav');
    }
    if (!this.playlistCurrentLectureText) {
      this.playlistCurrentLectureText = document.getElementById('playlistCurrentLectureText');
    }
    if (!this.lectureIndexSelect) {
      this.lectureIndexSelect = document.getElementById('lectureIndexSelect');
    }

    if (this.playlistLectureNav) {
      this.playlistLectureNav.style.display = 'flex';
    }

    if (this.playlistCurrentLectureText) {
      this.playlistCurrentLectureText.textContent = `Playing Lecture #${lectureIndex + 1}`;
    }

    if (this.lectureIndexSelect) {
      this.lectureIndexSelect.innerHTML = '';
      // Populate standard 1 to 100 lectures for quick navigation
      for (let i = 0; i < 100; i++) {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = `Lecture ${i + 1}${i === 0 ? ' (Start)' : ''}`;
        if (i === lectureIndex) opt.selected = true;
        this.lectureIndexSelect.appendChild(opt);
      }
    }
  }

  hidePlaylistLectureNav() {
    if (!this.playlistLectureNav) {
      this.playlistLectureNav = document.getElementById('playlistLectureNav');
    }
    if (this.playlistLectureNav) {
      this.playlistLectureNav.style.display = 'none';
    }
  }

  jumpToPlaylistLecture(lectureIndex) {
    if (!this.currentPlaylistId) return;
    this.currentPlaylistLectureIndex = Math.max(0, lectureIndex);

    const BASE = 'https://www.youtube.com/embed';
    const embedUrl = `${BASE}/videoseries?list=${this.currentPlaylistId}&rel=0&index=${this.currentPlaylistLectureIndex}&autoplay=1`;

    if (this.videoIframe) {
      this.videoIframe.src = '';
      this.videoIframe.src = embedUrl;
    }

    if (this.playlistCurrentLectureText) {
      this.playlistCurrentLectureText.textContent = `Playing Lecture #${this.currentPlaylistLectureIndex + 1}`;
    }
    if (this.lectureIndexSelect) {
      this.lectureIndexSelect.value = this.currentPlaylistLectureIndex;
    }

    window.showToast(`Switched to Lecture #${this.currentPlaylistLectureIndex + 1}`, 'info');
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
      if (this.currentPlaylistLectureIndex > 0) {
        this.jumpToPlaylistLecture(this.currentPlaylistLectureIndex - 1);
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
    const track = window.appState.tracks[this.currentTrackId];
    if (!track || !track.videos.length) return;

    if (this.currentVideoIndex < track.videos.length - 1) {
      const nextIndex = this.currentVideoIndex + 1;
      const nextVideo = track.videos[nextIndex];
      this.loadVideo(nextVideo, this.currentTrackId, nextIndex);
      window.showToast(`Now Playing: ${nextVideo.title}`, 'info');
    } else {
      window.showToast("🎉 You've reached the end of this playlist!", 'success');
    }
  }

  playPrev() {
    const track = window.appState.tracks[this.currentTrackId];
    if (!track || !track.videos.length) return;

    if (this.currentVideoIndex > 0) {
      const prevIndex = this.currentVideoIndex - 1;
      const prevVideo = track.videos[prevIndex];
      this.loadVideo(prevVideo, this.currentTrackId, prevIndex);
      window.showToast(`Now Playing: ${prevVideo.title}`, 'info');
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
