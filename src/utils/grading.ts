/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Test, Question } from '../types';

export interface QuestionGradeDetail {
  questionId: string;
  text: string;
  type: string;
  topic: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  marksAwarded: number;
  maxMarks: number;
}

export interface TopicDiagnostic {
  topic: string;
  totalMarks: number;
  scoredMarks: number;
  totalQuestions: number;
  correctQuestions: number;
  percentage: number;
}

export interface GradingResult {
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  topicBreakdown: Record<string, TopicDiagnostic>;
  questionDetails: QuestionGradeDetail[];
}

/**
 * Normalizes strings for robust matching: removes extra whitespace and lowercases.
 */
function cleanString(val: string | undefined | null): string {
  if (!val) return '';
  return val.trim().toLowerCase();
}

/**
 * Parses numeric value supporting fractions (e.g. "3/4" -> 0.75), decimals, and negative numbers.
 */
function parseNumericValue(val: string): number | null {
  if (!val) return null;
  const cleaned = val.trim().replace(/[£$,%]/g, '').trim();
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (!isNaN(num) && !isNaN(den) && den !== 0) {
        return num / den;
      }
    }
  }
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

/**
 * Helper to parse matching pairs: e.g. "A -> 1, B -> 2" or "A:1, B:2"
 */
export function parsePairMappings(val: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!val) return result;
  const pairs = val.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
  pairs.forEach(p => {
    let parts = p.split('->');
    if (parts.length < 2) parts = p.split(':');
    if (parts.length < 2) parts = p.split('=');
    if (parts.length >= 2) {
      const k = parts[0].trim().toLowerCase();
      const v = parts.slice(1).join(':').trim().toLowerCase();
      if (k) result[k] = v;
    }
  });
  return result;
}

/**
 * Helper to parse category sorting: e.g. "Prime: 2, 3, 5 | Composite: 4, 6, 8"
 */
export function parseSortingCategories(val: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!val) return result;
  const groups = val.split('|').map(s => s.trim()).filter(Boolean);
  groups.forEach(g => {
    const parts = g.split(':');
    if (parts.length >= 2) {
      const category = parts[0].trim();
      const items = parts[1].split(',').map(s => s.trim()).filter(Boolean);
      items.forEach(item => {
        result[cleanString(item)] = cleanString(category);
      });
    }
  });
  return result;
}

/**
 * Parses smallest and largest value from student or answer string
 */
export function parseSmallestLargest(val: string): { smallest: string; largest: string } {
  const str = cleanString(val);
  const smallestMatch = str.match(/smallest\s*:\s*([^,;|]+)/i);
  const largestMatch = str.match(/largest\s*:\s*([^,;|]+)/i);

  if (smallestMatch && largestMatch) {
    return {
      smallest: cleanString(smallestMatch[1]),
      largest: cleanString(largestMatch[1]),
    };
  }

  // Comma separated fallback: "0.08, 0.81" or array
  const parts = str.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      smallest: parts[0],
      largest: parts[parts.length - 1],
    };
  }

  return { smallest: str, largest: str };
}

/**
 * Complete client-side local grading function (gradeTestLocally)
 * Instantly marks all question types:
 * - Multiple Choice
 * - Checkboxes
 * - True/False
 * - Smallest/Largest
 * - Matching Pairs
 * - Sorting
 * - Number Input
 * - Unit Selection
 * - Comparison Symbols
 * Plus legacy types: Ranking, Dropdown, NumberLine, FillBlank
 */
export function gradeTestLocally(test: Test, selectedAnswers: Record<string, string>): GradingResult {
  let totalScore = 0;
  let maxPossibleScore = 0;
  const questionDetails: QuestionGradeDetail[] = [];
  const topicBreakdown: Record<string, TopicDiagnostic> = {};

  test.questions.forEach((q: Question) => {
    const qMarks = q.marks || 1;
    maxPossibleScore += qMarks;

    const rawStudentAnswer = selectedAnswers[q.id] || '';
    const cleanStudentAnswer = cleanString(rawStudentAnswer);
    const cleanCorrectAnswer = cleanString(q.correctAnswer);

    const qType = (q.type || 'Multiple Choice').trim();
    const topic = q.linkedLearningGoal || (q as any).subject || (test as any).subject || 'General Assessment';

    let isCorrect = false;

    // Detect question type
    const isCheckbox =
      qType.toLowerCase() === 'checkboxes' ||
      qType.toLowerCase() === 'check box' ||
      qType.toLowerCase() === 'checkboxes/multiple choice' ||
      q.text.toLowerCase().includes('select all') ||
      q.text.toLowerCase().includes('tick all');

    const isTrueFalse =
      qType.toLowerCase() === 'true/false' ||
      qType.toLowerCase() === 'true false' ||
      qType.toLowerCase() === 'boolean';

    const isSmallestLargest =
      qType.toLowerCase() === 'smallest/largest' ||
      qType.toLowerCase() === 'smallest largest' ||
      qType.toLowerCase() === 'min/max' ||
      (q.text.toLowerCase().includes('smallest') && q.text.toLowerCase().includes('largest'));

    const isMatchingPairs =
      qType.toLowerCase() === 'matching pairs' ||
      qType.toLowerCase() === 'pairs' ||
      qType.toLowerCase() === 'matching';

    const isSorting =
      qType.toLowerCase() === 'sorting' ||
      qType.toLowerCase() === 'categorize' ||
      qType.toLowerCase() === 'two columns';

    const isNumberInput =
      qType.toLowerCase() === 'number input' ||
      qType.toLowerCase() === 'numeric' ||
      qType.toLowerCase() === 'calculation' ||
      qType.toLowerCase() === 'number';

    const isUnitSelection =
      qType.toLowerCase() === 'unit selection' ||
      qType.toLowerCase() === 'units' ||
      qType.toLowerCase() === 'unit';

    const isComparisonSymbols =
      qType.toLowerCase() === 'comparison symbols' ||
      qType.toLowerCase() === 'comparison' ||
      qType.toLowerCase() === 'symbols' ||
      q.text.includes('<, > or =') ||
      q.text.includes('<, > or =') ||
      q.text.includes('<, > or =');

    // 1. Multiple Choice
    if (qType === 'Multiple Choice' && !isCheckbox && !isComparisonSymbols && !isTrueFalse) {
      if (cleanStudentAnswer === cleanCorrectAnswer && cleanStudentAnswer.length > 0) {
        isCorrect = true;
      } else {
        // Fallback for options like "A) 24" where answer is "24"
        const optClean = cleanCorrectAnswer.replace(/^[a-d]\s*[\)\.\-]\s*/i, '').trim();
        const studClean = cleanStudentAnswer.replace(/^[a-d]\s*[\)\.\-]\s*/i, '').trim();
        if (optClean === studClean && optClean.length > 0) {
          isCorrect = true;
        }
      }
    }
    // 2. Checkboxes
    else if (isCheckbox) {
      const studentSet = new Set(
        rawStudentAnswer
          .split(/[,;\n]+/)
          .map(s => s.trim().toLowerCase())
          .filter(Boolean)
      );
      const correctSet = new Set(
        q.correctAnswer
          .split(/[,;\n]+/)
          .map(s => s.trim().toLowerCase())
          .filter(Boolean)
      );

      if (studentSet.size > 0 && studentSet.size === correctSet.size) {
        let allMatch = true;
        studentSet.forEach(val => {
          if (!correctSet.has(val)) allMatch = false;
        });
        isCorrect = allMatch;
      }
    }
    // 3. True/False
    else if (isTrueFalse) {
      const sVal = cleanStudentAnswer.startsWith('t') ? 'true' : cleanStudentAnswer.startsWith('f') ? 'false' : cleanStudentAnswer;
      const cVal = cleanCorrectAnswer.startsWith('t') ? 'true' : cleanCorrectAnswer.startsWith('f') ? 'false' : cleanCorrectAnswer;
      isCorrect = sVal === cVal && sVal.length > 0;
    }
    // 4. Smallest/Largest
    else if (isSmallestLargest) {
      const studentSL = parseSmallestLargest(rawStudentAnswer);
      const correctSL = parseSmallestLargest(q.correctAnswer);

      const sSmallNum = parseNumericValue(studentSL.smallest);
      const cSmallNum = parseNumericValue(correctSL.smallest);
      const sLargeNum = parseNumericValue(studentSL.largest);
      const cLargeNum = parseNumericValue(correctSL.largest);

      const smallMatch =
        sSmallNum !== null && cSmallNum !== null
          ? Math.abs(sSmallNum - cSmallNum) < 0.0001
          : studentSL.smallest === correctSL.smallest;

      const largeMatch =
        sLargeNum !== null && cLargeNum !== null
          ? Math.abs(sLargeNum - cLargeNum) < 0.0001
          : studentSL.largest === correctSL.largest;

      isCorrect = smallMatch && largeMatch && studentSL.smallest.length > 0;
    }
    // 5. Matching Pairs
    else if (isMatchingPairs) {
      const correctPairs = parsePairMappings(q.correctAnswer);
      const studentPairs = parsePairMappings(rawStudentAnswer);
      const correctKeys = Object.keys(correctPairs);

      if (correctKeys.length > 0) {
        let allMatched = true;
        for (const k of correctKeys) {
          if (studentPairs[k] !== correctPairs[k]) {
            allMatched = false;
            break;
          }
        }
        isCorrect = allMatched;
      }
    }
    // 6. Sorting
    else if (isSorting) {
      const correctSorting = parseSortingCategories(q.correctAnswer);
      const studentSorting = parseSortingCategories(rawStudentAnswer);
      const items = Object.keys(correctSorting);

      if (items.length > 0) {
        let allMatched = true;
        for (const item of items) {
          if (studentSorting[item] !== correctSorting[item]) {
            allMatched = false;
            break;
          }
        }
        isCorrect = allMatched;
      }
    }
    // 7. Number Input
    else if (isNumberInput) {
      const sNum = parseNumericValue(rawStudentAnswer);
      const cNum = parseNumericValue(q.correctAnswer);

      if (sNum !== null && cNum !== null) {
        isCorrect = Math.abs(sNum - cNum) < 0.001;
      } else {
        // Textual or fraction string fallback
        const sClean = cleanStudentAnswer.replace(/\s+/g, '');
        const cClean = cleanCorrectAnswer.replace(/\s+/g, '');
        isCorrect = sClean === cClean && sClean.length > 0;
      }
    }
    // 8. Unit Selection
    else if (isUnitSelection) {
      // Normalize unit representations
      const normalizeUnit = (u: string) => {
        return cleanString(u)
          .replace(/square\s*met(?:re|er)s?/i, 'm²')
          .replace(/met(?:re|er)s?/i, 'm')
          .replace(/centimet(?:re|er)s?/i, 'cm')
          .replace(/millimet(?:re|er)s?/i, 'mm')
          .replace(/kilomet(?:re|er)s?/i, 'km')
          .replace(/kilograms?/i, 'kg')
          .replace(/grams?/i, 'g')
          .replace(/millilit(?:re|er)s?/i, 'ml')
          .replace(/lit(?:re|er)s?/i, 'l')
          .replace(/seconds?/i, 's')
          .replace(/minutes?/i, 'mins')
          .replace(/hours?/i, 'hrs')
          .trim();
      };
      isCorrect = normalizeUnit(rawStudentAnswer) === normalizeUnit(q.correctAnswer) && rawStudentAnswer.trim().length > 0;
    }
    // 9. Comparison Symbols (<, >, =)
    else if (isComparisonSymbols) {
      const extractSymbol = (s: string) => {
        if (s.includes('<=')) return '<=';
        if (s.includes('>=')) return '>=';
        if (s.includes('<')) return '<';
        if (s.includes('>')) return '>';
        if (s.includes('=')) return '=';
        return cleanString(s);
      };
      const sSymbol = extractSymbol(rawStudentAnswer);
      const cSymbol = extractSymbol(q.correctAnswer);
      isCorrect = sSymbol === cSymbol && sSymbol.length > 0;
    }
    // 10. Legacy types (Ranking, Dropdown, NumberLine, FillBlank)
    else if (qType === 'Ranking') {
      const studentOrder = rawStudentAnswer.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const correctOrder = q.correctAnswer.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      let match = studentOrder.length === correctOrder.length && studentOrder.length > 0;
      if (match) {
        for (let i = 0; i < studentOrder.length; i++) {
          if (studentOrder[i] !== correctOrder[i]) {
            match = false;
            break;
          }
        }
      }
      isCorrect = match;
    } else if (qType === 'Dropdown') {
      const studentNorm = rawStudentAnswer.split(',').map(s => s.trim().toLowerCase().replace(/\s+/g, '')).join(',');
      const correctNorm = q.correctAnswer.split(',').map(s => s.trim().toLowerCase().replace(/\s+/g, '')).join(',');
      isCorrect = studentNorm === correctNorm && studentNorm.length > 0;
    } else if (qType === 'NumberLine') {
      const sNum = parseFloat(rawStudentAnswer.trim());
      const cNum = parseFloat(q.correctAnswer.trim());
      isCorrect = !isNaN(sNum) && !isNaN(cNum) && Math.abs(sNum - cNum) <= 1;
    } else if (qType === 'FillBlank') {
      const sClean = rawStudentAnswer.toLowerCase().replace(/\s+/g, '');
      const cClean = q.correctAnswer.toLowerCase().replace(/\s+/g, '');
      isCorrect = sClean === cClean && sClean.length > 0;
    } else {
      // Default exact string match
      isCorrect = cleanStudentAnswer === cleanCorrectAnswer && cleanStudentAnswer.length > 0;
    }

    const marksAwarded = isCorrect ? qMarks : 0;
    totalScore += marksAwarded;

    // Track Question detail
    questionDetails.push({
      questionId: q.id,
      text: q.text,
      type: qType,
      topic,
      studentAnswer: rawStudentAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      marksAwarded,
      maxMarks: qMarks,
    });

    // Accumulate diagnostic topic breakdown
    if (!topicBreakdown[topic]) {
      topicBreakdown[topic] = {
        topic,
        totalMarks: 0,
        scoredMarks: 0,
        totalQuestions: 0,
        correctQuestions: 0,
        percentage: 0,
      };
    }

    topicBreakdown[topic].totalMarks += qMarks;
    topicBreakdown[topic].scoredMarks += marksAwarded;
    topicBreakdown[topic].totalQuestions += 1;
    if (isCorrect) {
      topicBreakdown[topic].correctQuestions += 1;
    }
  });

  // Calculate percentages for each topic
  Object.keys(topicBreakdown).forEach(t => {
    const diag = topicBreakdown[t];
    diag.percentage = diag.totalMarks > 0 ? Math.round((diag.scoredMarks / diag.totalMarks) * 100) : 0;
  });

  const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  return {
    totalScore,
    maxPossibleScore,
    percentage,
    topicBreakdown,
    questionDetails,
  };
}
