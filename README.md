# 🚀 PlacementHub — All-in-One Placement Learning & Coding Suite

> A modern, cyber-dark, glassmorphic Single-Page Application (SPA) designed for engineering students preparing for campus placements, technical interviews, and online coding rounds in **Java**, **C++**, **C**, **Python**, and **DSA / Aptitude**.

---

## 🌟 Key Highlights & Philosophy

- 🔄 **Zero-Tab Switching**: Watch full YouTube placement courses, playlists, and tutorials directly inside the app without switching tabs or losing focus.
- ⚡ **Dynamic Video / Playlist Importer**: Add any YouTube playlist or video URL on-the-fly — it automatically gets parsed, categorized, and persisted into your custom playlist track.
- 💻 **Live Code Playground**: Interactive in-browser multi-language code runner and editor with pre-filled placement templates for Java, C++, C, Python, and JavaScript.
- 📝 **Timestamped Placement Notes**: Capture key notes and insights synced with the video playback timestamp, and export them as clean Markdown files (`.md`).
- 🎯 **Company Cheat Sheets & HR Prep**: Instant flashcards for Core CS subjects (Operating Systems, DBMS, Computer Networks, OOPs) and behavioral HR round questions.
- 🧠 **Interactive Interview Quiz Engine**: Test your readiness with multiple-choice questions from top company placement tests (TCS, Infosys, Amazon, Wipro, Cognizant, Product Startups).
- 💾 **100% Local Persistence**: All custom playlists, notes, code snippets, and active video progress are automatically saved to `localStorage`.

---

## 📚 Master Placement Curriculum (12 Preloaded Playlists & Courses)

PlacementHub comes pre-configured with the tech community's most acclaimed placement courses:

| # | Course / Playlist Title | Instructor / Channel | Category / Track | Playlist / Video ID |
|---|---|---|---|---|
| 1 | **Placement Coding & Aptitude Prep Series** | Placement Hub Master Series | Aptitude & Prep | `PL8p2I9GklV454LdGfDOw0KkNazKuA-6B2` |
| 2 | **C Programming Placement Series** | Neso Academy | C Language | `PLBlnK6fEyqRhMP7gwIe2j0hb1PCvYn0RI` |
| 3 | **Complete Aptitude & Reasoning Series** | Amit Khurana | Aptitude & Logic | `PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS` |
| 4 | **Quantitative Aptitude Mastery Tutorials** | CareerRide | Aptitude Shortcuts | `PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt` |
| 5 | **Placement & Coding Master Series** | Placement Masterclass | Coding Prep | `PLBG_hRMQjgpwN2WhFoFZG_jad1fLgKSnZ` |
| 6 | **Complete Java & DSA Bootcamp** | Kunal Kushwaha | Java & DSA | `PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ` |
| 7 | **DSA Practice & C++ Course** | Apna College | C++ & Algorithms | `PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt` |
| 8 | **Python Language Full Course (2025-26)** | Jenny's Lectures | Python Track | `PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0` |
| 9 | **C Language Full Course for Beginners (10.5h)** | Apna College | C Masterclass | `irqbmMNs2Bo` |
| 10 | **Striver's A2Z DSA Course & Placement Series** | takeUforward | Complete DSA Sheet | `PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz` |
| 11 | **Core Engineering & Placement Series** | Neso Academy | Core CS / OS / CN | `PLBlnK6fEyqRhgMzWqbZXXd8TrBXtQiV3l` |
| 12 | **Python Programming Full Course** | Neso Academy | Python Mastery | `PLBlnK6fEyqRiueC_HzwFallNO76hfXBB7` |

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: Semantic HTML5, Vanilla JavaScript (ES6+ Modules), Modern CSS3.
- **Design System**: 
  - **Cyber-Dark Theme**: Deep space background (`#0b0f19`), neon accent borders (`#6366f1`, `#06b6d4`, `#10b981`, `#f59e0b`).
  - **Glassmorphism**: `backdrop-filter: blur(16px)`, translucent layers (`rgba(255,255,255,0.03)`), smooth micro-interactions.
  - **Typography**: Google Fonts (*Outfit* for headings, *Inter* for body, *Fira Code* for syntax).
  - **Icons**: FontAwesome 6 Pro CDN.
- **Video Engine**: YouTube IFrame API with intelligent URL parsing (supports regular videos, `youtu.be` links, and playlist IDs `PL...`).
- **Storage**: Browser `localStorage` API for client-side state persistence with zero server latency.

---

## 📁 Project Directory Structure

```text
quirky-nobel/
├── index.html              # Main application shell with navbar, video player, sidebar & toolkits
├── README.md               # Project documentation & reference guide
├── css/
│   └── style.css           # Complete cyber-dark design system, glassmorphism & responsive layout
└── js/
    ├── app.js              # Application bootstrapper, routing & modal management
    ├── data.js             # Master placement database (roadmaps, videos, cheat sheets, quizzes)
    ├── player.js           # YouTube video player controller & playback state sync
    ├── playlistManager.js  # Dynamic track switcher, playlist search & custom link manager
    ├── codeSandbox.js      # Live multi-language code editor & execution simulation engine
    ├── notes.js            # Video timestamp notes engine & Markdown export generator
    └── interviewPrep.js    # Interactive quiz system & core CS flashcards
```

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Safari).
- Python 3 or Node.js (for running a local HTTP server).

### 2. Running Locally

#### Option A: Using Python (Recommended)
```bash
# Navigate to the project directory
cd quirky-nobel

# Start Python HTTP Server
python -m http.server 3000
```
Open your browser and navigate to: **`http://localhost:3000`**

#### Option B: Using Node.js `npx serve`
```bash
npx serve -l 3000
```

#### Option C: Direct Browser Opening
Simply double-click `index.html` or open it with your favorite browser.

---

## 💡 How to Use PlacementHub

### 1. Switching Subjects & Tracks
Click on any track pill in the top navigation bar:
- ☕ **Java Track**: Core Java, Collections, Multithreading, Streams, and Kunal Kushwaha's DSA Bootcamp.
- ⚡ **C++ Track**: Modern C++, STL, Pointers, Memory Management, and Apna College DSA practice.
- 🚀 **C Language**: Apna College 10.5-Hour C masterclass, Neso Academy C series, dynamic memory & output MCQs.
- 🐍 **Python Track**: Jenny's Lectures & Neso Academy Python full courses, OOPs, and problem solving.
- 🧩 **DSA & Aptitude**: Striver's A2Z DSA course, Amit Khurana aptitude, and CareerRide shortcuts.
- ⭐ **My Custom Links**: Your personal library containing all 12 preloaded series + any URLs you add.

### 2. Adding New Videos or Playlists
1. Click the **"+ Add Video / Link"** button in the header or sidebar.
2. Paste any YouTube video link (`https://youtube.com/watch?v=...`), short link (`https://youtu.be/...`), or playlist link (`https://youtube.com/playlist?list=...`).
3. Fill in the title, select the language track, and click **"Save to Track"**.
4. The video is immediately playable and saved permanently in your browser.

### 3. Taking Timestamped Notes
1. Click the **"Notes"** tab below the video player.
2. Type your note in the input box — it automatically grabs the current video timestamp.
3. Click **"Save Note"**.
4. Click any saved timestamp note to jump directly to that moment in the video.
5. Click **"Export Notes (.md)"** to download all your revision notes formatted in clean Markdown.

### 4. Live Coding While Watching
1. Click the **"Code Editor"** tab below the player.
2. Select your language (Java, C++, C, Python, JavaScript).
3. Write your code and click **"▶ Run Code"** to see live simulated outputs and test cases without switching tabs.

### 5. Practicing Quizzes & Cheatsheets
1. Click the **"Interview Prep"** tab.
2. Toggle between **"Topic Cheatsheets"** (OS, DBMS, CN, OOPs) and **"Practice Quiz"** (TCS/Infosys/Amazon placement MCQs).
3. Select your answers to get instant explanations and score tracking.

---

## ⌨️ Productivity Shortcuts

| Action | Shortcut / Interaction |
|---|---|
| Toggle Sidebar | Click `≡` menu button in navbar |
| Jump Video to Timestamp | Click any blue timestamp pill in Notes |
| Quick Code Reset | Click `↺ Reset Code` in Editor tab |
| Close Modal | Press `Esc` or click outside modal |
| Search Playlists | Use the search bar in the playlist sidebar |

---

## 📄 License
This project is open-source and built for educational and placement preparation purposes. All video content belongs to their respective YouTube creators and educators.
