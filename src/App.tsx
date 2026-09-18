/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle } from 'lucide-react';
import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import StudentPortal from './components/StudentPortal';
import TeacherDashboard from './components/TeacherDashboard';
import { Role, User, Test, ScoreRecord, ScienceAssessment, ScienceSubmission, RosterStudent } from './types';
import { DEFAULT_TESTS, MOCK_SCORE_RECORDS, MOCK_PUPILS } from './data';
import {
  getDbTests,
  saveDbTest,
  getDbScoreRecords,
  saveDbScoreRecord,
  clearDbScoreRecords,
  getDbRegisteredStudents,
  saveDbRegisteredStudent,
  getDbScienceAssessments,
  getDbScienceSubmissions,
  getDbRegisteredTeachers,
  saveDbRegisteredTeacher,
  getDbPupilRoster,
  saveDbRosterStudent,
  saveDbRosterStudentsBulk,
  clearDbPupilRoster,
  deleteDbRosterStudent,
  deleteDbScoreRecord,
  deleteDbScienceSubmission,
  deleteDbTest,
  archiveDbRecords
} from './firebase';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'login' | 'student-portal' | 'teacher-dashboard'>('welcome');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdminViewActive, setIsAdminViewActive] = useState<boolean>(false);

  // Dynamic shared database states
  const [tests, setTests] = useState<Test[]>(DEFAULT_TESTS);
  const [scoreRecords, setScoreRecords] = useState<ScoreRecord[]>(MOCK_SCORE_RECORDS);
  const [registeredStudents, setRegisteredStudents] = useState<User[]>(MOCK_PUPILS);
  const [registeredTeachers, setRegisteredTeachers] = useState<User[]>([]);
  const [scienceAssessments, setScienceAssessments] = useState<ScienceAssessment[]>([]);
  const [scienceSubmissions, setScienceSubmissions] = useState<ScienceSubmission[]>([]);
  const [pupilRoster, setPupilRoster] = useState<RosterStudent[]>([]);

  // Load datasets dynamically on mount from Firestore
  useEffect(() => {
    async function loadFirestoreData() {
      try {
        const [dbTests, dbRecords, dbStudents, dbTeachers, dbSciAssessments, dbSciSubmissions, dbRoster] = await Promise.all([
          getDbTests(),
          getDbScoreRecords(),
          getDbRegisteredStudents(),
          getDbRegisteredTeachers(),
          getDbScienceAssessments(),
          getDbScienceSubmissions(),
          getDbPupilRoster()
        ]);
        setTests(dbTests);
        setScoreRecords(dbRecords);
        setRegisteredStudents(dbStudents);
        setRegisteredTeachers(dbTeachers);
        setScienceAssessments(dbSciAssessments);
        setScienceSubmissions(dbSciSubmissions);
        setPupilRoster(dbRoster);
      } catch (error) {
        console.error("Firestore initialization failed. Using memory fallback data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFirestoreData();
  }, []);

  const handleToggleAdmin = (teacherUsername: string) => {
    let updatedTeacher: User | null = null;
    setRegisteredTeachers((prev) =>
      prev.map((t) => {
        if (t.username === teacherUsername) {
          updatedTeacher = { ...t, isAdmin: !t.isAdmin };
          return updatedTeacher;
        }
        return t;
      })
    );
    setTimeout(() => {
      if (updatedTeacher) {
        saveDbRegisteredTeacher(updatedTeacher);
      }
    }, 0);
  };

  const handleNavigation = (screen: 'welcome' | 'login', role?: Role) => {
    if (role) setSelectedRole(role);
    if (screen === 'welcome') {
      setSelectedRole(null);
      setCurrentUser(null);
    }
    setCurrentScreen(screen);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'student') {
      // Direct student to classroom stage select phase immediately!
      setCurrentScreen('student-portal');
    } else {
      // Direct teacher to analytic class graphs dashboard immediately!
      setCurrentScreen('teacher-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentScreen('welcome');
    setSelectedRole(null);
    setCurrentUser(null);
    setIsAdminViewActive(false);
  };

  // Shared Action triggers synced with Firebase Firestore:
  // --- Teacher modifications ---
  const handleToggleTestActive = (testId: string) => {
    let updatedTest: Test | null = null;
    setTests((prev) =>
      prev.map((t) => {
        if (t.id === testId) {
          updatedTest = { ...t, active: !t.active };
          return updatedTest;
        }
        return t;
      })
    );
    setTimeout(() => {
      if (updatedTest) {
        saveDbTest(updatedTest);
      }
    }, 0);
  };

  const handleUpdateTestTimeLimit = (testId: string, minutes: number) => {
    let updatedTest: Test | null = null;
    setTests((prev) =>
      prev.map((t) => {
        if (t.id === testId) {
          updatedTest = { ...t, timeLimitSeconds: minutes * 60 };
          return updatedTest;
        }
        return t;
      })
    );
    setTimeout(() => {
      if (updatedTest) {
        saveDbTest(updatedTest);
      }
    }, 0);
  };

  const handleClearHistory = () => {
    setScoreRecords([]);
    clearDbScoreRecords();
  };

  const handleAddStudent = (
    username: string, 
    name: string, 
    yearGroup: number, 
    email?: string, 
    googleId?: string,
    studentClass?: string,
    classSetDate?: string
  ) => {
    const newStudent: User = {
      username,
      name,
      role: 'student',
      yearGroup,
      email,
      googleId,
      class: studentClass,
      classSetDate,
    };
    setRegisteredStudents((prev) => {
      if (prev.some((s) => s.username === username)) {
        return prev.map((s) => (s.username === username ? { 
          ...s, 
          name, 
          yearGroup, 
          email, 
          googleId,
          class: studentClass || s.class,
          classSetDate: classSetDate || s.classSetDate
        } : s));
      }
      return [...prev, newStudent];
    });
    saveDbRegisteredStudent(newStudent);
  };

  const handleAddTeacher = (username: string, name: string, email?: string, googleId?: string) => {
    const isJosephRiste = 
      username.toLowerCase() === 'joseph.riste' || 
      username.toLowerCase() === 'joseph.riste@dersingham.newham.sch.uk' ||
      username.toLowerCase() === 'jriste.316' ||
      username.toLowerCase() === 'jriste.316@dersingham.newham.sch.uk' ||
      (email && (email.toLowerCase() === 'joseph.riste@dersingham.newham.sch.uk' || email.toLowerCase() === 'jriste.316@dersingham.newham.sch.uk'));
    const newTeacher: User = {
      username,
      name,
      role: 'teacher',
      isAdmin: isJosephRiste ? true : false,
      email,
      googleId,
    };
    setRegisteredTeachers((prev) => {
      if (prev.some((t) => t.username === username)) {
        return prev.map((t) => (t.username === username ? { ...t, name, email, googleId } : t));
      }
      return [...prev, newTeacher];
    });
    saveDbRegisteredTeacher(newTeacher);
  };

  // --- Student modifications ---
  const handleSaveScore = (newPayload: Omit<ScoreRecord, 'id' | 'completedAt'>) => {
    const mockId = 'rec-saved-' + Date.now();
    const newRecord: ScoreRecord = {
      ...newPayload,
      id: mockId,
      completedAt: new Date().toISOString(),
    };
    setScoreRecords((prev) => [newRecord, ...prev]);
    saveDbScoreRecord(newRecord);
  };

  const handleDeleteScoreRecord = async (recordId: string) => {
    // Check if score record
    const isScoreRec = scoreRecords.some((r) => r.id === recordId);
    if (isScoreRec) {
      setScoreRecords((prev) => prev.filter((r) => r.id !== recordId));
      await deleteDbScoreRecord(recordId);
    } else {
      // Check if science submission
      setScienceSubmissions((prev) => prev.filter((s) => s.id !== recordId));
      await deleteDbScienceSubmission(recordId);
    }
  };

  const handleSaveTest = (updatedTest: Test) => {
    setTests((prev) => {
      if (prev.some((t) => t.id === updatedTest.id)) {
        return prev.map((t) => (t.id === updatedTest.id ? updatedTest : t));
      }
      return [...prev, updatedTest];
    });
    saveDbTest(updatedTest);
  };

  const handleDeleteTest = async (testId: string) => {
    setTests((prev) => prev.filter((t) => t.id !== testId));
    try {
      await deleteDbTest(testId);
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const handleArchiveCurrentData = async (folderName: string, subject?: string, term?: string) => {
    const cleanStr = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    setScoreRecords((prev) =>
      prev.map((rec) => {
        if (rec.archiveFolder) return rec;
        if (subject && subject !== 'all' && rec.subject !== subject) return rec;
        if (term && term !== 'all' && term !== 'Overall' && !rec.testTitle.toLowerCase().includes(term.toLowerCase())) return rec;

        const student = registeredStudents.find((s) => s.username === rec.studentUsername);
        const rStud = pupilRoster.find((r) =>
          r.email === student?.email ||
          r.googleId === student?.googleId ||
          (cleanStr(r.firstName) === cleanStr(student?.name.split(' ')[0] || '') &&
           cleanStr(r.lastName) === cleanStr(student?.name.split(' ').slice(1).join(' ') || ''))
        );
        const archivedStudentName = rStud ? `${rStud.firstName} ${rStud.lastName}` : (student?.name || rec.studentName);
        const archivedYearGroup = rStud ? rStud.yearGroup : (student?.yearGroup || rec.yearGroup);
        const archivedClass = rStud ? rStud.class : (student?.class || 'Unassigned');

        return {
          ...rec,
          archiveFolder: folderName,
          archivedStudentName,
          archivedYearGroup,
          archivedClass
        };
      })
    );
    setScienceSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.archiveFolder) return sub;
        if (subject && subject !== 'all' && subject !== 'science') return sub;
        const assessment = scienceAssessments.find((a) => a.id === sub.assessmentId);
        const testTitle = assessment?.title || sub.assessmentId || '';
        if (term && term !== 'all' && term !== 'Overall' && !testTitle.toLowerCase().includes(term.toLowerCase())) return sub;

        const rStud = pupilRoster.find((r) => cleanStr(r.firstName + r.lastName) === cleanStr(sub.studentName));
        const student = registeredStudents.find((s) => s.name === sub.studentName || (rStud?.email && s.email === rStud.email));
        const archivedStudentName = rStud ? `${rStud.firstName} ${rStud.lastName}` : (student?.name || sub.studentName);
        const archivedYearGroup = rStud ? rStud.yearGroup : (student?.yearGroup || (assessment?.yearGroup ? parseInt(assessment.yearGroup.replace(/\D/g, '')) : 5));
        const archivedClass = rStud ? rStud.class : (student?.class || sub.studentClass || 'Unassigned');

        return {
          ...sub,
          archiveFolder: folderName,
          archivedStudentName,
          archivedYearGroup,
          archivedClass
        };
      })
    );
    try {
      await archiveDbRecords(folderName, subject, term);
    } catch (error) {
      console.error('Error archiving records:', error);
    }
  };

  const handleUpdateTeacherClass = (teacherUsername: string, teacherClass: string) => {
    let updatedTeacher: User | null = null;
    setRegisteredTeachers((prev) =>
      prev.map((t) => {
        if (t.username === teacherUsername) {
          updatedTeacher = { ...t, class: teacherClass };
          return updatedTeacher;
        }
        return t;
      })
    );
    if (currentUser && currentUser.username === teacherUsername) {
      setCurrentUser((prev) => prev ? { ...prev, class: teacherClass } : null);
    }
    setTimeout(() => {
      if (updatedTeacher) {
        saveDbRegisteredTeacher(updatedTeacher);
      }
    }, 0);
  };

  const handleUpdateTeacherYearGroup = (teacherUsername: string, yearGroup: number | undefined) => {
    let updatedTeacher: User | null = null;
    setRegisteredTeachers((prev) =>
      prev.map((t) => {
        if (t.username === teacherUsername) {
          updatedTeacher = { ...t, yearGroup };
          return updatedTeacher;
        }
        return t;
      })
    );
    if (currentUser && currentUser.username === teacherUsername) {
      setCurrentUser((prev) => prev ? { ...prev, yearGroup } : null);
    }
    setTimeout(() => {
      if (updatedTeacher) {
        saveDbRegisteredTeacher(updatedTeacher);
      }
    }, 0);
  };

  const handleUpdateTeacherLeadSubject = (teacherUsername: string, leadSubject: string | undefined) => {
    let updatedTeacher: User | null = null;
    setRegisteredTeachers((prev) =>
      prev.map((t) => {
        if (t.username === teacherUsername) {
          updatedTeacher = { ...t, leadSubject };
          return updatedTeacher;
        }
        return t;
      })
    );
    if (currentUser && currentUser.username === teacherUsername) {
      setCurrentUser((prev) => prev ? { ...prev, leadSubject } : null);
    }
    setTimeout(() => {
      if (updatedTeacher) {
        saveDbRegisteredTeacher(updatedTeacher);
      }
    }, 0);
  };

  const handleAddRosterStudentsBulk = async (students: RosterStudent[]) => {
    try {
      const currentRoster = [...pupilRoster];
      const studentsToSave: RosterStudent[] = [];
      const updatedRosterList = [...currentRoster];
      const cleanStr = (s: string) => s.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

      for (const up of students) {
        // Find if this student already exists in the roster
        const existingIdx = updatedRosterList.findIndex((r) => {
          const nameMatch = cleanStr(r.firstName) === cleanStr(up.firstName) && cleanStr(r.lastName) === cleanStr(up.lastName);
          const emailMatch = r.email && up.email && r.email.trim().toLowerCase() === up.email.trim().toLowerCase();
          return nameMatch || emailMatch;
        });

        if (existingIdx !== -1) {
          // Update existing student in-place, preserving their existing id, googleId, and email links
          const existing = updatedRosterList[existingIdx];
          const merged: RosterStudent = {
            ...existing,
            firstName: up.firstName,
            lastName: up.lastName,
            yearGroup: up.yearGroup,
            class: up.class,
            pupilPremium: up.pupilPremium,
            send: up.send,
            googleId: existing.googleId || up.googleId,
            email: existing.email || up.email,
          };
          updatedRosterList[existingIdx] = merged;
          studentsToSave.push(merged);
        } else {
          // If the child is not found in the roster, add them as a new student
          studentsToSave.push(up);
          updatedRosterList.push(up);
        }
      }

      // Write merged/new roster students to Firestore
      await saveDbRosterStudentsBulk(studentsToSave);

      // Sync and update any linked student accounts
      for (const rStud of studentsToSave) {
        const matchingUser = registeredStudents.find((u) => {
          if (u.role !== 'student') return false;
          if (rStud.googleId && u.googleId === rStud.googleId) return true;
          if (rStud.email && u.email && rStud.email.toLowerCase() === u.email.toLowerCase()) return true;
          const uNameClean = u.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const rNameClean = (rStud.firstName + rStud.lastName).toLowerCase().replace(/[^a-z0-9]/g, '');
          return uNameClean === rNameClean;
        });

        if (matchingUser) {
          const updatedUser: User = {
            ...matchingUser,
            name: `${rStud.firstName} ${rStud.lastName}`,
            yearGroup: rStud.yearGroup,
            class: rStud.class,
            pupilPremium: rStud.pupilPremium,
            send: rStud.send,
          };
          setRegisteredStudents((prev) =>
            prev.map((u) => (u.username === matchingUser.username ? updatedUser : u))
          );
          await saveDbRegisteredStudent(updatedUser);
        }
      }

      // Refresh pupil roster from Firestore to guarantee absolute state parity
      const freshRoster = await getDbPupilRoster();
      setPupilRoster(freshRoster);

      const freshRegistered = await getDbRegisteredStudents();
      setRegisteredStudents(freshRegistered);
    } catch (err) {
      console.error('Error adding roster students bulk:', err);
      throw err;
    }
  };

  const handleUpdateRosterStudent = async (student: RosterStudent) => {
    try {
      await saveDbRosterStudent(student);
      const updated = await getDbPupilRoster();
      setPupilRoster(updated);

      // Sync with registered student accounts if googleId/email/name is matched
      const matchingUser = registeredStudents.find(
        (u) =>
          u.role === 'student' &&
          (u.googleId === student.googleId ||
            (u.email && student.email && u.email.toLowerCase() === student.email.toLowerCase()) ||
            u.name.toLowerCase().replace(/[^a-z0-9]/g, '') === `${student.firstName}${student.lastName}`.toLowerCase().replace(/[^a-z0-9]/g, ''))
      );

      if (matchingUser) {
        const updatedUser: User = {
          ...matchingUser,
          name: `${student.firstName} ${student.lastName}`,
          yearGroup: student.yearGroup,
          class: student.class,
          pupilPremium: student.pupilPremium,
          send: student.send,
        };
        setRegisteredStudents((prev) =>
          prev.map((u) => (u.username === matchingUser.username ? updatedUser : u))
        );
        await saveDbRegisteredStudent(updatedUser);
      }
    } catch (err) {
      console.error('Error updating roster student:', err);
    }
  };

  const handleClearRoster = async () => {
    try {
      await clearDbPupilRoster();
      setPupilRoster([]);
    } catch (err) {
      console.error('Error clearing roster:', err);
      throw err;
    }
  };

  const handleDeleteRosterStudent = async (id: string) => {
    try {
      await deleteDbRosterStudent(id);
      const updated = await getDbPupilRoster();
      setPupilRoster(updated);
    } catch (err) {
      console.error('Error deleting roster student:', err);
      throw err;
    }
  };

  // Sleek vibrant loading screen during gateway syncing
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center py-8 px-4 sm:px-6 bg-sky-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 select-none">
        <div className="bg-white border-4 border-slate-900 rounded-[32px] shadow-brutal p-8 flex flex-col items-center justify-center space-y-4 max-w-sm text-center">
          <div className="w-16 h-16 bg-indigo-600 border-4 border-slate-900 rounded-2xl flex items-center justify-center animate-bounce shadow-brutal-indigo">
            <span className="text-3xl text-white">⚛️</span>
          </div>
          <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">
            CONNECTING...
          </h2>
          <p className="text-xs font-black text-indigo-600 uppercase tracking-widest animate-pulse">
            Dersingham Gateway Syncing
          </p>
          <div className="w-32 bg-slate-100 h-3 border-2 border-slate-900 rounded-full overflow-hidden p-0.5 relative">
            <div className="bg-indigo-600 h-full rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center py-8 px-4 sm:px-6 bg-sky-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Primary Neobrutalist stage frame wrapper container with the Vibrant Palette theme style */}
      <div 
        className="bg-white border-4 border-slate-900 rounded-[32px] shadow-brutal w-full max-w-3xl overflow-hidden relative"
        id="portal-container"
      >
        {/* Header toolbar as specified in the Vibrant Palette Mock */}
        <nav className="h-16 bg-white border-b-4 border-slate-900 px-5 sm:px-8 flex items-center justify-between select-none">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center border-2 border-slate-900 shadow-brutal-sm">
              <span className="text-xl text-white">⚛️</span>
            </div>
            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              DERSINGHAM <span className="text-indigo-600 font-extrabold">PORTAL</span>
            </span>
          </div>
          <div className="flex gap-3 sm:gap-4 items-center">
            <span className="text-slate-500 font-black text-[10px] sm:text-xs uppercase tracking-wider hidden md:inline-block">
              USO Secure Gateway
            </span>
            {currentScreen === 'teacher-dashboard' && currentUser && (registeredTeachers.find(t => t.username === currentUser.username)?.isAdmin || currentUser.isAdmin) && (
              <button
                onClick={() => setIsAdminViewActive(!isAdminViewActive)}
                className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-slate-900 rounded-xl cursor-pointer transition-all shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[1px] select-none ${
                  isAdminViewActive 
                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' 
                    : 'bg-rose-500 text-white hover:bg-rose-450'
                }`}
              >
                {isAdminViewActive ? 'Exit Admin 🏛️' : 'Admin Area 🛡️'}
              </button>
            )}
            <div className="h-8 w-8 bg-indigo-50 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-xs text-indigo-700 shrink-0">
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : '❓'}
            </div>
          </div>
        </nav>

        {/* Content body wrapper */}
        <div className="px-5 sm:px-10 py-8 text-center">
          <AnimatePresence mode="wait">
            {currentScreen === 'welcome' && (
              <WelcomeScreen key="welcome-screen-view" onNavigate={handleNavigation} />
            )}

             {currentScreen === 'login' && selectedRole && (
              <LoginScreen
                key="login-screen-view"
                role={selectedRole}
                onBack={() => handleNavigation('welcome')}
                onLoginSuccess={handleLoginSuccess}
                teachers={registeredTeachers}
                pupils={registeredStudents}
                onAddStudent={handleAddStudent}
                onAddTeacher={handleAddTeacher}
                pupilRoster={pupilRoster}
                onUpdateRosterStudent={handleUpdateRosterStudent}
              />
            )}

            {currentScreen === 'student-portal' && currentUser && (
              <StudentPortal
                key="student-portal-view"
                user={currentUser}
                onLogout={handleLogout}
                activeTests={tests}
                onSaveScore={handleSaveScore}
                historicRecords={scoreRecords}
              />
            )}

            {currentScreen === 'teacher-dashboard' && currentUser && (
              <TeacherDashboard
                key="teacher-dashboard-view"
                user={currentUser}
                onLogout={handleLogout}
                activeTests={tests}
                historicRecords={scoreRecords}
                onToggleTestActive={handleToggleTestActive}
                onUpdateTestTimeLimit={handleUpdateTestTimeLimit}
                onClearHistory={handleClearHistory}
                onAddStudent={handleAddStudent}
                registeredStudents={registeredStudents}
                registeredTeachers={registeredTeachers}
                onToggleAdmin={handleToggleAdmin}
                scienceAssessments={scienceAssessments}
                scienceSubmissions={scienceSubmissions}
                isAdminViewActive={isAdminViewActive}
                setIsAdminViewActive={setIsAdminViewActive}
                onSaveTest={handleSaveTest}
                onUpdateTeacherClass={handleUpdateTeacherClass}
                onUpdateTeacherYearGroup={handleUpdateTeacherYearGroup}
                onUpdateTeacherLeadSubject={handleUpdateTeacherLeadSubject}
                pupilRoster={pupilRoster}
                onAddRosterStudentsBulk={handleAddRosterStudentsBulk}
                onUpdateRosterStudent={handleUpdateRosterStudent}
                onDeleteRosterStudent={handleDeleteRosterStudent}
                onClearRoster={handleClearRoster}
                onDeleteScoreRecord={handleDeleteScoreRecord}
                onDeleteTest={handleDeleteTest}
                onArchiveCurrentData={handleArchiveCurrentData}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Immersive Footer segment as specified in the Vibrant Palette layout mockup */}
      <footer className="w-full max-w-3xl mt-6 bg-slate-900 rounded-[20px] border-3 border-slate-900 flex flex-col sm:flex-row items-center justify-between px-6 py-3.5 text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] gap-3 text-center sm:text-left shadow-brutal-sm select-none">
        <span>© 2026 Dersingham Primary School</span>
        <div className="flex gap-5">
          <span>Phase 2 Live</span>
          <span className="text-emerald-400 underline decoration-2 underline-offset-2">System Status: Normal</span>
        </div>
      </footer>
    </div>
  );
}
