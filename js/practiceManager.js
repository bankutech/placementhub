/* ==========================================================================
   PLACEMENTHUB - PRACTICE PROBLEMS & CODING SHEETS CONTROLLER
   Topic Filters, Difficulty Badges, Direct Problem Links & Solved Tracking
   ========================================================================== */

class PracticeManager {
  constructor() {
    this.storageKey = 'placementhub_solved_probs_v2';
    this.solvedSet = this.loadSolvedState();
    this.currentTopic = 'All';
    this.currentDifficulty = 'All';
    this.currentPlatform = 'All';
    this.searchQuery = '';
  }

  loadSolvedState() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return new Set(data ? JSON.parse(data) : []);
    } catch (e) {
      console.error("Failed to load solved problems:", e);
      return new Set();
    }
  }

  saveSolvedState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.solvedSet)));
    } catch (e) {
      console.error("Failed to save solved problems:", e);
    }
  }

  toggleSolved(probId) {
    if (this.solvedSet.has(probId)) {
      this.solvedSet.delete(probId);
      window.showToast("Marked as unsolved.", "info");
    } else {
      this.solvedSet.add(probId);
      window.showToast("Problem solved! Great progress 🚀", "success");
    }
    this.saveSolvedState();
    this.renderProblems();
  }

  renderProblems() {
    const container = document.getElementById('practiceProblemsGrid');
    const statsContainer = document.getElementById('practiceStatsSummary');
    const topicSelect = document.getElementById('practiceTopicFilter');

    if (!container || !window.PRACTICE_PROBLEMS_DATA) return;

    const allProblems = window.PRACTICE_PROBLEMS_DATA;
    const totalProblems = allProblems.length;
    const solvedCount = allProblems.filter(p => this.solvedSet.has(p.id)).length;
    const solvedPercent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="practice-stat-box">
          <div class="practice-stat-val" style="color: var(--accent-success);">${solvedCount} / ${totalProblems}</div>
          <div class="practice-stat-label">Solved (${solvedPercent}%)</div>
        </div>
        <div class="practice-progress-bar-wrap">
          <div class="practice-progress-bar-fill" style="width: ${solvedPercent}%;"></div>
        </div>
      `;
    }

    // Populate topics in dropdown if empty
    if (topicSelect && topicSelect.options.length <= 1) {
      const topics = Array.from(new Set(allProblems.map(p => p.topic)));
      topics.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        topicSelect.appendChild(opt);
      });
    }

    // Filter problems
    let filtered = allProblems;

    if (this.currentTopic !== 'All') {
      filtered = filtered.filter(p => p.topic === this.currentTopic);
    }
    if (this.currentDifficulty !== 'All') {
      filtered = filtered.filter(p => p.difficulty.toLowerCase() === this.currentDifficulty.toLowerCase());
    }
    if (this.currentPlatform !== 'All') {
      filtered = filtered.filter(p => p.platform.toLowerCase() === this.currentPlatform.toLowerCase());
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.topic.toLowerCase().includes(q) ||
        (p.companies && p.companies.some(c => c.toLowerCase().includes(q)))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="practice-empty-state">
          <i class="fa-solid fa-code"></i>
          <h4>No matching practice problems</h4>
          <p>Try resetting filters or searching for different keywords.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(prob => {
      const isSolved = this.solvedSet.has(prob.id);
      const diffClass = `diff-${prob.difficulty.toLowerCase()}`;
      const platformIcon = prob.platform === 'LeetCode' 
        ? '<i class="fa-solid fa-terminal" style="color: #ffa116;"></i>' 
        : '<i class="fa-solid fa-laptop-code" style="color: #2e7d32;"></i>';

      return `
        <div class="problem-card ${isSolved ? 'is-solved' : ''}">
          <div class="problem-card-left">
            <div class="problem-checkbox" onclick="window.practiceManager.toggleSolved('${prob.id}')" title="${isSolved ? 'Mark unsolved' : 'Mark solved'}">
              <i class="${isSolved ? 'fa-solid fa-circle-check solved' : 'fa-regular fa-circle'}"></i>
            </div>
            <div class="problem-info">
              <a href="${prob.url}" target="_blank" rel="noopener noreferrer" class="problem-title" title="Open problem on ${prob.platform}">
                ${prob.title} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.72rem; margin-left: 4px; opacity: 0.7;"></i>
              </a>
              <div class="problem-tags">
                <span class="problem-badge badge-topic">${prob.topic}</span>
                <span class="problem-badge ${diffClass}">${prob.difficulty}</span>
                <span class="problem-badge badge-platform">${platformIcon} ${prob.platform}</span>
              </div>
            </div>
          </div>
          <div class="problem-card-right">
            ${prob.companies ? `
              <div class="problem-companies" title="Asked in interviews">
                ${prob.companies.slice(0, 3).map(c => `<span class="company-pill">${c}</span>`).join('')}
              </div>
            ` : ''}
            <a href="${prob.url}" target="_blank" rel="noopener noreferrer" class="btn-solve" title="Solve on ${prob.platform}">
              Solve <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
            </a>
          </div>
        </div>
      `;
    }).join('');
  }
}

if (typeof window !== 'undefined') {
  window.PracticeManager = PracticeManager;
}
