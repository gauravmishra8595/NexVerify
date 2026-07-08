"""
Static fallback question banks, used only when AI generation fails
(missing/invalid API key, rate limit, network error, malformed response).
Keeps the assessment flow usable even if Gemini is unavailable.
"""

FALLBACK_DSA_QUESTIONS = [
    {
        "id": 1,
        "question": "What is the time complexity of binary search on a sorted array?",
        "options": ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        "answer": "O(log n)",
        "difficulty": "Easy",
    },
    {
        "id": 2,
        "question": "Which data structure uses LIFO (Last In First Out) order?",
        "options": ["Queue", "Stack", "Linked List", "Tree"],
        "answer": "Stack",
        "difficulty": "Easy",
    },
    {
        "id": 3,
        "question": "What is the worst-case time complexity of quicksort?",
        "options": ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"],
        "answer": "O(n^2)",
        "difficulty": "Medium",
    },
    {
        "id": 4,
        "question": "In a singly linked list, what is the time complexity to insert at the head?",
        "options": ["O(n)", "O(log n)", "O(1)", "O(n^2)"],
        "answer": "O(1)",
        "difficulty": "Easy",
    },
    {
        "id": 5,
        "question": "Which traversal of a binary tree visits the root node first?",
        "options": ["In-order", "Post-order", "Pre-order", "Level-order"],
        "answer": "Pre-order",
        "difficulty": "Medium",
    },
    {
        "id": 6,
        "question": "What is the space complexity of an adjacency matrix for a graph with V vertices?",
        "options": ["O(V)", "O(V + E)", "O(V^2)", "O(E)"],
        "answer": "O(V^2)",
        "difficulty": "Medium",
    },
    {
        "id": 7,
        "question": "Which technique does dynamic programming primarily rely on?",
        "options": ["Brute force", "Divide and conquer only", "Overlapping subproblems and memoization", "Random sampling"],
        "answer": "Overlapping subproblems and memoization",
        "difficulty": "Medium",
    },
    {
        "id": 8,
        "question": "What is the time complexity of inserting into a hash table on average?",
        "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        "answer": "O(1)",
        "difficulty": "Easy",
    },
    {
        "id": 9,
        "question": "Which algorithm is a classic example of the greedy approach?",
        "options": ["Merge Sort", "Dijkstra's Algorithm", "Quick Sort", "Binary Search"],
        "answer": "Dijkstra's Algorithm",
        "difficulty": "Hard",
    },
    {
        "id": 10,
        "question": "What does BST stand for in the context of trees?",
        "options": ["Balanced Search Tree", "Binary Search Tree", "Basic Sort Tree", "Binary Sum Tree"],
        "answer": "Binary Search Tree",
        "difficulty": "Easy",
    },
]


FALLBACK_APTITUDE_QUESTIONS = [
    {
        "id": 1,
        "question": "A train travels 120 km in 2 hours. What is its average speed?",
        "options": ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
        "answer": "60 km/h",
        "difficulty": "Easy",
    },
    {
        "id": 2,
        "question": "If the cost price of an item is Rs.800 and it is sold for Rs.920, what is the profit percentage?",
        "options": ["10%", "12%", "15%", "20%"],
        "answer": "15%",
        "difficulty": "Easy",
    },
    {
        "id": 3,
        "question": "Find the next number in the series: 2, 6, 12, 20, 30, ?",
        "options": ["40", "42", "44", "48"],
        "answer": "42",
        "difficulty": "Medium",
    },
    {
        "id": 4,
        "question": "A sum of money doubles itself in 5 years at simple interest. What is the annual rate of interest?",
        "options": ["10%", "15%", "20%", "25%"],
        "answer": "20%",
        "difficulty": "Medium",
    },
    {
        "id": 5,
        "question": "If A can complete a task in 12 days and B in 18 days, together they finish it in:",
        "options": ["6 days", "7.2 days", "8 days", "9 days"],
        "answer": "7.2 days",
        "difficulty": "Medium",
    },
    {
        "id": 6,
        "question": "Find the missing number: 5, 10, 20, 40, 80, ?",
        "options": ["120", "140", "150", "160"],
        "answer": "160",
        "difficulty": "Easy",
    },
    {
        "id": 7,
        "question": "If the ratio of boys to girls is 3:2 and there are 120 students, how many girls are there?",
        "options": ["42", "48", "50", "54"],
        "answer": "48",
        "difficulty": "Easy",
    },
    {
        "id": 8,
        "question": "A man walks 15 km north, then 20 km east. How far is he from the starting point?",
        "options": ["20 km", "25 km", "30 km", "35 km"],
        "answer": "25 km",
        "difficulty": "Medium",
    },
    {
        "id": 9,
        "question": "The probability of getting a head when tossing a fair coin is:",
        "options": ["0", "1/4", "1/2", "1"],
        "answer": "1/2",
        "difficulty": "Easy",
    },
    {
        "id": 10,
        "question": "The LCM of 12 and 18 is:",
        "options": ["24", "30", "36", "48"],
        "answer": "36",
        "difficulty": "Easy",
    },
]
