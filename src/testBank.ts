/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test } from './types';

export const TEST_BANK: Test[] = [
  // ==========================================
  // 1. YEAR 6 ARITHMETIC MASTERY PAPER (20 QUESTIONS)
  // ==========================================
  {
    id: 'y6-arithmetic-mastery',
    title: 'Year 6 Arithmetic Mastery Test (20 Questions)',
    subject: 'maths',
    yearGroup: 6,
    timeLimitSeconds: 1800,
    active: true,
    createdByTeacher: 'joseph.riste@dersingham.newham.sch.uk',
    createdByClass: 'Class 18',
    questions: [
      {
        id: 'y6-arith-q1',
        text: 'Calculate: 976 + 2,148',
        options: [],
        correctAnswer: '3124',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Addition & Subtraction',
        hint: 'Use the standard formal column addition method.',
        explanation: '976 + 2,148 = 3,124.'
      },
      {
        id: 'y6-arith-q2',
        text: 'Calculate: 6.04 + 3.9',
        options: [],
        correctAnswer: '9.94',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Decimals & Place Value',
        hint: 'Align the decimal points carefully: 6.04 + 3.90.',
        explanation: '6.04 + 3.90 = 9.94.'
      },
      {
        id: 'y6-arith-q3',
        text: 'Calculate: 8 × 374',
        options: [],
        correctAnswer: '2992',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Multiplication & Division',
        hint: 'Multiply 8 × 300, 8 × 70, and 8 × 4, then sum them.',
        explanation: '8 × 374 = 2,992.'
      },
      {
        id: 'y6-arith-q4',
        text: 'Select the comparison symbol to make this statement true: 3/5 [ ? ] 0.65',
        options: ['<', '>', '='],
        correctAnswer: '<',
        marks: 1,
        type: 'Comparison Symbols',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'Convert 3/5 to a decimal: 3 ÷ 5 = 0.60. Compare 0.60 and 0.65.',
        explanation: '3/5 is 0.60, which is less than 0.65, so the symbol is <.'
      },
      {
        id: 'y6-arith-q5',
        text: 'Select ALL the prime numbers from the following list:',
        options: ['9', '13', '21', '29', '35', '37'],
        correctAnswer: '13, 29, 37',
        marks: 2,
        type: 'Checkboxes',
        linkedLearningGoal: 'Number Properties & Primes',
        hint: 'A prime number has exactly two distinct factors: 1 and itself.',
        explanation: '13, 29, and 37 are prime. 9 = 3×3, 21 = 3×7, 35 = 5×7.'
      },
      {
        id: 'y6-arith-q6',
        text: 'From the decimals below, identify the SMALLEST and the LARGEST: 0.7, 0.07, 0.77, 0.077',
        options: ['0.07', '0.077', '0.7', '0.77'],
        correctAnswer: 'Smallest: 0.07, Largest: 0.77',
        marks: 2,
        type: 'Smallest/Largest',
        linkedLearningGoal: 'Decimals & Place Value',
        hint: 'Pad to three decimal places: 0.700, 0.070, 0.770, 0.077.',
        explanation: '0.070 (0.07) is smallest; 0.770 (0.77) is largest.'
      },
      {
        id: 'y6-arith-q7',
        text: 'Calculate mental division: 5,400 ÷ 9',
        options: [],
        correctAnswer: '600',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Multiplication & Division',
        hint: 'Use the basic fact: 54 ÷ 9 = 6, then consider place value.',
        explanation: '54 ÷ 9 = 6, so 5,400 ÷ 9 = 600.'
      },
      {
        id: 'y6-arith-q8',
        text: 'Match each fraction to its equivalent percentage:',
        options: ['1/4 -> 25%', '1/2 -> 50%', '3/4 -> 75%', '1/5 -> 20%'],
        correctAnswer: '1/4 -> 25%, 1/2 -> 50%, 3/4 -> 75%, 1/5 -> 20%',
        marks: 2,
        type: 'Matching Pairs',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'Percentage means parts out of 100.',
        explanation: '1/4 = 25%, 1/2 = 50%, 3/4 = 75%, 1/5 = 20%.'
      },
      {
        id: 'y6-arith-q9',
        text: 'True or False: 36 is both a square number and a multiple of 9.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        marks: 1,
        type: 'True/False',
        linkedLearningGoal: 'Number Properties & Primes',
        hint: 'Check 6 × 6 and 4 × 9.',
        explanation: '36 = 6² (square number) and 36 = 4 × 9 (multiple of 9).'
      },
      {
        id: 'y6-arith-q10',
        text: 'Calculate the fraction addition: 3/8 + 1/4 (Write as a fraction)',
        options: [],
        correctAnswer: '5/8',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'Convert 1/4 into eighths: 1/4 = 2/8. Then add 3/8 + 2/8.',
        explanation: '3/8 + 2/8 = 5/8.'
      },
      {
        id: 'y6-arith-q11',
        text: 'What is the most suitable unit to measure the capacity of a liquid medicine spoon?',
        options: ['ml', 'L', 'kg', 'km'],
        correctAnswer: 'ml',
        marks: 1,
        type: 'Unit Selection',
        linkedLearningGoal: 'Measurement & Units',
        hint: 'Capacity of small volumes is measured in millilitres.',
        explanation: 'A teaspoon holds 5 millilitres (ml).'
      },
      {
        id: 'y6-arith-q12',
        text: 'Sort these numbers into Even and Odd numbers: 14, 27, 32, 55, 68, 91',
        options: [],
        correctAnswer: 'Even: 14, 32, 68 | Odd: 27, 55, 91',
        marks: 2,
        type: 'Sorting',
        linkedLearningGoal: 'Number & Place Value',
        hint: 'Even numbers end in 0, 2, 4, 6, 8. Odd numbers end in 1, 3, 5, 7, 9.',
        explanation: 'Even numbers: 14, 32, 68; Odd numbers: 27, 55, 91.'
      },
      {
        id: 'y6-arith-q13',
        text: 'Calculate: 20% of 450',
        options: [],
        correctAnswer: '90',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: '10% of 450 is 45. Double it to find 20%.',
        explanation: '10% = 45; 20% = 45 × 2 = 90.'
      },
      {
        id: 'y6-arith-q14',
        text: 'Select the comparison symbol to make the statement true: 1.25 kg [ ? ] 1,250 g',
        options: ['<', '>', '='],
        correctAnswer: '=',
        marks: 1,
        type: 'Comparison Symbols',
        linkedLearningGoal: 'Measurement & Units',
        hint: '1 kilogram = 1,000 grams. 1.25 × 1,000 = 1,250.',
        explanation: '1.25 kg = 1,250 g, so the symbol is =.'
      },
      {
        id: 'y6-arith-q15',
        text: 'Calculate: 4/5 × 3/7 (Write answer as a single fraction)',
        options: [],
        correctAnswer: '12/35',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'Multiply the numerators together, then multiply the denominators.',
        explanation: '(4 × 3) / (5 × 7) = 12/35.'
      },
      {
        id: 'y6-arith-q16',
        text: 'Evaluate: 3² + 4²',
        options: ['14', '25', '49', '100'],
        correctAnswer: '25',
        marks: 1,
        type: 'Multiple Choice',
        linkedLearningGoal: 'Addition & Subtraction',
        hint: '3² = 9 and 4² = 16. Add them together.',
        explanation: '9 + 16 = 25 (which is also 5²).'
      },
      {
        id: 'y6-arith-q17',
        text: 'Calculate using the order of operations (BIDMAS): 72 ÷ (3 + 6)',
        options: [],
        correctAnswer: '8',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Multiplication & Division',
        hint: 'Always calculate inside the brackets first: 3 + 6 = 9.',
        explanation: '72 ÷ 9 = 8.'
      },
      {
        id: 'y6-arith-q18',
        text: 'Select ALL the common multiples of BOTH 3 and 4:',
        options: ['6', '12', '18', '24', '30', '36'],
        correctAnswer: '12, 24, 36',
        marks: 2,
        type: 'Checkboxes',
        linkedLearningGoal: 'Multiplication & Division',
        hint: 'Common multiples of 3 and 4 are multiples of 12.',
        explanation: '12, 24, and 36 are divisible by both 3 and 4.'
      },
      {
        id: 'y6-arith-q19',
        text: 'Calculate: 2/3 ÷ 4 (Write as a fraction in simplest form)',
        options: [],
        correctAnswer: '1/6',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'Dividing by 4 is the same as multiplying by 1/4: (2/3) × (1/4) = 2/12 = 1/6.',
        explanation: '2/12 simplifies to 1/6.'
      },
      {
        id: 'y6-arith-q20',
        text: 'Calculate: 1,248 ÷ 16',
        options: [],
        correctAnswer: '78',
        marks: 2,
        type: 'Number Input',
        linkedLearningGoal: 'Multiplication & Division',
        hint: 'Use long division or divide by 4 twice then by 2.',
        explanation: '1,248 ÷ 16 = 78.'
      }
    ]
  },

  // ==========================================
  // 2. YEAR 6 MATHEMATICAL REASONING PAPER (20 QUESTIONS)
  // ==========================================
  {
    id: 'y6-reasoning-mastery',
    title: 'Year 6 Mathematical Reasoning Test (20 Questions)',
    subject: 'maths',
    yearGroup: 6,
    timeLimitSeconds: 2400,
    active: true,
    createdByTeacher: 'joseph.riste@dersingham.newham.sch.uk',
    createdByClass: 'Class 18',
    questions: [
      {
        id: 'y6-reas-q1',
        text: 'A baker packs 6 muffins per presentation box. How many boxes are needed to pack all 145 muffins?',
        options: ['24 boxes', '25 boxes', '24 with 1 left over', '26 boxes'],
        correctAnswer: '25 boxes',
        marks: 1,
        type: 'Multiple Choice',
        linkedLearningGoal: 'Multiplication & Division',
        hint: '145 ÷ 6 = 24 remainder 1. Can we leave 1 muffin unpacked?',
        explanation: '24 boxes hold 144 muffins. 1 muffin requires a 25th box.'
      },
      {
        id: 'y6-reas-q2',
        text: 'Two interior angles of a triangle are 45° and 65°. What is the size of the third angle in degrees?',
        options: [],
        correctAnswer: '70',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Geometry: Properties of Shapes',
        hint: 'Angles in a triangle always sum to 180°.',
        explanation: '180° - (45° + 65°) = 180° - 110° = 70°.'
      },
      {
        id: 'y6-reas-q3',
        text: 'Select the comparison symbol to make this statement true: 2.4 km [ ? ] 2,450 m',
        options: ['<', '>', '='],
        correctAnswer: '<',
        marks: 1,
        type: 'Comparison Symbols',
        linkedLearningGoal: 'Measurement & Units',
        hint: 'Convert 2.4 km into meters: 2.4 × 1,000 = 2,400 m.',
        explanation: '2,400 m < 2,450 m, so the correct symbol is <.'
      },
      {
        id: 'y6-reas-q4',
        text: 'Select ALL quadrilaterals whose diagonals ALWAYS cross at right angles (perpendicularly):',
        options: ['Square', 'Rectangle', 'Rhombus', 'Parallelogram'],
        correctAnswer: 'Square, Rhombus',
        marks: 2,
        type: 'Checkboxes',
        linkedLearningGoal: 'Geometry: Properties of Shapes',
        hint: 'Think of shapes with four equal sides.',
        explanation: 'Both the Square and Rhombus have perpendicular diagonals.'
      },
      {
        id: 'y6-reas-q5',
        text: 'From the temperatures below, select the SMALLEST (coldest) and LARGEST (warmest): -5°C, 3°C, -8°C, 0°C, -1°C',
        options: ['-8°C', '-5°C', '-1°C', '0°C', '3°C'],
        correctAnswer: 'Smallest: -8°C, Largest: 3°C',
        marks: 2,
        type: 'Smallest/Largest',
        linkedLearningGoal: 'Negative Numbers & Scales',
        hint: 'Look for the number furthest to the left on a number line for smallest.',
        explanation: '-8°C is the coldest (smallest); 3°C is the warmest (largest).'
      },
      {
        id: 'y6-reas-q6',
        text: 'Solve for x: If 2x + 7 = 23, what is the value of x?',
        options: [],
        correctAnswer: '8',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Algebra',
        hint: 'Subtract 7 from both sides, then divide by 2.',
        explanation: '2x = 16, so x = 8.'
      },
      {
        id: 'y6-reas-q7',
        text: 'Match each 3D shape to its number of faces:',
        options: ['Cube -> 6', 'Triangular Prism -> 5', 'Square-based Pyramid -> 5', 'Tetrahedron -> 4'],
        correctAnswer: 'Cube -> 6, Triangular Prism -> 5, Square-based Pyramid -> 5, Tetrahedron -> 4',
        marks: 2,
        type: 'Matching Pairs',
        linkedLearningGoal: 'Geometry: Properties of Shapes',
        hint: 'A cube has 6 flat faces; a tetrahedron is a triangular pyramid with 4 faces.',
        explanation: 'Cube: 6 faces, Triangular Prism: 5 faces, Pyramid: 5 faces, Tetrahedron: 4 faces.'
      },
      {
        id: 'y6-reas-q8',
        text: 'True or False: A rectangle with a perimeter of 20 cm can have an area of 24 cm².',
        options: ['True', 'False'],
        correctAnswer: 'True',
        marks: 1,
        type: 'True/False',
        linkedLearningGoal: 'Area & Perimeter',
        hint: 'Test side lengths: What if length is 6 cm and width is 4 cm?',
        explanation: 'Perimeter = 2 × (6 + 4) = 20 cm. Area = 6 × 4 = 24 cm².'
      },
      {
        id: 'y6-reas-q9',
        text: 'Which unit is most appropriate for measuring the surface area of the school playground?',
        options: ['mm²', 'cm²', 'm²', 'km²'],
        correctAnswer: 'm²',
        marks: 1,
        type: 'Unit Selection',
        linkedLearningGoal: 'Measurement & Units',
        hint: 'A playground is tens of meters wide.',
        explanation: 'Square metres (m²) is the standard unit for playground or sports ground area.'
      },
      {
        id: 'y6-reas-q10',
        text: 'Sort these numbers into Multiples of 6 and Factors of 36: 6, 12, 18, 24, 4, 9',
        options: [],
        correctAnswer: 'Multiples of 6: 6, 12, 18, 24 | Factors of 36: 4, 6, 9, 12, 18',
        marks: 2,
        type: 'Sorting',
        linkedLearningGoal: 'Multiplication & Factors',
        hint: 'Some numbers might belong to both, but sort them into their respective primary categories.',
        explanation: 'Multiples of 6: 6, 12, 18, 24; Factors of 36: 4, 6, 9, 12, 18.'
      },
      {
        id: 'y6-reas-q11',
        text: 'In Dersingham Primary School, there are 300 pupils in KS2. The ratio of boys to girls is 2:3. How many girls are there?',
        options: [],
        correctAnswer: '180',
        marks: 2,
        type: 'Number Input',
        linkedLearningGoal: 'Ratio & Proportion',
        hint: 'Total ratio parts = 2 + 3 = 5. Divide 300 by 5 to find one part.',
        explanation: 'One part = 300 ÷ 5 = 60. Girls = 3 × 60 = 180.'
      },
      {
        id: 'y6-reas-q12',
        text: 'Three vertices of a rectangle are plotted on a grid at (1,2), (1,6), and (5,6). What are the coordinates of the fourth vertex?',
        options: ['(5,2)', '(2,5)', '(6,1)', '(5,4)'],
        correctAnswer: '(5,2)',
        marks: 1,
        type: 'Multiple Choice',
        linkedLearningGoal: 'Geometry: Position & Direction',
        hint: 'The fourth vertex must have x-coordinate 5 and y-coordinate 2.',
        explanation: 'The rectangle corners are (1,2), (1,6), (5,6), and (5,2).'
      },
      {
        id: 'y6-reas-q13',
        text: 'The temperatures recorded at 12:00 across five school days were: 14°C, 16°C, 15°C, 12°C, and 18°C. What was the mean temperature?',
        options: [],
        correctAnswer: '15',
        marks: 2,
        type: 'Number Input',
        linkedLearningGoal: 'Statistics & Data',
        hint: 'Add the 5 temperatures together and divide the total by 5.',
        explanation: '14 + 16 + 15 + 12 + 18 = 75. 75 ÷ 5 = 15°C.'
      },
      {
        id: 'y6-reas-q14',
        text: 'Select the comparison symbol to make this statement true: 0.375 [ ? ] 3/8',
        options: ['<', '>', '='],
        correctAnswer: '=',
        marks: 1,
        type: 'Comparison Symbols',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: '3 ÷ 8 = 0.375.',
        explanation: '3/8 is exactly equal to 0.375, so the symbol is =.'
      },
      {
        id: 'y6-reas-q15',
        text: 'Select ALL true statements about a REGULAR HEXAGON:',
        options: [
          'It has 6 equal sides',
          'It has 6 lines of reflective symmetry',
          'All interior angles are 90°',
          'It has rotational symmetry of order 6'
        ],
        correctAnswer: 'It has 6 equal sides, It has 6 lines of reflective symmetry, It has rotational symmetry of order 6',
        marks: 2,
        type: 'Checkboxes',
        linkedLearningGoal: 'Geometry: Properties of Shapes',
        hint: 'Each interior angle of a regular hexagon is 120°, not 90°.',
        explanation: 'A regular hexagon has 6 equal sides, 6 lines of symmetry, order 6 rotational symmetry, and 120° angles.'
      },
      {
        id: 'y6-reas-q16',
        text: 'A train leaves London King\'s Cross at 09:45 and arrives at York at 12:18. How many total minutes did the journey take?',
        options: [],
        correctAnswer: '153',
        marks: 2,
        type: 'Number Input',
        linkedLearningGoal: 'Measurement & Time',
        hint: 'From 09:45 to 11:45 is 2 hours (120 mins). From 11:45 to 12:18 is 33 minutes.',
        explanation: '120 + 33 = 153 minutes.'
      },
      {
        id: 'y6-reas-q17',
        text: 'Match each Roman numeral to its Arabic number equivalent:',
        options: ['XL -> 40', 'XC -> 90', 'CD -> 400', 'CM -> 900'],
        correctAnswer: 'XL -> 40, XC -> 90, CD -> 400, CM -> 900',
        marks: 2,
        type: 'Matching Pairs',
        linkedLearningGoal: 'Number & Place Value',
        hint: 'When a smaller numeral precedes a larger, subtract it.',
        explanation: 'XL = 50 - 10 = 40; XC = 100 - 10 = 90; CD = 500 - 100 = 400; CM = 1000 - 100 = 900.'
      },
      {
        id: 'y6-reas-q18',
        text: 'True or False: The product of any two odd numbers is always an odd number.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        marks: 1,
        type: 'True/False',
        linkedLearningGoal: 'Reasoning with Numbers',
        hint: 'Try examples: 3 × 5 = 15, 7 × 9 = 63, 11 × 3 = 33.',
        explanation: 'Odd × Odd = Odd. (2a+1)(2b+1) = 4ab + 2a + 2b + 1, which is always odd.'
      },
      {
        id: 'y6-reas-q19',
        text: 'A car travels 180 miles in 3 hours at a steady speed. At this same speed, how many miles will it travel in 5 hours?',
        options: [],
        correctAnswer: '300',
        marks: 2,
        type: 'Number Input',
        linkedLearningGoal: 'Ratio & Proportion',
        hint: 'Find the speed in miles per hour: 180 ÷ 3 = 60 mph. Multiply by 5.',
        explanation: '60 × 5 = 300 miles.'
      },
      {
        id: 'y6-reas-q20',
        text: 'From the fractions and decimals below, identify the SMALLEST and LARGEST: 3/10, 0.35, 1/3, 32%',
        options: ['3/10', '32%', '1/3', '0.35'],
        correctAnswer: 'Smallest: 3/10, Largest: 0.35',
        marks: 2,
        type: 'Smallest/Largest',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'Convert all to decimals: 3/10 = 0.300, 32% = 0.320, 1/3 = 0.333..., 0.35 = 0.350.',
        explanation: 'Smallest is 3/10 (0.300); Largest is 0.35 (0.350).'
      }
    ]
  },

  // ==========================================
  // 3. YEAR 5 ARITHMETIC MASTERY PAPER (20 QUESTIONS)
  // ==========================================
  {
    id: 'y5-arithmetic-mastery',
    title: 'Year 5 Arithmetic Challenge (20 Questions)',
    subject: 'maths',
    yearGroup: 5,
    timeLimitSeconds: 1500,
    active: true,
    createdByTeacher: 'joseph.riste@dersingham.newham.sch.uk',
    createdByClass: 'Class 18',
    questions: [
      {
        id: 'y5-arith-q1',
        text: 'Calculate: 3,456 + 2,789',
        options: [],
        correctAnswer: '6245',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Addition & Subtraction',
        hint: 'Use column addition with regrouping.',
        explanation: '3,456 + 2,789 = 6,245.'
      },
      {
        id: 'y5-arith-q2',
        text: 'Calculate: 7,000 - 3,425',
        options: [],
        correctAnswer: '3575',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Addition & Subtraction',
        hint: 'Subtract with exchange across zeros, or count up from 3,425.',
        explanation: '7,000 - 3,425 = 3,575.'
      },
      {
        id: 'y5-arith-q3',
        text: 'Calculate: 6 × 450',
        options: [],
        correctAnswer: '2700',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Multiplication & Division',
        hint: '6 × 400 = 2400; 6 × 50 = 300. Add them.',
        explanation: '2400 + 300 = 2,700.'
      },
      {
        id: 'y5-arith-q4',
        text: 'Select the comparison symbol to make this statement true: 0.45 [ ? ] 0.5',
        options: ['<', '>', '='],
        correctAnswer: '<',
        marks: 1,
        type: 'Comparison Symbols',
        linkedLearningGoal: 'Decimals & Place Value',
        hint: 'Compare tenths: 4 tenths vs 5 tenths (0.50).',
        explanation: '0.45 < 0.50.'
      },
      {
        id: 'y5-arith-q5',
        text: 'Select ALL the multiples of 7 from this list:',
        options: ['14', '24', '35', '42', '54', '63'],
        correctAnswer: '14, 35, 42, 63',
        marks: 2,
        type: 'Checkboxes',
        linkedLearningGoal: 'Multiplication & Factors',
        hint: 'Recite your 7 times table up to 7 × 10 = 70.',
        explanation: '14 (7×2), 35 (7×5), 42 (7×6), and 63 (7×9) are multiples of 7.'
      },
      {
        id: 'y5-arith-q6',
        text: 'From the values below, identify the SMALLEST and the LARGEST: 1,204, 1,024, 1,240, 1,042',
        options: ['1,024', '1,042', '1,204', '1,240'],
        correctAnswer: 'Smallest: 1,024, Largest: 1,240',
        marks: 2,
        type: 'Smallest/Largest',
        linkedLearningGoal: 'Number & Place Value',
        hint: 'Look at the hundreds column first, then the tens.',
        explanation: '1,024 is the smallest; 1,240 is the largest.'
      },
      {
        id: 'y5-arith-q7',
        text: 'Calculate: 480 ÷ 8',
        options: [],
        correctAnswer: '60',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Multiplication & Division',
        hint: '48 ÷ 8 = 6.',
        explanation: '480 ÷ 8 = 60.'
      },
      {
        id: 'y5-arith-q8',
        text: 'Match each fraction to its equivalent decimal:',
        options: ['1/2 -> 0.5', '1/4 -> 0.25', '3/4 -> 0.75', '1/10 -> 0.1'],
        correctAnswer: '1/2 -> 0.5, 1/4 -> 0.25, 3/4 -> 0.75, 1/10 -> 0.1',
        marks: 2,
        type: 'Matching Pairs',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'Tenths and hundredths decimal conversions.',
        explanation: '1/2 = 0.5; 1/4 = 0.25; 3/4 = 0.75; 1/10 = 0.1.'
      },
      {
        id: 'y5-arith-q9',
        text: 'True or False: 25 is a square number.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        marks: 1,
        type: 'True/False',
        linkedLearningGoal: 'Number Properties & Primes',
        hint: '5 × 5 = 25.',
        explanation: '25 = 5², so it is a square number.'
      },
      {
        id: 'y5-arith-q10',
        text: 'Calculate: 3/7 + 2/7 (Write as a fraction)',
        options: [],
        correctAnswer: '5/7',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'The denominators are the same, so add the numerators: 3 + 2.',
        explanation: '3/7 + 2/7 = 5/7.'
      },
      {
        id: 'y5-arith-q11',
        text: 'What unit of measurement is best used to measure the mass of a school desk?',
        options: ['g', 'kg', 'tonnes', 'mg'],
        correctAnswer: 'kg',
        marks: 1,
        type: 'Unit Selection',
        linkedLearningGoal: 'Measurement & Units',
        hint: 'A school desk weighs around 10 to 15 units.',
        explanation: 'Kilograms (kg) is the standard metric unit for heavy classroom furniture.'
      },
      {
        id: 'y5-arith-q12',
        text: 'Sort these numbers into Multiples of 5 and Multiples of 10: 15, 20, 35, 40, 55, 60',
        options: [],
        correctAnswer: 'Multiples of 5: 15, 20, 35, 40, 55, 60 | Multiples of 10: 20, 40, 60',
        marks: 2,
        type: 'Sorting',
        linkedLearningGoal: 'Multiplication & Factors',
        hint: 'All multiples of 10 end in 0. Multiples of 5 end in 5 or 0.',
        explanation: 'All items are multiples of 5; 20, 40, 60 are also multiples of 10.'
      },
      {
        id: 'y5-arith-q13',
        text: 'Calculate: 10% of £360 (in pounds)',
        options: [],
        correctAnswer: '36',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'Divide £360 by 10.',
        explanation: '360 ÷ 10 = 36.'
      },
      {
        id: 'y5-arith-q14',
        text: 'Select the comparison symbol to make this statement true: 3,500 ml [ ? ] 3.5 L',
        options: ['<', '>', '='],
        correctAnswer: '=',
        marks: 1,
        type: 'Comparison Symbols',
        linkedLearningGoal: 'Measurement & Units',
        hint: '1 Litre = 1,000 millilitres. 3.5 × 1,000 = 3,500.',
        explanation: '3,500 ml = 3.5 L, so the symbol is =.'
      },
      {
        id: 'y5-arith-q15',
        text: 'Calculate: 3/4 of 48',
        options: [],
        correctAnswer: '36',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'Divide 48 by 4 (12), then multiply by 3.',
        explanation: '12 × 3 = 36.'
      },
      {
        id: 'y5-arith-q16',
        text: 'What is 45 × 100?',
        options: ['450', '4,500', '45,000', '405'],
        correctAnswer: '4,500',
        marks: 1,
        type: 'Multiple Choice',
        linkedLearningGoal: 'Multiplication & Division',
        hint: 'Move digits two places to the left.',
        explanation: '45 × 100 = 4,500.'
      },
      {
        id: 'y5-arith-q17',
        text: 'Calculate: 50 × 60',
        options: [],
        correctAnswer: '3000',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Multiplication & Division',
        hint: '5 × 6 = 30, then append two zeros.',
        explanation: '50 × 60 = 3,000.'
      },
      {
        id: 'y5-arith-q18',
        text: 'Select ALL the factors of 24:',
        options: ['2', '3', '5', '6', '7', '8'],
        correctAnswer: '2, 3, 6, 8',
        marks: 2,
        type: 'Checkboxes',
        linkedLearningGoal: 'Multiplication & Factors',
        hint: 'Check if 24 divides cleanly by each number.',
        explanation: '24 ÷ 2 = 12, 24 ÷ 3 = 8, 24 ÷ 6 = 4, 24 ÷ 8 = 3. 5 and 7 leave remainders.'
      },
      {
        id: 'y5-arith-q19',
        text: 'Calculate: 1 - 3/10 (Write as a fraction)',
        options: [],
        correctAnswer: '7/10',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'Write 1 as 10/10. 10/10 - 3/10 = ?',
        explanation: '10/10 - 3/10 = 7/10.'
      },
      {
        id: 'y5-arith-q20',
        text: 'Calculate: 324 × 5',
        options: [],
        correctAnswer: '1620',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Multiplication & Division',
        hint: '300 × 5 = 1500; 24 × 5 = 120.',
        explanation: '1500 + 120 = 1,620.'
      }
    ]
  },

  // ==========================================
  // 4. YEAR 5 MATHEMATICAL REASONING PAPER (20 QUESTIONS)
  // ==========================================
  {
    id: 'y5-reasoning-mastery',
    title: 'Year 5 Mathematical Reasoning Test (20 Questions)',
    subject: 'maths',
    yearGroup: 5,
    timeLimitSeconds: 2100,
    active: true,
    createdByTeacher: 'joseph.riste@dersingham.newham.sch.uk',
    createdByClass: 'Class 18',
    questions: [
      {
        id: 'y5-reas-q1',
        text: 'A cinema ticket costs £7.50 for a child and £12.00 for an adult. How much does it cost for 2 adults and 2 children in total?',
        options: ['£35.00', '£39.00', '£42.00', '£37.50'],
        correctAnswer: '£39.00',
        marks: 1,
        type: 'Multiple Choice',
        linkedLearningGoal: 'Addition & Subtraction',
        hint: '2 adults = £24.00. 2 children = £15.00. Sum them.',
        explanation: '£24 + £15 = £39.00.'
      },
      {
        id: 'y5-reas-q2',
        text: 'What is the perimeter in cm of a regular pentagon with sides measuring 8 cm each?',
        options: [],
        correctAnswer: '40',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Area & Perimeter',
        hint: 'A pentagon has 5 equal sides: 5 × 8.',
        explanation: '5 × 8 = 40 cm.'
      },
      {
        id: 'y5-reas-q3',
        text: 'Select the comparison symbol to make this true: 45 minutes [ ? ] 3/4 hour',
        options: ['<', '>', '='],
        correctAnswer: '=',
        marks: 1,
        type: 'Comparison Symbols',
        linkedLearningGoal: 'Measurement & Time',
        hint: '1 hour is 60 minutes. 3/4 of 60 is 45.',
        explanation: '3/4 of 60 mins = 45 mins. So the symbol is =.'
      },
      {
        id: 'y5-reas-q4',
        text: 'Select ALL the 3D shapes that have curved surfaces:',
        options: ['Cylinder', 'Cone', 'Cuboid', 'Sphere', 'Square Pyramid'],
        correctAnswer: 'Cylinder, Cone, Sphere',
        marks: 2,
        type: 'Checkboxes',
        linkedLearningGoal: 'Geometry: Properties of Shapes',
        hint: 'Which shapes can roll smoothly?',
        explanation: 'Cylinders, Cones, and Spheres have curved surfaces.'
      },
      {
        id: 'y5-reas-q5',
        text: 'From the amounts below, identify the SMALLEST and LARGEST: £3.05, £3.50, £3.55, £3.15',
        options: ['£3.05', '£3.15', '£3.50', '£3.55'],
        correctAnswer: 'Smallest: £3.05, Largest: £3.55',
        marks: 2,
        type: 'Smallest/Largest',
        linkedLearningGoal: 'Decimals & Money',
        hint: 'Convert to pence: 305p, 350p, 355p, 315p.',
        explanation: '£3.05 is the smallest; £3.55 is the largest.'
      },
      {
        id: 'y5-reas-q6',
        text: 'What number is 1,000 less than 40,250?',
        options: [],
        correctAnswer: '39250',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Number & Place Value',
        hint: 'Subtract 1,000 from 40,250.',
        explanation: '40,250 - 1,000 = 39,250.'
      },
      {
        id: 'y5-reas-q7',
        text: 'Match each angle description to its type:',
        options: ['45° -> Acute', '90° -> Right Angle', '125° -> Obtuse', '180° -> Straight Line'],
        correctAnswer: '45° -> Acute, 90° -> Right Angle, 125° -> Obtuse, 180° -> Straight Line',
        marks: 2,
        type: 'Matching Pairs',
        linkedLearningGoal: 'Geometry: Properties of Shapes',
        hint: 'Acute is less than 90°. Obtuse is between 90° and 180°.',
        explanation: '45° = Acute; 90° = Right Angle; 125° = Obtuse; 180° = Straight Line.'
      },
      {
        id: 'y5-reas-q8',
        text: 'True or False: Every multiple of 10 is also a multiple of 5.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        marks: 1,
        type: 'True/False',
        linkedLearningGoal: 'Reasoning with Numbers',
        hint: '10, 20, 30, 40... all end in 0. Are they divisible by 5?',
        explanation: 'Since 10 = 2 × 5, any multiple of 10 is also a multiple of 5.'
      },
      {
        id: 'y5-reas-q9',
        text: 'Select the correct unit to measure the distance from London to Birmingham:',
        options: ['m', 'km', 'cm', 'mm'],
        correctAnswer: 'km',
        marks: 1,
        type: 'Unit Selection',
        linkedLearningGoal: 'Measurement & Units',
        hint: 'Long road distances between cities are measured in kilometres.',
        explanation: 'Kilometres (km) is used for long geographical distances.'
      },
      {
        id: 'y5-reas-q10',
        text: 'Sort these numbers into Prime and Composite: 2, 9, 11, 15, 17, 21',
        options: [],
        correctAnswer: 'Prime: 2, 11, 17 | Composite: 9, 15, 21',
        marks: 2,
        type: 'Sorting',
        linkedLearningGoal: 'Number Properties & Primes',
        hint: 'Composite numbers have more than 2 factors.',
        explanation: 'Primes: 2, 11, 17; Composites: 9 (3×3), 15 (3×5), 21 (3×7).'
      },
      {
        id: 'y5-reas-q11',
        text: 'A rectangle has an area of 48 cm². Its width is 6 cm. What is its length in cm?',
        options: [],
        correctAnswer: '8',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Area & Perimeter',
        hint: 'Area = length × width. 48 ÷ 6 = ?',
        explanation: '48 ÷ 6 = 8 cm.'
      },
      {
        id: 'y5-reas-q12',
        text: 'Which of these fractions is equivalent to 3/5?',
        options: ['6/10', '9/20', '12/15', '5/3'],
        correctAnswer: '6/10',
        marks: 1,
        type: 'Multiple Choice',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'Multiply numerator and denominator by 2.',
        explanation: '(3 × 2) / (5 × 2) = 6/10.'
      },
      {
        id: 'y5-reas-q13',
        text: 'A race starts at 14:25 and finishes at 15:10. How many minutes did the race last?',
        options: [],
        correctAnswer: '45',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Measurement & Time',
        hint: '14:25 to 15:00 is 35 mins, then add 10 mins.',
        explanation: '35 + 10 = 45 minutes.'
      },
      {
        id: 'y5-reas-q14',
        text: 'Select the comparison symbol to make this statement true: 3/4 [ ? ] 0.8',
        options: ['<', '>', '='],
        correctAnswer: '<',
        marks: 1,
        type: 'Comparison Symbols',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: '3/4 = 0.75. Compare 0.75 with 0.80.',
        explanation: '0.75 < 0.80, so the symbol is <.'
      },
      {
        id: 'y5-reas-q15',
        text: 'Select ALL the acute angles from the list below:',
        options: ['35°', '89°', '90°', '115°', '72°'],
        correctAnswer: '35°, 89°, 72°',
        marks: 2,
        type: 'Checkboxes',
        linkedLearningGoal: 'Geometry: Properties of Shapes',
        hint: 'Acute angles are strictly less than 90°.',
        explanation: '35°, 89°, and 72° are acute. 90° is a right angle; 115° is obtuse.'
      },
      {
        id: 'y5-reas-q16',
        text: 'A book has 240 pages. Sarah reads 1/4 of the book on Monday and 1/3 on Tuesday. How many pages did she read on Tuesday?',
        options: [],
        correctAnswer: '80',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'Calculate 1/3 of 240: 240 ÷ 3.',
        explanation: '240 ÷ 3 = 80 pages.'
      },
      {
        id: 'y5-reas-q17',
        text: 'Match each Roman numeral to its value:',
        options: ['V -> 5', 'X -> 10', 'L -> 50', 'C -> 100'],
        correctAnswer: 'V -> 5, X -> 10, L -> 50, C -> 100',
        marks: 2,
        type: 'Matching Pairs',
        linkedLearningGoal: 'Number & Place Value',
        hint: 'Basic Roman numerals.',
        explanation: 'V = 5, X = 10, L = 50, C = 100.'
      },
      {
        id: 'y5-reas-q18',
        text: 'True or False: The sum of two even numbers is always an even number.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        marks: 1,
        type: 'True/False',
        linkedLearningGoal: 'Reasoning with Numbers',
        hint: 'Test: 4 + 6 = 10, 8 + 12 = 20.',
        explanation: 'Even + Even = Even.'
      },
      {
        id: 'y5-reas-q19',
        text: 'What is 84 rounded to the nearest 10?',
        options: [],
        correctAnswer: '80',
        marks: 1,
        type: 'Number Input',
        linkedLearningGoal: 'Number & Place Value',
        hint: 'Look at the units digit (4). Is it less than 5?',
        explanation: 'Since 4 < 5, 84 rounds down to 80.'
      },
      {
        id: 'y5-reas-q20',
        text: 'From the fractions below, identify the SMALLEST and the LARGEST: 1/8, 1/2, 1/4, 1/10',
        options: ['1/10', '1/8', '1/4', '1/2'],
        correctAnswer: 'Smallest: 1/10, Largest: 1/2',
        marks: 2,
        type: 'Smallest/Largest',
        linkedLearningGoal: 'Fractions, Decimals & Percentages',
        hint: 'With unit fractions (numerator 1), larger denominator means smaller slice!',
        explanation: '1/10 is the smallest fraction; 1/2 is the largest.'
      }
    ]
  }
];
