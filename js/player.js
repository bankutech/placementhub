/* ==========================================================================
   VIDEO PLAYER CONTROLLER - IN-PAGE SEAMLESS EMBED (NO TAB SWITCHING)
   Uses official YouTube IFrame Player API for real play/pause/seek control.
   ========================================================================== */

/* ---- Load YouTube IFrame API script once ---- */
(function() {
  if (document.getElementById('yt-iframe-api-script')) return;
  const tag = document.createElement('script');
  tag.id = 'yt-iframe-api-script';
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
})();

class VideoPlayerController {
  constructor() {
    this.currentTrackId = 'java';
    this.currentVideoIndex = 0;
    this.isAutoplayEnabled = true;
    this.isTheaterMode = false;
    this.isPlaying = false;
    this.watchedVideos = new Set();

    // YouTube IFrame API player instance
    this.ytPlayer = null;
    this.ytPlayerReady = false;
    this.pendingEmbedUrl = null;
    this.progressPollInterval = null;

    // DOM Elements
    this.videoIframe = document.getElementById('videoIframe');
    this.videoPlaceholder = document.getElementById('videoPlaceholder');
    this.videoTitleElem = document.getElementById('currentVideoTitle');
    this.videoDescElem = document.getElementById('currentVideoDesc');
    this.videoTrackBadge = document.getElementById('videoTrackBadge');
    this.videoLevelBadge = document.getElementById('videoLevelBadge');
    this.videoCategoryBadge = document.getElementById('videoCategoryBadge');
    this.btnMarkWatched = document.getElementById('btnMarkWatched');
    this.btnTogglePlay = document.getElementById('btnTogglePlay');
    this.playlistItemsContainer = document.getElementById('playlistItemsContainer');
    this.playlistCountChip = document.getElementById('playlistCountChip');
    this.learningStageGrid = document.getElementById('learningStageGrid');

    this.currentPlaylistLectureIndex = 0;
    this.currentPlaylistId = null;

    this.loadWatchedState();
    this.initYouTubeAPI();
    this.initScrubber();
    this.initControls();
    this.initAutoHideControls();
    this.initClickSurface();
  }

  // --------------------------------------------------------------------------
  // YouTube IFrame Player API — Real Integration
  // --------------------------------------------------------------------------
  initYouTubeAPI() {
    // Called by YouTube API when ready — or we poll until it is
    const tryInit = () => {
      if (window.YT && window.YT.Player) {
        this._createYTPlayer();
      } else {
        setTimeout(tryInit, 200);
      }
    };

    if (window.YT && window.YT.Player) {
      this._createYTPlayer();
    } else {
      // YT API calls onYouTubeIframeAPIReady when loaded
      const existing = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (existing) existing();
        this._createYTPlayer();
      };
      // Fallback poll in case callback already fired
      setTimeout(tryInit, 1500);
    }
  }

  _createYTPlayer() {
    if (this.ytPlayer) return; // already created
    const iframe = document.getElementById('videoIframe');
    if (!iframe) return;

    this.ytPlayer = new window.YT.Player('videoIframe', {
      events: {
        onReady: (e) => {
          this.ytPlayerReady = true;
          if (this.pendingEmbedUrl) {
            this._loadUrlIntoPlayer(this.pendingEmbedUrl);
            this.pendingEmbedUrl = null;
          }
          this._startProgressPoll();
        },
        onStateChange: (e) => {
          const S = window.YT.PlayerState;
          if (e.data === S.PLAYING) {
            this.isPlaying = true;
          } else if (e.data === S.PAUSED || e.data === S.ENDED || e.data === S.BUFFERING) {
            this.isPlaying = (e.data === S.BUFFERING); // consider buffering as playing
          }
          this.updatePlayPauseButton();
        }
      }
    });
  }

  _loadUrlIntoPlayer(embedUrl) {
    if (this.ytPlayer && this.ytPlayerReady && typeof this.ytPlayer.loadVideoByUrl === 'function') {
      // Use cueVideoById / loadVideoById for cleaner API usage
      // Extract video/playlist from embedUrl
      try {
        const url = new URL(embedUrl);
        const list = url.searchParams.get('list');
        const videoId = url.pathname.split('/').filter(Boolean).pop();

        if (videoId === 'videoseries' && list) {
          const index = parseInt(url.searchParams.get('index') || '0', 10);
          this.ytPlayer.loadPlaylist({ listType: 'playlist', list: list, index: index });
        } else if (videoId && videoId !== 'videoseries') {
          if (list) {
            this.ytPlayer.loadVideoById({ videoId: videoId, playerVars: { list: list } });
          } else {
            this.ytPlayer.loadVideoById(videoId);
          }
        }
        this.isPlaying = true;
        this.updatePlayPauseButton();
      } catch (err) {
        // Fallback: just set src on the iframe element
        const frame = document.getElementById('videoIframe');
        if (frame) frame.src = embedUrl;
      }
    } else {
      const frame = document.getElementById('videoIframe');
      if (frame) frame.src = embedUrl;
    }
  }

  _startProgressPoll() {
    if (this.progressPollInterval) clearInterval(this.progressPollInterval);
    this.progressPollInterval = setInterval(() => {
      if (!this.ytPlayer || !this.ytPlayerReady) return;
      try {
        const duration = this.ytPlayer.getDuration ? this.ytPlayer.getDuration() : 0;
        const current = this.ytPlayer.getCurrentTime ? this.ytPlayer.getCurrentTime() : 0;
        if (duration > 0) {
          this.duration = duration;
          this.currentTime = current;
          const pct = (current / duration) * 100;
          const bar = document.getElementById('ytProgressPlayed');
          if (bar) bar.style.width = `${pct}%`;
          this.updateTimeDisplay();
        }
      } catch (e) { /* player not ready */ }
    }, 500);
  }

  // --------------------------------------------------------------------------
  // YouTube API Communication & Player Controls
  // --------------------------------------------------------------------------
  initClickSurface() {
    const surface = document.getElementById('videoClickSurface');
    if (!surface) return;

    let clickTimer = null;
    surface.addEventListener('click', (e) => {
      if (clickTimer === null) {
        clickTimer = setTimeout(() => {
          clickTimer = null;
          this.togglePlay();
        }, 220);
      } else {
        clearTimeout(clickTimer);
        clickTimer = null;
        this.toggleTheaterMode();
      }
    });
  }

  flashIndicator(iconClass) {
    const indicator = document.getElementById('videoCenterIndicator');
    if (!indicator) return;
    indicator.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
    indicator.classList.add('flash');
    setTimeout(() => {
      indicator.classList.remove('flash');
    }, 380);
  }

  initAutoHideControls() {
    this.controlBar = document.getElementById('playerControlBar');
    this.videoWrapper = document.getElementById('videoFrameWrapper');
    this.playerCard = document.querySelector('.player-container-card');
    if (!this.controlBar) return;

    this.autoHideTimer = null;
    this.isHoveringControls = false;

    this.showControls = () => {
      if (this.controlBar) {
        this.controlBar.classList.remove('controls-hidden');
      }
    };

    this.hideControls = () => {
      if (this.controlBar && !this.isHoveringControls) {
        this.controlBar.classList.add('controls-hidden');
      }
    };

    this.resetAutoHideTimer = () => {
      this.showControls();
      if (this.autoHideTimer) clearTimeout(this.autoHideTimer);
      if (this.isHoveringControls) return;

      this.autoHideTimer = setTimeout(() => {
        this.hideControls();
      }, 3000);
    };

    // 1. User activity over video wrapper & card
    if (this.videoWrapper) {
      this.videoWrapper.addEventListener('mousemove', () => this.resetAutoHideTimer());
      this.videoWrapper.addEventListener('mouseenter', () => this.resetAutoHideTimer());
      this.videoWrapper.addEventListener('touchstart', () => this.resetAutoHideTimer(), { passive: true });
      this.videoWrapper.addEventListener('touchmove', () => this.resetAutoHideTimer(), { passive: true });
      this.videoWrapper.addEventListener('mouseleave', () => {
        if (this.autoHideTimer) clearTimeout(this.autoHideTimer);
        this.hideControls();
      });
    }

    if (this.playerCard) {
      this.playerCard.addEventListener('mousemove', () => this.resetAutoHideTimer());
      this.playerCard.addEventListener('mouseleave', () => {
        if (this.autoHideTimer) clearTimeout(this.autoHideTimer);
        this.hideControls();
      });
    }

    // 2. Hovering directly over the control bar pauses the timer
    this.controlBar.addEventListener('mouseenter', () => {
      this.isHoveringControls = true;
      if (this.autoHideTimer) clearTimeout(this.autoHideTimer);
      this.showControls();
    });

    this.controlBar.addEventListener('mouseleave', () => {
      this.isHoveringControls = false;
      this.resetAutoHideTimer();
    });

    // 3. Cursor tracking fallback across screen
    document.addEventListener('mousemove', (e) => {
      if (!this.videoWrapper) return;
      const rect = this.videoWrapper.getBoundingClientRect();
      const isInside = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );

      if (isInside) {
        this.resetAutoHideTimer();
      }
    });

    // Start initial 3-second auto-hide timer
    this.resetAutoHideTimer();
  }

  initScrubber() {
    const progressContainer = document.getElementById('ytProgressContainer');
    const progressPlayed = document.getElementById('ytProgressPlayed');
    if (!progressContainer || !progressPlayed) return;

    const handleSeek = (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      this.currentTime = pos * this.duration;
      progressPlayed.style.width = `${pos * 100}%`;
      this.sendYTCommand('seekTo', [this.currentTime, true]);
      this.updateTimeDisplay();
      if (this.resetAutoHideTimer) this.resetAutoHideTimer();
    };

    let isDragging = false;
    progressContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      handleSeek(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) handleSeek(e);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    progressContainer.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        handleSeek(e.touches[0]);
      }
    }, { passive: true });
  }

  initControls() {
    this.duration = 979; // Default 16:19
    this.currentTime = 0;
    this.isMuted = false;
    this.playbackSpeeds = [1, 1.25, 1.5, 2, 0.75];
    this.speedIndex = 0;

    const btnVolume = document.getElementById('btnVolumeMute');
    if (btnVolume) {
      btnVolume.addEventListener('click', () => this.toggleMute());
    }

    const btnSpeed = document.getElementById('btnSpeedMenu');
    if (btnSpeed) {
      btnSpeed.addEventListener('click', () => this.cycleSpeed());
    }

    const btnFullscreen = document.getElementById('btnFullscreen');
    if (btnFullscreen) {
      btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
    }
  }

  // Ticker removed — real time polling is done by _startProgressPoll() via YT API

  updateTimeDisplay() {
    const curElem = document.getElementById('ytCurrentTime');
    const totElem = document.getElementById('ytTotalTime');
    if (curElem) curElem.textContent = this.formatTime(this.currentTime);
    if (totElem) totElem.textContent = this.formatTime(this.duration);
  }

  formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      if (this.ytPlayer && this.ytPlayerReady) {
        this.isMuted ? this.ytPlayer.mute() : this.ytPlayer.unMute();
      }
    } catch (e) {}
    const volIcon = document.getElementById('volumeIcon');
    if (volIcon) {
      volIcon.className = this.isMuted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    }
    if (this.resetAutoHideTimer) this.resetAutoHideTimer();
    window.showToast(this.isMuted ? "🔇 Muted" : "🔊 Unmuted", "info");
  }

  cycleSpeed() {
    this.speedIndex = (this.speedIndex + 1) % this.playbackSpeeds.length;
    const speed = this.playbackSpeeds[this.speedIndex];
    try {
      if (this.ytPlayer && this.ytPlayerReady) {
        this.ytPlayer.setPlaybackRate(speed);
      }
    } catch (e) {}
    const speedText = document.getElementById('playbackSpeedText');
    if (speedText) speedText.textContent = `${speed}x`;
    if (this.resetAutoHideTimer) this.resetAutoHideTimer();
    window.showToast(`⚡ Playback Speed: ${speed}x`, "info");
  }

  toggleFullscreen() {
    const wrapper = document.getElementById('videoFrameWrapper');
    if (!wrapper) return;
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen().catch(err => console.warn("Fullscreen error:", err));
    } else {
      document.exitFullscreen();
    }
    if (this.resetAutoHideTimer) this.resetAutoHideTimer();
  }

  // Legacy postMessage fallback — used only when YT API unavailable
  sendYTCommand(func, args = []) {
    try {
      const p = this.ytPlayer;
      if (p && this.ytPlayerReady) {
        if (func === 'playVideo')  { p.playVideo();  return; }
        if (func === 'pauseVideo') { p.pauseVideo(); return; }
        if (func === 'seekTo')     { p.seekTo(args[0], args[1] !== false); return; }
        if (func === 'mute')       { p.mute();       return; }
        if (func === 'unMute')     { p.unMute();     return; }
        if (func === 'setPlaybackRate') { p.setPlaybackRate(args[0]); return; }
      }
    } catch (e) {}
    // Fallback postMessage
    const frame = document.getElementById('videoIframe');
    if (frame && frame.contentWindow) {
      try {
        frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
      } catch (e) {}
    }
  }

  getEmbedParams() {
    return 'enablejsapi=1&rel=0&iv_load_policy=3&modestbranding=1&controls=0&playsinline=1&origin=' + encodeURIComponent(window.location.origin);
  }

  togglePlay() {
    try {
      if (this.ytPlayer && this.ytPlayerReady) {
        const state = this.ytPlayer.getPlayerState ? this.ytPlayer.getPlayerState() : -1;
        const S = window.YT && window.YT.PlayerState ? window.YT.PlayerState : {};
        if (state === S.PLAYING) {
          this.ytPlayer.pauseVideo();
          this.isPlaying = false;
        } else {
          this.ytPlayer.playVideo();
          this.isPlaying = true;
        }
      } else {
        this.isPlaying = !this.isPlaying;
        this.sendYTCommand(this.isPlaying ? 'playVideo' : 'pauseVideo');
      }
    } catch (e) {
      this.isPlaying = !this.isPlaying;
      this.sendYTCommand(this.isPlaying ? 'playVideo' : 'pauseVideo');
    }
    this.flashIndicator(this.isPlaying ? 'fa-play' : 'fa-pause');
    this.updatePlayPauseButton();
    if (this.resetAutoHideTimer) this.resetAutoHideTimer();
    window.showToast(this.isPlaying ? "▶ Resumed" : "⏸ Paused", "info");
  }

  seekRelative(seconds) {
    try {
      if (this.ytPlayer && this.ytPlayerReady && this.ytPlayer.getCurrentTime) {
        const cur = this.ytPlayer.getCurrentTime();
        const dur = this.ytPlayer.getDuration() || 0;
        const target = Math.max(0, Math.min(dur, cur + seconds));
        this.ytPlayer.seekTo(target, true);
        this.currentTime = target;
      } else {
        this.currentTime = Math.max(0, Math.min(this.duration || 0, (this.currentTime || 0) + seconds));
        this.sendYTCommand('seekTo', [this.currentTime, true]);
      }
    } catch (e) {
      this.currentTime = Math.max(0, Math.min(this.duration || 0, (this.currentTime || 0) + seconds));
      this.sendYTCommand('seekTo', [this.currentTime, true]);
    }
    this.flashIndicator(seconds > 0 ? 'fa-forward' : 'fa-backward');
    this.updateTimeDisplay();
    if (this.resetAutoHideTimer) this.resetAutoHideTimer();
    window.showToast(seconds > 0 ? `⏩ +${seconds}s` : `⏪ ${seconds}s`, "info");
  }

  updatePlayPauseButton() {
    const icon = document.getElementById('playPauseIcon');
    if (icon) {
      icon.className = this.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }
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
    const params = this.getEmbedParams();

    if (parsed) {
      if (parsed.type === 'playlist') {
        this.currentPlaylistId = parsed.id;
        embedUrl = `${BASE}/videoseries?list=${parsed.id}&${params}&index=${lectureIndex}`;
        rawWatchUrl = `https://www.youtube.com/playlist?list=${parsed.id}`;
      } else {
        this.currentPlaylistId = null;
        const listParam = parsed.playlistId ? `&list=${parsed.playlistId}` : '';
        embedUrl = `${BASE}/${parsed.id}?${params}${listParam}`;
        rawWatchUrl = parsed.playlistId
          ? `https://www.youtube.com/watch?v=${parsed.id}&list=${parsed.playlistId}`
          : `https://www.youtube.com/watch?v=${parsed.id}`;
      }
    } else {
      this.currentPlaylistId = null;
      embedUrl = `${BASE}/${video.youtubeId}?${params}`;
    }

    // Show iframe, hide placeholder
    if (this.videoPlaceholder) this.videoPlaceholder.style.display = 'none';

    // Use real YT API if ready, otherwise store as pending for when API loads
    if (this.ytPlayer && this.ytPlayerReady) {
      this._loadUrlIntoPlayer(embedUrl);
    } else if (this.ytPlayer) {
      // Player created but not yet ready — store and load on onReady
      this.pendingEmbedUrl = embedUrl;
    } else {
      // API not yet loaded at all — set iframe src directly as fallback
      const frame = document.getElementById('videoIframe');
      if (frame) { frame.src = ''; frame.src = embedUrl; }
      this.pendingEmbedUrl = embedUrl;
    }

    // Reset progress display while new video loads
    this.currentTime = 0;
    this.duration = 0;
    const bar = document.getElementById('ytProgressPlayed');
    if (bar) bar.style.width = '0%';
    this.updateTimeDisplay();

    // Reset playing state
    this.isPlaying = true;
    this.updatePlayPauseButton();

    // Enable note editor now that a video is loaded
    const noteEditor = document.getElementById('noteContentInput');
    const noteTimestamp = document.getElementById('noteTimestampInput');
    const noteSave = document.getElementById('btnSaveNote');
    const noteHint = document.getElementById('noteEditorHint');
    if (noteEditor) noteEditor.disabled = false;
    if (noteTimestamp) noteTimestamp.disabled = false;
    if (noteSave) noteSave.disabled = false;
    if (noteHint) noteHint.innerHTML = '<i class="fa-solid fa-circle-info"></i> Auto-tagged with current video title and subject track.';
    const noteEditorCard = document.querySelector('.note-editor-card');
    if (noteEditorCard) noteEditorCard.classList.remove('no-video-loaded');

    // Keep "Open in YouTube" button wired to correct watch URL
    const btnOpenYouTube = document.getElementById('btnOpenYouTube');
    if (btnOpenYouTube) {
      btnOpenYouTube.onclick = () => window.open(rawWatchUrl, '_blank', 'noopener,noreferrer');
    }

    // Update metadata titles and badges
    if (this.videoTitleElem) this.videoTitleElem.textContent = video.title;
    const chapterTitleElem = document.getElementById('ytChapterTitle');
    if (chapterTitleElem) {
      chapterTitleElem.textContent = video.title ? (video.title.length > 28 ? video.title.substring(0, 28) + '...' : video.title) : "Lecture View";
    }
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
    if (this.resetAutoHideTimer) this.resetAutoHideTimer();
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
    const params = this.getEmbedParams();
    const embedUrl = `${BASE}/videoseries?list=${this.currentPlaylistId}&${params}&index=${this.currentPlaylistLectureIndex}&autoplay=1&t=${Date.now()}`;

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
