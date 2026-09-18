/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, GraduationCap, Award, BrainCircuit, ShieldAlert } from 'lucide-react';
import { Role } from '../types';

interface WelcomeScreenProps {
  key?: string;
  onNavigate: (screen: 'login' | 'welcome', role?: Role) => void;
}

export default function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="text-left py-2 sm:py-4"
      id="welcome-screen"
    >
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
        {/* Left column: Hero statement */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Decorative Badge with floating motion */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="inline-flex self-start items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 border-2 border-slate-900 rounded-full text-amber-900 font-extrabold text-[11px] tracking-wider uppercase shadow-brutal-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-300" />
            <span>KS1 & KS2 ACTIVE ASSESSMENT</span>
          </motion.div>

          {/* Hero Icon */}
          <div className="text-5xl mt-2 mb-1 select-none w-fit">🚀</div>

          {/* Main Titles */}
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Ready to start your <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-4 decoration-4">Assessment?</span>
          </h1>
          <p className="text-slate-600 font-medium text-sm sm:text-base max-w-md mt-1">
            Log in with your secured USO school credentials to access your class activities, active year group trackers, and personal learning goals.
          </p>
        </div>

        {/* Right column: Interactive Cards */}
        <div className="w-full md:w-[280px] lg:w-[320px] flex flex-col gap-4 select-none">
          <button
            onClick={() => onNavigate('login', 'student')}
            id="btn-student-access"
            className="w-full p-5 bg-indigo-50 border-3 border-slate-900 rounded-2xl hover:bg-indigo-100 text-left flex flex-col gap-2 shadow-brutal-indigo group cursor-pointer transition-all duration-100 hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Learners</span>
              <GraduationCap className="w-5 h-5 text-indigo-600 transform group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-lg font-black text-slate-900 uppercase">Student Access →</span>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
              Answer interactive quizzes, check scores & complete tasks.
            </p>
          </button>

          <button
            onClick={() => onNavigate('login', 'teacher')}
            id="btn-teacher-dashboard"
            className="w-full p-5 bg-amber-50 border-3 border-slate-900 rounded-2xl hover:bg-amber-100 text-left flex flex-col gap-2 shadow-brutal-amber group cursor-pointer transition-all duration-100 hover:translate-x-[-2px] hover:translate-y-[-2px]"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-black text-amber-700 uppercase tracking-widest">Staff Only</span>
              <Award className="w-5 h-5 text-amber-700 transform group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-lg font-black text-slate-900 uppercase">Teacher Portal →</span>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
              Track analytics, toggle assessments & register pupils.
            </p>
          </button>
        </div>
      </div>

      {/* School Badge Info Area */}
      <div className="mt-10 select-none flex flex-wrap justify-center sm:justify-start gap-4 text-[11px] font-black text-slate-500 bg-slate-50 border-3 border-slate-900 p-4 rounded-2xl max-w-2xl shadow-brutal-sm">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-indigo-600" />
          <span>NATIONAL CURRICULUM KEY STAGES 1 & 2 ACTIVE</span>
        </div>
        <div className="hidden sm:block h-4 w-0.5 bg-slate-400"></div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>SECURED LOCK VIA LONDON-NEWHAM USO KEY</span>
        </div>
      </div>
    </motion.div>
  );
}
