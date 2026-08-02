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

    this.loadWatchedState();
  }

  // --------------------------------------------------------------------------
  // Intelligent YouTube URL / ID Parser
  // --------------------------------------------------------------------------
  static parseYouTubeUrl(urlOrId) {
    if (!urlOrId || typeof urlOrId !== 'string') return null;
    const clean = urlOrId.trim();

    // 1. Direct 11-character video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
      return { type: 'video', id: clean };
    }

    // 2. Playlist URL (youtube.com/playlist?list=ID)
    const playlistMatch = clean.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    
    // 3. youtu.be/ID format
    const shortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) {
      return { 
        type: 'video', 
        id: shortMatch[1],
        playlistId: playlistMatch ? playlistMatch[1] : null 
      };
    }

    // 4. Standard watch?v=ID format
    const watchMatch = clean.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) {
      return { 
        type: 'video', 
        id: watchMatch[1],
        playlistId: playlistMatch ? playlistMatch[1] : null 
      };
    }

    // 5. Embed URL format (youtube.com/embed/ID)
    const embedMatch = clean.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) {
      return { 
        type: 'video', 
        id: embedMatch[1],
        playlistId: playlistMatch ? playlistMatch[1] : null 
      };
    }

    // 6. Only playlist URL provided
    if (playlistMatch) {
      return { type: 'playlist', id: playlistMatch[1] };
    }

    // Fallback if user just entered custom link string
    return { type: 'video', id: clean };
  }

  // --------------------------------------------------------------------------
  // Render / Play Video In-Place Without Leaving Page
  // --------------------------------------------------------------------------
  loadVideo(video, trackId, index = 0) {
    if (!video) {
      this.showPlaceholder("No video selected", "Choose a video from the playlist to start learning.");
      return;
    }

    this.currentTrackId = trackId;
    this.currentVideoIndex = index;

    // Parse the stored ID or URL — must happen BEFORE building embedUrl
    const parsed = VideoPlayerController.parseYouTubeUrl(video.youtubeId || video.youtubeUrl);

    let embedUrl = "";
    let rawWatchUrl = video.youtubeUrl || `https://www.youtube.com/watch?v=${video.youtubeId}`;

    // Use youtube-nocookie.com — privacy-safe, works on real domains + localhost
    // autoplay=1 works when triggered by user click (which this always is)
    const BASE = 'https://www.youtube-nocookie.com/embed';
    const origin = encodeURIComponent(window.location.origin);

    if (parsed) {
      if (parsed.type === 'playlist') {
        embedUrl = `${BASE}/videoseries?list=${parsed.id}&rel=0&modestbranding=1&autoplay=1&origin=${origin}`;
        rawWatchUrl = `https://www.youtube.com/playlist?list=${parsed.id}`;
      } else {
        const listParam = parsed.playlistId ? `&list=${parsed.playlistId}` : '';
        embedUrl = `${BASE}/${parsed.id}?rel=0&modestbranding=1&autoplay=1&origin=${origin}${listParam}`;
        rawWatchUrl = parsed.playlistId
          ? `https://www.youtube.com/watch?v=${parsed.id}&list=${parsed.playlistId}`
          : `https://www.youtube.com/watch?v=${parsed.id}`;
      }
    } else {
      embedUrl = `${BASE}/${video.youtubeId}?rel=0&modestbranding=1&autoplay=1&origin=${origin}`;
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
