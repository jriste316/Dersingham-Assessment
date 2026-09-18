/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogOut,
  ArrowLeft,
  BookOpen,
  Calculator,
  Compass,
  Clock,
  CheckCircle,
  HelpCircle,
  Award,
  BookMarked,
  Hourglass,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import { User, Test, Question, ScoreRecord, Subject } from '../types';
import { SCIENCE_TESTS } from '../scienceData';
import { db } from '../firebase';
import { gradeTestLocally, parseSmallestLargest, GradingResult } from '../utils/grading';

interface StudentPortalProps {
  key?: string;
  user: User;
  onLogout: () => void;
  activeTests: Test[];
  onSaveScore: (record: Omit<ScoreRecord, 'id' | 'completedAt'>) => void;
  historicRecords: ScoreRecord[];
}

// Year configuration helping string/numeric conversions
// Parsing and grading helpers for interactive question types:
const splitPairItem = (pair: string): [string, string] => {
  if (pair.includes('->')) {
    const parts = pair.split('->');
    return [parts[0]?.trim() || '', parts[1]?.trim() || ''];
  }
  if (pair.includes('=')) {
    const parts = pair.split('=');
    return [parts[0]?.trim() || '', parts[1]?.trim() || ''];
  }
  if (pair.includes(':')) {
    const parts = pair.split(':');
    return [parts[0]?.trim() || '', parts[1]?.trim() || ''];
  }
  return [pair.trim(), ''];
};

const parseLeftItems = (correctAnswerStr: string): string[] => {
  if (!correctAnswerStr) return [];
  return correctAnswerStr.split(',').map(pair => splitPairItem(pair)[0]).filter(Boolean);
};

const parseRightItems = (correctAnswerStr: string): string[] => {
  if (!correctAnswerStr) return [];
  return correctAnswerStr.split(',').map(pair => splitPairItem(pair)[1]).filter(Boolean);
};

const parseSortingColumns = (correctAnswerStr: string): string[] => {
  if (!correctAnswerStr) return [];
  return correctAnswerStr.split('|').map(part => {
    const sep = part.includes(':') ? ':' : '=';
    const sub = part.split(sep);
    return sub[0] ? sub[0].trim() : '';
  }).filter(Boolean);
};

const parseSortingItemsAll = (correctAnswerStr: string): string[] => {
  if (!correctAnswerStr) return [];
  const items: string[] = [];
  correctAnswerStr.split('|').forEach(part => {
    const sep = part.includes(':') ? ':' : '=';
    const sub = part.split(sep);
    if (sub.length >= 2) {
      const list = sub[1].split(',').map(s => s.trim()).filter(Boolean);
      items.push(...list);
    }
  });
  return items;
};

const parsePairMappings = (str: string) => {
  if (!str) return {};
  const mapping: Record<string, string> = {};
  str.split(',').forEach(p => {
    const [left, right] = splitPairItem(p);
    if (left && right) {
      mapping[left.toLowerCase()] = right.toLowerCase();
    }
  });
  return mapping;
};

const parseSortingCategories = (str: string) => {
  if (!str) return {};
  const mapping: Record<string, string> = {}; // item lowercase -> category name lowercase
  const parts = str.split('|');
  parts.forEach(part => {
    const sep = part.includes(':') ? ':' : '=';
    const sub = part.split(sep);
    if (sub.length >= 2) {
      const category = sub[0].trim().toLowerCase();
      const items = sub[1].split(',').map(item => item.trim().toLowerCase()).filter(Boolean);
      items.forEach(item => {
        mapping[item] = category;
      });
    }
  });
  return mapping;
};

const extractSmallestLargestOptions = (q: Question): string[] => {
  if (q.options && q.options.length > 0) {
    return q.options;
  }
  const colonIdx = q.text.lastIndexOf(':');
  if (colonIdx !== -1) {
    const candidate = q.text.slice(colonIdx + 1);
    const split = candidate.split(',').map(s => s.trim().replace(/[.?]$/, '')).filter(Boolean);
    if (split.length >= 2) return split;
  }
  const parsed = parseSmallestLargest(q.correctAnswer);
  if (parsed.smallest && parsed.largest) {
    return [parsed.smallest, parsed.largest];
  }
  return [];
};

const parseDropdownText = (text: string) => {
  const regex = /\[([^\]]+)\]/g;
  const parts: { type: 'text' | 'dropdown'; content: string; options?: string[]; index?: number }[] = [];
  let lastIndex = 0;
  let match;
  let dropdownIdx = 0;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.index)
      });
    }
    
    // Check if it's a blank or a split dropdown (blank has no '/' or is explicitly blank)
    const isBlank = match[1].toLowerCase() === 'blank' || !match[1].includes('/');
    if (isBlank) {
      // Just plain text
      parts.push({
        type: 'text',
        content: match[0]
      });
    } else {
      const options = match[1].split('/').map(s => s.trim());
      parts.push({
        type: 'dropdown',
        content: match[0],
        options,
        index: dropdownIdx++
      });
    }
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }
  
  return parts;
};

const parseBlankText = (text: string) => {
  const parts: { type: 'text' | 'blank'; content: string; index?: number }[] = [];
  let lastIndex = 0;
  let match;
  let blankIdx = 0;
  const regex = /\[blank\]/gi;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.index)
      });
    }
    
    parts.push({
      type: 'blank',
      content: match[0],
      index: blankIdx++
    });
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }
  
  return parts;
};

const parseNumberLineOptions = (options: string[]) => {
  let min = 0;
  let max = 100;
  let step = 10;
  
  if (options && options.length > 0) {
    const parts = options.join(',').split(',').map(s => parseFloat(s.trim()));
    if (!isNaN(parts[0])) min = parts[0];
    if (!isNaN(parts[1])) max = parts[1];
    if (!isNaN(parts[2])) step = parts[2];
  }
  
  return { min, max, step };
};

const STAGES = [
  { id: 'Nursery', label: 'Nursery 🌱', numeric: 1, sub: 'Early Years (EYFS) Explorer ✨' },
  { id: 'Reception', label: 'Reception 👑', numeric: 2, sub: 'Early Years Foundation Stage ✨' },
  { id: 'Year 1', label: 'Year 1 🌟', numeric: 1, sub: 'Key Stage 1 (KS1) Explorer ✨' },
  { id: 'Year 2', label: 'Year 2 🚀', numeric: 2, sub: 'Key Stage 1 (KS1) Champion 🏆' },
  { id: 'Year 3', label: 'Year 3 🧬', numeric: 3, sub: 'Lower Key Stage 2 (LKS2) Leader 🚀' },
  { id: 'Year 4', label: 'Year 4 🧪', numeric: 4, sub: 'Lower Key Stage 2 (LKS2) Leader 🚀' },
  { id: 'Year 5', label: 'Year 5 🪐', numeric: 5, sub: 'Upper Key Stage 2 (UKS2) Champion 🏆' },
  { id: 'Year 6', label: 'Year 6 ⚡', numeric: 6, sub: 'Upper Key Stage 2 (UKS2) Champion 🏆' },
];

const SUBJECTS = [
  { id: 'science', label: 'Science 🧪' },
  { id: 'history', label: 'History 🏰' },
  { id: 'geography', label: 'Geography 🌍' },
  { id: 'computing', label: 'Computing 💻' },
  { id: 'art', label: 'Art 🎨' },
  { id: 'dt', label: 'DT 🛠️' },
  { id: 'music', label: 'Music 🎵' },
  { id: 'pshe', label: 'PSHE 🤝' },
  { id: 're', label: 'RE 🕊️' },
  { id: 'pe', label: 'PE 🏃' },
  { id: 'maths', label: 'Maths 📐' },
  { id: 'reading', label: 'Reading 📖' },
  { id: 'spag', label: 'SPAG ✒️' }
];

// Smart utility that parses standard Google Drive sharing links and converts them to direct high-speed image URLs
function parseGoogleDriveLink(url: string): string {
  if (!url) return '';
  const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch && idParamMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idParamMatch[1]}`;
  }
  const driveMatch = url.match(/drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  return url;
}

// Reusable SVG Diagrams or Custom Images for interactive questions (especially Science!)
const QuestionDiagram = ({ subject, text, imageLink }: { subject: string; text: string; imageLink?: string }) => {
  if (imageLink) {
    const directUrl = parseGoogleDriveLink(imageLink);
    return (
      <div className="w-full h-full max-h-[250px] bg-white border-3 border-slate-900 rounded-xl overflow-hidden shadow-brutal-sm flex items-center justify-center p-1.5 select-none">
        <img
          src={directUrl}
          alt="Assessment Illustration"
          className="max-w-full max-h-full object-contain rounded-lg"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // If image fails, show placeholder with notice
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  const query = text.toLowerCase();
  
  if (subject === 'science') {
    if (query.includes('center') || query.includes('orbit') || query.includes('moon') || query.includes('space') || query.includes('solar')) {
      return (
        <svg width="200" height="200" viewBox="0 0 100 100" className="w-full h-full max-h-[250px] bg-slate-900 border-3 border-slate-900 rounded-xl shadow-brutal-sm p-2 select-none">
          {/* Deep dark space */}
          <circle cx="50" cy="50" r="3" fill="#ffffff" opacity="0.6" className="animate-pulse" />
          <circle cx="20" cy="30" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="80" cy="20" r="2" fill="#ffffff" opacity="0.4" />
          <circle cx="15" cy="75" r="2.5" fill="#ffffff" opacity="0.5" />
          <circle cx="85" cy="80" r="1" fill="#ffffff" opacity="0.9" />
          
          {/* Orbits */}
          <circle cx="50" cy="50" r="26" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" fill="none" />
          <circle cx="50" cy="50" r="42" stroke="#475569" strokeWidth="1" strokeDasharray="4 2" fill="none" />
          
          {/* Sun */}
          <circle cx="50" cy="50" r="14" fill="#FBBF24" stroke="#1E293B" strokeWidth="2" />
          <circle cx="50" cy="50" r="16" fill="none" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="2 1" opacity="0.6" />
          
          {/* Earth system on inner orbit with rotational floating effect */}
          <g>
            <circle cx="50" cy="24" r="6" fill="#3B82F6" stroke="#1E293B" strokeWidth="2" />
            {/* Moon orbit */}
            <circle cx="50" cy="24" r="11" stroke="#64748B" strokeWidth="0.75" strokeDasharray="2 2" fill="none" />
            {/* Moon */}
            <circle cx="50" cy="13" r="2.5" fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5" />
          </g>
          
          {/* Mars on outer orbit */}
          <circle cx="50" cy="92" r="5" fill="#EF4444" stroke="#1E293B" strokeWidth="2" />
          
          <text x="50" y="40" textAnchor="middle" className="font-mono text-[6px] font-black fill-yellow-100">SUN ☀️</text>
        </svg>
      );
    }
    
    if (query.includes('force') || query.includes('gravity') || query.includes('friction') || query.includes('measure') || query.includes('resistance')) {
      return (
        <svg width="200" height="200" viewBox="0 0 100 100" className="w-full h-full max-h-[250px] bg-slate-50 border-3 border-slate-900 rounded-xl shadow-brutal-sm p-2 select-none">
          {/* Ramp */}
          <path d="M 15,75 L 85,75" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />
          <path d="M 15,75 L 75,35" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <path d="M 75,35 L 75,75" stroke="#1E293B" strokeWidth="3" strokeDasharray="3 3" />
          
          {/* Angle indicator */}
          <path d="M 25,75 Q 30,70 33,75" stroke="#EC4899" strokeWidth="2" fill="none" />
          <text x="36" y="72" className="font-mono text-[7px] font-black fill-pink-600">30°</text>
          
          {/* Toy box sliding */}
          <g transform="rotate(-33.6 45 55) translate(40, 42)">
            <rect x="0" y="0" width="18" height="12" rx="2" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" />
            
            {/* Gravity vector */}
            <path d="M 9,6 L 9,25" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            {/* Friction vector */}
            <path d="M 9,6 L -10,6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          </g>
          <text x="18" y="24" className="font-sans text-[8px] font-black fill-emerald-600">Green = Friction 🧲</text>
          <text x="18" y="34" className="font-sans text-[8px] font-black fill-rose-600">Red = Gravity 🌍</text>
        </svg>
      );
    }
  }

  // No fallback diagram - only show pictures when explicitly matching science topics that need diagrams
  return null;
};

// Comprehensive Question Generator for diverse subjects and term folders
const generateDynamicTest = (subject: string, term: string, yearLabel: string, type: 'topic' | 'skills'): Test => {
  const normSub = subject.toLowerCase();
  const numericYear = STAGES.find(s => s.id === yearLabel)?.numeric || 4;
  
  if (normSub === 'science') {
    const yearData = SCIENCE_TESTS[numericYear];
    if (yearData) {
      const termData = yearData[term];
      if (termData) {
        const testObj = termData[type];
        if (testObj) {
          return {
            ...testObj,
            subject: 'science',
            yearGroup: numericYear,
            active: true
          };
        }
      }
    }
  }

  // Custom definitions
  let title = `${yearLabel} ${subject.toUpperCase()} - ${term} ${type === 'topic' ? 'Topic Study' : 'Skills Practice'}`;
  let questions: Question[] = [];

  // Generate dynamic questions for other subjects (History, Geography, Computing, etc.)
  const subTitleName = subject.charAt(0).toUpperCase() + subject.slice(1);
  title = `${yearLabel} ${subTitleName} - ${term} ${type === 'topic' ? 'Core Unit Review' : 'Skill Tracker'}`;
  
  questions = [
    {
      id: `dyn-q-${normSub}-1`,
      text: `Which core skill is most important when analyzing ${subTitleName} topics?`,
      options: ['Careful evidence check', 'Guessing quickly', 'Leaving things blank', 'Copying files'],
      correctAnswer: 'Careful evidence check',
      marks: 2
    },
    {
      id: `dyn-q-${normSub}-2`,
      text: `Is it true that studying ${subTitleName} helps us understand Newham and the broader world?`,
      options: ['True', 'False'],
      correctAnswer: 'True',
      marks: 2
    },
    {
      id: `dyn-q-${normSub}-3`,
      text: `Select ALL characteristics of an expert ${subTitleName} pupil:`,
      options: ['Asks open questions', 'Reviews work carefully', 'Never helps peers', 'Sleeps through class'],
      correctAnswer: 'Asks open questions, Reviews work carefully',
      marks: 2
    }
  ];

  return {
    id: `dyn-test-${normSub}-${term.replace(/\s+/g, '')}-${type}`,
    title,
    subject: normSub as Subject,
    yearGroup: numericYear,
    timeLimitSeconds: 300,
    questions,
    active: true
  };
};

export default function StudentPortal({
  user,
  onLogout,
  activeTests,
  onSaveScore,
  historicRecords,
}: StudentPortalProps) {
  // Navigation Phases:
  // - 'year-selection'
  // - 'subject-selection'
  // - 'mission-dashboard'
  // - 'test-active'
  // - 'results'
  const [phase, setPhase] = useState<'year-selection' | 'subject-selection' | 'mission-dashboard' | 'test-active' | 'results'>('year-selection');
  
  // Custom year and subject variables supporting prototype
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    if (user.class) {
      const clsUpper = user.class.toUpperCase();
      if (
        clsUpper.includes('AA-AM') || 
        clsUpper.includes('AA-PM') || 
        clsUpper === 'AM' || 
        clsUpper === 'PM' || 
        clsUpper.endsWith('-AM') || 
        clsUpper.endsWith('-PM')
      ) {
        return 'Nursery';
      }
      if (clsUpper === 'CW-1' || clsUpper === 'DH-3' || clsUpper === 'RB-2' || /-(1|2|3)$/.test(clsUpper)) {
        return 'Reception';
      }
    }
    if (user.yearGroup) return `Year ${user.yearGroup}`;
    return 'Year 4';
  });
  const [selectedSubject, setSelectedSubject] = useState<string>('science');
  const [selectedTerm, setSelectedTerm] = useState<string>('Autumn 1');
  const [currentTest, setCurrentTest] = useState<Test | null>(null);

  // Active Test state:
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const [showHint, setShowHint] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [testCompletedPhase, setTestCompletedPhase] = useState(false);
  const [tick, setTick] = useState(0); // Trigger re-draws for SVG connectors

  // Results state:
  const [lastSavedRecord, setLastSavedRecord] = useState<ScoreRecord | null>(null);
  const [latestGrading, setLatestGrading] = useState<GradingResult | null>(null);

  // Ranking question state:
  const [shuffledRankingOptions, setShuffledRankingOptions] = useState<Record<string, string[]>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  // New interactive question types states:
  const [scrambledPairsRight, setScrambledPairsRight] = useState<Record<string, string[]>>({});
  const [activeLeftPairItem, setActiveLeftPairItem] = useState<string | null>(null);
  const [scrambledSortItems, setScrambledSortItems] = useState<Record<string, string[]>>({});
  const [activeSortItem, setActiveSortItem] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Convert string YearGroup (e.g. "Year 4") into a numeric yearGroup for database check
  const getSelectedYearNum = (): number => {
    if (selectedYear === 'Nursery') return 1;
    if (selectedYear === 'Reception') return 2;
    const match = selectedYear.match(/\d+/);
    return match ? parseInt(match[0]) : 4;
  };

  // List of terms based on subject type to match prototype
  const getTermsList = () => {
    const sub = selectedSubject.toLowerCase();
    if (sub === 'science' || sub === 'computing' || sub === 're' || sub === 'pe' || sub === 'music' || sub === 'pshe') {
      return ['Autumn 1', 'Autumn 2', 'Spring 1', 'Spring 2', 'Summer 1', 'Summer 2'];
    }
    if (sub === 'history') {
      return ['Autumn Mid Point', 'Autumn End Point', 'Spring Mid Point', 'Spring End Point', 'Summer Mid Point', 'Summer End Point'];
    }
    if (sub === 'geography' || sub === 'art' || sub === 'dt') {
      return ['Autumn', 'Spring', 'Summer'];
    }
    return [];
  };

  // Filter existing static tests configured by the teacher or defaults
  const currentYearNum = getSelectedYearNum();
  const yearTests = activeTests.filter((t) => t.yearGroup === currentYearNum && t.active && t.subject === selectedSubject);

  // Tick the timer left
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      handleAutoSubmit();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isTimerRunning]);

  const startTest = (test: Test) => {
    // Clean up questions to filter out empty options and trailing commas in answers
    const cleanedQuestions = test.questions.map((q) => {
      const cleanedOptions = (q.options || []).map(s => s.trim()).filter(Boolean);
      let cleanedCorrect = q.correctAnswer || '';
      if (q.type === 'Ranking') {
        cleanedCorrect = cleanedCorrect.split(',').map(s => s.trim()).filter(Boolean).join(', ');
      } else {
        cleanedCorrect = cleanedCorrect.trim();
      }
      return {
        ...q,
        options: cleanedOptions,
        correctAnswer: cleanedCorrect,
      };
    });

    const cleanedTest = {
      ...test,
      questions: cleanedQuestions,
    };

    setCurrentTest(cleanedTest);
    setCurrentQuestionIndex(0);
    
    const initialAnswers: Record<string, string> = {};
    const scrambledRanking: Record<string, string[]> = {};
    const scrambledPairs: Record<string, string[]> = {};
    const scrambledSort: Record<string, string[]> = {};
    
    cleanedTest.questions.forEach((q) => {
      if (q.type === 'Ranking') {
        const shuffled = [...q.options];
        // Fisher-Yates shuffle
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        // Ensure they are actually scrambled and don't match the correct answer immediately if possible
        if (shuffled.join(', ') === q.correctAnswer && shuffled.length > 1) {
          [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
        }
        scrambledRanking[q.id] = shuffled;
        initialAnswers[q.id] = shuffled.join(', ');
      } else if (q.type === 'Pairs' || q.type === 'Matching Pairs') {
        const rights = parseRightItems(q.correctAnswer);
        const shuffled = [...rights];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        scrambledPairs[q.id] = shuffled;
        initialAnswers[q.id] = '';
      } else if (q.type === 'Sorting') {
        const items = parseSortingItemsAll(q.correctAnswer);
        const shuffled = [...items];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        scrambledSort[q.id] = shuffled;
        initialAnswers[q.id] = '';
      } else {
        initialAnswers[q.id] = '';
      }
    });

    setShuffledRankingOptions(scrambledRanking);
    setScrambledPairsRight(scrambledPairs);
    setScrambledSortItems(scrambledSort);
    setActiveLeftPairItem(null);
    setSelectedAnswers(initialAnswers);
    setTimeLeft(test.timeLimitSeconds);
    setTestStartTime(Date.now());
    setIsTimerRunning(true);
    setShowHint(false);
    setShowExitConfirm(false);
    setTestCompletedPhase(false);
    setPhase('test-active');
  };

  const handleAutoSubmit = () => {
    setIsTimerRunning(false);
    submitTestAnswers();
  };

  const selectAnswer = (questionId: string, value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Nested helpers for active match / sorting state mutations:
  const getCurrentConnections = (qId: string): Record<string, string> => {
    const ans = selectedAnswers[qId] || '';
    const connections: Record<string, string> = {};
    ans.split(',').forEach(part => {
      const sub = part.split('=');
      if (sub.length >= 2) {
        connections[sub[0].trim()] = sub[1].trim();
      }
    });
    return connections;
  };

  const toggleConnection = (left: string, right: string) => {
    if (!currentQuestion) return;
    const current = getCurrentConnections(currentQuestion.id);
    if (current[left] === right) {
      delete current[left];
    } else {
      current[left] = right;
    }
    const str = Object.entries(current)
      .map(([l, r]) => `${l} = ${r}`)
      .join(', ');
    selectAnswer(currentQuestion.id, str);
    setActiveLeftPairItem(null);
  };

  const getCurrentPupilSorting = (qId: string): Record<string, string[]> => {
    const ans = selectedAnswers[qId] || '';
    const sorting: Record<string, string[]> = {};
    ans.split('|').forEach(part => {
      const sub = part.split('=');
      if (sub.length >= 2) {
        sorting[sub[0].trim()] = sub[1].split(',').map(s => s.trim()).filter(Boolean);
      }
    });
    return sorting;
  };

  const handleSortItem = (item: string, column: string) => {
    if (!currentQuestion) return;
    const current = getCurrentPupilSorting(currentQuestion.id);
    Object.keys(current).forEach(col => {
      current[col] = current[col].filter(i => i !== item);
    });
    if (!current[column]) {
      current[column] = [];
    }
    current[column].push(item);
    const cols = parseSortingColumns(currentQuestion.correctAnswer);
    const str = cols.map(col => {
      const list = current[col] || [];
      return `${col} = ${list.join(', ')}`;
    }).join(' | ');
    selectAnswer(currentQuestion.id, str);
  };

  const handleUnsortItem = (item: string) => {
    if (!currentQuestion) return;
    const current = getCurrentPupilSorting(currentQuestion.id);
    Object.keys(current).forEach(col => {
      current[col] = current[col].filter(i => i !== item);
    });
    const cols = parseSortingColumns(currentQuestion.correctAnswer);
    const str = cols.map(col => {
      const list = current[col] || [];
      return `${col} = ${list.join(', ')}`;
    }).join(' | ');
    selectAnswer(currentQuestion.id, str);
  };

  const handleSelectDropdown = (idx: number, value: string, totalDropdowns: number) => {
    if (!currentQuestion) return;
    const currentAns = selectedAnswers[currentQuestion.id] || '';
    const list = currentAns.split(',').map(s => s.trim());
    while (list.length < totalDropdowns) {
      list.push('');
    }
    list[idx] = value;
    selectAnswer(currentQuestion.id, list.join(', '));
  };

  const submitTestAnswers = () => {
    if (!currentTest) return;
    setIsTimerRunning(false);

    // Build the complete client-side local grading function (gradeTestLocally) that instantly marks all our question types
    const grading = gradeTestLocally(currentTest, selectedAnswers);
    setLatestGrading(grading);

    const scored = grading.totalScore;
    const totalPossiblePoints = grading.maxPossibleScore;
    const durationSecs = Math.round((Date.now() - testStartTime) / 1000);
    const percent = grading.percentage;

    const studentClassName = user.class || (user.yearGroup ? `Class ${user.yearGroup}` : 'Class 18');

    // Connect Firebase Firestore (db.collection('submissions').add(...)) so when a student submits,
    // their name, class, total score, and diagnostic topic breakdown save automatically.
    try {
      (db as any).collection('submissions').add({
        studentName: user.name,
        class: studentClassName,
        studentClass: studentClassName,
        studentUsername: user.username,
        totalScore: scored,
        maxPossibleScore: totalPossiblePoints,
        percentage: percent,
        diagnosticTopicBreakdown: grading.topicBreakdown,
        testId: currentTest.id,
        testTitle: currentTest.title,
        subject: currentTest.subject,
        yearGroup: currentYearNum,
        durationSeconds: durationSecs,
        answers: selectedAnswers,
        submittedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      }).then((docRef: any) => {
        console.log('Submission saved to Firestore with ID:', docRef?.id);
      }).catch((err: any) => {
        console.error('Error saving submission to Firestore:', err);
      });
    } catch (e) {
      console.error('Failed to trigger submission save to Firestore:', e);
    }

    const recordPayload = {
      studentUsername: user.username,
      studentName: user.name,
      yearGroup: currentYearNum,
      testId: currentTest.id,
      testTitle: currentTest.title,
      subject: currentTest.subject,
      score: scored,
      totalQuestions: totalPossiblePoints,
      percentage: percent,
      durationSeconds: durationSecs,
    };

    // Save and retrieve completed record with ID + date
    const mockRecordId = 'rec-user-' + Date.now();
    const compiledRecord: ScoreRecord = {
      ...recordPayload,
      id: mockRecordId,
      completedAt: new Date().toISOString(),
    };

    onSaveScore(recordPayload);
    setLastSavedRecord(compiledRecord);
    setTestCompletedPhase(true);
    setPhase('results');
  };

  const getSubTitleForYear = (label: string) => {
    const matched = STAGES.find(s => s.id === label);
    return matched ? matched.sub : 'Pre-school Explorer ✨';
  };

  const getSubjectIconStr = (subId: string) => {
    switch (subId.toLowerCase()) {
      case 'science': return '🧪';
      case 'history': return '🏰';
      case 'geography': return '🌍';
      case 'computing': return '💻';
      case 'art': return '🎨';
      case 'dt': return '🛠️';
      case 'music': return '🎵';
      case 'pshe': return '🤝';
      case 're': return '🕊️';
      case 'pe': return '🏃';
      case 'maths': return '📐';
      case 'reading': return '📖';
      case 'spag': return '✒️';
      default: return '📚';
    }
  };

  const getPercentageColor = (pct: number) => {
    if (pct >= 85) return 'text-emerald-500 border-emerald-500 bg-emerald-50';
    if (pct >= 55) return 'text-amber-500 border-amber-500 bg-amber-50';
    return 'text-rose-500 border-rose-500 bg-rose-50';
  };

  const isTestCompleted = (test: Test) => {
    return historicRecords.some(r => r.studentUsername === user.username && r.testId === test.id);
  };

  const isTermMatched = (titleLower: string, termLower: string) => {
    if (titleLower.includes(termLower)) {
      return true;
    }
    if (termLower === 'autumn' && (titleLower.includes('autumn 1') || titleLower.includes('autumn 2'))) {
      return true;
    }
    if (termLower === 'spring' && (titleLower.includes('spring 1') || titleLower.includes('spring 2'))) {
      return true;
    }
    if (termLower === 'summer' && (titleLower.includes('summer 1') || titleLower.includes('summer 2'))) {
      return true;
    }

    // Prevent cross-term matching between sub-terms (e.g. Autumn 2 matching Autumn 1)
    if (termLower.includes('1') && titleLower.includes('2')) return false;
    if (termLower.includes('2') && titleLower.includes('1')) return false;

    if (termLower.startsWith('autumn') && titleLower.includes('autumn')) {
      return true;
    }
    if (termLower.startsWith('spring') && titleLower.includes('spring')) {
      return true;
    }
    if (termLower.startsWith('summer') && titleLower.includes('summer')) {
      return true;
    }

    return false;
  };

  const getTestForType = (type: 'topic' | 'skills') => {
    const normalizedSubject = selectedSubject.toLowerCase();
    const manualTest = activeTests.find(
      (t) => {
        const titleLower = t.title.toLowerCase();
        const termLower = selectedTerm.toLowerCase();
        
        const subjectMatch = t.subject === normalizedSubject;
        const yearMatch = t.yearGroup === currentYearNum;
        
        const typeMatch = titleLower.includes(type) || (type === 'skills' && titleLower.includes('skill'));
        const termMatch = isTermMatched(titleLower, termLower);

        return t.active && subjectMatch && yearMatch && typeMatch && termMatch;
      }
    );
    return manualTest || generateDynamicTest(selectedSubject, selectedTerm, selectedYear, type);
  };

  // Launch pre-existing test or dynamic mock test representing term study folders
  const launchAssessmentMission = (type: 'topic' | 'skills') => {
    const normalizedSubject = selectedSubject.toLowerCase();
    
    // Check if there is already a manual test mapped to this criteria (matching subject, year, type AND term)
    const manualTest = activeTests.find(
      (t) => {
        const titleLower = t.title.toLowerCase();
        const termLower = selectedTerm.toLowerCase();
        
        const subjectMatch = t.subject === normalizedSubject;
        const yearMatch = t.yearGroup === currentYearNum;
        
        // Match either "topic" or "skills"
        const typeMatch = titleLower.includes(type) || (type === 'skills' && titleLower.includes('skill'));
        const termMatch = isTermMatched(titleLower, termLower);

        return t.active && subjectMatch && yearMatch && typeMatch && termMatch;
      }
    );

    if (manualTest) {
      startTest(manualTest);
    } else {
      // Build a spectacular high-fidelity interactive test paper on the fly!
      const generated = generateDynamicTest(selectedSubject, selectedTerm, selectedYear, type);
      startTest(generated);
    }
  };

  // Check if current question involves checkboxes or lists
  const currentQuestion: Question | undefined = currentTest?.questions[currentQuestionIndex];
  const isCheckboxQuestion = currentQuestion 
    ? currentQuestion.type === 'Checkboxes' || currentQuestion.type === 'Check Box' || currentQuestion.type === 'Checkboxes/Multiple Choice' || currentQuestion.text.toLowerCase().includes('select all') || currentQuestion.text.toLowerCase().includes('all items')
    : false;

  const hasImageLink = !!(currentQuestion && (currentQuestion as any).imageLink);
  const showDiagram = hasImageLink || ((currentQuestion && selectedSubject === 'science')
    ? (
        currentQuestion.text.toLowerCase().includes('center') ||
        currentQuestion.text.toLowerCase().includes('orbit') ||
        currentQuestion.text.toLowerCase().includes('moon') ||
        currentQuestion.text.toLowerCase().includes('space') ||
        currentQuestion.text.toLowerCase().includes('solar') ||
        currentQuestion.text.toLowerCase().includes('force') ||
        currentQuestion.text.toLowerCase().includes('gravity') ||
        currentQuestion.text.toLowerCase().includes('friction') ||
        currentQuestion.text.toLowerCase().includes('measure') ||
        currentQuestion.text.toLowerCase().includes('resistance') ||
        currentQuestion.text.toLowerCase().includes('diagram')
      )
    : false);

  const handleCheckboxToggle = (option: string) => {
    if (!currentQuestion) return;
    const currentAnswer = selectedAnswers[currentQuestion.id] || '';
    let answers = currentAnswer ? currentAnswer.split(', ') : [];
    if (answers.includes(option)) {
      answers = answers.filter((a) => a !== option);
    } else {
      answers = [...answers, option];
    }
    const sortedValue = answers.sort().join(', ');
    selectAnswer(currentQuestion.id, sortedValue);
  };

  const isOptionSelected = (option: string): boolean => {
    if (!currentQuestion) return false;
    const answerVal = selectedAnswers[currentQuestion.id] || '';
    if (isCheckboxQuestion) {
      return answerVal.split(', ').includes(option);
    }
    return answerVal === option;
  };

  const handleMoveRankingItem = (fromIdx: number, toIdx: number) => {
    if (!currentQuestion) return;
    const currentSortedAnswer = selectedAnswers[currentQuestion.id] || '';
    let items = currentSortedAnswer ? currentSortedAnswer.split(', ').map(s => s.trim()) : [...(shuffledRankingOptions[currentQuestion.id] || currentQuestion.options)];
    if (fromIdx < 0 || fromIdx >= items.length || toIdx < 0 || toIdx >= items.length) return;
    
    const updated = [...items];
    const [removed] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, removed);
    
    selectAnswer(currentQuestion.id, updated.join(', '));
  };

  const getRankingLabels = (qText: string) => {
    const textLower = qText.toLowerCase();
    if (textLower.includes('smallest') || textLower.includes('biggest') || textLower.includes('least') || textLower.includes('most') || textLower.includes('size')) {
      return { first: 'Smallest 🐜', last: 'Biggest 🐘' };
    }
    if (textLower.includes('first') || textLower.includes('last') || textLower.includes('earliest') || textLower.includes('latest') || textLower.includes('happen') || textLower.includes('history')) {
      return { first: 'First ⏳', last: 'Last 🏁' };
    }
    return { first: 'Start 🟢', last: 'End 🔴' };
  };

  // Dynamic Content Mappings for the Topic/Skills titles based on selected Term and Subject
  const getMissionContent = () => {
    const sub = selectedSubject.toLowerCase();
    const term = selectedTerm;
    
    if (sub === 'science') {
      const numericYear = getSelectedYearNum();
      const yearData = SCIENCE_TESTS[numericYear];
      if (yearData && yearData[term]) {
        const termData = yearData[term];
        const cleanTopicTitle = termData.topic.title
          .replace(/Year \d - [^:]+: /, '')
          .replace(/\(Topic Study\)/g, '')
          .trim();
        const cleanSkillsTitle = termData.skills.title
          .replace(/Year \d - [^:]+: /, '')
          .replace(/\(Working Scientifically\)/g, '')
          .replace(/\(Skills Practice\)/g, '')
          .trim();
        return {
          topicTitle: cleanTopicTitle,
          topicSub: "Topic Study Focus 📖",
          skillsTitle: cleanSkillsTitle,
          skillsSub: "Working Scientifically 🎒"
        };
      }
      
      if (term.includes('Autumn')) {
        return {
          topicTitle: "Earth & Space 🪐",
          topicSub: "Current Study Topic Assessment",
          skillsTitle: "Moon Phase Logs 🌙",
          skillsSub: "Practical & Applied Skills Review"
        };
      } else if (term.includes('Spring')) {
        return {
          topicTitle: "Forces & Gravity 🧲",
          topicSub: "Dynamics & Invisible Pulls",
          skillsTitle: "Friction Measure Labs 📈",
          skillsSub: "Practical friction force-meter logs"
        };
      } else {
        return {
          topicTitle: "Living Things 🌿",
          topicSub: "Environments & Adaptations",
          skillsTitle: "Life Cycle Mapping 🧬",
          skillsSub: "Applied life-path mapping tasks"
        };
      }
    } else if (sub === 'history') {
      return {
        topicTitle: `${selectedTerm} Topic Study 🏰`,
        topicSub: "Core Historical Context & Theme Review",
        skillsTitle: `${selectedTerm} Historical Enquiry 🧭`,
        skillsSub: "Applied Historical Skills & Sources Focus"
      };
    } else {
      const niceSubName = selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1);
      return {
        topicTitle: `${niceSubName} Unit Focus 📖`,
        topicSub: `${niceSubName} Termly Curriculum Review`,
        skillsTitle: `${niceSubName} Applied Skills 🎯`,
        skillsSub: `Workbooks, logs, and interactive tasks`
      };
    }
  };

  const missionContent = getMissionContent();

  const getFilteredHistory = () => {
    return historicRecords.filter(
      (rec) => rec.studentUsername === user.username && rec.subject === selectedSubject && rec.yearGroup === currentYearNum
    );
  };

  return (
    <div className="w-full">
      {/* Mini Profile Header (Not shown while in test for optimal child concentration!) */}
      {phase !== 'test-active' && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-3 border-slate-200 pb-5 mb-8 select-none">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-indigo-50 border-3 border-slate-900 rounded-2xl flex items-center justify-center font-display text-xl select-none shadow-brutal-sm">
              🎓
            </div>
            <div>
              <h3 className="text-lg text-slate-950 font-black">{user.name}</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mt-1">
                Dersingham Student • {user.class && (user.class.toUpperCase().includes('AA-AM') || user.class.toUpperCase().includes('AA-PM') || user.class.toUpperCase().endsWith('-AM') || user.class.toUpperCase().endsWith('-PM')) ? 'Nursery' : (user.class && (user.class.toUpperCase() === 'CW-1' || user.class.toUpperCase() === 'DH-3' || user.class.toUpperCase() === 'RB-2' || /-(1|2|3)$/.test(user.class.toUpperCase()))) ? 'Reception' : `Year ${user.yearGroup || 'Unassigned'}`}{user.class ? ` • ${user.class.replace(/^(class\s+)/i, '')}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 bg-rose-55 hover:bg-rose-100 text-rose-700 font-black text-xs uppercase tracking-wider border-3 border-slate-900 rounded-xl transition-all cursor-pointer shadow-brutal-sm active:translate-y-[1px]"
          >
            <LogOut className="w-4 h-4" />
            USO Sign Out
          </button>
        </div>
      )}

      {/* PHASE 1: YEAR GROUP SELECTION */}
      <AnimatePresence mode="wait">
        {phase === 'year-selection' && (
          <motion.div
            key="year-selection"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6"
          >
            <div className="text-center sm:text-left mb-6">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 border-2 border-slate-900 px-3.5 py-1.5 rounded-full select-none shadow-brutal-sm inline-block mb-3.5">
                🌱 Academy Learning Stages
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                Select Your Year Group
              </h2>
              <p className="text-sm font-medium text-slate-550 mt-1">
                Pick your year group to explore available learning curriculum missions!
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STAGES.map((stage) => {
                let assignedStageId = 'Year 4';
                if (user.class) {
                  const clsUpper = user.class.toUpperCase();
                  if (
                    clsUpper.includes('AA-AM') || 
                    clsUpper.includes('AA-PM') || 
                    clsUpper === 'AM' || 
                    clsUpper === 'PM' || 
                    clsUpper.endsWith('-AM') || 
                    clsUpper.endsWith('-PM')
                  ) {
                    assignedStageId = 'Nursery';
                  } else if (clsUpper === 'CW-1' || clsUpper === 'DH-3' || clsUpper === 'RB-2' || /-(1|2|3)$/.test(clsUpper)) {
                    assignedStageId = 'Reception';
                  } else if (user.yearGroup) {
                    assignedStageId = `Year ${user.yearGroup}`;
                  }
                } else if (user.yearGroup) {
                  assignedStageId = `Year ${user.yearGroup}`;
                }
                const isAssigned = stage.id === assignedStageId;
                return (
                  <button
                    key={stage.id}
                    onClick={() => {
                      setSelectedYear(stage.id);
                      setPhase('subject-selection');
                    }}
                    className={`relative p-5 text-center border-3 border-slate-900 rounded-2xl cursor-pointer hover:translate-y-[-3px] transition-all group btn-brutal-press ${
                      isAssigned
                        ? 'bg-indigo-600 text-white shadow-brutal-indigo'
                        : 'bg-white text-slate-900 hover:bg-indigo-50 shadow-brutal-sm'
                    }`}
                  >
                    {isAssigned && (
                      <span className="absolute -top-2.5 right-2 px-2 py-0.5 bg-yellow-405 text-slate-950 border-2 border-slate-900 rounded-full text-[9px] font-black uppercase tracking-wider shadow-brutal-sm">
                        My Class ✨
                      </span>
                    )}
                    <span className="block text-4xl mb-2 select-none">
                      {stage.id === 'Nursery' ? '🌱' : stage.id === 'Reception' ? '👑' : stage.id === 'Year 1' ? '🌟' : stage.id === 'Year 2' ? '🚀' : stage.id === 'Year 3' ? '🧬' : stage.id === 'Year 4' ? '🧪' : stage.id === 'Year 5' ? '🪐' : '⚡'}
                    </span>
                    <span className="block font-black text-lg uppercase tracking-tight">{stage.id}</span>
                    <span
                      className={`block text-[9px] font-black tracking-wide mt-1 uppercase ${
                        isAssigned ? 'text-indigo-150' : 'text-slate-400'
                      }`}
                    >
                      {stage.sub}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* General Achievements Journey history box */}
            <div className="bg-white border-3 border-slate-900 rounded-[24px] p-6 shadow-brutal mt-8">
              <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2 justify-center sm:justify-start uppercase tracking-wider">
                <Compass className="w-5 h-5 text-indigo-600" />
                <span>My Active Test Journey - All Subjects</span>
              </h3>
              {historicRecords.filter((rec) => rec.studentUsername === user.username).length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  🚀 You haven't taken any tests yet. Pick a year group above to start!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1 text-left">
                  {historicRecords
                    .filter((rec) => rec.studentUsername === user.username)
                    .map((rec) => (
                      <div
                        key={rec.id}
                        className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-brutal-sm"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl select-none">
                            {getSubjectIconStr(rec.subject)}
                          </span>
                          <div className="text-left">
                            <h4 className="text-xs font-black text-slate-900 truncate max-w-[200px] sm:max-w-xs uppercase tracking-tight">
                              {rec.testTitle}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">
                              Year {rec.yearGroup} • {rec.subject.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-black bg-indigo-600 border border-indigo-700 text-white px-2 py-1 rounded-lg shadow-brutal-sm whitespace-nowrap flex-shrink-0">
                            {rec.score}/{rec.totalQuestions} ({rec.percentage}%)
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* PHASE 2: CHOOSE A SUBJECT */}
        {phase === 'subject-selection' && (
          <motion.div
            key="subject-selection"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-6"
          >
            {/* Header progress row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
              <button
                onClick={() => setPhase('year-selection')}
                className="inline-flex items-center gap-1.5 font-black text-slate-500 hover:text-slate-800 text-xs uppercase cursor-pointer self-start"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Year Group</span>
              </button>
              <span className="text-xs font-black uppercase tracking-widest text-[#4f46e5] bg-indigo-50 px-3.5 py-1.5 border-3 border-slate-900 rounded-full shadow-brutal-sm self-start">
                🎒 Selected: {selectedYear}
              </span>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
                Choose a Subject
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Select your target mission parameters to load academic folders!
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SUBJECTS.map((sub) => {
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubject(sub.id);
                      // Set initial term tab depending on whether 6-option or 3-option subject is picked
                      const is6Option = sub.id === 'science' || sub.id === 'computing' || sub.id === 're' || sub.id === 'pe' || sub.id === 'music' || sub.id === 'pshe';
                      if (sub.id === 'history') {
                        setSelectedTerm('Autumn Mid Point');
                      } else {
                        setSelectedTerm(is6Option ? 'Autumn 1' : 'Autumn');
                      }
                      setPhase('mission-dashboard');
                    }}
                    className="p-5 text-center bg-white border-3 border-slate-905 rounded-2xl cursor-pointer hover:translate-y-[-2px] transition-all group shadow-brutal-amber btn-brutal-press"
                  >
                    <span className="block text-4xl mb-2 select-none">
                      {sub.label.split(' ')[1]}
                    </span>
                    <span className="block font-black text-sm uppercase tracking-wider text-slate-900 group-hover:text-amber-600 transition-colors">
                      {sub.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPhase('year-selection')}
              className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase border-3 border-slate-900 rounded-xl shadow-brutal-sm cursor-pointer hover:translate-y-[-1px] active:translate-y-[1px]"
            >
              ← Back to Stages
            </button>
          </motion.div>
        )}

        {/* PHASE 3: MISSION DASHBOARD (MISSION CONTROL) */}
        {phase === 'mission-dashboard' && (
          <motion.div
            key="mission-dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-6 text-left"
          >
            {/* Header controls select-none */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 select-none">
              <button
                onClick={() => setPhase('subject-selection')}
                className="inline-flex items-center gap-1.5 font-black text-slate-500 hover:text-slate-800 text-xs uppercase cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Choose Another Subject</span>
              </button>
              <span className="text-xs font-black uppercase tracking-widest text-[#4f46e5] bg-indigo-50 px-3.5 py-1.5 border-3 border-slate-900 rounded-full shadow-brutal-sm">
                ⭐ {selectedYear}
              </span>
            </div>

            {/* Dashboard Title Card greeting */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-3 border-slate-900 pb-5">
              <div>
                <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tight">
                  Hello, {user.name}! 👋
                </h2>
                <p className="text-sm font-black text-indigo-600 uppercase tracking-wider mt-1.5">
                  {selectedSubject.toUpperCase()} MISSION CONTROL
                </p>
              </div>
              <div className="text-left sm:text-right select-none">
                <span className="inline-block text-4xl bg-stone-50 border-2 border-slate-900 p-2.5 rounded-2xl shadow-brutal-sm">
                  {getSubjectIconStr(selectedSubject)}
                </span>
              </div>
            </div>

            {/* Interactive Term tabs list matching the prototype */}
            {getTermsList().length > 0 && (
              <div>
                <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider mb-2">Select Your Term Progress:</p>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none select-none">
                  {getTermsList().map((term) => {
                    const isActive = selectedTerm === term;
                    return (
                      <button
                        key={term}
                        onClick={() => setSelectedTerm(term)}
                        className={`px-4.5 py-2.5 border-3 border-slate-900 rounded-xl font-black text-xs uppercase cursor-pointer transition-all shadow-brutal-sm hover:translate-y-[-1.5px] whitespace-nowrap active:translate-y-[1px] ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-brutal-blue'
                            : 'bg-white text-slate-905 hover:bg-slate-50'
                        }`}
                      >
                        {term}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mission Active Cards Container */}
            {selectedSubject.toLowerCase() === 'maths' ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider mb-3">🧮 Arithmetic Practice Mission</h3>
                  {activeTests.filter(t => t.yearGroup === currentYearNum && t.subject === 'maths' && t.active && (t.title.toLowerCase().includes('arithmetic') || t.id.includes('-arithmetic'))).length === 0 ? (
                    <div className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border-2 border-dashed border-slate-200 rounded-xl bg-neutral-50">
                      No Arithmetic tests available.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {activeTests.filter(t => t.yearGroup === currentYearNum && t.subject === 'maths' && t.active && (t.title.toLowerCase().includes('arithmetic') || t.id.includes('-arithmetic'))).map((test) => {
                        const completed = isTestCompleted(test);
                        return (
                          <button
                            key={test.id}
                            disabled={completed}
                            onClick={() => !completed && startTest(test)}
                            className={`w-full text-left bg-white border-3 border-slate-900 rounded-xl p-4 shadow-brutal transition-all group select-none flex items-center justify-between ${
                              completed ? 'opacity-50 cursor-not-allowed bg-slate-100 filter grayscale' : 'cursor-pointer hover:translate-y-[-2.5px]'
                            }`}
                          >
                            <div>
                              <span className="bg-indigo-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-slate-900 shadow-brutal-sm inline-block mr-2 mb-1.5">
                                Arithmetic {completed && '✅ Completed'}
                              </span>
                              <h4 className="font-black text-slate-950 text-sm uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                                {test.title}
                              </h4>
                              <p className="text-[10px] font-bold text-slate-500 mt-1">
                                {test.questions.length} Questions • {Math.round(test.timeLimitSeconds / 60)} mins
                              </p>
                            </div>
                            <span className="text-xl">⚡</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider mb-3">🧠 Reasoning Practice Mission</h3>
                  {activeTests.filter(t => t.yearGroup === currentYearNum && t.subject === 'maths' && t.active && !(t.title.toLowerCase().includes('arithmetic') || t.id.includes('-arithmetic'))).length === 0 ? (
                    <div className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border-2 border-dashed border-slate-200 rounded-xl bg-neutral-50">
                      No Reasoning tests available.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {activeTests.filter(t => t.yearGroup === currentYearNum && t.subject === 'maths' && t.active && !(t.title.toLowerCase().includes('arithmetic') || t.id.includes('-arithmetic'))).map((test) => {
                        const completed = isTestCompleted(test);
                        return (
                          <button
                            key={test.id}
                            disabled={completed}
                            onClick={() => !completed && startTest(test)}
                            className={`w-full text-left bg-white border-3 border-slate-900 rounded-xl p-4 shadow-brutal-rose transition-all group select-none flex items-center justify-between ${
                              completed ? 'opacity-50 cursor-not-allowed bg-slate-100 filter grayscale' : 'cursor-pointer hover:translate-y-[-2.5px]'
                            }`}
                          >
                            <div>
                              <span className="bg-rose-500 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-slate-900 shadow-brutal-sm inline-block mr-2 mb-1.5">
                                Reasoning {completed && '✅ Completed'}
                              </span>
                              <h4 className="font-black text-slate-950 text-sm uppercase tracking-tight group-hover:text-rose-600 transition-colors">
                                {test.title}
                              </h4>
                              <p className="text-[10px] font-bold text-slate-500 mt-1">
                                {test.questions.length} Questions • {Math.round(test.timeLimitSeconds / 60)} mins
                              </p>
                            </div>
                            <span className="text-xl">🧩</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (selectedSubject.toLowerCase() === 'reading' || selectedSubject.toLowerCase() === 'spag') ? (
              <div>
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider mb-3">📖 Available {selectedSubject.toUpperCase()} Tests</h3>
                {activeTests.filter(t => t.yearGroup === currentYearNum && t.subject === selectedSubject.toLowerCase() && t.active).length === 0 ? (
                  <div className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border-2 border-dashed border-slate-200 rounded-xl bg-neutral-50">
                    No tests available yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {activeTests.filter(t => t.yearGroup === currentYearNum && t.subject === selectedSubject.toLowerCase() && t.active).map((test) => {
                      const completed = isTestCompleted(test);
                      return (
                        <button
                          key={test.id}
                          disabled={completed}
                          onClick={() => !completed && startTest(test)}
                          className={`w-full text-left bg-white border-3 border-slate-900 rounded-xl p-4 shadow-brutal-blue transition-all group select-none flex items-center justify-between ${
                            completed ? 'opacity-50 cursor-not-allowed bg-slate-100 filter grayscale' : 'cursor-pointer hover:translate-y-[-2.5px]'
                          }`}
                        >
                          <div>
                            <span className="bg-indigo-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-slate-900 shadow-brutal-sm inline-block mr-2 mb-1.5">
                              {selectedSubject.toUpperCase()} {completed && '✅ Completed'}
                            </span>
                            <h4 className="font-black text-slate-950 text-sm uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                              {test.title}
                            </h4>
                            <p className="text-[10px] font-bold text-slate-500 mt-1">
                              {test.questions.length} Questions • {Math.round(test.timeLimitSeconds / 60)} mins
                            </p>
                          </div>
                          <span className="text-xl">✏️</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (selectedSubject.toLowerCase() === 'science' || selectedSubject.toLowerCase() === 'geography' || selectedSubject.toLowerCase() === 'history') ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Mission Card 1: Topic Study */}
                {(() => {
                  const test = getTestForType('topic');
                  const completed = isTestCompleted(test);
                  return (
                    <button
                      disabled={completed}
                      onClick={() => !completed && launchAssessmentMission('topic')}
                      className={`w-full text-left bg-white border-4 border-slate-900 rounded-[20px] p-6 relative shadow-brutal transition-all group duration-100 select-none ${
                        completed ? 'opacity-50 cursor-not-allowed bg-slate-100 filter grayscale' : 'cursor-pointer hover:translate-y-[-3px] hover:shadow-brutal'
                      }`}
                    >
                      <span className="absolute -top-3 left-5 bg-amber-400 border-2 border-slate-900 text-[10px] font-black uppercase text-slate-950 tracking-wider px-2.5 py-0.5 rounded-lg shadow-brutal-sm">
                        Topic Study {completed && '✅ Completed'}
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <h3 className="text-xl font-black text-slate-950 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                            {missionContent.topicTitle}
                          </h3>
                          <p className="text-xs font-bold text-slate-500 mt-1 uppercase">
                            {missionContent.topicSub}
                          </p>
                        </div>
                        <span className="text-3xl font-bold">🚀</span>
                      </div>
                    </button>
                  );
                })()}

                {/* Mission Card 2: Skills Focus */}
                {(() => {
                  const test = getTestForType('skills');
                  const completed = isTestCompleted(test);
                  return (
                    <button
                      disabled={completed}
                      onClick={() => !completed && launchAssessmentMission('skills')}
                      className={`w-full text-left bg-white border-4 border-slate-900 rounded-[20px] p-6 relative shadow-brutal-rose transition-all group duration-100 select-none ${
                        completed ? 'opacity-50 cursor-not-allowed bg-slate-100 filter grayscale' : 'cursor-pointer hover:translate-y-[-3px] hover:shadow-brutal-rose'
                      }`}
                    >
                      <span className="absolute -top-3 left-5 bg-pink-500 border-2 border-slate-900 text-[10px] font-black uppercase text-white tracking-wider px-2.5 py-0.5 rounded-lg shadow-brutal-sm">
                        Skills Focus {completed && '✅ Completed'}
                      </span>
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 group-hover:text-pink-600 transition-colors uppercase tracking-tight">
                            {missionContent.skillsTitle}
                          </h3>
                          <p className="text-xs font-bold text-slate-500 mt-1 uppercase">
                            {missionContent.skillsSub}
                          </p>
                        </div>
                        <span className="text-3xl font-bold">🧠</span>
                      </div>
                    </button>
                  );
                })()}
              </div>
            ) : (
              // For all other subjects: History, Computing, RE, PE, Music, PSHE, Art, DT, we have single test button for selected term
              <div>
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-wider mb-3">📖 Available {selectedTerm} Test</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(() => {
                    // Try to find matching manual test
                    const manualTest = activeTests.find(t => 
                      t.yearGroup === currentYearNum &&
                      t.subject === selectedSubject.toLowerCase() &&
                      t.active &&
                      isTermMatched(t.title.toLowerCase(), selectedTerm.toLowerCase())
                    );
                    
                    if (manualTest) {
                      const completed = isTestCompleted(manualTest);
                      return (
                        <button
                          disabled={completed}
                          onClick={() => !completed && startTest(manualTest)}
                          className={`w-full text-left bg-white border-3 border-slate-900 rounded-xl p-5 shadow-brutal transition-all group select-none flex items-center justify-between ${
                            completed ? 'opacity-50 cursor-not-allowed bg-slate-100 filter grayscale' : 'cursor-pointer hover:translate-y-[-2.5px]'
                          }`}
                        >
                          <div>
                            <span className="bg-amber-400 border border-slate-900 text-[9px] font-black uppercase text-slate-950 tracking-wider px-1.5 py-0.5 rounded mr-2 mb-2 inline-block">
                              Uploaded {completed && '✅ Completed'}
                            </span>
                            <h4 className="font-black text-slate-950 text-base uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                              {manualTest.title}
                            </h4>
                            <p className="text-xs font-bold text-slate-500 mt-1">
                              {manualTest.questions.length} Questions • {Math.round(manualTest.timeLimitSeconds / 60)} mins
                            </p>
                          </div>
                          <span className="text-2xl">📚</span>
                        </button>
                      );
                    } else {
                      // fallback to launch dynamically
                      const mockTopic = generateDynamicTest(selectedSubject, selectedTerm, selectedYear, 'topic');
                      const completed = isTestCompleted(mockTopic);
                      return (
                        <button
                          disabled={completed}
                          onClick={() => !completed && startTest(mockTopic)}
                          className={`w-full text-left bg-white border-3 border-slate-900 rounded-xl p-5 shadow-brutal transition-all group select-none flex items-center justify-between ${
                            completed ? 'opacity-50 cursor-not-allowed bg-slate-100 filter grayscale' : 'cursor-pointer hover:translate-y-[-2.5px]'
                          }`}
                        >
                          <div>
                            <span className="bg-blue-400 border border-slate-900 text-[9px] font-black uppercase text-white tracking-wider px-1.5 py-0.5 rounded mr-2 mb-2 inline-block">
                              Curriculum Study {completed && '✅ Completed'}
                            </span>
                            <h4 className="font-black text-slate-950 text-base uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                              {selectedYear} {selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} - {selectedTerm}
                            </h4>
                            <p className="text-xs font-bold text-slate-500 mt-1">
                              Interactive Course Unit Review
                            </p>
                          </div>
                          <span className="text-2xl">⚡</span>
                        </button>
                      );
                    }
                  })()}
                </div>
              </div>
            )}

            {/* Score logs matching this criteria */}
            <div className="bg-white border-3 border-slate-900 rounded-[24px] p-5 shadow-brutal mt-4 select-none">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">My Topic Attempt Stats</span>
              {getFilteredHistory().length === 0 ? (
                <div className="p-4 py-8 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-2xl bg-neutral-50">
                  🍃 No attempts on this subject yet. Kickstart a mission above!
                </div>
              ) : (
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {getFilteredHistory().map((rec) => (
                    <div
                      key={rec.id}
                      className="flex items-center justify-between p-3 border-2 border-slate-900 rounded-xl bg-slate-50 shadow-brutal-sm"
                    >
                      <div>
                        <p className="text-xs font-black uppercase text-slate-900 tracking-tight">{rec.testTitle}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Attempted on {new Date(rec.completedAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-lg border text-white shadow-brutal-sm bg-indigo-600 whitespace-nowrap flex-shrink-0`}>
                        {rec.score} / {rec.totalQuestions} ({rec.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* PHASE 4: INTERACTIVE LIVE ASSESSMENT EXAM */}
        {phase === 'test-active' && currentTest && currentQuestion && (
          <motion.div
            key="test-active"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-5 select-none text-left"
          >
            {/* Playful Exam Header bar with real-time countdown timer */}
            <div className="bg-slate-900 text-white border-3 border-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-brutal-sm">
              <div className="text-left">
                <span className="text-[9px] font-black uppercase text-amber-400 tracking-widest">
                  Assigned Assessment Sheet
                </span>
                <h3 className="text-sm font-black uppercase text-white tracking-tight truncate max-w-[280px] sm:max-w-[400px]">
                  {currentTest.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-800 border-2 border-slate-705 px-3 py-1.5 rounded-xl">
                <Hourglass className="w-4 h-4 text-amber-450 animate-spin" />
                <span className="font-mono text-base font-black text-amber-300">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Quiz Navigation Trackers Row matching prototype! */}
            <div className="flex select-none gap-2 flex-wrap items-center justify-center p-3 bg-slate-50 border-3 border-slate-905 rounded-2xl shadow-brutal-sm">
              {currentTest.questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = selectedAnswers[q.id] !== undefined;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      // Hop directly to that question matching index
                      setCurrentQuestionIndex(idx);
                      setShowHint(false);
                    }}
                    className={`w-10 h-10 border-3 border-slate-900 rounded-xl font-black text-xs flex items-center justify-center cursor-pointer transition-all duration-100 ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-brutal-blue translate-y-[1px]'
                        : isAnswered
                        ? 'bg-emerald-150 text-emerald-800 hover:bg-emerald-200 shadow-brutal-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-50 shadow-brutal-sm'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Flexible Split View Layout when questions involve images/diagrams */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              {/* Image/Illustration panel (occupies 4 columns on desktop if active) */}
              {showDiagram && (
                <div className="md:col-span-4 flex flex-col justify-center items-center">
                  <QuestionDiagram subject={selectedSubject} text={currentQuestion.text} imageLink={currentQuestion.imageLink} />
                </div>
              )}

              {/* Question card + choices block (occupies remaining columns or full width) */}
              <div className={`${showDiagram ? 'md:col-span-8' : 'md:col-span-12'} flex flex-col justify-between bg-white border-3 border-slate-900 rounded-[24px] p-6 shadow-brutal min-h-[220px]`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b-2 border-dashed border-slate-100 pb-2.5">
                    <span className="px-2.5 py-0.5 bg-indigo-50 border-2 border-slate-900 text-indigo-750 text-[10px] font-black uppercase tracking-wider rounded-lg shadow-brutal-sm">
                      Question {currentQuestionIndex + 1}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {currentQuestion.marks} Marks Value
                    </span>
                  </div>
                  
                  <h3 className="text-base sm:text-lg font-black text-slate-950 leading-snug">
                    {currentQuestion.text}
                  </h3>

                  {/* Inform and adjust input type details */}
                  {isCheckboxQuestion && (
                    <p className="text-[10px] uppercase tracking-wider font-extrabold text-pink-600">
                      ⚠️ CHECKBOX FOCUS: You can tap as many options as you wish!
                    </p>
                  )}
                </div>


              </div>
            </div>

            {/* Choice Selections Options stack */}
            {currentQuestion.type === 'Ranking' ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="bg-blue-50 border-2 border-dashed border-blue-400 p-3 rounded-2xl text-center select-none flex items-center justify-center gap-2">
                  <span className="text-xl">✨</span>
                  <p className="text-xs font-black text-blue-900 uppercase tracking-tight">
                    Drag the blocks horizontally or use the arrows to arrange them in order!
                  </p>
                </div>

                {/* Draggable items line */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-stretch select-none mt-2">
                  {(() => {
                    const items = (selectedAnswers[currentQuestion.id] || '').split(', ').map(s => s.trim()).filter(Boolean);
                    const labels = getRankingLabels(currentQuestion.text);
                    
                    return items.map((item, idx) => {
                      const isDragged = draggedIndex === idx;
                      const isHovered = draggedOverIndex === idx;
                      
                      let positionLabel = `${idx + 1}`;
                      if (idx === 0) positionLabel = `1st (${labels.first})`;
                      else if (idx === 1) positionLabel = '2nd';
                      else if (idx === 2) positionLabel = '3rd';
                      else if (idx === items.length - 1) positionLabel = `${idx + 1}th (${labels.last})`;
                      else positionLabel = `${idx + 1}th`;

                      return (
                        <div
                          key={item}
                          draggable={true}
                          onDragStart={() => setDraggedIndex(idx)}
                          onDragEnd={() => {
                            setDraggedIndex(null);
                            setDraggedOverIndex(null);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            if (draggedOverIndex !== idx) {
                              setDraggedOverIndex(idx);
                            }
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (draggedIndex !== null && draggedIndex !== idx) {
                              handleMoveRankingItem(draggedIndex, idx);
                            }
                            setDraggedIndex(null);
                            setDraggedOverIndex(null);
                          }}
                          className={`flex flex-col justify-between p-4 bg-white border-3 rounded-2xl transition-all relative ${
                            isDragged
                              ? 'opacity-40 border-slate-300 scale-95 shadow-none'
                              : isHovered
                              ? 'border-blue-600 scale-102 shadow-brutal-blue bg-blue-50'
                              : 'border-slate-900 hover:border-blue-500 shadow-brutal hover:translate-y-[-2px]'
                          }`}
                        >
                          {/* Rank badge header */}
                          <div className="flex items-center justify-between mb-3 border-b-2 border-dashed border-slate-100 pb-2">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                              Pos: {positionLabel}
                            </span>
                            <span className="text-slate-400 text-xs cursor-grab active:cursor-grabbing font-bold select-none animate-pulse" title="Drag me!">
                              ⋮⋮ Drag
                            </span>
                          </div>

                          {/* Item text value */}
                          <div className="text-center py-4 px-2">
                            <p className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                              {item}
                            </p>
                          </div>

                          {/* Touch helper Arrow controls */}
                          <div className="flex items-center justify-center gap-2 border-t-2 border-dashed border-slate-100 pt-2.5 mt-2">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveRankingItem(idx, idx - 1)}
                              className={`w-7 h-7 flex items-center justify-center rounded-lg border-2 border-slate-900 shadow-brutal-xs transition-all text-xs font-black cursor-pointer ${
                                idx === 0
                                  ? 'bg-slate-50 text-slate-300 border-slate-200 shadow-none cursor-not-allowed'
                                  : 'bg-white text-slate-800 hover:bg-slate-100 active:translate-y-[1px]'
                              }`}
                              title="Move Left"
                            >
                              ←
                            </button>
                            <span className="text-[9px] font-black uppercase text-slate-400 select-none">Order</span>
                            <button
                              type="button"
                              disabled={idx === items.length - 1}
                              onClick={() => handleMoveRankingItem(idx, idx + 1)}
                              className={`w-7 h-7 flex items-center justify-center rounded-lg border-2 border-slate-900 shadow-brutal-xs transition-all text-xs font-black cursor-pointer ${
                                idx === items.length - 1
                                  ? 'bg-slate-50 text-slate-300 border-slate-200 shadow-none cursor-not-allowed'
                                  : 'bg-white text-slate-800 hover:bg-slate-100 active:translate-y-[1px]'
                              }`}
                              title="Move Right"
                            >
                              →
                            </button>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ) : (currentQuestion.type === 'Pairs' || currentQuestion.type === 'Matching Pairs') ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="bg-amber-50 border-2 border-dashed border-amber-400 p-3 rounded-2xl text-center select-none flex items-center justify-center gap-2">
                  <span className="text-xl">✨</span>
                  <p className="text-xs font-black text-amber-900 uppercase tracking-tight">
                    Pairs Match: Tap a box on the left, then tap its partner on the right!
                  </p>
                  <button
                    onClick={() => {
                      selectAnswer(currentQuestion.id, '');
                      setTick(t => t + 1);
                    }}
                    className="ml-auto px-2.5 py-1 text-[10px] uppercase font-black bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-lg shadow-brutal-sm cursor-pointer"
                  >
                    Clear All 🔄
                  </button>
                </div>

                <div
                  id={`pairs-container-${currentQuestion.id}`}
                  className="relative grid grid-cols-2 gap-12 sm:gap-24 p-6 bg-slate-50 border-3 border-slate-900 rounded-[24px] overflow-hidden min-h-[300px]"
                >
                  {/* SVG Drawing Canvas */}
                  <svg className="absolute inset-0 pointer-events-none w-full h-full">
                    {(() => {
                      const connections = getCurrentConnections(currentQuestion.id);
                      return Object.entries(connections).map(([leftVal, rightVal], connIdx) => {
                        const leftEl = document.getElementById(`left-${currentQuestion.id}-${leftVal.replace(/\s+/g, '_')}`);
                        const rightEl = document.getElementById(`right-${currentQuestion.id}-${rightVal.replace(/\s+/g, '_')}`);
                        const containerEl = document.getElementById(`pairs-container-${currentQuestion.id}`);
                        
                        if (!leftEl || !rightEl || !containerEl) return null;
                        
                        const containerRect = containerEl.getBoundingClientRect();
                        const leftRect = leftEl.getBoundingClientRect();
                        const rightRect = rightEl.getBoundingClientRect();
                        
                        const x1 = leftRect.right - containerRect.left;
                        const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;
                        const x2 = rightRect.left - containerRect.left;
                        const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;
                        
                        // Use unique colors for lines!
                        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
                        const strokeColor = colors[connIdx % colors.length];
                        
                        return (
                          <line
                            key={connIdx}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke={strokeColor}
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="stroke-pulse animate-pulse"
                          />
                        );
                      });
                    })()}
                  </svg>

                  {/* Left items column */}
                  <div className="flex flex-col gap-4 z-10">
                    <span className="text-[10px] font-black uppercase text-slate-400 text-center tracking-widest mb-1">
                      Left Column 👈
                    </span>
                    {parseLeftItems(currentQuestion.correctAnswer).map((item) => {
                      const isSelected = activeLeftPairItem === item;
                      const connections = getCurrentConnections(currentQuestion.id);
                      const isConnected = !!connections[item];
                      const partner = connections[item] || '';
                      
                      return (
                        <button
                          key={item}
                          id={`left-${currentQuestion.id}-${item.replace(/\s+/g, '_')}`}
                          onClick={() => {
                            setActiveLeftPairItem(item);
                            setTick(t => t + 1);
                          }}
                          className={`p-4 text-center font-sans text-xs sm:text-sm font-black border-3 rounded-2xl cursor-pointer hover:scale-102 transition-all ${
                            isSelected
                              ? 'bg-blue-600 text-white border-slate-900 shadow-brutal-blue'
                              : isConnected
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-900 shadow-brutal-sm'
                              : 'bg-white text-slate-800 border-slate-900 shadow-brutal-sm hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 items-center">
                            <span>{item}</span>
                            {isConnected && (
                              <span className="text-[9px] text-emerald-700 bg-white px-1.5 py-0.2 border border-emerald-200 rounded-md font-bold mt-1 uppercase tracking-wide">
                                linked: {partner}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right items column */}
                  <div className="flex flex-col gap-4 z-10">
                    <span className="text-[10px] font-black uppercase text-slate-400 text-center tracking-widest mb-1">
                      Right Column 👉
                    </span>
                    {(scrambledPairsRight[currentQuestion.id] || []).map((item) => {
                      const connections = getCurrentConnections(currentQuestion.id);
                      // Is this right item connected to any left item?
                      const connectedLeft = Object.keys(connections).find(key => connections[key] === item);
                      const isConnected = !!connectedLeft;
                      
                      return (
                        <button
                          key={item}
                          id={`right-${currentQuestion.id}-${item.replace(/\s+/g, '_')}`}
                          disabled={!activeLeftPairItem}
                          onClick={() => {
                            if (activeLeftPairItem) {
                              toggleConnection(activeLeftPairItem, item);
                              setTick(t => t + 1);
                            }
                          }}
                          className={`p-4 text-center font-sans text-xs sm:text-sm font-black border-3 rounded-2xl transition-all ${
                            !activeLeftPairItem && !isConnected
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : isConnected
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-900 shadow-brutal-sm hover:scale-102 cursor-pointer'
                              : 'bg-white text-slate-800 border-slate-900 shadow-brutal-sm hover:scale-102 hover:bg-slate-50 cursor-pointer'
                          }`}
                        >
                          <div className="flex flex-col gap-0.5 items-center">
                            <span>{item}</span>
                            {isConnected && (
                              <span className="text-[9px] text-emerald-700 bg-white px-1.5 py-0.2 border border-emerald-200 rounded-md font-bold mt-1 uppercase tracking-wide">
                                linked: {connectedLeft}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : currentQuestion.type === 'Sorting' ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="bg-emerald-50 border-2 border-dashed border-emerald-400 p-3 rounded-2xl text-center select-none flex items-center justify-center gap-2">
                  <span className="text-xl">✨</span>
                  <p className="text-xs font-black text-emerald-900 uppercase tracking-tight">
                    Sorting: Tap an item from the tray at the top, then tap a category column to place it!
                  </p>
                  <button
                    onClick={() => selectAnswer(currentQuestion.id, '')}
                    className="ml-auto px-2.5 py-1 text-[10px] uppercase font-black bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-lg shadow-brutal-sm cursor-pointer"
                  >
                    Reset Tray 🔄
                  </button>
                </div>

                {/* Items Tray */}
                {(() => {
                  const itemsAll = scrambledSortItems[currentQuestion.id] || [];
                  const sortedState = getCurrentPupilSorting(currentQuestion.id);
                  // Gather all items currently assigned to any column
                  const assignedItems = new Set(Object.values(sortedState).flat());
                  // Items remaining in tray
                  const remainingTray = itemsAll.filter(item => !assignedItems.has(item));
                  const sortingColumns = parseSortingColumns(currentQuestion.correctAnswer);

                  return (
                    <div className="space-y-6">
                      <div className="p-4 bg-white border-3 border-slate-900 rounded-[24px] shadow-brutal-sm min-h-[90px]">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-3">
                          Items to Sort ({remainingTray.length} remaining)
                        </span>
                        {remainingTray.length === 0 ? (
                          <p className="text-xs font-bold text-slate-400 italic text-center py-2 select-none">
                            All items sorted! Check your columns below 🎉
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2.5">
                            {remainingTray.map(item => {
                              const isSelected = activeSortItem === item;
                              return (
                                <div
                                  key={item}
                                  className="flex flex-col gap-1"
                                >
                                  <button
                                    onClick={() => setActiveSortItem(isSelected ? null : item)}
                                    className={`px-3.5 py-2 text-xs font-black border-2 border-slate-900 rounded-xl shadow-brutal-xs hover:translate-y-[-1px] transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-emerald-600 text-white border-slate-900'
                                        : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                                    }`}
                                  >
                                    {item}
                                  </button>
                                  {isSelected && (
                                    <div className="flex gap-1 justify-center">
                                      {sortingColumns.map(col => (
                                        <button
                                          key={col}
                                          onClick={() => {
                                            handleSortItem(item, col);
                                            setActiveSortItem(null);
                                          }}
                                          className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-[9px] rounded uppercase cursor-pointer"
                                        >
                                          {col}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Columns Section */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {sortingColumns.map(col => {
                          const list = sortedState[col] || [];
                          return (
                            <div
                              key={col}
                              onClick={() => {
                                if (activeSortItem) {
                                  handleSortItem(activeSortItem, col);
                                  setActiveSortItem(null);
                                }
                              }}
                              className={`p-5 bg-slate-50 border-3 border-slate-900 rounded-[24px] shadow-brutal-sm min-h-[180px] flex flex-col justify-between transition-all ${
                                activeSortItem ? 'hover:bg-emerald-50 border-dashed border-emerald-500 cursor-pointer' : ''
                              }`}
                            >
                              <div>
                                <span className="text-sm font-black text-slate-900 block border-b-2 border-slate-200 pb-2 mb-3 uppercase tracking-wide">
                                  📂 {col}
                                </span>
                                <div className="flex flex-col gap-2">
                                  {list.map(item => (
                                    <div
                                      key={item}
                                      className="flex items-center justify-between p-2.5 bg-white border-2 border-slate-900 rounded-xl shadow-brutal-xs"
                                    >
                                      <span className="text-xs font-black text-slate-800">{item}</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUnsortItem(item);
                                        }}
                                        className="text-red-500 hover:text-red-600 font-black text-xs cursor-pointer px-1"
                                        title="Remove item"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                  {list.length === 0 && (
                                    <p className="text-[11px] text-slate-400 font-bold italic text-center py-6 select-none">
                                      {activeSortItem ? 'Tap here to sort selected item' : 'Empty Column'}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : currentQuestion.type === 'Dropdown' ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="bg-indigo-50 border-2 border-dashed border-indigo-400 p-3 rounded-2xl text-center select-none flex items-center justify-center gap-2">
                  <span className="text-xl">✨</span>
                  <p className="text-xs font-black text-indigo-900 uppercase tracking-tight">
                    Missing Words: Read the text and choose the correct word from each dropdown!
                  </p>
                </div>

                {(() => {
                  const parts = parseDropdownText(currentQuestion.text);
                  const totalDropdowns = parts.filter(p => p.type === 'dropdown').length;
                  const list = (selectedAnswers[currentQuestion.id] || '').split(',').map(s => s.trim());
                  
                  return (
                    <div className="flex flex-wrap items-center gap-y-4 gap-x-2 p-6 bg-slate-50 border-3 border-slate-900 rounded-[24px] leading-loose font-sans text-sm sm:text-base font-extrabold text-slate-800 shadow-brutal-sm">
                      {parts.map((p, pIdx) => {
                        if (p.type === 'text') {
                          return <span key={pIdx}>{p.content}</span>;
                        } else {
                          const selectedVal = list[p.index!] || '';
                          return (
                            <select
                              key={pIdx}
                              value={selectedVal}
                              onChange={(e) => handleSelectDropdown(p.index!, e.target.value, totalDropdowns)}
                              className="inline-block px-3 py-1 bg-white border-3 border-slate-900 rounded-xl text-xs font-black text-slate-900 shadow-brutal-xs focus:ring-0 cursor-pointer hover:bg-slate-50 active:translate-y-[1px] transition-all"
                            >
                              <option value="">-- Choose --</option>
                              {p.options?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          );
                        }
                      })}
                    </div>
                  );
                })()}
              </div>
            ) : currentQuestion.type === 'NumberLine' ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="bg-rose-50 border-2 border-dashed border-rose-400 p-3 rounded-2xl text-center select-none flex items-center justify-center gap-2">
                  <span className="text-xl">✨</span>
                  <p className="text-xs font-black text-rose-900 uppercase tracking-tight">
                    Scale Target: Where is the red pointer pointing? Enter the number!
                  </p>
                </div>

                {(() => {
                  const { min, max, step } = parseNumberLineOptions(currentQuestion.options);
                  const target = parseFloat(currentQuestion.correctAnswer) || 0;
                  const markerPercent = ((target - min) / (max - min)) * 100;
                  
                  // Generate ticks
                  const ticks: number[] = [];
                  for (let val = min; val <= max; val += step) {
                    ticks.push(val);
                  }

                  return (
                    <div className="flex flex-col gap-6 w-full">
                      <div className="bg-slate-50 border-3 border-slate-900 rounded-[24px] p-6 relative select-none">
                        {/* Scale track visualizer */}
                        <div className="relative w-full h-24 mt-6">
                          {/* Main horizontal line */}
                          <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-900 -translate-y-1/2 rounded-full"></div>
                          
                          {/* Ticks and Labels */}
                          {ticks.map((tickVal, tickIdx) => {
                            const pct = ((tickVal - min) / (max - min)) * 100;
                            return (
                              <div
                                key={tickIdx}
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                                style={{ left: `${pct}%` }}
                              >
                                {/* Tick vertical line */}
                                <div className="w-1.5 h-5 bg-slate-900 rounded-full"></div>
                                {/* Label */}
                                <span className="text-[11px] font-black text-slate-800 mt-2 font-mono">
                                  {tickVal}
                                </span>
                              </div>
                            );
                          })}

                          {/* Arrow Pointer */}
                          {markerPercent >= 0 && markerPercent <= 100 && (
                            <div
                              className="absolute top-[-10px] -translate-x-1/2 flex flex-col items-center animate-bounce"
                              style={{ left: `${markerPercent}%` }}
                            >
                              <span className="text-2xl text-red-600 drop-shadow-sm select-none">▼</span>
                              <div className="px-2 py-0.5 bg-red-600 border-2 border-slate-900 rounded-lg text-[9px] font-black text-white uppercase tracking-wider shadow-brutal-xs -mt-1">
                                Target
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Number Input area */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-5 border-3 border-slate-900 rounded-[24px] shadow-brutal-sm">
                        <label className="text-xs sm:text-sm font-black uppercase text-slate-600 tracking-wider">
                          What is the number? 🎯
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={selectedAnswers[currentQuestion.id] || ''}
                          onChange={(e) => selectAnswer(currentQuestion.id, e.target.value)}
                          placeholder={`Type the value between ${min} and ${max}...`}
                          className="flex-1 p-3 border-3 border-slate-900 rounded-xl font-mono text-base font-black text-slate-900 focus:outline-none focus:border-indigo-600 shadow-inner"
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : currentQuestion.type === 'FillBlank' ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="bg-purple-50 border-2 border-dashed border-purple-400 p-3 rounded-2xl text-center select-none flex items-center justify-center gap-2">
                  <span className="text-xl">✨</span>
                  <p className="text-xs font-black text-purple-900 uppercase tracking-tight">
                    Fill in the blanks: Read the sentence and type the missing word or number!
                  </p>
                </div>

                {(() => {
                  const hasInlineBlanks = currentQuestion.text.toLowerCase().includes('[blank]');
                  
                  if (hasInlineBlanks) {
                    const parts = parseBlankText(currentQuestion.text);
                    const totalBlanks = parts.filter(p => p.type === 'blank').length;
                    const list = (selectedAnswers[currentQuestion.id] || '').split(',').map(s => s.trim());
                    
                    const handleSelectBlank = (idx: number, val: string) => {
                      const currentAns = selectedAnswers[currentQuestion.id] || '';
                      const list = currentAns.split(',').map(s => s.trim());
                      while (list.length < totalBlanks) {
                        list.push('');
                      }
                      list[idx] = val;
                      selectAnswer(currentQuestion.id, list.join(', '));
                    };

                    return (
                      <div className="flex flex-wrap items-center gap-y-4 gap-x-2 p-6 bg-slate-50 border-3 border-slate-900 rounded-[24px] leading-loose font-sans text-sm sm:text-base font-extrabold text-slate-800 shadow-brutal-sm">
                        {parts.map((p, pIdx) => {
                          if (p.type === 'text') {
                            return <span key={pIdx}>{p.content}</span>;
                          } else {
                            const selectedVal = list[p.index!] || '';
                            return (
                              <input
                                key={pIdx}
                                type="text"
                                value={selectedVal}
                                onChange={(e) => handleSelectBlank(p.index!, e.target.value)}
                                placeholder="Type word..."
                                className="inline-block px-3 py-1 w-32 bg-white border-3 border-slate-900 rounded-xl text-xs font-black text-slate-900 shadow-brutal-xs focus:ring-0 text-center"
                              />
                            );
                          }
                        })}
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white p-5 border-3 border-slate-900 rounded-[24px] shadow-brutal-sm">
                        <label className="text-xs sm:text-sm font-black uppercase text-slate-600 tracking-wider">
                          Your Answer:
                        </label>
                        <input
                          type="text"
                          value={selectedAnswers[currentQuestion.id] || ''}
                          onChange={(e) => selectAnswer(currentQuestion.id, e.target.value)}
                          placeholder="Type your answer here..."
                          className="flex-1 p-3 border-3 border-slate-900 rounded-xl font-bold text-sm sm:text-base text-slate-900 focus:outline-none focus:border-indigo-600 shadow-inner"
                        />
                      </div>
                    );
                  }
                })()}
              </div>
            ) : currentQuestion.type === 'True/False' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {['True', 'False'].map((val) => {
                  const selected = (selectedAnswers[currentQuestion.id] || '').trim().toLowerCase() === val.toLowerCase();
                  return (
                    <button
                      key={val}
                      onClick={() => selectAnswer(currentQuestion.id, val)}
                      className={`p-6 text-center font-sans text-lg font-black border-3 rounded-2xl cursor-pointer hover:translate-y-[-2px] transition-all btn-brutal-press ${
                        selected
                          ? val === 'True'
                            ? 'bg-emerald-500 border-slate-900 text-white shadow-brutal-green'
                            : 'bg-rose-500 border-slate-900 text-white shadow-brutal-rose'
                          : 'bg-white border-slate-900 text-slate-900 hover:bg-slate-50 shadow-brutal-sm'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">{val === 'True' ? '👍' : '👎'}</span>
                        <span>{val}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : currentQuestion.type === 'Comparison Symbols' ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="bg-amber-50 border-2 border-dashed border-amber-400 p-3 rounded-2xl text-center select-none flex items-center justify-center gap-2">
                  <span className="text-xl">⚖️</span>
                  <p className="text-xs font-black text-amber-900 uppercase tracking-tight">
                    Select the symbol (&lt;, =, or &gt;) that makes the statement true:
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto w-full">
                  {['<', '=', '>'].map((sym) => {
                    const selected = (selectedAnswers[currentQuestion.id] || '').trim() === sym;
                    return (
                      <button
                        key={sym}
                        onClick={() => selectAnswer(currentQuestion.id, sym)}
                        className={`p-6 text-center font-mono text-3xl font-black border-3 rounded-2xl cursor-pointer hover:translate-y-[-2px] transition-all btn-brutal-press ${
                          selected
                            ? 'bg-amber-400 border-slate-900 text-slate-950 shadow-brutal-yellow'
                            : 'bg-white border-slate-900 text-slate-900 hover:bg-amber-50 shadow-brutal-sm'
                        }`}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : currentQuestion.type === 'Smallest/Largest' ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="bg-cyan-50 border-2 border-dashed border-cyan-400 p-3 rounded-2xl text-center select-none flex items-center justify-center gap-2">
                  <span className="text-xl">🔍</span>
                  <p className="text-xs font-black text-cyan-900 uppercase tracking-tight">
                    Select both the SMALLEST and the LARGEST values:
                  </p>
                </div>
                {(() => {
                  const options = extractSmallestLargestOptions(currentQuestion);
                  const currentParsed = parseSmallestLargest(selectedAnswers[currentQuestion.id] || '');
                  return (
                    <div className="space-y-4">
                      <div className="p-4 bg-white border-3 border-slate-900 rounded-2xl shadow-brutal-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black uppercase text-slate-700">1. Select the SMALLEST:</span>
                          {currentParsed.smallest && (
                            <span className="text-xs font-black text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-300">
                              Selected: {currentParsed.smallest}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {options.map((opt) => {
                            const isSmallest = currentParsed.smallest.toLowerCase() === opt.toLowerCase();
                            return (
                              <button
                                key={`small-${opt}`}
                                onClick={() => {
                                  const newAnswer = `Smallest: ${opt}, Largest: ${currentParsed.largest || ''}`;
                                  selectAnswer(currentQuestion.id, newAnswer);
                                }}
                                className={`p-3 text-center font-bold text-sm border-2 rounded-xl transition-all cursor-pointer ${
                                  isSmallest
                                    ? 'bg-cyan-500 text-white border-slate-900 shadow-brutal-xs font-black'
                                    : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-4 bg-white border-3 border-slate-900 rounded-2xl shadow-brutal-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black uppercase text-slate-700">2. Select the LARGEST:</span>
                          {currentParsed.largest && (
                            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-300">
                              Selected: {currentParsed.largest}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {options.map((opt) => {
                            const isLargest = currentParsed.largest.toLowerCase() === opt.toLowerCase();
                            return (
                              <button
                                key={`large-${opt}`}
                                onClick={() => {
                                  const newAnswer = `Smallest: ${currentParsed.smallest || ''}, Largest: ${opt}`;
                                  selectAnswer(currentQuestion.id, newAnswer);
                                }}
                                className={`p-3 text-center font-bold text-sm border-2 rounded-xl transition-all cursor-pointer ${
                                  isLargest
                                    ? 'bg-indigo-600 text-white border-slate-900 shadow-brutal-xs font-black'
                                    : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : currentQuestion.type === 'Number Input' ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="bg-purple-50 border-2 border-dashed border-purple-400 p-3 rounded-2xl text-center select-none flex items-center justify-center gap-2">
                  <span className="text-xl">🔢</span>
                  <p className="text-xs font-black text-purple-900 uppercase tracking-tight">
                    Type your numerical answer in the box below:
                  </p>
                </div>
                <div className="bg-white p-6 border-3 border-slate-900 rounded-[24px] shadow-brutal-sm flex flex-col sm:flex-row items-center gap-4">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-wider">Your Answer:</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={selectedAnswers[currentQuestion.id] || ''}
                    onChange={(e) => selectAnswer(currentQuestion.id, e.target.value)}
                    placeholder="e.g. 42, 3/4, 250"
                    className="flex-1 p-3.5 border-3 border-slate-900 rounded-xl font-mono text-xl font-black text-slate-900 focus:outline-none focus:border-purple-600 shadow-inner"
                  />
                </div>
              </div>
            ) : currentQuestion.type === 'Unit Selection' ? (
              <div className="flex flex-col gap-4 mt-2">
                <div className="bg-teal-50 border-2 border-dashed border-teal-400 p-3 rounded-2xl text-center select-none flex items-center justify-center gap-2">
                  <span className="text-xl">📏</span>
                  <p className="text-xs font-black text-teal-900 uppercase tracking-tight">
                    Choose the appropriate unit of measurement:
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {(currentQuestion.options && currentQuestion.options.length > 0 ? currentQuestion.options : ['mm', 'cm', 'm', 'km']).map((unit) => {
                    const selected = (selectedAnswers[currentQuestion.id] || '').trim().toLowerCase() === unit.trim().toLowerCase();
                    return (
                      <button
                        key={unit}
                        onClick={() => selectAnswer(currentQuestion.id, unit)}
                        className={`p-5 text-center font-mono text-lg font-black border-3 rounded-2xl cursor-pointer hover:translate-y-[-2px] transition-all btn-brutal-press ${
                          selected
                            ? 'bg-teal-500 border-slate-900 text-white shadow-brutal-teal'
                            : 'bg-white border-slate-900 text-slate-900 hover:bg-teal-50 shadow-brutal-sm'
                        }`}
                      >
                        {unit}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                {currentQuestion.options.map((option) => {
                  const selected = isOptionSelected(option);
                  return (
                    <button
                      key={option}
                      onClick={() => {
                        if (isCheckboxQuestion) {
                          handleCheckboxToggle(option);
                        } else {
                          selectAnswer(currentQuestion.id, option);
                        }
                      }}
                      className={`p-4 text-left font-sans text-xs sm:text-sm font-extrabold border-3 rounded-2xl cursor-pointer hover:translate-y-[-2px] transition-all text-slate-900 btn-brutal-press ${
                        selected
                          ? 'bg-blue-600 border-slate-900 text-white shadow-brutal-blue'
                          : 'bg-white border-slate-900 hover:bg-slate-50 shadow-brutal-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 border-2 border-slate-900 ${
                            isCheckboxQuestion ? 'rounded-md' : 'rounded-full'
                          } flex items-center justify-center font-mono text-[10px] font-black ${
                            selected ? 'bg-white text-blue-600' : 'bg-slate-50 text-slate-400'
                          }`}
                        >
                          {selected ? '✓' : isCheckboxQuestion ? '' : '•'}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Assessment Footer controls */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-200 select-none">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                  setShowHint(false);
                }}
                className={`px-4.5 py-3 font-black text-xs uppercase border-3 border-slate-900 rounded-xl transition-all shadow-brutal-sm cursor-pointer ${
                  currentQuestionIndex === 0
                    ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed shadow-none'
                    : 'bg-white text-slate-800 hover:bg-slate-100 hover:translate-y-[-1px]'
                }`}
              >
                ← Prev Question
              </button>

              <button
                onClick={() => setShowExitConfirm(true)}
                className="px-4 py-2.5 bg-rose-50 border-3 border-slate-900 text-rose-700 font-extrabold text-xs rounded-xl hover:bg-rose-100 transition-all cursor-pointer shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                Exit Test 🚫
              </button>

              {currentQuestionIndex + 1 < currentTest.questions.length ? (
                <button
                  disabled={!selectedAnswers[currentQuestion.id]}
                  onClick={() => {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setShowHint(false);
                  }}
                  className={`px-5 py-3 font-display text-xs font-black uppercase border-3 rounded-xl shadow-brutal-sm cursor-pointer transition-all ${
                    !selectedAnswers[currentQuestion.id]
                      ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-indigo-600 text-white border-slate-900 hover:bg-indigo-700 hover:translate-y-[-1.5px] active:translate-y-[1px]'
                  }`}
                >
                  Save & Next →
                </button>
              ) : (
                <button
                  disabled={!selectedAnswers[currentQuestion.id]}
                  onClick={submitTestAnswers}
                  className={`px-6 py-3 font-display text-xs font-extrabold uppercase border-3 rounded-xl shadow-brutal-sm cursor-pointer transition-all ${
                    !selectedAnswers[currentQuestion.id]
                      ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 text-white border-slate-900 hover:bg-emerald-700 hover:translate-y-[-1.5px] active:translate-y-[1px]'
                  }`}
                >
                  Complete Assessment 🎉
                </button>
              )}
            </div>

            {/* High-visibility overlay confirmation modal for Exiting a test paper */}
            {showExitConfirm && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white border-4 border-slate-900 rounded-[24px] p-6 max-w-sm w-full shadow-brutal text-center space-y-4">
                  <span className="text-4xl block select-none">⚠️</span>
                  <h3 className="text-xl font-black text-slate-950 uppercase tracking-tight">Exit Assessment?</h3>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed">
                    Are you sure you want to exit this test paper? Any unsaved answers will be discarded!
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        setIsTimerRunning(false);
                        setCurrentTest(null);
                        setCurrentQuestionIndex(0);
                        setSelectedAnswers({});
                        setPhase('mission-dashboard');
                        setShowExitConfirm(false);
                      }}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase border-3 border-slate-900 rounded-xl shadow-brutal-sm cursor-pointer transition-all active:translate-y-[1px] select-none"
                    >
                      Yes, Exit
                    </button>
                    <button
                      onClick={() => setShowExitConfirm(false)}
                      className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-black text-xs uppercase border-3 border-slate-900 rounded-xl shadow-brutal-sm cursor-pointer transition-all active:translate-y-[1px] select-none"
                    >
                      No, Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* PHASE 5: REPORT CARD & KIDS EXPLAINER AND REVIEW */}
        {phase === 'results' && lastSavedRecord && currentTest && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6 text-left"
          >
            {/* Visual Success feedback card stats */}
            <div className="text-center bg-white border-4 border-slate-900 rounded-[24px] p-6 shadow-brutal max-w-md mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl leading-none select-none">
                🏅
              </div>
              <span className="text-5xl block animate-bounce mb-3 select-none">🏆</span>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Mission Complete!</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                Paper submitted securely to MR RISTE dashboard
              </p>

              {/* Score indicators */}
              <div className="grid grid-cols-2 gap-3.5 my-5 select-none">
                <div className="p-3.5 bg-indigo-50 border-3 border-slate-900 rounded-xl shadow-brutal-sm">
                  <span className="block text-[10px] font-black text-indigo-700 uppercase tracking-widest">Marked Points</span>
                  <span className="block font-sans text-xl font-black text-indigo-950 mt-1">
                    {lastSavedRecord.score} / {lastSavedRecord.totalQuestions}
                  </span>
                </div>
                <div className="p-3.5 bg-emerald-50 border-3 border-slate-900 rounded-xl shadow-brutal-sm">
                  <span className="block text-[10px] font-black text-emerald-700 uppercase tracking-widest">Percentage</span>
                  <span className="block font-sans text-xl font-black text-emerald-950 mt-1">
                    {lastSavedRecord.percentage}%
                  </span>
                </div>
              </div>

              {/* Award Ribbon generator */}
              <div className="inline-flex items-center gap-2 p-2 px-3.5 bg-amber-55 border-3 border-slate-900 text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider mx-auto select-none shadow-brutal-sm">
                <Award className="w-5 h-5 text-amber-500 fill-amber-100" />
                <span>
                  {lastSavedRecord.percentage >= 85
                    ? 'Outstanding Gold Star! 🥇'
                    : lastSavedRecord.percentage >= 50
                    ? 'Smart Explorer Ribbon! 🥈'
                    : 'Keep-Going ribbon! 🎗️'}
                </span>
              </div>
            </div>

            {/* Diagnostic Topic Breakdown */}
            {latestGrading && Object.keys(latestGrading.topicBreakdown).length > 0 && (
              <div className="bg-white border-4 border-slate-900 rounded-[24px] p-6 shadow-brutal space-y-4">
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                      📊 Diagnostic Topic Breakdown
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      Targeted curriculum diagnostic across test areas:
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 bg-indigo-50 border-2 border-indigo-200 text-indigo-700 rounded-lg">
                    {Object.keys(latestGrading.topicBreakdown).length} Areas Assessed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {Object.entries(latestGrading.topicBreakdown).map(([topic, stats]: [string, any]) => {
                    const pct = stats.percentage;
                    const colorBg = pct >= 80 ? 'bg-emerald-50 border-emerald-500 text-emerald-950' : pct >= 50 ? 'bg-amber-50 border-amber-500 text-amber-950' : 'bg-rose-50 border-rose-500 text-rose-950';
                    const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500';

                    return (
                      <div key={topic} className={`p-3.5 border-2 rounded-2xl ${colorBg} flex flex-col justify-between gap-2 shadow-brutal-xs`}>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-black uppercase tracking-tight">{topic}</span>
                          <span className="text-xs font-black font-mono px-2 py-0.5 bg-white border border-slate-900 rounded-md shrink-0">
                            {stats.scoredMarks} / {stats.totalMarks} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-900">
                          <div
                            className={`h-full ${barColor} transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Answer Explanations List Review */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5 mt-8 border-b-3 border-slate-100 pb-2.5 uppercase tracking-tight">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Pupil Explorer Review</span>
              </h3>
              <p className="text-xs font-semibold text-slate-500 mb-2">
                Let's review your answers and look at helpful tutor guides to explain correct choices!
              </p>

              <div className="space-y-4">
                {currentTest.questions.map((q, idx) => {
                  const savedAnswer = selectedAnswers[q.id] || '';
                  const gradingDetail = latestGrading?.questionDetails[idx];
                  const isCorrect = gradingDetail ? gradingDetail.isCorrect : (savedAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase());
                  const awardedMarks = gradingDetail ? gradingDetail.awardedMarks : (isCorrect ? q.marks : 0);

                  return (
                    <div
                      key={q.id}
                      className={`p-4 border-3 rounded-[20px] bg-white shadow-brutal-sm ${
                        isCorrect ? 'border-emerald-500' : 'border-rose-500'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 bg-slate-50 border-2 border-slate-950 text-[10px] font-black rounded-lg text-slate-500 uppercase tracking-wider">
                          Question {idx + 1}
                        </span>
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-600 uppercase tracking-wider">
                            <Check className="w-4 h-4 text-emerald-600" /> Correct (+{awardedMarks} pts)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-600 uppercase tracking-wider">
                            <X className="w-4 h-4 text-rose-600" /> Practice Next (+0 pts)
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-black text-slate-900 leading-snug text-left mb-3">
                        {q.text}
                      </h4>

                      {/* Display Choices grids styled beautifully */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-3.5 border-2 border-slate-900 rounded-xl bg-slate-50 text-left">
                          <span className="text-[9px] text-slate-400 block uppercase font-black tracking-widest">Your Answer</span>
                          <span className={`font-black uppercase text-[11px] block mt-1 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {savedAnswer || 'Skipped'}
                          </span>
                        </div>
                        <div className="p-3.5 border-2 border-slate-900 rounded-xl bg-slate-50 text-left">
                          <span className="text-[9px] text-slate-400 block uppercase font-black tracking-widest">Correct Answer</span>
                          <span className="font-black uppercase text-[11px] block mt-1 text-indigo-600">
                            {q.correctAnswer}
                          </span>
                        </div>
                      </div>

                      {!isCorrect && q.explanation && (
                        <div className="mt-3 p-3 bg-indigo-50 border-2 border-indigo-200 rounded-xl text-left">
                          <span className="text-[10px] font-black uppercase text-indigo-700 block tracking-wider mb-1">💡 Explanation</span>
                          <p className="text-xs font-bold text-indigo-900 leading-relaxed">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complete return action navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 select-none border-t-2 border-slate-200">
              <button
                onClick={() => setPhase('mission-dashboard')}
                className="flex-1 py-3.5 px-6 text-xs uppercase tracking-wider font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 border-3 border-slate-900 rounded-xl shadow-brutal-indigo hover:translate-y-[-2px] transition-all cursor-pointer text-center flex items-center justify-center gap-2 btn-brutal-press"
              >
                <RefreshCw className="w-4 h-4 animate-spin-hover" /> Mapped Topic Control
              </button>
              <button
                onClick={() => setPhase('subject-selection')}
                className="flex-1 py-3.5 px-6 text-xs uppercase tracking-wider font-extrabold text-slate-800 bg-white hover:bg-slate-50 border-3 border-slate-900 rounded-xl shadow-brutal-sm hover:translate-y-[-2px] transition-all cursor-pointer btn-brutal-press text-center"
              >
                Change Subject Folder
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
