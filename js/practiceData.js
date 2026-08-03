/* ==========================================================================
   PLACEMENTHUB - CURATED PRACTICE PROBLEMS DATABASE (LEETCODE / GFG)
   Categorized by Topic & Difficulty for High-Frequency Placement Interviews
   ========================================================================== */

const PRACTICE_PROBLEMS_DATA = [
  // --- ARRAYS & VECTORS ---
  {
    id: "prob-arr-01",
    title: "Two Sum",
    topic: "Arrays",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/two-sum/",
    companies: ["Amazon", "Google", "Microsoft", "TCS", "Infosys"]
  },
  {
    id: "prob-arr-02",
    title: "Best Time to Buy and Sell Stock",
    topic: "Arrays",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    companies: ["Amazon", "Microsoft", "Paytm", "Cognizant"]
  },
  {
    id: "prob-arr-03",
    title: "Maximum Subarray (Kadane's Algorithm)",
    topic: "Arrays",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/maximum-subarray/",
    companies: ["Amazon", "Microsoft", "Adobe", "Samsung"]
  },
  {
    id: "prob-arr-04",
    title: "Sort an Array of 0s, 1s, and 2s (Dutch National Flag)",
    topic: "Arrays",
    track: "all",
    difficulty: "Medium",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1",
    companies: ["Microsoft", "Paytm", "Snapdeal", "Wipro"]
  },
  {
    id: "prob-arr-05",
    title: "Next Permutation",
    topic: "Arrays",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/next-permutation/",
    companies: ["Google", "Amazon", "Microsoft"]
  },
  {
    id: "prob-arr-06",
    title: "Trapping Rain Water",
    topic: "Arrays",
    track: "all",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/trapping-rain-water/",
    companies: ["Amazon", "Google", "Adobe", "Microsoft"]
  },

  // --- STRINGS ---
  {
    id: "prob-str-01",
    title: "Valid Palindrome",
    topic: "Strings",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/valid-palindrome/",
    companies: ["Microsoft", "Amazon", "TCS", "Accenture"]
  },
  {
    id: "prob-str-02",
    title: "Valid Anagram",
    topic: "Strings",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/valid-anagram/",
    companies: ["Amazon", "Uber", "Cognizant"]
  },
  {
    id: "prob-str-03",
    title: "Longest Substring Without Repeating Characters",
    topic: "Strings",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    companies: ["Amazon", "Google", "Bloomberg", "Adobe"]
  },
  {
    id: "prob-str-04",
    title: "Longest Palindromic Substring",
    topic: "Strings",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/longest-palindromic-substring/",
    companies: ["Amazon", "Microsoft", "Goldman Sachs"]
  },
  {
    id: "prob-str-05",
    title: "Reverse Words in a String",
    topic: "Strings",
    track: "all",
    difficulty: "Medium",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/reverse-words-in-a-given-string5459/1",
    companies: ["Paytm", "Accenture", "Infosys", "Cisco"]
  },

  // --- TWO POINTERS & SLIDING WINDOW ---
  {
    id: "prob-tp-01",
    title: "3Sum",
    topic: "Two Pointers",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/3sum/",
    companies: ["Amazon", "Microsoft", "Meta", "Google"]
  },
  {
    id: "prob-tp-02",
    title: "Container With Most Water",
    topic: "Two Pointers",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/container-with-most-water/",
    companies: ["Google", "Amazon", "Adobe"]
  },
  {
    id: "prob-tp-03",
    title: "Minimum Window Substring",
    topic: "Two Pointers",
    track: "all",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/minimum-window-substring/",
    companies: ["Google", "Uber", "Meta", "Amazon"]
  },

  // --- LINKED LISTS ---
  {
    id: "prob-ll-01",
    title: "Reverse a Linked List",
    topic: "Linked List",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/reverse-linked-list/",
    companies: ["Microsoft", "Amazon", "Infosys", "TCS"]
  },
  {
    id: "prob-ll-02",
    title: "Detect Loop in Linked List (Floyd's Cycle)",
    topic: "Linked List",
    track: "all",
    difficulty: "Easy",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1",
    companies: ["Paytm", "Qualcomm", "Amazon", "Oracle"]
  },
  {
    id: "prob-ll-03",
    title: "Merge Two Sorted Lists",
    topic: "Linked List",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/merge-two-sorted-lists/",
    companies: ["Amazon", "Apple", "Microsoft"]
  },
  {
    id: "prob-ll-04",
    title: "Remove Nth Node From End of List",
    topic: "Linked List",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    companies: ["Adobe", "Amazon", "Microsoft"]
  },
  {
    id: "prob-ll-05",
    title: "LRU Cache",
    topic: "Linked List",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/lru-cache/",
    companies: ["Amazon", "Microsoft", "Google", "Flipkart"]
  },

  // --- STACKS & QUEUES ---
  {
    id: "prob-stk-01",
    title: "Valid Parentheses",
    topic: "Stack & Queue",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/valid-parentheses/",
    companies: ["Amazon", "Google", "Microsoft", "Infosys"]
  },
  {
    id: "prob-stk-02",
    title: "Next Greater Element I",
    topic: "Stack & Queue",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/next-greater-element-i/",
    companies: ["Amazon", "Flipkart", "Accenture"]
  },
  {
    id: "prob-stk-03",
    title: "Min Stack (O(1) retrieval)",
    topic: "Stack & Queue",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/min-stack/",
    companies: ["Amazon", "Bloomberg", "Goldman Sachs"]
  },
  {
    id: "prob-stk-04",
    title: "Largest Rectangle in Histogram",
    topic: "Stack & Queue",
    track: "all",
    difficulty: "Hard",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    companies: ["Amazon", "Microsoft", "Google"]
  },

  // --- TREES & BINARY SEARCH TREES ---
  {
    id: "prob-tree-01",
    title: "Maximum Depth of Binary Tree",
    topic: "Binary Trees",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    companies: ["Google", "Amazon", "Infosys"]
  },
  {
    id: "prob-tree-02",
    title: "Invert Binary Tree",
    topic: "Binary Trees",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/invert-binary-tree/",
    companies: ["Google", "Amazon", "Microsoft"]
  },
  {
    id: "prob-tree-03",
    title: "Diameter of Binary Tree",
    topic: "Binary Trees",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/diameter-of-binary-tree/",
    companies: ["Amazon", "Meta", "Adobe"]
  },
  {
    id: "prob-tree-04",
    title: "Binary Tree Level Order Traversal (BFS)",
    topic: "Binary Trees",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    companies: ["Amazon", "Microsoft", "Walmart"]
  },
  {
    id: "prob-tree-05",
    title: "Lowest Common Ancestor in a BST",
    topic: "Binary Trees",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    companies: ["Amazon", "Twitter", "Oracle"]
  },
  {
    id: "prob-tree-06",
    title: "Validate Binary Search Tree",
    topic: "Binary Trees",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/validate-binary-search-tree/",
    companies: ["Amazon", "Microsoft", "Meta"]
  },

  // --- DYNAMIC PROGRAMMING ---
  {
    id: "prob-dp-01",
    title: "Climbing Stairs",
    topic: "Dynamic Programming",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/climbing-stairs/",
    companies: ["Amazon", "Adobe", "TCS", "Accenture"]
  },
  {
    id: "prob-dp-02",
    title: "Coin Change (Fewest coins to make amount)",
    topic: "Dynamic Programming",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/coin-change/",
    companies: ["Amazon", "Microsoft", "Paytm", "Uber"]
  },
  {
    id: "prob-dp-03",
    title: "Longest Increasing Subsequence (LIS)",
    topic: "Dynamic Programming",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/longest-increasing-subsequence/",
    companies: ["Amazon", "Microsoft", "Google"]
  },
  {
    id: "prob-dp-04",
    title: "0/1 Knapsack Problem",
    topic: "Dynamic Programming",
    track: "all",
    difficulty: "Medium",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1",
    companies: ["Flipkart", "Directi", "Amazon", "Microsoft"]
  },
  {
    id: "prob-dp-05",
    title: "Longest Common Subsequence (LCS)",
    topic: "Dynamic Programming",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/longest-common-subsequence/",
    companies: ["Amazon", "Microsoft", "Adobe"]
  },
  {
    id: "prob-dp-06",
    title: "Word Break",
    topic: "Dynamic Programming",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/word-break/",
    companies: ["Google", "Amazon", "Meta", "Uber"]
  },

  // --- GRAPHS ---
  {
    id: "prob-grp-01",
    title: "Number of Islands (BFS/DFS)",
    topic: "Graphs",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/number-of-islands/",
    companies: ["Amazon", "Google", "Microsoft", "Meta"]
  },
  {
    id: "prob-grp-02",
    title: "Clone Graph",
    topic: "Graphs",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/clone-graph/",
    companies: ["Meta", "Amazon", "Google"]
  },
  {
    id: "prob-grp-03",
    title: "Course Schedule (Topological Sort / Cycle Detection)",
    topic: "Graphs",
    track: "all",
    difficulty: "Medium",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/course-schedule/",
    companies: ["Google", "Amazon", "Microsoft"]
  },
  {
    id: "prob-grp-04",
    title: "Dijkstra's Shortest Path Algorithm",
    topic: "Graphs",
    track: "all",
    difficulty: "Medium",
    platform: "GFG",
    url: "https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1",
    companies: ["Cisco", "Flipkart", "Microsoft"]
  },

  // --- BIT MANIPULATION & MATH ---
  {
    id: "prob-bit-01",
    title: "Single Number (XOR Trick)",
    topic: "Bit Manipulation",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/single-number/",
    companies: ["Amazon", "TCS", "Cognizant"]
  },
  {
    id: "prob-bit-02",
    title: "Counting Bits",
    topic: "Bit Manipulation",
    track: "all",
    difficulty: "Easy",
    platform: "LeetCode",
    url: "https://leetcode.com/problems/counting-bits/",
    companies: ["Adobe", "Amazon"]
  }
];

if (typeof window !== 'undefined') {
  window.PRACTICE_PROBLEMS_DATA = PRACTICE_PROBLEMS_DATA;
}
