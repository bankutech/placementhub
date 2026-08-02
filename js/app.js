/* ==========================================================================
   PLACEMENT LEARNING PORTAL - MASTER APPLICATION CONTROLLER
   ========================================================================== */

// Global State
window.appState = {
  tracks: {},
  currentTrackId: 'java',
  searchQuery: ''
};

// Global Toast Dispatcher
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const iconMap = {
    success: 'fa-solid fa-circle-check',
    info: 'fa-solid fa-circle-info',
    warning: 'fa-solid fa-triangle-exclamation'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="${iconMap[type] || iconMap.info}"></i>
    <div class="toast-message">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOutToast 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Switch Toolkit Sub-Tabs (Overview, Sandbox, Notes, Interview)
window.switchToolkitTab = function(tabId) {
  const tabBtns = document.querySelectorAll('.toolkit-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  tabPanes.forEach(pane => {
    if (pane.id === tabId) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });
};

// ----------------------------------------------------------------------------
// Render Playlist Sidebar
// ----------------------------------------------------------------------------
window.renderPlaylistSidebar = function(trackId, filterText = '') {
  const track = window.appState.tracks[trackId];
  const container = document.getElementById('playlistItemsContainer');
  const countChip = document.getElementById('playlistCountChip');

  if (!track || !container) return;

  const videos = track.videos || [];
  const filtered = filterText ? 
    videos.filter(v => v.title.toLowerCase().includes(filterText.toLowerCase()) || (v.category && v.category.toLowerCase().includes(filterText.toLowerCase())))
    : videos;

  if (countChip) {
    countChip.textContent = `${videos.length} Lectures`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="playlist-empty-state">
        <i class="fa-solid fa-video-slash"></i>
        <p>${videos.length === 0 ? "No videos in this track yet." : "No videos match your search."}</p>
        <button class="btn btn-secondary btn-sm" onclick="window.openAddVideoModal('${trackId}')">
          <i class="fa-solid fa-plus"></i> Add Video Link
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((video, idx) => {
    const isWatched = window.playerController.watchedVideos.has(video.id);
    const isCustom = video.id.startsWith('custom-');

    // Detect if this is a playlist ID (not a standard 11-char video ID)
    const isPlaylist = video.youtubeId && video.youtubeId.length > 11;
    // For playlists we can't get a direct thumbnail from YouTube without an API key
    // Use a styled fallback instead
    const thumbUrl = isPlaylist
      ? `https://img.youtube.com/vi/0/mqdefault.jpg`  // generic fallback
      : `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;

    return `
      <div class="playlist-item" data-video-id="${video.id}" onclick="window.selectVideo('${trackId}', '${video.id}')">
        <div class="playlist-item-index">${idx + 1}</div>
        <div class="playlist-item-thumbnail${isPlaylist ? ' is-playlist' : ''}">
          ${isPlaylist
            ? `<div class="playlist-thumb-fallback"><i class="fa-solid fa-list-ul"></i></div>`
            : `<img src="${thumbUrl}" onerror="this.src=''" alt="Thumbnail" />`
          }
          <div class="play-icon-hover"><i class="fa-solid fa-${isPlaylist ? 'list-ul' : 'play'}"></i></div>
        </div>
        <div class="playlist-item-content">
          <div class="playlist-item-title" title="${video.title}">${video.title}</div>
          <div class="playlist-item-meta">
            <span><i class="fa-regular fa-clock"></i> ${video.duration || 'Full Video'}</span>
            <span>•</span>
            <span style="color: var(--accent-secondary);">${video.category || 'Module'}</span>
            ${isPlaylist ? `<span class="badge-playlist-pill"><i class="fa-solid fa-list-ul"></i> Playlist</span>` : ''}
          </div>
        </div>
        <div class="playlist-item-actions" style="display: flex; align-items: center; gap: 0.35rem; margin-left: 0.25rem;">
          <a href="${video.youtubeUrl || (isPlaylist ? 'https://www.youtube.com/playlist?list=' + video.youtubeId : 'https://www.youtube.com/watch?v=' + video.youtubeId)}" target="_blank" rel="noopener noreferrer" class="btn-ctrl" style="padding: 0.25rem 0.45rem; font-size: 0.75rem; border-radius: 6px;" title="Open directly in YouTube" onclick="event.stopPropagation()">
            <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
          <div class="playlist-item-check" title="${isWatched ? 'Mark as unwatched' : 'Mark as completed'}" onclick="event.stopPropagation(); window.playerController.toggleVideoWatched('${video.id}')">
            <i class="${isWatched ? 'fa-solid fa-circle-check checked' : 'fa-regular fa-circle'}"></i>
          </div>
          ${isCustom ? `
            <button class="btn-delete-note" onclick="event.stopPropagation(); window.playlistManager.deleteVideo('${trackId}', '${video.id}')" title="Delete custom video">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  window.playerController.highlightActivePlaylistItem();
};

// ----------------------------------------------------------------------------
// Switch Active Video In-Place
// ----------------------------------------------------------------------------
window.selectVideo = function(trackId, videoId) {
  const track = window.appState.tracks[trackId];
  if (!track) return;

  const index = track.videos.findIndex(v => v.id === videoId);
  if (index !== -1) {
    window.playerController.loadVideo(track.videos[index], trackId, index);
  }
};

// ----------------------------------------------------------------------------
// Render Subject Track View
// ----------------------------------------------------------------------------
window.renderTrackView = function(trackId) {
  const track = window.appState.tracks[trackId];
  if (!track) return;

  window.appState.currentTrackId = trackId;

  // 1. Update Track Banner
  const banner = document.getElementById('trackBanner');
  const heading = document.getElementById('trackHeading');
  const desc = document.getElementById('trackDesc');
  const progressFill = document.getElementById('trackProgressFill');
  const progressText = document.getElementById('trackProgressText');

  if (banner) banner.className = `track-banner track-${trackId}`;
  if (heading) heading.innerHTML = `<i class="${track.icon}"></i> ${track.name}`;
  if (desc) desc.textContent = track.description;

  // 2. Update Track Chips Active State
  const chips = document.querySelectorAll('.track-chip');
  chips.forEach(chip => {
    if (chip.getAttribute('data-track') === trackId) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  // 3. Render Playlist Sidebar
  window.renderPlaylistSidebar(trackId);

  // 4. Render Roadmap Timeline in Overview Pane
  const timeline = document.getElementById('roadmapTimeline');
  if (timeline) {
    timeline.innerHTML = (track.roadmap || []).map(step => `
      <div class="roadmap-step">
        <div class="roadmap-step-title">Phase ${step.step}: ${step.title}</div>
        <div class="roadmap-step-desc">${step.desc}</div>
      </div>
    `).join('');
  }

  // 5. Update Code Sandbox language to match track
  if (window.codeSandbox) {
    if (trackId === 'java' || trackId === 'cpp' || trackId === 'c' || trackId === 'python') {
      window.codeSandbox.setLanguage(trackId);
    }
  }

  // 6. Update Interview Prep language filter
  if (window.interviewPrepManager) {
    window.interviewPrepManager.setLanguageFilter(trackId === 'custom' ? 'all' : trackId);
  }

  // 7. Load first video in track if available
  if (track.videos && track.videos.length > 0) {
    window.playerController.loadVideo(track.videos[0], trackId, 0);
  } else {
    window.playerController.showPlaceholder("No Videos Available", "Click '+ Add Video / Playlist' to add your custom YouTube learning links.");
  }

  window.updateOverallProgress();
};

// ----------------------------------------------------------------------------
// Update Stats and Track Progress
// ----------------------------------------------------------------------------
window.updateOverallProgress = function() {
  const tracks = window.appState.tracks;
  let totalVideos = 0;
  let watchedTotal = 0;

  Object.keys(tracks).forEach(tKey => {
    const tVideos = tracks[tKey].videos || [];
    totalVideos += tVideos.length;
    tVideos.forEach(v => {
      if (window.playerController.watchedVideos.has(v.id)) {
        watchedTotal++;
      }
    });
  });

  // Calculate current track progress
  const currentTrack = tracks[window.appState.currentTrackId];
  if (currentTrack && currentTrack.videos) {
    const cTotal = currentTrack.videos.length;
    let cWatched = 0;
    currentTrack.videos.forEach(v => {
      if (window.playerController.watchedVideos.has(v.id)) cWatched++;
    });

    const cPercent = cTotal > 0 ? Math.round((cWatched / cTotal) * 100) : 0;
    const progressFill = document.getElementById('trackProgressFill');
    const progressText = document.getElementById('trackProgressText');
    if (progressFill) progressFill.style.width = `${cPercent}%`;
    if (progressText) progressText.textContent = `${cWatched}/${cTotal} Completed (${cPercent}%)`;
  }

  // Global Quick Stat in Navbar
  const totalWatchedStat = document.getElementById('totalWatchedStat');
  const streakDaysStat = document.getElementById('streakDaysStat');
  if (totalWatchedStat) {
    totalWatchedStat.textContent = `${watchedTotal}/${totalVideos} Lessons`;
  }
};

window.updateTrackChips = function() {
  const tracks = window.appState.tracks;
  Object.keys(tracks).forEach(tKey => {
    const badge = document.querySelector(`.track-chip[data-track="${tKey}"] .track-badge`);
    if (badge) {
      badge.textContent = `${tracks[tKey].videos ? tracks[tKey].videos.length : 0}`;
    }
  });
};

// ----------------------------------------------------------------------------
// Modal Controllers
// ----------------------------------------------------------------------------
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
};

window.openAddVideoModal = function(trackId = null) {
  if (trackId) {
    const select = document.getElementById('modalVideoTrackSelect');
    if (select) select.value = trackId;
  }
  window.openModal('addVideoModal');
};

// ----------------------------------------------------------------------------
// DOM Ready Application Bootstrap
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // 1. Init Managers
  window.playlistManager = new PlaylistManager();
  window.appState.tracks = window.playlistManager.initData();

  window.playerController = new VideoPlayerController();
  window.codeSandbox = new CodeSandbox();
  window.notesManager = new NotesManager();
  window.interviewPrepManager = new InterviewPrepManager();

  // 2. Setup Track Switching Chips
  const trackChips = document.querySelectorAll('.track-chip');
  trackChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const trackId = chip.getAttribute('data-track');
      window.renderTrackView(trackId);
    });
  });

  // 3. Setup Toolkit Tabs
  const toolkitTabBtns = document.querySelectorAll('.toolkit-tab-btn');
  toolkitTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      window.switchToolkitTab(btn.getAttribute('data-tab'));
    });
  });

  // 4. Video Player Control Buttons
  const btnPrev = document.getElementById('btnPrevVideo');
  const btnNext = document.getElementById('btnNextVideo');
  const btnTheater = document.getElementById('btnTheaterMode');
  const btnMark = document.getElementById('btnMarkWatched');

  if (btnPrev) btnPrev.addEventListener('click', () => window.playerController.playPrev());
  if (btnNext) btnNext.addEventListener('click', () => window.playerController.playNext());
  if (btnTheater) btnTheater.addEventListener('click', () => window.playerController.toggleTheaterMode());
  if (btnMark) btnMark.addEventListener('click', () => window.playerController.toggleCurrentWatched());

  // 5. Playlist Sidebar Search Filter
  const playlistSearchInput = document.getElementById('playlistSearchInput');
  if (playlistSearchInput) {
    playlistSearchInput.addEventListener('input', (e) => {
      window.renderPlaylistSidebar(window.appState.currentTrackId, e.target.value.trim());
    });
  }

  // 6. Global Header Search (Searches across all tracks)
  const headerSearchInput = document.getElementById('headerSearchInput');
  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;

      // Find first track that contains matching video
      for (const [tId, tData] of Object.entries(window.appState.tracks)) {
        const found = (tData.videos || []).find(v => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q));
        if (found) {
          window.renderTrackView(tId);
          window.selectVideo(tId, found.id);
          break;
        }
      }
    });
  }

  // 7. Add Custom Video Form Submit
  const addVideoForm = document.getElementById('addVideoForm');
  if (addVideoForm) {
    addVideoForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const url = document.getElementById('modalVideoUrl').value;
      const title = document.getElementById('modalVideoTitle').value;
      const trackId = document.getElementById('modalVideoTrackSelect').value;
      const level = document.getElementById('modalVideoLevelSelect').value;
      const category = document.getElementById('modalVideoCategory').value;
      const desc = document.getElementById('modalVideoDesc').value;

      const added = window.playlistManager.addVideo(trackId, {
        youtubeUrl: url,
        title: title,
        level: level,
        category: category,
        description: desc
      });

      if (added) {
        addVideoForm.reset();
        window.closeModal('addVideoModal');
        // Switch to that track and load the newly added video
        window.renderTrackView(trackId);
        window.selectVideo(trackId, added.id);
      }
    });
  }

  // 8. Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Avoid interfering when typing in inputs/textareas
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === 'n' || e.key === 'N') {
      window.playerController.playNext();
    } else if (e.key === 'p' || e.key === 'P') {
      window.playerController.playPrev();
    } else if (e.key === 'm' || e.key === 'M') {
      window.playerController.toggleCurrentWatched();
    } else if (e.key === 't' || e.key === 'T') {
      window.playerController.toggleTheaterMode();
    }
  });

  // 9. Initial Render
  window.renderTrackView('java');
  window.updateTrackChips();
  window.updateOverallProgress();
  window.showToast("🚀 Welcome to PlacementHub! Ready to crack your placement interviews.", "success");
});
