/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogOut,
  Sparkles,
  Search,
  Users,
  LineChart as LineChartIcon,
  Plus,
  BookOpen,
  FolderLock,
  Trash2,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Flame,
  UserPlus,
  Shield,
  Check,
  X,
  Activity,
  FileSpreadsheet,
  Compass,
  FileDown,
} from 'lucide-react';
import { generateStudentPdfReport } from '../utils/pdfGenerator';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { User, Test, ScoreRecord, Subject, ScienceAssessment, ScienceSubmission, Question, RosterStudent } from '../types';
import { SCIENCE_TESTS } from '../scienceData';
import { saveDbTest } from '../firebase';
import AdminRosterUpload from './AdminRosterUpload';

export const SUBJECT_LABELS: Record<Subject, string> = {
  maths: 'Maths 🔢',
  reading: 'Reading 📖',
  spag: 'SPAG ✒️',
  science: 'Science 🧪',
  history: 'History 🏰',
  geography: 'Geography 🌍',
  computing: 'Computing 💻',
  art: 'Art 🎨',
  dt: 'DT 🛠️',
  music: 'Music 🎵',
  pshe: 'PSHE 🌱',
  re: 'R.E. 🕌',
  pe: 'P.E. 🏃',
};

export const MATHS_TOPICS = [
  "Number and Place Value",
  "Addition",
  "Subtraction",
  "Multiplication",
  "Division",
  "Fractions, Decimals, and Percentages (FDP)",
  "Ratio and Proportion",
  "Algebra",
  "Geometry (Shapes, Position, and Direction)",
  "Measurement",
  "Statistics (Data Handling)",
  "Probability"
];

export const parseQuestionGoal = (goalStr: string) => {
  if (!goalStr) return { topic: '', learningGoal: '' };
  const index = goalStr.indexOf(':');
  if (index !== -1) {
    const topic = goalStr.substring(0, index).trim();
    const learningGoal = goalStr.substring(index + 1).trim();
    return { topic, learningGoal };
  }
  return { topic: '', learningGoal: goalStr.trim() };
};

export const PREPACKAGED_TEMPLATES: Record<string, { title: string; questions: Partial<Question>[] }> = {
  'y1-materials-autumn1': {
    title: 'Year 1 Autumn 1 Everyday Materials Assessment',
    questions: [
      {
        text: "Is a 'spoon' the name of the object or the material?",
        type: 'Multiple Choice',
        options: ['Object', 'Material'],
        correctAnswer: 'Object',
        linkedLearningGoal: 'Distinguish between an object and the material from which it is made.',
        explanation: 'Remember, a spoon is the name of the thing you hold, so it is the object!'
      },
      {
        text: "'Wood' is a material used to make things.",
        type: 'True/False',
        options: ['True', 'False'],
        correctAnswer: 'True',
        linkedLearningGoal: 'Distinguish between an object and the material from which it is made.',
        explanation: 'Wood is a material that comes from trees and is used to build objects like chairs!'
      },
      {
        text: 'Which of these is a material?',
        type: 'Multiple Choice',
        options: ['Chair', 'Plastic', 'Fork'],
        correctAnswer: 'Plastic',
        linkedLearningGoal: 'Distinguish between an object and the material from which it is made.',
        explanation: 'A chair and a fork are objects; plastic is the material we use to make them!'
      },
      {
        text: 'Look at a pencil. What is the main material it is made from?',
        type: 'Multiple Choice',
        options: ['Glass', 'Wood', 'Water'],
        correctAnswer: 'Wood',
        linkedLearningGoal: 'Distinguish between an object and the material from which it is made.',
        explanation: 'Most pencils are made of wood because it is strong and easy to hold!'
      },
      {
        text: 'Select the objects in this list.',
        type: 'Multiple Choice',
        options: ['Metal', 'Cup', 'Toy Car', 'Rock'],
        correctAnswer: 'Cup',
        linkedLearningGoal: 'Distinguish between an object and the material from which it is made.',
        explanation: 'A cup and a toy car are things you can play with or use, making them objects!'
      },
      {
        text: 'An object can only be made from one material.',
        type: 'True/False',
        options: ['True', 'False'],
        correctAnswer: 'False',
        linkedLearningGoal: 'Distinguish between an object and the material from which it is made.',
        explanation: 'Some objects, like a toy car, can be made of both plastic and metal!'
      },
      {
        text: 'Which material is see-through and used for windows?',
        type: 'Multiple Choice',
        options: ['Wood', 'Glass', 'Rock'],
        correctAnswer: 'Glass',
        linkedLearningGoal: 'Identify and name a variety of everyday materials.',
        explanation: 'Glass is see-through, which is why it\'s perfect for letting light through windows!'
      },
      {
        text: 'Rock is a material found in the garden or park.',
        type: 'True/False',
        options: ['True', 'False'],
        correctAnswer: 'True',
        linkedLearningGoal: 'Identify and name a variety of everyday materials.',
        explanation: 'Rocks are natural materials that you can find all around you outside!'
      },
      {
        text: 'Select the materials from the list.',
        type: 'Multiple Choice',
        options: ['Wood', 'Metal', 'Window', 'Door'],
        correctAnswer: 'Wood',
        linkedLearningGoal: 'Identify and name a variety of everyday materials.',
        explanation: 'Wood and metal are materials; windows and doors are the objects they make!'
      },
      {
        text: 'Which material would you find in a pond or a tap?',
        type: 'Multiple Choice',
        options: ['Plastic', 'Water', 'Glass'],
        correctAnswer: 'Water',
        linkedLearningGoal: 'Identify and name a variety of everyday materials.',
        explanation: 'Water is a material we use every day for drinking and washing!'
      },
      {
        text: 'Plastic is a material made by people.',
        type: 'True/False',
        options: ['True', 'False'],
        correctAnswer: 'True',
        linkedLearningGoal: 'Identify and name a variety of everyday materials.',
        explanation: 'Plastic is a very useful material that is made in factories!'
      },
      {
        text: 'Which material is usually very strong and shiny?',
        type: 'Multiple Choice',
        options: ['Fabric', 'Metal', 'Paper'],
        correctAnswer: 'Metal',
        linkedLearningGoal: 'Identify and name a variety of everyday materials.',
        explanation: 'Metal is a strong material that often shines when light hits it!'
      },
    ]
  },
  'y1-materials-autumn2': {
    title: 'Year 1 Autumn 2 Everyday Materials Assessment',
    questions: [
      {
        text: 'What word describes a material that does NOT let water through?',
        type: 'Multiple Choice',
        options: ['Absorbent', 'Waterproof', 'Soft'],
        correctAnswer: 'Waterproof',
        linkedLearningGoal: 'Describe simple physical properties of everyday materials.',
        explanation: 'Waterproof materials like plastic keep us dry when it rains!'
      },
      {
        text: 'Glass is a very stretchy material.',
        type: 'True/False',
        options: ['True', 'False'],
        correctAnswer: 'False',
        linkedLearningGoal: 'Describe simple physical properties of everyday materials.',
        explanation: 'Glass is hard and stiff; it would break if you tried to stretch it!'
      },
      {
        text: 'Select the properties that describe a rock.',
        type: 'Multiple Choice',
        options: ['Hard', 'Stretchy', 'Strong'],
        correctAnswer: 'Hard',
        linkedLearningGoal: 'Describe simple physical properties of everyday materials.',
        explanation: 'Rocks are hard and strong, which is why we use them to build things!'
      },
      {
        text: 'If you can see through a material, it is...',
        type: 'Multiple Choice',
        options: ['Opaque', 'See-through', 'Rough'],
        correctAnswer: 'See-through',
        linkedLearningGoal: 'Describe simple physical properties of everyday materials.',
        explanation: 'See-through materials, like glass, let you see what is on the other side!'
      },
      {
        text: 'A sponge is absorbent because it soaks up water.',
        type: 'True/False',
        options: ['True', 'False'],
        correctAnswer: 'True',
        linkedLearningGoal: 'Describe simple physical properties of everyday materials.',
        explanation: 'Absorbent materials like sponges are great for soaking up spills!'
      },
      {
        text: 'Select the words that describe how a material feels.',
        type: 'Multiple Choice',
        options: ['Rough', 'Smooth', 'Blue'],
        correctAnswer: 'Rough',
        linkedLearningGoal: 'Describe simple physical properties of everyday materials.',
        explanation: 'Rough and smooth tell us how a material feels when we touch it!'
      },
      {
        text: 'Which two materials are both hard?',
        type: 'Multiple Choice',
        options: ['Rock and Metal', 'Fabric and Paper', 'Water and Plastic'],
        correctAnswer: 'Rock and Metal',
        linkedLearningGoal: 'Compare and group together a variety of everyday materials.',
        explanation: 'Rock and metal are both very hard and difficult to bend or squash!'
      },
      {
        text: 'We can group materials by whether they are bendy or stiff.',
        type: 'True/False',
        options: ['True', 'False'],
        correctAnswer: 'True',
        linkedLearningGoal: 'Compare and group together a variety of everyday materials.',
        explanation: 'Sorting materials by how they bend is a great way to group them!'
      },
      {
        text: 'Select the materials that are waterproof.',
        type: 'Multiple Choice',
        options: ['Plastic', 'Metal', 'Fabric'],
        correctAnswer: 'Plastic',
        linkedLearningGoal: 'Compare and group together a variety of everyday materials.',
        explanation: 'Plastic and metal are waterproof; fabric usually lets water soak in!'
      },
      {
        text: 'Why is glass used for windows instead of wood?',
        type: 'Multiple Choice',
        options: ['Because it is see-through', 'Because it is soft'],
        correctAnswer: 'Because it is see-through',
        linkedLearningGoal: 'Compare and group together a variety of everyday materials.',
        explanation: 'We use glass for windows so we can see outside our houses!'
      },
      {
        text: 'All materials have the same properties.',
        type: 'True/False',
        options: ['True', 'False'],
        correctAnswer: 'False',
        linkedLearningGoal: 'Compare and group together a variety of everyday materials.',
        explanation: 'Every material is special and has different properties, like being hard or soft!'
      },
      {
        text: "Which materials would you put in a 'Soft' group?",
        type: 'Multiple Choice',
        options: ['Fabric', 'Fur', 'Brick'],
        correctAnswer: 'Fabric',
        linkedLearningGoal: 'Compare and group together a variety of everyday materials.',
        explanation: 'Fabric and fur feel soft to touch, but a brick is very hard!'
      },
    ]
  },
  'y1-animals-spring1': {
    title: 'Year 1 Spring 1 Animals Including Humans Assessment',
    questions: [
      {
        text: "Which animal belongs to the 'Bird' group?",
        type: 'Multiple Choice',
        options: ['Frog', 'Robin', 'Snake'],
        correctAnswer: 'Robin',
        linkedLearningGoal: 'Identify and name a variety of common animals.',
        explanation: 'A robin is a bird because it has feathers and wings!'
      },
      {
        text: 'A goldfish is a type of mammal.',
        type: 'True/False',
        options: ['True', 'False'],
        correctAnswer: 'False',
        linkedLearningGoal: 'Identify and name a variety of common animals.',
        explanation: 'A goldfish is a fish because it lives underwater and breathes with gills!'
      },
      {
        text: 'Which animal is a reptile?',
        type: 'Multiple Choice',
        options: ['Dog', 'Lizard', 'Chicken'],
        correctAnswer: 'Lizard',
        linkedLearningGoal: 'Identify and name a variety of common animals.',
        explanation: 'Lizards are reptiles; they usually have scaly skin and lay eggs!'
      },
      {
        text: 'Select the animals that are mammals.',
        type: 'Multiple Choice',
        options: ['Human', 'Cat', 'Shark'],
        correctAnswer: 'Human',
        linkedLearningGoal: 'Identify and name a variety of common animals.',
        explanation: 'Humans and cats are mammals; they have hair or fur!'
      },
      {
        text: 'An animal that only eats plants is called a...',
        type: 'Multiple Choice',
        options: ['Carnivore', 'Herbivore', 'Omnivore'],
        correctAnswer: 'Herbivore',
        linkedLearningGoal: 'Identify common animals that are carnivores, herbivores and omnivores.',
        explanation: 'Herbivores love to eat plants, just like cows and sheep!'
      },
      {
        text: 'A carnivore eats other animals.',
        type: 'True/False',
        options: ['True', 'False'],
        correctAnswer: 'True',
        linkedLearningGoal: 'Identify common animals that are carnivores, herbivores and omnivores.',
        explanation: 'Carnivores are meat-eaters that hunt other animals for food!'
      },
      {
        text: 'Humans eat both plants and meat. This means we are...',
        type: 'Multiple Choice',
        options: ['Herbivores', 'Omnivores', 'Fish'],
        correctAnswer: 'Omnivores',
        linkedLearningGoal: 'Identify common animals that are carnivores, herbivores and omnivores.',
        explanation: 'We are omnivores because we eat a mix of many different foods!'
      },
      {
        text: 'Select the animal that is a carnivore.',
        type: 'Multiple Choice',
        options: ['Sheep', 'Lion', 'Rabbit'],
        correctAnswer: 'Lion',
        linkedLearningGoal: 'Identify common animals that are carnivores, herbivores and omnivores.',
        explanation: 'Lions are carnivores because they hunt other animals to eat meat!'
      },
      {
        text: 'Which part of the body does a fish use to breathe underwater?',
        type: 'Multiple Choice',
        options: ['Lungs', 'Gills', 'Wings'],
        correctAnswer: 'Gills',
        linkedLearningGoal: 'Describe and compare the structure of common animals.',
        explanation: 'Fish use their gills to get oxygen from the water!'
      },
      {
        text: 'All birds have wings.',
        type: 'True/False',
        options: ['True', 'False'],
        correctAnswer: 'True',
        linkedLearningGoal: 'Describe and compare the structure of common animals.',
        explanation: 'Even if they cannot fly, like a penguin, all birds have wings!'
      },
      {
        text: 'Select the parts that a dog has.',
        type: 'Multiple Choice',
        options: ['Fur', 'Tail', 'Scales'],
        correctAnswer: 'Fur',
        linkedLearningGoal: 'Describe and compare the structure of common animals.',
        explanation: 'Dogs have fur to keep them warm and a tail to wag!'
      },
      {
        text: 'How are a human and a cat similar?',
        type: 'Multiple Choice',
        options: ['Both have gills', 'Both have hair/fur', 'Both lay eggs'],
        correctAnswer: 'Both have hair/fur',
        linkedLearningGoal: 'Describe and compare the structure of common animals.',
        explanation: 'Humans and cats are both mammals, which means we both have hair or fur!'
      },
    ]
  }
};

export function parseGoogleDriveLink(link: string): string {
  if (!link) return '';
  const match = link.match(/\/file\/d\/([^\/]+)/) || link.match(/id=([^&]+)/);
  if (match && match[1]) {
    return `https://docs.google.com/uc?export=view&id=${match[1]}`;
  }
  return link;
}

interface TeacherDashboardProps {
  key?: string;
  user: User;
  onLogout: () => void;
  activeTests: Test[];
  historicRecords: ScoreRecord[];
  onToggleTestActive: (testId: string) => void;
  onUpdateTestTimeLimit: (testId: string, minutes: number) => void;
  onClearHistory: () => void;
  onAddStudent: (
    username: string, 
    name: string, 
    yearGroup: number, 
    email?: string, 
    googleId?: string, 
    studentClass?: string
  ) => void;
  registeredStudents: User[];
  registeredTeachers?: User[];
  onToggleAdmin?: (teacherUsername: string) => void;
  scienceAssessments?: ScienceAssessment[];
  scienceSubmissions?: ScienceSubmission[];
  onDeleteScoreRecord?: (id: string) => Promise<void>;
  onDeleteTest?: (testId: string) => Promise<void>;
  onArchiveCurrentData?: (folderName: string, subject?: string, term?: string) => Promise<void>;
  onUpdateTeacherLeadSubject?: (teacherUsername: string, leadSubject: string | undefined) => void;
}

export default function TeacherDashboard({
  user,
  onLogout,
  activeTests,
  historicRecords,
  onToggleTestActive,
  onUpdateTestTimeLimit,
  onClearHistory,
  onAddStudent,
  registeredStudents,
  registeredTeachers = [],
  onToggleAdmin,
  scienceAssessments = [],
  scienceSubmissions = [],
  isAdminViewActive = false,
  setIsAdminViewActive,
  onSaveTest,
  onUpdateTeacherClass,
  onUpdateTeacherYearGroup,
  onUpdateTeacherLeadSubject,
  pupilRoster = [],
  onAddRosterStudentsBulk,
  onUpdateRosterStudent,
  onDeleteRosterStudent,
  onClearRoster,
  onDeleteScoreRecord,
  onDeleteTest,
  onArchiveCurrentData,
}: TeacherDashboardProps & {
  isAdminViewActive?: boolean;
  setIsAdminViewActive?: (active: boolean) => void;
  onSaveTest?: (test: Test) => void;
  onUpdateTeacherClass?: (teacherUsername: string, teacherClass: string) => void;
  onUpdateTeacherYearGroup?: (teacherUsername: string, yearGroup: number | undefined) => void;
  onUpdateTeacherLeadSubject?: (teacherUsername: string, leadSubject: string | undefined) => void;
  pupilRoster?: RosterStudent[];
  onAddRosterStudentsBulk?: (students: RosterStudent[]) => Promise<void>;
  onUpdateRosterStudent?: (student: RosterStudent) => Promise<void>;
  onDeleteRosterStudent?: (id: string) => Promise<void>;
  onClearRoster?: () => Promise<void>;
  onArchiveCurrentData?: (folderName: string, subject?: string, term?: string) => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'gradebook' | 'tests' | 'credentials' | 'admin' | 'subject-leader' | 'progress'>('overview');
  const [selectedProgressStudentId, setSelectedProgressStudentId] = useState<string | null>(null);
  const [progressSearchQuery, setProgressSearchQuery] = useState<string>('');
  const [progressClassFilter, setProgressClassFilter] = useState<string>('all');
  const [progressSubjectFilter, setProgressSubjectFilter] = useState<string>('all');
  const [progressTermFilter, setProgressTermFilter] = useState<string>('Current Term');
  const [progressSelectedSubjects, setProgressSelectedSubjects] = useState<Subject[]>(['maths', 'reading', 'spag', 'science', 'history', 'geography']);
  const [progressChartView, setProgressChartView] = useState<'line' | 'bar'>('line');

  // Unified Pupil Progress List with Demo Fallback for Design Phase
  const allProgressPupils = React.useMemo<RosterStudent[]>(() => {
    const list: RosterStudent[] = [...pupilRoster];
    registeredStudents.forEach((reg) => {
      if (reg.role === 'student') {
        const isAlreadyInRoster = pupilRoster.some(
          (r) => r.googleId === reg.googleId || (r.email && reg.email && r.email.toLowerCase() === reg.email.toLowerCase())
        );
        if (!isAlreadyInRoster) {
          const parts = (reg.name || reg.username).trim().split(/\s+/);
          const fName = parts[0] || 'Student';
          const lName = parts.slice(1).join(' ') || '';
          list.push({
            id: reg.username,
            firstName: fName,
            lastName: lName,
            yearGroup: reg.yearGroup || 4,
            class: reg.class || '4 Oak',
            pupilPremium: false,
            send: 'No SEN',
            googleId: reg.googleId,
            email: reg.email,
          });
        }
      }
    });

    if (list.length === 0) {
      return [
        { id: 'demo-1', firstName: 'Alex', lastName: 'Morgan', yearGroup: 4, class: '4 Oak', pupilPremium: false, send: 'No SEN' },
        { id: 'demo-2', firstName: 'Jordan', lastName: 'Smith', yearGroup: 4, class: '4 Oak', pupilPremium: false, send: 'No SEN' },
        { id: 'demo-3', firstName: 'Sam', lastName: 'Taylor', yearGroup: 4, class: '4 Elm', pupilPremium: false, send: 'No SEN' },
      ];
    }
    return list;
  }, [pupilRoster, registeredStudents]);

  // PDF Report Modal states
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [pdfRemarks, setPdfRemarks] = useState<string>('');
  const [pdfTeacherSignature, setPdfTeacherSignature] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [teacherFilterClass, setTeacherFilterClass] = useState<string>('all');

  // Roster-specific states
  const [rosterYearFilter, setRosterYearFilter] = useState<string>('all');
  const [rosterClassFilter, setRosterClassFilter] = useState<string>('all');
  const [rosterStatusFilter, setRosterStatusFilter] = useState<string>('all');
  const [rosterSearch, setRosterSearch] = useState<string>('');
  const [rosterStatusMsg, setRosterStatusMsg] = useState<string>('');
  const [showClearRosterConfirm, setShowClearRosterConfirm] = useState<boolean>(false);

  // Manual roster student entry states
  const [manualFirstName, setManualFirstName] = useState<string>('');
  const [manualLastName, setManualLastName] = useState<string>('');
  const [manualYear, setManualYear] = useState<number>(4);
  const [manualClass, setManualClass] = useState<string>('');
  const [isManualCustomClass, setIsManualCustomClass] = useState<boolean>(false);
  const [manualPP, setManualPP] = useState<boolean>(false);
  const [manualSEND, setManualSEND] = useState<string>('No SEN');

  // Manual Account Matcher States
  const [manualRosterSelectId, setManualRosterSelectId] = useState<string>('');
  const [manualGoogleSelectUsername, setManualGoogleSelectUsername] = useState<string>('');
  const [manualTypedAccountHandle, setManualTypedAccountHandle] = useState<string>('');

  // Inline roster editing states
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editingYearGroup, setEditingYearGroup] = useState<number>(0);
  const [editingClass, setEditingClass] = useState<string>('');
  const [isEditingCustomClass, setIsEditingCustomClass] = useState<boolean>(false);

  // Hovered learning objective tooltip state (viewport-relative to prevent clipping)
  const [hoveredTooltip, setHoveredTooltip] = useState<{
    studentName: string;
    lo: string;
    details: any[];
    x: number;
    y: number;
  } | null>(null);
  const closeTimeoutRef = useRef<any>(null);

  // Science Assessment selections state
  const [portalType, setPortalType] = useState<'primary' | 'science'>('primary');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('year5_earth_space');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  // Unified Analytics Portal state
  const [analyticsSubject, setAnalyticsSubject] = useState<Subject>('science');
  const [analyticsTerm, setAnalyticsTerm] = useState<string>('Autumn 1');
  const [analyticsFocus, setAnalyticsFocus] = useState<string>('Test 1 (Topic Study)');

  // Subject Leader Analytics state
  const [leaderYearGroup, setLeaderYearGroup] = useState<number>(5);
  const [leaderTerm, setLeaderTerm] = useState<string>('Autumn 1');
  const [leaderFocus, setLeaderFocus] = useState<string>('Test 1 (Topic Study)');
  const [leaderFilterClass, setLeaderFilterClass] = useState<string>('all');

  // Admin Area specific tabs state
  const [activeAdminTab, setActiveAdminTab] = useState<'pupil-roster' | 'teacher-logins' | 'assessments' | 'pupil-assessments'>('pupil-roster');
  const [editingClasses, setEditingClasses] = useState<Record<string, string>>({});

  // Admin Pupil Assessments filter states
  const [adminFilterYear, setAdminFilterYear] = useState<string>('all');
  const [adminFilterClass, setAdminFilterClass] = useState<string>('all');
  const [adminFilterSubject, setAdminFilterSubject] = useState<string>('all');
  const [adminSearchTerm, setAdminSearchTerm] = useState<string>('');
  const [isDeletingBulk, setIsDeletingBulk] = useState<boolean>(false);
  const [assessmentsStatusMsg, setAssessmentsStatusMsg] = useState<string>('');
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState<boolean>(false);
  const [deletingRecord, setDeletingRecord] = useState<ScoreRecord | null>(null);

  // Archiving states
  const [showArchiveModal, setShowArchiveModal] = useState<boolean>(false);
  const [archiveFolderName, setArchiveFolderName] = useState<string>('');
  const [archiveSubject, setArchiveSubject] = useState<string>('all');
  const [archiveTerm, setArchiveTerm] = useState<string>('all');
  const [isArchiving, setIsArchiving] = useState<boolean>(false);
  const [archiveStatusMsg, setArchiveStatusMsg] = useState<string>('');

  // Previous years state & step-based wizard state
  const [showPreviousYearsModal, setShowPreviousYearsModal] = useState<boolean>(false);
  const [activePrevStep, setActivePrevStep] = useState<number>(1);
  const [prevFolder, setPrevFolder] = useState<string>('');
  const [prevYearGroup, setPrevYearGroup] = useState<string>('');
  const [prevSubject, setPrevSubject] = useState<string>('');
  const [prevStrand, setPrevStrand] = useState<string>(''); // Step 4 subject/strand/topic
  const [prevTerm, setPrevTerm] = useState<string>(''); // Step 5 term
  const [prevTest, setPrevTest] = useState<string>(''); // Step 6 test Focus

  // Student Logins filter state
  const [studentYearFilter, setStudentYearFilter] = useState<string>('all');
  const [studentClassFilter, setStudentClassFilter] = useState<string>('all');
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');

  // Assessment Editor state
  const [selectedAssessmentYear, setSelectedAssessmentYear] = useState<number | null>(null);
  const [selectedAssessmentSubject, setSelectedAssessmentSubject] = useState<Subject | null>(null);
  const [selectedAssessmentTerm, setSelectedAssessmentTerm] = useState<string | null>(null);
  const [selectedAssessmentFocus, setSelectedAssessmentFocus] = useState<string>('Test 1');
  const [extraTestsCount, setExtraTestsCount] = useState<Record<string, number>>({});

  const [draftQuestions, setDraftQuestions] = useState<Question[]>([]);
  const [draftTitle, setDraftTitle] = useState<string>('');
  const [draftTimeLimit, setDraftTimeLimit] = useState<number>(300);
  const [saveStatus, setSaveStatus] = useState<string>('');

  // Auto-save states and logic
  const [savedDraft, setSavedDraft] = useState<any>(null);
  const [lastAutoSaved, setLastAutoSaved] = useState<string>('');

  const findTestById = (testId: string): Test | undefined => {
    const found = activeTests.find(t => t.id === testId);
    if (found) return found;

    for (const year of Object.keys(SCIENCE_TESTS)) {
      const yearRecords = SCIENCE_TESTS[parseInt(year)];
      for (const term of Object.keys(yearRecords)) {
        const option = yearRecords[term];
        if (option.topic.id === testId) return option.topic;
        if (option.skills.id === testId) return option.skills;
      }
    }

    const templateKeys = Object.keys(PREPACKAGED_TEMPLATES);
    for (const key of templateKeys) {
      if (key === testId) {
        const templ = PREPACKAGED_TEMPLATES[key];
        return {
          id: key,
          title: templ.title,
          subject: 'science',
          yearGroup: 1,
          timeLimitSeconds: 300,
          questions: templ.questions.map((q, qIdx) => ({
            id: `q-${qIdx}`,
            text: q.text || '',
            type: q.type || 'Multiple Choice',
            options: q.options || [],
            correctAnswer: q.correctAnswer || '',
            marks: q.marks || 2,
            linkedLearningGoal: q.linkedLearningGoal || '',
            explanation: q.explanation || ''
          })),
          active: true
        };
      }
    }
    return undefined;
  };

  const getRecordAnswers = (rec: any, test: Test | undefined): Record<string, { chosen: string; isCorrect: boolean }> => {
    if (rec.answers && Object.keys(rec.answers).length > 0) {
      return rec.answers;
    }
    const answersMap: Record<string, { chosen: string; isCorrect: boolean }> = {};
    if (!test) return answersMap;

    const questions = test.questions;
    let remainingScore = rec.score;

    questions.forEach((q, idx) => {
      const qId = q.id || `q-${idx}`;
      const isCorrect = remainingScore >= q.marks;
      if (isCorrect) {
        remainingScore -= q.marks;
      }
      answersMap[qId] = {
        chosen: isCorrect ? q.correctAnswer : 'Incorrect Answer',
        isCorrect
      };
    });
    return answersMap;
  };

  interface UnifiedSubmission {
    id: string;
    studentName: string;
    studentUsername: string;
    studentClass: string;
    yearGroup: number;
    testId: string;
    testTitle: string;
    subject: Subject;
    score: number;
    totalQuestions: number;
    percentage: number;
    answers: Record<string, { chosen: string; isCorrect: boolean }>;
  }

  const getUnifiedSubmissions = (): UnifiedSubmission[] => {
    const list: UnifiedSubmission[] = [];

    historicRecords.forEach((rec) => {
      if (rec.archiveFolder) return;
      const student = registeredStudents.find((s) => s.username === rec.studentUsername);
      const studentClass = student?.class || 'Unassigned';
      const test = findTestById(rec.testId);
      const answersMap = getRecordAnswers(rec, test);

      list.push({
        id: rec.id,
        studentName: rec.studentName,
        studentUsername: rec.studentUsername,
        studentClass,
        yearGroup: rec.yearGroup,
        testId: rec.testId,
        testTitle: rec.testTitle,
        subject: rec.subject,
        score: rec.score,
        totalQuestions: rec.totalQuestions,
        percentage: rec.percentage,
        answers: answersMap,
      });
    });

    scienceSubmissions.forEach((sub) => {
      if (sub.archiveFolder) return;
      const assessment = scienceAssessments.find((a) => a.id === sub.assessmentId);
      const testTitle = assessment?.title || sub.assessmentId;
      const yearGroupNum = assessment?.yearGroup ? parseInt(assessment.yearGroup.replace(/\D/g, '')) : 5;
      const student = registeredStudents.find((s) => s.name === sub.studentName);
      const studentUsername = student?.username || `student-${sub.studentName.toLowerCase().replace(/\s+/g, '-')}`;

      list.push({
        id: sub.id,
        studentName: sub.studentName,
        studentUsername,
        studentClass: sub.studentClass,
        yearGroup: yearGroupNum,
        testId: sub.assessmentId,
        testTitle,
        subject: 'science',
        score: sub.totalScore,
        totalQuestions: sub.maxPossibleScore,
        percentage: sub.percentage,
        answers: sub.answers,
      });
    });

    return list;
  };

  const matchRecordToTerm = (sub: UnifiedSubmission, term: string) => {
    if (term === 'Overall') return true;
    const title = sub.testTitle.toLowerCase();
    const t = term.toLowerCase();

    // Prevent cross-term matching between sub-terms (e.g. Autumn 2 matching Autumn 1 / Test 1)
    if (t.includes('1') && (title.includes('2') || title.includes('test 2') || title.includes('assessment 2'))) return false;
    if (t.includes('2') && (title.includes('1') || title.includes('test 1') || title.includes('assessment 1'))) return false;

    if (title.includes(t)) return true;

    if (t === 'autumn' && (title.includes('autumn 1') || title.includes('autumn 2') || title.includes('autumn'))) return true;
    if (t === 'spring' && (title.includes('spring 1') || title.includes('spring 2') || title.includes('spring'))) return true;
    if (t === 'summer' && (title.includes('summer 1') || title.includes('summer 2') || title.includes('summer'))) return true;

    return false;
  };

  const parseGoal = (goalStr: string) => {
    const index = goalStr.indexOf(':');
    if (index !== -1) {
      const mainTopic = goalStr.substring(0, index).trim();
      const detailGoal = goalStr.substring(index + 1).trim();
      if (mainTopic.length > 0 && detailGoal.length > 0) {
        return { mainTopic, detailGoal };
      }
    }
    return { mainTopic: goalStr.trim(), detailGoal: goalStr.trim() };
  };

  const getStudentLoScore = (sub: UnifiedSubmission, loName: string) => {
    const test = findTestById(sub.testId);
    if (!test) return { correct: 0, total: 0, pct: 0 };

    let loCorrect = 0;
    let loTotal = 0;

    test.questions.forEach((q) => {
      const goal = q.linkedLearningGoal || test.title || 'Assessment Goal';
      const { mainTopic } = parseGoal(goal);
      if (mainTopic === loName) {
        const marks = q.marks || 1;
        loTotal += marks;
        const ans = sub.answers[q.id];
        if (ans && ans.isCorrect) {
          loCorrect += marks;
        }
      }
    });

    const pct = loTotal > 0 ? Math.round((loCorrect / loTotal) * 100) : 0;
    return { correct: loCorrect, total: loTotal, pct };
  };

  // Load / check for auto-saved draft on mount or tab change
  useEffect(() => {
    try {
      const stored = localStorage.getItem('dersingham_assessment_draft');
      if (stored) {
        setSavedDraft(JSON.parse(stored));
      } else {
        setSavedDraft(null);
      }
    } catch (e) {
      console.error('Failed to parse saved assessment draft:', e);
    }
  }, [activeAdminTab]);

  // Keep latest state in ref to avoid stale closures in setInterval
  const draftRef = useRef({
    draftQuestions,
    draftTitle,
    draftTimeLimit,
    selectedAssessmentYear,
    selectedAssessmentSubject,
    selectedAssessmentTerm,
    selectedAssessmentFocus
  });

  useEffect(() => {
    draftRef.current = {
      draftQuestions,
      draftTitle,
      draftTimeLimit,
      selectedAssessmentYear,
      selectedAssessmentSubject,
      selectedAssessmentTerm,
      selectedAssessmentFocus
    };
  }, [
    draftQuestions,
    draftTitle,
    draftTimeLimit,
    selectedAssessmentYear,
    selectedAssessmentSubject,
    selectedAssessmentTerm,
    selectedAssessmentFocus
  ]);

  // Set up the 30 seconds auto-save interval
  useEffect(() => {
    // Only auto-save if an assessment sheet is selected and active
    if (!selectedAssessmentYear || !selectedAssessmentSubject || !selectedAssessmentTerm) {
      return;
    }

    const interval = setInterval(() => {
      const data = draftRef.current;
      // Only auto-save if there is actually some content in title or questions
      if (data.draftTitle.trim() || data.draftQuestions.some(q => q.text.trim())) {
        const payload = {
          ...data,
          savedAt: Date.now()
        };
        localStorage.setItem('dersingham_assessment_draft', JSON.stringify(payload));
        const now = new Date();
        setLastAutoSaved(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [selectedAssessmentYear, selectedAssessmentSubject, selectedAssessmentTerm]);

  const dbUser = registeredTeachers.find((t) => t.username === user.username) || user;
  const isCurrentAdmin = dbUser.isAdmin === true;

  useEffect(() => {
    if (dbUser.class) {
      setProgressClassFilter(dbUser.class);
    }
  }, [dbUser.class]);

  const canDeleteRecord = (rec: any): boolean => {
    if (isCurrentAdmin) return true;
    if (!dbUser.class) return false;
    const student = registeredStudents.find(s => s.username === rec.studentUsername || s.name === rec.studentName);
    const recordClass = rec.studentClass || student?.class || '';
    return recordClass.toLowerCase().includes(dbUser.class.toLowerCase());
  };

  const canDeleteAssessment = (test: Test): boolean => {
    if (isCurrentAdmin) return true;
    if (!dbUser.class) return false;
    if (test.createdByClass) {
      return test.createdByClass.toLowerCase() === dbUser.class.toLowerCase();
    }
    return true;
  };

  // Student registration state
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newYearGroup, setNewYearGroup] = useState<number>(4);
  const [regSuccess, setRegSuccess] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getMaxTestNum = (year: number, subject: string, category?: string) => {
    let max = 1;
    activeTests.forEach(t => {
      if (t.yearGroup === year && t.subject === subject) {
        if (subject === 'maths' && category) {
          const titleLower = t.title.toLowerCase();
          const catLower = category.toLowerCase();
          if (!titleLower.includes(catLower)) return;
        }
        const match = t.title.match(/Test\s+(\d+)/i);
        if (match) {
          const num = parseInt(match[1]);
          if (num > max) max = num;
        }
      }
    });
    return max;
  };

  const getMatchedTest = (): Test | undefined => {
    if (!selectedAssessmentYear || !selectedAssessmentSubject) return undefined;
    
    // For Reading and SPAG
    if (selectedAssessmentSubject === 'reading' || selectedAssessmentSubject === 'spag') {
      if (!selectedAssessmentTerm) return undefined; // Term stores "Test X"
      const isTest1 = selectedAssessmentTerm === 'Test 1';
      return activeTests.find(t => 
        t.yearGroup === selectedAssessmentYear &&
        t.subject === selectedAssessmentSubject &&
        (t.title.toLowerCase().includes(selectedAssessmentTerm.toLowerCase()) ||
         (isTest1 && (t.id === `y${selectedAssessmentYear}-${selectedAssessmentSubject}-1` || t.title.toLowerCase().includes('explorer') || t.title.toLowerCase().includes('magic'))))
      );
    }
    
    // For Maths
    if (selectedAssessmentSubject === 'maths') {
      if (!selectedAssessmentTerm || !selectedAssessmentFocus) return undefined; // Term is Arithmetic/Reasoning, Focus is Test X
      const isTest1 = selectedAssessmentFocus === 'Test 1';
      const categoryLower = selectedAssessmentTerm.toLowerCase();
      const focusLower = selectedAssessmentFocus.toLowerCase();
      return activeTests.find(t => {
        if (t.yearGroup !== selectedAssessmentYear || t.subject !== 'maths') return false;
        const titleLower = t.title.toLowerCase();
        if (titleLower.includes(categoryLower) && titleLower.includes(focusLower)) return true;
        if (isTest1 && categoryLower === 'arithmetic' && (t.id === `y${selectedAssessmentYear}-maths-1` || titleLower.includes('explorer') || titleLower.includes('multiplication') || titleLower.includes('decimals'))) {
          return true;
        }
        return false;
      });
    }
    
    // For Science, Geography and History
    if (selectedAssessmentSubject === 'science' || selectedAssessmentSubject === 'geography' || selectedAssessmentSubject === 'history') {
      if (!selectedAssessmentTerm || !selectedAssessmentFocus) return undefined;
      const termLower = selectedAssessmentTerm.toLowerCase();
      const focusLower = selectedAssessmentFocus.toLowerCase();
      const focusKeyword = focusLower.includes('skill') ? 'skill' : 'topic';
      return activeTests.find(t => 
        t.yearGroup === selectedAssessmentYear &&
        t.subject === selectedAssessmentSubject &&
        t.title.toLowerCase().includes(termLower) &&
        t.title.toLowerCase().includes(focusKeyword)
      );
    }
    
    // For other subjects (6 terms or 3 terms, no Step 4)
    if (!selectedAssessmentTerm) return undefined;
    const termLower = selectedAssessmentTerm.toLowerCase();
    return activeTests.find(t => 
      t.yearGroup === selectedAssessmentYear &&
      t.subject === selectedAssessmentSubject &&
      (t.title.toLowerCase().includes(termLower) ||
       (selectedAssessmentTerm === 'Autumn 1' && t.title.toLowerCase().includes('autumn 1')) ||
       (selectedAssessmentTerm === 'Autumn 2' && t.title.toLowerCase().includes('autumn 2')) ||
       (selectedAssessmentTerm === 'Spring 1' && t.title.toLowerCase().includes('spring 1')) ||
       (selectedAssessmentTerm === 'Spring 2' && t.title.toLowerCase().includes('spring 2')) ||
       (selectedAssessmentTerm === 'Summer 1' && t.title.toLowerCase().includes('summer 1')) ||
       (selectedAssessmentTerm === 'Summer 2' && t.title.toLowerCase().includes('summer 2')))
    );
  };

  // Auto-defaulting term and focus based on selected subject
  useEffect(() => {
    if (!selectedAssessmentSubject) {
      setSelectedAssessmentTerm(null);
      return;
    }
    
    if (selectedAssessmentSubject === 'maths') {
      setSelectedAssessmentTerm('Arithmetic');
      setSelectedAssessmentFocus('Test 1');
    } else if (selectedAssessmentSubject === 'reading' || selectedAssessmentSubject === 'spag') {
      setSelectedAssessmentTerm('Test 1');
      setSelectedAssessmentFocus('Test 1');
    } else if (selectedAssessmentSubject === 'science') {
      setSelectedAssessmentTerm('Autumn 1');
      setSelectedAssessmentFocus('Topic Study');
    } else if (selectedAssessmentSubject === 'history') {
      setSelectedAssessmentTerm('Autumn Mid Point');
      setSelectedAssessmentFocus('Topic Study');
    } else if (selectedAssessmentSubject === 'geography') {
      setSelectedAssessmentTerm('Autumn');
      setSelectedAssessmentFocus('Topic Study');
    } else if (['computing', 're', 'pe', 'music', 'pshe'].includes(selectedAssessmentSubject)) {
      setSelectedAssessmentTerm('Autumn 1');
      setSelectedAssessmentFocus('Test 1');
    } else {
      // art, dt
      setSelectedAssessmentTerm('Autumn');
      setSelectedAssessmentFocus('Test 1');
    }
  }, [selectedAssessmentSubject, selectedAssessmentYear]);

  // Sync / load existing test into draft questions on filter change
  useEffect(() => {
    if (selectedAssessmentYear && selectedAssessmentSubject && selectedAssessmentTerm) {
      const matched = getMatchedTest();

      if (matched) {
        setDraftQuestions(matched.questions.map(q => ({
          ...q,
          linkedLearningGoal: q.linkedLearningGoal || q.hint || '',
          explanation: q.explanation || '',
          imageLink: q.imageLink || '',
          type: q.type || (q.options.length === 2 && (q.options.includes('True') || q.options.includes('False')) ? 'True/False' : 'Multiple Choice')
        })));
        setDraftTitle(matched.title);
        setDraftTimeLimit(matched.timeLimitSeconds);
      } else {
        // Pre-populate with 12 empty questions exactly
        const emptyQs: Question[] = Array.from({ length: 12 }, (_, i) => ({
          id: `q-${Date.now()}-${i + 1}`,
          text: '',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: 'Option A',
          marks: 2,
          hint: '',
          linkedLearningGoal: '',
          explanation: '',
          imageLink: '',
          type: 'Multiple Choice'
        }));
        setDraftQuestions(emptyQs);
        
        let initialTitle = '';
        if (selectedAssessmentSubject === 'reading' || selectedAssessmentSubject === 'spag') {
          initialTitle = `Year ${selectedAssessmentYear} ${selectedAssessmentSubject.toUpperCase()} ${selectedAssessmentTerm}`;
        } else if (selectedAssessmentSubject === 'maths') {
          initialTitle = `Year ${selectedAssessmentYear} Maths ${selectedAssessmentTerm} ${selectedAssessmentFocus}`;
        } else if (selectedAssessmentSubject === 'science' || selectedAssessmentSubject === 'geography' || selectedAssessmentSubject === 'history') {
          initialTitle = `Year ${selectedAssessmentYear} ${selectedAssessmentSubject.charAt(0).toUpperCase() + selectedAssessmentSubject.slice(1)} ${selectedAssessmentTerm} (${selectedAssessmentFocus})`;
        } else {
          initialTitle = `Year ${selectedAssessmentYear} ${selectedAssessmentTerm} ${selectedAssessmentSubject.toUpperCase()} Assessment`;
        }
        setDraftTitle(initialTitle);
        setDraftTimeLimit(300);
      }
      setSaveStatus('');
    }
  }, [selectedAssessmentYear, selectedAssessmentSubject, selectedAssessmentTerm, selectedAssessmentFocus, activeTests]);

  // 1. Calculate metrics
  const totalSubmissions = historicRecords.length;
  const averagePercentage =
    totalSubmissions > 0
      ? Math.round(historicRecords.reduce((sum, r) => sum + r.percentage, 0) / totalSubmissions)
      : 0;

  // Count unique students who attempted tests
  const activeStudentsCount = new Set(historicRecords.map((r) => r.studentUsername)).size;

  // Active Tests count
  const activePapersCount = activeTests.filter((t) => t.active).length;

  // 2. Prepare charts datasets
  // Chart A: Subject Averaging
  const subjectAggregates = ['maths', 'reading', 'spag', 'science', 'history', 'geography', 'computing', 'art', 'dt', 'music', 'pshe', 're', 'pe'].map((sub) => {
    const subRecords = historicRecords.filter((r) => r.subject === sub);
    const avg =
      subRecords.length > 0
        ? Math.round(subRecords.reduce((sum, r) => sum + r.percentage, 0) / subRecords.length)
        : 0;
    return {
      name: sub === 'spag' ? 'GPS / SPAG' : sub.charAt(0).toUpperCase() + sub.slice(1),
      'Average Score %': avg,
      Attempts: subRecords.length,
    };
  }).filter(item => item.Attempts > 0 || ['maths', 'reading', 'spag', 'science'].includes(item.name.toLowerCase()));

  // Chart B: Year Group Averaging
  const yearAggregates = [1, 2, 3, 4, 5, 6].map((yr) => {
    const yearRecords = historicRecords.filter((r) => r.yearGroup === yr);
    const avg =
      yearRecords.length > 0
        ? Math.round(yearRecords.reduce((sum, r) => sum + r.percentage, 0) / yearRecords.length)
        : 0;
    return {
      name: `Year ${yr}`,
      'Average Score %': avg,
      Submissions: yearRecords.length,
    };
  });

  // Helper to extract year group from teacher's assigned class (e.g. "Year 5 Autumn" -> 5)
  const getTeacherYearGroup = (): number | null => {
    if (dbUser.yearGroup !== undefined && dbUser.yearGroup !== null) {
      return dbUser.yearGroup;
    }
    if (dbUser.class) {
      const clsUpper = dbUser.class.toUpperCase();
      if (
        clsUpper.includes('AA-AM') || 
        clsUpper.includes('AA-PM') || 
        clsUpper === 'AM' || 
        clsUpper === 'PM' || 
        clsUpper.endsWith('-AM') || 
        clsUpper.endsWith('-PM')
      ) {
        return -1; // Nursery
      }
      if (clsUpper === 'CW-1' || clsUpper === 'DH-3' || clsUpper === 'RB-2' || /-(1|2|3)$/.test(clsUpper)) {
        return -2; // Reception
      }
      const match = clsUpper.match(/(\d+)$/);
      if (match) {
        const num = parseInt(match[1]);
        if (num >= 4 && num <= 6) return 1;
        if (num >= 7 && num <= 9) return 2;
        if (num >= 11 && num <= 13) return 3;
        if (num >= 14 && num <= 16) return 4;
        if (num >= 17 && num <= 19) return 5;
        if (num >= 20 && num <= 22) return 6;
      }
      const matchAny = dbUser.class.match(/\d+/);
      if (matchAny) {
        const parsed = parseInt(matchAny[0]);
        if (parsed >= 1 && parsed <= 6) {
          return parsed;
        }
      }
    }
    return null;
  };

  const matchSpecificYear = (studentYear: number, targetYear: number, studentClass?: string): boolean => {
    if (targetYear === -1) { // Nursery
      const clsUpper = (studentClass || '').toUpperCase();
      return studentYear === 0 && (
        clsUpper.includes('AA-AM') || 
        clsUpper.includes('AA-PM') || 
        clsUpper === 'AM' || 
        clsUpper === 'PM' || 
        clsUpper.endsWith('-AM') || 
        clsUpper.endsWith('-PM')
      );
    }
    if (targetYear === -2) { // Reception
      const clsUpper = (studentClass || '').toUpperCase();
      return studentYear === 0 && (
        clsUpper === 'CW-1' || clsUpper === 'DH-3' || clsUpper === 'RB-2' || /-(1|2|3)$/.test(clsUpper)
      );
    }
    return studentYear === targetYear;
  };

  const matchStudentYear = (studentYear: number, studentClass?: string): boolean => {
    if (teacherYearGroup === null) return true;
    return matchSpecificYear(studentYear, teacherYearGroup, studentClass);
  };

  const handleArchiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archiveFolderName.trim()) return;
    setIsArchiving(true);
    setArchiveStatusMsg('');
    try {
      if (onArchiveCurrentData) {
        await onArchiveCurrentData(
          archiveFolderName.trim(),
          archiveSubject === 'all' ? undefined : archiveSubject,
          archiveTerm === 'all' ? undefined : archiveTerm
        );
      }
      const subjectText = archiveSubject === 'all' ? 'all subjects' : archiveSubject.toUpperCase();
      const termText = archiveTerm === 'all' ? 'all terms' : archiveTerm;
      setArchiveStatusMsg(`🧹 Successfully archived active assessment results for ${subjectText} (${termText}) into "${archiveFolderName}"! Both performance analytics and pupil gradebook are now cleanly cleared.`);
      setArchiveFolderName('');
      setTimeout(() => {
        setShowArchiveModal(false);
        setArchiveStatusMsg('');
      }, 5000);
    } catch (err) {
      console.error(err);
      setArchiveStatusMsg('❌ Failed to archive records. Please try again.');
    } finally {
      setIsArchiving(false);
    }
  };

  const handleSelectAnalyticsSubject = (subj: Subject) => {
    setAnalyticsSubject(subj);
    if (subj === 'reading' || subj === 'spag') {
      setAnalyticsTerm('Test 1');
    } else if (subj === 'maths') {
      setAnalyticsTerm('Arithmetic');
    } else if (subj === 'history') {
      setAnalyticsTerm('Autumn Mid Point');
      setAnalyticsFocus('Test 1 (Topic Study)');
    } else if (['science', 'geography', 'computing', 're', 'pe', 'music', 'pshe'].includes(subj)) {
      setAnalyticsTerm('Autumn 1');
      setAnalyticsFocus('Test 1 (Topic Study)');
    } else {
      setAnalyticsTerm('Autumn');
      setAnalyticsFocus('Test 1 (Topic Study)');
    }
  };

  const getAnalyticsTermOptions = (subj: Subject): string[] => {
    if (subj === 'reading' || subj === 'spag') {
      return ['Test 1', 'Test 2', 'Test 3', 'Overall'];
    }
    if (subj === 'maths') {
      return ['Arithmetic', 'Reasoning', 'Overall'];
    }
    if (subj === 'history') {
      return ['Autumn Mid Point', 'Autumn End Point', 'Spring Mid Point', 'Spring End Point', 'Summer Mid Point', 'Summer End Point', 'Overall'];
    }
    if (['science', 'geography', 'computing', 're', 'pe', 'music', 'pshe'].includes(subj)) {
      return ['Autumn 1', 'Autumn 2', 'Spring 1', 'Spring 2', 'Summer 1', 'Summer 2', 'Overall'];
    }
    return ['Autumn', 'Spring', 'Summer', 'Overall'];
  };

  const teacherYearGroup = getTeacherYearGroup();
  const availableClasses = Array.from(
    new Set(
      [
        ...registeredStudents
          .filter((s) => {
            if (dbUser.class) {
              return s.class === dbUser.class;
            }
            return matchStudentYear(s.yearGroup || 4, s.class);
          })
          .map((s) => s.class),
        ...pupilRoster
          .filter((r) => {
            if (dbUser.class) {
              return r.class === dbUser.class;
            }
            return matchStudentYear(r.yearGroup, r.class);
          })
          .map((r) => r.class)
      ].filter((c): c is string => !!c && c.trim() !== '' && c !== 'Unassigned')
    )
  ).sort();

  const adminAvailableClasses = Array.from(
    new Set(
      [
        ...registeredStudents.map((s) => s.class),
        ...pupilRoster.map((r) => r.class)
      ].filter((c): c is string => !!c && c.trim() !== '' && c !== 'Unassigned')
    )
  ).sort();

  // Unify standard score records and science submissions for the Gradebook
  const allGradebookRecords = React.useMemo(() => {
    const list: (ScoreRecord & { studentClass?: string })[] = [];

    historicRecords.forEach((rec) => {
      if (rec.archiveFolder) return;
      const student = registeredStudents.find((s) => s.username === rec.studentUsername);
      const studentClass = student?.class || 'Unassigned';
      list.push({
        ...rec,
        studentClass,
      });
    });

    scienceSubmissions.forEach((sub) => {
      if (sub.archiveFolder) return;
      const assessment = scienceAssessments.find((a) => a.id === sub.assessmentId);
      const testTitle = assessment?.title || sub.assessmentId;
      const yearGroupNum = assessment?.yearGroup ? parseInt(assessment.yearGroup.replace(/\D/g, '')) : 5;
      const student = registeredStudents.find((s) => s.name === sub.studentName);
      const studentUsername = student?.username || `student-${sub.studentName.toLowerCase().replace(/\s+/g, '-')}`;

      list.push({
        id: sub.id,
        studentUsername,
        studentName: sub.studentName,
        yearGroup: yearGroupNum,
        testId: sub.assessmentId,
        testTitle,
        subject: 'science',
        score: sub.totalScore,
        totalQuestions: sub.maxPossibleScore,
        percentage: sub.percentage,
        durationSeconds: 120, // default placeholder
        completedAt: '2026-07-06T00:00:00.000Z', // default placeholder
        studentClass: sub.studentClass,
      });
    });

    return list;
  }, [historicRecords, scienceSubmissions, scienceAssessments, registeredStudents]);

  // Unified list of archived records
  const allArchivedRecords = React.useMemo(() => {
    const list: (ScoreRecord & { studentClass?: string })[] = [];

    historicRecords.forEach((rec) => {
      if (rec.archiveFolder) {
        const student = registeredStudents.find((s) => s.username === rec.studentUsername);
        const studentClass = rec.archivedClass || student?.class || 'Unassigned';
        list.push({
          ...rec,
          studentName: rec.archivedStudentName || rec.studentName,
          yearGroup: rec.archivedYearGroup !== undefined ? rec.archivedYearGroup : rec.yearGroup,
          studentClass,
        });
      }
    });

    scienceSubmissions.forEach((sub) => {
      if (sub.archiveFolder) {
        const assessment = scienceAssessments.find((a) => a.id === sub.assessmentId);
        const testTitle = assessment?.title || sub.assessmentId;
        const yearGroupNum = sub.archivedYearGroup !== undefined ? sub.archivedYearGroup : (assessment?.yearGroup ? parseInt(assessment.yearGroup.replace(/\D/g, '')) : 5);
        const student = registeredStudents.find((s) => s.name === sub.studentName);
        const studentUsername = student?.username || `student-${sub.studentName.toLowerCase().replace(/\s+/g, '-')}`;
        const studentClass = sub.archivedClass || sub.studentClass || 'Unassigned';

        list.push({
          id: sub.id,
          studentUsername,
          studentName: sub.archivedStudentName || sub.studentName,
          yearGroup: yearGroupNum,
          testId: sub.assessmentId,
          testTitle,
          subject: 'science',
          score: sub.totalScore,
          totalQuestions: sub.maxPossibleScore,
          percentage: sub.percentage,
          durationSeconds: 120,
          completedAt: '2026-07-06T00:00:00.000Z',
          studentClass,
          archiveFolder: sub.archiveFolder,
        });
      }
    });

    return list;
  }, [historicRecords, scienceSubmissions, scienceAssessments, registeredStudents]);

  // Dynamic filter lists for steps
  const prevFoldersList = React.useMemo(() => {
    return Array.from(new Set(allArchivedRecords.map((r) => r.archiveFolder).filter((f): f is string => !!f))).sort();
  }, [allArchivedRecords]);

  const prevYearsList = React.useMemo(() => {
    const records = prevFolder ? allArchivedRecords.filter((r) => r.archiveFolder === prevFolder) : allArchivedRecords;
    return Array.from(new Set(records.map((r) => Number(r.yearGroup) || 0))).sort((a, b) => Number(a) - Number(b));
  }, [allArchivedRecords, prevFolder]);

  const prevSubjectsList = React.useMemo(() => {
    const records = allArchivedRecords.filter((r) => {
      const matchesFolder = !prevFolder || r.archiveFolder === prevFolder;
      const matchesYear = !prevYearGroup || prevYearGroup === 'all' || r.yearGroup === Number(prevYearGroup);
      return matchesFolder && matchesYear;
    });
    return Array.from(new Set(records.map((r) => r.subject))).sort();
  }, [allArchivedRecords, prevFolder, prevYearGroup]);

  const prevStrandsList = React.useMemo(() => {
    const records = allArchivedRecords.filter((r) => {
      const matchesFolder = !prevFolder || r.archiveFolder === prevFolder;
      const matchesYear = !prevYearGroup || prevYearGroup === 'all' || r.yearGroup === Number(prevYearGroup);
      const matchesSubject = !prevSubject || prevSubject === 'all' || r.subject === prevSubject;
      return matchesFolder && matchesYear && matchesSubject;
    });
    return Array.from(new Set(records.map((r) => r.testTitle))).sort();
  }, [allArchivedRecords, prevFolder, prevYearGroup, prevSubject]);

  const prevTermsList = React.useMemo(() => {
    return ['Autumn 1', 'Autumn 2', 'Spring 1', 'Spring 2', 'Summer 1', 'Summer 2', 'Overall'];
  }, []);

  const prevTestsList = React.useMemo(() => {
    const records = allArchivedRecords.filter((r) => {
      const matchesFolder = !prevFolder || r.archiveFolder === prevFolder;
      const matchesYear = !prevYearGroup || prevYearGroup === 'all' || r.yearGroup === Number(prevYearGroup);
      const matchesSubject = !prevSubject || prevSubject === 'all' || r.subject === prevSubject;
      const matchesStrand = !prevStrand || prevStrand === 'all' || r.testTitle === prevStrand;
      return matchesFolder && matchesYear && matchesSubject && matchesStrand;
    });
    return Array.from(new Set(records.map((r) => r.testTitle))).sort();
  }, [allArchivedRecords, prevFolder, prevYearGroup, prevSubject, prevStrand]);

  // Filtered archived records matching selectors
  const filteredArchivedRecords = React.useMemo(() => {
    return allArchivedRecords.filter((rec) => {
      const matchesFolder = !prevFolder || rec.archiveFolder === prevFolder;
      const matchesYear = !prevYearGroup || prevYearGroup === 'all' || rec.yearGroup === Number(prevYearGroup);
      const matchesSubject = !prevSubject || prevSubject === 'all' || rec.subject === prevSubject;
      const matchesStrand = !prevStrand || prevStrand === 'all' || rec.testTitle.toLowerCase().includes(prevStrand.toLowerCase()) || rec.testTitle === prevStrand;
      
      let matchesTerm = true;
      if (prevTerm && prevTerm !== 'all' && prevTerm !== 'Overall') {
        matchesTerm = rec.testTitle.toLowerCase().includes(prevTerm.toLowerCase());
      }

      let matchesTest = true;
      if (prevTest && prevTest !== 'all') {
        matchesTest = rec.testTitle === prevTest || rec.testTitle.toLowerCase().includes(prevTest.toLowerCase());
      }

      return matchesFolder && matchesYear && matchesSubject && matchesStrand && matchesTerm && matchesTest;
    });
  }, [allArchivedRecords, prevFolder, prevYearGroup, prevSubject, prevStrand, prevTerm, prevTest]);

  // Aggregated charts data for previous years
  const archivedChartData = React.useMemo(() => {
    const studentScores: Record<string, { name: string; totalPct: number; count: number }> = {};
    filteredArchivedRecords.forEach((rec) => {
      if (!studentScores[rec.studentName]) {
        studentScores[rec.studentName] = { name: rec.studentName, totalPct: 0, count: 0 };
      }
      studentScores[rec.studentName].totalPct += rec.percentage;
      studentScores[rec.studentName].count += 1;
    });

    return Object.values(studentScores).map((s) => ({
      name: s.name,
      'Average Score %': Math.round(s.totalPct / s.count),
      Attempts: s.count,
    })).sort((a, b) => b['Average Score %'] - a['Average Score %']);
  }, [filteredArchivedRecords]);

  // 3. Filter Gradebook entries for class teachers
  const filteredRecords = allGradebookRecords.filter((rec) => {
    const matchesSearch =
      rec.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.testTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.studentUsername.toLowerCase().includes(searchTerm.toLowerCase());

    const student = registeredStudents.find((s) => s.username === rec.studentUsername || s.name === rec.studentName);
    const recordClass = rec.studentClass || student?.class || '';

    let matchesClass = false;
    let matchesYear = false;

    if (dbUser.class) {
      // The teacher is assigned to a specific class (e.g. "18" or "Year 5 Autumn")
      // They should see students in their assigned class.
      matchesClass = teacherFilterClass === 'all'
        ? (recordClass.toLowerCase().includes(dbUser.class.toLowerCase()))
        : (recordClass.toLowerCase().includes(teacherFilterClass.toLowerCase()));
      matchesYear = true; // No need to filter out by year group if we are matching by specific class
    } else {
      // The teacher is not assigned to a specific class, or they are an admin.
      // Filter by the selected class in the dropdown (if any) and year group
      const teacherYearGroup = getTeacherYearGroup();
      matchesYear = teacherYearGroup !== null ? matchStudentYear(rec.yearGroup, recordClass) : true;
      matchesClass = teacherFilterClass === 'all' || recordClass.toLowerCase().includes(teacherFilterClass.toLowerCase());
    }

    const matchesSubject = filterSubject === 'all' || rec.subject === filterSubject;

    return matchesSearch && matchesYear && matchesClass && matchesSubject;
  });

  // 3b. Filter Gradebook entries for Admins (with all filters)
  const adminFilteredRecords = allGradebookRecords.filter((rec) => {
    const matchesSearch =
      rec.studentName.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
      rec.testTitle.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
      rec.studentUsername.toLowerCase().includes(adminSearchTerm.toLowerCase());

    const student = registeredStudents.find((s) => s.username === rec.studentUsername || s.name === rec.studentName);
    const recordClass = rec.studentClass || student?.class || '';

    let matchesYear = false;
    if (adminFilterYear === 'all') {
      matchesYear = true;
    } else if (adminFilterYear === 'nursery') {
      matchesYear = rec.yearGroup === 0 && (recordClass.toUpperCase().includes('AA-AM') || recordClass.toUpperCase().includes('AA-PM') || recordClass.toUpperCase().endsWith('-AM') || recordClass.toUpperCase().endsWith('-PM'));
    } else if (adminFilterYear === 'reception') {
      matchesYear = rec.yearGroup === 0 && (recordClass.toUpperCase() === 'CW-1' || recordClass.toUpperCase() === 'DH-3' || recordClass.toUpperCase() === 'RB-2' || /-(1|2|3)$/.test(recordClass.toUpperCase()));
    } else {
      matchesYear = rec.yearGroup === parseInt(adminFilterYear);
    }

    const matchesClass = adminFilterClass === 'all' || recordClass.toLowerCase().includes(adminFilterClass.toLowerCase());

    const matchesSubject = adminFilterSubject === 'all' || rec.subject === adminFilterSubject;

    return matchesSearch && matchesYear && matchesClass && matchesSubject;
  });

  const handleBulkDeleteShown = async () => {
    const allowedRecords = adminFilteredRecords.filter(canDeleteRecord);
    if (allowedRecords.length === 0) return;

    const count = allowedRecords.length;

    try {
      setIsDeletingBulk(true);
      setAssessmentsStatusMsg('');
      if (onDeleteScoreRecord) {
        // Run deletions in parallel
        await Promise.all(allowedRecords.map(rec => onDeleteScoreRecord(rec.id)));
      }
      setAssessmentsStatusMsg(`🎉 Successfully deleted all ${count} filtered assessments!`);
      setTimeout(() => setAssessmentsStatusMsg(''), 5000);
    } catch (err: any) {
      setAssessmentsStatusMsg(`⚠️ Error during bulk deletion: ${err.message || err}`);
    } finally {
      setIsDeletingBulk(false);
      setShowBulkDeleteConfirm(false);
    }
  };

  // Handle register student
  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSuccess('');

    if (!newUsername.trim() || !newName.trim()) return;

    // Standard school formatting checks
    const formattedUsername = newUsername.trim().toLowerCase();
    const formattedName = newName.trim();

    onAddStudent(formattedUsername, formattedName, newYearGroup);
    setRegSuccess(`Successfully registered test pupil ${formattedName}!`);
    setNewUsername('');
    setNewName('');
  };

  const handleUpdateDraftQuestion = (index: number, field: keyof Question, value: any) => {
    setDraftQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      // Auto adjust options if True/False
      if (field === 'type' && value === 'True/False') {
        updated[index].options = ['True', 'False'];
        updated[index].correctAnswer = 'True';
      } else if (field === 'type' && value === 'Ranking') {
        updated[index].options = ['Smallest', 'Medium', 'Large', 'Extra Large'];
        updated[index].correctAnswer = 'Smallest, Medium, Large, Extra Large';
      } else if (field === 'type' && (value === 'Multiple Choice' || value === 'Checkboxes') && updated[index].options.length === 2 && updated[index].options.includes('True')) {
        updated[index].options = ['Option A', 'Option B', 'Option C', 'Option D'];
        updated[index].correctAnswer = 'Option A';
      }
      return updated;
    });
  };

  const handleBulkPaste = (rawText: string) => {
    if (!rawText.trim()) return;

    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const parsedQuestions: Question[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip header lines or noise lines
      const lower = line.toLowerCase();
      if (
        lower.includes('question text') || 
        lower.includes('learning goal') || 
        lower.includes('composite learning goals') ||
        lower.includes('explanation (wrong)') ||
        lower.includes('question no.')
      ) {
        continue;
      }

      // Try splitting by tab (standard spreadsheet copy)
      let cells = line.split('\t').map(c => c.trim());
      
      // Fallback: multiple spaces
      if (cells.length < 3) {
        cells = line.split(/ {2,}/).map(c => c.trim());
      }

      // Fallback: pipe character (markdown tables)
      if (cells.length < 3) {
        cells = line.split('|').map(c => c.trim()).filter(c => c.length > 0);
      }

      // Fail-safe skip
      if (cells.length < 2) continue;

      // Detect if first cell is Question Number
      let qNo = parseInt(cells[0]);
      let textIdx = 1;
      let typeIdx = 2;
      let optionsIdx = 3;
      let answerIdx = 4;
      let goalIdx = 5;
      let explanationIdx = 6;

      if (isNaN(qNo)) {
        textIdx = 0;
        typeIdx = 1;
        optionsIdx = 2;
        answerIdx = 3;
        goalIdx = 4;
        explanationIdx = 5;
      }

      const qText = cells[textIdx] || '';
      if (!qText) continue;

      const qTypeRaw = cells[typeIdx] || 'Multiple Choice';
      let qType = 'Multiple Choice';
      if (qTypeRaw.toLowerCase().includes('true') || qTypeRaw.toLowerCase().includes('false')) {
        qType = 'True/False';
      } else if (qTypeRaw.toLowerCase().includes('check') || qTypeRaw.toLowerCase().includes('box')) {
        qType = 'Checkboxes';
      }

      let rawOptions = cells[optionsIdx] || '';
      let parsedOptions: string[] = [];
      if (qType === 'True/False') {
        parsedOptions = ['True', 'False'];
      } else if (rawOptions) {
        if (rawOptions.includes(';')) {
          parsedOptions = rawOptions.split(';').map(o => o.trim().replace(/^[A-F]\)\s*/i, ''));
        } else if (rawOptions.includes('A)') || rawOptions.includes('B)')) {
          const parts = rawOptions.split(/(?=[A-F]\))/i);
          parsedOptions = parts.map(p => p.trim().replace(/^[A-F]\)\s*/i, '')).filter(Boolean);
        } else if (rawOptions.includes(',')) {
          parsedOptions = rawOptions.split(',').map(o => o.trim());
        } else {
          parsedOptions = [rawOptions];
        }
      }

      if (parsedOptions.length === 0) {
        parsedOptions = qType === 'True/False' ? ['True', 'False'] : ['Option A', 'Option B', 'Option C', 'Option D'];
      }

      let correctAnswer = cells[answerIdx] || '';
      correctAnswer = correctAnswer.trim().replace(/^[A-F]\)\s*/i, '');

      const goal = cells[goalIdx] || '';
      const explanation = cells[explanationIdx] || '';

      parsedQuestions.push({
        id: `q-${Date.now()}-${parsedQuestions.length + 1}`,
        text: qText,
        options: parsedOptions,
        correctAnswer: correctAnswer || parsedOptions[0],
        marks: 2,
        hint: '',
        linkedLearningGoal: goal,
        explanation: explanation,
        imageLink: '',
        type: qType
      });
    }

    if (parsedQuestions.length > 0) {
      setDraftQuestions(parsedQuestions);
      setSaveStatus(`🎉 Successfully imported ${parsedQuestions.length} questions from pasted text!`);
      setTimeout(() => setSaveStatus(''), 4050);
    } else {
      setSaveStatus('⚠️ Could not parse any valid questions. Try splitting columns by Tab.');
      setTimeout(() => setSaveStatus(''), 4050);
    }
  };

  const filteredAdminStudents = registeredStudents.filter((stud) => {
    const matchesYear = studentYearFilter === 'all' || stud.yearGroup === parseInt(studentYearFilter);
    const matchesClass = studentClassFilter === 'all' || stud.class === studentClassFilter;
    const matchesSearch = studentSearchQuery === '' || 
      stud.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
      stud.username.toLowerCase().includes(studentSearchQuery.toLowerCase());
    return matchesYear && matchesClass && matchesSearch;
  });

  const getStudentHistory = (pupil: RosterStudent) => {
    const pupilNameClean = `${pupil.firstName} ${pupil.lastName}`.trim().toLowerCase();
    
    // Find registered student linked
    const regStudent = registeredStudents.find(s => 
      s.role === 'student' && (
        s.googleId === pupil.googleId ||
        (s.email && pupil.email && s.email.toLowerCase() === pupil.email.toLowerCase()) ||
        s.name.toLowerCase().replace(/[^a-z0-9]/g, '') === pupilNameClean.replace(/[^a-z0-9]/g, '')
      )
    );

    const matchedRecords: {
      id: string;
      testTitle: string;
      subject: string;
      percentage: number;
      completedAt: string;
      completedAtDate: Date;
      score?: number;
      totalQuestions?: number;
    }[] = [];

    // 1. From historicRecords
    historicRecords.forEach(rec => {
      if (rec.archiveFolder) return;
      const usernameMatch = regStudent && rec.studentUsername === regStudent.username;
      const nameMatch = rec.studentName && rec.studentName.trim().toLowerCase() === pupilNameClean;
      if (usernameMatch || nameMatch) {
        matchedRecords.push({
          id: rec.id,
          testTitle: rec.testTitle,
          subject: rec.subject,
          percentage: rec.percentage,
          completedAt: rec.completedAt,
          completedAtDate: new Date(rec.completedAt),
          score: rec.score,
          totalQuestions: rec.totalQuestions
        });
      }
    });

    // 2. From scienceSubmissions
    scienceSubmissions.forEach(sub => {
      if (sub.archiveFolder) return;
      const nameMatch = sub.studentName && sub.studentName.trim().toLowerCase() === pupilNameClean;
      const regNameMatch = regStudent && sub.studentName && sub.studentName.trim().toLowerCase() === regStudent.name.trim().toLowerCase();
      if (nameMatch || regNameMatch) {
        const assessment = scienceAssessments.find(a => a.id === sub.assessmentId);
        const testTitle = assessment?.title || sub.assessmentId;
        const dateStr = (sub as any).completedAt || '2026-07-06T00:00:00.000Z';
        matchedRecords.push({
          id: sub.id,
          testTitle: testTitle,
          subject: 'science',
          percentage: sub.percentage,
          completedAt: dateStr,
          completedAtDate: new Date(dateStr),
          score: sub.totalScore,
          totalQuestions: sub.maxPossibleScore
        });
      }
    });

    // Sort chronologically (oldest to newest)
    const sorted = matchedRecords.sort((a, b) => a.completedAtDate.getTime() - b.completedAtDate.getTime());
    if (sorted.length === 0 && pupil.id.startsWith('demo-')) {
      return [
        { id: 'demo-rec-1', testTitle: 'Y4 Autumn Reading Comprehension - Assessment 1', subject: 'reading', percentage: 68, completedAt: '2025-10-14T09:30:00.000Z', completedAtDate: new Date('2025-10-14'), score: 17, totalQuestions: 25 },
        { id: 'demo-rec-2', testTitle: 'Y4 Autumn Maths Arithmetic Test 1', subject: 'maths', percentage: 75, completedAt: '2025-11-04T10:15:00.000Z', completedAtDate: new Date('2025-11-04'), score: 15, totalQuestions: 20 },
        { id: 'demo-rec-3', testTitle: 'Y4 Spring SPaG Grammar & Punctuation', subject: 'spag', percentage: 82, completedAt: '2026-01-20T11:00:00.000Z', completedAtDate: new Date('2026-01-20'), score: 20, totalQuestions: 25 },
        { id: 'demo-rec-4', testTitle: 'Y4 Spring Science - Electricity Unit Test', subject: 'science', percentage: 78, completedAt: '2026-02-18T13:45:00.000Z', completedAtDate: new Date('2026-02-18'), score: 18, totalQuestions: 23 },
        { id: 'demo-rec-5', testTitle: 'Y4 Summer Reading Comprehension - Assessment 2', subject: 'reading', percentage: 88, completedAt: '2026-05-12T09:30:00.000Z', completedAtDate: new Date('2026-05-12'), score: 22, totalQuestions: 25 },
        { id: 'demo-rec-6', testTitle: 'Y4 Summer Maths Reasoning Test 2', subject: 'maths', percentage: 90, completedAt: '2026-06-10T10:30:00.000Z', completedAtDate: new Date('2026-06-10'), score: 27, totalQuestions: 30 },
      ];
    }
    return sorted;
  };

  const calculateProgressDirection = (history: any[]) => {
    if (history.length < 2) return { text: 'Stable ➡️', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    
    // Calculate average of first half vs second half
    const mid = Math.ceil(history.length / 2);
    const firstHalf = history.slice(0, mid);
    const secondHalf = history.slice(mid);
    
    const firstAvg = firstHalf.reduce((sum, r) => sum + r.percentage, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, r) => sum + r.percentage, 0) / secondHalf.length;
    
    const diff = secondAvg - firstAvg;
    if (diff > 3) {
      return { text: `Improving (+${Math.round(diff)}%) 📈`, color: 'bg-emerald-50 text-emerald-700 border-emerald-300' };
    } else if (diff < -3) {
      return { text: `Needs Support (${Math.round(diff)}%) ⚠️`, color: 'bg-rose-50 text-rose-700 border-rose-300' };
    } else {
      return { text: 'Stable ➡️', color: 'bg-amber-50 text-amber-700 border-amber-300' };
    }
  };

  const getPerformanceBand = (percentage: number) => {
    if (percentage < 50) return { label: 'Emerging', bg: 'bg-rose-50 text-rose-700 border-rose-300' };
    if (percentage < 70) return { label: 'Developing', bg: 'bg-amber-50 text-amber-700 border-amber-300' };
    if (percentage < 85) return { label: 'Expected', bg: 'bg-emerald-50 text-emerald-700 border-emerald-300' };
    return { label: 'Greater Depth 🌟', bg: 'bg-indigo-50 text-indigo-700 border-indigo-300' };
  };

  const CustomProgressTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-3 border-slate-900 rounded-xl p-3 shadow-brutal text-xs font-bold text-left space-y-1.5 min-w-[190px]">
          <p className="font-extrabold text-slate-900 border-b border-slate-100 pb-1">
            {data.testTitle || data.subject || label || 'Progress Assessment'}
          </p>
          {payload.map((entry: any, index: number) => {
            const subKey = entry.dataKey || entry.name;
            const subLabel = subKey === 'spag' ? 'SPaG' : subKey === 'percentage' || subKey === 'average' ? (data.subject || 'Score') : subKey;
            const isNull = entry.value === undefined || entry.value === null;
            return (
              <div key={index} className="flex items-center justify-between text-slate-700">
                <span className="font-bold flex items-center gap-1.5 text-[11px] uppercase" style={{ color: entry.color || entry.fill || '#0f172a' }}>
                  <span className="w-2.5 h-2.5 rounded-full inline-block border border-slate-900" style={{ backgroundColor: entry.color || entry.fill || '#4f46e5' }} />
                  {subLabel}:
                </span>
                <span className={`font-black text-xs ${isNull ? 'text-rose-500 italic' : 'text-slate-950'}`}>
                  {isNull ? 'Not completed' : `${entry.value}%`}
                </span>
              </div>
            );
          })}
          {data.completedAt && (
            <p className="text-[10px] text-slate-400 font-extrabold pt-1 border-t border-slate-100">
              📅 {new Date(data.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const termMatchedText = selectedAssessmentYear && selectedAssessmentSubject && selectedAssessmentTerm;
  const matchedTest = getMatchedTest();
  const isMathsOrEnglish = selectedAssessmentSubject === 'maths' || selectedAssessmentSubject === 'reading' || selectedAssessmentSubject === 'spag';

  return (
    <div className="w-full text-left">
      {/* Teacher Profile Head Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-slate-200 pb-5 mb-8 select-none">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-amber-100 border-2 border-slate-800 rounded-xl flex items-center justify-center font-display text-xl">
            📝
          </div>
          <div>
            <h3 className="font-display text-lg text-slate-800 font-bold">{user.name}</h3>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Faculty Staff Panel • Dersingham Primary School
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={onLogout}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 hover:bg-slate-100 text-slate-500 hover:text-red-600 font-bold text-sm border-2 border-slate-200 hover:border-red-300 rounded-xl transition-all cursor-pointer shadow-brutal-sm active:translate-y-[1px] hover:shadow-brutal-rose"
          >
            <LogOut className="w-4 h-4" />
            Google Sign Out
          </button>
          {isAdminViewActive && isCurrentAdmin && (
            <button
              onClick={() => {
                setArchiveFolderName('');
                setArchiveStatusMsg('');
                setShowArchiveModal(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs uppercase border-2 border-slate-900 rounded-xl transition-all cursor-pointer shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[1px]"
            >
              📦 Archive Current Data
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs bar */}
      <div className="flex flex-wrap border-b-3 border-slate-900 gap-1.5 mb-8 select-none">
        {isAdminViewActive ? (
          [
            { id: 'pupil-roster', label: 'Pupil Roster 📋' },
            { id: 'teacher-logins', label: 'Teacher Logins 👨‍🏫' },
            { id: 'assessments', label: 'Assessment Editor 📝' },
            { id: 'pupil-assessments', label: 'Pupil Assessments 📖' },
          ].map((tab) => {
            const isSelected = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`px-4 py-3 font-sans text-xs sm:text-sm font-black border-t-3 border-x-3 border-slate-900 rounded-t-xl cursor-pointer translate-y-[3px] transition-all uppercase tracking-tight ${
                  isSelected
                    ? `bg-indigo-600 text-white border-b-4 border-b-indigo-600`
                    : 'bg-slate-100 hover:bg-slate-50 text-slate-500 hover:translate-y-[1px] border-b-3 border-b-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })
        ) : (
          (() => {
            const tabs = [
              { id: 'overview', label: 'Performance Analytics 📊' },
              { id: 'gradebook', label: 'Pupil Gradebook 📖' },
              { id: 'progress', label: 'Pupil Progress 📈' },
            ];
            if (dbUser.leadSubject) {
              tabs.push({ 
                id: 'subject-leader', 
                label: `Subject Lead (${SUBJECT_LABELS[dbUser.leadSubject as Subject] || dbUser.leadSubject}) 🏆` 
              });
            }
            return tabs;
          })().map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 font-sans text-xs sm:text-sm font-black border-t-3 border-x-3 border-slate-900 rounded-t-xl cursor-pointer translate-y-[3px] transition-all uppercase tracking-tight ${
                  isSelected
                    ? `bg-white text-slate-905 border-b-4 border-b-white`
                    : 'bg-slate-100 hover:bg-slate-50 text-slate-500 hover:translate-y-[1px] border-b-3 border-b-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })
        )}
      </div>

      {/* MAIN TAB SWITCH CONTENT */}
      <AnimatePresence mode="wait">
        {isAdminViewActive ? (
          <div className="space-y-8">
            {activeAdminTab === 'pupil-roster' && (
              <motion.div
                key="pupil-roster"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-left"
              >
                <AdminRosterUpload
                  registeredStudents={registeredStudents}
                  onAddRosterStudentsBulk={onAddRosterStudentsBulk}
                />

                {/* ROSTER IDENTITY MATCHING & LINKING SERVICE */}
                {(() => {
                  const studentGoogleIdentities = registeredStudents.filter(
                    (u) => u.role === 'student' && (u.googleId || u.email)
                  );

                  const unmatchedGoogleLogins = studentGoogleIdentities.filter(
                    (gUser) =>
                      !pupilRoster.some(
                        (r) =>
                          r.googleId === gUser.googleId ||
                          (r.email && gUser.email && r.email.toLowerCase() === gUser.email.toLowerCase())
                      )
                  );

                  const unlinkedRosterStudents = pupilRoster.filter((r) => !r.googleId);

                  const calculateNameMatchScore = (rosterStud: RosterStudent, googleUser: User) => {
                    const rosterFullName = `${rosterStud.firstName} ${rosterStud.lastName}`.toLowerCase().trim();
                    const googleName = googleUser.name.toLowerCase().trim();
                    const googleEmailPrefix = googleUser.email ? googleUser.email.split('@')[0].toLowerCase().trim() : '';

                    if (rosterFullName === googleName) {
                      return { score: 100, reason: "Exact Name Match 🎯" };
                    }

                    const rosterSwappedName = `${rosterStud.lastName} ${rosterStud.firstName}`.toLowerCase().trim();
                    if (rosterSwappedName === googleName) {
                      return { score: 95, reason: "Swapped Names Match 🔄" };
                    }

                    const clean = (s: string) => s.replace(/[^a-z]/g, '');
                    const cRoster = clean(rosterFullName);
                    const cGoogle = clean(googleName);
                    if (cRoster === cGoogle && cRoster.length > 0) {
                      return { score: 90, reason: "Normalized Match ✨" };
                    }

                    const cFirst = clean(rosterStud.firstName.toLowerCase());
                    const cLast = clean(rosterStud.lastName.toLowerCase());
                    if (cFirst && cLast && googleEmailPrefix.includes(cFirst) && googleEmailPrefix.includes(cLast)) {
                      return { score: 85, reason: "Email Prefix Match 📧" };
                    }

                    if (cFirst && googleName.includes(cFirst) && cLast.length > 0 && googleName.includes(cLast[0])) {
                      return { score: 70, reason: "Partial Name Match 👍" };
                    }

                    const rTokens = rosterFullName.split(/\s+/).filter(Boolean);
                    const gTokens = googleName.split(/\s+/).filter(Boolean);
                    let overlap = 0;
                    rTokens.forEach(t => {
                      if (gTokens.includes(t)) overlap++;
                    });
                    if (overlap > 0 && rTokens.length > 0) {
                      const score = Math.round((overlap / Math.max(rTokens.length, gTokens.length)) * 70);
                      return { score, reason: `Token Overlap (${overlap} words) 🔤` };
                    }

                    return { score: 0, reason: "No match" };
                  };

                  const suggestedMatches: {
                    rosterStudent: RosterStudent;
                    googleUser: User;
                    score: number;
                    reason: string;
                  }[] = [];

                  unlinkedRosterStudents.forEach((rStud) => {
                    let bestScore = 0;
                    let bestReason = "";
                    let bestUser: User | null = null;

                    unmatchedGoogleLogins.forEach((gUser) => {
                      const match = calculateNameMatchScore(rStud, gUser);
                      if (match.score > bestScore) {
                        bestScore = match.score;
                        bestReason = match.reason;
                        bestUser = gUser;
                      }
                    });

                    if (bestScore >= 40 && bestUser) {
                      suggestedMatches.push({
                        rosterStudent: rStud,
                        googleUser: bestUser,
                        score: bestScore,
                        reason: bestReason,
                      });
                    }
                  });

                  suggestedMatches.sort((a, b) => b.score - a.score);

                  return (
                    <div id="identity-matcher-section" className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal-sm space-y-4">
                      <div className="flex items-center gap-2 select-none">
                        <div className="w-8 h-8 bg-indigo-600 rounded border-2 border-slate-900 flex items-center justify-center text-white text-sm font-bold">
                          🔐
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Identity Matcher & Account Linker</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compare registrar profiles with active Google logins & override links</p>
                        </div>
                      </div>

                      {/* Matching Statistics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 select-none">
                        <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-3 text-center">
                          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Rostered</span>
                          <span className="text-xl font-black text-slate-900">{pupilRoster.length}</span>
                        </div>
                        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3 text-center">
                          <span className="block text-[8px] font-black text-emerald-800 uppercase tracking-widest">Linked Records</span>
                          <span className="text-xl font-black text-emerald-700">{pupilRoster.filter(r => r.googleId).length} 🟢</span>
                        </div>
                        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 text-center">
                          <span className="block text-[8px] font-black text-amber-800 uppercase tracking-widest">Unlinked Records</span>
                          <span className="text-xl font-black text-amber-700">{unlinkedRosterStudents.length} ⚪</span>
                        </div>
                        <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-3 text-center">
                          <span className="block text-[8px] font-black text-rose-800 uppercase tracking-widest">Unmatched Logins</span>
                          <span className="text-xl font-black text-rose-700">{unmatchedGoogleLogins.length} ⚠️</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Column 1: Suggested Matches */}
                        <div className="space-y-3">
                          <span className="block text-[10px] font-black uppercase tracking-wider text-indigo-600">
                            ⚡ Intelligent Match Recommendations ({suggestedMatches.length})
                          </span>
                          <div className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50 max-h-64 overflow-y-auto space-y-2">
                            {suggestedMatches.length === 0 ? (
                              <div className="text-center py-8 text-slate-400 font-bold uppercase text-[10px] tracking-wider select-none">
                                No recommended name matches found
                              </div>
                            ) : (
                              suggestedMatches.map((match) => (
                                <div key={`${match.rosterStudent.id}-${match.googleUser.username}`} className="bg-white border-2 border-slate-900 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-brutal-sm">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-black text-slate-900">
                                        {match.rosterStudent.firstName} {match.rosterStudent.lastName}
                                      </span>
                                      <span className="px-1.5 py-0.5 bg-slate-100 border text-[8px] font-black uppercase text-slate-600 rounded">
                                        {match.rosterStudent.class}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                                      <span>Google Account:</span>
                                      <span className="font-bold text-indigo-600">{match.googleUser.name}</span>
                                    </div>
                                    <div className="text-[9px] font-mono text-stone-400 truncate max-w-[200px]">
                                      {match.googleUser.email}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-1 mt-0.5">
                                      <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-[8px] font-black text-indigo-700 uppercase">
                                        {match.reason}
                                      </span>
                                      <span className="px-1.5 py-0.5 bg-amber-50 border border-amber-200 rounded text-[8px] font-black text-amber-700 uppercase">
                                        {match.score}% Confidence
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      if (!onUpdateRosterStudent) return;
                                      const updated: RosterStudent = {
                                        ...match.rosterStudent,
                                        googleId: match.googleUser.googleId,
                                        email: match.googleUser.email,
                                      };
                                      try {
                                        await onUpdateRosterStudent(updated);
                                        setRosterStatusMsg(`🎉 Automatically linked ${match.rosterStudent.firstName} to Google Account!`);
                                        setTimeout(() => setRosterStatusMsg(''), 4000);
                                      } catch (err: any) {
                                        setRosterStatusMsg(`⚠️ Error linking: ${err.message}`);
                                      }
                                    }}
                                    className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[9px] uppercase border-2 border-slate-900 rounded-lg cursor-pointer transition-all shadow-brutal-sm hover:translate-y-[-1px]"
                                  >
                                    Link Account ⚡
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Column 2: Manual Override Interface */}
                        <div className="space-y-3">
                          <span className="block text-[10px] font-black uppercase tracking-wider text-rose-600">
                            🔗 Manual Override Linker
                          </span>
                          <div className="border-2 border-slate-900 rounded-xl p-4 bg-slate-50 space-y-3">
                            <div>
                              <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">
                                1. Select Roster Student
                              </label>
                              <select
                                value={manualRosterSelectId}
                                onChange={(e) => setManualRosterSelectId(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-800 cursor-pointer"
                              >
                                <option value="">-- Choose student --</option>
                                <optgroup label="Unlinked Roster Students">
                                  {unlinkedRosterStudents.map(r => (
                                    <option key={r.id} value={r.id}>
                                      ⚪ {r.firstName} {r.lastName} ({r.class ? r.class.replace(/^(class\s+)/i, '') : 'Unassigned'} - Yr {r.yearGroup})
                                    </option>
                                  ))}
                                </optgroup>
                                {pupilRoster.some(r => r.googleId) && (
                                  <optgroup label="Already Linked Roster Students">
                                    {pupilRoster.filter(r => r.googleId).map(r => (
                                      <option key={r.id} value={r.id}>
                                        🟢 {r.firstName} {r.lastName} ({r.class ? r.class.replace(/^(class\s+)/i, '') : 'Unassigned'})
                                      </option>
                                    ))}
                                  </optgroup>
                                )}
                              </select>
                            </div>

                            {/* TYPE ACCOUNT HANDLE (PART BEFORE @ SIGN) */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[9px] font-black uppercase text-slate-600">
                                  2. Type Account Handle <span className="text-slate-400 font-bold">(Part before @ sign)</span>
                                </label>
                              </div>
                              <div className="flex items-stretch">
                                <input
                                  type="text"
                                  value={manualTypedAccountHandle}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setManualTypedAccountHandle(val);
                                    // If user types, check if it matches an unmatched Google user
                                    const cleanVal = val.trim().toLowerCase().replace(/@.*$/, '');
                                    const matchingGoogleUser = registeredStudents.find(
                                      (g) =>
                                        g.username.toLowerCase() === cleanVal ||
                                        (g.email && g.email.toLowerCase().split('@')[0] === cleanVal)
                                    );
                                    if (matchingGoogleUser) {
                                      setManualGoogleSelectUsername(matchingGoogleUser.username);
                                    }
                                  }}
                                  placeholder="e.g. 316jsmith or a.rahman"
                                  className="w-full px-2.5 py-1.5 text-xs font-mono font-bold border-2 border-slate-900 rounded-l-lg bg-white text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                />
                                <span className="px-2 py-1.5 bg-slate-200 border-y-2 border-r-2 border-slate-900 rounded-r-lg text-[10px] font-black text-slate-600 shrink-0 flex items-center select-none">
                                  @dersingham.newham.sch.uk
                                </span>
                              </div>
                            </div>

                            {/* OR CHOOSE FROM UNMATCHED LOGINS DROPDOWN */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="block text-[9px] font-black uppercase text-slate-500">
                                  Or Pick Active Login Identity
                                </label>
                              </div>
                              <select
                                value={manualGoogleSelectUsername}
                                onChange={(e) => {
                                  const selectedUsername = e.target.value;
                                  setManualGoogleSelectUsername(selectedUsername);
                                  if (selectedUsername) {
                                    const gUser = registeredStudents.find(g => g.username === selectedUsername);
                                    if (gUser) {
                                      const handle = gUser.email ? gUser.email.split('@')[0] : gUser.username;
                                      setManualTypedAccountHandle(handle);
                                    }
                                  }
                                }}
                                className="w-full px-2.5 py-1.5 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-800 cursor-pointer"
                              >
                                <option value="">-- Or choose from active Google logins --</option>
                                {unmatchedGoogleLogins.map(g => (
                                  <option key={g.username} value={g.username}>
                                    {g.name} ({g.email || g.username})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              type="button"
                              disabled={!manualRosterSelectId || (!manualGoogleSelectUsername && !manualTypedAccountHandle.trim())}
                              onClick={async () => {
                                if (!onUpdateRosterStudent || !manualRosterSelectId) return;
                                const rosterStudent = pupilRoster.find(r => r.id === manualRosterSelectId);
                                if (!rosterStudent) return;

                                let handle = manualTypedAccountHandle.trim();
                                if (handle.includes('@')) {
                                  handle = handle.split('@')[0].trim();
                                }

                                // 1. Try to find registered Google user
                                let googleUser = registeredStudents.find(
                                  g => g.username === manualGoogleSelectUsername ||
                                       g.username.toLowerCase() === handle.toLowerCase() ||
                                       (g.email && g.email.toLowerCase().split('@')[0] === handle.toLowerCase()) ||
                                       (g.email && g.email.toLowerCase() === `${handle.toLowerCase()}@dersingham.newham.sch.uk`)
                                );

                                const targetEmail = googleUser?.email || (handle ? `${handle}@dersingham.newham.sch.uk` : rosterStudent.email);
                                const googleIdToLink = googleUser?.googleId;

                                const updated: RosterStudent = {
                                  ...rosterStudent,
                                  googleId: googleIdToLink || rosterStudent.googleId,
                                  email: targetEmail,
                                };

                                try {
                                  await onUpdateRosterStudent(updated);
                                  if (googleUser) {
                                    setRosterStatusMsg(`🎉 Manually linked ${rosterStudent.firstName} ${rosterStudent.lastName} to Google user ${googleUser.name} (${targetEmail})!`);
                                  } else {
                                    setRosterStatusMsg(`🎉 Successfully linked ${rosterStudent.firstName} ${rosterStudent.lastName} to account handle '${handle}' (${targetEmail})!`);
                                  }
                                  setTimeout(() => setRosterStatusMsg(''), 4500);
                                  setManualRosterSelectId('');
                                  setManualGoogleSelectUsername('');
                                  setManualTypedAccountHandle('');
                                } catch (err: any) {
                                  setRosterStatusMsg(`⚠️ Error manually linking: ${err.message}`);
                                }
                              }}
                              className={`w-full py-2 bg-rose-500 hover:bg-rose-450 text-white font-black text-xs uppercase border-2 border-slate-900 rounded-lg shadow-brutal-sm cursor-pointer transition-all hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none flex items-center justify-center gap-1.5`}
                            >
                              <span>Link Account Manually</span>
                              <span>🔗</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal-sm">
                  <span className="block text-xs font-black uppercase tracking-wider text-slate-750 mb-3 select-none">
                    ➕ Add Student Manually
                  </span>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!manualFirstName.trim() || !manualLastName.trim() || !manualClass.trim()) {
                        setRosterStatusMsg('⚠️ Please fill out all required fields!');
                        return;
                      }

                      const newStudent: RosterStudent = {
                        id: `pupil-${manualYear}-${manualFirstName.toLowerCase()}-${manualLastName.toLowerCase()}-${Date.now()}`,
                        firstName: manualFirstName.trim(),
                        lastName: manualLastName.trim(),
                        yearGroup: manualYear,
                        class: manualClass.trim(),
                        pupilPremium: manualPP,
                        send: manualSEND,
                      };

                      try {
                        if (onUpdateRosterStudent) {
                          await onUpdateRosterStudent(newStudent);
                          setRosterStatusMsg(`🎉 Added ${manualFirstName} ${manualLastName} to roster successfully!`);
                          setTimeout(() => setRosterStatusMsg(''), 4000);
                          setManualFirstName('');
                          setManualLastName('');
                          setManualClass('');
                          setManualPP(false);
                          setManualSEND('No SEN');
                        }
                      } catch (err: any) {
                        setRosterStatusMsg(`⚠️ Error adding: ${err.message}`);
                      }
                    }}
                    className="space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">First Name</label>
                        <input
                          type="text"
                          value={manualFirstName}
                          onChange={(e) => setManualFirstName(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-800"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">Last Name</label>
                        <input
                          type="text"
                          value={manualLastName}
                          onChange={(e) => setManualLastName(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-800"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">Year Group</label>
                        <select
                          value={manualYear}
                          onChange={(e) => setManualYear(parseInt(e.target.value))}
                          className="w-full px-2 py-1.5 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-800"
                        >
                          {[1, 2, 3, 4, 5, 6].map(y => (
                            <option key={y} value={y}>Year {y}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">Class</label>
                        {!isManualCustomClass ? (
                          <div className="flex gap-1.5">
                            <select
                              value={manualClass}
                              onChange={(e) => {
                                if (e.target.value === '__custom__') {
                                  setIsManualCustomClass(true);
                                  setManualClass('');
                                } else {
                                  setManualClass(e.target.value);
                                }
                              }}
                              className="w-full px-2 py-1.5 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-800 uppercase"
                              required
                            >
                              <option value="">-- Select --</option>
                              {adminAvailableClasses.map((cls) => (
                                <option key={cls} value={cls}>{cls.replace(/^(class\s+)/i, '')}</option>
                              ))}
                              <option value="__custom__">➕ New / Custom...</option>
                            </select>
                          </div>
                        ) : (
                          <div className="flex gap-1.5">
                            <input
                              type="text"
                              value={manualClass}
                              onChange={(e) => setManualClass(e.target.value)}
                              placeholder="e.g. JR-18"
                              className="w-full px-2 py-1.5 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-800 uppercase"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsManualCustomClass(false);
                                setManualClass('');
                              }}
                              className="px-2 py-1.5 text-[10px] font-bold border-2 border-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200"
                              title="Select from list"
                            >
                              List
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 items-center select-none pt-1">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={manualPP}
                          onChange={(e) => setManualPP(e.target.checked)}
                          className="w-4 h-4 border-2 border-slate-900 rounded accent-indigo-600"
                        />
                        Pupil Premium (PP)
                      </label>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-500 mb-1">SEND Provision</label>
                        <select
                          value={manualSEND}
                          onChange={(e) => setManualSEND(e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-800"
                        >
                          <option value="No SEN">No SEN</option>
                          <option value="SEN Support">SEN Support</option>
                          <option value="EHC Plan">EHC Plan</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-black text-xs uppercase border-2 border-slate-900 rounded-lg shadow-brutal-sm cursor-pointer transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
                    >
                      Add Pupil to Registrar
                    </button>
                  </form>

                  {rosterStatusMsg && (
                    <div className="mt-4 p-3 bg-amber-50 border-2 border-slate-900 rounded-xl text-slate-900 font-black text-xs uppercase tracking-wider text-center shadow-brutal-sm animate-pulse">
                      {rosterStatusMsg}
                    </div>
                  )}
                </div>

                {/* Filter and Roster Table view */}
                <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 select-none">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                      <span>Registrar List ({pupilRoster.length} pupils)</span>
                    </h3>

                    {/* Filter controls */}
                    <div className="flex flex-wrap gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Search name..."
                        value={rosterSearch}
                        onChange={(e) => setRosterSearch(e.target.value)}
                        className="px-3 py-1.5 text-xs font-bold border-2 border-slate-900 rounded-xl bg-slate-50"
                      />

                      <select
                        value={rosterYearFilter}
                        onChange={(e) => setRosterYearFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs font-black border-2 border-slate-900 rounded-xl bg-slate-50"
                      >
                        <option value="all">All Years</option>
                        <option value="nursery">Nursery 🌱</option>
                        <option value="reception">Reception 👑</option>
                        {[1, 2, 3, 4, 5, 6].map(y => (
                          <option key={y} value={y}>Year {y}</option>
                        ))}
                      </select>

                      <select
                        value={rosterClassFilter}
                        onChange={(e) => setRosterClassFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs font-black border-2 border-slate-900 rounded-xl bg-slate-50 uppercase"
                      >
                        <option value="all">All Classes</option>
                        {adminAvailableClasses.map(cls => (
                          <option key={cls} value={cls}>{cls.replace(/^(class\s+)/i, '')}</option>
                        ))}
                      </select>

                      <select
                        value={rosterStatusFilter}
                        onChange={(e) => setRosterStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs font-black border-2 border-slate-900 rounded-xl bg-slate-50"
                      >
                        <option value="all">All Status</option>
                        <option value="linked">Linked Only</option>
                        <option value="unlinked">Unlinked Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Pupil Roster Table Grid */}
                  <div className="border-3 border-slate-900 rounded-2xl overflow-hidden bg-slate-50">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-white uppercase text-[10px] font-black tracking-wider border-b-3 border-slate-900 select-none">
                            <th className="p-3">Student Name</th>
                            <th className="p-3">Year Group</th>
                            <th className="p-3">Class Assigned</th>
                            <th className="p-3 text-center">Pupil Premium (PP)</th>
                            <th className="p-3 text-center">SEND Profile</th>
                            <th className="p-3 text-center">Linked Google Account</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            let list = [...pupilRoster];
                            if (rosterYearFilter !== 'all') {
                              if (rosterYearFilter === 'nursery') {
                                list = list.filter(r => r.yearGroup === 0 && (r.class.toUpperCase().includes('AA-AM') || r.class.toUpperCase().includes('AA-PM') || r.class.toUpperCase().endsWith('-AM') || r.class.toUpperCase().endsWith('-PM')));
                              } else if (rosterYearFilter === 'reception') {
                                list = list.filter(r => r.yearGroup === 0 && (r.class.toUpperCase() === 'CW-1' || r.class.toUpperCase() === 'DH-3' || r.class.toUpperCase() === 'RB-2' || /-(1|2|3)$/.test(r.class.toUpperCase())));
                              } else {
                                list = list.filter(r => r.yearGroup === parseInt(rosterYearFilter));
                              }
                            }
                            if (rosterClassFilter !== 'all') {
                              list = list.filter(r => r.class === rosterClassFilter);
                            }
                            if (rosterStatusFilter !== 'all') {
                              if (rosterStatusFilter === 'linked') {
                                list = list.filter(r => r.googleId);
                              } else {
                                list = list.filter(r => !r.googleId);
                              }
                            }
                            if (rosterSearch.trim()) {
                              const q = rosterSearch.toLowerCase();
                              list = list.filter(r => `${r.firstName} ${r.lastName}`.toLowerCase().includes(q));
                            }

                            if (list.length === 0) {
                              return (
                                <tr>
                                  <td colSpan={7} className="p-8 text-center text-slate-400 font-bold uppercase text-xs">
                                    No students registered matching filter criteria
                                  </td>
                                </tr>
                              );
                            }

                            return list.map((student) => {
                              const isLinked = !!student.googleId;
                              return (
                                <tr key={student.id} className="hover:bg-slate-100 transition-colors border-b-2 border-slate-200">
                                  <td className="p-3 font-black text-slate-900">
                                    {student.firstName} {student.lastName}
                                  </td>
                                  <td className="p-3 font-bold text-slate-600">
                                    {editingStudentId === student.id ? (
                                      <select
                                        value={editingYearGroup}
                                        onChange={(e) => setEditingYearGroup(parseInt(e.target.value))}
                                        className="px-2 py-1 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-800"
                                      >
                                        <option value={0}>Reception / Nursery (0)</option>
                                        {[1, 2, 3, 4, 5, 6].map(y => (
                                          <option key={y} value={y}>Year {y}</option>
                                        ))}
                                      </select>
                                    ) : (
                                      <span className="px-2.5 py-1 bg-white border-2 border-slate-900 rounded-lg text-[9px] uppercase tracking-wide">
                                        {student.class && (student.class.toUpperCase().includes('AA-AM') || student.class.toUpperCase().includes('AA-PM') || student.class.toUpperCase().endsWith('-AM') || student.class.toUpperCase().endsWith('-PM')) ? 'Nursery' : (student.class && (student.class.toUpperCase() === 'CW-1' || student.class.toUpperCase() === 'DH-3' || student.class.toUpperCase() === 'RB-2' || /-(1|2|3)$/.test(student.class.toUpperCase()))) ? 'Reception' : `Year ${student.yearGroup}`}
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3 font-bold text-slate-600">
                                    {editingStudentId === student.id ? (
                                      <div className="flex flex-col gap-1 max-w-[150px]">
                                        {!isEditingCustomClass ? (
                                          <select
                                            value={editingClass}
                                            onChange={(e) => {
                                              if (e.target.value === '__custom__') {
                                                setIsEditingCustomClass(true);
                                                setEditingClass('');
                                              } else {
                                                setEditingClass(e.target.value);
                                              }
                                            }}
                                            className="px-2 py-1 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-800 uppercase"
                                          >
                                            <option value="">-- Select Class --</option>
                                            {adminAvailableClasses.map((cls) => (
                                              <option key={cls} value={cls}>{cls.replace(/^(class\s+)/i, '')}</option>
                                            ))}
                                            <option value="__custom__">➕ New / Custom...</option>
                                          </select>
                                        ) : (
                                          <div className="flex gap-1">
                                            <input
                                              type="text"
                                              value={editingClass}
                                              onChange={(e) => setEditingClass(e.target.value.toUpperCase())}
                                              placeholder="e.g. JR-18"
                                              className="px-2 py-1 w-full text-xs font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-800 uppercase"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setIsEditingCustomClass(false);
                                                setEditingClass('');
                                              }}
                                              className="px-1.5 py-1 text-[9px] font-bold border-2 border-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200"
                                            >
                                              List
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="px-2.5 py-1 bg-indigo-50 border-2 border-slate-200 rounded-lg text-[9px] uppercase tracking-wide text-indigo-700">
                                        {student.class ? student.class.replace(/^(class\s+)/i, '') : 'Unassigned'}
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3 text-center">
                                    {student.pupilPremium ? (
                                      <span className="px-2.5 py-1 bg-rose-50 border-2 border-rose-900 text-rose-700 text-[9px] font-black uppercase rounded-lg">
                                        YES (PP) 🔴
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 font-bold uppercase">—</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-center">
                                    {student.send && student.send !== 'No SEN' ? (
                                      <span className="px-2.5 py-1 bg-sky-50 border-2 border-sky-900 text-sky-700 text-[9px] font-black uppercase rounded-lg">
                                        {typeof student.send === 'string' ? student.send : 'YES (SEND)'} 🔵
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 font-bold uppercase">—</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-center font-bold">
                                    {isLinked ? (
                                      <div className="flex flex-col items-center">
                                        <span className="text-[10px] bg-emerald-50 text-emerald-800 border-2 border-emerald-300 px-2 py-0.5 rounded-lg uppercase font-black">
                                          Linked 🟢
                                        </span>
                                        <span className="text-[9px] font-mono text-slate-400 font-black mt-0.5 max-w-[150px] truncate">
                                          {student.email}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-[10px] bg-slate-100 text-slate-500 border-2 border-slate-300 px-2 py-0.5 rounded-lg uppercase font-black">
                                        Unlinked ⚪
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3 text-right">
                                    <div className="flex justify-end gap-1.5">
                                      {editingStudentId === student.id ? (
                                        <>
                                          <button
                                            type="button"
                                            onClick={async () => {
                                              if (!onUpdateRosterStudent) return;
                                              const updated = {
                                                ...student,
                                                yearGroup: editingYearGroup,
                                                class: editingClass,
                                              };
                                              await onUpdateRosterStudent(updated);
                                              setEditingStudentId(null);
                                              setRosterStatusMsg(`Updated classroom info for ${student.firstName} ${student.lastName}!`);
                                              setTimeout(() => setRosterStatusMsg(''), 3000);
                                            }}
                                            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[10px] uppercase border-2 border-slate-900 rounded-lg shadow-brutal-xs cursor-pointer transition-all hover:translate-y-[-1px]"
                                          >
                                            Save 💾
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setEditingStudentId(null)}
                                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-[10px] uppercase border-2 border-slate-900 rounded-lg cursor-pointer transition-all"
                                          >
                                            Cancel ❌
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setEditingStudentId(student.id);
                                              setEditingYearGroup(student.yearGroup);
                                              setEditingClass(student.class || '');
                                              setIsEditingCustomClass(false);
                                            }}
                                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-[10px] uppercase border-2 border-indigo-300 rounded-lg cursor-pointer transition-all"
                                          >
                                            Edit ✏️
                                          </button>
                                          {isLinked ? (
                                            <button
                                              type="button"
                                              onClick={async () => {
                                                if (!onUpdateRosterStudent) return;
                                                const unlinked = { ...student };
                                                delete unlinked.googleId;
                                                delete unlinked.email;
                                                await onUpdateRosterStudent(unlinked);
                                                setRosterStatusMsg(`Unlinked account for ${student.firstName} ${student.lastName}!`);
                                                setTimeout(() => setRosterStatusMsg(''), 3000);
                                              }}
                                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-[10px] uppercase border-2 border-rose-300 rounded-lg cursor-pointer transition-all"
                                            >
                                              Unlink Account 💔
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setManualRosterSelectId(student.id);
                                                document.getElementById('identity-matcher-section')?.scrollIntoView({ behavior: 'smooth' });
                                              }}
                                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-white font-black text-[10px] uppercase border-2 border-slate-900 rounded-lg shadow-brutal-sm cursor-pointer transition-all hover:translate-y-[-1px]"
                                            >
                                              Link Account 🔗
                                            </button>
                                          )}
                                          <button
                                            type="button"
                                            onClick={async () => {
                                              if (window.confirm(`Are you sure you want to remove ${student.firstName} ${student.lastName} from the pupil roster?`)) {
                                                if (onDeleteRosterStudent) {
                                                  await onDeleteRosterStudent(student.id);
                                                  setRosterStatusMsg(`Removed ${student.firstName} ${student.lastName} from roster!`);
                                                  setTimeout(() => setRosterStatusMsg(''), 3000);
                                                }
                                              }
                                            }}
                                            className="px-2.5 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 font-black text-[10px] uppercase border-2 border-rose-300 rounded-lg cursor-pointer transition-all"
                                            title={`Delete ${student.firstName} ${student.lastName}`}
                                          >
                                            Delete 🗑️
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* DANGER ZONE - Clear entire registrar list */}
                <div className="bg-rose-50 border-3 border-rose-900 rounded-2xl p-5 shadow-brutal-sm text-left">
                  <h4 className="text-base font-black text-rose-900 uppercase tracking-tight flex items-center gap-1.5 select-none">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone: Purge School Registrar List
                  </h4>
                  <p className="text-xs font-black text-rose-700 uppercase tracking-widest mt-1 mb-4 select-none">
                    This action deletes all students from the roster and resets active linked accounts.
                  </p>

                  {showClearRosterConfirm ? (
                    <div className="space-y-3 p-3 bg-white border-2 border-rose-900 rounded-xl max-w-md animate-fadeIn">
                      <p className="text-xs font-black text-rose-900 uppercase tracking-tight leading-relaxed">
                        ⚠️ WARNING: Are you absolutely sure you want to delete the school registrar roster? All linked student Google accounts will be disconnected!
                      </p>
                      <div className="flex gap-2 select-none">
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              if (onClearRoster) {
                                await onClearRoster();
                                setRosterStatusMsg('🧹 Successfully purged and cleared the school pupil registrar!');
                                setTimeout(() => setRosterStatusMsg(''), 5000);
                                setShowClearRosterConfirm(false);
                              }
                            } catch (err: any) {
                              setRosterStatusMsg(`⚠️ Purge failed: ${err.message}`);
                            }
                          }}
                          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] uppercase border-2 border-slate-900 rounded-lg shadow-brutal-sm cursor-pointer transition-all hover:translate-y-[-1px]"
                        >
                          Yes, Delete Everything! 💣
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowClearRosterConfirm(false)}
                          className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300 rounded-lg text-[10px] font-black uppercase cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowClearRosterConfirm(true)}
                      className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase border-2 border-slate-900 rounded-xl shadow-brutal-sm cursor-pointer transition-all hover:translate-y-[-1px] select-none"
                    >
                      Clear School Roster 🗑️
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {activeAdminTab === 'teacher-logins' && (
              <motion.div
                key="teacher-logins"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-left"
              >
                <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal-sm">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Teacher Staff Credentials 👨‍🏫</h2>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
                    List of registered faculty accounts, classes taught, and administrator access control.
                  </p>

                  <div className="overflow-x-auto border-3 border-slate-900 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b-3 border-slate-900 select-none">
                          <th className="p-3 text-xs font-black uppercase tracking-wider text-slate-700">Username</th>
                          <th className="p-3 text-xs font-black uppercase tracking-wider text-slate-700">Name</th>
                          <th className="p-3 text-xs font-black uppercase tracking-wider text-slate-700">Year Group</th>
                          <th className="p-3 text-xs font-black uppercase tracking-wider text-slate-700">Class Assigned</th>
                          <th className="p-3 text-xs font-black uppercase tracking-wider text-slate-700">Subject Lead</th>
                          <th className="p-3 text-xs font-black uppercase tracking-wider text-slate-700">Admin Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-slate-100">
                        {registeredTeachers.map((teach) => {
                          const isSelf = teach.username === user.username;
                          return (
                            <tr key={teach.username} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 text-xs font-mono font-bold text-indigo-600">{teach.username}</td>
                              <td className="p-3 text-xs font-black text-slate-800">{teach.name}</td>
                              <td className="p-3">
                                <select
                                  value={teach.yearGroup !== undefined && teach.yearGroup !== null ? teach.yearGroup : ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const parsedVal = val === '' ? undefined : parseInt(val);
                                    onUpdateTeacherYearGroup && onUpdateTeacherYearGroup(teach.username, parsedVal);
                                  }}
                                  className="px-2.5 py-1 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white w-40 text-slate-800 uppercase cursor-pointer"
                                >
                                  <option value="">-- No Year / All --</option>
                                  <option value="-1">Nursery 🌱</option>
                                  <option value="-2">Reception 👑</option>
                                  {[1, 2, 3, 4, 5, 6].map((yr) => (
                                    <option key={yr} value={yr}>
                                      Year {yr}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="p-3">
                                <select
                                  value={teach.class || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    onUpdateTeacherClass && onUpdateTeacherClass(teach.username, val);
                                  }}
                                  className="px-2.5 py-1 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white w-40 text-slate-800 uppercase cursor-pointer"
                                >
                                  <option value="">-- No Class / All --</option>
                                  {Array.from(
                                    new Set([
                                      ...adminAvailableClasses,
                                      ...(teach.class ? [teach.class] : [])
                                    ])
                                  )
                                    .filter((c): c is string => !!c && c.trim() !== '')
                                    .sort()
                                    .map((cls) => (
                                      <option key={cls} value={cls}>
                                        {cls.replace(/^(class\s+)/i, '')}
                                      </option>
                                    ))}
                                </select>
                              </td>
                              <td className="p-3">
                                <select
                                  value={teach.leadSubject || ''}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    onUpdateTeacherLeadSubject && onUpdateTeacherLeadSubject(teach.username, val === '' ? undefined : val);
                                  }}
                                  className="px-2.5 py-1 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white w-40 text-slate-800 uppercase cursor-pointer"
                                >
                                  <option value="">-- No Subject Lead --</option>
                                  {(Object.keys(SUBJECT_LABELS) as Subject[]).map((subj) => (
                                    <option key={subj} value={subj}>
                                      {SUBJECT_LABELS[subj]}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="p-3">
                                {isSelf ? (
                                  <span className="text-[10px] text-indigo-600 font-extrabold uppercase bg-indigo-50 px-2.5 py-1.5 border-2 border-indigo-600 rounded-xl select-none">
                                    Current User 👑
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => onToggleAdmin && onToggleAdmin(teach.username)}
                                    className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-slate-900 rounded-xl cursor-pointer shadow-brutal-sm hover:translate-y-[-1px] transition-all select-none ${
                                      teach.isAdmin ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-500'
                                    }`}
                                  >
                                    {teach.isAdmin ? 'Admin Active 👑' : 'Grant Admin 🛡️'}
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeAdminTab === 'assessments' && (
              <motion.div
                key="assessments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-left"
              >
                <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal-sm">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Curriculum Assessment Builder 📝</h2>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">
                    Step-by-step assessment generator and PDF template customizer.
                  </p>

                  {/* Saved Draft Recovery Banner */}
                  {savedDraft && (
                    <div className="mb-6 p-4 bg-amber-50 border-3 border-slate-900 rounded-2xl shadow-brutal-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
                      <div className="flex items-start gap-2.5">
                        <span className="text-2xl mt-0.5">📝</span>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Draft Auto-Saved Assessment Found</h4>
                          <p className="text-[10px] font-bold text-slate-600">
                            Saved on {new Date(savedDraft.savedAt).toLocaleDateString()} at {new Date(savedDraft.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} for{' '}
                            <span className="text-indigo-600 font-extrabold uppercase">
                              Year {savedDraft.selectedAssessmentYear} {savedDraft.selectedAssessmentSubject} - {savedDraft.selectedAssessmentTerm} {savedDraft.selectedAssessmentFocus && savedDraft.selectedAssessmentFocus !== 'Test 1' && `(${savedDraft.selectedAssessmentFocus})`}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 select-none self-end sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            // Restore state
                            setSelectedAssessmentYear(savedDraft.selectedAssessmentYear);
                            setSelectedAssessmentSubject(savedDraft.selectedAssessmentSubject);
                            setSelectedAssessmentTerm(savedDraft.selectedAssessmentTerm);
                            setSelectedAssessmentFocus(savedDraft.selectedAssessmentFocus || 'Test 1');
                            setDraftTitle(savedDraft.draftTitle);
                            setDraftTimeLimit(savedDraft.draftTimeLimit);
                            setDraftQuestions(savedDraft.draftQuestions);
                            setSavedDraft(null); // Clear prompt
                            setLastAutoSaved(new Date(savedDraft.savedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white border-2 border-slate-900 rounded-xl text-[10px] font-black uppercase transition-all shadow-brutal-xs hover:translate-y-[-1px] cursor-pointer"
                        >
                          Restore Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.removeItem('dersingham_assessment_draft');
                            setSavedDraft(null);
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-900 rounded-xl text-[10px] font-black uppercase transition-all shadow-brutal-xs hover:translate-y-[-1px] cursor-pointer"
                        >
                          Discard
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 1: Year Group buttons */}
                  <div className="mb-4">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Step 1: Select Year Group</span>
                    <div className="flex flex-wrap gap-2 select-none">
                      {[1, 2, 3, 4, 5, 6].map((yr) => {
                        const isSelected = selectedAssessmentYear === yr;
                        return (
                          <button
                            key={yr}
                            onClick={() => {
                              setSelectedAssessmentYear(yr);
                              setSelectedAssessmentSubject(null);
                              setSelectedAssessmentTerm(null);
                            }}
                            className={`px-4 py-2 border-2 border-slate-900 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm hover:translate-y-[-1px] select-none cursor-pointer ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800'
                            }`}
                          >
                            Year {yr}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 2: Subject buttons */}
                  {selectedAssessmentYear && (
                    <div className="mb-4 animate-fadeIn">
                      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Step 2: Select Subject Domain</span>
                      <div className="flex flex-wrap gap-2 select-none">
                        {(Object.keys(SUBJECT_LABELS) as Subject[]).map((subj) => {
                          const isSelected = selectedAssessmentSubject === subj;
                          const label = SUBJECT_LABELS[subj];
                          return (
                            <button
                              key={subj}
                              onClick={() => {
                                setSelectedAssessmentSubject(subj);
                                setSelectedAssessmentTerm(null);
                              }}
                              className={`px-4 py-2 border-2 border-slate-900 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm hover:translate-y-[-1px] select-none cursor-pointer ${
                                isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800'
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Term or Test select buttons */}
                  {selectedAssessmentSubject && (
                    <div className="mb-6 animate-fadeIn">
                      <div className="flex items-center mb-2">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                          {selectedAssessmentSubject === 'reading' || selectedAssessmentSubject === 'spag' ? 'Step 3: Select Test' : 'Step 3: Choose Assessment Option'}
                        </span>
                        {(selectedAssessmentSubject === 'reading' || selectedAssessmentSubject === 'spag') && (
                          <button
                            type="button"
                            onClick={() => {
                              const key = `${selectedAssessmentYear}-${selectedAssessmentSubject}`;
                              const baseMax = getMaxTestNum(selectedAssessmentYear || 0, selectedAssessmentSubject || '');
                              const currentMax = Math.max(baseMax, extraTestsCount[key] || 1);
                              const nextMax = currentMax + 1;
                              setExtraTestsCount(prev => ({ ...prev, [key]: nextMax }));
                              setSelectedAssessmentTerm(`Test ${nextMax}`);
                            }}
                            className="ml-3 px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-black text-[9px] uppercase border-2 border-slate-900 rounded-lg shadow-brutal-sm cursor-pointer inline-flex items-center gap-1 transition-all hover:translate-y-[-1px]"
                          >
                            ➕ Add Test
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 select-none">
                        {(() => {
                          let options: string[] = [];
                          if (selectedAssessmentSubject === 'reading' || selectedAssessmentSubject === 'spag') {
                            const key = `${selectedAssessmentYear}-${selectedAssessmentSubject}`;
                            const baseMax = getMaxTestNum(selectedAssessmentYear || 0, selectedAssessmentSubject || '');
                            const currentMax = Math.max(baseMax, extraTestsCount[key] || 1);
                            options = Array.from({ length: currentMax }, (_, i) => `Test ${i + 1}`);
                          } else if (selectedAssessmentSubject === 'maths') {
                            options = ['Arithmetic', 'Reasoning'];
                          } else if (selectedAssessmentSubject === 'history') {
                            options = ['Autumn Mid Point', 'Autumn End Point', 'Spring Mid Point', 'Spring End Point', 'Summer Mid Point', 'Summer End Point'];
                          } else if (['science', 'computing', 're', 'pe', 'music', 'pshe'].includes(selectedAssessmentSubject)) {
                            options = ['Autumn 1', 'Autumn 2', 'Spring 1', 'Spring 2', 'Summer 1', 'Summer 2'];
                          } else {
                            // geography, art, dt
                            options = ['Autumn', 'Spring', 'Summer'];
                          }

                          return options.map((opt) => {
                            const isSelected = selectedAssessmentTerm === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSelectedAssessmentTerm(opt)}
                                className={`px-4 py-2 border-2 border-slate-900 rounded-xl text-xs font-black uppercase tracking-all shadow-brutal-sm hover:translate-y-[-1px] select-none cursor-pointer ${
                                  isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Focus or Test buttons (only for Maths, Science, Geography, History) */}
                  {selectedAssessmentSubject && (selectedAssessmentSubject === 'maths' || selectedAssessmentSubject === 'science' || selectedAssessmentSubject === 'geography' || selectedAssessmentSubject === 'history') && (
                    <div className="mb-6 animate-fadeIn">
                      <div className="flex items-center mb-2">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                          {selectedAssessmentSubject === 'maths' ? 'Step 4: Select Test' : 'Step 4: Select Test Focus'}
                        </span>
                        {selectedAssessmentSubject === 'maths' && (
                          <button
                            type="button"
                            onClick={() => {
                              const key = `${selectedAssessmentYear}-maths-${selectedAssessmentTerm || ''}`;
                              const baseMax = getMaxTestNum(selectedAssessmentYear || 0, 'maths', selectedAssessmentTerm || '');
                              const currentMax = Math.max(baseMax, extraTestsCount[key] || 1);
                              const nextMax = currentMax + 1;
                              setExtraTestsCount(prev => ({ ...prev, [key]: nextMax }));
                              setSelectedAssessmentFocus(`Test ${nextMax}`);
                            }}
                            className="ml-3 px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-black text-[9px] uppercase border-2 border-slate-900 rounded-lg shadow-brutal-sm cursor-pointer inline-flex items-center gap-1 transition-all hover:translate-y-[-1px]"
                          >
                            ➕ Add Test
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 select-none">
                        {(() => {
                          let options: string[] = [];
                          if (selectedAssessmentSubject === 'maths') {
                            const key = `${selectedAssessmentYear}-maths-${selectedAssessmentTerm || ''}`;
                            const baseMax = getMaxTestNum(selectedAssessmentYear || 0, 'maths', selectedAssessmentTerm || '');
                            const currentMax = Math.max(baseMax, extraTestsCount[key] || 1);
                            options = Array.from({ length: currentMax }, (_, i) => `Test ${i + 1}`);
                          } else {
                            // science, geography, history
                            options = ['Topic Study', 'Skill Focus'];
                          }

                          return options.map((opt) => {
                            const isSelected = selectedAssessmentFocus === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSelectedAssessmentFocus(opt)}
                                className={`px-4 py-2 border-2 border-slate-900 rounded-xl text-xs font-black uppercase tracking-all shadow-brutal-sm hover:translate-y-[-1px] select-none cursor-pointer ${
                                  isSelected ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}

                  {/* EDITABLE ASSESSMENT CONTAINER */}
                  {selectedAssessmentYear && selectedAssessmentSubject && selectedAssessmentTerm && (
                    <div className="border-t-3 border-slate-900 pt-6 mt-6 animate-fadeIn space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Assessment Sheet Title</label>
                            {lastAutoSaved ? (
                              <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                                Auto-saved at {lastAutoSaved}
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                Auto-saves every 30s
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            value={draftTitle}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            className="w-full px-3 py-2 text-xs font-black border-2 border-slate-900 rounded-xl bg-slate-50 text-slate-800"
                          />
                        </div>
                        <div className="w-full md:w-48">
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Time Limit (Minutes)</label>
                          <select
                            value={Math.round(draftTimeLimit / 60)}
                            onChange={(e) => setDraftTimeLimit(parseInt(e.target.value) * 60)}
                            className="w-full px-3 py-2 text-xs font-bold border-2 border-slate-900 rounded-xl bg-slate-50 text-slate-800"
                          >
                            {[5, 10, 15, 20, 25, 30, 40, 45, 60, 90].map(mins => (
                              <option key={mins} value={mins}>{mins} Minutes</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* FAST BULK PASTE IMPORT TRAY */}
                      <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-2xl space-y-3">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                          <div className="flex items-start gap-1.5 select-none">
                            <span className="w-8 h-8 bg-indigo-100 rounded-lg border-2 border-slate-900 flex items-center justify-center text-xs shrink-0 mt-0.5">
                              📋
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Fast Bulk Paste / Import Table Data</h4>
                              <p className="text-[9px] font-bold text-slate-400">Copy table columns from Word, PDF, Excel, or Google Sheets and paste here</p>
                            </div>
                          </div>
                          
                          {/* Preloaded quick buttons for sample assessments */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">Load Templates:</span>
                            <button
                              type="button"
                              onClick={() => {
                                const t = PREPACKAGED_TEMPLATES['y1-materials-autumn1'];
                                if (t) {
                                  setDraftTitle(t.title);
                                  const formatted: Question[] = t.questions.map((q, i) => ({
                                    id: `q-${Date.now()}-${i + 1}`,
                                    text: q.text || '',
                                    options: q.options || ['Option A', 'Option B'],
                                    correctAnswer: q.correctAnswer || '',
                                    marks: q.marks || 2,
                                    hint: q.hint || '',
                                    linkedLearningGoal: q.linkedLearningGoal || '',
                                    explanation: q.explanation || '',
                                    imageLink: q.imageLink || '',
                                    type: q.type || 'Multiple Choice'
                                  }));
                                  setDraftQuestions(formatted);
                                  setSaveStatus('🎉 Loaded Everyday Materials (Autumn 1) Year 1 questions!');
                                  setTimeout(() => setSaveStatus(''), 4000);
                                }
                              }}
                              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 border-2 border-slate-900 rounded-lg text-[9px] font-black uppercase cursor-pointer transition-all hover:translate-y-[-1px] shadow-brutal-sm text-slate-900"
                            >
                              Year 1 Aut 1 Materials
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const t = PREPACKAGED_TEMPLATES['y1-materials-autumn2'];
                                if (t) {
                                  setDraftTitle(t.title);
                                  const formatted: Question[] = t.questions.map((q, i) => ({
                                    id: `q-${Date.now()}-${i + 1}`,
                                    text: q.text || '',
                                    options: q.options || ['Option A', 'Option B'],
                                    correctAnswer: q.correctAnswer || '',
                                    marks: q.marks || 2,
                                    hint: q.hint || '',
                                    linkedLearningGoal: q.linkedLearningGoal || '',
                                    explanation: q.explanation || '',
                                    imageLink: q.imageLink || '',
                                    type: q.type || 'Multiple Choice'
                                  }));
                                  setDraftQuestions(formatted);
                                  setSaveStatus('🎉 Loaded Everyday Materials (Autumn 2) Year 1 questions!');
                                  setTimeout(() => setSaveStatus(''), 4000);
                                }
                              }}
                              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 border-2 border-slate-900 rounded-lg text-[9px] font-black uppercase cursor-pointer transition-all hover:translate-y-[-1px] shadow-brutal-sm text-slate-900"
                            >
                              Year 1 Aut 2 Materials
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const t = PREPACKAGED_TEMPLATES['y1-animals-spring1'];
                                if (t) {
                                  setDraftTitle(t.title);
                                  const formatted: Question[] = t.questions.map((q, i) => ({
                                    id: `q-${Date.now()}-${i + 1}`,
                                    text: q.text || '',
                                    options: q.options || ['Option A', 'Option B'],
                                    correctAnswer: q.correctAnswer || '',
                                    marks: q.marks || 2,
                                    hint: q.hint || '',
                                    linkedLearningGoal: q.linkedLearningGoal || '',
                                    explanation: q.explanation || '',
                                    imageLink: q.imageLink || '',
                                    type: q.type || 'Multiple Choice'
                                  }));
                                  setDraftQuestions(formatted);
                                  setSaveStatus('🎉 Loaded Animals (Spring 1) Year 1 questions!');
                                  setTimeout(() => setSaveStatus(''), 4000);
                                }
                              }}
                              className="px-2 py-1 bg-amber-100 hover:bg-amber-200 border-2 border-slate-900 rounded-lg text-[9px] font-black uppercase cursor-pointer transition-all hover:translate-y-[-1px] shadow-brutal-sm text-slate-900"
                            >
                              Year 1 Spr 1 Animals
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            placeholder="Paste your copied tabular data rows here... For example:
1  Is a 'spoon' the name...  Multiple Choice  A) Object; B) Material  Object  Distinguish between...  Remember, a spoon is..."
                            onChange={(e) => {
                              const pasted = e.target.value;
                              if (pasted.trim()) {
                                handleBulkPaste(pasted);
                                e.target.value = ''; // Reset input after pasting
                              }
                            }}
                            className="w-full p-2 text-xs font-mono border-2 border-slate-900 rounded-xl bg-white text-slate-805 placeholder-stone-400 focus:outline-none text-slate-900"
                          />
                          <p className="text-[10px] text-stone-400 font-bold select-none leading-relaxed">
                            💡 <strong className="text-slate-600">HOW TO USE:</strong> Copy table rows directly from your PDF, Word, or Excel document. Press <kbd className="px-1.5 py-0.5 border border-stone-300 rounded font-mono text-[9px] bg-white">Ctrl+V</kbd> (or <kbd className="px-1.5 py-0.5 border border-stone-300 rounded font-mono text-[9px] bg-white">Cmd+V</kbd>) into this box. The column headers, tabs, spaces, options, answers, goals, and explanations will be automatically processed, and your table grid below will update instantly!
                          </p>
                        </div>
                      </div>

                      {/* Question spreadsheet grid */}
                      <div className="overflow-x-auto border-3 border-slate-900 rounded-2xl bg-white">
                        <table className="w-full text-left border-collapse" style={{ minWidth: '950px' }}>
                          <thead>
                            <tr className="bg-slate-100 border-b-3 border-slate-900 text-slate-700 text-xs font-black uppercase select-none">
                              <th className="p-2 w-12 text-center">No.</th>
                              <th className="p-2 w-1/4">Question Prompt</th>
                              <th className="p-2 w-32">Type</th>
                              <th className="p-2 w-1/4">Choices / Options</th>
                              <th className="p-2 w-36">Correct Answer</th>
                              {selectedAssessmentSubject === 'maths' ? (
                                <>
                                  <th className="p-2 w-44">Topic</th>
                                  <th className="p-2 w-44">Learning Goal</th>
                                </>
                              ) : isMathsOrEnglish ? (
                                <th className="p-2 w-40">Topic / Area</th>
                              ) : (
                                <>
                                  <th className="p-2 w-40">Goal / Objective</th>
                                  <th className="p-2 w-40">Explanation</th>
                                  <th className="p-2 w-40">Google Drive Image</th>
                                </>
                              )}
                              <th className="p-2 w-12 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y-2 divide-slate-100">
                            {draftQuestions.map((q, idx) => {
                              const previewUrl = q.imageLink ? parseGoogleDriveLink(q.imageLink) : '';
                              return (
                                <tr key={q.id} className="align-top hover:bg-slate-50 transition-colors">
                                  <td className="p-2 text-center text-xs font-black text-slate-500 pt-4">
                                    {idx + 1}
                                  </td>
                                  <td className="p-2">
                                    <textarea
                                      value={q.text}
                                      onChange={(e) => handleUpdateDraftQuestion(idx, 'text', e.target.value)}
                                      rows={2}
                                      placeholder="Type question content..."
                                      className="w-full p-1.5 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white resize-none text-slate-800"
                                     />
                                  </td>
                                  <td className="p-2">
                                    <select
                                      value={q.type || 'Multiple Choice'}
                                      onChange={(e) => handleUpdateDraftQuestion(idx, 'type', e.target.value)}
                                      className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                    >
                                      <option value="Multiple Choice">Multiple Choice</option>
                                      <option value="True/False">True/False</option>
                                      <option value="Checkboxes">Checkboxes</option>
                                      <option value="Smallest/Largest">Smallest/Largest (Ordering)</option>
                                      <option value="Ranking">Ranking (Order)</option>
                                      <option value="Matching Pairs">Matching Pairs</option>
                                      <option value="Pairs">Pairs (Matching Lines)</option>
                                      <option value="Sorting">Sorting (Two Columns)</option>
                                      <option value="Comparison Symbols">Comparison Symbols (&lt;, =, &gt;)</option>
                                      <option value="Number Input">Number Input</option>
                                      <option value="Unit Selection">Unit Selection</option>
                                      <option value="Dropdown">Missing Word Dropdown</option>
                                      <option value="NumberLine">Number Line / Scale Target</option>
                                      <option value="FillBlank">Fill-in-the-Blank</option>
                                    </select>
                                  </td>
                                  <td className="p-2">
                                    {q.type === 'True/False' ? (
                                      <span className="text-stone-400 font-bold text-xs select-none">Fixed: [True, False]</span>
                                    ) : q.type === 'Comparison Symbols' ? (
                                      <span className="text-stone-400 font-bold text-xs select-none">Fixed: [&lt;, =, &gt;]</span>
                                    ) : q.type === 'Number Input' ? (
                                      <span className="text-stone-400 font-bold text-[10px] select-none block leading-tight">Direct numeric input. Enter expected number in Answer Key.</span>
                                    ) : q.type === 'Pairs' || q.type === 'Matching Pairs' ? (
                                      <span className="text-stone-400 font-bold text-[10px] select-none block leading-tight">Matched Pairs are set in the Answer Key column. No option list needed here.</span>
                                    ) : q.type === 'Sorting' ? (
                                      <span className="text-stone-400 font-bold text-[10px] select-none block leading-tight">Sorting columns & categories are defined in the Answer Key column. No option list needed here.</span>
                                    ) : q.type === 'Dropdown' ? (
                                      <span className="text-stone-400 font-bold text-[10px] select-none block leading-tight">Type options in brackets inside Question Text, e.g. [OptionA/OptionB/OptionC]. Separated by slashes.</span>
                                    ) : q.type === 'NumberLine' ? (
                                      <div className="flex flex-col gap-1.5 min-w-[200px]">
                                        <input
                                          type="text"
                                          value={q.options.join(', ')}
                                          onChange={(e) => handleUpdateDraftQuestion(idx, 'options', e.target.value.split(',').map(s => s.trim()))}
                                          placeholder="Min, Max, Step (e.g. 0, 100, 10)"
                                          className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                        />
                                        <span className="text-[9px] text-slate-400 font-bold leading-none">Format: Min, Max, Step</span>
                                      </div>
                                    ) : q.type === 'FillBlank' ? (
                                      <span className="text-stone-400 font-bold text-[10px] select-none block leading-tight">To place a blank in-line with text, add [blank] into your Question Text. Otherwise, a standard text input will be shown.</span>
                                    ) : q.type === 'Ranking' || q.type === 'Smallest/Largest' ? (
                                      <div className="flex flex-col gap-1.5 min-w-[200px]">
                                        <input
                                          type="text"
                                          value={q.options.join(', ')}
                                          onChange={(e) => handleUpdateDraftQuestion(idx, 'options', e.target.value.split(',').map(s => s.trim()))}
                                          placeholder="Smallest, Medium, Large, Extra Large"
                                          className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                        />
                                        <div className="flex items-center gap-1 select-none flex-wrap">
                                          {q.options.map((opt, optIdx) => (
                                            <div
                                              key={optIdx}
                                              className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-[9px] font-black rounded flex items-center gap-0.5"
                                            >
                                              <span className="truncate max-w-[50px]">{opt}</span>
                                              <div className="flex gap-0.5">
                                                <button
                                                  type="button"
                                                  disabled={optIdx === 0}
                                                  onClick={() => {
                                                    const newOpts = [...q.options];
                                                    [newOpts[optIdx], newOpts[optIdx - 1]] = [newOpts[optIdx - 1], newOpts[optIdx]];
                                                    handleUpdateDraftQuestion(idx, 'options', newOpts);
                                                  }}
                                                  className="hover:bg-slate-200 px-0.5 rounded text-[8px] font-black"
                                                >
                                                  ◀
                                                </button>
                                                <button
                                                  type="button"
                                                  disabled={optIdx === q.options.length - 1}
                                                  onClick={() => {
                                                    const newOpts = [...q.options];
                                                    [newOpts[optIdx], newOpts[optIdx + 1]] = [newOpts[optIdx + 1], newOpts[optIdx]];
                                                    handleUpdateDraftQuestion(idx, 'options', newOpts);
                                                  }}
                                                  className="hover:bg-slate-200 px-0.5 rounded text-[8px] font-black"
                                                >
                                                  ▶
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <input
                                        type="text"
                                        value={q.options.join(', ')}
                                        onChange={(e) => handleUpdateDraftQuestion(idx, 'options', e.target.value.split(',').map(s => s.trim()))}
                                        placeholder="Option A, Option B, ..."
                                        className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                      />
                                    )}
                                  </td>
                                  <td className="p-2">
                                    {q.type === 'True/False' ? (
                                      <select
                                        value={q.correctAnswer}
                                        onChange={(e) => handleUpdateDraftQuestion(idx, 'correctAnswer', e.target.value)}
                                        className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-850"
                                      >
                                        <option value="True">True</option>
                                        <option value="False">False</option>
                                      </select>
                                    ) : q.type === 'Comparison Symbols' ? (
                                      <select
                                        value={q.correctAnswer}
                                        onChange={(e) => handleUpdateDraftQuestion(idx, 'correctAnswer', e.target.value)}
                                        className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-850"
                                      >
                                        <option value="<">&lt; (Less than)</option>
                                        <option value="=">= (Equal to)</option>
                                        <option value=">">&gt; (Greater than)</option>
                                      </select>
                                    ) : q.type === 'Number Input' ? (
                                      <div className="flex flex-col gap-1 min-w-[150px]">
                                        <input
                                          type="text"
                                          value={q.correctAnswer}
                                          onChange={(e) => handleUpdateDraftQuestion(idx, 'correctAnswer', e.target.value)}
                                          placeholder="e.g. 42 or 3.5"
                                          className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                        />
                                        <span className="text-[9px] text-slate-400 font-bold leading-tight">Expected number answer</span>
                                      </div>
                                    ) : q.type === 'Checkboxes' ? (
                                      <input
                                        type="text"
                                        value={q.correctAnswer}
                                        onChange={(e) => handleUpdateDraftQuestion(idx, 'correctAnswer', e.target.value)}
                                        placeholder="e.g. Option A, Option C"
                                        className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                      />
                                    ) : q.type === 'Ranking' || q.type === 'Smallest/Largest' ? (
                                      <div className="flex flex-col gap-1">
                                        <input
                                          type="text"
                                          value={q.correctAnswer}
                                          onChange={(e) => handleUpdateDraftQuestion(idx, 'correctAnswer', e.target.value)}
                                          placeholder="Smallest, Medium, Large, Extra Large"
                                          className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateDraftQuestion(idx, 'correctAnswer', q.options.join(', '))}
                                          className="text-[9px] bg-slate-900 text-white font-black px-1.5 py-0.5 rounded border border-slate-950 uppercase tracking-tight text-center cursor-pointer hover:bg-slate-800"
                                        >
                                          Set Current Order as Correct
                                        </button>
                                      </div>
                                    ) : q.type === 'Pairs' || q.type === 'Matching Pairs' ? (
                                      <div className="flex flex-col gap-1 min-w-[200px]">
                                        <input
                                          type="text"
                                          value={q.correctAnswer}
                                          onChange={(e) => handleUpdateDraftQuestion(idx, 'correctAnswer', e.target.value)}
                                          placeholder="Cat = Meow, Dog = Woof"
                                          className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                        />
                                        <span className="text-[9px] text-slate-400 font-bold leading-tight">Matching pairs Left = Right, separated by commas</span>
                                      </div>
                                    ) : q.type === 'Sorting' ? (
                                      <div className="flex flex-col gap-1 min-w-[200px]">
                                        <input
                                          type="text"
                                          value={q.correctAnswer}
                                          onChange={(e) => handleUpdateDraftQuestion(idx, 'correctAnswer', e.target.value)}
                                          placeholder="Mammals = Cat, Dog | Birds = Robin, Eagle"
                                          className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                        />
                                        <span className="text-[9px] text-slate-400 font-bold leading-tight">Use '=' for categories and '|' as column separators</span>
                                      </div>
                                    ) : q.type === 'Dropdown' ? (
                                      <div className="flex flex-col gap-1 min-w-[150px]">
                                        <input
                                          type="text"
                                          value={q.correctAnswer}
                                          onChange={(e) => handleUpdateDraftQuestion(idx, 'correctAnswer', e.target.value)}
                                          placeholder="WordA, WordB"
                                          className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                        />
                                        <span className="text-[9px] text-slate-400 font-bold leading-tight">Dropdown answers, separated by commas</span>
                                      </div>
                                    ) : q.type === 'NumberLine' ? (
                                      <div className="flex flex-col gap-1 min-w-[150px]">
                                        <input
                                          type="text"
                                          value={q.correctAnswer}
                                          onChange={(e) => handleUpdateDraftQuestion(idx, 'correctAnswer', e.target.value)}
                                          placeholder="e.g. 45"
                                          className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                        />
                                        <span className="text-[9px] text-slate-400 font-bold leading-tight">Location number of target arrow</span>
                                      </div>
                                    ) : q.type === 'FillBlank' ? (
                                      <div className="flex flex-col gap-1 min-w-[150px]">
                                        <input
                                          type="text"
                                          value={q.correctAnswer}
                                          onChange={(e) => handleUpdateDraftQuestion(idx, 'correctAnswer', e.target.value)}
                                          placeholder="Missing word or number"
                                          className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                        />
                                        <span className="text-[9px] text-slate-400 font-bold leading-tight">Correct word. For multiple blanks, separate with commas</span>
                                      </div>
                                    ) : (
                                      <input
                                        type="text"
                                        value={q.correctAnswer}
                                        onChange={(e) => handleUpdateDraftQuestion(idx, 'correctAnswer', e.target.value)}
                                        placeholder="Match exactly"
                                        className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                      />
                                    )}
                                  </td>
                                  {selectedAssessmentSubject === 'maths' ? (
                                    <>
                                      <td className="p-2">
                                        {(() => {
                                          const { topic, learningGoal } = parseQuestionGoal(q.linkedLearningGoal || '');
                                          return (
                                            <select
                                              value={topic}
                                              onChange={(e) => {
                                                const newTopic = e.target.value;
                                                const combined = newTopic ? `${newTopic} : ${learningGoal}` : learningGoal;
                                                handleUpdateDraftQuestion(idx, 'linkedLearningGoal', combined);
                                              }}
                                              className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                            >
                                              <option value="">-- Select Topic --</option>
                                              {MATHS_TOPICS.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                              ))}
                                            </select>
                                          );
                                        })()}
                                      </td>
                                      <td className="p-2">
                                        {(() => {
                                          const { topic, learningGoal } = parseQuestionGoal(q.linkedLearningGoal || '');
                                          return (
                                            <textarea
                                              value={learningGoal}
                                              onChange={(e) => {
                                                const newLearningGoal = e.target.value;
                                                const combined = topic ? `${topic} : ${newLearningGoal}` : newLearningGoal;
                                                handleUpdateDraftQuestion(idx, 'linkedLearningGoal', combined);
                                              }}
                                              rows={2}
                                              placeholder="Type learning goal..."
                                              className="w-full p-1.5 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white resize-none text-slate-800"
                                            />
                                          );
                                        })()}
                                      </td>
                                    </>
                                  ) : (
                                    <td className="p-2">
                                      <input
                                        type="text"
                                        value={q.linkedLearningGoal || ''}
                                        onChange={(e) => handleUpdateDraftQuestion(idx, 'linkedLearningGoal', e.target.value)}
                                        placeholder={isMathsOrEnglish ? "Topic/Area (e.g. Fractions)" : "Learning target objective"}
                                        className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                      />
                                    </td>
                                  )}
                                  {!isMathsOrEnglish && (
                                    <>
                                      <td className="p-2">
                                        <input
                                          type="text"
                                          value={q.explanation || ''}
                                          onChange={(e) => handleUpdateDraftQuestion(idx, 'explanation', e.target.value)}
                                          placeholder="Explanation/Reasoning"
                                          className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                        />
                                      </td>
                                      <td className="p-2">
                                        <div className="space-y-1">
                                          <input
                                            type="text"
                                            value={q.imageLink || ''}
                                            onChange={(e) => handleUpdateDraftQuestion(idx, 'imageLink', e.target.value)}
                                            placeholder="Paste Drive Link..."
                                            className="w-full p-1 text-xs font-bold border-2 border-slate-200 focus:border-slate-900 rounded-lg bg-white text-slate-800"
                                          />
                                          {previewUrl && (
                                            <div className="w-10 h-10 border border-stone-200 rounded-lg bg-stone-50 overflow-hidden flex items-center justify-center select-none">
                                              <img
                                                src={previewUrl}
                                                alt="Preview"
                                                referrerPolicy="no-referrer"
                                                className="max-w-full max-h-full object-contain"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </td>
                                    </>
                                  )}
                                  <td className="p-2 text-center pt-3">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setDraftQuestions(draftQuestions.filter((_, qIdx) => qIdx !== idx));
                                      }}
                                      className="w-7 h-7 text-red-650 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 flex items-center justify-center cursor-pointer select-none"
                                      title="Delete Row"
                                    >
                                      🗑️
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Action Triggers */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 select-none">
                        <button
                          type="button"
                          onClick={() => {
                            const newQ: Question = {
                              id: `q-${Date.now()}-${draftQuestions.length + 1}`,
                              text: '',
                              options: ['Option A', 'Option B', 'Option C', 'Option D'],
                              correctAnswer: 'Option A',
                              marks: 2,
                              hint: '',
                              linkedLearningGoal: '',
                              explanation: '',
                              imageLink: '',
                              type: 'Multiple Choice'
                            };
                            setDraftQuestions([...draftQuestions, newQ]);
                          }}
                          className="px-4 py-2 border-2 border-dashed border-slate-900 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1 cursor-pointer"
                        >
                          ➕ Add Question Row
                        </button>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          {saveStatus && (
                            <span className="text-xs font-black text-slate-700 animate-pulse">
                              {saveStatus}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (!selectedAssessmentYear || !selectedAssessmentSubject || !selectedAssessmentTerm) return;
                              let finalQuestions = draftQuestions.filter(q => q.text.trim() !== '');
                              if (finalQuestions.length === 0) {
                                setSaveStatus('⚠️ Please write some question text before saving.');
                                return;
                              }

                              // Clean up options and correct answers for each question
                              finalQuestions = finalQuestions.map((q) => {
                                const cleanedOptions = (q.options || []).map(opt => opt.trim()).filter(Boolean);
                                let cleanedCorrect = q.correctAnswer || '';
                                if (q.type === 'Ranking') {
                                  cleanedCorrect = cleanedCorrect
                                    .split(',')
                                    .map(s => s.trim())
                                    .filter(Boolean)
                                    .join(', ');
                                } else {
                                  cleanedCorrect = cleanedCorrect.trim();
                                }
                                return {
                                  ...q,
                                  options: cleanedOptions,
                                  correctAnswer: cleanedCorrect,
                                };
                              });

                              let testId = matchedTest?.id;
                              let testTitle = draftTitle;

                              if (!testId) {
                                if (selectedAssessmentSubject === 'reading' || selectedAssessmentSubject === 'spag') {
                                  testId = `test-${selectedAssessmentYear}-${selectedAssessmentSubject}-${selectedAssessmentTerm.toLowerCase().replace(/\s+/g, '-')}`;
                                  testTitle = testTitle || `Year ${selectedAssessmentYear} ${selectedAssessmentSubject.toUpperCase()} ${selectedAssessmentTerm}`;
                                } else if (selectedAssessmentSubject === 'maths') {
                                  testId = `test-${selectedAssessmentYear}-maths-${selectedAssessmentTerm.toLowerCase()}-${selectedAssessmentFocus.toLowerCase().replace(/\s+/g, '-')}`;
                                  testTitle = testTitle || `Year ${selectedAssessmentYear} Maths ${selectedAssessmentTerm} ${selectedAssessmentFocus}`;
                                } else if (selectedAssessmentSubject === 'science' || selectedAssessmentSubject === 'geography' || selectedAssessmentSubject === 'history') {
                                  testId = `test-${selectedAssessmentYear}-${selectedAssessmentSubject}-${selectedAssessmentTerm.toLowerCase().replace(/\s+/g, '-')}-${selectedAssessmentFocus.toLowerCase().replace(/\s+/g, '-')}`;
                                  testTitle = testTitle || `Year ${selectedAssessmentYear} ${selectedAssessmentSubject.charAt(0).toUpperCase() + selectedAssessmentSubject.slice(1)} ${selectedAssessmentTerm} (${selectedAssessmentFocus})`;
                                } else {
                                  testId = `test-${selectedAssessmentYear}-${selectedAssessmentSubject}-${selectedAssessmentTerm.toLowerCase().replace(/\s+/g, '-')}`;
                                  testTitle = testTitle || `Year ${selectedAssessmentYear} ${selectedAssessmentTerm} ${selectedAssessmentSubject.toUpperCase()} Assessment`;
                                }
                              }

                              const finalTest: Test = {
                                id: testId,
                                title: testTitle,
                                subject: selectedAssessmentSubject,
                                yearGroup: selectedAssessmentYear,
                                timeLimitSeconds: draftTimeLimit,
                                questions: finalQuestions,
                                active: matchedTest ? matchedTest.active : true,
                                createdByClass: dbUser.class || '',
                                createdByTeacher: dbUser.username,
                              };

                              if (onSaveTest) {
                                onSaveTest(finalTest);
                              }
                              saveDbTest(finalTest).then(() => {
                                console.log('Assessment successfully saved to Firestore:', finalTest.id);
                              }).catch((err) => {
                                console.error('Failed to save assessment to Firestore:', err);
                              });
                              localStorage.removeItem('dersingham_assessment_draft');
                              setSavedDraft(null);
                              setLastAutoSaved('');
                              setSaveStatus('🎉 Saved successfully to Dersingham Gateway & Cloud Database!');
                              setTimeout(() => setSaveStatus(''), 4000);
                            }}
                            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white border-2 border-slate-900 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm hover:translate-y-[-1px] cursor-pointer"
                          >
                            💾 Save Assessment
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeAdminTab === 'pupil-assessments' && (
              <motion.div
                key="pupil-assessments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-left"
              >
                <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal-sm">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Admin Pupil Assessments 📖</h2>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">
                    Master record of all completed assessment sheets for every student in the school.
                  </p>

                  {/* Filtration Toolbars & Search Panel */}
                  <div className="bg-slate-50 border-3 border-slate-900 rounded-2xl p-5 mb-6 flex flex-col gap-4">
                    {/* Level 1: Search Bar & Subject Filter */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      {/* Search label input */}
                      <div className="w-full md:flex-1 relative flex items-center">
                        <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Search student names, usernames or tests..."
                          value={adminSearchTerm}
                          onChange={(e) => setAdminSearchTerm(e.target.value)}
                          className="w-full bg-white border-2 border-slate-900 rounded-xl py-2.5 pl-9 pr-4 font-black text-xs select-text focus:outline-none focus:bg-slate-50 text-slate-805"
                        />
                      </div>

                      {/* Filters Subject */}
                      <div className="w-full md:w-auto flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase whitespace-nowrap">Subject:</span>
                        <select
                          value={adminFilterSubject}
                          onChange={(e) => setAdminFilterSubject(e.target.value)}
                          className="w-full md:w-auto py-1.5 px-3.5 bg-white border-2 border-slate-900 rounded-xl font-black text-xs focus:ring-0 cursor-pointer text-slate-850 uppercase tracking-tight"
                        >
                          <option value="all">All Subjects</option>
                          <option value="maths">Maths 📐</option>
                          <option value="reading">Reading 📖</option>
                          <option value="spag">Grammar (SPAG) ✒️</option>
                          <option value="science">Science 🧪</option>
                          <option value="history">History 🏰</option>
                          <option value="geography">Geography 🌍</option>
                          <option value="computing">Computing 💻</option>
                          <option value="art">Art 🎨</option>
                          <option value="dt">DT 🛠️</option>
                          <option value="music">Music 🎵</option>
                          <option value="pshe">PSHE 🤝</option>
                          <option value="re">RE 🕊️</option>
                          <option value="pe">PE 🏃</option>
                        </select>
                      </div>
                    </div>

                    {/* Level 2: Year & Class Filters */}
                    <div className="flex flex-wrap gap-4 items-center border-t-2 border-slate-200 pt-4">
                      {/* Filters Year */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase whitespace-nowrap">Year group:</span>
                        <select
                          value={adminFilterYear}
                          onChange={(e) => setAdminFilterYear(e.target.value)}
                          className="py-1.5 px-3.5 bg-white border-2 border-slate-900 rounded-xl font-black text-xs focus:ring-0 cursor-pointer text-slate-850 uppercase tracking-tight"
                        >
                          <option value="all">All Years</option>
                          <option value="nursery">Nursery 🌱</option>
                          <option value="reception">Reception 👑</option>
                          {[1, 2, 3, 4, 5, 6].map((yr) => (
                            <option key={yr} value={yr}>
                              Year {yr}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Filters Class */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase whitespace-nowrap">Class assigned:</span>
                        <select
                          value={adminFilterClass}
                          onChange={(e) => setAdminFilterClass(e.target.value)}
                          className="py-1.5 px-3.5 bg-white border-2 border-slate-900 rounded-xl font-black text-xs focus:ring-0 cursor-pointer text-slate-850 uppercase tracking-tight"
                        >
                          <option value="all">All Classes</option>
                          {adminAvailableClasses.map((cls) => (
                            <option key={cls} value={cls}>
                              {cls.replace(/^(class\s+)/i, '')}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Bulk Delete Button */}
                      <button
                        onClick={() => setShowBulkDeleteConfirm(true)}
                        disabled={adminFilteredRecords.length === 0 || isDeletingBulk}
                        className={`ml-auto px-4 py-2 text-white font-black text-xs uppercase rounded-xl border-2 border-slate-900 shadow-brutal-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                          adminFilteredRecords.length === 0 || isDeletingBulk
                            ? 'bg-rose-300 text-rose-100 cursor-not-allowed opacity-60'
                            : 'bg-red-600 hover:bg-red-700 hover:translate-y-[-1px] active:translate-y-[0px]'
                        }`}
                        title="Delete only the assessments currently matching active filters"
                      >
                        {isDeletingBulk ? (
                          <>
                            <span className="animate-spin text-sm">⏳</span> Deleting...
                          </>
                        ) : (
                          <>
                            <span>🗑️</span> Delete Filtered ({adminFilteredRecords.length})
                          </>
                        )}
                      </button>
                    </div>

                    {/* Custom Bulk Delete Confirmation Modal Popup */}
                    {showBulkDeleteConfirm && (
                      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white border-4 border-slate-900 rounded-2xl max-w-md w-full p-6 shadow-brutal-lg relative animate-in zoom-in-95 duration-150 text-left">
                          <button
                            onClick={() => setShowBulkDeleteConfirm(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-black text-lg p-1.5 rounded-lg border-2 border-transparent hover:border-slate-900 hover:bg-slate-100 transition-all"
                            aria-label="Close dialog"
                          >
                            ✕
                          </button>
                          
                          <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl p-2 bg-red-100 border-2 border-red-900 rounded-2xl">⚠️</span>
                            <div>
                              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Confirm Bulk Delete</h3>
                              <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Permanent Database Action</p>
                            </div>
                          </div>

                          <p className="text-xs font-bold text-slate-600 leading-relaxed mb-4">
                            Are you sure you want to permanently <span className="text-red-600 font-extrabold underline decoration-2">DELETE ALL {adminFilteredRecords.length}</span> assessments matching your active filters?
                          </p>

                          {/* Active Filters Summary Box */}
                          <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-3 mb-4 space-y-2">
                            <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Active Filters Applied:</div>
                            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                              <div>
                                <span className="text-slate-400 block text-[9px] font-black uppercase">Year Group</span>
                                <span className="text-slate-900">{adminFilterYear === 'all' ? 'All Year Groups' : (adminFilterYear === 'nursery' ? 'Nursery' : adminFilterYear === 'reception' ? 'Reception' : `Year ${adminFilterYear}`)}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[9px] font-black uppercase">Class</span>
                                <span className="text-slate-900 uppercase">{adminFilterClass === 'all' ? 'All Classes' : adminFilterClass.replace(/^(class\s+)/i, '')}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[9px] font-black uppercase">Subject</span>
                                <span className="text-slate-900 uppercase">{adminFilterSubject === 'all' ? 'All Subjects' : adminFilterSubject}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[9px] font-black uppercase">Search Query</span>
                                <span className="text-slate-900 truncate max-w-[120px]" title={adminSearchTerm}>
                                  {adminSearchTerm.trim() !== '' ? `"${adminSearchTerm}"` : 'None'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-red-50 border-2 border-red-900 rounded-xl p-3 text-[10px] font-bold text-red-800 leading-snug mb-5">
                            💡 <strong>IMPORTANT:</strong> These student assessment histories will be permanently wiped from the Dersingham Gateway. These pupils will then be allowed to take these tests again fresh. This action cannot be reversed!
                          </div>

                          <div className="flex items-center justify-end gap-3 select-none">
                            <button
                              onClick={() => setShowBulkDeleteConfirm(false)}
                              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border-2 border-slate-900 rounded-xl shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[0px] transition-all cursor-pointer"
                            >
                              No, Cancel
                            </button>
                            <button
                              onClick={handleBulkDeleteShown}
                              disabled={isDeletingBulk}
                              className="px-4 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 border-2 border-slate-900 rounded-xl shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[0px] transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              {isDeletingBulk ? 'Deleting...' : `Yes, Delete ${adminFilteredRecords.length} Records`}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}



                    {assessmentsStatusMsg && (
                      <div className="bg-amber-50 border-2 border-slate-900 text-slate-950 p-3 rounded-xl text-xs font-black uppercase tracking-wide flex items-center gap-2 shadow-brutal-sm">
                        <span>💡</span>
                        <span>{assessmentsStatusMsg}</span>
                      </div>
                    )}
                  </div>

                  {/* Table of historic records */}
                  <div className="overflow-x-auto border-3 border-slate-900 rounded-2xl shadow-brutal-sm">
                    <table className="w-full text-left border-collapse font-sans text-xs">
                      <thead>
                        <tr className="bg-slate-900 border-b-3 border-slate-900 text-white uppercase text-[10px] font-black tracking-wider">
                          <th className="p-3">Student Name</th>
                          <th className="p-3">Class Year</th>
                          <th className="p-3">Class Assigned</th>
                          <th className="p-3">Assessment Title</th>
                          <th className="p-3">Points Scorings</th>
                          <th className="p-3">Percentage</th>
                          <th className="p-3">Minutes Taken</th>
                          <th className="p-3">Finished Date</th>
                          <th className="p-3 text-right pr-6">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-slate-150">
                        {adminFilteredRecords.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-stone-400 font-bold select-none">
                              🔍 No gradebook records matched your active admin search query/filters.
                            </td>
                          </tr>
                        ) : (
                          adminFilteredRecords.map((rec) => (
                            <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3 font-black text-slate-905 flex items-center gap-2">
                                <span className="text-sm">👩‍🎓</span>
                                <div>
                                  <span>{rec.studentName}</span>
                                  <span className="block font-mono text-[9px] text-[#4f46e5] font-black uppercase">
                                    {rec.studentUsername}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                                <span className="px-2.5 py-1 bg-white border-2 border-slate-900 rounded-lg text-[9px] font-black uppercase tracking-wide whitespace-nowrap inline-block">
                                  Year {rec.yearGroup}
                                </span>
                              </td>
                              <td className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                                <span className="px-2.5 py-1 bg-indigo-50 border-2 border-indigo-200 rounded-lg text-[9px] font-black uppercase tracking-wide text-indigo-700 whitespace-nowrap inline-block">
                                  {rec.studentClass && rec.studentClass !== 'Unassigned' ? rec.studentClass.replace(/^(class\s+)/i, '') : 'N/A'}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm shrink-0">
                                    {(() => {
                                      const sub = rec.subject.toLowerCase();
                                      if (sub === 'maths') return '📐';
                                      if (sub === 'reading') return '📖';
                                      if (sub === 'spag') return '✒️';
                                      if (sub === 'science') return '🧪';
                                      if (sub === 'history') return '🏰';
                                      if (sub === 'geography') return '🌍';
                                      if (sub === 'computing') return '💻';
                                      if (sub === 'art') return '🎨';
                                      if (sub === 'dt') return '🛠️';
                                      if (sub === 'music') return '🎵';
                                      if (sub === 'pshe') return '🤝';
                                      if (sub === 're') return '🕊️';
                                      if (sub === 'pe') return '🏃';
                                      return '📚';
                                    })()}
                                  </span>
                                  <span className="font-semibold text-slate-700 whitespace-normal break-words inline-block max-w-[250px]">
                                    {rec.testTitle}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3 font-bold font-mono text-slate-700">
                                {rec.score} pts
                              </td>
                              <td className="p-3 font-black">
                                <span
                                  className={`px-2 py-1 rounded-lg border-2 font-mono text-[11px] ${
                                    rec.percentage >= 85
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : rec.percentage >= 50
                                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                                      : 'bg-rose-50 text-rose-700 border-rose-300'
                                  }`}
                                >
                                  {rec.percentage}%
                                </span>
                              </td>
                              <td className="p-3 font-semibold font-mono text-slate-500">
                                {Math.round(rec.durationSeconds / 60)}m {rec.durationSeconds % 60}s
                              </td>
                              <td className="p-3 text-slate-400 font-bold">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                  <span>{new Date(rec.completedAt).toLocaleDateString()}</span>
                                </div>
                              </td>
                              <td className="p-3 text-right pr-6">
                                {canDeleteRecord(rec) ? (
                                  <button
                                    onClick={() => setDeletingRecord(rec)}
                                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase rounded border-2 border-slate-900 shadow-brutal-sm transition-all hover:translate-y-[-1px] active:translate-y-[0px] cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400 select-none">
                                    Read-only
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* DERSINGHAM UNIFIED CURRICULAR PERFORMANCE ANALYTICS PORTAL */}
                <div className="space-y-8 text-left">
                {/* Header segment with step filters */}
                <div className="bg-slate-50 border-3 border-slate-900 rounded-[24px] p-6 shadow-brutal-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5 select-none">
                        <FileSpreadsheet className="w-5.5 h-5.5 text-indigo-600" />
                        Dersingham Real-time Curricular Diagnostics
                      </h3>
                      <p className="text-xs font-bold text-stone-400 select-none">
                        Map-reduce analytics engine scanning active NoSQL Firestore records and student logs.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActivePrevStep(1);
                        setPrevFolder('');
                        setPrevYearGroup('all');
                        setPrevSubject('all');
                        setPrevStrand('all');
                        setPrevTerm('all');
                        setPrevTest('all');
                        setShowPreviousYearsModal(true);
                      }}
                      className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase border-2 border-slate-900 rounded-xl transition-all cursor-pointer shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[1px]"
                    >
                      📁 Previous years
                    </button>
                  </div>

                  {/* STEP 1: Select Subject */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Step 1: Select Curricular Subject Domain</span>
                    <div className="flex flex-wrap gap-2 select-none">
                      {(Object.keys(SUBJECT_LABELS) as Subject[]).map((subj) => {
                        const isSelected = analyticsSubject === subj;
                        const label = SUBJECT_LABELS[subj];
                        return (
                          <button
                            key={subj}
                            onClick={() => handleSelectAnalyticsSubject(subj)}
                            className={`px-4 py-2 border-2 border-slate-900 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[1px] select-none cursor-pointer ${
                              isSelected ? 'bg-blue-600 text-white shadow-brutal' : 'bg-white text-slate-800 hover:bg-indigo-50'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 2: Select Term / Test Option */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Step 2: Choose Term or Assessment Window</span>
                    <div className="flex flex-wrap gap-2 select-none">
                      {getAnalyticsTermOptions(analyticsSubject).map((term) => {
                        const isSelected = analyticsTerm === term;
                        return (
                          <button
                            key={term}
                            onClick={() => setAnalyticsTerm(term)}
                            className={`px-4 py-2 border-2 border-slate-900 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[1px] select-none cursor-pointer ${
                              isSelected ? 'bg-amber-400 text-slate-900 shadow-brutal' : 'bg-white text-slate-800 hover:bg-amber-50'
                            }`}
                          >
                            {term}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 3: Select Test Focus */}
                  {['science', 'geography', 'history'].includes(analyticsSubject) && analyticsTerm !== 'Overall' && (
                    <div className="space-y-2 animate-fadeIn">
                      <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Step 3: Select Test Focus</span>
                      <div className="flex flex-wrap gap-2 select-none">
                        {['Test 1 (Topic Study)', 'Test 2 (Skill Focus)'].map((foc) => {
                          const isSelected = analyticsFocus === foc;
                          return (
                            <button
                              key={foc}
                              onClick={() => setAnalyticsFocus(foc)}
                              className={`px-4 py-2 border-2 border-slate-900 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[1px] select-none cursor-pointer ${
                                isSelected ? 'bg-blue-600 text-white shadow-brutal' : 'bg-white text-slate-800 hover:bg-indigo-50'
                              }`}
                            >
                              {foc}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* COMPUTATION PIPELINE */}
                {(() => {
                  // 1. Cohort definition
                  const cohort = registeredStudents.filter((student) => {
                    const matchesYear = matchStudentYear(student.yearGroup || 4, student.class);
                    const matchesClass = teacherFilterClass === 'all' || student.class === teacherFilterClass;
                    return matchesYear && matchesClass;
                  });

                  if (cohort.length === 0) {
                    const cohortLabel = teacherYearGroup === -1 ? 'Nursery' : teacherYearGroup === -2 ? 'Reception' : teacherYearGroup !== null ? `Year ${teacherYearGroup}` : 'Year 5';
                    return (
                      <div className="bg-slate-50 border-3 border-dashed border-slate-200 rounded-2xl p-12 text-center text-stone-400 font-semibold font-sans text-xs flex flex-col items-center justify-center">
                        <Activity className="w-8 h-8 text-slate-300 mb-2" />
                        <span>No pupils found in the selected Class / {cohortLabel} cohort to analyze.</span>
                      </div>
                    );
                  }

                  // 2. Map-reduce helpers
                  const findTestById = (testId: string): Test | undefined => {
                    const found = activeTests.find(t => t.id === testId);
                    if (found) return found;

                    for (const year of Object.keys(SCIENCE_TESTS)) {
                      const yearRecords = SCIENCE_TESTS[parseInt(year)];
                      for (const term of Object.keys(yearRecords)) {
                        const option = yearRecords[term];
                        if (option.topic.id === testId) return option.topic;
                        if (option.skills.id === testId) return option.skills;
                      }
                    }

                    const templateKeys = Object.keys(PREPACKAGED_TEMPLATES);
                    for (const key of templateKeys) {
                      if (key === testId) {
                        const templ = PREPACKAGED_TEMPLATES[key];
                        return {
                          id: key,
                          title: templ.title,
                          subject: 'science',
                          yearGroup: 1,
                          timeLimitSeconds: 300,
                          questions: templ.questions.map((q, qIdx) => ({
                            id: `q-${qIdx}`,
                            text: q.text || '',
                            type: q.type || 'Multiple Choice',
                            options: q.options || [],
                            correctAnswer: q.correctAnswer || '',
                            marks: q.marks || 2,
                            linkedLearningGoal: q.linkedLearningGoal || '',
                            explanation: q.explanation || ''
                          })),
                          active: true
                        };
                      }
                    }
                    return undefined;
                  };

                  const getRecordAnswers = (rec: any, test: Test | undefined): Record<string, { chosen: string; isCorrect: boolean }> => {
                    if (rec.answers && Object.keys(rec.answers).length > 0) {
                      return rec.answers;
                    }
                    const answersMap: Record<string, { chosen: string; isCorrect: boolean }> = {};
                    if (!test) return answersMap;

                    const questions = test.questions;
                    let remainingScore = rec.score;

                    questions.forEach((q, idx) => {
                      const qId = q.id || `q-${idx}`;
                      const isCorrect = remainingScore >= q.marks;
                      if (isCorrect) {
                        remainingScore -= q.marks;
                      }
                      answersMap[qId] = {
                        chosen: isCorrect ? q.correctAnswer : 'Incorrect Answer',
                        isCorrect
                      };
                    });
                    return answersMap;
                  };

                  interface UnifiedSubmission {
                    id: string;
                    studentName: string;
                    studentUsername: string;
                    studentClass: string;
                    yearGroup: number;
                    testId: string;
                    testTitle: string;
                    subject: Subject;
                    score: number;
                    totalQuestions: number;
                    percentage: number;
                    answers: Record<string, { chosen: string; isCorrect: boolean }>;
                  }

                  const getUnifiedSubmissions = (): UnifiedSubmission[] => {
                    const list: UnifiedSubmission[] = [];

                    historicRecords.forEach((rec) => {
                      if (rec.archiveFolder) return;
                      const student = registeredStudents.find((s) => s.username === rec.studentUsername);
                      const studentClass = student?.class || 'Unassigned';
                      const test = findTestById(rec.testId);
                      const answersMap = getRecordAnswers(rec, test);

                      list.push({
                        id: rec.id,
                        studentName: rec.studentName,
                        studentUsername: rec.studentUsername,
                        studentClass,
                        yearGroup: rec.yearGroup,
                        testId: rec.testId,
                        testTitle: rec.testTitle,
                        subject: rec.subject,
                        score: rec.score,
                        totalQuestions: rec.totalQuestions,
                        percentage: rec.percentage,
                        answers: answersMap,
                      });
                    });

                    scienceSubmissions.forEach((sub) => {
                      if (sub.archiveFolder) return;
                      const assessment = scienceAssessments.find((a) => a.id === sub.assessmentId);
                      const testTitle = assessment?.title || sub.assessmentId;
                      const yearGroupNum = assessment?.yearGroup ? parseInt(assessment.yearGroup.replace(/\D/g, '')) : 5;
                      const student = registeredStudents.find((s) => s.name === sub.studentName);
                      const studentUsername = student?.username || `student-${sub.studentName.toLowerCase().replace(/\s+/g, '-')}`;

                      list.push({
                        id: sub.id,
                        studentName: sub.studentName,
                        studentUsername,
                        studentClass: sub.studentClass,
                        yearGroup: yearGroupNum,
                        testId: sub.assessmentId,
                        testTitle,
                        subject: 'science',
                        score: sub.totalScore,
                        totalQuestions: sub.maxPossibleScore,
                        percentage: sub.percentage,
                        answers: sub.answers,
                      });
                    });

                    return list;
                  };

                  const matchRecordToTerm = (sub: UnifiedSubmission, term: string) => {
                    if (term === 'Overall') return true;
                    const title = sub.testTitle.toLowerCase();
                    const t = term.toLowerCase();

                    // Prevent cross-term matching between sub-terms (e.g. Autumn 2 matching Autumn 1 / Test 1)
                    if (t.includes('1') && (title.includes('2') || title.includes('test 2') || title.includes('assessment 2'))) return false;
                    if (t.includes('2') && (title.includes('1') || title.includes('test 1') || title.includes('assessment 1'))) return false;

                    if (title.includes(t)) return true;

                    if (t === 'autumn' && (title.includes('autumn 1') || title.includes('autumn 2') || title.includes('autumn'))) return true;
                    if (t === 'spring' && (title.includes('spring 1') || title.includes('spring 2') || title.includes('spring'))) return true;
                    if (t === 'summer' && (title.includes('summer 1') || title.includes('summer 2') || title.includes('summer'))) return true;

                    return false;
                  };

                  // Filter submissions
                  const filteredUnified = getUnifiedSubmissions().filter((sub) => {
                    const matchesCohort = cohort.some((c) => c.username === sub.studentUsername);
                    if (!matchesCohort) return false;
                    if (sub.subject !== analyticsSubject) return false;
                    if (!matchRecordToTerm(sub, analyticsTerm)) return false;

                    // Step 3 focus filter for science, geography, history
                    if (['science', 'geography', 'history'].includes(analyticsSubject) && analyticsTerm !== 'Overall') {
                      const titleLower = sub.testTitle.toLowerCase();
                      const focusKeyword = analyticsFocus.toLowerCase().includes('skill') ? 'skill' : 'topic';
                      if (focusKeyword === 'skill') {
                        return titleLower.includes('skill') || titleLower.includes('scientifically') || sub.testId.endsWith('-skills');
                      } else {
                        return titleLower.includes('topic') || sub.testId.endsWith('-topic') || (!titleLower.includes('skill') && !titleLower.includes('scientifically') && !sub.testId.endsWith('-skills'));
                      }
                    }

                    return true;
                  });

                  // If Overall is selected, show blank cumulative screen per instructions
                  if (analyticsTerm === 'Overall') {
                    return (
                      <div className="bg-indigo-50 border-3 border-dashed border-indigo-200 rounded-3xl p-12 text-center text-slate-800 font-black flex flex-col items-center justify-center space-y-4 animate-fadeIn">
                        <Compass className="w-12 h-12 text-indigo-600 animate-spin" />
                        <h4 className="text-lg uppercase tracking-tight">Cumulative Subject Overview Dashboard</h4>
                        <p className="text-xs font-bold text-slate-500 max-w-md leading-relaxed">
                          Overall cumulative analytics of all tests completed so far is scheduled for integration in the next release! Please select a specific term/test option at the top for real-time gap analysis and individual pupil objectives.
                        </p>
                      </div>
                    );
                  }

                  // 3. Compute stats
                  const completedUsernames = new Set(filteredUnified.map((sub) => sub.studentUsername));
                  const missingStudents = cohort.filter((student) => !completedUsernames.has(student.username));
                  const missingCount = missingStudents.length;
                  const missingNames = missingStudents.map((s) => s.name);

                  const avgScorePercentage = filteredUnified.length > 0
                    ? Math.round(filteredUnified.reduce((sum, r) => sum + r.percentage, 0) / filteredUnified.length)
                    : 0;

                  const parseGoal = (goalStr: string) => {
                    const index = goalStr.indexOf(':');
                    if (index !== -1) {
                      const mainTopic = goalStr.substring(0, index).trim();
                      const detailGoal = goalStr.substring(index + 1).trim();
                      if (mainTopic.length > 0 && detailGoal.length > 0) {
                        return { mainTopic, detailGoal };
                      }
                    }
                    return { mainTopic: goalStr.trim(), detailGoal: goalStr.trim() };
                  };

                  const topicStats: Record<string, {
                    topic: string;
                    correct: number;
                    total: number;
                    students: Record<string, { correct: number; total: number }>;
                    details: Record<string, {
                      correct: number;
                      total: number;
                      students: Record<string, { correct: number; total: number }>;
                    }>;
                  }> = {};

                  filteredUnified.forEach((sub) => {
                    const test = findTestById(sub.testId);
                    const questions = test?.questions || [];

                    questions.forEach((q) => {
                      const goal = q.linkedLearningGoal || test?.title || 'Assessment Goal';
                      const { mainTopic, detailGoal } = parseGoal(goal);
                      const ans = sub.answers[q.id];
                      if (ans) {
                        // Initialize Main Topic
                        if (!topicStats[mainTopic]) {
                          topicStats[mainTopic] = {
                            topic: mainTopic,
                            correct: 0,
                            total: 0,
                            students: {},
                            details: {}
                          };
                        }
                        
                        // Initialize Detail Goal
                        if (!topicStats[mainTopic].details[detailGoal]) {
                          topicStats[mainTopic].details[detailGoal] = {
                            correct: 0,
                            total: 0,
                            students: {}
                          };
                        }

                        const marks = q.marks || 1;
                        
                        // Add to Main Topic stats
                        topicStats[mainTopic].total += marks;
                        if (ans.isCorrect) {
                          topicStats[mainTopic].correct += marks;
                        }

                        if (!topicStats[mainTopic].students[sub.studentName]) {
                          topicStats[mainTopic].students[sub.studentName] = { correct: 0, total: 0 };
                        }
                        topicStats[mainTopic].students[sub.studentName].total += marks;
                        if (ans.isCorrect) {
                          topicStats[mainTopic].students[sub.studentName].correct += marks;
                        }

                        // Add to Detail Goal stats
                        topicStats[mainTopic].details[detailGoal].total += marks;
                        if (ans.isCorrect) {
                          topicStats[mainTopic].details[detailGoal].correct += marks;
                        }

                        if (!topicStats[mainTopic].details[detailGoal].students[sub.studentName]) {
                          topicStats[mainTopic].details[detailGoal].students[sub.studentName] = { correct: 0, total: 0 };
                        }
                        topicStats[mainTopic].details[detailGoal].students[sub.studentName].total += marks;
                        if (ans.isCorrect) {
                          topicStats[mainTopic].details[detailGoal].students[sub.studentName].correct += marks;
                        }
                      }
                    });
                  });

                  const goalsArray = Object.keys(topicStats).map((topicName) => {
                    const stats = topicStats[topicName];
                    const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

                    const studentAlerts: { name: string; pct: number }[] = [];
                    Object.keys(stats.students).forEach((sName) => {
                      const sStats = stats.students[sName];
                      const sPct = sStats.total > 0 ? Math.round((sStats.correct / sStats.total) * 100) : 0;
                      if (sPct < 65) {
                        studentAlerts.push({ name: sName, pct: sPct });
                      }
                    });

                    // Build detailed breakdown for hover
                    const detailBreakdown = Object.keys(stats.details).map((detailName) => {
                      const dStats = stats.details[detailName];
                      const dAccuracy = dStats.total > 0 ? Math.round((dStats.correct / dStats.total) * 100) : 0;
                      return {
                        detail: detailName,
                        accuracy: dAccuracy,
                        correctCount: dStats.correct,
                        totalAnswers: dStats.total,
                      };
                    });

                    const hasSubBreakdown = Object.keys(stats.details).some(detailName => detailName !== topicName);

                    return {
                      lo: topicName,
                      accuracy,
                      correctCount: stats.correct,
                      totalAnswers: stats.total,
                      studentAlerts,
                      details: detailBreakdown,
                      hasSubBreakdown,
                    };
                  });

                  // Sort goalsArray using MATHS_TOPICS order if subject is Maths
                  if (analyticsSubject === 'maths') {
                    goalsArray.sort((a, b) => {
                      const idxA = MATHS_TOPICS.indexOf(a.lo);
                      const idxB = MATHS_TOPICS.indexOf(b.lo);
                      if (idxA === -1 && idxB === -1) return a.lo.localeCompare(b.lo);
                      if (idxA === -1) return 1;
                      if (idxB === -1) return -1;
                      return idxA - idxB;
                    });
                  }

                  // Build underperforming specific detail learning goals Alerts
                  const detailGoalsAlerts: {
                    topicName: string;
                    detailGoalName: string;
                    accuracy: number;
                    studentAlerts: { name: string; pct: number }[]
                  }[] = [];

                  Object.keys(topicStats).forEach((topicName) => {
                    const tStats = topicStats[topicName];
                    Object.keys(tStats.details).forEach((detailGoalName) => {
                      const dStats = tStats.details[detailGoalName];
                      const dAccuracy = dStats.total > 0 ? Math.round((dStats.correct / dStats.total) * 100) : 0;
                      
                      // Check if class-wide detail goal average is underperforming (< 70%)
                      if (dAccuracy < 70) {
                        const studentAlerts: { name: string; pct: number }[] = [];
                        Object.keys(dStats.students).forEach((sName) => {
                          const sStats = dStats.students[sName];
                          const sPct = sStats.total > 0 ? Math.round((sStats.correct / sStats.total) * 100) : 0;
                          if (sPct < 65) {
                            studentAlerts.push({ name: sName, pct: sPct });
                          }
                        });
                        
                        detailGoalsAlerts.push({
                          topicName,
                          detailGoalName,
                          accuracy: dAccuracy,
                          studentAlerts
                        });
                      }
                    });
                  });

                  // Sort detail alerts by parent topic then name
                  detailGoalsAlerts.sort((a, b) => {
                    const idxA = MATHS_TOPICS.indexOf(a.topicName);
                    const idxB = MATHS_TOPICS.indexOf(b.topicName);
                    if (idxA !== idxB) {
                      if (idxA === -1 && idxB === -1) return a.topicName.localeCompare(b.topicName);
                      if (idxA === -1) return 1;
                      if (idxB === -1) return -1;
                      return idxA - idxB;
                    }
                    return a.detailGoalName.localeCompare(b.detailGoalName);
                  });

                  let bestGoal = 'N/A';
                  let worstGoal = 'N/A';
                  if (goalsArray.length > 0) {
                    const sortedGoals = [...goalsArray].sort((a, b) => b.accuracy - a.accuracy);
                    bestGoal = `${sortedGoals[0].lo} (${sortedGoals[0].accuracy}%)`;
                    const worstObj = sortedGoals[sortedGoals.length - 1];
                    worstGoal = `${worstObj.lo} (${worstObj.accuracy}%)`;
                  }

                  const totalTests = filteredUnified.length;
                  const totalQuestions = filteredUnified.length > 0 ? filteredUnified[0].totalQuestions : 1;
                  const classAvgRawScore = filteredUnified.length > 0
                    ? (filteredUnified.reduce((sum, r) => sum + r.score, 0) / filteredUnified.length).toFixed(1)
                    : '0.0';

                  const getStudentLoScore = (sub: UnifiedSubmission, loName: string) => {
                    const test = findTestById(sub.testId);
                    const questions = test?.questions || [];
                    let correct = 0;
                    let total = 0;
                    questions.forEach((q) => {
                      const goal = q.linkedLearningGoal || test?.title || 'Assessment Goal';
                      const { mainTopic } = parseGoal(goal);
                      if (mainTopic === loName) {
                        const ans = sub.answers[q.id];
                        if (ans) {
                          total += q.marks || 1;
                          if (ans.isCorrect) correct += q.marks || 1;
                        }
                      }
                    });
                    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
                    return { pct, correct, total };
                  };

                  return (
                    <div className="space-y-8 animate-fadeIn">
                      {/* STATS TILES */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {/* Tile 1: Missing Assessments */}
                        <div className="relative group bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal flex flex-col justify-between cursor-help hover:translate-y-[-2px] transition-all select-none">
                          <div>
                            <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Missing Assessments ⚠️</span>
                            <span className="block font-sans text-4xl font-black text-slate-900 mt-2">
                              {missingCount}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-extrabold uppercase mt-2">
                            {missingCount === 0 ? 'All completed 🎉' : 'Hover to see pupils'}
                          </span>

                          {/* Hover Tooltip */}
                          {missingNames.length > 0 && (
                            <div className="absolute z-50 hidden group-hover:block bg-slate-950 text-white text-[11px] font-bold p-3 rounded-xl border-2 border-slate-900 shadow-brutal w-64 -bottom-2 translate-y-full left-1/2 -translate-x-1/2 animate-fadeIn select-none">
                              <p className="font-black text-amber-400 uppercase border-b border-slate-800 pb-1 mb-1.5">Missing Pupils:</p>
                              <div className="max-h-32 overflow-y-auto space-y-1">
                                {missingNames.map((name) => (
                                  <div key={name} className="flex items-center gap-1.5">
                                    <span className="text-amber-500">•</span>
                                    <span>{name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Tile 2: Class Average Score */}
                        <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal flex flex-col justify-between hover:translate-y-[-2px] transition-all select-none">
                          <div>
                            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Class Average Score 📊</span>
                            <div className="flex items-baseline gap-1 mt-2">
                              <span className="font-sans text-4xl font-black text-slate-900">{classAvgRawScore}</span>
                              <span className="text-slate-400 font-black text-lg">/ {totalQuestions}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-stone-400 font-extrabold uppercase mt-2">Mean raw score out of {totalQuestions}</span>
                        </div>

                        {/* Tile 3: Worst Learning Goal */}
                        <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal flex flex-col justify-between hover:translate-y-[-2px] transition-all select-none">
                          <div>
                            <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider">Worst Learning Goal 📉</span>
                            <span className="block font-sans text-[11px] font-black text-slate-800 mt-2 line-clamp-2 min-h-[2.5rem] leading-snug">
                              {worstGoal}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-extrabold uppercase mt-2">Lowest accuracy objective</span>
                        </div>

                        {/* Tile 4: Average Score Percentage */}
                        <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal flex flex-col justify-between hover:translate-y-[-2px] transition-all select-none">
                          <div>
                            <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Average Class Score 📊</span>
                            <span className="block font-sans text-4xl font-black text-slate-900 mt-2">
                              {avgScorePercentage}%
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-extrabold uppercase mt-2">Overall average percentage</span>
                        </div>
                      </div>

                      {/* DIAGNOSTICS & AUTOMATED INTERVENTION SECTION (NO HEADERS, ALL FLOWING DIRECTLY) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Objectives Mastery Bars Card */}
                        <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal space-y-4">
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Objective Mastery Progress</h3>
                          
                          <div className="space-y-4">
                            {goalsArray.length === 0 ? (
                              <div className="p-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-2xl bg-neutral-50 select-none">
                                No learning objectives recorded for this window yet.
                              </div>
                            ) : (
                              goalsArray.map((stat) => {
                                let progressColor = 'bg-rose-500';
                                let textColor = 'text-rose-600';
                                let bgColor = 'bg-rose-50/30 border-rose-100';
                                if (stat.accuracy >= 70) {
                                  progressColor = 'bg-emerald-500';
                                  textColor = 'text-emerald-600';
                                  bgColor = 'bg-emerald-50/30 border-emerald-100';
                                } else if (stat.accuracy >= 45) {
                                  progressColor = 'bg-amber-400';
                                  textColor = 'text-amber-600';
                                  bgColor = 'bg-amber-50/30 border-amber-100';
                                }

                                return (
                                  <div key={stat.lo} className={`relative group p-4 border-2 border-slate-900 rounded-xl space-y-3 ${bgColor} shadow-brutal-sm hover:shadow-brutal transition-all cursor-help animate-fadeIn`}>
                                    <div className="flex flex-col gap-1.5 text-left">
                                      <div className="flex justify-between items-start gap-1.5">
                                        <span className="text-xs font-black text-slate-800 leading-relaxed block">
                                          🎯 {stat.lo}
                                        </span>
                                        {stat.hasSubBreakdown && (
                                          <span className="shrink-0 text-[8px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded uppercase tracking-wider select-none">
                                            🔍 Hover for Breakdown
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400">
                                        <span>Class Mastery Accuracy:</span>
                                        <span className={`${textColor} font-black font-mono`}>
                                          {stat.accuracy}% ({stat.correctCount}/{stat.totalAnswers} marks)
                                        </span>
                                      </div>
                                    </div>
                                    <div className="w-full bg-slate-100 h-4 border-2 border-slate-900 rounded-full overflow-hidden p-0.5">
                                      <div
                                        className={`${progressColor} h-full rounded-full transition-all duration-500`}
                                        style={{ width: `${stat.accuracy}%` }}
                                      ></div>
                                    </div>

                                    {/* Hover Tooltip Breakdown */}
                                    {stat.hasSubBreakdown && stat.details.length > 0 && (
                                      <div className="absolute left-1/2 -translate-x-1/2 bottom-[105%] z-50 hidden group-hover:block w-72 bg-slate-950 text-white p-4 rounded-2xl border-3 border-slate-900 shadow-brutal text-xs animate-fadeIn text-left space-y-3">
                                        <div className="border-b border-slate-800 pb-2">
                                          <p className="font-black text-amber-400 uppercase text-[10px] tracking-wider">🎯 Topic Breakdown</p>
                                          <p className="text-xs font-extrabold text-slate-200 truncate">{stat.lo}</p>
                                        </div>
                                        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                                          {stat.details.map((det) => {
                                            let dColor = 'text-rose-400';
                                            if (det.accuracy >= 70) dColor = 'text-emerald-400';
                                            else if (det.accuracy >= 45) dColor = 'text-amber-400';

                                            return (
                                              <div key={det.detail} className="space-y-1">
                                                <p className="text-[11px] font-black text-slate-100 leading-tight">📍 {det.detail}</p>
                                                <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold">
                                                  <span>Class Accuracy:</span>
                                                  <span className={`${dColor} font-black font-mono`}>{det.accuracy}% ({det.correctCount}/{det.totalAnswers} mks)</span>
                                                </div>
                                                {/* Mini progress bar */}
                                                <div className="w-full bg-slate-800 h-2 border border-slate-700 rounded-full overflow-hidden p-[1px]">
                                                  <div 
                                                    className={`h-full rounded-full ${det.accuracy >= 70 ? 'bg-emerald-500' : det.accuracy >= 45 ? 'bg-amber-400' : 'bg-rose-500'}`}
                                                    style={{ width: `${det.accuracy}%` }}
                                                  />
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Automated Intervention Warnings List */}
                        <div className="space-y-3">
                          <div className="bg-amber-50 border-3 border-slate-900 rounded-2xl p-5 shadow-brutal space-y-4">
                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5 select-none">
                              <AlertTriangle className="w-4.5 h-4.5 text-amber-500 animate-bounce" />
                              Target Attention Focus Groups
                            </h3>
                            <p className="text-[11px] font-bold text-stone-400 select-none">
                              Auto-generated intervention rosters. Lists students with less than 65% accuracy on objectives underperforming class-wide (&lt; 70%).
                            </p>

                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                              {detailGoalsAlerts.length === 0 ? (
                                <div className="p-4 bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-xl text-center animate-fadeIn select-none">
                                  <Check className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                                  <span className="text-[10px] font-black text-emerald-800 uppercase">Excellent! All specific learning goals are performing above 70%!</span>
                                </div>
                              ) : (
                                detailGoalsAlerts.map(alertGroup => (
                                  <div key={`${alertGroup.topicName}-${alertGroup.detailGoalName}`} className="p-3.5 bg-white border-2 border-slate-900 rounded-xl text-left shadow-brutal-sm animate-fadeIn">
                                    <div className="flex items-start justify-between gap-1.5">
                                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-snug">
                                        📍 {alertGroup.detailGoalName}
                                      </h4>
                                      <span className="shrink-0 text-[8px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded uppercase tracking-wider select-none">
                                        {alertGroup.topicName}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1 select-none">
                                      <span className="text-[10px] font-bold text-stone-400">Goal Accuracy:</span>
                                      <span className="px-1.5 py-0.5 bg-rose-50 border-2 border-rose-300 rounded text-[9px] font-black text-rose-700">{alertGroup.accuracy}%</span>
                                    </div>

                                    <div className="mt-2.5 border-t border-dashed border-slate-100 pt-2">
                                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Needs Intervention:</span>
                                      {alertGroup.studentAlerts.length === 0 ? (
                                        <span className="text-[10px] text-emerald-600 font-extrabold uppercase select-none">No individual pupil falls below 65%!</span>
                                      ) : (
                                        <div className="flex flex-wrap gap-1.5">
                                          {alertGroup.studentAlerts.map(alert => (
                                            <span key={alert.name} className="px-2 py-1 bg-rose-50 border-2 border-rose-300 rounded-lg text-[9px] font-black text-rose-700 uppercase flex items-center gap-1 select-none">
                                              <span>{alert.name}</span>
                                              <span className="text-rose-500">({alert.pct}%)</span>
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* INDIVIDUAL PUPIL ROSTER GRID (NO HEADERS) */}
                      <div className="bg-white border-3 border-slate-900 rounded-2xl shadow-brutal overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-slate-50 border-b-3 border-slate-900 text-left select-none text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                  <th className="p-3.5 pl-5">Pupil Name</th>
                                  <th className="p-3.5">Class Group</th>
                                  <th className="p-3.5">Raw Score</th>
                                  <th className="p-3.5">Percentage</th>
                                  <th className="p-3.5">Learning Objective Performance Breakdown</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredUnified.length === 0 ? (
                                  <tr>
                                    <td colSpan={5} className="p-8 text-center text-xs font-black text-slate-400 uppercase tracking-wider select-none">
                                      No pupil assessments recorded for this subject and term/test option yet.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredUnified.map((sub) => {
                                    let pctBg = 'bg-rose-50 text-rose-700 border-rose-300';
                                    if (sub.percentage >= 70) {
                                      pctBg = 'bg-emerald-50 text-emerald-700 border-emerald-300';
                                    } else if (sub.percentage >= 45) {
                                      pctBg = 'bg-amber-50 text-amber-700 border-amber-300';
                                    }

                                    return (
                                      <tr key={sub.id} className="border-b-2 border-slate-100 hover:bg-slate-50/50 transition-colors animate-fadeIn">
                                        <td className="p-3.5 pl-5 text-left">
                                          <span className="font-sans text-xs font-black text-slate-800 block">{sub.studentName}</span>
                                        </td>
                                        <td>
                                          <span className="px-2 py-0.5 bg-indigo-50 border-2 border-slate-900 rounded text-[9px] font-black uppercase text-indigo-600 tracking-wide select-none">
                                            {sub.studentClass ? sub.studentClass.replace(/^(class\s+)/i, '') : 'N/A'}
                                          </span>
                                        </td>
                                        <td className="p-3.5">
                                          <span className="px-2.5 py-1 bg-white border-2 border-slate-900 rounded-lg text-xs font-black text-slate-700 font-mono select-none whitespace-nowrap inline-block">
                                            {sub.score} / {sub.totalQuestions}
                                          </span>
                                        </td>
                                        <td className="p-3.5">
                                          <span className={`px-2.5 py-1.5 border-2 rounded-xl text-xs font-black font-mono select-none ${pctBg}`}>
                                            {sub.percentage}%
                                          </span>
                                        </td>
                                        <td className="p-3.5">
                                          <div className="flex flex-wrap gap-2">
                                            {goalsArray.map((loRef) => {
                                              const score = getStudentLoScore(sub, loRef.lo);
                                              let scoreColor = 'bg-rose-50 text-rose-700 border-rose-200';
                                              if (score.pct >= 70) scoreColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                                              else if (score.pct >= 45) scoreColor = 'bg-amber-50 text-amber-700 border-amber-200';

                                              return (
                                                <div
                                                  key={loRef.lo}
                                                  onMouseEnter={(e) => {
                                                    if (!loRef.hasSubBreakdown || loRef.details.length === 0) return;
                                                    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setHoveredTooltip({
                                                      studentName: sub.studentName,
                                                      lo: loRef.lo,
                                                      details: loRef.details,
                                                      x: rect.left + rect.width / 2,
                                                      y: rect.top,
                                                    });
                                                  }}
                                                  onMouseLeave={() => {
                                                    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                                                    closeTimeoutRef.current = setTimeout(() => {
                                                      setHoveredTooltip(null);
                                                    }, 400);
                                                  }}
                                                  className={`px-2 py-0.5 border-2 rounded-lg text-[9px] font-extrabold uppercase tracking-tight flex items-center gap-1.5 select-none cursor-help transition-all duration-150 hover:scale-[1.02] hover:border-slate-900 ${scoreColor}`}
                                                >
                                                  <span>{loRef.lo}: {score.pct}% ({score.correct}/{score.total})</span>
                                                  {loRef.hasSubBreakdown && <span className="text-[8px] opacity-60">🔍</span>}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Floating Tooltip to prevent any overflow/table clipping */}
                        {hoveredTooltip && (
                          <div 
                            onMouseEnter={() => {
                              if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                            }}
                            onMouseLeave={() => {
                              if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                              closeTimeoutRef.current = setTimeout(() => {
                                setHoveredTooltip(null);
                              }, 400);
                            }}
                            className="fixed w-72 bg-slate-950 text-white p-4 rounded-2xl border-3 border-slate-900 shadow-brutal text-xs animate-fadeIn text-left space-y-3 normal-case z-[9999] font-sans"
                            style={{
                              left: `${hoveredTooltip.x}px`,
                              top: `${hoveredTooltip.y - 8}px`,
                              transform: 'translate(-50%, -100%)',
                            }}
                          >
                            <div className="border-b border-slate-800 pb-2">
                              <p className="font-black text-amber-400 uppercase text-[9px] tracking-wider font-mono">🎯 Student Learning Goals</p>
                              <p className="text-xs font-black text-slate-100 truncate mt-0.5">{hoveredTooltip.studentName}</p>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Topic: {hoveredTooltip.lo}</p>
                            </div>
                            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                              {hoveredTooltip.details.map((det) => {
                                const studentGoalStats = topicStats[hoveredTooltip.lo]?.details[det.detail]?.students[hoveredTooltip.studentName];
                                const sGoalPct = studentGoalStats && studentGoalStats.total > 0
                                  ? Math.round((studentGoalStats.correct / studentGoalStats.total) * 100)
                                  : 0;
                                const sGoalCorrect = studentGoalStats?.correct || 0;
                                const sGoalTotal = studentGoalStats?.total || 0;

                                let sColor = 'text-rose-400';
                                if (sGoalPct >= 70) sColor = 'text-emerald-400';
                                else if (sGoalPct >= 45) sColor = 'text-amber-400';

                                return (
                                  <div key={det.detail} className="space-y-1">
                                    <p className="text-[11px] font-black text-slate-100 leading-tight">📍 {det.detail}</p>
                                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold">
                                      <span>Pupil Score:</span>
                                      <span className={`${sColor} font-black font-mono`}>{sGoalPct}% ({sGoalCorrect}/{sGoalTotal} marks)</span>
                                    </div>
                                    {/* Mini progress bar */}
                                    <div className="w-full bg-slate-800 h-2 border border-slate-700 rounded-full overflow-hidden p-[1px]">
                                      <div 
                                        className={`h-full rounded-full ${sGoalPct >= 70 ? 'bg-emerald-500' : sGoalPct >= 45 ? 'bg-amber-400' : 'bg-rose-500'}`}
                                        style={{ width: `${sGoalPct}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                  );
                })()}
              </div>
          </motion.div>
        )}

        {activeTab === 'subject-leader' && dbUser.leadSubject && (
          <motion.div
            key="subject-leader"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 animate-fadeIn"
          >
            <div className="space-y-8 text-left">
              {/* Leader diagnostics container */}
              <div className="bg-slate-50 border-3 border-slate-900 rounded-[24px] p-6 shadow-brutal-sm space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5 select-none">
                    <FileSpreadsheet className="w-5.5 h-5.5 text-indigo-600" />
                    Subject Leader Diagnostics: {SUBJECT_LABELS[dbUser.leadSubject as Subject] || dbUser.leadSubject} 🏆
                  </h3>
                  <p className="text-xs font-bold text-stone-400 select-none">
                    Comprehensive multi-year-group diagnostic suite scanning pupil submissions across the school.
                  </p>
                </div>

                {/* STEP 1: Select Year Group */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Step 1: Select Year Group</span>
                  <div className="flex flex-wrap gap-2 select-none">
                    {[
                      { value: -1, label: 'Nursery 🌱' },
                      { value: -2, label: 'Reception 👑' },
                      { value: 1, label: 'Year 1 🌟' },
                      { value: 2, label: 'Year 2 🌟' },
                      { value: 3, label: 'Year 3 🌟' },
                      { value: 4, label: 'Year 4 🌟' },
                      { value: 5, label: 'Year 5 🌟' },
                      { value: 6, label: 'Year 6 🌟' },
                    ].map((yrOpt) => {
                      const isSelected = leaderYearGroup === yrOpt.value;
                      return (
                        <button
                          key={yrOpt.value}
                          type="button"
                          onClick={() => {
                            setLeaderYearGroup(yrOpt.value);
                            setLeaderFilterClass('all');
                            const terms = getAnalyticsTermOptions(dbUser.leadSubject as Subject);
                            if (terms.length > 0 && !terms.includes(leaderTerm)) {
                              setLeaderTerm(terms[0]);
                            }
                          }}
                          className={`px-4 py-2 border-2 border-slate-900 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[1px] select-none cursor-pointer ${
                            isSelected ? 'bg-blue-600 text-white shadow-brutal' : 'bg-white text-slate-800 hover:bg-indigo-50'
                          }`}
                        >
                          {yrOpt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 2: Choose Term or Assessment Window */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Step 2: Choose Term or Assessment Window</span>
                  <div className="flex flex-wrap gap-2 select-none">
                    {getAnalyticsTermOptions(dbUser.leadSubject as Subject).map((term) => {
                      const isSelected = leaderTerm === term;
                      return (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setLeaderTerm(term)}
                          className={`px-4 py-2 border-2 border-slate-900 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[1px] select-none cursor-pointer ${
                            isSelected ? 'bg-amber-400 text-slate-900 shadow-brutal' : 'bg-white text-slate-800 hover:bg-amber-50'
                          }`}
                        >
                          {term}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* STEP 3: Select Test Focus */}
                {['science', 'geography', 'history'].includes(dbUser.leadSubject as Subject) && leaderTerm !== 'Overall' && (
                  <div className="space-y-2 animate-fadeIn">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Step 3: Select Test Focus</span>
                    <div className="flex flex-wrap gap-2 select-none">
                      {['Test 1 (Topic Study)', 'Test 2 (Skill Focus)'].map((foc) => {
                        const isSelected = leaderFocus === foc;
                        return (
                          <button
                            key={foc}
                            type="button"
                            onClick={() => setLeaderFocus(foc)}
                            className={`px-4 py-2 border-2 border-slate-900 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[1px] select-none cursor-pointer ${
                              isSelected ? 'bg-blue-600 text-white shadow-brutal' : 'bg-white text-slate-800 hover:bg-indigo-50'
                            }`}
                          >
                            {foc}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Refine by Class filter */}
                {(() => {
                  const leaderAvailableClasses = Array.from(
                    new Set(
                      registeredStudents
                        .filter((s) => matchSpecificYear(s.yearGroup || 0, leaderYearGroup, s.class))
                        .map((s) => s.class)
                        .filter((c): c is string => !!c && c.trim() !== '')
                    )
                  ).sort();

                  return (
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-[10px] font-black uppercase text-slate-500">Refine by Class:</span>
                      <select
                        value={leaderFilterClass}
                        onChange={(e) => setLeaderFilterClass(e.target.value)}
                        className="px-2.5 py-1 text-xs font-bold border-2 border-slate-900 rounded-lg bg-white text-slate-800 uppercase cursor-pointer"
                      >
                        <option value="all">-- All Classes --</option>
                        {leaderAvailableClasses.map((cls) => (
                          <option key={cls} value={cls}>
                            {cls.replace(/^(class\s+)/i, '')}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })()}
              </div>

              {/* Data rendering */}
              {(() => {
                const leaderSubject = dbUser.leadSubject as Subject;
                const leaderCohort = registeredStudents.filter((student) => {
                  const matchesYear = matchSpecificYear(student.yearGroup || 0, leaderYearGroup, student.class);
                  const matchesClass = leaderFilterClass === 'all' || student.class === leaderFilterClass;
                  return matchesYear && matchesClass;
                });

                if (leaderCohort.length === 0) {
                  const cohortLabel = leaderYearGroup === -1 ? 'Nursery' : leaderYearGroup === -2 ? 'Reception' : `Year ${leaderYearGroup}`;
                  return (
                    <div className="bg-slate-50 border-3 border-dashed border-slate-200 rounded-2xl p-12 text-center text-stone-400 font-semibold font-sans text-xs flex flex-col items-center justify-center">
                      <Activity className="w-8 h-8 text-slate-300 mb-2" />
                      <span>No pupils found in the selected {cohortLabel} cohort to analyze.</span>
                    </div>
                  );
                }

                // Filter submissions
                const filteredUnified = getUnifiedSubmissions().filter((sub) => {
                  const matchesCohort = leaderCohort.some((c) => c.username === sub.studentUsername);
                  if (!matchesCohort) return false;
                  if (sub.subject !== leaderSubject) return false;
                  if (!matchRecordToTerm(sub, leaderTerm)) return false;

                  if (['science', 'geography', 'history'].includes(leaderSubject) && leaderTerm !== 'Overall') {
                    const titleLower = sub.testTitle.toLowerCase();
                    const focusKeyword = leaderFocus.toLowerCase().includes('skill') ? 'skill' : 'topic';
                    if (focusKeyword === 'skill') {
                      return titleLower.includes('skill') || titleLower.includes('scientifically') || sub.testId.endsWith('-skills');
                    } else {
                      return titleLower.includes('topic') || sub.testId.endsWith('-topic') || (!titleLower.includes('skill') && !titleLower.includes('scientifically') && !sub.testId.endsWith('-skills'));
                    }
                  }
                  return true;
                });

                if (leaderTerm === 'Overall') {
                  return (
                    <div className="bg-indigo-50 border-3 border-dashed border-indigo-200 rounded-3xl p-12 text-center text-slate-800 font-black flex flex-col items-center justify-center space-y-4 animate-fadeIn">
                      <Compass className="w-12 h-12 text-indigo-600 animate-spin" />
                      <h4 className="text-lg uppercase tracking-tight">Cumulative Subject Overview Dashboard</h4>
                      <p className="text-xs font-bold text-slate-500 max-w-md leading-relaxed">
                        Overall cumulative analytics of all tests completed so far is scheduled for integration in the next release! Please select a specific term/test option at the top for real-time gap analysis and individual pupil objectives.
                      </p>
                    </div>
                  );
                }

                // Stats
                const completedUsernames = new Set(filteredUnified.map((sub) => sub.studentUsername));
                const missingStudents = leaderCohort.filter((student) => !completedUsernames.has(student.username));
                const missingCount = missingStudents.length;
                const missingNames = missingStudents.map((s) => s.name);

                const avgScorePercentage = filteredUnified.length > 0
                  ? Math.round(filteredUnified.reduce((sum, r) => sum + r.percentage, 0) / filteredUnified.length)
                  : 0;

                const topicStats: Record<string, {
                  topic: string;
                  correct: number;
                  total: number;
                  students: Record<string, { correct: number; total: number }>;
                  details: Record<string, {
                    correct: number;
                    total: number;
                    students: Record<string, { correct: number; total: number }>;
                  }>;
                }> = {};

                filteredUnified.forEach((sub) => {
                  const test = findTestById(sub.testId);
                  const questions = test?.questions || [];

                  questions.forEach((q) => {
                    const goal = q.linkedLearningGoal || test?.title || 'Assessment Goal';
                    const { mainTopic, detailGoal } = parseGoal(goal);
                    const ans = sub.answers[q.id];
                    if (ans) {
                      if (!topicStats[mainTopic]) {
                        topicStats[mainTopic] = {
                          topic: mainTopic,
                          correct: 0,
                          total: 0,
                          students: {},
                          details: {}
                        };
                      }
                      
                      if (!topicStats[mainTopic].details[detailGoal]) {
                        topicStats[mainTopic].details[detailGoal] = {
                          correct: 0,
                          total: 0,
                          students: {}
                        };
                      }

                      const marks = q.marks || 1;
                      topicStats[mainTopic].total += marks;
                      if (ans.isCorrect) {
                        topicStats[mainTopic].correct += marks;
                      }

                      if (!topicStats[mainTopic].students[sub.studentName]) {
                        topicStats[mainTopic].students[sub.studentName] = { correct: 0, total: 0 };
                      }
                      topicStats[mainTopic].students[sub.studentName].total += marks;
                      if (ans.isCorrect) {
                        topicStats[mainTopic].students[sub.studentName].correct += marks;
                      }

                      topicStats[mainTopic].details[detailGoal].total += marks;
                      if (ans.isCorrect) {
                        topicStats[mainTopic].details[detailGoal].correct += marks;
                      }

                      if (!topicStats[mainTopic].details[detailGoal].students[sub.studentName]) {
                        topicStats[mainTopic].details[detailGoal].students[sub.studentName] = { correct: 0, total: 0 };
                      }
                      topicStats[mainTopic].details[detailGoal].students[sub.studentName].total += marks;
                      if (ans.isCorrect) {
                        topicStats[mainTopic].details[detailGoal].students[sub.studentName].correct += marks;
                      }
                    }
                  });
                });

                const goalsArray = Object.keys(topicStats).map((topicName) => {
                  const stats = topicStats[topicName];
                  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

                  const studentAlerts: { name: string; pct: number }[] = [];
                  Object.keys(stats.students).forEach((sName) => {
                    const sStats = stats.students[sName];
                    const sPct = sStats.total > 0 ? Math.round((sStats.correct / sStats.total) * 100) : 0;
                    if (sPct < 65) {
                      studentAlerts.push({ name: sName, pct: sPct });
                    }
                  });

                  const detailBreakdown = Object.keys(stats.details).map((detailName) => {
                    const dStats = stats.details[detailName];
                    const dAccuracy = dStats.total > 0 ? Math.round((dStats.correct / dStats.total) * 100) : 0;
                    return {
                      detail: detailName,
                      accuracy: dAccuracy,
                      correctCount: dStats.correct,
                      totalAnswers: dStats.total,
                    };
                  });

                  const hasSubBreakdown = Object.keys(stats.details).some(detailName => detailName !== topicName);

                  return {
                    lo: topicName,
                    accuracy,
                    correctCount: stats.correct,
                    totalAnswers: stats.total,
                    studentAlerts,
                    details: detailBreakdown,
                    hasSubBreakdown,
                  };
                });

                if (leaderSubject === 'maths') {
                  goalsArray.sort((a, b) => {
                    const idxA = MATHS_TOPICS.indexOf(a.lo);
                    const idxB = MATHS_TOPICS.indexOf(b.lo);
                    if (idxA === -1 && idxB === -1) return a.lo.localeCompare(b.lo);
                    if (idxA === -1) return 1;
                    if (idxB === -1) return -1;
                    return idxA - idxB;
                  });
                }

                const detailGoalsAlerts: {
                  topicName: string;
                  detailGoalName: string;
                  accuracy: number;
                  studentAlerts: { name: string; pct: number }[]
                }[] = [];

                Object.keys(topicStats).forEach((topicName) => {
                  const tStats = topicStats[topicName];
                  Object.keys(tStats.details).forEach((detailGoalName) => {
                    const dStats = tStats.details[detailGoalName];
                    const dAccuracy = dStats.total > 0 ? Math.round((dStats.correct / dStats.total) * 100) : 0;
                    
                    if (dAccuracy < 70) {
                      const studentAlerts: { name: string; pct: number }[] = [];
                      Object.keys(dStats.students).forEach((sName) => {
                        const sStats = dStats.students[sName];
                        const sPct = sStats.total > 0 ? Math.round((sStats.correct / sStats.total) * 100) : 0;
                        if (sPct < 65) {
                          studentAlerts.push({ name: sName, pct: sPct });
                        }
                      });
                      
                      detailGoalsAlerts.push({
                        topicName,
                        detailGoalName,
                        accuracy: dAccuracy,
                        studentAlerts
                      });
                    }
                  });
                });

                detailGoalsAlerts.sort((a, b) => {
                  const idxA = MATHS_TOPICS.indexOf(a.topicName);
                  const idxB = MATHS_TOPICS.indexOf(b.topicName);
                  if (idxA !== idxB) {
                    if (idxA === -1 && idxB === -1) return a.topicName.localeCompare(b.topicName);
                    if (idxA === -1) return 1;
                    if (idxB === -1) return -1;
                    return idxA - idxB;
                  }
                  return a.detailGoalName.localeCompare(b.detailGoalName);
                });

                let bestGoal = 'N/A';
                let worstGoal = 'N/A';
                if (goalsArray.length > 0) {
                  const sortedGoals = [...goalsArray].sort((a, b) => b.accuracy - a.accuracy);
                  bestGoal = `${sortedGoals[0].lo} (${sortedGoals[0].accuracy}%)`;
                  const worstObj = sortedGoals[sortedGoals.length - 1];
                  worstGoal = `${worstObj.lo} (${worstObj.accuracy}%)`;
                }

                const totalTests = filteredUnified.length;
                const totalQuestions = filteredUnified.length > 0 ? filteredUnified[0].totalQuestions : 1;
                const classAvgRawScore = filteredUnified.length > 0
                  ? (filteredUnified.reduce((sum, r) => sum + r.score, 0) / filteredUnified.length).toFixed(1)
                  : '0.0';

                return (
                  <div className="space-y-8 animate-fadeIn">
                    {/* STATS TILES */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="relative group bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal flex flex-col justify-between cursor-help hover:translate-y-[-2px] transition-all select-none">
                        <div>
                          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Missing Assessments ⚠️</span>
                          <span className="block font-sans text-4xl font-black text-slate-900 mt-2">
                            {missingCount}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-extrabold uppercase mt-2">
                          {missingCount === 0 ? 'All completed 🎉' : 'Hover to see pupils'}
                        </span>

                        {missingNames.length > 0 && (
                          <div className="absolute z-50 hidden group-hover:block bg-slate-950 text-white text-[11px] font-bold p-3 rounded-xl border-2 border-slate-900 shadow-brutal w-64 -bottom-2 translate-y-full left-1/2 -translate-x-1/2 animate-fadeIn select-none">
                            <p className="font-black text-amber-400 uppercase border-b border-slate-800 pb-1 mb-1.5">Missing Pupils:</p>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                              {missingNames.map((name) => (
                                <div key={name} className="flex items-center gap-1.5">
                                  <span className="text-amber-500">•</span>
                                  <span>{name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal flex flex-col justify-between hover:translate-y-[-2px] transition-all select-none">
                        <div>
                          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Class Average Score 📊</span>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="font-sans text-4xl font-black text-slate-900">{classAvgRawScore}</span>
                            <span className="text-slate-400 font-black text-lg">/ {totalQuestions}</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400 font-extrabold uppercase mt-2">Mean raw score out of {totalQuestions}</span>
                      </div>

                      <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal flex flex-col justify-between hover:translate-y-[-2px] transition-all select-none">
                        <div>
                          <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider">Worst Learning Goal 📉</span>
                          <span className="block font-sans text-[11px] font-black text-slate-800 mt-2 line-clamp-2 min-h-[2.5rem] leading-snug">
                            {worstGoal}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-extrabold uppercase mt-2">Lowest accuracy objective</span>
                      </div>

                      <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal flex flex-col justify-between hover:translate-y-[-2px] transition-all select-none">
                        <div>
                          <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Average Class Score 📊</span>
                          <span className="block font-sans text-4xl font-black text-slate-900 mt-2">
                            {avgScorePercentage}%
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-extrabold uppercase mt-2">Overall average percentage</span>
                      </div>
                    </div>

                    {/* DIAGNOSTICS & AUTOMATED INTERVENTION SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal space-y-4">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Objective Mastery Progress</h3>
                        <div className="space-y-4">
                          {goalsArray.length === 0 ? (
                            <div className="p-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest border-2 border-dashed border-slate-200 rounded-2xl bg-neutral-50 select-none">
                              No learning objectives recorded for this window yet.
                            </div>
                          ) : (
                            goalsArray.map((stat) => {
                              let progressColor = 'bg-rose-500';
                              let textColor = 'text-rose-600';
                              let bgColor = 'bg-rose-50/30 border-rose-100';
                              if (stat.accuracy >= 70) {
                                progressColor = 'bg-emerald-500';
                                textColor = 'text-emerald-600';
                                bgColor = 'bg-emerald-50/30 border-emerald-100';
                              } else if (stat.accuracy >= 45) {
                                progressColor = 'bg-amber-400';
                                textColor = 'text-amber-600';
                                bgColor = 'bg-amber-50/30 border-amber-100';
                              }

                              return (
                                <div key={stat.lo} className={`relative group p-4 border-2 border-slate-900 rounded-xl space-y-3 ${bgColor} shadow-brutal-sm hover:shadow-brutal transition-all cursor-help animate-fadeIn`}>
                                  <div className="flex flex-col gap-1.5 text-left">
                                    <div className="flex justify-between items-start gap-1.5">
                                      <span className="text-xs font-black text-slate-800 leading-relaxed block">
                                        🎯 {stat.lo}
                                      </span>
                                      {stat.hasSubBreakdown && (
                                        <span className="shrink-0 text-[8px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded uppercase tracking-wider select-none">
                                          🔍 Hover for Breakdown
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400">
                                      <span>Class Mastery Accuracy:</span>
                                      <span className={`${textColor} font-black font-mono`}>
                                        {stat.accuracy}% ({stat.correctCount}/{stat.totalAnswers} marks)
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-slate-100 h-4 border-2 border-slate-900 rounded-full overflow-hidden p-0.5">
                                    <div
                                      className={`${progressColor} h-full rounded-full transition-all duration-500`}
                                      style={{ width: `${stat.accuracy}%` }}
                                    ></div>
                                  </div>

                                  {stat.hasSubBreakdown && stat.details.length > 0 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[105%] z-50 hidden group-hover:block w-72 bg-slate-950 text-white p-4 rounded-2xl border-3 border-slate-900 shadow-brutal text-xs animate-fadeIn text-left space-y-3">
                                      <div className="border-b border-slate-800 pb-2">
                                        <p className="font-black text-amber-400 uppercase text-[10px] tracking-wider">🎯 Topic Breakdown</p>
                                        <p className="text-xs font-extrabold text-slate-200 truncate">{stat.lo}</p>
                                      </div>
                                      <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                                        {stat.details.map((det) => {
                                          let dColor = 'text-rose-400';
                                          if (det.accuracy >= 70) dColor = 'text-emerald-400';
                                          else if (det.accuracy >= 45) dColor = 'text-amber-400';

                                          return (
                                            <div key={det.detail} className="space-y-1">
                                              <p className="text-[11px] font-black text-slate-100 leading-tight">📍 {det.detail}</p>
                                              <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold">
                                                <span>Class Accuracy:</span>
                                                <span className={`${dColor} font-black font-mono`}>{det.accuracy}% ({det.correctCount}/{det.totalAnswers} mks)</span>
                                              </div>
                                              <div className="w-full bg-slate-800 h-2 border border-slate-700 rounded-full overflow-hidden p-[1px]">
                                                <div 
                                                  className={`h-full rounded-full ${det.accuracy >= 70 ? 'bg-emerald-500' : det.accuracy >= 45 ? 'bg-amber-400' : 'bg-rose-500'}`}
                                                  style={{ width: `${det.accuracy}%` }}
                                                />
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-amber-50 border-3 border-slate-900 rounded-2xl p-5 shadow-brutal space-y-4">
                          <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5 select-none">
                            <AlertTriangle className="w-4.5 h-4.5 text-amber-500 animate-bounce" />
                            Target Attention Focus Groups
                          </h3>
                          <p className="text-[11px] font-bold text-stone-400 select-none">
                            Auto-generated intervention rosters. Lists students with less than 65% accuracy on objectives underperforming class-wide (&lt; 70%).
                          </p>

                          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                            {detailGoalsAlerts.length === 0 ? (
                              <div className="p-4 bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-xl text-center animate-fadeIn select-none">
                                <Check className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                                <span className="text-[10px] font-black text-emerald-800 uppercase">Excellent! All specific learning goals are performing above 70%!</span>
                              </div>
                            ) : (
                              detailGoalsAlerts.map(alertGroup => (
                                <div key={`${alertGroup.topicName}-${alertGroup.detailGoalName}`} className="p-3.5 bg-white border-2 border-slate-900 rounded-xl text-left shadow-brutal-sm animate-fadeIn">
                                  <div className="flex items-start justify-between gap-1.5">
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-snug">
                                      📍 {alertGroup.detailGoalName}
                                    </h4>
                                    <span className="shrink-0 text-[8px] font-black text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded uppercase tracking-wider select-none">
                                      {alertGroup.topicName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5 mt-1 select-none">
                                    <span className="text-[10px] font-bold text-stone-400">Goal Accuracy:</span>
                                    <span className="px-1.5 py-0.5 bg-rose-50 border-2 border-rose-300 rounded text-[9px] font-black text-rose-700">{alertGroup.accuracy}%</span>
                                  </div>

                                  <div className="mt-2.5 border-t border-dashed border-slate-100 pt-2">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Needs Intervention:</span>
                                    {alertGroup.studentAlerts.length === 0 ? (
                                      <span className="text-[10px] text-emerald-600 font-extrabold uppercase select-none">No individual pupil falls below 65%!</span>
                                    ) : (
                                      <div className="flex flex-wrap gap-1.5">
                                        {alertGroup.studentAlerts.map(alert => (
                                          <span key={alert.name} className="px-2 py-1 bg-rose-50 border-2 border-rose-300 rounded-lg text-[9px] font-black text-rose-700 uppercase flex items-center gap-1 select-none">
                                            <span>{alert.name}</span>
                                            <span className="text-rose-500">({alert.pct}%)</span>
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* INDIVIDUAL PUPIL ROSTER GRID */}
                    <div className="bg-white border-3 border-slate-900 rounded-2xl shadow-brutal overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b-3 border-slate-900 text-left select-none text-[10px] font-black uppercase text-slate-500 tracking-wider">
                              <th className="p-3.5 pl-5">Pupil Name</th>
                              <th className="p-3.5">Class Group</th>
                              <th className="p-3.5">Raw Score</th>
                              <th className="p-3.5">Percentage</th>
                              <th className="p-3.5">Learning Objective Performance Breakdown</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUnified.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="p-8 text-center text-xs font-black text-slate-400 uppercase tracking-wider select-none">
                                  No pupil assessments recorded for this subject and term/test option yet.
                                </td>
                              </tr>
                            ) : (
                              filteredUnified.map((sub) => {
                                let pctBg = 'bg-rose-50 text-rose-700 border-rose-300';
                                if (sub.percentage >= 70) {
                                  pctBg = 'bg-emerald-50 text-emerald-700 border-emerald-300';
                                } else if (sub.percentage >= 45) {
                                  pctBg = 'bg-amber-50 text-amber-700 border-amber-300';
                                }

                                return (
                                  <tr key={sub.id} className="border-b-2 border-slate-100 hover:bg-slate-50/50 transition-colors animate-fadeIn">
                                    <td className="p-3.5 pl-5 text-left">
                                      <span className="font-sans text-xs font-black text-slate-800 block">{sub.studentName}</span>
                                    </td>
                                    <td>
                                      <span className="px-2 py-0.5 bg-indigo-50 border-2 border-slate-900 rounded text-[9px] font-black uppercase text-indigo-600 tracking-wide select-none">
                                        {sub.studentClass ? sub.studentClass.replace(/^(class\s+)/i, '') : 'N/A'}
                                      </span>
                                    </td>
                                    <td className="p-3.5">
                                      <span className="px-2.5 py-1 bg-white border-2 border-slate-900 rounded-lg text-xs font-black text-slate-700 font-mono select-none whitespace-nowrap inline-block">
                                        {sub.score} / {sub.totalQuestions}
                                      </span>
                                    </td>
                                    <td className="p-3.5">
                                      <span className={`px-2.5 py-1.5 border-2 rounded-xl text-xs font-black font-mono select-none ${pctBg}`}>
                                        {sub.percentage}%
                                      </span>
                                    </td>
                                    <td className="p-3.5">
                                      <div className="flex flex-wrap gap-2">
                                        {goalsArray.map((loRef) => {
                                          const score = getStudentLoScore(sub, loRef.lo);
                                          let scoreColor = 'bg-rose-50 text-rose-700 border-rose-200';
                                          if (score.pct >= 70) scoreColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                                          else if (score.pct >= 45) scoreColor = 'bg-amber-50 text-amber-700 border-amber-200';

                                          return (
                                            <div
                                              key={loRef.lo}
                                              onMouseEnter={(e) => {
                                                if (!loRef.hasSubBreakdown || loRef.details.length === 0) return;
                                                if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setHoveredTooltip({
                                                  studentName: sub.studentName,
                                                  lo: loRef.lo,
                                                  details: loRef.details,
                                                  x: rect.left + rect.width / 2,
                                                  y: rect.top,
                                                });
                                              }}
                                              onMouseLeave={() => {
                                                if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                                                closeTimeoutRef.current = setTimeout(() => {
                                                  setHoveredTooltip(null);
                                                }, 400);
                                              }}
                                              className={`px-2 py-0.5 border-2 rounded-lg text-[9px] font-extrabold uppercase tracking-tight flex items-center gap-1.5 select-none cursor-help transition-all duration-150 hover:scale-[1.02] hover:border-slate-900 ${scoreColor}`}
                                            >
                                              <span>{loRef.lo}: {score.pct}% ({score.correct}/{score.total})</span>
                                              {loRef.hasSubBreakdown && <span className="text-[8px] opacity-60">🔍</span>}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Floating Tooltip to prevent any overflow/table clipping */}
                    {hoveredTooltip && (
                      <div 
                        onMouseEnter={() => {
                          if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                        }}
                        onMouseLeave={() => {
                          if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
                          closeTimeoutRef.current = setTimeout(() => {
                            setHoveredTooltip(null);
                          }, 400);
                        }}
                        className="fixed w-72 bg-slate-950 text-white p-4 rounded-2xl border-3 border-slate-900 shadow-brutal text-xs animate-fadeIn text-left space-y-3 normal-case z-[9999] font-sans"
                        style={{
                          left: `${hoveredTooltip.x}px`,
                          top: `${hoveredTooltip.y - 8}px`,
                          transform: 'translate(-50%, -100%)',
                        }}
                      >
                        <div className="border-b border-slate-800 pb-2">
                          <p className="font-black text-amber-400 uppercase text-[9px] tracking-wider font-mono">🎯 Student Learning Goals</p>
                          <p className="text-xs font-black text-slate-100 truncate mt-0.5">{hoveredTooltip.studentName}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Topic: {hoveredTooltip.lo}</p>
                        </div>
                        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                          {hoveredTooltip.details.map((det) => {
                            const studentGoalStats = topicStats[hoveredTooltip.lo]?.details[det.detail]?.students[hoveredTooltip.studentName];
                            const sGoalPct = studentGoalStats && studentGoalStats.total > 0
                              ? Math.round((studentGoalStats.correct / studentGoalStats.total) * 100)
                              : 0;
                            const sGoalCorrect = studentGoalStats?.correct || 0;
                            const sGoalTotal = studentGoalStats?.total || 0;

                            let sColor = 'text-rose-400';
                            if (sGoalPct >= 70) sColor = 'text-emerald-400';
                            else if (sGoalPct >= 45) sColor = 'text-amber-400';

                            return (
                              <div key={det.detail} className="space-y-1">
                                <p className="text-[11px] font-black text-slate-100 leading-tight">📍 {det.detail}</p>
                                <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold">
                                  <span>Pupil Score:</span>
                                  <span className={`${sColor} font-black font-mono`}>{sGoalPct}% ({sGoalCorrect}/{sGoalTotal} marks)</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 border border-slate-700 rounded-full overflow-hidden p-[1px]">
                                  <div 
                                    className={`h-full rounded-full ${sGoalPct >= 70 ? 'bg-emerald-500' : sGoalPct >= 45 ? 'bg-amber-400' : 'bg-rose-500'}`}
                                    style={{ width: `${sGoalPct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}

        {/* TAB 2: GRADEBOOK TABLE */}
        {activeTab === 'gradebook' && (
          <motion.div
            key="gradebook"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-slate-800">Pupil Assessment Records</h2>
                <p className="text-xs font-semibold text-stone-400">
                  Detailed lists of completed assessment sheets and marks scored{teacherYearGroup !== null ? ` (Showing ${teacherYearGroup === -1 ? 'Nursery' : teacherYearGroup === -2 ? 'Reception' : `Year ${teacherYearGroup}`} records based on your assigned class/year)` : ''}.
                </p>
              </div>
              <button
                onClick={() => {
                  setActivePrevStep(1);
                  setPrevFolder('');
                  setPrevYearGroup('all');
                  setPrevSubject('all');
                  setPrevStrand('all');
                  setPrevTerm('all');
                  setPrevTest('all');
                  setShowPreviousYearsModal(true);
                }}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase border-2 border-slate-900 rounded-xl transition-all cursor-pointer shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                📁 Previous years
              </button>
            </div>

            {/* Filtration Toolbars & Search Panel */}
            <div className="bg-white border-3 border-slate-900 rounded-2xl p-4 shadow-brutal-sm flex flex-col md:flex-row gap-4 items-center">
              {/* Search label input */}
              <div className="w-full md:flex-1 relative flex items-center">
                <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search student names or test sheets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl py-2 pl-9 pr-4 font-black text-xs select-text focus:outline-none focus:bg-white text-slate-805"
                />
              </div>

              {/* Filters Class */}
              <div className="w-full md:w-auto flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase">Class:</span>
                <select
                  value={teacherFilterClass}
                  onChange={(e) => setTeacherFilterClass(e.target.value)}
                  className="py-1.5 px-3 bg-white border-2 border-slate-900 rounded-xl font-black text-xs focus:ring-0 cursor-pointer text-slate-850 uppercase tracking-tight"
                >
                  <option value="all">All Classes</option>
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls.replace(/^(class\s+)/i, '')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filters Subject */}
              <div className="w-full md:w-auto flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase">Subject:</span>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="py-1.5 px-3 bg-white border-2 border-slate-900 rounded-xl font-black text-xs focus:ring-0 cursor-pointer text-slate-850 uppercase tracking-tight"
                >
                  <option value="all">All Subjects</option>
                  <option value="maths">Maths 📐</option>
                  <option value="reading">Reading 📖</option>
                  <option value="spag">Grammar (SPAG) ✒️</option>
                  <option value="science">Science 🧪</option>
                  <option value="history">History 🏰</option>
                  <option value="geography">Geography 🌍</option>
                  <option value="computing">Computing 💻</option>
                  <option value="art">Art 🎨</option>
                  <option value="dt">DT 🛠️</option>
                  <option value="music">Music 🎵</option>
                  <option value="pshe">PSHE 🤝</option>
                  <option value="re">RE 🕊️</option>
                  <option value="pe">PE 🏃</option>
                </select>
              </div>
            </div>

            {/* Gradebook Table database results grid */}
            <div className="bg-white border-3 border-slate-900 rounded-2xl shadow-brutal overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-slate-900 border-b-3 border-slate-900 text-white uppercase text-[10px] font-black tracking-wider">
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Class Year</th>
                      <th className="p-3">Class Assigned</th>
                      <th className="p-3">Assessment Title</th>
                      <th className="p-3">Points Scorings</th>
                      <th className="p-3">Percentage</th>
                      <th className="p-3">Minutes Taken</th>
                      <th className="p-3">Finished Date</th>
                      <th className="p-3 text-right pr-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-150">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-stone-400 font-bold select-none">
                          {getTeacherYearGroup() === null && !dbUser.class ? (
                            <div className="max-w-md mx-auto py-6 text-slate-850 space-y-3">
                              <p className="text-sm font-black uppercase tracking-wider text-indigo-600 flex items-center justify-center gap-2">
                                <span>🏛️</span> Admin Access Active
                              </p>
                              <p className="text-xs text-slate-500 font-bold normal-case leading-relaxed">
                                Master records of all pupil assessments have been moved to the <span className="text-slate-800 font-extrabold underline decoration-indigo-500 decoration-2">Pupil Assessments</span> tab inside the <span className="bg-amber-100 border border-amber-300 text-amber-800 px-1.5 py-0.5 rounded-md font-black">Admin Area 🛡️</span>.
                              </p>
                              <p className="text-[10.5px] text-slate-400 font-bold normal-case tracking-wide">
                                Assign yourself to a specific class under 'Teacher Logins' to view a dedicated classroom gradebook here.
                              </p>
                            </div>
                          ) : (
                            "🔍 No gradebook records matched your active search query/filters."
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-black text-slate-905 flex items-center gap-2">
                            <span className="text-sm">👩‍🎓</span>
                            <div>
                              <span>{rec.studentName}</span>
                              <span className="block font-mono text-[9px] text-[#4f46e5] font-black uppercase">
                                {rec.studentUsername}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-white border-2 border-slate-900 rounded-lg text-[9px] font-black uppercase tracking-wide whitespace-nowrap inline-block">
                              Year {rec.yearGroup}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-600 whitespace-nowrap">
                            <span className="px-2.5 py-1 bg-indigo-50 border-2 border-indigo-200 rounded-lg text-[9px] font-black uppercase tracking-wide text-indigo-700 whitespace-nowrap inline-block">
                              {rec.studentClass && rec.studentClass !== 'Unassigned' ? rec.studentClass.replace(/^(class\s+)/i, '') : 'N/A'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm shrink-0">
                                {(() => {
                                  const sub = rec.subject.toLowerCase();
                                  if (sub === 'maths') return '📐';
                                  if (sub === 'reading') return '📖';
                                  if (sub === 'spag') return '✒️';
                                  if (sub === 'science') return '🧪';
                                  if (sub === 'history') return '🏰';
                                  if (sub === 'geography') return '🌍';
                                  if (sub === 'computing') return '💻';
                                  if (sub === 'art') return '🎨';
                                  if (sub === 'dt') return '🛠️';
                                  if (sub === 'music') return '🎵';
                                  if (sub === 'pshe') return '🤝';
                                  if (sub === 're') return '🕊️';
                                  if (sub === 'pe') return '🏃';
                                  return '📚';
                                })()}
                              </span>
                              <span className="font-semibold text-slate-700 whitespace-normal break-words inline-block max-w-[250px]">
                                {rec.testTitle}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 font-bold font-mono text-slate-700">
                            {rec.score} pts
                          </td>
                          <td className="p-3 font-black">
                            <span
                              className={`px-2 py-1 rounded-lg border-2 font-mono text-[11px] ${
                                rec.percentage >= 85
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : rec.percentage >= 50
                                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                                  : 'bg-rose-50 text-rose-700 border-rose-300'
                              }`}
                            >
                              {rec.percentage}%
                            </span>
                          </td>
                          <td className="p-3 font-semibold font-mono text-slate-500">
                            {Math.round(rec.durationSeconds / 60)}m {rec.durationSeconds % 60}s
                          </td>
                          <td className="p-3 text-slate-400 font-bold">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-300" />
                              <span>{new Date(rec.completedAt).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="p-3 text-right pr-6">
                            {canDeleteRecord(rec) ? (
                              <button
                                onClick={() => setDeletingRecord(rec)}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase rounded border-2 border-slate-900 shadow-brutal-sm transition-all hover:translate-y-[-1px] active:translate-y-[0px] cursor-pointer"
                              >
                                Delete
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-slate-400 select-none">
                                Read-only
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB: INDIVIDUAL PUPIL PROGRESS TRACKER & TREND LINE */}
        {activeTab === 'progress' && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Split layout: left sidebar, right analytics stage matching the portal's theme */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start select-none">
              
              {/* Sidebar Box (Left Hand Side) - Pupils Names */}
              <div className="lg:col-span-3 bg-white border-3 border-slate-900 rounded-[24px] p-5 shadow-brutal-sm flex flex-col space-y-4 h-fit">
                <div className="shrink-0 select-none text-center pt-2">
                  <h3 className="font-display text-base font-black text-slate-900 uppercase tracking-tight">
                    Pupil Names
                  </h3>
                </div>

                {/* Filter by class custom styled select box */}
                <div className="shrink-0">
                  <select
                    value={progressClassFilter}
                    onChange={(e) => {
                      setProgressClassFilter(e.target.value);
                      setSelectedProgressStudentId(null); // clear selection on class change
                    }}
                    className="w-full text-xs font-black border-3 border-slate-900 rounded-xl bg-white p-3 text-slate-800 text-center uppercase cursor-pointer shadow-brutal-xs outline-none hover:bg-slate-50 transition-colors"
                  >
                    <option value="all">Filter Class</option>
                    {adminAvailableClasses.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls.replace(/^(class\s+)/i, '').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Input styled to match mockup */}
                <div className="shrink-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search name"
                      value={progressSearchQuery}
                      onChange={(e) => setProgressSearchQuery(e.target.value)}
                      className="w-full text-xs font-black border-3 border-slate-900 rounded-xl p-3 bg-white text-slate-800 text-center shadow-brutal-xs outline-none hover:bg-slate-50 transition-all placeholder:text-slate-400 placeholder:font-black"
                    />
                  </div>
                </div>

                {/* Inner list box container - scroll feature removed so list is fully expanded */}
                <div className="space-y-1">
                  {(() => {
                     let list = [...allProgressPupils];
                    
                    // Filter class
                    if (progressClassFilter !== 'all') {
                      list = list.filter((p) => p.class === progressClassFilter);
                    }
                    
                    // Filter search query
                    if (progressSearchQuery.trim() !== '') {
                      const q = progressSearchQuery.toLowerCase();
                      list = list.filter((p) =>
                        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
                      );
                    }

                    if (list.length === 0) {
                      return (
                        <div className="text-center py-8 text-[11px] font-black text-slate-400 uppercase tracking-tight">
                          No matching pupils
                        </div>
                      );
                    }

                    return list.map((pupil) => {
                      const isSelected = selectedProgressStudentId === pupil.id;
                      // Format as "First Word of First Name + Last Initial" (e.g., "Abdullah Muhammed Mansuri" -> "Abdullah M.")
                      const fParts = pupil.firstName.trim().split(/\s+/);
                      const firstWord = fParts[0] || '';
                      
                      let lastInitial = '';
                      const lName = pupil.lastName.trim();
                      if (lName) {
                        const lParts = lName.split(/\s+/);
                        lastInitial = lParts[lParts.length - 1].charAt(0).toUpperCase();
                      } else if (fParts.length > 1) {
                        lastInitial = fParts[fParts.length - 1].charAt(0).toUpperCase();
                      }
                      
                      const formattedName = (firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase()) + 
                        (lastInitial ? ' ' + lastInitial + '.' : '');
                      
                      return (
                        <button
                          key={pupil.id}
                          type="button"
                          onClick={() => setSelectedProgressStudentId(pupil.id)}
                          className={`w-full text-left px-3.5 py-2 text-xs font-black uppercase transition-all rounded-lg border cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-slate-900 shadow-brutal-xs translate-y-[-1px]'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-900 hover:bg-indigo-50'
                          }`}
                        >
                          <span className="truncate">{formattedName}</span>
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Analytics Stage Area (Right Hand Side) - Pupil Progress & Trends */}
              <div className="lg:col-span-9 bg-white border-3 border-slate-900 rounded-[24px] p-6 md:p-8 shadow-brutal-sm flex flex-col space-y-6 h-fit">
                
                {/* Title centered at the top of the container */}
                <div className="text-center mb-6 shrink-0 select-none pb-2 border-b-2 border-slate-100">
                  <h3 className="font-display text-base font-black text-slate-900 uppercase tracking-tight">
                    Pupil progress & trends
                  </h3>
                </div>

                {(() => {
                  const activePupil = allProgressPupils.find((p) => p.id === selectedProgressStudentId);
                  
                  if (!activePupil) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center text-center select-none space-y-4">
                        <div className="w-16 h-16 bg-slate-50 border-3 border-slate-900 rounded-[20px] flex items-center justify-center text-3xl shadow-brutal-xs">
                          📈
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="font-display text-xs font-black text-slate-900 uppercase tracking-wider">No Student Selected</h4>
                          <p className="text-xs text-slate-400 font-bold max-w-sm mx-auto leading-relaxed">
                            Please select a pupil's name from the list on the left to display their learning growth trend, historical assessments, and diagnostics.
                          </p>
                        </div>
                      </div>
                    );
                  }

                  // Retrieve this pupil's full score history
                  const fullHistory = getStudentHistory(activePupil);

                  // Helper to match record to selected term
                  const isRecordInTerm = (rec: { testTitle: string; completedAt: string }, term: string) => {
                    if (term === 'All Terms') return true;
                    const titleLower = rec.testTitle.toLowerCase();
                    const filterLower = term.toLowerCase();

                    // Prevent cross-term matching between sub-terms (e.g. Autumn 2 matching Autumn 1 / Test 1)
                    if (filterLower.includes('1') && (titleLower.includes('2') || titleLower.includes('test 2') || titleLower.includes('assessment 2'))) return false;
                    if (filterLower.includes('2') && (titleLower.includes('1') || titleLower.includes('test 1') || titleLower.includes('assessment 1'))) return false;

                    if (titleLower.includes(filterLower)) return true;

                    const date = new Date(rec.completedAt);
                    if (isNaN(date.getTime())) return true;
                    const m = date.getMonth();

                    if (filterLower.includes('autumn 1') && (m === 8 || m === 9)) return true;
                    if (filterLower.includes('autumn 2') && (m === 10 || m === 11)) return true;
                    if (filterLower.includes('spring 1') && (m === 0 || m === 1)) return true;
                    if (filterLower.includes('spring 2') && (m === 2 || m === 3)) return true;
                    if (filterLower.includes('summer 1') && (m === 4 || m === 5)) return true;
                    if (filterLower.includes('summer 2') || filterLower.includes('current term')) {
                      if (m === 5 || m === 6 || m === 7) return true;
                      const diffDays = (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24);
                      if (diffDays <= 120) return true;
                    }
                    return false;
                  };

                  // Filter history by current selected term & subjects
                  const termHistory = fullHistory.filter((r) => isRecordInTerm(r, progressTermFilter));
                  const activeSubjectHistory = termHistory.filter((r) => progressSelectedSubjects.includes(r.subject));

                  const totalTests = activeSubjectHistory.length;
                  const avgScore = totalTests > 0
                    ? Math.round(activeSubjectHistory.reduce((sum, r) => sum + r.percentage, 0) / totalTests)
                    : 0;
                  const maxScore = totalTests > 0
                    ? Math.max(...activeSubjectHistory.map(r => r.percentage))
                    : 0;

                  const trendDirection = calculateProgressDirection(activeSubjectHistory);

                  // Subject metadata configuration for recharts multi-series
                  const TREND_SUBJECT_CONFIGS: { id: Subject; label: string; emoji: string; color: string }[] = [
                    { id: 'maths', label: 'Maths', emoji: '🔢', color: '#4f46e5' },
                    { id: 'reading', label: 'Reading', emoji: '📖', color: '#059669' },
                    { id: 'spag', label: 'SPaG', emoji: '✒️', color: '#d97706' },
                    { id: 'science', label: 'Science', emoji: '🔬', color: '#e11d48' },
                    { id: 'history', label: 'History', emoji: '🏰', color: '#9333ea' },
                    { id: 'geography', label: 'Geography', emoji: '🌍', color: '#0284c7' },
                  ];

                  // Canonical terms order for progress trends
                  const STANDARD_CHRONO_TERMS = [
                    'Autumn 1',
                    'Autumn 2',
                    'Spring 1',
                    'Spring 2',
                    'Summer 1',
                    'Summer 2'
                  ];

                  const MID_END_CHRONO_TERMS = [
                    'Autumn Mid Point',
                    'Autumn End Point',
                    'Spring Mid Point',
                    'Spring End Point',
                    'Summer Mid Point',
                    'Summer End Point'
                  ];

                  const getRecordTermName = (rec: { testTitle: string; completedAt: string }): string => {
                    const titleLower = rec.testTitle.toLowerCase();
                    if (titleLower.includes('autumn mid')) return 'Autumn Mid Point';
                    if (titleLower.includes('autumn end')) return 'Autumn End Point';
                    if (titleLower.includes('spring mid')) return 'Spring Mid Point';
                    if (titleLower.includes('spring end')) return 'Spring End Point';
                    if (titleLower.includes('summer mid')) return 'Summer Mid Point';
                    if (titleLower.includes('summer end')) return 'Summer End Point';

                    if (titleLower.includes('autumn 1') || titleLower.includes('a1') || (titleLower.includes('autumn') && (titleLower.includes('test 1') || titleLower.includes('assessment 1') || titleLower.includes('unit 1')))) return 'Autumn 1';
                    if (titleLower.includes('autumn 2') || titleLower.includes('a2') || (titleLower.includes('autumn') && (titleLower.includes('test 2') || titleLower.includes('assessment 2') || titleLower.includes('unit 2')))) return 'Autumn 2';
                    if (titleLower.includes('spring 1') || titleLower.includes('s1') || (titleLower.includes('spring') && (titleLower.includes('test 1') || titleLower.includes('assessment 1') || titleLower.includes('unit 1')))) return 'Spring 1';
                    if (titleLower.includes('spring 2') || titleLower.includes('s2') || (titleLower.includes('spring') && (titleLower.includes('test 2') || titleLower.includes('assessment 2') || titleLower.includes('unit 2')))) return 'Spring 2';
                    if (titleLower.includes('summer 1') || titleLower.includes('su1') || (titleLower.includes('summer') && (titleLower.includes('test 1') || titleLower.includes('assessment 1') || titleLower.includes('unit 1')))) return 'Summer 1';
                    if (titleLower.includes('summer 2') || titleLower.includes('su2') || (titleLower.includes('summer') && (titleLower.includes('test 2') || titleLower.includes('assessment 2') || titleLower.includes('unit 2')))) return 'Summer 2';

                    // Prevent cross-term matching between sub-terms (e.g. Test 1 or 1 in title should not match Autumn 2 based on date)
                    if (titleLower.includes('1') && !titleLower.includes('2')) {
                      if (titleLower.includes('autumn')) return 'Autumn 1';
                      if (titleLower.includes('spring')) return 'Spring 1';
                      if (titleLower.includes('summer')) return 'Summer 1';
                    }
                    if (titleLower.includes('2') && !titleLower.includes('1')) {
                      if (titleLower.includes('autumn')) return 'Autumn 2';
                      if (titleLower.includes('spring')) return 'Spring 2';
                      if (titleLower.includes('summer')) return 'Summer 2';
                    }

                    const date = new Date(rec.completedAt);
                    if (!isNaN(date.getTime())) {
                      const m = date.getMonth();
                      if (m === 8 || m === 9) return 'Autumn 1';
                      if (m === 10 || m === 11) return 'Autumn 2';
                      if (m === 0 || m === 1) return 'Spring 1';
                      if (m === 2 || m === 3) return 'Spring 2';
                      if (m === 4 || m === 5) return 'Summer 1';
                      if (m === 6 || m === 7) return 'Summer 2';
                    }
                    return 'Autumn 1';
                  };

                  const subjectFilteredHistory = fullHistory.filter(r => progressSelectedSubjects.includes(r.subject));

                  const hasMidPointTerms = subjectFilteredHistory.some(r => {
                    const t = r.testTitle.toLowerCase();
                    return t.includes('mid point') || t.includes('end point');
                  });

                  const activeTermList = hasMidPointTerms ? MID_END_CHRONO_TERMS : STANDARD_CHRONO_TERMS;

                  let maxCompletedTermIdx = -1;
                  activeTermList.forEach((termName, idx) => {
                    const hasRecord = subjectFilteredHistory.some(r => getRecordTermName(r) === termName);
                    if (hasRecord) {
                      maxCompletedTermIdx = Math.max(maxCompletedTermIdx, idx);
                    }
                  });

                  let targetIdx = maxCompletedTermIdx;
                  const selectedFilterIdx = activeTermList.findIndex(t => t.toLowerCase() === progressTermFilter.toLowerCase());
                  if (selectedFilterIdx !== -1) {
                    targetIdx = Math.max(targetIdx, selectedFilterIdx);
                  }

                  // Order strictly by chronological term order and ensure all prior terms (including uncompleted tests) are included
                  const termsToInclude = (progressTermFilter === 'All Terms' || targetIdx === -1)
                    ? activeTermList
                    : activeTermList.slice(0, Math.max(targetIdx + 1, 2));

                  const trendLineData = termsToInclude.map(termName => {
                    const termRecords = subjectFilteredHistory.filter(r => getRecordTermName(r) === termName);
                    const nodeData: any = {
                      shortName: termName,
                      termLabel: termName,
                    };

                    let latestDateForTerm: string | null = null;

                    progressSelectedSubjects.forEach(subjKey => {
                      const subjRecs = termRecords.filter(r => r.subject === subjKey);
                      if (subjRecs.length > 0) {
                        const avg = Math.round(subjRecs.reduce((sum, r) => sum + r.percentage, 0) / subjRecs.length);
                        nodeData[subjKey] = avg;

                        const latestRec = subjRecs[subjRecs.length - 1];
                        if (latestRec && latestRec.completedAt) {
                          latestDateForTerm = latestRec.completedAt;
                        }
                      } else {
                        nodeData[subjKey] = null;
                      }
                    });

                    if (latestDateForTerm) {
                      nodeData.completedAt = latestDateForTerm;
                    }

                    return nodeData;
                  });

                  const hasAnyScores = trendLineData.some(node =>
                    progressSelectedSubjects.some(subjKey => typeof node[subjKey] === 'number')
                  );

                  // Subject average comparison data for Bar Chart
                  const trendBarData = progressSelectedSubjects.map((subjKey) => {
                    const cfg = TREND_SUBJECT_CONFIGS.find((s) => s.id === subjKey) || { label: subjKey, emoji: '📚', color: '#4f46e5' };
                    const subjRecords = termHistory.filter((r) => r.subject === subjKey);
                    const count = subjRecords.length;
                    const avg = count > 0 ? Math.round(subjRecords.reduce((s, r) => s + r.percentage, 0) / count) : 0;
                    return {
                      subjectName: `${cfg.emoji} ${cfg.label}`,
                      subjectKey: subjKey,
                      average: avg,
                      count,
                      fill: cfg.color,
                    };
                  });

                  const toggleSubjectSelection = (subj: Subject) => {
                    if (progressSelectedSubjects.includes(subj)) {
                      if (progressSelectedSubjects.length > 1) {
                        setProgressSelectedSubjects(progressSelectedSubjects.filter((s) => s !== subj));
                      }
                    } else {
                      setProgressSelectedSubjects([...progressSelectedSubjects, subj]);
                    }
                  };

                  const selectAllSubjects = () => {
                    setProgressSelectedSubjects(['maths', 'reading', 'spag', 'science', 'history', 'geography']);
                  };

                  return (
                    <div className="space-y-6">
                      
                      {/* Pupil Bio Header Banner */}
                      <div className="bg-white border-3 border-slate-900 rounded-[20px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none shadow-brutal-xs">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-slate-50 border-2 border-slate-900 rounded-[14px] flex items-center justify-center text-3xl shrink-0 shadow-brutal-xs">
                            👤
                          </div>
                          <div className="text-left">
                            <h3 className="font-display text-lg font-black uppercase text-slate-900 tracking-tight">
                              {activePupil.firstName} {activePupil.lastName}
                            </h3>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] uppercase font-black rounded-md border-2 border-slate-900">
                                {activePupil.class ? `CLASS ${activePupil.class.replace(/^(class\s+)/i, '').toUpperCase()}` : 'NO CLASS'}
                              </span>
                              <span className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] uppercase font-black rounded-md border-2 border-slate-900">
                                YEAR {activePupil.yearGroup}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          {/* Term Filter Selector */}
                          <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border-3 border-slate-900 shadow-brutal-xs">
                            <span className="text-[10px] font-black uppercase text-slate-500 pl-1">Term:</span>
                            <select
                              value={progressTermFilter}
                              onChange={(e) => setProgressTermFilter(e.target.value)}
                              className="text-xs font-black bg-white border-2 border-slate-900 rounded-lg px-2.5 py-1 text-slate-800 cursor-pointer outline-none hover:bg-slate-100 transition-colors"
                            >
                              <option value="Current Term">Current Term 📅</option>
                              <option value="Autumn 1">Autumn 1 🍁</option>
                              <option value="Autumn 2">Autumn 2 🍂</option>
                              <option value="Spring 1">Spring 1 🌱</option>
                              <option value="Spring 2">Spring 2 🌸</option>
                              <option value="Summer 1">Summer 1 ☀️</option>
                              <option value="Summer 2">Summer 2 🏖️</option>
                              <option value="All Terms">All Terms 📆</option>
                            </select>
                          </div>

                          {/* PDF Summary Report Download Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setPdfRemarks('');
                              setPdfTeacherSignature('Class Teacher');
                              setIsPdfModalOpen(true);
                            }}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white border-3 border-slate-900 rounded-xl text-xs font-black uppercase tracking-wide shadow-brutal-xs hover:shadow-brutal transition-all flex items-center gap-1.5 cursor-pointer active:translate-y-[1px]"
                            title="Generate and download a comprehensive PDF performance summary report for this pupil"
                          >
                            <FileDown className="w-4 h-4 shrink-0" />
                            <span>PDF Report</span>
                          </button>
                        </div>
                      </div>

                      {/* Summary stats grid for selected term & subjects */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left select-none">
                        
                        {/* Stat 1: Total Assessments */}
                        <div className="bg-slate-50 border-3 border-slate-900 rounded-[20px] p-4 flex items-center justify-between shadow-brutal-xs">
                          <div>
                            <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">
                              Assessments ({progressTermFilter})
                            </span>
                            <span className="text-2xl font-black text-slate-950 block mt-1">
                              {totalTests}
                            </span>
                          </div>
                          <div className="w-12 h-12 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center text-xl shadow-brutal-xs">
                            📝
                          </div>
                        </div>

                        {/* Stat 2: Average Score */}
                        <div className="bg-slate-50 border-3 border-slate-900 rounded-[20px] p-4 flex items-center justify-between shadow-brutal-xs">
                          <div>
                            <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">
                              Term Average Score
                            </span>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-2xl font-black text-slate-950">
                                {totalTests > 0 ? `${avgScore}%` : 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center text-xl shadow-brutal-xs">
                            🎯
                          </div>
                        </div>

                        {/* Stat 3: Progress direction */}
                        <div className="bg-slate-50 border-3 border-slate-900 rounded-[20px] p-4 flex items-center justify-between shadow-brutal-xs">
                          <div>
                            <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider">
                              Term Growth Direction
                            </span>
                            <div className="flex items-center mt-1.5">
                              {totalTests >= 2 ? (
                                <span className={`text-[10px] px-2 py-0.5 font-black uppercase rounded-md border-2 border-slate-900 ${trendDirection.color}`}>
                                  {trendDirection.text}
                                </span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 bg-white border-2 border-slate-900 rounded-md font-black text-slate-500 uppercase tracking-wide shadow-brutal-xs">
                                  Need 2+ tests 📊
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-white border-2 border-slate-900 rounded-xl flex items-center justify-center text-xl shadow-brutal-xs">
                            🚀
                          </div>
                        </div>

                      </div>

                      {/* Data Visualization Section - Recharts Progress Trends */}
                      <div className="bg-white border-3 border-slate-900 rounded-[20px] p-6 text-left shadow-brutal-sm space-y-5 select-none">
                        
                        {/* Visualization Header & View Switcher */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-display text-sm font-black text-slate-950 uppercase tracking-tight">
                                Term Student Progress Trends
                              </h4>
                              <span className="px-2 py-0.5 bg-indigo-50 border-2 border-slate-900 text-indigo-700 text-[10px] font-black uppercase rounded-md shadow-brutal-xs">
                                {progressTermFilter}
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                              Recharts visual breakdown of student score trajectories across selected subjects.
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Chart view switcher (Line vs Bar) */}
                            <div className="flex items-center bg-slate-100 p-1 rounded-xl border-2 border-slate-900 shadow-brutal-xs">
                              <button
                                type="button"
                                onClick={() => setProgressChartView('line')}
                                className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all ${
                                  progressChartView === 'line'
                                    ? 'bg-slate-900 text-white shadow-brutal-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                📈 Line Trend
                              </button>
                              <button
                                type="button"
                                onClick={() => setProgressChartView('bar')}
                                className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all ${
                                  progressChartView === 'bar'
                                    ? 'bg-slate-900 text-white shadow-brutal-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                📊 Subject Averages
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Subject Selection Chips */}
                        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 border-2 border-slate-900 rounded-xl p-3 shadow-brutal-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-slate-500 mr-1">Filter Subjects:</span>
                            {TREND_SUBJECT_CONFIGS.map((subj) => {
                              const isSelected = progressSelectedSubjects.includes(subj.id);
                              return (
                                <button
                                  key={subj.id}
                                  type="button"
                                  onClick={() => toggleSubjectSelection(subj.id)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 border-2 transition-all cursor-pointer ${
                                    isSelected
                                      ? 'border-slate-900 text-slate-950 shadow-brutal-xs'
                                      : 'border-slate-300 text-slate-400 bg-white hover:border-slate-400'
                                  }`}
                                  style={{
                                    backgroundColor: isSelected ? `${subj.color}15` : '#ffffff',
                                    borderColor: isSelected ? subj.color : undefined,
                                  }}
                                >
                                  <span>{subj.emoji}</span>
                                  <span>{subj.label}</span>
                                  {isSelected && <span className="w-2 h-2 rounded-full border border-slate-900" style={{ backgroundColor: subj.color }} />}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={selectAllSubjects}
                            className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                          >
                            Select All
                          </button>
                        </div>

                        {/* Chart Render Area */}
                        {progressChartView === 'line' ? (
                          hasAnyScores ? (
                            <div className="w-full h-80 pt-2">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendLineData} margin={{ top: 15, right: 15, left: -20, bottom: 10 }}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                  <XAxis
                                    dataKey="shortName"
                                    stroke="#0f172a"
                                    fontSize={9}
                                    fontWeight="bold"
                                    tickLine={false}
                                  />
                                  <YAxis
                                    stroke="#0f172a"
                                    fontSize={9}
                                    fontWeight="bold"
                                    domain={[0, 100]}
                                    tickLine={false}
                                    tickFormatter={(v) => `${v}%`}
                                  />
                                  <Tooltip content={<CustomProgressTooltip />} />
                                  <Legend
                                    wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 'bold' }}
                                    formatter={(value) => {
                                      const cfg = TREND_SUBJECT_CONFIGS.find((s) => s.id === value);
                                      return cfg ? `${cfg.emoji} ${cfg.label}` : value;
                                    }}
                                  />
                                  {progressSelectedSubjects.map((subjKey) => {
                                    const cfg = TREND_SUBJECT_CONFIGS.find((s) => s.id === subjKey);
                                    if (!cfg) return null;
                                    return (
                                      <Line
                                        key={subjKey}
                                        type="monotone"
                                        dataKey={subjKey}
                                        name={subjKey}
                                        stroke={cfg.color}
                                        strokeWidth={3}
                                        connectNulls={true}
                                        dot={{ stroke: '#0f172a', strokeWidth: 2, r: 4, fill: '#ffffff' }}
                                        activeDot={{ r: 6, strokeWidth: 2, stroke: '#0f172a', fill: cfg.color }}
                                      />
                                    );
                                  })}
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          ) : (
                            <div className="py-20 text-center text-xs font-black text-slate-400 bg-slate-50 border-3 border-dashed border-slate-200 rounded-xl uppercase tracking-widest leading-relaxed px-4">
                              No completed assessment logs recorded for {progressTermFilter} in selected subjects.
                            </div>
                          )
                        ) : (
                          <div className="w-full h-80 pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={trendBarData} margin={{ top: 15, right: 15, left: -20, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                  dataKey="subjectName"
                                  stroke="#0f172a"
                                  fontSize={10}
                                  fontWeight="bold"
                                  tickLine={false}
                                />
                                <YAxis
                                  stroke="#0f172a"
                                  fontSize={9}
                                  fontWeight="bold"
                                  domain={[0, 100]}
                                  tickLine={false}
                                  tickFormatter={(v) => `${v}%`}
                                />
                                <Tooltip content={<CustomProgressTooltip />} />
                                <Bar
                                  dataKey="average"
                                  name="Average Score"
                                  radius={[8, 8, 0, 0]}
                                  stroke="#0f172a"
                                  strokeWidth={2}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>

                      {/* Subject breakdown & Detailed test record list */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start text-left">
                        
                        {/* Left column: Subject Breakdown */}
                        <div className="md:col-span-1 bg-slate-50 border-3 border-slate-900 rounded-[20px] p-5 space-y-4 shadow-brutal-xs">
                          <h4 className="font-display text-xs font-black uppercase text-slate-900 tracking-wider border-b-2 border-slate-200 pb-2 select-none">
                            Subject Diagnostics
                          </h4>
                          
                          <div className="space-y-4 select-none">
                            {(['maths', 'reading', 'spag', 'science'] as Subject[]).map((subj) => {
                              const subjHistory = fullHistory.filter(r => r.subject === subj);
                              const count = subjHistory.length;
                              const sum = subjHistory.reduce((s, r) => s + r.percentage, 0);
                              const avg = count > 0 ? Math.round(sum / count) : null;
                              
                              let emoji = '🔢';
                              if (subj === 'reading') emoji = '📖';
                              if (subj === 'spag') emoji = '✒️';
                              if (subj === 'science') emoji = '🔬';

                              return (
                                <div key={subj} className="space-y-1.5">
                                  <div className="flex justify-between items-center text-xs font-bold">
                                    <span className="text-slate-700 capitalize flex items-center gap-1">
                                      {emoji} {subj === 'spag' ? 'SPaG / GPS' : subj}
                                    </span>
                                    <span className="text-slate-900 font-black text-[11px]">
                                      {avg !== null ? `${avg}% (${count} tests)` : 'Not Taken'}
                                    </span>
                                  </div>
                                  <div className="w-full h-3 bg-white border-2 border-slate-900 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full border-r-2 border-slate-900 transition-all duration-500 ${
                                        avg === null
                                          ? 'w-0'
                                          : avg < 50
                                          ? 'bg-rose-500'
                                          : avg < 70
                                          ? 'bg-amber-400'
                                          : avg < 85
                                          ? 'bg-emerald-500'
                                          : 'bg-indigo-600'
                                      }`}
                                      style={{ width: avg !== null ? `${avg}%` : '0%' }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right column: Detailed Assessment History List (Table) */}
                        <div className="md:col-span-2 bg-slate-50 border-3 border-slate-900 rounded-[20px] p-5 space-y-4 shadow-brutal-xs">
                          <h4 className="font-display text-xs font-black uppercase text-slate-900 tracking-wider border-b-2 border-slate-200 pb-2 select-none">
                            Completed Assessment Ledger
                          </h4>

                          {fullHistory.length === 0 ? (
                            <div className="py-12 text-center text-xs font-bold text-slate-400 bg-white border-3 border-dashed border-slate-200 rounded-xl uppercase tracking-tight">
                              No completed test logs recorded for this student.
                            </div>
                          ) : (
                            <div className="border-3 border-slate-900 rounded-xl overflow-hidden bg-white shadow-brutal-xs">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="bg-slate-900 text-white uppercase font-black text-[10px] tracking-wide border-b-3 border-slate-900">
                                    <th className="p-2.5 text-left">Subject & Test Focus</th>
                                    <th className="p-2.5 text-center">Score</th>
                                    <th className="p-2.5 text-center">Percentage</th>
                                    <th className="p-2.5 text-right pr-4">Band</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {fullHistory.map((rec) => {
                                    const band = getPerformanceBand(rec.percentage);
                                    let subEmoji = '🔢';
                                    if (rec.subject === 'reading') subEmoji = '📖';
                                    if (rec.subject === 'spag') subEmoji = '✒️';
                                    if (rec.subject === 'science') subEmoji = '🔬';

                                    return (
                                      <tr key={rec.id} className="border-b border-slate-200 hover:bg-slate-50 font-bold text-slate-700">
                                        <td className="p-2.5 text-left">
                                          <div className="font-extrabold text-slate-900 text-xs truncate max-w-[200px]">
                                            {rec.testTitle}
                                          </div>
                                          <span className="text-[9px] text-stone-400 uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                            {subEmoji} {rec.subject === 'spag' ? 'SPaG / GPS' : rec.subject} • {new Date(rec.completedAt).toLocaleDateString('en-GB')}
                                          </span>
                                        </td>
                                        <td className="p-2.5 text-center text-slate-900 font-extrabold">
                                          {rec.score !== undefined && rec.totalQuestions !== undefined
                                            ? `${rec.score} / ${rec.totalQuestions}`
                                            : '--'}
                                        </td>
                                        <td className="p-2.5 text-center text-indigo-650 font-black">
                                          {rec.percentage}%
                                        </td>
                                        <td className="p-2.5 text-right pr-4">
                                          <span className={`text-[8px] px-1.5 py-0.5 font-black uppercase rounded border ${band.bg}`}>
                                            {band.label.replace(' 🌟', '')}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })()}
              </div>

            </div>

          </motion.div>
        )}

        {/* TAB 3: LIVE ASSESSMENT WORKSPACE CONFIGURATION */}
        {activeTab === 'tests' && (
          <motion.div
            key="tests"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Title block */}
            <div>
              <h2 className="text-2xl font-black text-slate-905 uppercase tracking-tight">Assigned Assessments Engine</h2>
              <p className="text-xs font-semibold text-stone-400">
                Turn tests on/off for specific year levels, modify timers or set test rules.
              </p>
            </div>

            {/* Listing grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white border-3 border-slate-900 rounded-2xl p-4.5 flex flex-col justify-between shadow-brutal hover:scale-[1.005] transition-all"
                >
                  <div>
                    {/* Header line metadata */}
                    <div className="flex items-center justify-between gap-2 border-b-2 border-dashed border-slate-100 pb-2.5 mb-3 select-none">
                      <span className="px-2.5 py-1 bg-indigo-50 border-2 border-slate-900 rounded-lg text-[9px] font-black uppercase text-indigo-600 tracking-wide flex items-center gap-1.5 font-sans">
                        <Layers className="w-3.5 h-3.5" />
                        Year {test.yearGroup}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-1 border-2 border-slate-900 rounded shadow-brutal-sm ${
                          test.active
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {test.active ? '🟢 Open To Attempts' : '🔴 Closed'}
                      </span>
                    </div>

                    {/* Test paper header details */}
                    <h3 className="text-base text-slate-950 font-black truncate uppercase tracking-tight">{test.title}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1 select-none">
                      Subject: {test.subject} • Questions: {test.questions.length} items
                    </p>

                    {/* Time Limits controls */}
                    <div className="flex items-center gap-2 mt-4 select-none">
                      <span className="text-[10px] font-black text-slate-750 block uppercase tracking-wider">Time Limit:</span>
                      <select
                        value={test.timeLimitSeconds / 60}
                        onChange={(e) => onUpdateTestTimeLimit(test.id, parseInt(e.target.value))}
                        className="py-1 px-2.5 bg-slate-50 border-2 border-slate-900 rounded-lg text-xs font-black focus:outline-none cursor-pointer text-slate-900"
                      >
                        {[1, 2, 3, 4, 5, 8, 10].map((mins) => (
                           <option key={mins} value={mins}>
                            {mins} Min{mins > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Actions area panel */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-4 select-none">
                    <div className="flex items-center gap-1.5">
                      {onDeleteTest && canDeleteAssessment(test) && (
                        <button
                          onClick={async () => {
                            if (window.confirm(`⚠️ WARNING: Are you sure you want to permanently delete "${test.title}"? This cannot be undone!`)) {
                              await onDeleteTest(test.id);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 border-2 border-slate-900 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-brutal-sm hover:translate-y-[-1px] transition-all"
                          title="Delete Assessment"
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => onToggleTestActive(test.id)}
                      className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white border-2 border-slate-900 rounded-xl cursor-pointer shadow-brutal-sm hover:translate-y-[-1px] transition-all btn-brutal-press ${
                        test.active
                          ? 'bg-rose-500 hover:bg-rose-450'
                          : 'bg-emerald-500 hover:bg-emerald-450'
                      }`}
                    >
                      {test.active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: CREDENTIALS MANAGER & REGISTER STUDENT USER */}
        {activeTab === 'credentials' && (
          <motion.div
            key="credentials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Left: Standard Classroom Pupil List */}
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-slate-800">Pupil Accounts 👤</h2>
                <p className="text-xs font-semibold text-stone-400">
                  Manage classroom pupils. When they sign in with Google, their profile will automatically match by email or name.
                </p>
              </div>

              <div className="bg-white border-3 border-slate-900 rounded-2xl shadow-brutal p-4 max-h-[400px] overflow-y-auto pr-1">
                <div className="space-y-2.5">
                  {registeredStudents.map((stud) => (
                    <div
                      key={stud.username}
                      className="flex items-center justify-between gap-3 p-3.5 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-brutal-sm"
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <span className="text-xl select-none">👩‍🎓</span>
                        <div>
                          <h4 className="font-sans text-xs font-black text-slate-800">{stud.name}</h4>
                          <span className="block font-mono text-[9px] text-indigo-600 font-black">
                            Username: {stud.username}
                          </span>
                          {stud.email ? (
                            <span className="block text-[9px] text-emerald-600 font-extrabold uppercase mt-0.5">
                              📧 Google Linked: {stud.email}
                            </span>
                          ) : (
                            <span className="block text-[9px] text-amber-500 font-extrabold uppercase mt-0.5">
                              ⚠️ Google Not Linked Yet
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="px-2.5 py-1 bg-white border-2 border-slate-900 rounded-lg text-[9px] font-black uppercase text-slate-650">
                          Year {stud.yearGroup}
                        </span>
                        {stud.class && (
                          <span className="px-2 py-0.5 bg-indigo-55 border border-slate-300 rounded-md text-[8px] font-black uppercase text-indigo-700">
                            {stud.class.replace(/^(class\s+)/i, '')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Add student registration panel */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-slate-905 uppercase tracking-tight">Add Pupil Profile</h2>
                <p className="text-xs font-semibold text-stone-400">
                  Pre-register a student's name and school Google username to automatically match their progress.
                </p>
              </div>

              <form onSubmit={handleRegisterStudent} className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal space-y-4 text-left">
                {regSuccess && (
                  <div className="p-3 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-emerald-800 font-black text-xs shadow-brutal-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 fill-emerald-100" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label htmlFor="new-pupil-name" className="text-xs font-black text-slate-700 block select-none uppercase tracking-wide">
                    Student Full Name
                  </label>
                  <input
                    id="new-pupil-name"
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => {
                      setNewName(e.target.value);
                      setRegSuccess('');
                    }}
                    placeholder="e.g. Samuel Okyere"
                    className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl py-2 px-3 text-xs font-black focus:outline-none focus:bg-white text-slate-800 select-text"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="new-pupil-username" className="text-xs font-black text-slate-700 block select-none uppercase tracking-wide">
                    Google Email Prefix (e.g. sokyere.316)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="new-pupil-username"
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => {
                        setNewUsername(e.target.value);
                        setRegSuccess('');
                      }}
                      placeholder="e.g. sokyere.316"
                      className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl py-2 px-3 text-xs font-mono font-black placeholder:font-sans focus:outline-none focus:bg-white text-slate-800 select-text"
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 block p-0.5 select-none font-bold leading-none uppercase">
                    *Username is the part of their school Google email before the @ symbol.
                  </span>
                </div>

                <div className="space-y-1">
                  <label htmlFor="new-pupil-yeargroup" className="text-xs font-black text-slate-700 block select-none uppercase tracking-wide">
                    Subject Stage Year Group
                  </label>
                  <select
                    id="new-pupil-yeargroup"
                    value={newYearGroup}
                    onChange={(e) => setNewYearGroup(parseInt(e.target.value))}
                    className="py-1.5 px-3 bg-slate-50 border-2 border-slate-900 rounded-xl font-black text-xs focus:ring-0 focus:outline-none cursor-pointer w-full text-slate-800"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        Year {num}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-amber-400 hover:bg-amber-300 border-3 border-slate-900 rounded-xl text-slate-900 text-xs font-black cursor-pointer shadow-brutal hover:translate-y-[-1px] transition-all btn-brutal-press inline-flex items-center justify-center gap-1.5 uppercase tracking-wider"
                >
                  <UserPlus className="w-5 h-5 text-slate-800" />
                  Register Student Profile
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* TAB 5: ADMIN ROLE MANAGER */}
        {activeTab === 'admin' && isCurrentAdmin && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-black text-slate-905 uppercase tracking-tight">Administrative Staff Management 🛡️</h2>
              <p className="text-xs font-semibold text-stone-400">
                Grant or revoke administrator privileges for teaching staff members.
              </p>
            </div>

            <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal text-left space-y-4">
              <h3 className="text-sm font-black uppercase text-slate-800">Dersingham Faculty Members</h3>
              <div className="space-y-3">
                {registeredTeachers.map((teacher) => {
                  const isSelf = teacher.username === user.username;
                  return (
                    <div
                      key={teacher.username}
                      className="flex items-center justify-between gap-4 p-4 bg-slate-50 border-2 border-slate-900 rounded-xl shadow-brutal-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl select-none">👨‍🏫</span>
                        <div>
                          <h4 className="font-sans text-sm font-black text-slate-900">{teacher.name}</h4>
                          <span className="block font-mono text-[10px] text-indigo-600 font-black">
                            USO Username: {teacher.username}
                          </span>
                          <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-md border text-[9px] font-black uppercase ${
                            teacher.isAdmin
                              ? 'bg-rose-50 text-rose-700 border-rose-300'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}>
                            {teacher.isAdmin ? '👑 Administrator' : '🎓 Teacher'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelf ? (
                          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider select-none pr-2">
                            (Currently Logged In)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onToggleAdmin && onToggleAdmin(teacher.username)}
                            className={`px-3.5 py-1.5 text-xs font-black uppercase border-2 border-slate-900 rounded-xl cursor-pointer shadow-brutal-sm hover:translate-y-[-1px] transition-all btn-brutal-press ${
                              teacher.isAdmin
                                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                                : 'bg-rose-500 hover:bg-rose-400 text-white'
                            }`}
                          >
                            {teacher.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
          </>
        )}
      </AnimatePresence>

      {/* Custom Individual Delete Confirmation Modal Popup */}
      {deletingRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-slate-900 rounded-2xl max-w-md w-full p-6 shadow-brutal-lg relative animate-in zoom-in-95 duration-150 text-left animate-once">
            <button
              onClick={() => setDeletingRecord(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-black text-lg p-1.5 rounded-lg border-2 border-transparent hover:border-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              aria-label="Close dialog"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl p-2 bg-red-100 border-2 border-red-900 rounded-2xl">🗑️</span>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Confirm Record Deletion</h3>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Permanent Database Action</p>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-600 leading-relaxed mb-4">
              Are you sure you want to permanently delete this test record? This will allow the student to retake this test.
            </p>

            {/* Record Details Summary Box */}
            <div className="bg-slate-50 border-2 border-slate-900 rounded-xl p-3 mb-5 space-y-2">
              <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Assessment Details:</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[9px] font-black uppercase">Pupil Name</span>
                  <span className="text-slate-900">{deletingRecord.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-black uppercase">Username</span>
                  <span className="text-slate-900 uppercase">{deletingRecord.studentUsername}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-black uppercase">Subject</span>
                  <span className="text-slate-900 uppercase">{deletingRecord.subject}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-black uppercase">Test Sheet</span>
                  <span className="text-slate-900 truncate max-w-[120px]" title={deletingRecord.testTitle}>
                    {deletingRecord.testTitle}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-black uppercase">Score</span>
                  <span className="text-slate-900">{deletingRecord.score} / {deletingRecord.totalQuestions} ({deletingRecord.percentage}%)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-black uppercase">Date Finished</span>
                  <span className="text-slate-900">{new Date(deletingRecord.completedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 select-none">
              <button
                onClick={() => setDeletingRecord(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border-2 border-slate-900 rounded-xl shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[0px] transition-all cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                onClick={() => {
                  if (onDeleteScoreRecord) {
                    onDeleteScoreRecord(deletingRecord.id);
                  }
                  setDeletingRecord(null);
                }}
                className="px-4 py-2 text-xs font-black text-white bg-red-600 hover:bg-red-700 border-2 border-slate-900 rounded-xl shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[0px] transition-all cursor-pointer flex items-center gap-1.5"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📦 Custom Archive Current Data Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-slate-900 rounded-2xl max-w-md w-full p-6 shadow-brutal-lg relative animate-in zoom-in-95 duration-150 text-left">
            <button
              onClick={() => setShowArchiveModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-black text-lg p-1.5 rounded-lg border-2 border-transparent hover:border-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
              aria-label="Close dialog"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl p-2 bg-indigo-100 border-2 border-indigo-900 rounded-2xl">📦</span>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Archive Current Data</h3>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">End of Year Pupil Assessment Transition</p>
              </div>
            </div>

            {archiveStatusMsg ? (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-900 text-emerald-900 rounded-xl text-xs font-bold leading-relaxed mb-4">
                {archiveStatusMsg}
              </div>
            ) : (
              <form onSubmit={handleArchiveSubmit} className="space-y-4">
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  This action archives all pupil assessment submissions across all subjects (including Maths, Reading, GPS/SPaG, Science, History, Geography, Computing, Art, DT, Music, PSHE, RE, PE, etc.) that are currently active. Once archived, active performance charts and pupil gradebooks will be cleared, but you can view them anytime via the <strong className="text-slate-950">"Previous years"</strong> button.
                </p>
                <p className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 p-2.5 rounded-lg leading-relaxed">
                  🛡️ <strong>No assessment templates deleted:</strong> Your Assessment Editor templates, custom test structures, questions, and active tests are completely safe and will not be touched. You can reuse the exact same tests for new students next year!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      Subject Filter (Optional)
                    </label>
                    <select
                      value={archiveSubject}
                      onChange={(e) => setArchiveSubject(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-950 rounded-xl px-4 py-2 text-xs font-black select-text focus:outline-none focus:bg-white text-slate-800"
                    >
                      <option value="all">All Subjects</option>
                      <option value="maths">Mathematics</option>
                      <option value="reading">Reading / Reading Skills</option>
                      <option value="spag">GPS / SPaG</option>
                      <option value="science">Science</option>
                      <option value="history">History</option>
                      <option value="geography">Geography</option>
                      <option value="computing">Computing</option>
                      <option value="art">Art & Design</option>
                      <option value="dt">Design & Technology (DT)</option>
                      <option value="music">Music</option>
                      <option value="pshe">PSHE</option>
                      <option value="re">Religious Education (RE)</option>
                      <option value="pe">Physical Education (PE)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">
                      Term Filter (Optional)
                    </label>
                    <select
                      value={archiveTerm}
                      onChange={(e) => setArchiveTerm(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-950 rounded-xl px-4 py-2 text-xs font-black select-text focus:outline-none focus:bg-white text-slate-800"
                    >
                      <option value="all">All Terms</option>
                      <option value="Autumn 1">Autumn 1</option>
                      <option value="Autumn 2">Autumn 2</option>
                      <option value="Spring 1">Spring 1</option>
                      <option value="Spring 2">Spring 2</option>
                      <option value="Summer 1">Summer 1</option>
                      <option value="Summer 2">Summer 2</option>
                      <option value="Autumn Mid Point">Autumn Mid Point</option>
                      <option value="Autumn End Point">Autumn End Point</option>
                      <option value="Spring Mid Point">Spring Mid Point</option>
                      <option value="Spring End Point">Spring End Point</option>
                      <option value="Summer Mid Point">Summer Mid Point</option>
                      <option value="Summer End Point">Summer End Point</option>
                      <option value="Overall">Overall / End of Year</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    Archive Folder Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Academic Year 2025-2026"
                    value={archiveFolderName}
                    onChange={(e) => setArchiveFolderName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-950 rounded-xl px-4 py-2.5 text-xs font-black select-text focus:outline-none focus:bg-white text-slate-800"
                  />
                  <p className="text-[10px] text-stone-400 font-semibold italic">
                    Note: The pupil registrar (class roster) remains unchanged.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 select-none pt-2">
                  <button
                    type="button"
                    onClick={() => setShowArchiveModal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border-2 border-slate-900 rounded-xl shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[0px] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isArchiving}
                    className="px-4 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 border-2 border-slate-900 rounded-xl shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[0px] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {isArchiving ? 'Archiving...' : 'Confirm & Archive'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 📁 Previous Years Archive Dialog / Viewer */}
      {showPreviousYearsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-50 border-4 border-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-brutal-lg relative animate-in zoom-in-95 duration-150 text-left">
            <button
              onClick={() => setShowPreviousYearsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-black text-lg p-1.5 rounded-lg border-2 border-transparent hover:border-slate-900 hover:bg-slate-100 transition-all cursor-pointer z-10"
              aria-label="Close dialog"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-6 select-none border-b-2 border-slate-200 pb-4">
              <span className="text-3xl p-2 bg-indigo-100 border-2 border-indigo-900 rounded-2xl">📁</span>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Previous Years' Performance Archive</h3>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Multi-Step Curricular Diagnostic Database</p>
              </div>
            </div>

            {prevFoldersList.length === 0 ? (
              <div className="bg-white border-3 border-slate-900 rounded-2xl p-8 text-center space-y-4">
                <span className="text-4xl">🧹</span>
                <h4 className="text-sm font-black text-slate-800 uppercase">No Archived Performance Data</h4>
                <p className="text-xs text-slate-500 font-bold max-w-md mx-auto">
                  You haven't archived any active data folders yet. When you archive data from the main panel, it will be stored and indexed here for retro review.
                </p>
                <button
                  onClick={() => setShowPreviousYearsModal(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase rounded-xl border-2 border-slate-900 shadow-brutal-sm active:translate-y-[1px] cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Visual Step Progress Indicators */}
                <div className="grid grid-cols-6 gap-2 select-none border-b border-slate-200 pb-4">
                  {[
                    { step: 1, title: 'Folder' },
                    { step: 2, title: 'Year Group' },
                    { step: 3, title: 'Subject' },
                    { step: 4, title: 'Topic' },
                    { step: 5, title: 'Term' },
                    { step: 6, title: 'Test' },
                  ].map((s) => {
                    const isActive = s.step === activePrevStep;
                    const isCompleted = s.step < activePrevStep;
                    return (
                      <button
                        key={s.step}
                        onClick={() => {
                          if (s.step <= activePrevStep || (prevFolder && s.step === 1) || (prevFolder && prevYearGroup && s.step <= 3)) {
                            setActivePrevStep(s.step);
                          }
                        }}
                        className={`py-2 px-1 border-2 text-center rounded-xl transition-all cursor-pointer text-[10px] font-black uppercase ${
                          isActive
                            ? 'bg-indigo-600 border-slate-950 text-white shadow-brutal-sm'
                            : isCompleted
                            ? 'bg-emerald-100 border-emerald-800 text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-xs">Step {s.step}</span>
                        <span className="truncate block font-bold text-[8px] tracking-wide">{s.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* CURRENT ACTIVE STEP SELECTION INTERFACE */}
                <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-brutal-sm min-h-[140px] flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      {activePrevStep === 1 && 'Step 1: Choose Archived Folder Name'}
                      {activePrevStep === 2 && 'Step 2: Select Academic Year Group'}
                      {activePrevStep === 3 && 'Step 3: Select Curricular Subject Domain'}
                      {activePrevStep === 4 && 'Step 4: Select Subject Topic or Strand'}
                      {activePrevStep === 5 && 'Step 5: Pick Term Arrangement'}
                      {activePrevStep === 6 && 'Step 6: Refine Test / Assessment Focus'}
                    </h4>

                    {/* Step Options content */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {activePrevStep === 1 &&
                        prevFoldersList.map((folder) => (
                          <button
                            key={folder}
                            onClick={() => {
                              setPrevFolder(folder);
                              setActivePrevStep(2);
                            }}
                            className={`px-3 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm cursor-pointer ${
                              prevFolder === folder
                                ? 'bg-indigo-600 text-white border-slate-950 shadow-brutal'
                                : 'bg-slate-50 text-slate-800 border-slate-900 hover:bg-indigo-50'
                            }`}
                          >
                            📁 {folder}
                          </button>
                        ))}

                      {activePrevStep === 2 && (
                        <>
                          <button
                            onClick={() => {
                              setPrevYearGroup('all');
                              setActivePrevStep(3);
                            }}
                            className={`px-3 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm cursor-pointer ${
                              prevYearGroup === 'all'
                                ? 'bg-indigo-600 text-white border-slate-950 shadow-brutal'
                                : 'bg-slate-50 text-slate-800 border-slate-900 hover:bg-indigo-50'
                            }`}
                          >
                            🌍 All Year Groups
                          </button>
                          {prevYearsList.map((yr) => (
                            <button
                              key={yr}
                              onClick={() => {
                                setPrevYearGroup(yr.toString());
                                setActivePrevStep(3);
                              }}
                              className={`px-3 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm cursor-pointer ${
                                prevYearGroup === yr.toString()
                                  ? 'bg-indigo-600 text-white border-slate-950 shadow-brutal'
                                  : 'bg-slate-50 text-slate-800 border-slate-900 hover:bg-indigo-50'
                              }`}
                            >
                              Year {yr}
                            </button>
                          ))}
                        </>
                      )}

                      {activePrevStep === 3 && (
                        <>
                          <button
                            onClick={() => {
                              setPrevSubject('all');
                              setActivePrevStep(4);
                            }}
                            className={`px-3 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm cursor-pointer ${
                              prevSubject === 'all'
                                ? 'bg-indigo-600 text-white border-slate-950 shadow-brutal'
                                : 'bg-slate-50 text-slate-800 border-slate-900 hover:bg-indigo-50'
                            }`}
                          >
                            📚 All Subjects
                          </button>
                          {prevSubjectsList.map((subj) => (
                            <button
                              key={subj}
                              onClick={() => {
                                setPrevSubject(subj);
                                setActivePrevStep(4);
                              }}
                              className={`px-3 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm cursor-pointer ${
                                prevSubject === subj
                                  ? 'bg-indigo-600 text-white border-slate-950 shadow-brutal'
                                  : 'bg-slate-50 text-slate-800 border-slate-900 hover:bg-indigo-50'
                              }`}
                            >
                              {subj === 'spag' ? 'GPS / SPAG' : subj.toUpperCase()}
                            </button>
                          ))}
                        </>
                      )}

                      {activePrevStep === 4 && (
                        <>
                          <button
                            onClick={() => {
                              setPrevStrand('all');
                              setActivePrevStep(5);
                            }}
                            className={`px-3 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm cursor-pointer ${
                              prevStrand === 'all'
                                ? 'bg-indigo-600 text-white border-slate-950 shadow-brutal'
                                : 'bg-slate-50 text-slate-800 border-slate-900 hover:bg-indigo-50'
                            }`}
                          >
                            🏷️ All Topics / Strands
                          </button>
                          {prevStrandsList.map((strand) => (
                            <button
                              key={strand}
                              onClick={() => {
                                setPrevStrand(strand);
                                setActivePrevStep(5);
                              }}
                              className={`px-3 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm cursor-pointer ${
                                prevStrand === strand
                                  ? 'bg-indigo-600 text-white border-slate-950 shadow-brutal'
                                  : 'bg-slate-50 text-slate-800 border-slate-900 hover:bg-indigo-50'
                              }`}
                            >
                              {strand}
                            </button>
                          ))}
                        </>
                      )}

                      {activePrevStep === 5 && (
                        <>
                          <button
                            onClick={() => {
                              setPrevTerm('all');
                              setActivePrevStep(6);
                            }}
                            className={`px-3 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm cursor-pointer ${
                              prevTerm === 'all'
                                ? 'bg-indigo-600 text-white border-slate-950 shadow-brutal'
                                : 'bg-slate-50 text-slate-800 border-slate-900 hover:bg-indigo-50'
                            }`}
                          >
                            🗓️ All Terms
                          </button>
                          {prevTermsList.map((term) => (
                            <button
                              key={term}
                              onClick={() => {
                                setPrevTerm(term);
                                setActivePrevStep(6);
                              }}
                              className={`px-3 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm cursor-pointer ${
                                prevTerm === term
                                  ? 'bg-indigo-600 text-white border-slate-950 shadow-brutal'
                                  : 'bg-slate-50 text-slate-800 border-slate-900 hover:bg-indigo-50'
                              }`}
                            >
                              {term}
                            </button>
                          ))}
                        </>
                      )}

                      {activePrevStep === 6 && (
                        <>
                          <button
                            onClick={() => {
                              setPrevTest('all');
                            }}
                            className={`px-3 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm cursor-pointer ${
                              prevTest === 'all'
                                ? 'bg-indigo-600 text-white border-slate-950 shadow-brutal'
                                : 'bg-slate-50 text-slate-800 border-slate-900 hover:bg-indigo-50'
                            }`}
                          >
                            📝 All Tests
                          </button>
                          {prevTestsList.map((t) => (
                            <button
                              key={t}
                              onClick={() => {
                                setPrevTest(t);
                              }}
                              className={`px-3 py-2 border-2 rounded-xl text-xs font-black uppercase transition-all shadow-brutal-sm cursor-pointer ${
                                prevTest === t
                                  ? 'bg-indigo-600 text-white border-slate-950 shadow-brutal'
                                  : 'bg-slate-50 text-slate-800 border-slate-900 hover:bg-indigo-50'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Wizard control buttons */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 select-none">
                    <button
                      type="button"
                      disabled={activePrevStep === 1}
                      onClick={() => setActivePrevStep((prev) => prev - 1)}
                      className="px-3.5 py-1.5 border-2 border-slate-950 rounded-lg text-xs font-bold text-slate-700 bg-white shadow-brutal-sm hover:translate-y-[-1px] disabled:opacity-40 disabled:hover:translate-y-0 cursor-pointer"
                    >
                      ← Back
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActivePrevStep(1);
                          setPrevFolder('');
                          setPrevYearGroup('all');
                          setPrevSubject('all');
                          setPrevStrand('all');
                          setPrevTerm('all');
                          setPrevTest('all');
                        }}
                        className="px-3 py-1.5 text-xs text-red-600 hover:text-red-700 font-bold uppercase"
                      >
                        Reset All Filters
                      </button>
                      {activePrevStep < 6 && (
                        <button
                          type="button"
                          onClick={() => setActivePrevStep((prev) => prev + 1)}
                          className="px-4 py-1.5 border-2 border-slate-950 bg-slate-950 text-white text-xs font-bold rounded-lg shadow-brutal-sm hover:translate-y-[-1px] cursor-pointer"
                        >
                          Next →
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* ARCHIVED DATA ANALYTICS & GRADEBOOK DISPLAY */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-black text-slate-800 uppercase tracking-tight">
                      Archived Diagnostics Results ({filteredArchivedRecords.length} records matched)
                    </h4>
                    {filteredArchivedRecords.length > 0 && (
                      <div className="flex gap-4 text-xs font-bold uppercase text-slate-500 bg-white px-3 py-1 border-2 border-slate-900 rounded-xl">
                        <span>Average Percentage: <strong className="text-slate-900 font-black">{Math.round(filteredArchivedRecords.reduce((sum, r) => sum + r.percentage, 0) / filteredArchivedRecords.length)}%</strong></span>
                      </div>
                    )}
                  </div>

                  {filteredArchivedRecords.length === 0 ? (
                    <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl py-12 text-center text-xs font-bold text-slate-400">
                      No results matched the current criteria. Ensure you have made selections across the steps above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left Side: Chart */}
                      <div className="bg-white border-3 border-slate-900 rounded-2xl p-4 shadow-brutal-sm">
                        <span className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-wider">
                          Pupil Performance Averaging Chart
                        </span>
                        {archivedChartData.length > 0 ? (
                          <div className="w-full h-60">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={archivedChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="#1e293b" fontSize={9} fontWeight="bold" />
                                <YAxis stroke="#1e293b" fontSize={9} fontWeight="bold" />
                                <Tooltip />
                                <Bar dataKey="Average Score %" fill="#6366f1" radius={[4, 4, 0, 0]} stroke="#0f172a" strokeWidth={2} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        ) : (
                          <div className="h-60 flex items-center justify-center text-xs text-stone-400 font-bold">
                            Not enough data to display chart.
                          </div>
                        )}
                      </div>

                      {/* Right Side: Gradebook list */}
                      <div className="bg-white border-3 border-slate-900 rounded-2xl p-4 shadow-brutal-sm max-h-[300px] overflow-y-auto">
                        <span className="block text-[10px] font-black uppercase text-slate-500 mb-3 tracking-wider">
                          Pupil Gradebook Archive
                        </span>
                        <div className="space-y-2">
                          {filteredArchivedRecords.map((rec) => (
                            <div key={rec.id} className="flex items-center justify-between p-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl hover:bg-indigo-50 transition-all text-xs font-bold">
                              <div>
                                <span className="block text-slate-900">{rec.studentName}</span>
                                <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wide">
                                  {rec.subject === 'spag' ? 'GPS / SPAG' : rec.subject.toUpperCase()} • {rec.testTitle}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="block text-slate-900 font-black">{rec.score} / {rec.totalQuestions}</span>
                                <span className="text-[9px] px-1.5 py-0.5 bg-indigo-100 border border-indigo-300 rounded text-indigo-700 font-extrabold">{rec.percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end border-t border-slate-200 pt-4 mt-6">
              <button
                onClick={() => setShowPreviousYearsModal(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase rounded-xl border-2 border-slate-900 shadow-brutal-sm active:translate-y-[1px] cursor-pointer"
              >
                Close Archive Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PDF REPORT GENERATION MODAL WITH TEACHER REMARKS                          */}
      {/* ========================================================================= */}
      {isPdfModalOpen && (() => {
        const activePupil = allProgressPupils.find((p) => p.id === selectedProgressStudentId);
        if (!activePupil) return null;

        const fullHistory = getStudentHistory(activePupil);
        const filteredHistory = fullHistory.filter((rec) => {
          if (progressTermFilter === 'All Terms') return true;
          return rec.testTitle.toLowerCase().includes(progressTermFilter.toLowerCase()) ||
                 rec.completedAt.toLowerCase().includes(progressTermFilter.toLowerCase());
        });

        const appendRemark = (text: string) => {
          setPdfRemarks((prev) => (prev ? `${prev} ${text}` : text));
        };

        return (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 max-w-2xl w-full shadow-brutal-lg space-y-5 text-left max-h-[90vh] overflow-y-auto">
              
              {/* Header Banner inside Modal */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border-2 border-slate-900 flex items-center justify-between shadow-brutal-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white p-1 rounded-xl border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-xs">
                    <img src="/dersingham_logo.png" alt="Dersingham Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase text-amber-400 tracking-widest">
                      Dersingham Primary School Report Generator
                    </span>
                    <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                      <FileDown className="w-5 h-5 text-emerald-400" />
                      <span>Pupil Summary Report (PDF)</span>
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="w-8 h-8 bg-slate-800 hover:bg-rose-600 text-white rounded-xl border-2 border-slate-700 flex items-center justify-center font-black text-sm transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Pupil Info Summary Strip */}
              <div className="bg-indigo-50 border-3 border-slate-900 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-brutal-xs">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider block">Selected Pupil</span>
                  <span className="text-base font-black text-slate-950 block">
                    {activePupil.firstName} {activePupil.lastName}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    Class {activePupil.class || 'N/A'} • Year {activePupil.yearGroup}
                  </span>
                </div>

                <div className="bg-white px-3 py-1.5 border-2 border-slate-900 rounded-xl text-right">
                  <span className="text-[9px] font-black uppercase text-slate-400 block">Scope / Term</span>
                  <span className="text-xs font-black text-slate-900">{progressTermFilter}</span>
                  <span className="text-[10px] font-bold text-emerald-600 block">{filteredHistory.length} Test Records</span>
                </div>
              </div>

              {/* Teacher Remarks & Target Areas Input */}
              <div className="space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                  Teacher Remarks & Target Areas (Optional)
                </label>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Type custom comments or click any suggestion chip below to append feedback directly into the PDF report box before downloading.
                </p>

                {/* Quick Suggestion Chips */}
                <div className="flex flex-wrap gap-1.5 py-1">
                  <button
                    type="button"
                    onClick={() => appendRemark("Demonstrating strong academic progress across all core subjects.")}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-100 text-slate-800 border-2 border-slate-900 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer shadow-brutal-xs active:translate-y-[1px]"
                  >
                    🌟 Strong Progress Overall
                  </button>
                  <button
                    type="button"
                    onClick={() => appendRemark("Focus recommended on reading comprehension inference and vocabulary.")}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-100 text-slate-800 border-2 border-slate-900 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer shadow-brutal-xs active:translate-y-[1px]"
                  >
                    📖 Reading Inference Target
                  </button>
                  <button
                    type="button"
                    onClick={() => appendRemark("Excellent mathematical reasoning and confident problem-solving skills.")}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-100 text-slate-800 border-2 border-slate-900 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer shadow-brutal-xs active:translate-y-[1px]"
                  >
                    🔢 Maths Reasoning Strength
                  </button>
                  <button
                    type="button"
                    onClick={() => appendRemark("Consistently meeting expected standards in SPaG and grammar rules.")}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-100 text-slate-800 border-2 border-slate-900 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer shadow-brutal-xs active:translate-y-[1px]"
                  >
                    ✒️ SPaG Standard Met
                  </button>
                  <button
                    type="button"
                    onClick={() => appendRemark("Target: practice multiplication tables and rapid mental arithmetic recall.")}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-100 text-slate-800 border-2 border-slate-900 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer shadow-brutal-xs active:translate-y-[1px]"
                  >
                    🎯 Multiplication Recall Target
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={pdfRemarks}
                  onChange={(e) => setPdfRemarks(e.target.value)}
                  placeholder="Enter custom remarks for the pupil, strengths, or specific target focus areas for parents..."
                  className="w-full p-3 bg-slate-50 border-3 border-slate-900 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 shadow-inner"
                />
              </div>

              {/* Teacher Signature Field */}
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800">
                  Teacher Name / Signature Line
                </label>
                <input
                  type="text"
                  value={pdfTeacherSignature}
                  onChange={(e) => setPdfTeacherSignature(e.target.value)}
                  placeholder="e.g. Mr. J. Riste (Class Teacher)"
                  className="w-full p-2.5 bg-slate-50 border-3 border-slate-900 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:bg-white shadow-inner"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t-2 border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPdfModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold text-xs uppercase rounded-xl border-2 border-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await generateStudentPdfReport(
                      activePupil,
                      filteredHistory,
                      progressTermFilter,
                      pdfRemarks,
                      pdfTeacherSignature
                    );
                    setIsPdfModalOpen(false);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wide rounded-xl border-3 border-slate-900 shadow-brutal hover:shadow-brutal-lg transition-all flex items-center gap-2 cursor-pointer active:translate-y-[1px]"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
