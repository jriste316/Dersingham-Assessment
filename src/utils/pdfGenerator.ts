/**
 * Utility to generate and download a PDF summary report for a student's assessment performance
 */
import { jsPDF } from 'jspdf';
import { RosterStudent } from '../types';
import { DERSINGHAM_LOGO_BASE64 } from './dersinghamLogoBase64';

export interface StudentReportHistoryItem {
  id: string;
  testTitle: string;
  subject: string;
  percentage: number;
  completedAt: string;
  score?: number;
  totalQuestions?: number;
  [key: string]: any;
}

/**
 * Creates a high-resolution base64 PNG data URL of the official Dersingham Primary School banner header.
 */
const createHeaderDataUrl = (): Promise<string | null> => {
  return new Promise((resolve) => {
    try {
      const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1400" height="320" viewBox="0 0 1400 320">
        <defs>
          <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#001848" />
            <stop offset="100%" stop-color="#00246b" />
          </linearGradient>
          <linearGradient id="grayGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2a2d34" />
            <stop offset="100%" stop-color="#4a4d55" />
          </linearGradient>
          <linearGradient id="grayGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#8a8d95" />
            <stop offset="100%" stop-color="#c0c3ca" />
          </linearGradient>
          <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="3" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.25"/>
          </filter>
        </defs>

        <!-- White Header Card Canvas Background -->
        <rect width="1400" height="320" fill="#ffffff" rx="10" ry="10"/>

        <!-- Left Background Layered Swooshes -->
        <!-- Light Gray Wedge -->
        <path d="M 0,0 L 640,0 L 0,320 Z" fill="url(#grayGrad2)" opacity="0.6" />
        <!-- Dark Gray Wedge -->
        <path d="M 0,0 L 520,0 L 0,300 Z" fill="url(#grayGrad1)" filter="url(#dropShadow)" />
        <!-- Deep Navy Wedge -->
        <path d="M 0,0 L 400,0 L 0,260 Z" fill="url(#navyGrad)" filter="url(#dropShadow)" />

        <!-- MIDDLE LOGO AREA: OFFICIAL DERSINGHAM TREE LOGO & MOTTO -->
        <g transform="translate(565, 12)">
          <!-- OFFICIAL SCHOOL LOGO IMAGE -->
          <image href="${DERSINGHAM_LOGO_BASE64}" x="-10" y="0" width="165" height="165" preserveAspectRatio="xMidYMid meet" />

          <!-- MOTTO TEXT -->
          <text x="72" y="188" font-family="Georgia, serif" font-weight="bold" font-size="20" fill="#001848" text-anchor="middle">Be Excellent...Turn Up</text>
          <text x="72" y="215" font-family="Georgia, serif" font-weight="bold" font-size="20" fill="#001848" text-anchor="middle">...No Excuses</text>
        </g>

        <!-- CENTER VERTICAL DIVIDER LINE -->
        <line x1="770" y1="25" x2="770" y2="295" stroke="#7a7e85" stroke-width="7" stroke-linecap="round" />

        <!-- RIGHT SIDE: SCHOOL TITLE & CONTACT INFORMATION -->
        <g transform="translate(800, 20)">
          <!-- Main School Name -->
          <text x="0" y="42" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="44" fill="#001848" letter-spacing="-0.5">Dersingham Primary School</text>
          
          <!-- Federation Name -->
          <text x="0" y="85" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="34" fill="#001848">CPD Schools Federation</text>

          <!-- Headteacher Name -->
          <text x="0" y="122" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="26" fill="#0f68a8">Headteacher: Lando Du Plooy</text>

          <!-- CONTACT DETAILS LIST WITH CIRCULAR BADGE ICONS -->
          <!-- Row 1: Telephone -->
          <g transform="translate(0, 142)">
            <circle cx="16" cy="16" r="15" fill="#82858b"/>
            <!-- Phone Icon -->
            <path d="M 11,10 C 11,18 14,21 22,21 L 20,18 C 18,16 16,16 14,14 L 11,10 Z" fill="#ffffff"/>
            <text x="42" y="23" font-family="Arial, sans-serif" font-weight="700" font-size="21" fill="#001848">0208 478 2133</text>
          </g>

          <!-- Row 2: Website -->
          <g transform="translate(0, 180)">
            <circle cx="16" cy="16" r="15" fill="#82858b"/>
            <circle cx="16" cy="16" r="9" stroke="#ffffff" stroke-width="2" fill="none"/>
            <line x1="7" y1="16" x2="25" y2="16" stroke="#ffffff" stroke-width="2"/>
            <text x="42" y="23" font-family="Arial, sans-serif" font-weight="700" font-size="21" fill="#001848">www.dersingham.newham.sch.uk</text>
          </g>

          <!-- Row 3: Email -->
          <g transform="translate(0, 218)">
            <circle cx="16" cy="16" r="15" fill="#82858b"/>
            <rect x="8" y="10" width="16" height="12" rx="2" fill="none" stroke="#ffffff" stroke-width="2"/>
            <path d="M 8,10 L 16,17 L 24,10" fill="none" stroke="#ffffff" stroke-width="2"/>
            <text x="42" y="23" font-family="Arial, sans-serif" font-weight="700" font-size="21" fill="#001848">parentcomm@dersingham.newham.sch.uk</text>
          </g>

          <!-- Row 4: Address -->
          <g transform="translate(0, 256)">
            <circle cx="16" cy="16" r="15" fill="#82858b"/>
            <path d="M 16,8 L 8,15 L 10,23 L 22,23 L 24,15 Z" fill="none" stroke="#ffffff" stroke-width="2"/>
            <text x="42" y="23" font-family="Arial, sans-serif" font-weight="700" font-size="21" fill="#001848">Dersingham Ave, London, E12 5QJ</text>
          </g>
        </g>
      </svg>
      `;

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1400;
        canvas.height = 320;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, 1400, 320);
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(url);
          resolve(dataUrl);
        } else {
          URL.revokeObjectURL(url);
          resolve(null);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };

      img.src = url;
    } catch {
      resolve(null);
    }
  });
};

export const generateStudentPdfReport = async (
  pupil: RosterStudent,
  history: StudentReportHistoryItem[],
  termFilter: string = 'Current Term',
  teacherRemarks: string = '',
  teacherSignature: string = ''
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const fullName = `${pupil.firstName} ${pupil.lastName}`.trim();
  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  let y = margin;

  // Official Branding Colors
  const navyBlue = [0, 24, 72]; // #001848
  const darkGray = [59, 60, 62]; // #3b3c3e
  const lightGray = [241, 245, 249]; // #f1f5f9
  const darkSlate = [15, 23, 42]; // #0f172a
  const indigoPrimary = [79, 70, 229]; // #4f46e5
  const slate700 = [51, 65, 85];
  const slate500 = [100, 116, 139];
  const borderColor = [203, 213, 225]; // #cbd5e1

  // 1. OFFICIAL SCHOOL HEADER BANNER (High-Res Render)
  const headerDataUrl = await createHeaderDataUrl();
  const printableWidth = pageWidth - margin * 2;
  const headerHeight = printableWidth * (320 / 1400); // Maintain exact aspect ratio (~42.5mm)

  if (headerDataUrl) {
    doc.addImage(headerDataUrl, 'PNG', margin, y, printableWidth, headerHeight);
  } else {
    // Fallback header card
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, printableWidth, headerHeight, 2, 2, 'FD');

    doc.setFillColor(navyBlue[0], navyBlue[1], navyBlue[2]);
    doc.triangle(margin, y, margin + 40, y, margin, y + headerHeight, 'F');

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(navyBlue[0], navyBlue[1], navyBlue[2]);
    doc.text('Dersingham Primary School', margin + 45, y + 12);
    doc.setFontSize(10);
    doc.text('CPD Schools Federation', margin + 45, y + 18);
  }

  y += headerHeight + 5;

  // 2. REPORT TITLE BAR & STUDENT DETAILS
  doc.setFillColor(navyBlue[0], navyBlue[1], navyBlue[2]);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('PUPIL ASSESSMENT PERFORMANCE REPORT', margin + 4, y + 5);
  doc.text(`DATE: ${dateStr}   |   SCOPE: ${termFilter.toUpperCase()}`, pageWidth - margin - 4, y + 5, { align: 'right' });

  y += 9;

  // Student Bio Summary Box
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'FD');

  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(fullName.toUpperCase(), margin + 5, y + 7);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slate700[0], slate700[1], slate700[2]);
  doc.text(`CLASS: ${pupil.class || 'N/A'}    |    YEAR GROUP: Year ${pupil.yearGroup}`, margin + 5, y + 12.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(slate500[0], slate500[1], slate500[2]);
  doc.text('Official Dersingham Primary School Academic Progress Summary', pageWidth - margin - 5, y + 10, { align: 'right' });

  y += 20;

  // 3. SUMMARY STATS BOXES (3 Columns)
  const totalTests = history.length;
  const avgScore = totalTests > 0
    ? Math.round(history.reduce((sum, r) => sum + r.percentage, 0) / totalTests)
    : 0;
  const maxScore = totalTests > 0 ? Math.max(...history.map(r => r.percentage)) : 0;

  const getBandLabel = (pct: number) => {
    if (pct >= 85) return 'Greater Depth (GD)';
    if (pct >= 65) return 'Expected Standard (EXS)';
    if (pct >= 50) return 'Working Towards (WTS)';
    return 'Below Expected (BEL)';
  };

  const cardWidth = (pageWidth - margin * 2 - 8) / 3;

  // Stat Card 1: Total Tests
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(margin, y, cardWidth, 20, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slate500[0], slate500[1], slate500[2]);
  doc.text('TOTAL ASSESSMENTS', margin + 4, y + 6);
  doc.setFontSize(14);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(`${totalTests}`, margin + 4, y + 15);

  // Stat Card 2: Average Score
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(margin + cardWidth + 4, y, cardWidth, 20, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(slate500[0], slate500[1], slate500[2]);
  doc.text('AVERAGE SCORE', margin + cardWidth + 8, y + 6);
  doc.setFontSize(14);
  doc.setTextColor(indigoPrimary[0], indigoPrimary[1], indigoPrimary[2]);
  doc.text(totalTests > 0 ? `${avgScore}%` : 'N/A', margin + cardWidth + 8, y + 15);

  // Stat Card 3: Overall Attainment Band
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(margin + (cardWidth + 4) * 2, y, cardWidth, 20, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(slate500[0], slate500[1], slate500[2]);
  doc.text('OVERALL BAND', margin + (cardWidth + 4) * 2 + 4, y + 6);
  doc.setFontSize(9);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(totalTests > 0 ? getBandLabel(avgScore) : 'No Records', margin + (cardWidth + 4) * 2 + 4, y + 15);

  y += 26;

  // 4. SUBJECT SUMMARY BREAKDOWN TABLE
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('SUBJECT PERFORMANCE BREAKDOWN', margin, y);
  y += 4;

  const subjectsConfig: { id: string; label: string }[] = [
    { id: 'maths', label: 'Mathematics' },
    { id: 'reading', label: 'Reading Comprehension' },
    { id: 'spag', label: 'SPaG / Grammar' },
    { id: 'science', label: 'Science' },
    { id: 'history', label: 'History' },
    { id: 'geography', label: 'Geography' },
  ];

  // Table Header
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SUBJECT', margin + 4, y + 5);
  doc.text('TESTS TAKEN', margin + 65, y + 5);
  doc.text('AVG SCORE (%)', margin + 105, y + 5);
  doc.text('HIGHEST SCORE', margin + 140, y + 5);
  doc.text('BAND', margin + 175, y + 5);

  y += 7;

  subjectsConfig.forEach((subj, idx) => {
    const subjRecords = history.filter((r) => r.subject === subj.id);
    const count = subjRecords.length;
    const subjAvg = count > 0 ? Math.round(subjRecords.reduce((s, r) => s + r.percentage, 0) / count) : 0;
    const subjMax = count > 0 ? Math.max(...subjRecords.map(r => r.percentage)) : 0;

    const rowBg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
    doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 7, pageWidth - margin, y + 7);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text(subj.label, margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slate700[0], slate700[1], slate700[2]);
    doc.text(`${count}`, margin + 65, y + 5);
    doc.text(count > 0 ? `${subjAvg}%` : '-', margin + 105, y + 5);
    doc.text(count > 0 ? `${subjMax}%` : '-', margin + 140, y + 5);
    doc.text(count > 0 ? getBandLabel(subjAvg).split(' ')[0] + ' ' + getBandLabel(subjAvg).split(' ')[1] : 'N/A', margin + 175, y + 5);

    y += 7;
  });

  y += 8;

  // 5. DETAILED ASSESSMENT HISTORY LOG
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('COMPLETED ASSESSMENT HISTORY LOG', margin, y);
  y += 4;

  // Log Table Header
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('DATE', margin + 4, y + 5);
  doc.text('SUBJECT', margin + 30, y + 5);
  doc.text('TEST TITLE', margin + 65, y + 5);
  doc.text('SCORE', margin + 135, y + 5);
  doc.text('RESULT (%)', margin + 165, y + 5);

  y += 7;

  if (history.length === 0) {
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(margin, y, pageWidth - margin * 2, 8, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(slate500[0], slate500[1], slate500[2]);
    doc.text('No completed assessment logs recorded for this student in the selected scope.', margin + 4, y + 5);
    y += 8;
  } else {
    // Sort recent first
    const sortedHistory = [...history].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    sortedHistory.forEach((rec, idx) => {
      // Check page height space for page overflow safety
      if (y > pageHeight - 35) {
        doc.addPage();
        y = margin;
        // Re-print header row on new page
        doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
        doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('DATE', margin + 4, y + 5);
        doc.text('SUBJECT', margin + 30, y + 5);
        doc.text('TEST TITLE', margin + 65, y + 5);
        doc.text('SCORE', margin + 135, y + 5);
        doc.text('RESULT (%)', margin + 165, y + 5);
        y += 7;
      }

      const rowBg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
      doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
      doc.rect(margin, y, pageWidth - margin * 2, 6.5, 'F');

      doc.setDrawColor(238, 242, 246);
      doc.line(margin, y + 6.5, pageWidth - margin, y + 6.5);

      const recDate = new Date(rec.completedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(slate700[0], slate700[1], slate700[2]);
      doc.text(recDate, margin + 4, y + 4.5);

      const subjName = rec.subject === 'spag' ? 'SPaG' : rec.subject.toUpperCase();
      doc.setFont('helvetica', 'bold');
      doc.text(subjName, margin + 30, y + 4.5);

      doc.setFont('helvetica', 'normal');
      // Truncate long test title if needed
      const cleanTitle = rec.testTitle.length > 35 ? rec.testTitle.substring(0, 33) + '...' : rec.testTitle;
      doc.text(cleanTitle, margin + 65, y + 4.5);

      const scoreText = rec.score !== undefined && rec.totalQuestions ? `${rec.score}/${rec.totalQuestions}` : '-';
      doc.text(scoreText, margin + 135, y + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(rec.percentage >= 65 ? indigoPrimary[0] : darkSlate[0], rec.percentage >= 65 ? indigoPrimary[1] : darkSlate[1], rec.percentage >= 65 ? indigoPrimary[2] : darkSlate[2]);
      doc.text(`${rec.percentage}%`, margin + 165, y + 4.5);

      y += 6.5;
    });
  }

  y += 8;

  // 6. TEACHER REMARKS & SIGNATURE BOX
  const remarksBoxHeight = 32;
  if (y > pageHeight - remarksBoxHeight - 12) {
    doc.addPage();
    y = margin;
  }

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(margin, y, pageWidth - margin * 2, remarksBoxHeight, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navyBlue[0], navyBlue[1], navyBlue[2]);
  doc.text('TEACHER REMARKS & TARGET AREAS:', margin + 4, y + 5);

  if (teacherRemarks && teacherRemarks.trim().length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    const maxTextWidth = pageWidth - margin * 2 - 8;
    const splitRemarks = doc.splitTextToSize(teacherRemarks.trim(), maxTextWidth);
    doc.text(splitRemarks, margin + 4, y + 10);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slate500[0], slate500[1], slate500[2]);
    doc.text('____________________________________________________________________________________________________', margin + 4, y + 11);
    doc.text('____________________________________________________________________________________________________', margin + 4, y + 17);
  }

  // Teacher Signature Line
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(navyBlue[0], navyBlue[1], navyBlue[2]);
  const sigText = teacherSignature && teacherSignature.trim().length > 0 
    ? `Teacher Signature / Name: ${teacherSignature.trim()}          Date: ${dateStr}`
    : 'Teacher Signature: _______________________          Date: _______________';
  doc.text(sigText, margin + 4, y + remarksBoxHeight - 4);

  // Footer page number
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(slate500[0], slate500[1], slate500[2]);
    doc.text(
      `Dersingham Primary School Assessment Tracking System  •  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  // Save the PDF document
  const fileName = `Pupil_Report_${pupil.firstName}_${pupil.lastName}_${termFilter.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
