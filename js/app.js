/* ==========================================================================
   PLACEMENT LEARNING PORTAL - MASTER APPLICATION CONTROLLER
   ========================================================================== */

// Global State
window.appState = {
  tracks: {},
  currentTrackId: 'java',
  searchQuery: '',
  playlistItemsCache: {}
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

  // Calculate accurate syllabus items count including sub-lectures and pluralization
  let totalLectures = 0;
  if (filterText) {
    let matchedSub = 0;
    videos.forEach((v, idx) => {
      const isActive = (window.playerController.currentTrackId === trackId && window.playerController.currentVideoIndex === idx);
      const isPlaylist = v.youtubeId && v.youtubeId.length > 11;
      if (isActive && isPlaylist) {
        const cached = window.appState.playlistItemsCache[v.youtubeId];
        if (Array.isArray(cached)) {
          matchedSub += cached.filter(c => c.title.toLowerCase().includes(filterText.toLowerCase())).length;
        }
      }
    });
    totalLectures = filtered.length + matchedSub;
  } else {
    let hasExpandedSubLectures = false;
    let subCount = 0;
    videos.forEach((v, idx) => {
      const isActive = (window.playerController.currentTrackId === trackId && window.playerController.currentVideoIndex === idx);
      const isPlaylist = v.youtubeId && v.youtubeId.length > 11;
      if (isActive && isPlaylist) {
        const cached = window.appState.playlistItemsCache[v.youtubeId];
        if (Array.isArray(cached) && cached.length > 0) {
          hasExpandedSubLectures = true;
          subCount += cached.length;
        }
      }
    });

    if (hasExpandedSubLectures && videos.length === 1) {
      totalLectures = subCount;
    } else if (hasExpandedSubLectures && videos.length > 1) {
      totalLectures = (videos.length - 1) + subCount;
    } else {
      totalLectures = videos.length;
    }
  }

  if (countChip) {
    countChip.textContent = totalLectures === 1 ? '1 Lecture' : `${totalLectures} Lectures`;
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

    const isActive = (window.playerController.currentTrackId === trackId && window.playerController.currentVideoIndex === idx);

    let nestedLecturesHtml = '';
    if (isActive && isPlaylist) {
      const cached = window.appState.playlistItemsCache[video.youtubeId];
      if (cached && cached !== 'loading') {
        const currentLecIndex = window.playerController.currentPlaylistLectureIndex || 0;
        const filteredLec = filterText ? cached.filter(c => c.title.toLowerCase().includes(filterText.toLowerCase())) : cached;
        nestedLecturesHtml = `
          <div class="playlist-sub-lectures-container">
            ${filteredLec.map(lec => {
              const isLecActive = (currentLecIndex === lec.index);
              return `
                <div class="playlist-sub-lecture ${isLecActive ? 'active' : ''}" onclick="event.preventDefault(); event.stopPropagation(); window.selectPlaylistLecture('${video.id}', '${video.youtubeId}', ${lec.index}, '${lec.id}', ${JSON.stringify(lec.title).replace(/"/g, '&quot;')})">
                  <div class="playlist-sub-lecture-thumb">
                    <img src="${lec.thumbnail}" alt="" />
                  </div>
                  <div class="playlist-sub-lecture-info">
                    <span class="sub-lecture-title">${lec.title}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      } else {
        nestedLecturesHtml = `
          <div class="playlist-sub-lectures-container loading-state">
            <div class="sidebar-loader" style="padding: 0.75rem; text-align: center; color: var(--text-secondary); font-size: 0.8rem;">
              <i class="fa-solid fa-circle-notch fa-spin" style="color: var(--accent-secondary); margin-right: 0.4rem;"></i> Loading Udemy-style lectures...
            </div>
          </div>
        `;
        // Trigger background load only if not currently loading
        if (cached !== 'loading') {
          window.loadPlaylistItems(video.youtubeId, trackId);
        }
      }
    }

    return `
      <div class="playlist-item-wrapper ${isActive ? 'is-active' : ''}">
        <div class="playlist-item" data-video-id="${video.id}" onclick="event.preventDefault(); window.selectVideo('${trackId}', '${video.id}')">
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
        ${nestedLecturesHtml}
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

  // Refresh timestamped notes for this video
  if (window.notesManager) {
    window.notesManager.renderNotes();
  }
};

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// Side Navigation Drawer Controller ("Sideview Plane")
// ----------------------------------------------------------------------------
window.toggleSideNav = function(forceState) {
  const drawer = document.getElementById('sideNavDrawer');
  const backdrop = document.getElementById('sideNavBackdrop');
  if (!drawer || !backdrop) return;

  const shouldOpen = typeof forceState === 'boolean' 
    ? forceState 
    : !drawer.classList.contains('open');

  if (shouldOpen) {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.classList.add('side-nav-open');
  } else {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.classList.remove('side-nav-open');
  }
};

window.switchToolkitTab = function(tabId) {
  const btn = document.querySelector(`.toolkit-tab-btn[data-tab="${tabId}"]`);
  if (btn) {
    btn.click();
    const section = document.querySelector('.toolkit-tabs-container');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

// ----------------------------------------------------------------------------
// Render Subject Track View
// ----------------------------------------------------------------------------
window.renderTrackView = function(trackId) {
  const track = window.appState.tracks[trackId];
  if (!track) return;

  window.appState.currentTrackId = trackId;

  // 1. Update Track Chips Active State across both Top Bar & Sideview Plane
  const chips = document.querySelectorAll('.track-chip');
  chips.forEach(chip => {
    if (chip.getAttribute('data-track') === trackId) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  // 2. Update Side Navigation & Mobile Active Track Labels
  const sideNavTrackName = document.getElementById('sideNavCurrentTrackName');
  if (sideNavTrackName) {
    sideNavTrackName.textContent = track.name || trackId;
  }
  const mobileActiveTrackName = document.getElementById('mobileActiveTrackName');
  if (mobileActiveTrackName) {
    mobileActiveTrackName.textContent = track.name || trackId;
  }

  // Auto-close side drawer on smaller viewports when a track is clicked
  if (window.innerWidth <= 1024) {
    window.toggleSideNav(false);
  }

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

  // 5. Load first video in track if available
  if (track.videos && track.videos.length > 0) {
    window.playerController.loadVideo(track.videos[0], trackId, 0);
  } else {
    window.playerController.showPlaceholder("No Videos Available", "Click '+ Add Video / Playlist' to add your custom YouTube learning links.");
  }

  // 6. Refresh Notes Notebook for current track/video
  if (window.notesManager) {
    window.notesManager.renderNotes();
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
};

window.updateTrackChips = function() {
  const tracks = window.appState.tracks;
  Object.keys(tracks).forEach(tKey => {
    const badges = document.querySelectorAll(`.track-chip[data-track="${tKey}"] .track-badge`);
    badges.forEach(badge => {
      badge.textContent = `${tracks[tKey].videos ? tracks[tKey].videos.length : 0}`;
    });
  });
  // Update My Playlists badge with real count from localStorage
  const customBadges = document.querySelectorAll('.track-chip[data-track="custom"] .track-badge');
  const customVideos = (tracks['custom'] && tracks['custom'].videos) ? tracks['custom'].videos.length : 0;
  customBadges.forEach(badge => {
    badge.textContent = customVideos;
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
  // 1. Init Core Managers
  window.playlistManager = new PlaylistManager();
  window.appState.tracks = window.playlistManager.initData();

  window.playerController = new VideoPlayerController();
  window.notesManager = new NotesManager();
  window.practiceManager = new PracticeManager();
  window.pomodoroController = new PomodoroController();

  // 2. Setup Track Switching Chips (Top Bar + Sideview Plane)
  const trackChips = document.querySelectorAll('.track-chip');
  trackChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const trackId = chip.getAttribute('data-track');
      window.renderTrackView(trackId);
    });
  });

  // Close Side Nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.toggleSideNav(false);
    }
  });

  // 3. Video Player Control Buttons
  const btnTogglePlay = document.getElementById('btnTogglePlay');
  const btnRewind10 = document.getElementById('btnRewind10');
  const btnForward10 = document.getElementById('btnForward10');
  const btnPrev = document.getElementById('btnPrevVideo');
  const btnNext = document.getElementById('btnNextVideo');
  const btnTheater = document.getElementById('btnTheaterMode');
  const btnMark = document.getElementById('btnMarkWatched');

  // Utility Debounce for search inputs
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  if (btnTogglePlay) btnTogglePlay.addEventListener('click', () => window.playerController.togglePlay());
  if (btnRewind10) btnRewind10.addEventListener('click', () => window.playerController.seekRelative(-10));
  if (btnForward10) btnForward10.addEventListener('click', () => window.playerController.seekRelative(10));
  if (btnPrev) btnPrev.addEventListener('click', () => window.playerController.playPrev());
  if (btnNext) btnNext.addEventListener('click', () => window.playerController.playNext());
  if (btnTheater) btnTheater.addEventListener('click', () => window.playerController.toggleTheaterMode());
  if (btnMark) btnMark.addEventListener('click', () => window.playerController.toggleCurrentWatched());

  // 4. Toolkit Sub-Tabs Switching
  const toolkitTabBtns = document.querySelectorAll('.toolkit-tab-btn');
  const toolkitPanes = document.querySelectorAll('.toolkit-tabs-container .tab-pane');

  toolkitTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      toolkitTabBtns.forEach(b => b.classList.remove('active'));
      toolkitPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');

      if (targetId === 'tab-notes') {
        window.notesManager.renderNotes();
      } else if (targetId === 'tab-practice') {
        window.practiceManager.renderProblems();
      }
    });
  });

  // 5. Notes Notebook Listeners
  const btnSaveNote = document.getElementById('btnSaveNote');
  const noteContentInput = document.getElementById('noteContentInput');
  const noteTimestampInput = document.getElementById('noteTimestampInput');
  const btnStampTime = document.getElementById('btnStampCurrentTime');

  // Wire up "Stamp Current Time" button to read real YT playback time
  if (btnStampTime) {
    btnStampTime.addEventListener('click', () => {
      try {
        const pc = window.playerController;
        let ts = '0:00';
        if (pc && pc.ytPlayer && pc.ytPlayerReady && pc.ytPlayer.getCurrentTime) {
          const secs = Math.floor(pc.ytPlayer.getCurrentTime());
          const m = Math.floor(secs / 60);
          const s = secs % 60;
          ts = `${m}:${s < 10 ? '0' : ''}${s}`;
        } else if (pc && pc.currentTime) {
          const secs = Math.floor(pc.currentTime);
          const m = Math.floor(secs / 60);
          const s = secs % 60;
          ts = `${m}:${s < 10 ? '0' : ''}${s}`;
        }
        if (noteTimestampInput) noteTimestampInput.value = ts;
      } catch (e) {}
    });
  }

  const handleSaveNote = () => {
    const text = noteContentInput ? noteContentInput.value : '';
    const ts = noteTimestampInput ? noteTimestampInput.value : '';
    if (window.notesManager.addNote(text, ts)) {
      if (noteContentInput) noteContentInput.value = '';
      if (noteTimestampInput) noteTimestampInput.value = '';
    }
  };

  if (btnSaveNote) btnSaveNote.addEventListener('click', handleSaveNote);

  if (noteContentInput) {
    noteContentInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSaveNote();
      }
    });
  }

  // Notes filter pills
  const notePills = document.querySelectorAll('.notes-filter-pill');
  notePills.forEach(pill => {
    pill.addEventListener('click', () => {
      notePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      window.notesManager.currentFilter = pill.getAttribute('data-filter');
      window.notesManager.renderNotes();
    });
  });

  // Notes search input
  const notesSearchInput = document.getElementById('notesSearchInput');
  if (notesSearchInput) {
    notesSearchInput.addEventListener('input', debounce((e) => {
      window.notesManager.searchQuery = e.target.value.trim();
      window.notesManager.renderNotes();
    }, 250));
  }

  // 6. Practice Problems Listeners
  const topicFilter = document.getElementById('practiceTopicFilter');
  const diffFilter = document.getElementById('practiceDifficultyFilter');
  const platFilter = document.getElementById('practicePlatformFilter');
  const practiceSearch = document.getElementById('practiceSearchInput');

  if (topicFilter) {
    topicFilter.addEventListener('change', (e) => {
      window.practiceManager.currentTopic = e.target.value;
      window.practiceManager.renderProblems();
    });
  }
  if (diffFilter) {
    diffFilter.addEventListener('change', (e) => {
      window.practiceManager.currentDifficulty = e.target.value;
      window.practiceManager.renderProblems();
    });
  }
  if (platFilter) {
    platFilter.addEventListener('change', (e) => {
      window.practiceManager.currentPlatform = e.target.value;
      window.practiceManager.renderProblems();
    });
  }
  if (practiceSearch) {
    practiceSearch.addEventListener('input', debounce((e) => {
      window.practiceManager.searchQuery = e.target.value.trim();
      window.practiceManager.renderProblems();
    }, 250));
  }

  // 7. Playlist Sidebar Search Filter
  const playlistSearchInput = document.getElementById('playlistSearchInput');
  if (playlistSearchInput) {
    playlistSearchInput.addEventListener('input', debounce((e) => {
      window.renderPlaylistSidebar(window.appState.currentTrackId, e.target.value.trim());
    }, 300));
  }

  // 8. Global Header Search (Searches across all tracks - Desktop & Mobile)
  const handleGlobalSearch = debounce((query) => {
    const q = query.toLowerCase().trim();
    if (!q) return;

    // Find first track that contains matching video or playlist
    for (const [tId, tData] of Object.entries(window.appState.tracks)) {
      const found = (tData.videos || []).find(v => 
        (v.title && v.title.toLowerCase().includes(q)) || 
        (v.category && v.category.toLowerCase().includes(q)) ||
        (v.description && v.description.toLowerCase().includes(q))
      );
      if (found) {
        window.renderTrackView(tId);
        window.selectVideo(tId, found.id);
        break;
      }
    }
  }, 400);

  const headerSearchInput = document.getElementById('headerSearchInput');
  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', (e) => handleGlobalSearch(e.target.value));
  }

  // 9. Add Custom Video Form Submit
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

  // 10. Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Avoid interfering when typing in inputs/textareas
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
      e.preventDefault();
      window.playerController.togglePlay();
    } else if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowLeft') {
      e.preventDefault();
      window.playerController.seekRelative(-10);
    } else if (e.key === 'l' || e.key === 'L' || e.key === 'ArrowRight') {
      e.preventDefault();
      window.playerController.seekRelative(10);
    } else if (e.key === 'n' || e.key === 'N') {
      window.playerController.playNext();
    } else if (e.key === 'p' || e.key === 'P') {
      window.playerController.playPrev();
    } else if (e.key === 'm' || e.key === 'M') {
      window.playerController.toggleCurrentWatched();
    } else if (e.key === 't' || e.key === 'T') {
      window.playerController.toggleTheaterMode();
    }
  });

  // 11. Pre-populate Settings API Key
  const savedKey = localStorage.getItem('placementhub_yt_api_key') || '';
  const ytInput = document.getElementById('ytApiKeyInput');
  if (ytInput) ytInput.value = savedKey;

  // 12. Initial Render
  window.renderTrackView('java');
  window.updateTrackChips();
  window.updateOverallProgress();
  window.notesManager.renderNotes();
  window.practiceManager.renderProblems();
  window.pomodoroController.updateUI();

  window.showToast("🚀 Welcome to PlacementHub! Ready to crack your placement interviews.", "success");
});

// ----------------------------------------------------------------------------
// Settings & YouTube API Settings Handler
// ----------------------------------------------------------------------------
window.saveSettings = function() {
  const key = document.getElementById('ytApiKeyInput').value.trim();
  localStorage.setItem('placementhub_yt_api_key', key);
  window.showToast("API key settings saved successfully! 💾", "success");
  window.closeModal('settingsModal');
  
  // Clear playlist cache to force fresh pull
  window.appState.playlistItemsCache = {};
  window.renderPlaylistSidebar(window.appState.currentTrackId);
};

// ----------------------------------------------------------------------------
// Async Playlist Items Fetcher (YouTube API v3 or local fallback)
// ----------------------------------------------------------------------------
window.loadPlaylistItems = async function(playlistId, trackId) {
  if (window.appState.playlistItemsCache[playlistId]) return;

  // Mark as loading immediately to block parallel duplicate fetch triggers
  window.appState.playlistItemsCache[playlistId] = 'loading';

  const apiKey = localStorage.getItem('placementhub_yt_api_key') || 'AIzaSyB0Fv95z1wTMFKfAMCSMuNg8RsvQirFcXE';
  
  if (apiKey) {
    try {
      let allItems = [];
      let nextPageToken = '';
      let pagesToFetch = 2; // Fetch up to 100 items (50 per page)
      
      for (let page = 0; page < pagesToFetch; page++) {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}${nextPageToken ? '&pageToken=' + nextPageToken : ''}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`YouTube API returned HTTP status ${res.status}`);
        }
        const data = await res.json();
        if (data.items) {
          allItems.push(...data.items);
        }
        nextPageToken = data.nextPageToken;
        if (!nextPageToken) break;
      }

      const mapped = allItems.map((item, index) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title || `Lecture #${index + 1}`,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || 'https://img.youtube.com/vi/0/mqdefault.jpg',
        index: index
      }));

      window.appState.playlistItemsCache[playlistId] = mapped;
      window.renderPlaylistSidebar(trackId);
      return;
    } catch (err) {
      console.warn("YouTube API call failed, falling back to mock builder:", err);
    }
  }

  // Fallback: If no API key or API fails, build 40 mock lecture cards dynamically
  const fallbackList = Array.from({ length: 40 }).map((_, index) => ({
    id: `fallback-${playlistId}-${index}`,
    title: `Lecture #${index + 1} (Live Playlist Video)`,
    thumbnail: `https://img.youtube.com/vi/0/mqdefault.jpg`,
    index: index
  }));

  window.appState.playlistItemsCache[playlistId] = fallbackList;
  window.renderPlaylistSidebar(trackId);
};

// ----------------------------------------------------------------------------
// Switch between playlist sub-lectures
// ----------------------------------------------------------------------------
window.selectPlaylistLecture = function(parentId, playlistId, index, videoIdReal, title) {
  window.playerController.currentPlaylistLectureIndex = index;
  
  const pc = window.playerController;
  const BASE = 'https://www.youtube.com/embed';
  const params = pc.getEmbedParams();
  let embedUrl = '';
  
  if (videoIdReal && !videoIdReal.startsWith('fallback-')) {
    embedUrl = `${BASE}/${videoIdReal}?list=${playlistId}&${params}&autoplay=1`;
  } else {
    embedUrl = `${BASE}/videoseries?list=${playlistId}&${params}&index=${index}&autoplay=1`;
  }

  // Use real YT API if available, fall back to iframe src
  pc._loadUrlIntoPlayer(embedUrl);

  if (pc.videoTitleElem) {
    pc.videoTitleElem.textContent = title || `Lecture #${index + 1}`;
  }
  
  window.showToast(`▶ Lecture #${index + 1}: ${(title || '').substring(0, 30)}`, 'info');
  
  window.renderPlaylistSidebar(window.appState.currentTrackId);
  if (typeof pc.scrollToActivePlaylistItem === 'function') {
    pc.scrollToActivePlaylistItem();
  }
};

