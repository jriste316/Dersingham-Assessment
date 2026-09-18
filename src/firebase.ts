/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  collection,
  getDocs,
  getDocFromServer,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  addDoc,
  getDoc
} from 'firebase/firestore';
import { Test, ScoreRecord, User, ScienceAssessment, ScienceSubmission, RosterStudent } from './types';
import { DEFAULT_TESTS, TEST_BANK, MOCK_SCORE_RECORDS, MOCK_PUPILS } from './data';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

// Always initialize Firestore with the correct database ID if specified
export const db = firebaseConfig.firestoreDatabaseId
  ? initializeFirestore(app, { ignoreUndefinedProperties: true }, firebaseConfig.firestoreDatabaseId)
  : initializeFirestore(app, { ignoreUndefinedProperties: true });

// Attach collection compatibility helper so db.collection('submissions').add(...) works natively
(db as any).collection = (colName: string) => ({
  add: async (data: any) => {
    return await addDoc(collection(db, colName), data);
  },
  doc: (docId: string) => ({
    set: async (data: any) => setDoc(doc(db, colName, docId), data),
    get: async () => getDoc(doc(db, colName, docId)),
    delete: async () => deleteDoc(doc(db, colName, docId)),
  }),
  get: async () => getDocs(collection(db, colName)),
});

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Connection check on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or network status.");
    }
  }
}
testConnection();

// Define Firestore Collections
const TESTS_COLLECTION = 'tests';
const SCORE_RECORDS_COLLECTION = 'scoreRecords';
const SUBMISSIONS_COLLECTION = 'submissions';
const REGISTERED_STUDENTS_COLLECTION = 'registeredStudents';

// Fetch all tests from Firestore, seed if empty or ensure TEST_BANK is present
export async function getDbTests(): Promise<Test[]> {
  try {
    const querySnapshot = await getDocs(collection(db, TESTS_COLLECTION));
    if (querySnapshot.empty) {
      console.log('Seeding initial default tests and TEST_BANK to Firestore...');
      const batch = writeBatch(db);
      DEFAULT_TESTS.forEach((test) => {
        const testRef = doc(db, TESTS_COLLECTION, test.id);
        batch.set(testRef, test);
      });
      await batch.commit();
      return DEFAULT_TESTS;
    }
    
    const tests: Test[] = [];
    const testIds = new Set<string>();
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Test;
      tests.push(data);
      testIds.add(data.id);
    });

    // Ensure all 20-question tests from TEST_BANK exist in Firestore
    const missingBankTests = TEST_BANK.filter(bt => !testIds.has(bt.id));
    if (missingBankTests.length > 0) {
      console.log(`Seeding ${missingBankTests.length} missing TEST_BANK tests to Firestore...`);
      const batch = writeBatch(db);
      missingBankTests.forEach(test => {
        const testRef = doc(db, TESTS_COLLECTION, test.id);
        batch.set(testRef, test);
        tests.unshift(test);
      });
      await batch.commit();
    }

    return tests;
  } catch (error) {
    console.error('Error fetching tests from Firestore:', error);
    return DEFAULT_TESTS;
  }
}

// Save a student submission to the 'submissions' collection
export async function saveDbSubmission(submissionData: any): Promise<any> {
  try {
    const result = await (db as any).collection(SUBMISSIONS_COLLECTION).add(submissionData);
    return result;
  } catch (error) {
    console.error('Error saving submission to Firestore submissions collection:', error);
    return null;
  }
}

// Save or Update a single test in Firestore
export async function saveDbTest(test: Test): Promise<void> {
  try {
    const testRef = doc(db, TESTS_COLLECTION, test.id);
    await setDoc(testRef, test);
  } catch (error) {
    console.error('Error saving test to Firestore:', error);
  }
}

// Fetch all score records from Firestore, seed if empty
export async function getDbScoreRecords(): Promise<ScoreRecord[]> {
  try {
    const querySnapshot = await getDocs(collection(db, SCORE_RECORDS_COLLECTION));
    if (querySnapshot.empty) {
      console.log('Seeding initial mock score records to Firestore...');
      const batch = writeBatch(db);
      MOCK_SCORE_RECORDS.forEach((record) => {
        const recordRef = doc(db, SCORE_RECORDS_COLLECTION, record.id);
        batch.set(recordRef, record);
      });
      await batch.commit();
      return MOCK_SCORE_RECORDS;
    }

    const records: ScoreRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      records.push(docSnap.data() as ScoreRecord);
    });
    // Sort records descending by completedAt timestamp
    return records.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  } catch (error) {
    console.error('Error fetching score records from Firestore:', error);
    return MOCK_SCORE_RECORDS;
  }
}

// Save a new score record in Firestore
export async function saveDbScoreRecord(record: ScoreRecord): Promise<void> {
  try {
    const recordRef = doc(db, SCORE_RECORDS_COLLECTION, record.id);
    await setDoc(recordRef, record);
  } catch (error) {
    console.error('Error saving score record to Firestore:', error);
  }
}

// Clear all score records in Firestore
export async function clearDbScoreRecords(): Promise<void> {
  try {
    const querySnapshot = await getDocs(collection(db, SCORE_RECORDS_COLLECTION));
    const batch = writeBatch(db);
    querySnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error clearing score records from Firestore:', error);
  }
}

// Fetch registered student users, seed if empty
export async function getDbRegisteredStudents(): Promise<User[]> {
  try {
    const querySnapshot = await getDocs(collection(db, REGISTERED_STUDENTS_COLLECTION));
    if (querySnapshot.empty) {
      console.log('Seeding initial mock pupils to Firestore...');
      const batch = writeBatch(db);
      MOCK_PUPILS.forEach((student) => {
        const studentRef = doc(db, REGISTERED_STUDENTS_COLLECTION, student.username);
        batch.set(studentRef, student);
      });
      await batch.commit();
      return MOCK_PUPILS;
    }

    const students: User[] = [];
    querySnapshot.forEach((docSnap) => {
      students.push(docSnap.data() as User);
    });
    return students;
  } catch (error) {
    console.error('Error fetching registered students from Firestore:', error);
    return MOCK_PUPILS;
  }
}

// Save a single registered student in Firestore
export async function saveDbRegisteredStudent(student: User): Promise<void> {
  try {
    const studentRef = doc(db, REGISTERED_STUDENTS_COLLECTION, student.username);
    const cleanedStudent = Object.fromEntries(
      Object.entries(student).filter(([_, v]) => v !== undefined)
    );
    await setDoc(studentRef, cleanedStudent);
  } catch (error) {
    console.error('Error saving registered student to Firestore:', error);
  }
}

// Define Science Assessment Portal Collections
const ASSESSMENTS_COLLECTION = 'assessments';
const REGISTERED_TEACHERS_COLLECTION = 'registeredTeachers';

const SEED_ASSESSMENTS: ScienceAssessment[] = [
  {
    id: 'year5_earth_space',
    title: 'Year 5 Science: Earth and Space',
    yearGroup: 'Year 5',
    questions: [
      {
        qNum: 1,
        text: 'Which planet is the largest in our Solar System?',
        learningObjective: 'Identify planetary sizes',
        correctAnswer: 'Jupiter'
      },
      {
        qNum: 2,
        text: 'Which planet is the closest to the Sun?',
        learningObjective: 'Identify planetary sizes',
        correctAnswer: 'Mercury'
      },
      {
        qNum: 3,
        text: 'How long does it take for Earth to complete one full orbit around the Sun?',
        learningObjective: 'Understand planetary orbits',
        correctAnswer: '365 days'
      },
      {
        qNum: 4,
        text: 'What celestial body is at the center of our orbit system?',
        learningObjective: 'Understand planetary orbits',
        correctAnswer: 'The Sun'
      },
      {
        qNum: 5,
        text: 'What invisible force pulls objects down towards the center of the Earth?',
        learningObjective: 'Understand gravity and forces',
        correctAnswer: 'Gravity'
      },
      {
        qNum: 6,
        text: 'What force resists the movement of an object across a rough surface?',
        learningObjective: 'Understand gravity and forces',
        correctAnswer: 'Friction'
      }
    ]
  },
  {
    id: 'year6_light_electricity',
    title: 'Year 6 Science: Light and Electricity',
    yearGroup: 'Year 6',
    questions: [
      {
        qNum: 1,
        text: 'Does light travel in straight lines or curved lines?',
        learningObjective: 'Understand light propagation',
        correctAnswer: 'Straight lines'
      },
      {
        qNum: 2,
        text: 'What is a material that does not allow electricity to flow through it called?',
        learningObjective: 'Electrical insulators and conductors',
        correctAnswer: 'Insulator'
      },
      {
        qNum: 3,
        text: 'What unit is electrical current measured in?',
        learningObjective: 'Electrical circuits and measures',
        correctAnswer: 'Amperes'
      }
    ]
  }
];

const SEED_SUBMISSIONS: ScienceSubmission[] = [
  {
    id: 'sub_ykhan_1',
    studentName: 'Yasmin Khan',
    studentClass: 'Class JR-18',
    assessmentId: 'year5_earth_space',
    totalScore: 5,
    maxPossibleScore: 6,
    percentage: 83,
    answers: {
      '1': { chosen: 'Jupiter', isCorrect: true },
      '2': { chosen: 'Mercury', isCorrect: true },
      '3': { chosen: '365 days', isCorrect: true },
      '4': { chosen: 'The Sun', isCorrect: true },
      '5': { chosen: 'Gravity', isCorrect: true },
      '6': { chosen: 'Magnetism', isCorrect: false }
    }
  },
  {
    id: 'sub_ssmith_1',
    studentName: 'Sarah Smith',
    studentClass: 'Class JR-18',
    assessmentId: 'year5_earth_space',
    totalScore: 3,
    maxPossibleScore: 6,
    percentage: 50,
    answers: {
      '1': { chosen: 'Jupiter', isCorrect: true },
      '2': { chosen: 'Mars', isCorrect: false },
      '3': { chosen: '24 hours', isCorrect: false },
      '4': { chosen: 'Earth', isCorrect: false },
      '5': { chosen: 'Gravity', isCorrect: true },
      '6': { chosen: 'Friction', isCorrect: true }
    }
  },
  {
    id: 'sub_afarah_1',
    studentName: 'Abdi Farah',
    studentClass: 'Class MR-17',
    assessmentId: 'year5_earth_space',
    totalScore: 2,
    maxPossibleScore: 6,
    percentage: 33,
    answers: {
      '1': { chosen: 'Earth', isCorrect: false },
      '2': { chosen: 'Mercury', isCorrect: true },
      '3': { chosen: '30 days', isCorrect: false },
      '4': { chosen: 'The Moon', isCorrect: false },
      '5': { chosen: 'Gravity', isCorrect: true },
      '6': { chosen: 'Wind', isCorrect: false }
    }
  },
  {
    id: 'sub_mchen_1',
    studentName: 'Mei Chen',
    studentClass: 'Class JR-18',
    assessmentId: 'year5_earth_space',
    totalScore: 6,
    maxPossibleScore: 6,
    percentage: 100,
    answers: {
      '1': { chosen: 'Jupiter', isCorrect: true },
      '2': { chosen: 'Mercury', isCorrect: true },
      '3': { chosen: '365 days', isCorrect: true },
      '4': { chosen: 'The Sun', isCorrect: true },
      '5': { chosen: 'Gravity', isCorrect: true },
      '6': { chosen: 'Friction', isCorrect: true }
    }
  },
  {
    id: 'sub_jriste_1',
    studentName: 'Test account',
    studentClass: 'Class 18',
    assessmentId: 'year5_earth_space',
    totalScore: 4,
    maxPossibleScore: 6,
    percentage: 67,
    answers: {
      '1': { chosen: 'Jupiter', isCorrect: true },
      '2': { chosen: 'Mercury', isCorrect: true },
      '3': { chosen: '28 days', isCorrect: false },
      '4': { chosen: 'The Sun', isCorrect: true },
      '5': { chosen: 'Gravity', isCorrect: true },
      '6': { chosen: 'Magnetism', isCorrect: false }
    }
  }
];

export const DEFAULT_TEACHERS: User[] = [
  { username: 'joseph.riste@dersingham.newham.sch.uk', name: 'Mr. Joseph Riste', role: 'teacher', isAdmin: true },
  { username: 'jriste.316@dersingham.newham.sch.uk', name: 'Mr. J. Riste', role: 'teacher', isAdmin: true },
  { username: 'admin.316', name: 'Mrs. H. Campbell (Headteacher)', role: 'teacher', isAdmin: false }
];

// Fetch all Science Assessments
export async function getDbScienceAssessments(): Promise<ScienceAssessment[]> {
  try {
    const querySnapshot = await getDocs(collection(db, ASSESSMENTS_COLLECTION));
    if (querySnapshot.empty) {
      console.log('Seeding initial science assessments to Firestore...');
      const batch = writeBatch(db);
      SEED_ASSESSMENTS.forEach((assessment) => {
        const docRef = doc(db, ASSESSMENTS_COLLECTION, assessment.id);
        batch.set(docRef, assessment);
      });
      await batch.commit();
      return SEED_ASSESSMENTS;
    }

    const assessments: ScienceAssessment[] = [];
    querySnapshot.forEach((docSnap) => {
      assessments.push(docSnap.data() as ScienceAssessment);
    });
    return assessments;
  } catch (error) {
    console.error('Error fetching science assessments:', error);
    return SEED_ASSESSMENTS;
  }
}

// Fetch all Science Submissions
export async function getDbScienceSubmissions(): Promise<ScienceSubmission[]> {
  try {
    const querySnapshot = await getDocs(collection(db, SUBMISSIONS_COLLECTION));
    if (querySnapshot.empty) {
      console.log('Seeding initial science submissions to Firestore...');
      const batch = writeBatch(db);
      SEED_SUBMISSIONS.forEach((sub) => {
        const docRef = doc(db, SUBMISSIONS_COLLECTION, sub.id);
        batch.set(docRef, sub);
      });
      await batch.commit();
      return SEED_SUBMISSIONS;
    }

    const submissions: ScienceSubmission[] = [];
    querySnapshot.forEach((docSnap) => {
      submissions.push(docSnap.data() as ScienceSubmission);
    });
    return submissions;
  } catch (error) {
    console.error('Error fetching science submissions:', error);
    return SEED_SUBMISSIONS;
  }
}

// Save a new science submission
export async function saveDbScienceSubmission(submission: ScienceSubmission): Promise<void> {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, submission.id);
    await setDoc(docRef, submission);
  } catch (error) {
    console.error('Error saving science submission:', error);
  }
}

// Fetch all Registered Teachers (staff)
export async function getDbRegisteredTeachers(): Promise<User[]> {
  try {
    const querySnapshot = await getDocs(collection(db, REGISTERED_TEACHERS_COLLECTION));
    if (querySnapshot.empty) {
      console.log('Seeding default teachers to Firestore...');
      const batch = writeBatch(db);
      DEFAULT_TEACHERS.forEach((teacher) => {
        const docRef = doc(db, REGISTERED_TEACHERS_COLLECTION, teacher.username);
        batch.set(docRef, teacher);
      });
      await batch.commit();
      return DEFAULT_TEACHERS;
    }

    const teachers: User[] = [];
    querySnapshot.forEach((docSnap) => {
      teachers.push(docSnap.data() as User);
    });
    return teachers;
  } catch (error) {
    console.error('Error fetching registered teachers:', error);
    return DEFAULT_TEACHERS;
  }
}

// Save/Update a teacher (e.g. toggle isAdmin)
export async function saveDbRegisteredTeacher(teacher: User): Promise<void> {
  try {
    const docRef = doc(db, REGISTERED_TEACHERS_COLLECTION, teacher.username);
    const cleanedTeacher = Object.fromEntries(
      Object.entries(teacher).filter(([_, v]) => v !== undefined)
    );
    await setDoc(docRef, cleanedTeacher);
  } catch (error) {
    console.error('Error saving registered teacher:', error);
  }
}

// --- Pupil Roster Management ---
const PUPIL_ROSTER_COLLECTION = 'pupilRoster';

// Fetch all students in the school roster
export async function getDbPupilRoster(): Promise<RosterStudent[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PUPIL_ROSTER_COLLECTION));
    const roster: RosterStudent[] = [];
    querySnapshot.forEach((docSnap) => {
      roster.push(docSnap.data() as RosterStudent);
    });
    return roster;
  } catch (error) {
    console.error('Error fetching pupil roster from Firestore:', error);
    return [];
  }
}

// Save or Update a single roster student record
export async function saveDbRosterStudent(student: RosterStudent): Promise<void> {
  try {
    const docRef = doc(db, PUPIL_ROSTER_COLLECTION, student.id);
    const cleanedStudent = Object.fromEntries(
      Object.entries(student).filter(([_, v]) => v !== undefined)
    );
    await setDoc(docRef, cleanedStudent);
  } catch (error) {
    console.error('Error saving roster student to Firestore:', error);
  }
}

// Save a list of roster students in bulk using Batch
export async function saveDbRosterStudentsBulk(students: RosterStudent[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    students.forEach((student) => {
      const docRef = doc(db, PUPIL_ROSTER_COLLECTION, student.id);
      const cleanedStudent = Object.fromEntries(
        Object.entries(student).filter(([_, v]) => v !== undefined)
      );
      batch.set(docRef, cleanedStudent);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error bulk saving roster students to Firestore:', error);
    throw error;
  }
}

// Clear all pupil roster records
export async function clearDbPupilRoster(): Promise<void> {
  try {
    const querySnapshot = await getDocs(collection(db, PUPIL_ROSTER_COLLECTION));
    const batch = writeBatch(db);
    querySnapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error clearing pupil roster from Firestore:', error);
    throw error;
  }
}

// Delete a single roster student record from Firestore
export async function deleteDbRosterStudent(id: string): Promise<void> {
  try {
    const docRef = doc(db, PUPIL_ROSTER_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting roster student from Firestore:', error);
    throw error;
  }
}

// Delete a score record
export async function deleteDbScoreRecord(id: string): Promise<void> {
  try {
    const recordRef = doc(db, SCORE_RECORDS_COLLECTION, id);
    await deleteDoc(recordRef);
  } catch (error) {
    console.error('Error deleting score record from Firestore:', error);
  }
}

// Delete a science submission
export async function deleteDbScienceSubmission(id: string): Promise<void> {
  try {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting science submission from Firestore:', error);
  }
}

// Delete an assessment test
export async function deleteDbTest(id: string): Promise<void> {
  try {
    const docRef = doc(db, TESTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting test from Firestore:', error);
    throw error;
  }
}

// Archive all current non-archived score records and science submissions
export async function archiveDbRecords(folderName: string, subject?: string, term?: string): Promise<void> {
  try {
    const batch = writeBatch(db);
    let count = 0;

    // Fetch science assessments if we need to check terms for science submissions
    let assessments: ScienceAssessment[] = [];
    const needsScienceAssessments = term && term !== 'all' && term !== 'Overall';
    if (needsScienceAssessments) {
      assessments = await getDbScienceAssessments();
    }

    // Fetch roster and registered students to capture exact pupil details on archival
    const roster = await getDbPupilRoster();
    const registered = await getDbRegisteredStudents();
    const cleanStr = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    // 1. Score records
    const scoreSnapshot = await getDocs(collection(db, SCORE_RECORDS_COLLECTION));
    scoreSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data.archiveFolder) {
        // Filter subject
        if (subject && subject !== 'all' && data.subject !== subject) {
          return;
        }
        // Filter term
        if (term && term !== 'all' && term !== 'Overall') {
          const testTitle = data.testTitle || '';
          if (!testTitle.toLowerCase().includes(term.toLowerCase())) {
            return;
          }
        }

        // Capture exact details
        const student = registered.find((s) => s.username === data.studentUsername);
        const rStud = roster.find((r) =>
          r.email === student?.email ||
          r.googleId === student?.googleId ||
          (cleanStr(r.firstName) === cleanStr(student?.name.split(' ')[0] || '') &&
           cleanStr(r.lastName) === cleanStr(student?.name.split(' ').slice(1).join(' ') || ''))
        );
        const archivedStudentName = rStud ? `${rStud.firstName} ${rStud.lastName}` : (student?.name || data.studentName || '');
        const archivedYearGroup = rStud ? rStud.yearGroup : (student?.yearGroup || data.yearGroup || 0);
        const archivedClass = rStud ? rStud.class : (student?.class || 'Unassigned');

        batch.update(docSnap.ref, {
          archiveFolder: folderName,
          archivedStudentName,
          archivedYearGroup,
          archivedClass
        });
        count++;
      }
    });

    // 2. Science submissions
    const submissionSnapshot = await getDocs(collection(db, SUBMISSIONS_COLLECTION));
    submissionSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (!data.archiveFolder) {
        // Filter subject: Science submissions are always for 'science'
        if (subject && subject !== 'all' && subject !== 'science') {
          return;
        }
        // Filter term
        if (term && term !== 'all' && term !== 'Overall') {
          const assessment = assessments.find((a) => a.id === data.assessmentId);
          const testTitle = assessment?.title || data.assessmentId || '';
          if (!testTitle.toLowerCase().includes(term.toLowerCase())) {
            return;
          }
        }

        // Capture exact details
        const rStud = roster.find((r) => cleanStr(r.firstName + r.lastName) === cleanStr(data.studentName));
        const student = registered.find((s) => s.name === data.studentName || (rStud?.email && s.email === rStud.email));
        const archivedStudentName = rStud ? `${rStud.firstName} ${rStud.lastName}` : (student?.name || data.studentName || '');
        const archivedYearGroup = rStud ? rStud.yearGroup : (student?.yearGroup || (assessments.find((a) => a.id === data.assessmentId)?.yearGroup ? parseInt((assessments.find((a) => a.id === data.assessmentId)?.yearGroup || '').replace(/\D/g, '')) : 5));
        const archivedClass = rStud ? rStud.class : (student?.class || data.studentClass || 'Unassigned');

        batch.update(docSnap.ref, {
          archiveFolder: folderName,
          archivedStudentName,
          archivedYearGroup,
          archivedClass
        });
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
    }
  } catch (error) {
    console.error('Error archiving records in Firestore:', error);
    throw error;
  }
}

