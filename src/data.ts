/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, ScoreRecord, User } from './types';
import { TEST_BANK } from './testBank';

export { TEST_BANK };

// Real-looking primary school pupils from Dersingham & Newham community
export const MOCK_PUPILS: User[] = [
  { username: 'ykhan.316', name: 'Yasmin Khan', role: 'student', yearGroup: 4 },
  { username: 'jriste.316', name: 'Test account', role: 'student', yearGroup: 5, class: 'Class 18' },
  { username: 'ssmith.208', name: 'Sarah Smith', role: 'student', yearGroup: 5 },
  { username: 'afarah.102', name: 'Abdi Farah', role: 'student', yearGroup: 3 },
  { username: 'mchen.405', name: 'Mei Chen', role: 'student', yearGroup: 6 },
  { username: 'epatel.512', name: 'Esha Patel', role: 'student', yearGroup: 5 },
  { username: 'djohnson.204', name: 'Daniel Johnson', role: 'student', yearGroup: 2 },
  { username: 'asood.109', name: 'Aarav Sood', role: 'student', yearGroup: 1 },
];

export const MOCK_TEACHERS: User[] = [
  { username: 'joseph.riste@dersingham.newham.sch.uk', name: 'Mr. Joseph Riste', role: 'teacher', isAdmin: true },
  { username: 'jriste.316@dersingham.newham.sch.uk', name: 'Mr. J. Riste', role: 'teacher', isAdmin: true },
  { username: 'admin.316', name: 'Mrs. H. Campbell (Headteacher)', role: 'teacher', isAdmin: false },
];

export const DEFAULT_TESTS: Test[] = [
  ...TEST_BANK,
  // --- YEAR 1 & 2 (Key Stage 1) ---
  {
    id: 'y2-maths-1',
    title: 'Year 2 Magic Maths Explorer',
    subject: 'maths',
    yearGroup: 2,
    timeLimitSeconds: 180,
    active: true,
    questions: [
      {
        id: 'q1',
        text: 'What is 15 + 7?',
        options: ['20', '21', '22', '23'],
        correctAnswer: '22',
        marks: 2,
        hint: 'Try counting up from 15, or making 10 first: 15 + 5 + 2!'
      },
      {
        id: 'q2',
        text: 'Which shape has exactly 3 sides and 3 corners?',
        options: ['Square', 'Triangle', 'Rectangle', 'Circle'],
        correctAnswer: 'Triangle',
        marks: 2,
        hint: 'Think of a slice of pizza or a sandwich cut in half!'
      },
      {
        id: 'q3',
        text: 'What is half of 18?',
        options: ['8', '9', '10', '12'],
        correctAnswer: '9',
        marks: 2,
        hint: 'If you share 18 sweets equally between 2 friends, how many does each get?'
      },
      {
        id: 'q4',
        text: 'What comes next in the pattern? 5, 10, 15, 20, ...',
        options: ['22', '25', '30', '35'],
        correctAnswer: '25',
        marks: 2,
        hint: 'We are counting in steps of 5!'
      }
    ]
  },
  {
    id: 'y2-reading-1',
    title: 'Year 2 Phonics & Comprehension: The Brave Little Fox',
    subject: 'reading',
    yearGroup: 2,
    timeLimitSeconds: 240,
    active: true,
    questions: [
      {
        id: 'q5',
        text: '"Finlay the Fox wanted to climb the tall oak tree to find the shiny star." Why did Finlay climb the tree?',
        options: ['To find a shiny star', 'To sleep', 'To play with a bird', 'To eat acorns'],
        correctAnswer: 'To find a shiny star',
        marks: 2,
        hint: 'Re-read the text carefully. It says "to find the... "!'
      },
      {
        id: 'q6',
        text: 'Pick the word with the correct sound to finish the sentence: "The little fox sat on the _____ and waved to his friends."',
        options: ['grene', 'green', 'grene', 'gren'],
        correctAnswer: 'green',
        marks: 2,
        hint: 'Think of the "ee" digraph in colors!'
      },
      {
        id: 'q7',
        text: 'What is the opposite of "brave"?',
        options: ['Strong', 'Scared', 'Happy', 'Kind'],
        correctAnswer: 'Scared',
        marks: 2,
        hint: 'If you are brave you are not afraid. What if you are afraid?'
      }
    ]
  },

  // --- YEAR 3 & 4 (Lower Key Stage 2) ---
  {
    id: 'y4-maths-1',
    title: 'Year 4 Number Ninja Challenge',
    subject: 'maths',
    yearGroup: 4,
    timeLimitSeconds: 300,
    active: true,
    questions: [
      {
        id: 'q8',
        text: 'Calculate 7 x 8',
        options: ['48', '54', '56', '64'],
        correctAnswer: '56',
        marks: 2,
        hint: 'Use your times tables: 5 x 8 = 40, and add two more 8s!'
      },
      {
        id: 'q9',
        text: 'Which of these is equivalent to 1/2?',
        options: ['3/4', '4/8', '2/6', '5/12'],
        correctAnswer: '4/8',
        marks: 2,
        hint: 'Look for the fraction where the top number is exactly half of the bottom number!'
      },
      {
        id: 'q10',
        text: 'Convert 1,500 meters into kilometers.',
        options: ['1.5 km', '15 km', '150 km', '0.15 km'],
        correctAnswer: '1.5 km',
        marks: 2,
        hint: 'Remember that 1 kilometer (km) is equal to 1,000 meters!'
      },
      {
        id: 'q11',
        text: 'What is 342 rounded to the nearest 100?',
        options: ['300', '340', '350', '400'],
        correctAnswer: '300',
        marks: 1,
        hint: 'Is 342 closer to 300 or 400? Look at the tens column.'
      },
      {
        id: 'q12',
        text: 'If a rectangle has length 6cm and width 4cm, what is its perimeter?',
        options: ['10cm', '24cm', '20cm', '12cm'],
        correctAnswer: '20cm',
        marks: 2,
        hint: 'Perimeter is the distance all the way around: 6 + 4 + 6 + 4.'
      }
    ]
  },
  {
    id: 'y4-spag-1',
    title: 'Year 4 Grammar, Punctuation & Spelling Test',
    subject: 'spag',
    yearGroup: 4,
    timeLimitSeconds: 180,
    active: true,
    questions: [
      {
        id: 'q13',
        text: 'Which sentence is punctuated correctly with inverted commas?',
        options: [
          '"Help me! shouted Sarah."',
          '"Help me!" shouted Sarah.',
          'Help me shouted Sarah.',
          'Help "me!" shouted Sarah'
        ],
        correctAnswer: '"Help me!" shouted Sarah.',
        marks: 2,
        hint: 'Punctuation like exclamation marks must go INSIDE the speech marks!'
      },
      {
        id: 'q14',
        text: 'What is the word class of "quietly" in this sentence: "The tiger crept quietly through the jungle."',
        options: ['Adjective', 'Noun', 'Verb', 'Adverb'],
        correctAnswer: 'Adverb',
        marks: 2,
        hint: 'It tells us HOW the tiger crept (crept is the verb).'
      },
      {
        id: 'q15',
        text: 'Which of these is a fronted adverbial?',
        options: [
          'Under the bridge,',
          'The bridge was under',
          'He walked over the bridge',
          'Big green bridge'
        ],
        correctAnswer: 'Under the bridge,',
        marks: 2,
        hint: 'A fronted adverbial goes at the start of a sentence telling when, where or how, followed by a comma.'
      }
    ]
  },

  // --- YEAR 5 & 6 (Upper Key Stage 2) ---
  {
    id: 'y6-maths-1',
    title: 'Year 6 Standard Assessment (SATS-style) Arithmetic & Reasoning',
    subject: 'maths',
    yearGroup: 6,
    timeLimitSeconds: 400,
    active: true,
    questions: [
      {
        id: 'q16',
        text: 'Work out: 3/5 + 1/10',
        options: ['4/15', '7/10', '4/10', '3/10'],
        correctAnswer: '7/10',
        marks: 2,
        hint: 'Convert 3/5 to tenths first. Multiply top and bottom by 2!'
      },
      {
        id: 'q17',
        text: 'A book costs £8.99. A teacher buys 5 copies. How much does she spend in total?',
        options: ['£44.95', '£45.00', '£40.95', '£44.50'],
        correctAnswer: '£44.95',
        marks: 2,
        hint: 'Try doing 5 x £9.00 = £45.00, then subtract 5p!'
      },
      {
        id: 'q18',
        text: 'Find 15% of 120.',
        options: ['12', '15', '18', '20'],
        correctAnswer: '18',
        marks: 2,
        hint: 'Find 10% first (12), then 5% is half of that (6). Add them together!'
      },
      {
        id: 'q19',
        text: 'If x + 7 = 3x - 1, what is the value of x?',
        options: ['2', '3', '4', '8'],
        correctAnswer: '4',
        marks: 3,
        hint: 'Rearrange the equation: subtract x from both sides (7 = 2x - 1), then add 1 (8 = 2x)!'
      },
      {
        id: 'q20',
        text: 'How many degrees are in the third angle of a triangle if the other two angles are 50° and 60°?',
        options: ['70°', '80°', '90°', '110°'],
        correctAnswer: '70°',
        marks: 2,
        hint: 'All angles inside a triangle always add up to 180°!'
      }
    ]
  },
  {
    id: 'y6-reading-1',
    title: 'Year 6 Comprehension: The Victorians and Newham\'s Industrial Growth',
    subject: 'reading',
    yearGroup: 6,
    timeLimitSeconds: 450,
    active: true,
    questions: [
      {
        id: 'q21',
        text: '"During the late 19th century, Newham underwent an unprecedented transformation. Rich farmlands were swiftly replaced by bustling chemical factories and shipyards along the Thames, drawing thousands of workers in search of industrial employment." What does the word "unprecedented" suggest about the transformation?',
        options: [
          'It had happened many times before.',
          'It was small and insignificant.',
          'It had never been seen at such a style or scale before.',
          'It was very slow and sluggish.'
        ],
        correctAnswer: 'It had never been seen at such a style or scale before.',
        marks: 2,
        hint: 'Unprecedented means never done or known before!'
      },
      {
        id: 'q22',
        text: 'Based on the text, what lured raw workers to Victorian Newham?',
        options: [
          'The rich agricultural farmland',
          'Clean air and green parks',
          'Industrial employment opportunities in factories and shipyards',
          'A desire to travel down the River Thames'
        ],
        correctAnswer: 'Industrial employment opportunities in factories and shipyards',
        marks: 2,
        hint: 'Look for what is "drawing thousands of workers".'
      },
      {
        id: 'q23',
        text: 'Identify the synonym for "swiftly" as used in the passage.',
        options: ['Gradually', 'Slowly', 'Rapidly', 'Reluctantly'],
        correctAnswer: 'Rapidly',
        marks: 1,
        hint: 'Swiftly refers to high speed.'
      }
    ]
  },
  {
    id: 'y6-spag-1',
    title: 'Year 6 GPS Grammar & Spelling Mastery',
    subject: 'spag',
    yearGroup: 6,
    timeLimitSeconds: 300,
    active: true,
    questions: [
      {
        id: 'q24',
        text: 'Which sentence uses the subjunctive form correctly?',
        options: [
          'If I was you, I would study grammar.',
          'If I were you, I would study grammar.',
          'If I am you, I will study grammar.',
          'If I would be you, I would study grammar.'
        ],
        correctAnswer: 'If I were you, I would study grammar.',
        marks: 2,
        hint: 'The subjunctive mood uses "were" for hypothetical situations instead of "was".'
      },
      {
        id: 'q25',
        text: 'Which word contains the prefix that means "against"?',
        options: ['Antibiotic', 'Bilingual', 'Submarine', 'Deport'],
        correctAnswer: 'Antibiotic',
        marks: 2,
        hint: 'The prefix is "anti-".'
      },
      {
        id: 'q26',
        text: 'Identify the passive sentence.',
        options: [
          'The headteacher praised the hardworking class.',
          'The hardworking class was praised by the headteacher.',
          'The class praised the headteacher.',
          'We must praise the headteacher.'
        ],
        correctAnswer: 'The hardworking class was praised by the headteacher.',
        marks: 2,
        hint: 'In a passive sentence, the action is done TO the subject: [Subject] was [verb] by [agent].'
      }
    ]
  }
];

// Rich set of historic test records to populate Recharts dashboard charts
export const MOCK_SCORE_RECORDS: ScoreRecord[] = [
  // Test account
  {
    id: 'rec-1',
    studentUsername: 'jriste.316',
    studentName: 'Test account',
    yearGroup: 5,
    testId: 'y6-maths-1',
    testTitle: 'Year 6 SATS Arithmetic & Reasoning',
    subject: 'maths',
    score: 9,
    totalQuestions: 11,
    percentage: 81,
    durationSeconds: 198,
    completedAt: '2026-06-15T14:22:00Z'
  },
  {
    id: 'rec-2',
    studentUsername: 'jriste.316',
    studentName: 'Test account',
    yearGroup: 6,
    testId: 'y6-spag-1',
    testTitle: 'Year 6 GPS Grammar & Spelling Mastery',
    subject: 'spag',
    score: 5,
    totalQuestions: 6,
    percentage: 83,
    durationSeconds: 124,
    completedAt: '2026-06-14T09:15:00Z'
  },
  // Yasmin Khan
  {
    id: 'rec-3',
    studentUsername: 'ykhan.316',
    studentName: 'Yasmin Khan',
    yearGroup: 4,
    testId: 'y4-maths-1',
    testTitle: 'Year 4 Number Ninja Challenge',
    subject: 'maths',
    score: 9,
    totalQuestions: 9,
    percentage: 100,
    durationSeconds: 212,
    completedAt: '2026-06-17T11:05:00Z'
  },
  {
    id: 'rec-4',
    studentUsername: 'ykhan.316',
    studentName: 'Yasmin Khan',
    yearGroup: 4,
    testId: 'y4-spag-1',
    testTitle: 'Year 4 Grammar, Punctuation & Spelling Test',
    subject: 'spag',
    score: 4,
    totalQuestions: 6,
    percentage: 67,
    durationSeconds: 110,
    completedAt: '2026-06-16T13:40:00Z'
  },
  // Sarah Smith
  {
    id: 'rec-5',
    studentUsername: 'ssmith.208',
    studentName: 'Sarah Smith',
    yearGroup: 5,
    testId: 'y4-maths-1', // took it as practice
    testTitle: 'Year 4 Number Ninja Challenge',
    subject: 'maths',
    score: 8,
    totalQuestions: 9,
    percentage: 89,
    durationSeconds: 175,
    completedAt: '2026-06-15T10:30:00Z'
  },
  // Abdi Farah
  {
    id: 'rec-6',
    studentUsername: 'afarah.102',
    studentName: 'Abdi Farah',
    yearGroup: 3,
    testId: 'y2-maths-1',
    testTitle: 'Year 2 Magic Maths Explorer',
    subject: 'maths',
    score: 7,
    totalQuestions: 8,
    percentage: 87,
    durationSeconds: 140,
    completedAt: '2026-06-16T15:10:00Z'
  },
  {
    id: 'rec-7',
    studentUsername: 'afarah.102',
    studentName: 'Abdi Farah',
    yearGroup: 3,
    testId: 'y2-reading-1',
    testTitle: 'Year 2 Phonics & Comprehension: The Brave Little Fox',
    subject: 'reading',
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    durationSeconds: 185,
    completedAt: '2026-06-12T11:25:00Z'
  },
  // Mei Chen
  {
    id: 'rec-8',
    studentUsername: 'mchen.405',
    studentName: 'Mei Chen',
    yearGroup: 6,
    testId: 'y6-maths-1',
    testTitle: 'Year 6 SATS Arithmetic & Reasoning',
    subject: 'maths',
    score: 11,
    totalQuestions: 11,
    percentage: 100,
    durationSeconds: 245,
    completedAt: '2026-06-17T09:55:00Z'
  },
  {
    id: 'rec-9',
    studentUsername: 'mchen.405',
    studentName: 'Mei Chen',
    yearGroup: 6,
    testId: 'y6-reading-1',
    testTitle: 'Year 6 Comprehension: The Victorians and Newham',
    subject: 'reading',
    score: 5,
    totalQuestions: 5,
    percentage: 100,
    durationSeconds: 310,
    completedAt: '2026-06-16T14:15:00Z'
  },
  // Esha Patel
  {
    id: 'rec-10',
    studentUsername: 'epatel.512',
    studentName: 'Esha Patel',
    yearGroup: 5,
    testId: 'y4-maths-1',
    testTitle: 'Year 4 Number Ninja Challenge',
    subject: 'maths',
    score: 6,
    totalQuestions: 9,
    percentage: 67,
    durationSeconds: 195,
    completedAt: '2026-06-14T11:00:00Z'
  },
  {
    id: 'rec-11',
    studentUsername: 'epatel.512',
    studentName: 'Esha Patel',
    yearGroup: 5,
    testId: 'y4-spag-1',
    testTitle: 'Year 4 Grammar, Punctuation & Spelling Test',
    subject: 'spag',
    score: 5,
    totalQuestions: 6,
    percentage: 83,
    durationSeconds: 98,
    completedAt: '2026-06-13T10:20:00Z'
  }
];
