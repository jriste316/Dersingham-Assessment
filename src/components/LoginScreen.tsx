/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Role, User, RosterStudent } from '../types';
import { MOCK_PUPILS, MOCK_TEACHERS } from '../data';
import { auth, googleAuthProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

interface LoginScreenProps {
  key?: string;
  role: Role;
  onBack: () => void;
  onLoginSuccess: (user: User) => void;
  teachers?: User[];
  pupils?: User[];
  onAddStudent?: (
    username: string,
    name: string,
    yearGroup: number,
    email?: string,
    googleId?: string,
    studentClass?: string,
    classSetDate?: string
  ) => void;
  onAddTeacher?: (username: string, name: string, email?: string, googleId?: string) => void;
  pupilRoster?: RosterStudent[];
  onUpdateRosterStudent?: (student: RosterStudent) => void;
}

function needsClassReset(classSetDate?: string): boolean {
  if (!classSetDate) return true;
  const setDate = new Date(classSetDate);
  if (isNaN(setDate.getTime())) return true;

  const now = new Date();
  let sep1 = new Date(now.getFullYear(), 8, 1, 0, 0, 0, 0); // Month is 0-indexed, so 8 is September
  
  if (now < sep1) {
    sep1.setFullYear(now.getFullYear() - 1);
  }
  
  return setDate < sep1;
}

export default function LoginScreen({
  role,
  onBack,
  onLoginSuccess,
  teachers,
  pupils,
  onAddStudent,
  onAddTeacher,
  pupilRoster = [],
  onUpdateRosterStudent,
}: LoginScreenProps) {
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  
  // Student class/year setup wizard state
  const [pendingStudentSetup, setPendingStudentSetup] = useState<{
    isNew: boolean;
    username: string;
    name: string;
    email?: string;
    googleId?: string;
    existingYearGroup?: number;
    existingClass?: string;
  } | null>(null);

  const [setupYearGroup, setSetupYearGroup] = useState<number>(4);
  const [setupClass, setSetupClass] = useState<string>('');
  const [isSetupCustomClass, setIsSetupCustomClass] = useState(false);

  // Roster claim wizard states
  const [pendingRosterLink, setPendingRosterLink] = useState<{
    displayName: string;
    email: string;
    googleId: string;
    username: string;
  } | null>(null);

  const [claimYearGroup, setClaimYearGroup] = useState<number | null>(null);
  const [selectedRosterStudentId, setSelectedRosterStudentId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isStudent = role === 'student';

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    setError('');
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      if (!user) {
        setError('No user info returned from Google.');
        return;
      }

      const email = user.email || '';
      if (!email.toLowerCase().endsWith('@dersingham.newham.sch.uk')) {
        setError('Access Restricted: You must sign in with a school Google account ending in @dersingham.newham.sch.uk!');
        await signOut(auth);
        return;
      }

      const displayName = user.displayName || 'Google User';
      const googleId = user.uid;

      // Extract username prefix from email, e.g. "jriste.316" or "ahmen1364.316"
      const username = email.split('@')[0].toLowerCase();

      // Determine expected role based on the school's email formatting rules:
      // - Student emails have numbers before '.316', e.g. ahmen1364.316@dersingham.newham.sch.uk
      // - Teacher emails have no numbers in the prefix, e.g. joseph.riste@... or jriste.316@...
      let detectedRole: 'teacher' | 'student' = 'teacher';
      if (username.endsWith('.316')) {
        const prefix = username.slice(0, -4); // remove '.316'
        if (/\d/.test(prefix)) {
          detectedRole = 'student';
        } else {
          detectedRole = 'teacher';
        }
      } else {
        detectedRole = 'teacher';
      }

      const isJosephRiste = 
        username.toLowerCase() === 'joseph.riste' || 
        username.toLowerCase() === 'joseph.riste@dersingham.newham.sch.uk' ||
        username.toLowerCase() === 'jriste.316' ||
        username.toLowerCase() === 'jriste.316@dersingham.newham.sch.uk' ||
        (email && (email.toLowerCase() === 'joseph.riste@dersingham.newham.sch.uk' || email.toLowerCase() === 'jriste.316@dersingham.newham.sch.uk'));

      // Prevent cross-portal logins (except Mr. Riste previewing Student Portal)
      if (isStudent && detectedRole !== 'student' && !isJosephRiste) {
        setError('Access Restricted: This Google account is a Teacher account. Please use the Teacher Portal to sign in!');
        await signOut(auth);
        return;
      }

      if (!isStudent && detectedRole !== 'teacher') {
        setError('Access Denied: Student accounts are not permitted to access the Teacher Portal!');
        await signOut(auth);
        return;
      }

      if (isStudent) {
        if (isJosephRiste) {
          // Mr. Riste student login -> automatically link to Test account in Class 18
          let testRosterStudent = pupilRoster ? pupilRoster.find(
            (r) =>
              (r.firstName.toLowerCase() === 'test' && r.lastName.toLowerCase() === 'account') ||
              r.googleId === googleId ||
              (r.email && r.email.toLowerCase() === email.toLowerCase())
          ) : undefined;

          if (!testRosterStudent) {
            testRosterStudent = {
              id: 'pupil-5-test-account-class18',
              firstName: 'Test',
              lastName: 'account',
              class: 'Class 18',
              yearGroup: 5,
              pupilPremium: false,
              send: 'No SEN',
              email: email,
              googleId: googleId,
            };
            if (onUpdateRosterStudent) {
              onUpdateRosterStudent(testRosterStudent);
            }
          } else if (!testRosterStudent.googleId || !testRosterStudent.email) {
            testRosterStudent = {
              ...testRosterStudent,
              googleId,
              email,
            };
            if (onUpdateRosterStudent) {
              onUpdateRosterStudent(testRosterStudent);
            }
          }

          onLoginSuccess({
            username: 'jriste.316',
            name: `${testRosterStudent.firstName} ${testRosterStudent.lastName}`,
            role: 'student',
            yearGroup: testRosterStudent.yearGroup || 5,
            class: testRosterStudent.class || 'Class 18',
            pupilPremium: testRosterStudent.pupilPremium,
            send: testRosterStudent.send,
            email: email,
            googleId: googleId,
          });
          return;
        }

        // If the roster has entries, we MUST use the roster-matching workflow!
        if (pupilRoster && pupilRoster.length > 0) {
          // 1. Search for already linked roster record
          const linkedRosterStudent = pupilRoster.find(
            (r) => r.googleId === googleId || (r.email && r.email.toLowerCase() === email.toLowerCase())
          );

          if (linkedRosterStudent) {
            // Already matched and linked! Log them in directly.
            onLoginSuccess({
              username: username,
              name: `${linkedRosterStudent.firstName} ${linkedRosterStudent.lastName}`,
              role: 'student',
              yearGroup: linkedRosterStudent.yearGroup,
              class: linkedRosterStudent.class,
              pupilPremium: linkedRosterStudent.pupilPremium,
              send: linkedRosterStudent.send,
              email: email,
              googleId: googleId,
            });
            return;
          }

          // 2. Try to auto-match by name
          const normalize = (str: string) => str.toLowerCase().replace(/[^a-z]/g, '').trim();
          const googleNorm = normalize(displayName);

          // Find unlinked candidates where name matches
          const candidates = pupilRoster.filter(
            (r) => !r.googleId && (
              normalize(r.firstName + r.lastName) === googleNorm ||
              normalize(r.lastName + r.firstName) === googleNorm ||
              normalize(r.firstName) === googleNorm || // single name match
              (googleNorm.includes(normalize(r.firstName)) && googleNorm.includes(normalize(r.lastName)))
            )
          );

          if (candidates.length === 1) {
            // Found a unique unlinked match! Link automatically.
            const autoMatch = candidates[0];
            const updatedRosterStudent = {
              ...autoMatch,
              googleId,
              email,
            };
            if (onUpdateRosterStudent) {
              onUpdateRosterStudent(updatedRosterStudent);
            }
            onLoginSuccess({
              username: username,
              name: `${autoMatch.firstName} ${autoMatch.lastName}`,
              role: 'student',
              yearGroup: autoMatch.yearGroup,
              class: autoMatch.class,
              pupilPremium: autoMatch.pupilPremium,
              send: autoMatch.send,
              email: email,
              googleId: googleId,
            });
            return;
          }

          // 3. No unique match or multiple candidates -> open the Search/Claim Wizard!
          setPendingRosterLink({
            displayName,
            email,
            googleId,
            username,
          });
          setClaimYearGroup(null);
          setSelectedRosterStudentId('');
          setSearchQuery('');
          return;
        }

        // --- MANUALLY REGISTER FALLBACK (IF ROSTER IS EMPTY) ---
        const activePupils = pupils || MOCK_PUPILS;
        
        // Match by googleId, email, username (email prefix), or display name
        let found = activePupils.find(
          (p) => 
            p.googleId === googleId ||
            (p.email && p.email.toLowerCase() === email.toLowerCase()) ||
            p.username.toLowerCase() === username.toLowerCase() ||
            p.name.toLowerCase() === displayName.toLowerCase()
        );

        if (found) {
          const needsSetup = !found.class || needsClassReset(found.classSetDate);

          if (needsSetup) {
            setPendingStudentSetup({
              isNew: false,
              username: found.username,
              name: found.name,
              email: email || found.email,
              googleId: googleId || found.googleId,
              existingYearGroup: found.yearGroup,
              existingClass: found.class,
            });
            setSetupYearGroup(found.yearGroup || 4);
            setSetupClass(found.class || '');
          } else {
            if (!found.googleId || !found.email) {
              onAddStudent && onAddStudent(
                found.username,
                found.name,
                found.yearGroup || 4,
                email,
                googleId,
                found.class,
                found.classSetDate
              );
              found = { ...found, email, googleId };
            }
            onLoginSuccess(found);
          }
        } else {
          // Student not on the system! Ask for details.
          setPendingStudentSetup({
            isNew: true,
            username,
            name: displayName,
            email,
            googleId,
          });
          setSetupYearGroup(4);
          setSetupClass('');
        }
      } else {
        const activeTeachers = teachers || MOCK_TEACHERS;
        
        let found = activeTeachers.find(
          (t) => 
            t.googleId === googleId ||
            (t.email && t.email.toLowerCase() === email.toLowerCase()) ||
            t.username.toLowerCase() === username.toLowerCase() ||
            t.name.toLowerCase() === displayName.toLowerCase()
        );

        if (found) {
          if (!found.googleId || !found.email) {
            onAddTeacher && onAddTeacher(found.username, found.name, email, googleId);
            found = { ...found, email, googleId };
          }
          const isJosephRiste = 
            found.username.toLowerCase() === 'joseph.riste' || 
            found.username.toLowerCase() === 'joseph.riste@dersingham.newham.sch.uk' ||
            found.username.toLowerCase() === 'jriste.316' ||
            found.username.toLowerCase() === 'jriste.316@dersingham.newham.sch.uk' ||
            (email && (email.toLowerCase() === 'joseph.riste@dersingham.newham.sch.uk' || email.toLowerCase() === 'jriste.316@dersingham.newham.sch.uk'));
          if (isJosephRiste) {
            found.isAdmin = true;
          }
          onLoginSuccess(found);
        } else {
          const isJosephRiste = 
            username.toLowerCase() === 'joseph.riste' || 
            username.toLowerCase() === 'joseph.riste@dersingham.newham.sch.uk' ||
            username.toLowerCase() === 'jriste.316' ||
            username.toLowerCase() === 'jriste.316@dersingham.newham.sch.uk' ||
            (email && (email.toLowerCase() === 'joseph.riste@dersingham.newham.sch.uk' || email.toLowerCase() === 'jriste.316@dersingham.newham.sch.uk'));
          onAddTeacher && onAddTeacher(username, displayName, email, googleId);
          onLoginSuccess({
            username,
            name: displayName,
            role: 'teacher',
            isAdmin: isJosephRiste ? true : false,
            email,
            googleId,
          });
        }
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        console.warn('Google Auth popup closed by user.');
        setError('Sign-in cancelled: The Google sign-in popup was closed. Please click "Sign in with Google" again to try again.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        console.warn('Google Auth popup request cancelled.');
        setError('Sign-in cancelled: Another sign-in request was initiated or cancelled. Please try again.');
      } else if (err?.code === 'auth/popup-blocked') {
        console.error('Google Auth Popup Blocked:', err);
        setError('Google Sign-In popup was blocked by your browser. Please allow popups for this site and try again!');
      } else {
        console.error('Google Auth Error:', err);
        setError(err?.message || 'Google Authentication failed.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupClass) {
      setError('Please select your Class!');
      return;
    }

    if (!pendingStudentSetup) return;

    const dateStr = new Date().toISOString();

    onAddStudent && onAddStudent(
      pendingStudentSetup.username,
      pendingStudentSetup.name,
      setupYearGroup,
      pendingStudentSetup.email,
      pendingStudentSetup.googleId,
      setupClass,
      dateStr
    );

    onLoginSuccess({
      username: pendingStudentSetup.username,
      name: pendingStudentSetup.name,
      role: 'student',
      yearGroup: setupYearGroup,
      class: setupClass,
      classSetDate: dateStr,
      email: pendingStudentSetup.email,
      googleId: pendingStudentSetup.googleId,
    });
  };

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRosterStudentId) {
      setError('Please select your name from the list!');
      return;
    }
    if (!pendingRosterLink) return;

    const rosterStudent = pupilRoster.find(r => r.id === selectedRosterStudentId);
    if (!rosterStudent) return;

    // Link Google account to this roster record
    const updatedStudent: RosterStudent = {
      ...rosterStudent,
      googleId: pendingRosterLink.googleId,
      email: pendingRosterLink.email,
    };

    if (onUpdateRosterStudent) {
      onUpdateRosterStudent(updatedStudent);
    }

    onLoginSuccess({
      username: pendingRosterLink.username,
      name: `${rosterStudent.firstName} ${rosterStudent.lastName}`,
      role: 'student',
      yearGroup: rosterStudent.yearGroup,
      class: rosterStudent.class,
      pupilPremium: rosterStudent.pupilPremium,
      send: rosterStudent.send,
      email: pendingRosterLink.email,
      googleId: pendingRosterLink.googleId,
    });
  };

  if (pendingRosterLink) {
    // Find unlinked students
    const unlinkedStudents = pupilRoster.filter(r => !r.googleId);
    
    // Filter by year group if selected
    let filteredStudents = claimYearGroup !== null
      ? unlinkedStudents.filter(r => r.yearGroup === claimYearGroup)
      : unlinkedStudents;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filteredStudents = filteredStudents.filter(
        r => `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) || r.class.toLowerCase().includes(q)
      );
    }

    const selectedStudent = pupilRoster.find(r => r.id === selectedRosterStudentId);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="text-left"
        id="student-claim-screen"
      >
        <button
          type="button"
          onClick={() => setPendingRosterLink(null)}
          className="inline-flex items-center gap-2 mb-6 font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group text-sm"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Gateway
        </button>

        <div className="text-center mb-6">
          <span className="text-5xl mb-3 block select-none">🎒</span>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Identify Yourself
          </h2>
          <p className="font-sans text-slate-500 text-xs font-bold uppercase tracking-widest mt-1.5 leading-relaxed">
            Welcome, {pendingRosterLink.displayName}! Please find and select your name from the school roster below to link your account.
          </p>
        </div>

        <form onSubmit={handleClaimSubmit} className="max-w-md mx-auto bg-white border-3 border-slate-900 rounded-2xl p-6 shadow-brutal space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border-2 border-slate-900 rounded-xl text-rose-700 font-black text-xs uppercase tracking-wider text-center shadow-brutal-sm">
              ⚠️ ERROR: {error}
            </div>
          )}

          {/* STEP A: Select Year Group to Narrow Down */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-700 block uppercase tracking-wide select-none">
              1. Choose Your Year Group
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => {
                    setClaimYearGroup(year);
                    setSelectedRosterStudentId('');
                  }}
                  className={`py-2 px-1 rounded-xl border-2 font-black text-xs text-center transition-all cursor-pointer ${
                    claimYearGroup === year
                      ? 'bg-indigo-600 border-slate-900 text-white shadow-brutal-sm translate-y-[1px]'
                      : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100 shadow-none'
                  }`}
                >
                  Year {year}
                </button>
              ))}
            </div>
          </div>

          {/* STEP B: Search Box */}
          <div className="space-y-2">
            <label htmlFor="student-search-input" className="text-xs font-black text-slate-700 block uppercase tracking-wide select-none">
              2. Search Your Name
            </label>
            <input
              id="student-search-input"
              type="text"
              placeholder="Type first or last name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setError('');
              }}
              className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:bg-white text-slate-800"
            />
          </div>

          {/* STEP C: Selection List */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-700 block uppercase tracking-wide select-none">
              3. Select Name From Roster
            </span>
            <div className="border-2 border-slate-900 rounded-xl max-h-48 overflow-y-auto bg-slate-50 p-2 space-y-1.5">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-6 text-slate-400 font-bold text-xs uppercase tracking-wider">
                  No matching unlinked names found
                </div>
              ) : (
                filteredStudents.map((stud) => {
                  const isSelected = selectedRosterStudentId === stud.id;
                  return (
                    <button
                      key={stud.id}
                      type="button"
                      onClick={() => {
                        setSelectedRosterStudentId(stud.id);
                        setError('');
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border-2 font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 border-slate-900 text-slate-950 shadow-brutal-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>
                        {stud.firstName} {stud.lastName}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-black uppercase text-slate-600">
                        {stud.class} (Yr {stud.yearGroup})
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* STEP D: Final Confirm button */}
          {selectedStudent && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3.5 text-center space-y-2">
              <p className="text-xs font-bold text-amber-900 leading-relaxed uppercase tracking-tight">
                Are you sure you are <span className="font-black text-slate-900">{selectedStudent.firstName} {selectedStudent.lastName}</span> in <span className="font-black text-slate-900">{selectedStudent.class}</span>?
              </p>
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider">
                This will link your Google Account and cannot be undone without a teacher.
              </p>
            </div>
          )}

          <div className="pt-1 select-none">
            <button
              type="submit"
              disabled={!selectedRosterStudentId}
              className={`w-full py-3 px-5 rounded-xl border-3 border-slate-900 font-black text-sm uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2 shadow-brutal-sm active:translate-y-[1px] ${
                selectedRosterStudentId
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed shadow-none active:translate-y-0'
              }`}
            >
              Link to My Google Account & Enter Portal 🚀
            </button>
          </div>
        </form>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mt-4 select-none">
          Secured matching via school registrar database
        </p>
      </motion.div>
    );
  }

  if (pendingStudentSetup) {
    const rosterClasses = Array.from(
      new Set(
        pupilRoster
          .map((r) => r.class)
          .filter((c): c is string => !!c && c.trim() !== '')
      )
    ).sort();
    const CLASSES = rosterClasses.length > 0 ? rosterClasses : Array.from({ length: 22 }, (_, i) => `${i + 1}`);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="text-left"
        id="student-setup-screen"
      >
        <button
          type="button"
          onClick={() => setPendingStudentSetup(null)}
          className="inline-flex items-center gap-2 mb-6 font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group text-sm"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Gateway
        </button>

        <div className="text-center mb-6">
          <span className="text-5xl mb-3 block select-none">🎒</span>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            {pendingStudentSetup.isNew ? 'New Student setup' : 'Annual Classroom Update'}
          </h2>
          <p className="font-sans text-slate-500 text-xs font-bold uppercase tracking-widest mt-1.5 leading-relaxed">
            {pendingStudentSetup.isNew 
              ? `Welcome, ${pendingStudentSetup.name}! Let's select your classroom details.`
              : `Hello, ${pendingStudentSetup.name}! It's a new academic year. Please confirm your year group and class.`
            }
          </p>
        </div>

        <form onSubmit={handleSetupSubmit} className="max-w-sm mx-auto bg-white border-3 border-slate-900 rounded-2xl p-6 shadow-brutal space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border-2 border-slate-900 rounded-xl text-rose-700 font-black text-xs uppercase tracking-wider text-center shadow-brutal-sm">
              ⚠️ ERROR: {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-700 block uppercase tracking-wide select-none">
              Select Your Year Group
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSetupYearGroup(year)}
                  className={`py-2 px-1 rounded-xl border-2 font-black text-xs text-center transition-all cursor-pointer ${
                    setupYearGroup === year
                      ? 'bg-indigo-600 border-slate-900 text-white shadow-brutal-sm translate-y-[1px]'
                      : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100 shadow-none'
                  }`}
                >
                  Year {year}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="setup-class-select" className="text-xs font-black text-slate-700 block uppercase tracking-wide select-none">
              Select Your Class
            </label>
            {!isSetupCustomClass ? (
              <div className="flex gap-2">
                <select
                  id="setup-class-select"
                  required
                  value={setupClass}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setIsSetupCustomClass(true);
                      setSetupClass('');
                    } else {
                      setSetupClass(e.target.value);
                      setError('');
                    }
                  }}
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl py-2.5 px-3 text-xs font-black focus:outline-none focus:bg-white text-slate-800 cursor-pointer uppercase"
                >
                  <option value="">-- Choose your Class --</option>
                  {CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls.replace(/^(class\s+)/i, '')}
                    </option>
                  ))}
                  <option value="__custom__">➕ New / Custom Class...</option>
                </select>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  id="setup-class-select"
                  required
                  value={setupClass}
                  onChange={(e) => {
                    setSetupClass(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. JR-18"
                  className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl py-2.5 px-3 text-xs font-black focus:outline-none focus:bg-white text-slate-800 uppercase"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSetupCustomClass(false);
                    setSetupClass('');
                  }}
                  className="px-3 py-2.5 text-xs font-black border-2 border-slate-900 bg-slate-100 rounded-xl hover:bg-slate-200"
                >
                  List
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 select-none">
            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl border-3 border-slate-900 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm uppercase tracking-wide cursor-pointer transition-all flex items-center justify-center gap-2 shadow-brutal-sm active:translate-y-[1px]"
            >
              Confirm & Enter Portal 🚀
            </button>
          </div>
        </form>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mt-4 select-none">
          Historical test results and data are preserved securely
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-left"
      id="login-screen"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 mb-6 font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group text-sm"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        Choose Access Type
      </button>

      {/* Screen Title */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4 select-none">🌐</div>
        <h2 id="login-title" className="text-3xl font-black text-slate-900 uppercase tracking-tight">
          {isStudent ? 'Student Access Entry' : 'Teacher Access Entry'}
        </h2>
        <p className="font-sans text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 flex items-center justify-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          Google Secure Sign-In Gateway
        </p>
      </div>

      <div className="max-w-sm mx-auto space-y-6">
        {error && (
          <div className="space-y-3">
            <div className="p-4 bg-rose-50 border-3 border-slate-900 rounded-xl text-rose-700 font-black text-xs uppercase tracking-wider text-center shadow-brutal-sm">
              ⚠️ ERROR: {error}
            </div>
            {(error.toLowerCase().includes('window') || error.toLowerCase().includes('popup') || error.toLowerCase().includes('cancelled') || error.toLowerCase().includes('closed')) && (
              <div className="p-4 bg-amber-50 border-3 border-slate-900 rounded-xl text-slate-900 font-black text-xs uppercase tracking-wide text-left shadow-brutal-sm space-y-2">
                <p className="text-amber-600 font-black flex items-center gap-1">💡 Sandbox Environment Note:</p>
                <p className="normal-case font-medium text-slate-700 leading-relaxed font-sans">
                  Firebase Auth popups can be blocked or cancelled inside sandbox iframe previews. For a smooth Google sign-in experience, please click the <strong>External Link icon (top-right of preview window) to open the app in a new browser tab</strong>, or use the credentials system.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white border-3 border-slate-900 rounded-2xl p-6 shadow-brutal text-center space-y-4">
          <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
            Sign in using your school Google workspace account to securely match your name and track progress.
          </p>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className={`w-full py-4 px-5 rounded-xl border-3 border-slate-900 bg-white text-slate-900 font-black text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2.5 shadow-brutal-sm ${
              isSigningIn
                ? 'opacity-60 cursor-not-allowed bg-slate-100'
                : 'hover:bg-slate-50 cursor-pointer active:translate-y-[1px]'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </div>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mt-4">
          Secured by Google Identity Services
        </p>
      </div>
    </motion.div>
  );
}

