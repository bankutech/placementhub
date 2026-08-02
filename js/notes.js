/* ==========================================================================
   TIMESTAMPED NOTES & BOOKMARKS MANAGER
   ========================================================================== */

class NotesManager {
  constructor() {
    this.storageKey = 'placementhub_user_notes';
    this.notes = this.loadNotes();

    this.noteTextInput = document.getElementById('noteTextInput');
    this.btnAddNote = document.getElementById('btnAddNote');
    this.btnExportNotes = document.getElementById('btnExportNotes');
    this.notesListContainer = document.getElementById('notesListContainer');

    this.init();
  }

  init() {
    if (this.btnAddNote) {
      this.btnAddNote.addEventListener('click', () => this.addNote());
    }

    if (this.btnExportNotes) {
      this.btnExportNotes.addEventListener('click', () => this.exportNotesMarkdown());
    }

    this.renderNotesList();
  }

  loadNotes() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveNotes() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
    } catch (e) {
      console.error("Failed to save notes:", e);
    }
  }

  addNote() {
    const text = this.noteTextInput.value.trim();
    if (!text) {
      window.showToast("Please write some note text first!", "warning");
      return;
    }

    const currentTrackId = window.playerController.currentTrackId;
    const track = window.appState.tracks[currentTrackId];
    const currentVideo = track && track.videos[window.playerController.currentVideoIndex];

    const newNote = {
      id: `note-${Date.now()}`,
      videoId: currentVideo ? currentVideo.id : 'general',
      videoTitle: currentVideo ? currentVideo.title : 'General Placement Note',
      trackId: currentTrackId,
      text: text,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    this.notes.unshift(newNote);
    this.saveNotes();
    this.noteTextInput.value = "";
    this.renderNotesList();
    window.showToast("📝 Note saved successfully!", "success");
  }

  deleteNote(noteId) {
    this.notes = this.notes.filter(n => n.id !== noteId);
    this.saveNotes();
    this.renderNotesList();
    window.showToast("Note deleted", "info");
  }

  renderNotesList() {
    if (!this.notesListContainer) return;

    if (this.notes.length === 0) {
      this.notesListContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-note-sticky" style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--text-secondary);"></i>
          <p>No notes added yet. Take quick notes while watching lectures above!</p>
        </div>
      `;
      return;
    }

    this.notesListContainer.innerHTML = this.notes.map(note => `
      <div class="note-card">
        <div class="note-card-header">
          <span class="note-timestamp-badge" title="Associated Lesson">
            <i class="fa-solid fa-tag"></i> ${note.trackId.toUpperCase()}
          </span>
          <span style="color: var(--text-muted); font-size: 0.75rem;">${note.date}</span>
        </div>
        <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.25rem;">
          ${note.videoTitle}
        </div>
        <div class="note-text-body">${this.escapeHtml(note.text)}</div>
        <div class="note-card-footer">
          <span>ID: #${note.id.slice(-4)}</span>
          <button class="btn-delete-note" onclick="window.notesManager.deleteNote('${note.id}')" title="Delete note">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  exportNotesMarkdown() {
    if (this.notes.length === 0) {
      window.showToast("No notes to export yet!", "warning");
      return;
    }

    let md = `# Placement Learning Notes & Study Guide\nExported on: ${new Date().toLocaleString()}\n\n---\n\n`;
    this.notes.forEach((note, idx) => {
      md += `### ${idx + 1}. [${note.trackId.toUpperCase()}] ${note.videoTitle}\n`;
      md += `*Saved: ${note.date}*\n\n`;
      md += `${note.text}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement_notes_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    window.showToast("📥 Notes downloaded as Markdown file!", "success");
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

window.NotesManager = NotesManager;
