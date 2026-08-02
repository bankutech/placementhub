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
                <div class="playlist-sub-lecture ${isLecActive ? 'active' : ''}" onclick="event.preventDefault(); event.stopPropagation(); window.selectPlaylistLecture('${video.id}', '${video.youtubeId}', ${lec.index}, '${lec.id}', '${lec.title}')">
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

  // 5. Load first video in track if available
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

  // 2. Setup Track Switching Chips
  const trackChips = document.querySelectorAll('.track-chip');
  trackChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const trackId = chip.getAttribute('data-track');
      window.renderTrackView(trackId);
    });
  });

  // 3. Video Player Control Buttons
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

  if (btnPrev) btnPrev.addEventListener('click', () => window.playerController.playPrev());
  if (btnNext) btnNext.addEventListener('click', () => window.playerController.playNext());
  if (btnTheater) btnTheater.addEventListener('click', () => window.playerController.toggleTheaterMode());
  if (btnMark) btnMark.addEventListener('click', () => window.playerController.toggleCurrentWatched());


  // 5. Playlist Sidebar Search Filter
  const playlistSearchInput = document.getElementById('playlistSearchInput');
  if (playlistSearchInput) {
    playlistSearchInput.addEventListener('input', debounce((e) => {
      window.renderPlaylistSidebar(window.appState.currentTrackId, e.target.value.trim());
    }, 300));
  }

  // 6. Global Header Search (Searches across all tracks)
  const headerSearchInput = document.getElementById('headerSearchInput');
  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', debounce((e) => {
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
    }, 500));
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

  // 9. Pre-populate Settings API Key
  const savedKey = localStorage.getItem('placementhub_yt_api_key') || '';
  const ytInput = document.getElementById('ytApiKeyInput');
  if (ytInput) ytInput.value = savedKey;

  // 10. Initial Render
  window.renderTrackView('java');
  window.updateTrackChips();
  window.updateOverallProgress();
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
  
  const BASE = 'https://www.youtube.com/embed';
  let embedUrl = "";
  
  if (videoIdReal && !videoIdReal.startsWith('fallback-')) {
    // Play the exact unique video, loading the playlist queue next to it
    embedUrl = `${BASE}/${videoIdReal}?list=${playlistId}&rel=0&autoplay=1`;
  } else {
    // Fallback if no API key or real ID: use index with cache buster
    embedUrl = `${BASE}/videoseries?list=${playlistId}&rel=0&index=${index}&autoplay=1&t=${Date.now()}`;
  }
  
  if (window.playerController.videoIframe) {
    window.playerController.videoIframe.src = '';
    window.playerController.videoIframe.src = embedUrl;
  }
  

  if (window.playerController.videoTitleElem) {
    window.playerController.videoTitleElem.textContent = title;
  }
  
  window.showToast(`Playing Lecture #${index + 1}: ${title.substring(0, 30)}...`, 'info');
  
  // Refresh sidebar to update highlight
  window.renderPlaylistSidebar(window.appState.currentTrackId);
};
