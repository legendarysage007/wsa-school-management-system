import { TerminalReport, Student, SchoolClass, SchoolInfo, GradingConfig } from '../types';

/**
 * Client-side Print-to-PDF utility for Wisdom Scholars Academy report cards.
 * Generates an isolated, print-optimized document and triggers the browser's
 * native print-to-PDF engine adhering to the defined print CSS specifications.
 */
export function printStudentReportCard(params: {
  report: TerminalReport;
  student: Student;
  schoolClass?: SchoolClass;
  schoolInfo: SchoolInfo;
  gradingConfig: GradingConfig;
}) {
  const { report, student, schoolClass, schoolInfo, gradingConfig } = params;

  const attendancePercent = report.attendanceTotalDays > 0
    ? Math.round((report.attendanceDaysPresent / report.attendanceTotalDays) * 100)
    : 100;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${student.fullName} - Terminal Report Card - ${schoolClass?.name || 'Academic'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.4;
    }
    .report-container {
      max-width: 100%;
      margin: 0 auto;
      border: 2px solid #0f172a;
      padding: 16px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 12px;
      position: relative;
    }
    .header-logo {
      width: 56px;
      height: 56px;
      object-fit: cover;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      margin-bottom: 4px;
    }
    .school-name {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      margin: 2px 0;
      color: #0f172a;
    }
    .school-sub {
      font-size: 10.5px;
      color: #334155;
      font-weight: 500;
    }
    .report-title-banner {
      background: #0f172a;
      color: #ffffff;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-top: 8px;
      display: inline-block;
      border-radius: 4px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      font-size: 9px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
    }
    .meta-value {
      font-size: 11.5px;
      font-weight: 700;
      color: #0f172a;
    }
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }
    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      font-size: 10px;
      text-transform: uppercase;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
    }
    td {
      padding: 5px 8px;
      border: 1px solid #e2e8f0;
      font-size: 10.5px;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 700; }
    .scores-summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
      text-align: center;
    }
    .stat-title {
      font-size: 9.5px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
    }
    .stat-num {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      font-family: 'JetBrains Mono', monospace;
    }
    .remarks-section {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 12px;
    }
    .remark-block {
      margin-bottom: 6px;
    }
    .remark-block:last-child {
      margin-bottom: 0;
    }
    .remark-label {
      font-weight: 700;
      color: #0f172a;
      font-size: 10px;
    }
    .remark-text {
      color: #334155;
      font-style: italic;
      margin-top: 1px;
    }
    .signature-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 16px;
      padding-top: 12px;
      border-top: 1px solid #cbd5e1;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #64748b;
      margin-top: 28px;
      padding-top: 4px;
      font-size: 9.5px;
      color: #334155;
      font-weight: 600;
    }
    .seal-badge {
      font-size: 9px;
      color: #047857;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    @media print {
      body {
        margin: 0;
        background: transparent;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="header">
      <img src="${schoolInfo.logoUrl}" alt="School Crest" class="header-logo" />
      <div class="school-name">${schoolInfo.name}</div>
      <div class="school-sub">
        ${schoolInfo.location}, ${schoolInfo.city}, Ghana · GPS: ${schoolInfo.gpsAddress} · Tel: ${schoolInfo.phone}
      </div>
      <div class="school-sub" style="font-style: italic; margin-top: 2px;">
        Motto: "${schoolInfo.motto}"
      </div>
      <div>
        <span class="report-title-banner">Official Continuous Assessment & Terminal Report</span>
      </div>
    </div>

    <div class="meta-grid">
      <div class="meta-item">
        <span class="meta-label">Name of Scholar</span>
        <span class="meta-value">${student.fullName}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Student ID</span>
        <span class="meta-value font-mono">${student.studentIdNumber}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Class Cohort</span>
        <span class="meta-value">${schoolClass?.name || 'Basic Education'}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Academic Session</span>
        <span class="meta-value font-mono">2026/2027 · Term 1</span>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align: left;">Subject</th>
          <th class="text-right">Class Score (${gradingConfig.classScoreWeight}%)</th>
          <th class="text-right">Exam Score (${gradingConfig.examScoreWeight}%)</th>
          <th class="text-right">Total (100%)</th>
          <th class="text-center">Grade</th>
          <th class="text-left">Remark</th>
        </tr>
      </thead>
      <tbody>
        ${report.scores
          .map(
            (sc) => `
          <tr>
            <td class="font-bold">${sc.subjectName}</td>
            <td class="text-right font-mono">${sc.classScore}</td>
            <td class="text-right font-mono">${sc.examScore}</td>
            <td class="text-right font-bold font-mono">${sc.totalScore}</td>
            <td class="text-center font-bold font-mono">${sc.grade}</td>
            <td>${sc.remark}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <div class="scores-summary-grid">
      <div>
        <div class="stat-title">Overall Position</div>
        <div class="stat-num">#${report.overallPosition} / ${report.classSize}</div>
      </div>
      <div>
        <div class="stat-title">Overall Total & Average</div>
        <div class="stat-num">${report.overallTotal} (${report.overallAverage}%)</div>
      </div>
      <div>
        <div class="stat-title">Attendance Record</div>
        <div class="stat-num">${report.attendanceDaysPresent} / ${report.attendanceTotalDays} (${attendancePercent}%)</div>
      </div>
    </div>

    <div class="remarks-section">
      <div class="remark-block">
        <span class="remark-label">Conduct & Demeanour:</span>
        <div class="remark-text">${report.conduct || 'Respectful, orderly, and of good moral standing.'}</div>
      </div>
      <div class="remark-block" style="margin-top: 6px;">
        <span class="remark-label">Class Teacher's Remark:</span>
        <div class="remark-text">"${report.teacherComment || 'Satisfactory academic progress.'}"</div>
      </div>
      <div class="remark-block" style="margin-top: 6px;">
        <span class="remark-label">Headteacher's Assessment:</span>
        <div class="remark-text">"${report.headteacherComment || 'Approved with distinction.'}"</div>
      </div>
    </div>

    <div class="signature-row">
      <div>
        <div class="seal-badge">Verified Record</div>
        <div class="sig-line">Class Teacher Signature</div>
      </div>
      <div>
        <div class="seal-badge">Official Seal</div>
        <div class="sig-line">Academy Registrar / Stamp</div>
      </div>
      <div>
        <div class="seal-badge">${schoolInfo.headteacherName}</div>
        <div class="sig-line">Headteacher Signature</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

  // Use hidden iframe to avoid popup blocker or iframe restrictions in Google AI Studio
  let printFrame = document.getElementById('wsa-print-iframe') as HTMLIFrameElement;
  if (!printFrame) {
    printFrame = document.createElement('iframe');
    printFrame.id = 'wsa-print-iframe';
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.style.visibility = 'hidden';
    document.body.appendChild(printFrame);
  }

  const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
  if (!frameDoc) {
    window.print();
    return;
  }

  frameDoc.open();
  frameDoc.write(htmlContent);
  frameDoc.close();

  setTimeout(() => {
    try {
      printFrame.contentWindow?.focus();
      printFrame.contentWindow?.print();
    } catch (e) {
      console.warn('Iframe print error, falling back to window.print', e);
      window.print();
    }
  }, 350);
}
