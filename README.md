# 🚀 PlacementHub — All-in-One Placement Learning & Coding Suite

> A modern, cyber-dark, glassmorphic Single-Page Application (SPA) designed for engineering students preparing for campus placements, technical interviews, and online coding rounds in **Java**, **C++**, **C**, **Python**, and **DSA / Aptitude**.

---

## 🌟 Key Highlights & Philosophy

- 🔄 **Zero-Tab Switching**: Watch full YouTube placement courses, playlists, and tutorials directly inside the app without switching tabs or losing focus.
- ⚡ **Dynamic Video / Playlist Importer**: Add any YouTube playlist or video URL on-the-fly — it automatically gets parsed, categorized, and persisted into your custom playlist track.
- 📝 **Timestamped Placement Notes**: Capture key notes and insights synced with the video playback timestamp, and export them as clean Markdown files (`.md`).
- 🎯 **Curated Placement Roadmap**: A step-by-step track through Core CS fundamentals (Operating Systems, DBMS, Computer Networks, OOPs) with hand-picked videos for each stage.
- 🧩 **LeetCode & GFG Practice Tracker**: A curated set of must-do DSA problems with difficulty tags, direct links, and completion tracking.
- 💾 **Local Persistence + Backup**: Custom playlists, notes, and progress save to `localStorage` automatically, with one-click export/import in Settings so you can back up or move to another browser.

---

## 📚 Master Placement Curriculum (13 Preloaded Playlists & Courses)

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
| 8b | **C++ STL Complete Tutorial — One Shot** | Apna College | C++ & STL | `okhdtEk1iKk` |
| 9 | **C Language Full Course for Beginners (10.5h)** | Apna College | C Masterclass | `irqbmMNs2Bo` |
| 10 | **Striver's A2Z DSA Course & Placement Series** | takeUforward | Complete DSA Sheet | `PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz` |
| 11 | **Core Engineering & Placement Series** | Neso Academy | Core CS / OS / CN | `PLBlnK6fEyqRhgMzWqbZXXd8TrBXtQiV3l` |
| 12 | **Python Programming Full Course** | Neso Academy | Python Mastery | `PLBlnK6fEyqRiueC_HzwFallNO76hfXBB7` |

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: Semantic HTML5, Vanilla JavaScript (ES6+, loaded as classic scripts in a fixed order — no bundler, build step, or module system), Modern CSS3.
- **Design System**: 
  - **Cyber-Dark Theme**: Deep space background (`#0b0f19`), neon accent borders (`#6366f1`, `#06b6d4`, `#10b981`, `#f59e0b`).
  - **Glassmorphism**: `backdrop-filter: blur(16px)`, translucent layers (`rgba(255,255,255,0.03)`), smooth micro-interactions.
  - **Typography**: Google Fonts (*Outfit* for headings, *Inter* for body, *Fira Code* for syntax).
  - **Icons**: Font Awesome 6 Free (cdnjs).
- **Video Engine**: YouTube IFrame API with intelligent URL parsing (supports regular videos, `youtu.be` links, and playlist IDs `PL...`).
- **Storage**: Browser `localStorage` API for client-side state persistence with zero server latency.

---

## 📁 Project Directory Structure

```text
placementhub/
├── index.html              # Main application shell — navbar, video player, sidebar & toolkit tabs
├── manifest.json           # PWA manifest (installable app metadata)
├── sw.js                   # Service worker — network-first caching for offline support
├── vercel.json             # Static hosting / deployment config
├── README.md               # Project documentation & reference guide
├── icons/                  # Favicon, PWA icons, apple-touch-icon
├── css/
│   ├── main.css             # Base layout, header, navigation
│   ├── player.css           # Video player & controls
│   ├── toolkit.css          # Notes / Practice / Roadmap tab styles
│   ├── components.css       # Buttons, modals, shared UI primitives
│   ├── style.css            # Visual theme layer (colors, effects, glassmorphism)
│   └── responsive.css       # Breakpoints for tablet & mobile
└── js/
    ├── data.js              # Master placement database + shared helpers (escapeHtml, etc.)
    ├── practiceData.js      # Curated LeetCode / GFG problem set
    ├── player.js            # YouTube IFrame API controller & playback state
    ├── playlistManager.js   # Track/video CRUD, localStorage persistence, backup/restore
    ├── notesManager.js      # Timestamped notes engine & Markdown export
    ├── practiceManager.js   # Practice tracker UI (filtering, completion state)
    ├── pomodoro.js          # Focus timer controller
    └── app.js               # Application bootstrapper, rendering & event wiring
```

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Safari).
- Python 3 or Node.js (for running a local HTTP server).

### 2. Running Locally

#### Option A: Using Python (Recommended)
```bash
# Navigate into the project folder (wherever you cloned/extracted it)
cd placementhub

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
- ⭐ **My Custom Links**: Your personal library containing all 13 preloaded series + any URLs you add.

### 2. Adding New Videos or Playlists
1. Click the **"Add Video / Playlist"** button in the header or sidebar.
2. Paste any YouTube video link (`https://youtube.com/watch?v=...`), short link (`https://youtu.be/...`), or playlist link (`https://youtube.com/playlist?list=...`).
3. Fill in the title, select the target track, and click **"Add to Playlist"**.
4. The video is immediately playable and saved permanently in your browser.

### 3. Taking Timestamped Notes
1. Click the **"Timestamped Notes Notebook"** tab below the video player.
2. Type your note in the input box — it automatically grabs the current video timestamp.
3. Click **"Save Note"**.
4. Click any saved timestamp note to jump directly to that moment in the video.
5. Click **"Export .md"** to download all your revision notes formatted in clean Markdown.

### 4. Tracking LeetCode & GFG Practice
1. Click the **"LeetCode & GFG Practice Sheets"** tab below the player.
2. Filter by difficulty or topic, then click a problem to open it on LeetCode or GeeksforGeeks.
3. Check a problem off once you've solved it — your progress is saved automatically.

### 5. Following the Placement Roadmap
1. Click the **"Placement Roadmap & Phases"** tab below the player.
2. Work through each stage — DSA, Core CS fundamentals (OS, DBMS, CN, OOPs), and interview prep — in order.
3. Each stage links directly to the curated videos that cover it.

### 6. Backing Up or Resetting Your Data
1. Open **Settings** (gear icon in the header).
2. Click **"Export Backup"** to download a JSON snapshot of your playlists and custom videos — handy before clearing browser data or when switching devices.
3. Click **"Import Backup"** to restore from a previously exported file.
4. Click **"Reset to Defaults"** to discard custom changes and restore the original curriculum.

---

## ⌨️ Productivity Shortcuts

| Action | Shortcut / Interaction |
|---|---|
| Toggle Sidebar | Click the `☰` menu button in the navbar |
| Jump Video to Timestamp | Click any blue timestamp pill in Notes |
| Play / Pause | `Space` or `K` |
| Seek back / forward 10s | `J` / `L` or `←` / `→` |
| Next / Previous video | `N` / `P` |
| Toggle watched | `M` |
| Toggle theater mode | `T` |
| Close Modal | `Esc` or click outside modal |
| Search Playlists | Use the search bar in the playlist sidebar |

---

## 📄 License
This project is open-source and built for educational and placement preparation purposes. All video content belongs to their respective YouTube creators and educators.
