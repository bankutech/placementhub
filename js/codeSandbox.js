/* ==========================================================================
   INTERACTIVE CODE SANDBOX & RUNNER (JAVA, C++, C, PYTHON)
   ========================================================================== */

class CodeSandbox {
  constructor() {
    this.currentLanguage = 'java';
    this.codeEditor = document.getElementById('sandboxCodeEditor');
    this.langSelect = document.getElementById('sandboxLangSelect');
    this.outputConsole = document.getElementById('sandboxOutputConsole');
    this.btnRun = document.getElementById('btnRunCode');
    this.btnClearConsole = document.getElementById('btnClearConsole');
    this.btnResetCode = document.getElementById('btnResetCode');

    this.init();
  }

  init() {
    if (!this.codeEditor || !this.langSelect) return;

    // Load initial code template
    this.setLanguage(this.currentLanguage);

    // Language Change Event
    this.langSelect.addEventListener('change', (e) => {
      this.setLanguage(e.target.value);
    });

    // Run Code Button
    if (this.btnRun) {
      this.btnRun.addEventListener('click', () => this.runCode());
    }

    // Clear Console
    if (this.btnClearConsole) {
      this.btnClearConsole.addEventListener('click', () => {
        this.outputConsole.textContent = "// Output terminal ready. Click 'Run Code' to execute.";
        this.outputConsole.className = 'sandbox-output-console';
      });
    }

    // Reset Code Template
    if (this.btnResetCode) {
      this.btnResetCode.addEventListener('click', () => {
        if (confirm("Reset current code to default template?")) {
          this.codeEditor.value = CODE_TEMPLATES[this.currentLanguage] || "";
          window.showToast("Code reset to default template", "info");
        }
      });
    }

    // Support Tab Key in Textarea
    this.codeEditor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.codeEditor.selectionStart;
        const end = this.codeEditor.selectionEnd;

        this.codeEditor.value = 
          this.codeEditor.value.substring(0, start) + "    " + this.codeEditor.value.substring(end);

        this.codeEditor.selectionStart = this.codeEditor.selectionEnd = start + 4;
      }
    });
  }

  setLanguage(lang) {
    if (!CODE_TEMPLATES[lang]) return;
    this.currentLanguage = lang;
    if (this.langSelect) this.langSelect.value = lang;
    if (this.codeEditor) this.codeEditor.value = CODE_TEMPLATES[lang];
    if (this.outputConsole) {
      this.outputConsole.textContent = `// Loaded ${lang.toUpperCase()} environment. Write code and click 'Run Code' to execute.`;
      this.outputConsole.className = 'sandbox-output-console';
    }
  }

  async runCode() {
    const code = this.codeEditor.value;
    const lang = this.currentLanguage;

    if (!code.trim()) {
      window.showToast("Source code is empty!", "warning");
      return;
    }

    // Display loader in console
    if (this.outputConsole) {
      this.outputConsole.textContent = `[Compiling and executing ${lang.toUpperCase()} via Piston Sandbox...]`;
      this.outputConsole.className = 'sandbox-output-console running';
    }

    // Map editor languages to Piston runtimes
    const pistonLangMap = {
      'java': { language: 'java', version: '15.0.2', filename: 'Main.java' },
      'cpp': { language: 'c++', version: '10.2.0', filename: 'main.cpp' },
      'c': { language: 'c', version: '10.2.0', filename: 'main.c' },
      'python': { language: 'python', version: '3.10.0', filename: 'main.py' }
    };

    const runtime = pistonLangMap[lang] || { language: lang, version: '*', filename: 'main' };

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: runtime.language,
          version: runtime.version,
          files: [
            {
              name: runtime.filename,
              content: code
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Execution service returned status ${response.status}`);
      }

      const data = await response.json();
      const runResult = data.run;

      if (!runResult) {
        throw new Error("No output received from the execution sandbox.");
      }

      // Check if compilation failed or runtime error occurred
      const hasError = runResult.stderr || runResult.code !== 0;

      if (this.outputConsole) {
        if (hasError) {
          this.outputConsole.className = 'sandbox-output-console has-error';
          let errorText = `--- Code Execution Failed (Exit Code ${runResult.code}) ---\n`;
          if (data.compile && data.compile.stderr) {
            errorText += `[Compilation Error]\n${data.compile.stderr}\n`;
          }
          if (runResult.stderr) {
            errorText += `[Runtime Error]\n${runResult.stderr}`;
          }
          this.outputConsole.textContent = errorText;
          window.showToast("Execution finished with errors", "warning");
        } else {
          this.outputConsole.className = 'sandbox-output-console success';
          this.outputConsole.textContent = `--- Output (${lang.toUpperCase()}) ---\n${runResult.stdout || '(No standard output)'}\n\n--------------------------------------\n✨ Execution Successful (Code 0)`;
          window.showToast("Code executed successfully! 🚀", "success");
        }
      }
    } catch (err) {
      if (this.outputConsole) {
        this.outputConsole.className = 'sandbox-output-console has-error';
        this.outputConsole.textContent = `❌ API / Network Error: Could not reach compile sandbox.\n${err.message || err}`;
      }
      window.showToast("Execution failed", "warning");
    }
  }
}

window.CodeSandbox = CodeSandbox;
