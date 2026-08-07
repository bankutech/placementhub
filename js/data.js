/* ==========================================================================
   PLACEMENT LEARNING PORTAL - USER PLAYLISTS DATABASE
   Strictly Curated: Contains ONLY user-provided courses and playlists.
   ========================================================================== */

const INITIAL_PLACEMENT_DATA = {
  // --------------------------------------------------------------------------
  // TRACK 1: JAVA PLACEMENT TRACK
  // --------------------------------------------------------------------------
  java: {
    id: "java",
    name: "Java Placement Track",
    icon: "fa-brands fa-java",
    color: "var(--track-java)",
    badge: "Core to Advanced",
    description: "Complete Java masterclass for software engineering & campus placement interviews, covering OOPs, Collections, Multithreading, and DSA in Java.",
    roadmap: [
      { step: 1, title: "Java Fundamentals & JVM", desc: "Data types, operators, control flow, JVM architecture, Memory areas (Heap vs Stack)." },
      { step: 2, title: "Object-Oriented Programming (OOPs)", desc: "Encapsulation, Inheritance, Polymorphism, Abstraction, Interfaces, Abstract classes." },
      { step: 3, title: "Java Collections Framework", desc: "List, Set, Map, Queue implementations, Comparator vs Comparable, Internal working of HashMap." },
      { step: 4, title: "Multithreading & Concurrency", desc: "Thread lifecycle, Runnable, synchronized keyword, Deadlocks, ExecutorService." },
      { step: 5, title: "Java 8+ Features & Placement Coding", desc: "Lambda expressions, Streams API, Optional class, Top LeetCode Java problems." }
    ],
    videos: [
      {
        id: "user-java-01",
        title: "Kunal Kushwaha – Complete Java & DSA Bootcamp",
        youtubeId: "PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
        youtubeUrl: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
        duration: "Full Bootcamp",
        level: "All Levels",
        category: "Java & DSA",
        description: "World-class complete Java and Data Structures & Algorithms Bootcamp covering everything from basics to advanced trees, graphs, and dynamic programming."
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TRACK 2: C++ & STL PLACEMENT TRACK
  // --------------------------------------------------------------------------
  cpp: {
    id: "cpp",
    name: "C++ & STL Placement Track",
    icon: "fa-solid fa-code",
    color: "var(--track-cpp)",
    badge: "Fast & Competitive",
    description: "C++ with Standard Template Library (STL), memory management, OOPs, and competitive programming techniques for placement coding rounds.",
    roadmap: [
      { step: 1, title: "Modern C++ Core Syntax", desc: "Variables, fast I/O, loops, functions, references vs pointers." },
      { step: 2, title: "Pointers & Dynamic Memory", desc: "Pointers, dynamic allocation with new/delete, memory leaks, smart pointers." },
      { step: 3, title: "C++ Object Oriented Programming", desc: "Classes, constructors/destructors, virtual functions, friend classes, operator overloading." },
      { step: 4, title: "Mastering STL Containers & Algorithms", desc: "vector, pair, map, unordered_map, set, priority_queue, sort, lower_bound, upper_bound." },
      { step: 5, title: "Placement Problem Solving", desc: "Time complexity analysis, Bit manipulation, sliding window, and two-pointer patterns." }
    ],
    videos: [
      {
        id: "user-cpp-01",
        title: "Apna College – C++ & DSA",
        youtubeId: "PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt",
        duration: "Full Playlist",
        level: "All Levels",
        category: "C++ & DSA",
        description: "Complete DSA practice series in C++ by Apna College with arrays, pointers, strings, binary search, sorting, and interview question solutions."
      },
      {
        id: "user-cpp-02",
        title: "C++ STL Complete Tutorial | Standard Template Library - One Shot",
        youtubeId: "okhdtEk1iKk",
        youtubeUrl: "https://www.youtube.com/watch?v=okhdtEk1iKk",
        duration: "Full Video",
        level: "All Levels",
        category: "C++ & STL",
        description: "Complete Standard Template Library (STL) tutorial in C++ by Apna College in one shot."
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TRACK 3: C PROGRAMMING TRACK
  // --------------------------------------------------------------------------
  c: {
    id: "c",
    name: "C Programming Track",
    icon: "fa-solid fa-c",
    color: "var(--track-c)",
    badge: "Core Foundation",
    description: "C programming fundamentals, pointers, struct, bit manipulation, and memory management required for technical MCQs and core company tests.",
    roadmap: [
      { step: 1, title: "C Basics & Operators", desc: "Data types, format specifiers, operators, precedence, loops, conditionals." },
      { step: 2, title: "Arrays, Strings & Pointers", desc: "1D/2D arrays, string manipulation functions (strcpy, strcmp), pointer arithmetic." },
      { step: 3, title: "Dynamic Memory Allocation", desc: "malloc, calloc, realloc, free, dangling pointers, memory leaks." },
      { step: 4, title: "Structures, Unions & Preprocessors", desc: "struct padding, typedef, unions, bit-fields, macros and preprocessor directives." },
      { step: 5, title: "Placement C Output MCQs", desc: "Tricky pointer questions, recursion outputs, storage classes (static, extern, register, auto)." }
    ],
    videos: [
      {
        id: "user-c-01",
        title: "Apna College – C Language (10.5 Hours)",
        youtubeId: "irqbmMNs2Bo",
        youtubeUrl: "https://www.youtube.com/watch?v=irqbmMNs2Bo",
        duration: "10:32:00",
        level: "Beginner to Pro",
        category: "C Masterclass",
        description: "10.5-hour complete C programming course covering fundamentals, pointers, dynamic memory allocation, structs, arrays, and interview questions by Apna College."
      },
      {
        id: "user-c-02",
        title: "Neso Academy – C Programming",
        youtubeId: "PLBlnK6fEyqRhMP7gwIe2j0hb1PCvYn0RI",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRhMP7gwIe2j0hb1PCvYn0RI",
        duration: "Full Playlist",
        level: "All Levels",
        category: "C Programming",
        description: "Comprehensive C programming lectures covering basics, pointers, recursion, data structures in C, and tricky placement interview MCQs."
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TRACK 4: PYTHON PLACEMENT TRACK
  // --------------------------------------------------------------------------
  python: {
    id: "python",
    name: "Python Placement Track",
    icon: "fa-brands fa-python",
    color: "var(--track-python)",
    badge: "Versatile & In-Demand",
    description: "Python 3 core mastery, data structures, list comprehensions, OOPs, generators, and algorithm problem-solving for coding interviews.",
    roadmap: [
      { step: 1, title: "Python Core & Idiomatic Syntax", desc: "Data types, slicing, list comprehensions, dictionaries, sets, tuples, unpacking." },
      { step: 2, title: "Functions & Functional Tools", desc: "args/kwargs, lambda, map, filter, decorators, generators, iterators." },
      { step: 3, title: "Object-Oriented Python", desc: "Classes, dunder methods (__init__, __str__, __repr__), inheritance, property decorators." },
      { step: 4, title: "Built-in Modules & Collections", desc: "collections (Counter, defaultdict, deque), itertools, heapq, bisect, math." },
      { step: 5, title: "Placement Problem Solving in Python", desc: "Strings, HashMaps, Two Pointers, BFS/DFS, and Top 50 LeetCode Python solutions." }
    ],
    videos: [
      {
        id: "user-py-01",
        title: "Shradha Khapra (Apna College) – Python Full Course",
        youtubeId: "PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Python Full Course",
        description: "Comprehensive Python course covering core concepts, loops, functions, OOPs, data structures, and placement questions by Shradha Khapra."
      },
      {
        id: "user-py-02",
        title: "Neso Academy – Python Programming",
        youtubeId: "PLBlnK6fEyqRiueC_HzwFallNO76hfXBB7",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiueC_HzwFallNO76hfXBB7",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Python Programming",
        description: "In-depth Python programming lecture series by Neso Academy with conceptual theory, syntax breakdown, and practical examples."
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TRACK 5: DSA, CS & APTITUDE PLACEMENT TRACK
  // --------------------------------------------------------------------------
  dsa: {
    id: "dsa",
    name: "DSA & Placement Track",
    icon: "fa-solid fa-diagram-project",
    color: "var(--track-dsa)",
    badge: "Interview Essential",
    description: "Complete Data Structures, Algorithms, and Core CS Subjects (OS, DBMS, CN) for cracking campus & product placements.",
    roadmap: [
      { step: 1, title: "A2Z Data Structures & Algorithms", desc: "Arrays, Strings, Linked Lists, Stacks, Queues, Trees, BST, Graphs, Dynamic Programming." },
      { step: 2, title: "Core Computer Science Fundamentals", desc: "Operating Systems (Process, Threads, Memory), DBMS (SQL, Normalization, ACID), Computer Networks." },
      { step: 3, title: "Company-Specific Mock Rounds", desc: "TCS NQT, Infosys, Capgemini, Accenture, Cognizant, Wipro, and Tier-1 product test patterns." }
    ],
    videos: [
      {
        id: "user-dsa-01",
        title: "Striver's A2Z DSA Course & Placement Series",
        youtubeId: "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
        duration: "Full Course",
        level: "All Levels",
        category: "A2Z DSA",
        description: "Complete A2Z Data Structures & Algorithms placement sheet course by Striver (takeUforward) covering arrays, trees, graphs, and dynamic programming."
      },
      {
        id: "user-dsa-02",
        title: "Neso Academy – Core Engineering / OS / CN / DBMS",
        youtubeId: "PLBlnK6fEyqRhgMzWqbZXXd8TrBXtQiV3l",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRhgMzWqbZXXd8TrBXtQiV3l",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Core CS / OS",
        description: "Comprehensive engineering curriculum, Digital Logic, OS, Network basics, and placement preparation series by Neso Academy."
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TRACK 6: APTITUDE & REASONING
  // --------------------------------------------------------------------------
  aptitude: {
    id: "aptitude",
    name: "Aptitude Track",
    icon: "fa-solid fa-brain",
    color: "var(--track-aptitude)",
    badge: "Logical Thinking",
    description: "Master Quantitative Aptitude, Logical Reasoning, and Data Interpretation for cracking initial campus screening rounds.",
    roadmap: [
      { step: 1, title: "Quantitative Aptitude Mastery", desc: "Percentages, Profit & Loss, Time & Work, Speed Distance & Time, Permutations & Combinations." },
      { step: 2, title: "Logical Reasoning & Data Interpretation", desc: "Blood relations, Syllogisms, Seating arrangement, Series, Tables and Bar Charts." },
      { step: 3, title: "Company Aptitude Tests", desc: "TCS NQT, Infosys, Capgemini, Accenture, Cognizant, Wipro aptitude patterns." }
    ],
    videos: [
      {
        id: "user-aptitude-01",
        title: "Amit Khurana – Complete Aptitude & Reasoning",
        youtubeId: "PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Aptitude & Reasoning",
        description: "Complete Quantitative Aptitude and Logical Reasoning syllabus for campus placements and competitive exams by Amit Khurana."
      },
      {
        id: "user-aptitude-02",
        title: "CareerRide – Quantitative Aptitude",
        youtubeId: "PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Quantitative Aptitude",
        description: "Speed math shortcuts, topic-wise solved placement test problems, and company aptitude test preparation by CareerRide."
      },
      {
        id: "user-aptitude-03",
        title: "Placement Hub – Placement Coding & Aptitude Prep",
        youtubeId: "PL8p2I9GklV454LdGfDOw0KkNazKuA-6B2",
        youtubeUrl: "https://www.youtube.com/playlist?list=PL8p2I9GklV454LdGfDOw0KkNazKuA-6B2",
        duration: "Full Playlist",
        level: "Placement Ready",
        category: "Placement Coding",
        description: "Curated collection of campus placement coding questions, aptitude tests, and interview technical rounds."
      },
      {
        id: "user-aptitude-04",
        title: "Placement Masterclass – Placement & Coding",
        youtubeId: "PLBG_hRMQjgpwN2WhFoFZG_jad1fLgKSnZ",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLBG_hRMQjgpwN2WhFoFZG_jad1fLgKSnZ",
        duration: "Full Playlist",
        level: "Placement Ready",
        category: "Placement Preparation",
        description: "Comprehensive placement preparation video series with core programming concepts and problem solving."
      }
    ]
  },

  // --------------------------------------------------------------------------
  // TRACK 7: ALL MY PLAYLISTS (USER CURATED COLLECTION)
  // --------------------------------------------------------------------------
  custom: {
    id: "custom",
    name: "My Playlists",
    icon: "fa-solid fa-star",
    color: "var(--track-custom)",
    badge: "My Curated Courses",
    description: "Your complete personal collection of all 12 curated YouTube playlists and courses for comprehensive placement readiness.",
    roadmap: [
      { step: 1, title: "Select a Course", desc: "Browse your saved YouTube courses in the playlist sidebar." },
      { step: 2, title: "Learn & Take Timestamped Notes", desc: "Watch without opening new tabs, save key concepts, and run simulated code." },
      { step: 3, title: "Add New Playlists Anytime", desc: "Click '+ Add Video / Link' above to expand your personal library anytime." }
    ],
    videos: [
      {
        id: "custom-01",
        title: "Striver's A2Z DSA Course & Placement Series",
        youtubeId: "PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz",
        duration: "Full Course",
        level: "All Levels",
        category: "A2Z DSA",
        description: "Complete A2Z Data Structures & Algorithms placement sheet course by Striver (takeUforward) covering arrays, trees, graphs, and dynamic programming."
      },
      {
        id: "custom-02",
        title: "Kunal Kushwaha – Complete Java & DSA Bootcamp",
        youtubeId: "PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
        youtubeUrl: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
        duration: "Full Bootcamp",
        level: "All Levels",
        category: "Java & DSA",
        description: "World-class complete Java and Data Structures & Algorithms Bootcamp covering everything from basics to advanced trees, graphs, and dynamic programming."
      },
      {
        id: "custom-03",
        title: "Neso Academy – Core Engineering / OS / CN / DBMS",
        youtubeId: "PLBlnK6fEyqRhgMzWqbZXXd8TrBXtQiV3l",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRhgMzWqbZXXd8TrBXtQiV3l",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Core CS / OS",
        description: "Engineering curriculum and placement preparation series by Neso Academy."
      },
      {
        id: "custom-04",
        title: "Amit Khurana – Complete Aptitude & Reasoning",
        youtubeId: "PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Aptitude & Reasoning",
        description: "Complete Quantitative Aptitude and Logical Reasoning syllabus for campus placements and competitive exams by Amit Khurana."
      },
      {
        id: "custom-05",
        title: "Placement Hub – Placement Coding & Aptitude Prep",
        youtubeId: "PL8p2I9GklV454LdGfDOw0KkNazKuA-6B2",
        youtubeUrl: "https://www.youtube.com/playlist?list=PL8p2I9GklV454LdGfDOw0KkNazKuA-6B2",
        duration: "Full Playlist",
        level: "Placement Ready",
        category: "Placement Coding",
        description: "Curated collection of campus placement coding questions, aptitude tests, and interview technical rounds."
      },
      {
        id: "custom-06",
        title: "Shradha Khapra (Apna College) – Python Full Course",
        youtubeId: "PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Python Course",
        description: "Comprehensive Python course covering core concepts, loops, functions, OOPs, data structures, and placement questions by Shradha Khapra."
      },
      {
        id: "custom-07",
        title: "Neso Academy – Python Programming",
        youtubeId: "PLBlnK6fEyqRiueC_HzwFallNO76hfXBB7",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiueC_HzwFallNO76hfXBB7",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Python Programming",
        description: "Comprehensive Python programming lecture series by Neso Academy."
      },
      {
        id: "custom-08",
        title: "Apna College – C++ & DSA",
        youtubeId: "PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt",
        duration: "Full Playlist",
        level: "All Levels",
        category: "C++ & DSA",
        description: "Apna College Data Structures and Algorithms complete practice playlist for placements and internships."
      },
      {
        id: "custom-08b",
        title: "C++ STL Complete Tutorial | Standard Template Library - One Shot",
        youtubeId: "okhdtEk1iKk",
        youtubeUrl: "https://www.youtube.com/watch?v=okhdtEk1iKk",
        duration: "Full Video",
        level: "All Levels",
        category: "C++ & STL",
        description: "Complete Standard Template Library (STL) tutorial in C++ by Apna College in one shot."
      },
      {
        id: "custom-09",
        title: "Neso Academy – C Programming",
        youtubeId: "PLBlnK6fEyqRhMP7gwIe2j0hb1PCvYn0RI",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRhMP7gwIe2j0hb1PCvYn0RI",
        duration: "Full Playlist",
        level: "All Levels",
        category: "C Programming",
        description: "Comprehensive C programming lectures covering basics, pointers, recursion, data structures in C, and tricky placement interview MCQs."
      },
      {
        id: "custom-10",
        title: "Apna College – C Language (10.5 Hours)",
        youtubeId: "irqbmMNs2Bo",
        youtubeUrl: "https://www.youtube.com/watch?v=irqbmMNs2Bo",
        duration: "10:32:00",
        level: "Beginner to Pro",
        category: "C Programming",
        description: "10.5-hour complete C programming course covering fundamentals, pointers, memory allocation, arrays, and interview questions by Apna College."
      },
      {
        id: "custom-11",
        title: "CareerRide – Quantitative Aptitude",
        youtubeId: "PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Quantitative Aptitude",
        description: "Speed math shortcuts, topic-wise solved placement test problems, and company aptitude test preparation by CareerRide."
      },
      {
        id: "custom-12",
        title: "Placement Masterclass – Placement & Coding",
        youtubeId: "PLBG_hRMQjgpwN2WhFoFZG_jad1fLgKSnZ",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLBG_hRMQjgpwN2WhFoFZG_jad1fLgKSnZ",
        duration: "Full Playlist",
        level: "Placement Ready",
        category: "Placement Preparation",
        description: "Comprehensive placement preparation video series with core concepts and problem solving."
      }
    ]
  }
};

// ----------------------------------------------------------------------------
// Set of every video ID that ships as part of the built-in curriculum
// (used to tell "default" videos apart from ones the user added, instead of
// relying on ID naming conventions which can collide — see DEFAULT_VIDEO_IDS
// usage in app.js / playlistManager.js)
// ----------------------------------------------------------------------------
const DEFAULT_VIDEO_IDS = new Set(
  Object.values(INITIAL_PLACEMENT_DATA).flatMap(track => (track.videos || []).map(v => v.id))
);

// ----------------------------------------------------------------------------
// Shared HTML-escaping helper — every place that injects user- or
// third-party-supplied text (video titles, categories, playlist item titles
// pulled from the YouTube API, etc.) into innerHTML MUST run it through this
// first to prevent stored XSS.
// ----------------------------------------------------------------------------
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
