

import { INITIAL_PLACEMENT_DATA, DEFAULT_VIDEO_IDS } from './data.js';
import { VideoPlayerController } from './player.js';

export class PlaylistManager {
  constructor() {
    this.storageKey = 'placementhub_user_playlists_v6';

    this.deletedDefaultsKey = 'placementhub_deleted_defaults_v6';
  }

  async loadDeletedDefaults() {
    try {
      const data = await localforage.getItem(this.deletedDefaultsKey);
      return new Set(data ? JSON.parse(data) : []);
    } catch (e) {
      console.error("Failed to load deleted-defaults list:", e);
      return new Set();
    }
  }

  async saveDeletedDefaults(deletedSet) {
    try {
      await localforage.setItem(this.deletedDefaultsKey, JSON.stringify(Array.from(deletedSet)));
    } catch (e) {
      console.error("Failed to save deleted-defaults list:", e);
    }
  }

  async initData() {
    const deletedDefaults = await this.loadDeletedDefaults();
    try {
      const savedData = await localforage.getItem(this.storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        const tracks = JSON.parse(JSON.stringify(INITIAL_PLACEMENT_DATA));

        Object.keys(tracks).forEach(tKey => {
          tracks[tKey].videos = tracks[tKey].videos.filter(v => !deletedDefaults.has(v.id));
        });

        Object.keys(parsed).forEach(tKey => {
          if (tracks[tKey] && parsed[tKey].videos) {

            const defaultIds = new Set((INITIAL_PLACEMENT_DATA[tKey] && INITIAL_PLACEMENT_DATA[tKey].videos || []).map(v => v.id));
            const userVideos = parsed[tKey].videos.filter(v => !defaultIds.has(v.id));
            
            tracks[tKey].videos.push(...userVideos);
          }
        });
        return tracks;
      }
    } catch (e) {
      console.error("Failed to load tracks from localStorage, loading defaults:", e);
    }

    const fresh = JSON.parse(JSON.stringify(INITIAL_PLACEMENT_DATA));
    Object.keys(fresh).forEach(tKey => {
      fresh[tKey].videos = fresh[tKey].videos.filter(v => !deletedDefaults.has(v.id));
    });
    return fresh;
  }

  async saveData(tracksData) {
    try {
      await localforage.setItem(this.storageKey, JSON.stringify(tracksData));
    } catch (e) {
      console.error("Failed to save tracks to localforage:", e);
      window.showToast("Storage quota exceeded or unavailable", "warning");
    }
  }

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

    window.renderPlaylistSidebar(targetTrackId);
    window.updateTrackChips();
    window.updateOverallProgress();

    window.showToast(`✅ Added "${newVideo.title}" to ${tracks[targetTrackId].name}!`, "success");
    return newVideo;
  }

  deleteVideo(trackId, videoId) {
    const tracks = window.appState.tracks;
    if (!tracks[trackId]) return;

    if (DEFAULT_VIDEO_IDS.has(videoId)) {
      this.loadDeletedDefaults().then(deletedDefaults => {
        deletedDefaults.add(videoId);
        this.saveDeletedDefaults(deletedDefaults);
      });
    }

    tracks[trackId].videos = tracks[trackId].videos.filter(v => v.id !== videoId);
    this.saveData(tracks);

    window.renderPlaylistSidebar(trackId);
    window.updateTrackChips();
    window.updateOverallProgress();
    window.showToast("Video removed from playlist", "info");

    if (window.playerController.currentTrackId === trackId && tracks[trackId].videos.length > 0) {
      window.playerController.loadVideo(tracks[trackId].videos[0], trackId, 0);
    } else if (tracks[trackId].videos.length === 0) {
      window.playerController.showPlaceholder("Playlist Empty", "Click '+ Add Video / Playlist' to add custom video links.");
    }
  }

  resetToDefaults() {
    if (confirm("Are you sure you want to reset all tracks to original defaults? Any custom added videos will be restored.")) {
      localforage.removeItem(this.storageKey);
      localforage.removeItem(this.deletedDefaultsKey);
      window.appState.tracks = JSON.parse(JSON.stringify(INITIAL_PLACEMENT_DATA));
      this.saveData(window.appState.tracks);
      
      window.renderTrackView(window.appState.currentTrackId);
      window.updateTrackChips();
      window.updateOverallProgress();
      window.showToast("✨ Restored original placement curriculum!", "success");
    }
  }

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

  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const looksValid = parsed && typeof parsed === 'object' && !Array.isArray(parsed) &&
        Object.values(parsed).every(track => track && Array.isArray(track.videos));

      if (!looksValid) {
        window.showToast("That file doesn't look like a PlacementHub backup.", "warning");
        return false;
      }

      window.appState.tracks = parsed;
      localforage.removeItem(this.deletedDefaultsKey); 
      this.saveData(parsed);
      window.renderTrackView(window.appState.currentTrackId);
      window.updateTrackChips();
      window.updateOverallProgress();
      window.showToast("📤 Playlists imported successfully!", "success");
      return true;
    } catch (e) {
      window.showToast("Invalid JSON file format!", "warning");
    }
    return false;
  }

  generateShareableLink() {
    try {
      const jsonStr = JSON.stringify(window.appState.tracks);
      
      const base64Str = btoa(unescape(encodeURIComponent(jsonStr)));
      const shareUrl = `${window.location.origin}${window.location.pathname}#import=${base64Str}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        window.showToast("Shareable link copied to clipboard! 🔗", "success");
      }).catch(err => {
        window.showToast("Failed to copy link. Try exporting JSON instead.", "warning");
      });
    } catch (e) {
      window.showToast("Failed to generate link.", "warning");
    }
  }

  checkForImportHash() {
    if (window.location.hash.startsWith('#import=')) {
      try {
        const base64Str = window.location.hash.replace('#import=', '');
        const jsonStr = decodeURIComponent(escape(atob(base64Str)));
        if (this.importData(jsonStr)) {
          window.showToast("Shared syllabus imported! 🎉", "success");
        }
        
        window.history.replaceState(null, null, window.location.pathname);
      } catch (e) {
        window.showToast("Failed to load shared syllabus. Link might be broken.", "warning");
        window.history.replaceState(null, null, window.location.pathname);
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.PlaylistManager = PlaylistManager;
}
