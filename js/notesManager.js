/* ==========================================================================
   PLACEMENTHUB - TIMESTAMPED NOTES NOTEBOOK CONTROLLER
   Full Persistence, Instant Timestamp Jumping, Markdown Export & Filtering
   ========================================================================== */

class NotesManager {
  constructor() {
    this.storageKey = 'placementhub_notes_v2';
    this.notes = this.loadNotes();
    this.currentFilter = 'current'; // 'current' or 'all'
    this.searchQuery = '';
  }

  loadNotes() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load notes from localStorage:", e);
      return [];
    }
  }

  saveNotes() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
    } catch (e) {
      console.error("Failed to save notes to localStorage:", e);
    }
  }

  // Parse string timestamp (e.g. "12:34" or "1:05:20") to total seconds
  static timestampToSeconds(tsStr) {
    if (!tsStr) return 0;
    const parts = tsStr.trim().split(':').map(Number);
    if (parts.some(isNaN)) return 0;
    if (parts.length === 3) {
      return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    } else if (parts.length === 2) {
      return (parts[0] * 60) + parts[1];
    } else if (parts.length === 1) {
      return parts[0];
    }
    return 0;
  }

  // Format seconds to MM:SS or HH:MM:SS
  static formatSeconds(sec) {
    const s = Math.max(0, Math.floor(sec));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  addNote(content, timestampStr = '') {
    if (!content || !content.trim()) {
      window.showToast("Please enter a note before saving.", "warning");
      return null;
    }

    const trackId = window.appState.currentTrackId || 'general';
    const track = window.appState.tracks[trackId] || {};
    const videoIndex = window.playerController ? window.playerController.currentVideoIndex : 0;
    const currentVideo = (track.videos && track.videos[videoIndex]) ? track.videos[videoIndex] : null;

    const videoId = currentVideo ? currentVideo.id : 'general-video';
    const videoTitle = (window.playerController && window.playerController.videoTitleElem && window.playerController.videoTitleElem.textContent && window.playerController.videoTitleElem.textContent !== 'Loading lecture...')
      ? window.playerController.videoTitleElem.textContent
      : (currentVideo ? currentVideo.title : 'General Lecture');
    const youtubeId = currentVideo ? currentVideo.youtubeId : '';

    const newNote = {
      id: 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      content: content.trim(),
      timestamp: timestampStr ? timestampStr.trim() : '',
      timestampSeconds: NotesManager.timestampToSeconds(timestampStr),
      trackId: trackId,
      trackName: track.name || trackId.toUpperCase(),
      videoId: videoId,
      videoTitle: videoTitle,
      youtubeId: youtubeId,
      createdAt: new Date().toISOString()
    };

    this.notes.unshift(newNote);
    this.saveNotes();
    this.renderNotes();
    window.showToast("Note saved with timestamp 📝", "success");
    return newNote;
  }

  jumpToTimestamp(noteId) {
    const note = this.notes.find(n => n.id === noteId);
    if (!note) return;

    if (note.timestampSeconds > 0) {
      if (note.youtubeId && window.playerController && window.playerController.videoIframe) {
        // If it's a playlist or standard video, seek to start time in the embedded player
        const isPlaylist = note.youtubeId.length > 11;
        const BASE = 'https://www.youtube.com/embed';
        const params = window.playerController.getEmbedParams();
        let embedUrl = "";
        
        if (isPlaylist) {
          embedUrl = `${BASE}/videoseries?list=${note.youtubeId}&${params}&start=${note.timestampSeconds}&autoplay=1`;
        } else {
          embedUrl = `${BASE}/${note.youtubeId}?${params}&start=${note.timestampSeconds}&autoplay=1`;
        }

        window.playerController.videoIframe.src = '';
        window.playerController.videoIframe.src = embedUrl;
        window.showToast(`⏱️ Jumped in player to ${note.timestamp}`, "info");
        return;
      }

      if (note.youtubeId) {
        window.open(`https://www.youtube.com/watch?v=${note.youtubeId}&t=${note.timestampSeconds}s`, '_blank', 'noopener,noreferrer');
      }
    }
  }

  deleteNote(noteId) {
    this.notes = this.notes.filter(n => n.id !== noteId);
    this.saveNotes();
    this.renderNotes();
    window.showToast("Note deleted.", "info");
  }

  editNote(noteId, newContent) {
    const note = this.notes.find(n => n.id === noteId);
    if (note && newContent.trim()) {
      note.content = newContent.trim();
      note.updatedAt = new Date().toISOString();
      this.saveNotes();
      this.renderNotes();
      window.showToast("Note updated successfully.", "success");
    }
  }

  exportNotes() {
    if (this.notes.length === 0) {
      window.showToast("No notes to export yet.", "warning");
      return;
    }

    let md = `# PlacementHub Study Notes\nExported on: ${new Date().toLocaleString()}\n\n`;
    this.notes.forEach((n, idx) => {
      md += `### ${idx + 1}. ${n.videoTitle} [${n.trackName}]\n`;
      if (n.timestamp) {
        md += `**Timestamp:** \`${n.timestamp}\`\n`;
      }
      md += `**Date:** ${new Date(n.createdAt).toLocaleDateString()}\n\n`;
      md += `${n.content}\n\n`;
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PlacementHub_Notes_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
    window.showToast("Notes exported as Markdown file! 📄", "success");
  }

  copyAllNotes() {
    if (this.notes.length === 0) {
      window.showToast("No notes to copy yet.", "warning");
      return;
    }

    let text = `PlacementHub Notes:\n\n`;
    this.notes.forEach((n, idx) => {
      text += `[${idx + 1}] ${n.videoTitle} ${n.timestamp ? `(${n.timestamp})` : ''}\n${n.content}\n\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      window.showToast("All notes copied to clipboard! 📋", "success");
    }).catch(() => {
      window.showToast("Clipboard copy failed, please export as file.", "warning");
    });
  }

  renderNotes() {
    const listContainer = document.getElementById('notesListContainer');
    const countBadge = document.getElementById('notesCountBadge');
    if (!listContainer) return;

    const trackId = window.appState.currentTrackId;
    const videoIndex = window.playerController ? window.playerController.currentVideoIndex : 0;
    const currentVideo = (window.appState.tracks[trackId] && window.appState.tracks[trackId].videos) 
      ? window.appState.tracks[trackId].videos[videoIndex] 
      : null;
    const currentVideoId = currentVideo ? currentVideo.id : '';

    let filtered = this.notes;

    // Filter by current video vs all
    if (this.currentFilter === 'current' && currentVideoId) {
      filtered = filtered.filter(n => n.videoId === currentVideoId);
    } else if (this.currentFilter === 'track' && trackId) {
      filtered = filtered.filter(n => n.trackId === trackId);
    }

    // Filter by search query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.content.toLowerCase().includes(q) || 
        n.videoTitle.toLowerCase().includes(q) ||
        (n.timestamp && n.timestamp.includes(q))
      );
    }

    if (countBadge) {
      countBadge.textContent = `${filtered.length} Notes`;
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="notes-empty-state">
          <div class="notes-empty-icon"><i class="fa-solid fa-note-sticky"></i></div>
          <h4>No notes found</h4>
          <p>${this.currentFilter === 'current' ? 'No notes captured for this video yet. Type your key takeaways above!' : 'No notes created yet. Start typing while watching!'}</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(note => {
      const dateFormatted = new Date(note.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // YouTube timestamp jump link
      let jumpLink = '';
      if (note.youtubeId && note.timestampSeconds > 0) {
        jumpLink = `https://www.youtube.com/watch?v=${note.youtubeId}&t=${note.timestampSeconds}s`;
      }

      return `
        <div class="note-card" id="note-card-${note.id}">
          <div class="note-card-header">
            <div class="note-meta-group">
              ${note.timestamp ? `
                <span class="note-timestamp-badge" title="Click to seek player to ${note.timestamp}" onclick="window.notesManager.jumpToTimestamp('${note.id}')">
                  <i class="fa-regular fa-clock"></i> ${note.timestamp}
                  <i class="fa-solid fa-play" style="font-size: 0.62rem; margin-left: 4px; opacity: 0.85;"></i>
                </span>
              ` : ''}
              <span class="note-video-tag" title="${note.videoTitle}">
                <i class="fa-solid fa-video" style="color: var(--accent-primary);"></i> ${note.videoTitle}
              </span>
            </div>
            <div class="note-actions">
              <span class="note-date">${dateFormatted}</span>
              <button class="btn-note-action" onclick="window.notesManager.promptEdit('${note.id}')" title="Edit note">
                <i class="fa-regular fa-pen-to-square"></i>
              </button>
              <button class="btn-note-action delete" onclick="window.notesManager.deleteNote('${note.id}')" title="Delete note">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
          <div class="note-content-body" id="note-body-${note.id}">
            ${this.escapeHtml(note.content).replace(/\n/g, '<br>')}
          </div>
        </div>
      `;
    }).join('');
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  promptEdit(noteId) {
    const note = this.notes.find(n => n.id === noteId);
    if (!note) return;

    const bodyElem = document.getElementById(`note-body-${noteId}`);
    if (!bodyElem) return;

    bodyElem.innerHTML = `
      <div class="note-edit-box">
        <textarea id="edit-textarea-${noteId}" class="form-control" rows="3">${this.escapeHtml(note.content)}</textarea>
        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;">
          <button class="btn btn-secondary btn-sm" onclick="window.notesManager.renderNotes()">Cancel</button>
          <button class="btn btn-primary btn-sm" onclick="window.notesManager.saveEdit('${noteId}')">Save</button>
        </div>
      </div>
    `;
  }

  saveEdit(noteId) {
    const textarea = document.getElementById(`edit-textarea-${noteId}`);
    if (textarea) {
      this.editNote(noteId, textarea.value);
    }
  }
}

if (typeof window !== 'undefined') {
  window.NotesManager = NotesManager;
}
