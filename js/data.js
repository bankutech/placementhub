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
        title: "Jenny's Lectures – Python Full Course (2025–26)",
        youtubeId: "PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Python Full Course",
        description: "Comprehensive Python course covering core concepts, loops, functions, OOPs, data structures, and placement questions by Jenny's Lectures."
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
    description: "Complete Data Structures, Algorithms, Core CS Subjects (OS, DBMS, CN), and Quantitative Aptitude for cracking campus & product placements.",
    roadmap: [
      { step: 1, title: "A2Z Data Structures & Algorithms", desc: "Arrays, Strings, Linked Lists, Stacks, Queues, Trees, BST, Graphs, Dynamic Programming." },
      { step: 2, title: "Core Computer Science Fundamentals", desc: "Operating Systems (Process, Threads, Memory), DBMS (SQL, Normalization, ACID), Computer Networks." },
      { step: 3, title: "Quantitative Aptitude Mastery", desc: "Percentages, Profit & Loss, Time & Work, Speed Distance & Time, Permutations & Combinations." },
      { step: 4, title: "Logical Reasoning & Data Interpretation", desc: "Blood relations, Syllogisms, Seating arrangement, Series, Tables and Bar Charts." },
      { step: 5, title: "Company-Specific Mock Rounds", desc: "TCS NQT, Infosys, Capgemini, Accenture, Cognizant, Wipro, and Tier-1 product test patterns." }
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
      },
      {
        id: "user-dsa-03",
        title: "Amit Khurana – Complete Aptitude & Reasoning",
        youtubeId: "PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLC36xJgs4dxE43Au1FGRQvwHTr7NbgDCS",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Aptitude & Reasoning",
        description: "Complete Quantitative Aptitude and Logical Reasoning syllabus for campus placements and competitive exams by Amit Khurana."
      },
      {
        id: "user-dsa-04",
        title: "CareerRide – Quantitative Aptitude",
        youtubeId: "PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLpyc33gOcbVA4qXMoQ5vmhefTruk5t9lt",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Quantitative Aptitude",
        description: "Speed math shortcuts, topic-wise solved placement test problems, and company aptitude test preparation by CareerRide."
      },
      {
        id: "user-dsa-05",
        title: "Placement Hub – Placement Coding & Aptitude Prep",
        youtubeId: "PL8p2I9GklV454LdGfDOw0KkNazKuA-6B2",
        youtubeUrl: "https://www.youtube.com/playlist?list=PL8p2I9GklV454LdGfDOw0KkNazKuA-6B2",
        duration: "Full Playlist",
        level: "Placement Ready",
        category: "Placement Coding",
        description: "Curated collection of campus placement coding questions, aptitude tests, and interview technical rounds."
      },
      {
        id: "user-dsa-06",
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
  // TRACK 6: ALL MY PLAYLISTS (USER CURATED COLLECTION)
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
        title: "Jenny's Lectures – Python Full Course (2025–26)",
        youtubeId: "PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLGjplNEQ1it8-0CmoljS5yeV-GlKSUEt0",
        duration: "Full Playlist",
        level: "All Levels",
        category: "Python Course",
        description: "Comprehensive Python course covering core concepts, loops, functions, OOPs, data structures, and placement questions by Jenny's Lectures."
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
// STARTER CODE TEMPLATES FOR THE LIVE CODE PLAYGROUND
// ----------------------------------------------------------------------------
const CODE_TEMPLATES = {
  java: `// Java Placement Coding Template
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("🚀 Welcome to Java Placement Prep!");
        
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        int[] result = twoSum(nums, target);
        System.out.println("Two Sum Indices: " + Arrays.toString(result));
    }
    
    // Two Sum - O(N) Hash Map Approach
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {-1, -1};
    }
}`,

  cpp: `// C++ Placement Coding Template
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

// Two Sum in C++ using unordered_map
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    cout << "⚡ C++ Placement Code Runner Ready!" << endl;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    vector<int> ans = twoSum(nums, target);
    if (!ans.empty()) {
        cout << "Indices found: [" << ans[0] << ", " << ans[1] << "]" << endl;
    }
    return 0;
}`,

  c: `// C Language Placement Template
#include <stdio.h>
#include <stdlib.h>

// Reverse an array in-place
void reverseArray(int arr[], int n) {
    int start = 0, end = n - 1;
    while (start < end) {
        int temp = arr[start];
        arr[start] = arr[end];
        arr[end] = temp;
        start++;
        end--;
    }
}

int main() {
    printf("🚀 C Language Placement Sandbox\\n");
    int arr[] = {10, 20, 30, 40, 50};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    reverseArray(arr, n);
    
    printf("Reversed Array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}`,

  python: `# Python Placement Prep Template
def two_sum(nums, target):
    """Find indices of two numbers that add up to target in O(N) time."""
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

if __name__ == "__main__":
    print("🐍 Python Placement Sandbox Ready!")
    numbers = [2, 7, 11, 15]
    target_sum = 9
    
    result = two_sum(numbers, target_sum)
    print(f"Target {target_sum} formed by indices: {result}")
`
};

// ----------------------------------------------------------------------------
// PLACEMENT INTERVIEW QUESTIONS DATABASE
// ----------------------------------------------------------------------------
const INTERVIEW_QUESTIONS = [
  // Java Questions
  {
    id: "iq-j-1",
    language: "java",
    title: "How does HashMap work internally in Java?",
    difficulty: "medium",
    category: "Collections",
    question: "Explain the internal structure of Java HashMap, hashing collision handling, and what changed in Java 8.",
    answer: "In Java, `HashMap` is an array of `Node<K,V>` (buckets). When `put(key, value)` is called:\n1. Hash of key is computed (`hash(key.hashCode())`) and mapped to an index `(n - 1) & hash`.\n2. If no collision occurs, it is stored in the bucket.\n3. In case of collision, entries are stored as a singly linked list.\n4. **Java 8 Optimization**: When bucket size reaches `TREEIFY_THRESHOLD` (8) and capacity >= 64, the linked list transforms into a Balanced Red-Black Tree, reducing lookup time from O(N) to O(log N).",
    code: `// Key parts of HashMap Node in Java 8:
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;
}`
  },
  {
    id: "iq-j-2",
    language: "java",
    title: "Difference between String, StringBuilder, and StringBuffer",
    difficulty: "easy",
    category: "Core Java",
    question: "Why is String immutable in Java and when should you use StringBuilder vs StringBuffer?",
    answer: "- **String**: Immutable. Stored in String Constant Pool (SCP). Any modification creates a new String object. Thread-safe by default.\n- **StringBuilder**: Mutable, not synchronized (faster, single-threaded operations).\n- **StringBuffer**: Mutable, synchronized (thread-safe, slower due to lock overhead).",
    code: `String s = "Hello";
s += " World"; // Creates a new object in memory

StringBuilder sb = new StringBuilder("Hello");
sb.append(" World"); // Modifies existing buffer (fast)`
  },
  {
    id: "iq-j-3",
    language: "java",
    title: "Explain the volatile keyword and Transient in Java",
    difficulty: "hard",
    category: "Multithreading & Serialization",
    question: "What is the purpose of the `volatile` modifier in Java concurrency, and how does it differ from `transient`?",
    answer: "- **volatile**: Guarantees visibility of variable changes across multiple threads by reading/writing directly to main memory instead of CPU cache. Does not guarantee atomicity.\n- **transient**: Prevents a field from being serialized when using Java ObjectOutputStream.",
    code: `public class Counter {
    private volatile boolean flag = true;
    private transient String password; // Will not be serialized
}`
  },

  // C++ Questions
  {
    id: "iq-cpp-1",
    language: "cpp",
    title: "What are Virtual Functions and the Vptr / Vtable mechanism in C++?",
    difficulty: "hard",
    category: "OOPs & Internals",
    question: "How does runtime polymorphism work in C++ using virtual tables?",
    answer: "When a class declares a `virtual` function:\n1. The compiler creates a static **vtable (virtual table)** containing function pointers to the most-derived implementations.\n2. Each object of that class gets a hidden pointer **vptr (virtual table pointer)** pointing to that vtable.\n3. At runtime, calls via base pointers dereference the `vptr` to invoke the correct derived function.",
    code: `class Base {
public:
    virtual void show() { cout << "Base show"; }
};

class Derived : public Base {
public:
    void show() override { cout << "Derived show"; }
};

Base* b = new Derived();
b->show(); // Output: Derived show (Dynamic Dispatch)`
  },
  {
    id: "iq-cpp-2",
    language: "cpp",
    title: "Difference between vector vs array and capacity vs size in C++ STL",
    difficulty: "easy",
    category: "STL",
    question: "How does dynamic resizing work in std::vector?",
    answer: "- **size()**: The actual number of elements present in the vector.\n- **capacity()**: The total allocated memory space before a new reallocation is required.\n- When size exceeds capacity, vector typically allocates **2x** the current capacity in a new memory block and copies existing elements (Amortized O(1) push_back).",
    code: `vector<int> v;
v.push_back(1);
cout << "Size: " << v.size() << " Capacity: " << v.capacity() << endl;`
  },

  // C Questions
  {
    id: "iq-c-1",
    language: "c",
    title: "Difference between `malloc()`, `calloc()`, `realloc()`, and `free()`",
    difficulty: "medium",
    category: "Memory Management",
    question: "Explain the differences in dynamic memory allocation functions in C and common pitfalls like dangling pointers.",
    answer: "- `malloc(size)`: Allocates uninitialized memory (contains garbage values).\n- `calloc(n, size)`: Allocates memory and initializes all bytes to zero (0).\n- `realloc(ptr, new_size)`: Resizes an existing allocated memory block, preserving data.\n- `free(ptr)`: Deallocates memory. **Tip**: Always set `ptr = NULL` after `free` to avoid dangling pointers.",
    code: `int *arr = (int*) calloc(5, sizeof(int)); // 5 integers initialized to 0
free(arr);
arr = NULL; // Safe practice`
  },
  {
    id: "iq-c-2",
    language: "c",
    title: "What are Storage Classes in C (auto, register, static, extern)?",
    difficulty: "medium",
    category: "Core C",
    question: "Explain the scope, lifetime, and storage location for all 4 C storage classes.",
    answer: "- **auto**: Default for local variables (Stack, local scope, block lifetime).\n- **register**: Hints to store variable in CPU register for fast access (no address `&` allowed).\n- **static**: Retains value between function calls (Data segment, file/local scope, program lifetime).\n- **extern**: Declares a global variable defined in another file.",
    code: `void counter() {
    static int count = 0; // Initialized once
    count++;
    printf("%d ", count);
}`
  },

  // Python Questions
  {
    id: "iq-py-1",
    language: "python",
    title: "What is GIL (Global Interpreter Lock) in Python and how to bypass it?",
    difficulty: "hard",
    category: "Python Internals",
    question: "Explain Python GIL, why it exists in CPython, and how to achieve true parallelism in Python.",
    answer: "The **GIL (Global Interpreter Lock)** is a mutex in CPython that allows only one native thread to execute Python bytecode at a time, ensuring memory safety for reference counting.\n- **Consequence**: Python multi-threading is great for I/O bound tasks, but cannot use multi-core CPUs for CPU-bound tasks.\n- **Solution**: Use the `multiprocessing` module (creates separate processes with separate Python interpreters and GILs) or Celery.",
    code: `from multiprocessing import Process

def compute_heavy(n):
    return sum(i * i for i in range(n))

# Uses multiple CPU cores concurrently
p1 = Process(target=compute_heavy, args=(10000000,))
p1.start()`
  },
  {
    id: "iq-py-2",
    language: "python",
    title: "Difference between `is` and `==`, and shallow vs deep copy in Python",
    difficulty: "easy",
    category: "Python Basics",
    question: "Explain the difference between value equality vs identity equality, and `copy.copy` vs `copy.deepcopy`.",
    answer: "- `==` checks for **equality of values**.\n- `is` checks for **identity of memory addresses** (`id(a) == id(b)`).\n- `copy.copy(obj)`: Creates a shallow copy (nested references are shared).\n- `copy.deepcopy(obj)`: Creates a recursive full copy of the object and all nested children.",
    code: `import copy
a = [1, [2, 3]]
b = copy.deepcopy(a)
b[1][0] = 99
print(a) # Output: [1, [2, 3]] (Untouched)`
  },

  // DSA Questions
  {
    id: "iq-dsa-1",
    language: "dsa",
    title: "How to detect a cycle in a Linked List (Floyd's Tortoise and Hare)?",
    difficulty: "medium",
    category: "Linked Lists",
    question: "Explain the algorithm to detect if a linked list has a loop with O(1) auxiliary space.",
    answer: "Use two pointers:\n1. Initialize `slow = head` and `fast = head`.\n2. In each step, move `slow` by 1 node and `fast` by 2 nodes.\n3. If `fast == slow` at any point, a cycle exists!\n4. If `fast` or `fast.next` reaches `null`, the list is linear (no cycle).",
    code: `public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`
  },
  {
    id: "iq-dsa-2",
    language: "dsa",
    title: "Kadane's Algorithm for Maximum Subarray Sum",
    difficulty: "medium",
    category: "Dynamic Programming / Arrays",
    question: "Find the contiguous subarray with the largest sum in O(N) time and O(1) space.",
    answer: "Maintain two variables:\n- `currentSum`: Maximum sum ending at the current index (`max(nums[i], currentSum + nums[i])`).\n- `maxSum`: Global maximum observed so far.",
    code: `def max_sub_array(nums):
    max_sum = current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum`
  }
];
