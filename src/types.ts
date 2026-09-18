/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'student' | 'teacher';

export interface User {
  username: string;
  name: string;
  role: Role;
  yearGroup?: number;
  class?: string;
  classSetDate?: string;
  isAdmin?: boolean;
  email?: string;
  googleId?: string;
  pupilPremium?: boolean;
  send?: string | boolean;
  leadSubject?: string;
}

export interface RosterStudent {
  id: string;
  firstName: string;
  lastName: string;
  yearGroup: number;
  class: string;
  pupilPremium: boolean;
  send: string | boolean;
  googleId?: string;
  email?: string;
}

export type Subject =
  | 'maths'
  | 'reading'
  | 'spag'
  | 'science'
  | 'history'
  | 'geography'
  | 'computing'
  | 'art'
  | 'dt'
  | 'music'
  | 'pshe'
  | 're'
  | 'pe';

export interface Question {
  id: string;
  text: string;
  options: string[]; // Always provide multi-choice for playful kid-friendly buttons
  correctAnswer: string;
  marks: number;
  hint?: string;
  linkedLearningGoal?: string;
  explanation?: string;
  imageLink?: string;
  type?: string;
}

export interface Test {
  id: string;
  title: string;
  subject: Subject;
  yearGroup: number;
  timeLimitSeconds: number;
  questions: Question[];
  active: boolean;
  createdByClass?: string;
  createdByTeacher?: string;
}

export interface ScoreRecord {
  id: string;
  studentUsername: string;
  studentName: string;
  yearGroup: number;
  testId: string;
  testTitle: string;
  subject: Subject;
  score: number;
  totalQuestions: number;
  percentage: number;
  durationSeconds: number;
  completedAt: string;
  archiveFolder?: string;
  archivedStudentName?: string;
  archivedYearGroup?: number;
  archivedClass?: string;
}

export interface ScienceQuestion {
  qNum: number;
  text: string;
  learningObjective: string;
  correctAnswer: string;
}

export interface ScienceAssessment {
  id: string;
  title: string;
  yearGroup: string;
  questions: ScienceQuestion[];
}

export interface ScienceAnswer {
  chosen: string;
  isCorrect: boolean;
}

export interface ScienceSubmission {
  id: string;
  studentName: string;
  studentClass: string;
  assessmentId: string;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  answers: {
    [qNum: string]: ScienceAnswer;
  };
  archiveFolder?: string;
  archivedStudentName?: string;
  archivedYearGroup?: number;
  archivedClass?: string;
}
