# placementhub

## Overview
![PlacementHub](https://img.shields.io/badge/Status-Active-success)
![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-f7df1e?logo=javascript&logoColor=black)
![Architecture](https://img.shields.io/badge/Architecture-ES_Modules-blue)
![Storage](https://img.shields.io/badge/Storage-IndexedDB-orange)

PlacementHub is a powerful, sleek, and highly scalable learning platform designed specifically for campus placement preparation. Built entirely with Vanilla JavaScript, it offers a zero-distraction, highly customizable environment for mastering Data Structures, Algorithms, and core programming languages (Java, C++, Python).

## Features

- **Dynamic Video Learning Hub**: Seamlessly stream curated YouTube playlists and videos directly in the platform. Add your own custom YouTube video links or playlist IDs to tailor your curriculum.
- **Timestamped Notebook**: Take markdown-compatible notes linked to the exact timestamp of the video you are watching. Clicking a note instantly jumps the video to that moment.
- **Infinite Local Storage**: Built on **IndexedDB** (via `localForage`), your custom playlists, practice progress, and thousands of notes are safely persisted in your browser asynchronously—no database required.
- **Integrated Pomodoro Timer**: A built-in study timer (25m Focus / 5m Break) with ambient audio chimes keeps you locked in on your coding sprints.
- **Practice Problem Tracker**: Track your progress across high-frequency placement coding questions categorised by difficulty. Includes direct links to LeetCode and GeeksforGeeks.
- **Premium UI/UX**: Designed using the "Nyalazone Sleek Dark Mode" design system, featuring deep blue accents, micro-animations, glassmorphism, and WCAG-compliant accessibility focus rings.
- **Data Portability**: Export and import your entire custom curriculum and timestamped notes as a portable JSON file to back up or share your learning path.

## Architecture & Tech Stack

PlacementHub is intentionally lightweight and blazingly fast. 
- **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+). No heavy frameworks (React/Vue/Angular) are used, ensuring instantaneous load times.
- **Modularity:** The application utilizes native **ES Modules** (`<script type="module">`). Logic is heavily decoupled into domain-specific managers (`PlaylistManager`, `NotesManager`, `PomodoroController`).
- **Data Persistence:** `localForage` is used to abstract `IndexedDB`, allowing for async, high-capacity local data storage that blows past standard `localStorage` limits.

## Installation & Usage

Because PlacementHub uses native ES Modules, it must be run over a local web server (to avoid CORS policies on local `file://` protocols).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/placementhub.git
   cd placementhub
   ```

2. **Run a local server:**
   If you have Python installed, you can easily spin up a server:
   ```bash
   python -m http.server 3001
   ```
   Or using Node.js/npx:
   ```bash
   npx serve -l 3001
   ```

3. **Open the App:**
   Navigate to `http://localhost:3001` in your web browser.

## Project Structure

```
placementhub/
├── index.html                # Main Application Entry Point
├── css/
│   ├── style.css             # Core CSS variables and layout
│   ├── player.css            # Video player and syllabus styling
│   ├── toolkit.css           # Notebook, Pomodoro, and Practice tab styling
│   ├── responsive.css        # Mobile and tablet breakpoints
│   └── nyalazone-overrides.css # Specific design aesthetic overrides
└── js/
    ├── app.js                # ES Module Entry (Global bootstrapper)
    ├── data.js               # Default curriculum constants
    ├── practiceData.js       # Default practice problems
    ├── player.js             # YouTube API Controller
    ├── playlistManager.js    # IndexedDB Playlist State Manager
    ├── notesManager.js       # IndexedDB Notebook Manager
    ├── practiceManager.js    # Problem Tracking Manager
    └── pomodoro.js           # Study Timer Logic
```

## License

© 2026 PlacementHub. Built for campus placement excellence. All rights reserved.

## Getting Started
Please refer to the source files for specific installation and usage instructions. Ensure that your local environment meets the standard requirements for the associated technologies.

## Project Structure
This project is organized into standard directories. Key configuration files and primary source code are located in the root directory.
