/* ==========================================================================
   PLACEMENTHUB - POMODORO FOCUS TIMER CONTROLLER
   25m Focus / 5m Break / Web Audio Ambient Chime / Session Tracking
   ========================================================================== */

class PomodoroController {
  constructor() {
    this.focusDuration = 25 * 60; // 25 minutes
    this.shortBreakDuration = 5 * 60; // 5 minutes
    this.longBreakDuration = 15 * 60; // 15 minutes

    this.currentMode = 'focus'; // 'focus' | 'shortBreak' | 'longBreak'
    this.timeLeft = this.focusDuration;
    this.isRunning = false;
    this.timerInterval = null;

    this.sessionsCompleted = this.loadCompletedSessions();
    this.restoreTimerState(); // resumes wherever the last session left off (paused)

    this.initAudio();
  }

  loadCompletedSessions() {
    try {
      const data = localStorage.getItem('placementhub_pomo_sessions');
      return data ? parseInt(data, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  }

  saveCompletedSessions() {
    try {
      localStorage.setItem('placementhub_pomo_sessions', this.sessionsCompleted.toString());
    } catch (e) {
      console.error(e);
    }
  }

  // Restores mode + time remaining across page reloads. Always comes back
  // paused (never auto-resumes running) so a tab left open/closed for a
  // long time can't silently keep "running" against a clock nobody saw.
  restoreTimerState() {
    try {
      const raw = localStorage.getItem('placementhub_pomo_state');
      if (!raw) return;
      const saved = JSON.parse(raw);
      const durations = { focus: this.focusDuration, shortBreak: this.shortBreakDuration, longBreak: this.longBreakDuration };
      const maxForMode = durations[saved.currentMode];
      if (
        maxForMode !== undefined &&
        Number.isFinite(saved.timeLeft) &&
        saved.timeLeft >= 0 &&
        saved.timeLeft <= maxForMode
      ) {
        this.currentMode = saved.currentMode;
        this.timeLeft = saved.timeLeft;
      }
    } catch (e) {
      console.error("Failed to restore pomodoro timer state:", e);
    }
  }

  saveTimerState() {
    try {
      localStorage.setItem('placementhub_pomo_state', JSON.stringify({
        currentMode: this.currentMode,
        timeLeft: this.timeLeft
      }));
    } catch (e) {
      console.error("Failed to save pomodoro timer state:", e);
    }
  }

  initAudio() {
    this.audioCtx = null;
  }

  // Pure Web Audio API Synthesized Ambient Chime
  playAmbientChime() {
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      // Harmonious Tibetan Singing Bowl / Zen chime chord (C5, E5, G5, C6)
      const chord = [523.25, 659.25, 783.99, 1046.50];

      chord.forEach((freq, index) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + (index * 0.08));

        // Smooth exponential attack and long lingering decay
        gain.gain.setValueAtTime(0.001, now + (index * 0.08));
        gain.gain.linearRampToValueAtTime(0.18 / (index + 1), now + (index * 0.08) + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (index * 0.08) + 3.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + (index * 0.08));
        osc.stop(now + (index * 0.08) + 3.5);
      });
    } catch (e) {
      console.warn("Web Audio chime could not play:", e);
    }
  }

  setMode(mode) {
    this.pause();
    this.currentMode = mode;

    if (mode === 'focus') {
      this.timeLeft = this.focusDuration;
    } else if (mode === 'shortBreak') {
      this.timeLeft = this.shortBreakDuration;
    } else if (mode === 'longBreak') {
      this.timeLeft = this.longBreakDuration;
    }

    this.saveTimerState();
    this.updateUI();
  }

  toggle() {
    if (this.isRunning) {
      this.pause();
    } else {
      this.start();
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Wake up audio context on user gesture
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) this.audioCtx = new AudioCtxClass();
    }

    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);

    this.updateUI();
    window.showToast(`Pomodoro timer started! Stay focused 🎯`, 'info');
  }

  pause() {
    this.isRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.updateUI();
  }

  reset() {
    this.pause();
    this.setMode(this.currentMode);
    window.showToast("Pomodoro timer reset.", "info");
  }

  tick() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.saveTimerState();
      this.updateUI();
    } else {
      this.onComplete();
    }
  }

  onComplete() {
    this.pause();
    this.playAmbientChime();

    if (this.currentMode === 'focus') {
      this.sessionsCompleted++;
      this.saveCompletedSessions();
      window.showToast("🎉 Focus Sprint Completed! Take a well-deserved 5-minute break.", "success");
      this.setMode('shortBreak');
    } else {
      window.showToast("⚡ Break finished! Ready to begin your next focus sprint?", "info");
      this.setMode('focus');
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  updateUI() {
    const timeStr = this.formatTime(this.timeLeft);

    // Header badge & Side Nav pill
    const headerDisplay = document.getElementById('headerPomodoroDisplay');
    const sideNavPomoPill = document.getElementById('sideNavPomoPill');
    const headerBtn = document.getElementById('btnHeaderPomodoro');
    if (headerDisplay) {
      headerDisplay.textContent = timeStr;
    }
    if (sideNavPomoPill) {
      sideNavPomoPill.textContent = timeStr;
    }

    // Modal or widget elements
    const mainTimeDisplay = document.getElementById('pomoMainTime');
    const toggleBtn = document.getElementById('btnPomoToggle');
    const sessionsBadge = document.getElementById('pomoSessionsCount');
    const modeTabs = document.querySelectorAll('.pomo-mode-tab');

    if (mainTimeDisplay) {
      mainTimeDisplay.textContent = timeStr;
    }

    if (toggleBtn) {
      if (this.isRunning) {
        toggleBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        toggleBtn.className = 'btn btn-secondary';
      } else {
        toggleBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Focus';
        toggleBtn.className = 'btn btn-primary';
      }
    }

    if (sessionsBadge) {
      sessionsBadge.textContent = `${this.sessionsCompleted} Sprints`;
    }

    if (modeTabs) {
      modeTabs.forEach(tab => {
        if (tab.getAttribute('data-mode') === this.currentMode) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    }

    // Update document title if running
    if (this.isRunning) {
      document.title = `(${timeStr}) PlacementHub - ${this.currentMode === 'focus' ? 'Focusing' : 'Break'}`;
    } else {
      document.title = 'PlacementHub – Placement Coding & Aptitude Prep';
    }
  }
}

if (typeof window !== 'undefined') {
  window.PomodoroController = PomodoroController;
}
