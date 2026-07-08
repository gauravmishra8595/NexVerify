export interface AptitudeQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const demoAptitudeQuestions: AptitudeQuestion[] = [
  {
    id: 1,
    question:
      "A train travels 120 km in 2 hours. What is its average speed?",
    options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
    answer: "60 km/h",
    difficulty: "Easy",
  },
  {
    id: 2,
    question:
      "If the cost price of an item is ₹800 and it is sold for ₹920, what is the profit percentage?",
    options: ["10%", "12%", "15%", "20%"],
    answer: "15%",
    difficulty: "Easy",
  },
  {
    id: 3,
    question:
      "Find the next number in the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "48"],
    answer: "42",
    difficulty: "Medium",
  },
  {
    id: 4,
    question:
      "A sum of money doubles itself in 5 years at simple interest. What is the annual rate of interest?",
    options: ["10%", "15%", "20%", "25%"],
    answer: "20%",
    difficulty: "Medium",
  },
  {
    id: 5,
    question:
      "If A can complete a task in 12 days and B in 18 days, together they finish it in:",
    options: ["6 days", "7.2 days", "8 days", "9 days"],
    answer: "7.2 days",
    difficulty: "Medium",
  },
  {
    id: 6,
    question:
      "A shopkeeper marks an item 20% above cost price and gives a 10% discount. His profit percentage is:",
    options: ["6%", "8%", "10%", "12%"],
    answer: "8%",
    difficulty: "Hard",
  },
  {
    id: 7,
    question:
      "Find the missing number: 5, 10, 20, 40, 80, ?",
    options: ["120", "140", "150", "160"],
    answer: "160",
    difficulty: "Easy",
  },
  {
    id: 8,
    question:
      "If the ratio of boys to girls is 3:2 and there are 120 students, how many girls are there?",
    options: ["42", "48", "50", "54"],
    answer: "48",
    difficulty: "Easy",
  },
  {
    id: 9,
    question:
      "The average of five numbers is 36. If one number is removed, the average becomes 30. What is the removed number?",
    options: ["54", "56", "58", "60"],
    answer: "60",
    difficulty: "Medium",
  },
  {
    id: 10,
    question:
      "A man walks 15 km north, then 20 km east. How far is he from the starting point?",
    options: ["20 km", "25 km", "30 km", "35 km"],
    answer: "25 km",
    difficulty: "Medium",
  },
  {
    id: 11,
    question:
      "Which number should replace the question mark? 4, 9, 16, 25, ?, 49",
    options: ["30", "34", "36", "40"],
    answer: "36",
    difficulty: "Easy",
  },
  {
    id: 12,
    question:
      "A car covers 240 km using 20 litres of petrol. What is its mileage?",
    options: ["10 km/l", "11 km/l", "12 km/l", "14 km/l"],
    answer: "12 km/l",
    difficulty: "Easy",
  },
  {
    id: 13,
    question:
      "If x = 4 and y = 6, then the value of 2x² + y is:",
    options: ["30", "34", "38", "42"],
    answer: "38",
    difficulty: "Easy",
  },
  {
    id: 14,
    question:
      "A number is increased by 20% and then decreased by 20%. The final value is:",
    options: [
      "Same as original",
      "4% less",
      "4% more",
      "8% less",
    ],
    answer: "4% less",
    difficulty: "Hard",
  },
  {
    id: 15,
    question:
      "Find the next number: 3, 7, 15, 31, ?",
    options: ["47", "55", "63", "64"],
    answer: "63",
    difficulty: "Medium",
  },
  {
    id: 16,
    question:
      "If today is Monday, what day will it be after 45 days?",
    options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    answer: "Tuesday",
    difficulty: "Medium",
  },
  {
    id: 17,
    question:
      "The probability of getting a head when tossing a fair coin is:",
    options: ["0", "1/4", "1/2", "1"],
    answer: "1/2",
    difficulty: "Easy",
  },
  {
    id: 18,
    question:
      "The LCM of 12 and 18 is:",
    options: ["24", "30", "36", "48"],
    answer: "36",
    difficulty: "Easy",
  },
  {
    id: 19,
    question:
      "A clock shows 3:00. What is the angle between the hour and minute hands?",
    options: ["60°", "75°", "90°", "120°"],
    answer: "90°",
    difficulty: "Medium",
  },
  {
    id: 20,
    question:
      "Find the odd one out: 8, 27, 64, 100, 125",
    options: ["8", "27", "64", "100"],
    answer: "100",
    difficulty: "Hard",
  },
];