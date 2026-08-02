/* ==========================================================================
   DYNAMIC PLAYLIST & CUSTOM VIDEO MANAGER (LOCALSTORAGE PERSISTENCE)
   ========================================================================== */

class PlaylistManager {
  constructor() {
    this.storageKey = 'placementhub_user_playlists_v4';
  }

  // Initialize tracks data from localStorage or fallback to defaults
  initData() {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Ensure all required default keys exist
        return {
          ...INITIAL_PLACEMENT_DATA,
          ...parsed
        };
      }
    } catch (e) {
      console.error("Failed to load tracks from localStorage, loading defaults:", e);
    }
    return JSON.parse(JSON.stringify(INITIAL_PLACEMENT_DATA));
  }

  // Save current tracks data to localStorage
  saveData(tracksData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tracksData));
    } catch (e) {
      console.error("Failed to save tracks to localStorage:", e);
      window.showToast("Storage quota exceeded or unavailable", "warning");
    }
  }

  // Add a new video/link dynamically
  addVideo(targetTrackId, videoObj) {
    const tracks = window.appState.tracks;
    if (!tracks[targetTrackId]) {
      window.showToast("Selected track does not exist!", "warning");
      return false;
    }

    const parsed = VideoPlayerController.parseYouTubeUrl(videoObj.youtubeUrl);
    if (!parsed) {
      window.showToast("Please enter a valid YouTube video or playlist link!", "warning");
      return false;
    }

    const newVideo = {
      id: `custom-${Date.now()}`,
      title: videoObj.title.trim() || `Placement Lesson - ${parsed.id}`,
      youtubeId: parsed.id,
      youtubeUrl: videoObj.youtubeUrl.trim(),
      duration: videoObj.duration || "Self Paced",
      level: videoObj.level || "Placement Ready",
      category: videoObj.category || "Custom Placement Material",
      description: videoObj.description.trim() || "Custom added placement learning video."
    };

    tracks[targetTrackId].videos.push(newVideo);
    this.saveData(tracks);

    // Refresh UI
    window.renderPlaylistSidebar(targetTrackId);
    window.updateTrackChips();
    window.updateOverallProgress();

    window.showToast(`✅ Added "${newVideo.title}" to ${tracks[targetTrackId].name}!`, "success");
    return newVideo;
  }

  // Delete a video
  deleteVideo(trackId, videoId) {
    const tracks = window.appState.tracks;
    if (!tracks[trackId]) return;

    tracks[trackId].videos = tracks[trackId].videos.filter(v => v.id !== videoId);
    this.saveData(tracks);

    window.renderPlaylistSidebar(trackId);
    window.updateTrackChips();
    window.updateOverallProgress();
    window.showToast("Video removed from playlist", "info");

    // If current video was deleted, load the first available one
    if (window.playerController.currentTrackId === trackId && tracks[trackId].videos.length > 0) {
      window.playerController.loadVideo(tracks[trackId].videos[0], trackId, 0);
    } else if (tracks[trackId].videos.length === 0) {
      window.playerController.showPlaceholder("Playlist Empty", "Click '+ Add Video / Playlist' to add custom video links.");
    }
  }

  // Reset to original curated default curriculum
  resetToDefaults() {
    if (confirm("Are you sure you want to reset all tracks to original defaults? Any custom added videos will be restored.")) {
      localStorage.removeItem(this.storageKey);
      window.appState.tracks = JSON.parse(JSON.stringify(INITIAL_PLACEMENT_DATA));
      this.saveData(window.appState.tracks);
      
      window.renderTrackView(window.appState.currentTrackId);
      window.updateTrackChips();
      window.updateOverallProgress();
      window.showToast("✨ Restored original placement curriculum!", "success");
    }
  }

  // Export Playlist as JSON
  exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.appState.tracks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "placementhub_playlists_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    window.showToast("📥 Playlists exported successfully!", "success");
  }

  // Import Playlist from JSON
  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        window.appState.tracks = parsed;
        this.saveData(parsed);
        window.renderTrackView(window.appState.currentTrackId);
        window.updateTrackChips();
        window.updateOverallProgress();
        window.showToast("📤 Playlists imported successfully!", "success");
        return true;
      }
    } catch (e) {
      window.showToast("Invalid JSON file format!", "warning");
    }
    return false;
  }
}

window.PlaylistManager = PlaylistManager;
