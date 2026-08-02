/* ==========================================================================
   PLACEMENT INTERVIEW Q&A BROWSER & PRACTICE ENGINE
   ========================================================================== */

class InterviewPrepManager {
  constructor() {
    this.questions = INTERVIEW_QUESTIONS;
    this.selectedLanguage = 'all';
    this.selectedDifficulty = 'all';
    this.searchQuery = '';

    this.container = document.getElementById('interviewQList');
    this.langFilter = document.getElementById('interviewLangFilter');
    this.difficultyFilter = document.getElementById('interviewDifficultyFilter');
    this.searchInput = document.getElementById('interviewSearchInput');

    this.init();
  }

  init() {
    if (!this.container) return;

    if (this.langFilter) {
      this.langFilter.addEventListener('change', (e) => {
        this.selectedLanguage = e.target.value;
        this.render();
      });
    }

    if (this.difficultyFilter) {
      this.difficultyFilter.addEventListener('change', (e) => {
        this.selectedDifficulty = e.target.value;
        this.render();
      });
    }

    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    this.render();
  }

  setLanguageFilter(lang) {
    this.selectedLanguage = lang;
    if (this.langFilter) this.langFilter.value = lang;
    this.render();
  }

  render() {
    if (!this.container) return;

    const filtered = this.questions.filter(q => {
      const matchLang = this.selectedLanguage === 'all' || q.language === this.selectedLanguage;
      const matchDiff = this.selectedDifficulty === 'all' || q.difficulty === this.selectedDifficulty;
      const matchSearch = !this.searchQuery || 
        q.title.toLowerCase().includes(this.searchQuery) ||
        q.question.toLowerCase().includes(this.searchQuery) ||
        q.category.toLowerCase().includes(this.searchQuery);

      return matchLang && matchDiff && matchSearch;
    });

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <div style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          <i class="fa-solid fa-clipboard-question" style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--text-secondary);"></i>
          <p>No interview questions matched your search filters.</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = filtered.map((q, idx) => `
      <div class="interview-q-card" id="${q.id}">
        <div class="interview-q-header" onclick="window.interviewPrepManager.toggleQuestion('${q.id}')">
          <div class="interview-q-title-group">
            <span class="interview-q-number">#${idx + 1}</span>
            <div class="interview-q-title">${q.title}</div>
          </div>
          <div class="interview-q-tags">
            <span class="video-badge badge-track">${q.language.toUpperCase()}</span>
            <span class="difficulty-badge ${q.difficulty}">${q.difficulty}</span>
            <i class="fa-solid fa-chevron-down q-toggle-icon" style="color: var(--text-muted); transition: transform 0.2s;"></i>
          </div>
        </div>
        <div class="interview-q-body">
          <p style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem;">${q.question}</p>
          <div style="white-space: pre-line; margin-bottom: 0.75rem;">${q.answer}</div>
          ${q.code ? `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Code Implementation:</span>
              <button class="btn btn-secondary btn-sm" onclick="window.interviewPrepManager.sendToPlayground('${q.language}', \`${this.escapeForSnippet(q.code)}\`)" title="Open in Code Playground">
                <i class="fa-solid fa-terminal"></i> Try in Code Sandbox
              </button>
            </div>
            <pre class="q-code-snippet"><code>${this.escapeHtml(q.code)}</code></pre>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  toggleQuestion(cardId) {
    const card = document.getElementById(cardId);
    if (card) {
      card.classList.toggle('open');
    }
  }

  sendToPlayground(lang, code) {
    // Switch toolkit tab to code sandbox
    window.switchToolkitTab('tab-sandbox');

    if (window.codeSandbox) {
      window.codeSandbox.setLanguage(lang);
      window.codeSandbox.codeEditor.value = code;
      window.showToast(`Loaded ${lang.toUpperCase()} code in Sandbox! 💻`, 'success');
    }
  }

  escapeForSnippet(str) {
    return str.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

window.InterviewPrepManager = InterviewPrepManager;
