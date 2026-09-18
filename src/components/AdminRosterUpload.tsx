/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Users,
  RefreshCw,
  HelpCircle,
  X,
  Upload,
} from 'lucide-react';
import { RosterStudent, User } from '../types';

interface AdminRosterUploadProps {
  registeredStudents: User[];
  onAddRosterStudentsBulk: (students: RosterStudent[]) => Promise<void>;
  onRosterUpdated?: () => void;
}

interface ParsedStudentPreview {
  firstName: string;
  lastName: string;
  yearGroup: number;
  class: string;
  pupilPremium: boolean;
  send: string | boolean;
  googleEmail?: string;
  googleId?: string;
  matchStatus: 'linked_by_csv' | 'auto_matched' | 'unlinked';
  matchedAccountName?: string;
}

export default function AdminRosterUpload({
  registeredStudents,
  onAddRosterStudentsBulk,
  onRosterUpdated,
}: AdminRosterUploadProps) {
  const [csvText, setCsvText] = useState('');
  const [previewStudents, setPreviewStudents] = useState<ParsedStudentPreview[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Parse CSV helper
  const handleParse = () => {
    setStatusMsg(null);
    if (!csvText.trim()) {
      setPreviewStudents([]);
      return;
    }

    try {
      const lines = csvText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
      if (lines.length === 0) {
        setPreviewStudents([]);
        return;
      }

      // Check for header row on the first line
      const firstLine = lines[0].toLowerCase();
      let hasHeader = false;
      let colIndices = {
        firstName: 0,
        lastName: 1,
        yearGroup: 2,
        class: 3,
        pupilPremium: 4,
        send: 5,
        google: 6,
      };

      // Detect delimiters: tabs, commas, or semicolons
      const detectDelimiter = (line: string) => {
        if (line.includes('\t')) return '\t';
        if (line.includes(',')) return ',';
        if (line.includes(';')) return ';';
        return ' ';
      };

      const delimiter = detectDelimiter(lines[0]);

      // Split line helper handling simple quotes if present
      const splitLine = (line: string) => {
        if (delimiter === ',') {
          // Simple CSV line parser that respects quotes
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        }
        return line.split(delimiter).map((c) => c.trim().replace(/^"|"$/g, ''));
      };

      const firstLineCells = splitLine(lines[0]);

      // Determine if first row is a header
      const headerIndicators = ['first name', 'last name', 'year', 'class', 'premium', 'send', 'google', 'email', 'username'];
      const isHeaderRow = firstLineCells.some((cell) =>
        headerIndicators.some((ind) => cell.toLowerCase().includes(ind))
      );

      if (isHeaderRow) {
        hasHeader = true;
        // Reset indices to -1
        colIndices = {
          firstName: -1,
          lastName: -1,
          yearGroup: -1,
          class: -1,
          pupilPremium: -1,
          send: -1,
          google: -1,
        };

        firstLineCells.forEach((cell, idx) => {
          const norm = cell.toLowerCase();
          if (norm.includes('first name') || norm === 'first' || norm === 'firstname') {
            colIndices.firstName = idx;
          } else if (norm.includes('last name') || norm === 'last' || norm === 'lastname' || norm === 'surname') {
            colIndices.lastName = idx;
          } else if (norm.includes('year') || norm.includes('stage') || norm === 'yr') {
            colIndices.yearGroup = idx;
          } else if (norm.includes('class') || norm === 'set' || norm === 'grp') {
            colIndices.class = idx;
          } else if (norm.includes('premium') || norm === 'pp' || norm === 'pupil premium') {
            colIndices.pupilPremium = idx;
          } else if (norm.includes('send') || norm === 'sen' || norm.includes('needs')) {
            colIndices.send = idx;
          } else if (norm.includes('google') || norm.includes('email') || norm.includes('username') || norm.includes('prefix')) {
            colIndices.google = idx;
          }
        });

        // Fail-safe default mapping if some columns aren't found
        if (colIndices.firstName === -1) colIndices.firstName = 0;
        if (colIndices.lastName === -1) colIndices.lastName = 1;
        if (colIndices.yearGroup === -1) colIndices.yearGroup = 2;
        if (colIndices.class === -1) colIndices.class = 3;
        if (colIndices.pupilPremium === -1) colIndices.pupilPremium = 4;
        if (colIndices.send === -1) colIndices.send = 5;
      }

      const rowsToParse = hasHeader ? lines.slice(1) : lines;
      const parsed: ParsedStudentPreview[] = [];

      rowsToParse.forEach((line) => {
        const cells = splitLine(line);
        if (cells.length < 2) return;

        // Extract values using mapped indices or default fallbacks
        const getCellVal = (idx: number, fallback = '') => (idx >= 0 && idx < cells.length ? cells[idx] : fallback);

        let firstName = getCellVal(colIndices.firstName).trim();
        let lastName = getCellVal(colIndices.lastName).trim();

        // If last name is missing but first name contains spaces, split them
        if (firstName && !lastName && colIndices.lastName >= cells.length) {
          const nameParts = firstName.split(/\s+/);
          if (nameParts.length > 1) {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(' ');
          } else {
            lastName = 'Student';
          }
        }

        if (!firstName) return;

        let rawClass = getCellVal(colIndices.class);
        let cleanedClass = rawClass ? rawClass.trim() : '';

        let yearGroupVal = getCellVal(colIndices.yearGroup);
        let yearGroup = parseInt(yearGroupVal.replace(/[^0-9]/g, ''));

        // Apply Dersingham-specific Year Group mapping from class name
        if (cleanedClass) {
          const upperClass = cleanedClass.toUpperCase();
          if (
            upperClass.includes('AA-AM') || 
            upperClass.includes('AA-PM') || 
            upperClass === 'AM' || 
            upperClass === 'PM' || 
            upperClass.endsWith('-AM') || 
            upperClass.endsWith('-PM')
          ) {
            yearGroup = 0; // Nursery
          } else {
            const match = upperClass.match(/(\d+)$/);
            if (match) {
              const num = parseInt(match[1]);
              if (num >= 1 && num <= 3) {
                yearGroup = 0; // Reception
              } else if (num >= 4 && num <= 6) {
                yearGroup = 1;
              } else if (num >= 7 && num <= 9) {
                yearGroup = 2;
              } else if (num >= 11 && num <= 13) {
                yearGroup = 3;
              } else if (num >= 14 && num <= 16) {
                yearGroup = 4;
              } else if (num >= 17 && num <= 19) {
                yearGroup = 5;
              } else if (num >= 20 && num <= 22) {
                yearGroup = 6;
              }
            }
          }
        }

        if (isNaN(yearGroup)) {
          yearGroup = 4; // fallback default
        }

        if (!cleanedClass) {
          cleanedClass = `Class ${yearGroup}`;
        }

        const ppStr = getCellVal(colIndices.pupilPremium);
        const sendStr = getCellVal(colIndices.send);

        const checkBool = (s: string) => {
          const l = s ? s.toLowerCase() : '';
          return l.includes('yes') || l.includes('true') || l === 'pp' || l === 'send' || l === 'y' || l === '1';
        };

        const parseSendProvision = (s: string): string => {
          const l = s ? s.trim().toLowerCase() : '';
          if (l.includes('support') || l.includes('sen support')) {
            return 'SEN Support';
          }
          if (l.includes('ehc') || l.includes('ehcp') || l.includes('plan')) {
            return 'EHC Plan';
          }
          if (l.includes('no sen') || l === '' || l === 'no' || l === 'n' || l === 'false' || l === '0') {
            return 'No SEN';
          }
          if (l === 'yes' || l === 'true' || l === 'send' || l === 'y' || l === '1') {
            return 'SEN Support';
          }
          return s.trim() || 'No SEN';
        };

        const pupilPremium = checkBool(ppStr);
        const send = parseSendProvision(sendStr);

        // Google / Username mapping logic
        let googleField = getCellVal(colIndices.google).trim();
        let googleEmail: string | undefined = undefined;
        let googleId: string | undefined = undefined;
        let matchStatus: 'linked_by_csv' | 'auto_matched' | 'unlinked' = 'unlinked';
        let matchedAccountName: string | undefined = undefined;

        if (googleField) {
          // Normalize prefix/email to standard school domain if needed
          if (googleField.includes('@')) {
            googleEmail = googleField.toLowerCase();
          } else {
            googleEmail = `${googleField.toLowerCase()}@dersingham.newham.sch.uk`;
          }

          // Search if there is an existing Google user account registered that matches this email or prefix
          const prefix = googleEmail.split('@')[0];
          const matchedUser = registeredStudents.find(
            (s) =>
              s.email?.toLowerCase() === googleEmail?.toLowerCase() ||
              s.username.toLowerCase() === prefix.toLowerCase()
          );

          if (matchedUser) {
            googleId = matchedUser.googleId;
            googleEmail = matchedUser.email || googleEmail;
            matchedAccountName = matchedUser.name;
            matchStatus = 'linked_by_csv';
          } else {
            matchStatus = 'linked_by_csv'; // Email prefix supplied, will direct match on student login
          }
        } else {
          // No Google Username column provided in CSV -> Apply active name auto-matching logic
          // Normalize name strings
          const normalizeString = (str: string) => str.toLowerCase().replace(/[^a-z]/g, '');
          const normCombined = normalizeString(firstName + lastName);
          const normReversed = normalizeString(lastName + firstName);

          // Find if there is an existing registered user whose name or username matches
          const matchedUser = registeredStudents.find((s) => {
            const studentNorm = normalizeString(s.name);
            return (
              studentNorm === normCombined ||
              studentNorm === normReversed ||
              s.username.toLowerCase() === (firstName[0] + lastName).toLowerCase().replace(/[^a-z]/g, '')
            );
          });

          if (matchedUser) {
            googleEmail = matchedUser.email;
            googleId = matchedUser.googleId;
            matchedAccountName = matchedUser.name;
            matchStatus = 'auto_matched';
          }
        }

        parsed.push({
          firstName,
          lastName,
          yearGroup,
          class: cleanedClass,
          pupilPremium,
          send,
          googleEmail,
          googleId,
          matchStatus,
          matchedAccountName,
        });
      });

      if (parsed.length > 0) {
        setPreviewStudents(parsed);
        setStatusMsg({
          type: 'success',
          text: `🔍 Parsed ${parsed.length} student rows! Review the list below and click 'Process Upload' to sync.`,
        });
      } else {
        setPreviewStudents([]);
        setStatusMsg({
          type: 'error',
          text: '⚠️ Could not parse any valid student profiles. Make sure columns are separated by tabs or commas.',
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg({
        type: 'error',
        text: `⚠️ Parsing error: ${err.message || 'Check your format.'}`,
      });
    }
  };

  // Process the final list and write to Firebase Firestore
  const handleProcessUpload = async () => {
    if (previewStudents.length === 0) return;
    setIsProcessing(true);
    setStatusMsg(null);

    try {
      const rosterStudents: RosterStudent[] = previewStudents.map((preview) => {
        // Create standard unique id format: pupil-yearGroup-firstName-lastName-timestamp-random
        const rnd = Math.floor(Math.random() * 1000);
        const firstClean = preview.firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const lastClean = preview.lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const id = `pupil-${preview.yearGroup}-${firstClean}-${lastClean}-${Date.now()}-${rnd}`;

        return {
          id,
          firstName: preview.firstName,
          lastName: preview.lastName,
          yearGroup: preview.yearGroup,
          class: preview.class,
          pupilPremium: preview.pupilPremium,
          send: preview.send,
          googleId: preview.googleId,
          email: preview.googleEmail,
        };
      });

      // Call bulk upload parent handler
      await onAddRosterStudentsBulk(rosterStudents);

      setStatusMsg({
        type: 'success',
        text: `🎉 Successfully uploaded and processed ${rosterStudents.length} pupils into the Firestore roster collection!`,
      });
      setPreviewStudents([]);
      setCsvText('');

      if (onRosterUpdated) {
        onRosterUpdated();
      }
    } catch (err: any) {
      console.error(err);
      setStatusMsg({
        type: 'error',
        text: `⚠️ Firestore upload failed: ${err.message || 'Database error occurred.'}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border-3 border-slate-900 rounded-2xl p-6 shadow-brutal text-left space-y-6" id="csv-roster-uploader">
      {/* Header section */}
      <div className="flex items-center justify-between gap-4 border-b-2 border-slate-200 pb-4 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-indigo-100 border-2 border-slate-900 rounded-xl flex items-center justify-center font-sans text-lg">
            ⚡
          </div>
          <div>
            <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight leading-none">Roster CSV Bulk Importer</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
              Durable school record manager & account linker
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowInstructions(!showInstructions)}
          className="px-3 py-1.5 bg-slate-50 border-2 border-slate-900 hover:bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-brutal-sm transition-all"
        >
          {showInstructions ? 'Hide Help' : 'Instructions ❓'}
        </button>
      </div>

      {/* Instructions drop down */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-amber-50 border-2 border-slate-900 rounded-xl p-4 text-[11px] text-slate-800 space-y-2 select-none"
          >
            <h4 className="font-black uppercase text-amber-900">How to format your pasted data:</h4>
            <p className="leading-relaxed font-bold">
              Copy rows directly from Excel, Google Sheets, or a plain CSV file and paste them in the text area below. The importer is smart and will auto-detect column headers if you copy the header row too!
            </p>
            <div className="bg-white border border-slate-300 rounded-lg p-2.5 font-mono text-[9.5px] leading-relaxed text-slate-700">
              <span className="font-black text-indigo-600">Expected CSV/TSV format:</span>
              <br />
              First Name, Last Name, Year Group, Class, Pupil Premium, SEND, Google Email Prefix
              <br />
              <span className="text-slate-400">Example with headers:</span>
              <br />
              First Name,Last Name,Year,Class,Pupil Premium,SEND provision,Google Email
              <br />
              Daniel,Radcliffe,5,Class JR-18,Yes,No SEN,dradcliffe.316
              <br />
              Emma,Watson,5,Class JR-18,No,SEN Support,ewatson.316@dersingham.newham.sch.uk
              <br />
              Rupert,Grint,5,Class JR-18,Yes,EHC Plan,rgrint.316
            </div>
            <p className="leading-relaxed font-bold text-slate-500">
              💡 <span className="text-slate-800 font-black">Matching Logic:</span> If a Google Email Prefix is provided, it links their account. If left empty, the importer auto-matches against any existing logged-in accounts by comparing names. If no matches exist yet, pupils can self-link during their first gateway login!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload layout */}
      <div className="space-y-4">
        <div className="space-y-2 text-left">
          <label htmlFor="roster-csv-input" className="text-xs font-black text-slate-700 block select-none uppercase tracking-wide">
            Paste CSV or Spreadsheet Rows
          </label>
          <textarea
            id="roster-csv-input"
            rows={6}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="Paste raw Excel or comma-separated rows here..."
            className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl p-3.5 text-xs font-mono font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-0 shadow-inner select-text leading-relaxed"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleParse}
            disabled={!csvText.trim()}
            className={`px-5 py-3 border-2 border-slate-900 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-brutal-sm transition-all flex items-center gap-1.5 select-none ${
              csvText.trim()
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-900'
                : 'bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-slate-850" />
            Analyze & Preview
          </button>

          {previewStudents.length > 0 && (
            <button
              type="button"
              onClick={handleProcessUpload}
              disabled={isProcessing}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-white border-2 border-slate-900 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-brutal-sm transition-all flex items-center gap-1.5 select-none active:translate-y-[1px]"
            >
              <Upload className="w-4 h-4" />
              {isProcessing ? 'Uploading to Firestore...' : 'Process Upload 🚀'}
            </button>
          )}

          {previewStudents.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setPreviewStudents([]);
                setCsvText('');
                setStatusMsg(null);
              }}
              className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-300 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all select-none"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {statusMsg && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`p-4 border-2 rounded-xl text-xs font-bold flex items-start gap-2.5 shadow-brutal-sm select-none ${
              statusMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                : 'bg-rose-50 border-rose-500 text-rose-800'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{statusMsg.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roster Preview Table */}
      <AnimatePresence>
        {previewStudents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5 select-none">
                <Users className="w-4 h-4 text-indigo-600" />
                Previewing Parsed Pupils ({previewStudents.length})
              </span>
              <span className="text-[10px] font-semibold text-slate-400 select-none uppercase tracking-wide">
                *Verify links below before clicking 'Process Upload'
              </span>
            </div>

            <div className="border-3 border-slate-900 rounded-2xl overflow-hidden shadow-brutal-sm bg-white max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-900 select-none">
                    <th className="p-3 font-black text-slate-700 uppercase tracking-wide text-[10px]">Student Name</th>
                    <th className="p-3 font-black text-slate-700 uppercase tracking-wide text-[10px]">Year & Class</th>
                    <th className="p-3 font-black text-slate-700 uppercase tracking-wide text-[10px] text-center">Premium / SEND</th>
                    <th className="p-3 font-black text-slate-700 uppercase tracking-wide text-[10px]">Google Account Linkage Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-150">
                  {previewStudents.map((stud, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-black text-slate-900">
                        {stud.firstName} {stud.lastName}
                      </td>
                      <td className="p-3 font-bold text-slate-600">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-[9px] font-black uppercase mr-1.5">
                          {stud.class && (stud.class.toUpperCase().includes('AA-AM') || stud.class.toUpperCase().includes('AA-PM') || stud.class.toUpperCase().endsWith('-AM') || stud.class.toUpperCase().endsWith('-PM')) ? 'Nursery' : (stud.class && (stud.class.toUpperCase() === 'CW-1' || stud.class.toUpperCase() === 'DH-3' || stud.class.toUpperCase() === 'RB-2' || /-(1|2|3)$/.test(stud.class.toUpperCase()))) ? 'Reception' : `Yr ${stud.yearGroup}`}
                        </span>
                        <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-[9px] font-black uppercase text-indigo-700">
                          {stud.class ? stud.class.replace(/^(class\s+)/i, '') : ''}
                        </span>
                      </td>
                      <td className="p-3 text-center space-x-1.5">
                        {stud.pupilPremium ? (
                          <span className="px-1.5 py-0.5 bg-amber-100 border border-amber-300 rounded text-[8px] font-black uppercase text-amber-850">
                            PP
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-300 select-none font-bold">—</span>
                        )}
                        {stud.send && stud.send !== 'No SEN' ? (
                          <span className="px-1.5 py-0.5 bg-sky-100 border border-sky-300 rounded text-[8px] font-black uppercase text-sky-850">
                            {typeof stud.send === 'string' ? stud.send : 'SEND'}
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-300 select-none font-bold">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        {stud.matchStatus === 'linked_by_csv' && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9.5px] text-indigo-600 font-extrabold uppercase flex items-center gap-1">
                              📧 Linked via CSV
                            </span>
                            <span className="text-[9px] text-slate-450 font-mono font-bold leading-none">
                              {stud.googleEmail}
                            </span>
                            {stud.matchedAccountName && (
                              <span className="text-[8px] text-slate-400 font-bold leading-none uppercase">
                                Match: {stud.matchedAccountName}
                              </span>
                            )}
                          </div>
                        )}
                        {stud.matchStatus === 'auto_matched' && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[9.5px] text-emerald-600 font-extrabold uppercase flex items-center gap-1">
                              🔄 Auto-Linked (Name Match)
                            </span>
                            <span className="text-[9px] text-slate-450 font-mono font-bold leading-none">
                              {stud.googleEmail}
                            </span>
                            <span className="text-[8px] text-slate-400 font-bold leading-none uppercase">
                              Match: {stud.matchedAccountName}
                            </span>
                          </div>
                        )}
                        {stud.matchStatus === 'unlinked' && (
                          <span className="text-[9.5px] text-amber-600 font-extrabold uppercase leading-none">
                            🎒 No direct link (Will map on login)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
