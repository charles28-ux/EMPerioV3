/**
 * State Management & Initial Data for Employee Management System (EMS)
 * Prepared for: Abastillas, Charles R. (EMP-2024-089)
 * Based on EMS Employee User Manual v1.0
 */

const STORAGE_KEY = 'ems_employee_portal_state_v1';

export const initialData = {
  currentUser: {
    employeeId: 'EMP-2024-089',
    firstName: 'Charles',
    lastName: 'Abastillas',
    middleInitial: 'R.',
    fullName: 'Charles R. Abastillas',
    username: 'c.abastillas',
    email: 'charles.abastillas@emperio.corp',
    phone: '+63 (917) 555-0192',
    department: 'Engineering & Technology',
    position: 'Senior Software Engineer',
    employmentType: 'Full-Time Regular',
    hireDate: '2022-03-15',
    workLocation: 'Makati Central Tower / Hybrid',
    reportingManager: 'Marites De Leon (Engineering Director)',
    emergencyContact: {
      name: 'Maria Elena Abastillas',
      relationship: 'Spouse',
      phone: '+63 (920) 888-4321',
      address: '742 Maple St., Pasig City, Metro Manila'
    },
    address: 'Unit 402, Emerald Terraces, Ortigas Center, Pasig City',
    isFirstLogin: false,
    mustChangePassword: false,
    isAuthenticated: false
  },
  
  leaveCredits: {
    vacation: { title: 'Vacation Leave', total: 15, used: 4, pending: 1, available: 10, unit: 'days' },
    sick: { title: 'Sick Leave', total: 12, used: 2, pending: 0, available: 10, unit: 'days' },
    emergency: { title: 'Emergency Leave', total: 5, used: 1, pending: 0, available: 4, unit: 'days' },
    specialPrivilege: { title: 'Special Privilege Leave', total: 3, used: 1, pending: 0, available: 2, unit: 'days' }
  },

  leaveRequests: [
    {
      id: 'LR-2026-004',
      type: 'Vacation Leave',
      startDate: '2026-10-16',
      endDate: '2026-10-17',
      totalDays: 2,
      reason: 'Attending annual regional software architecture summit and scheduled family commitment.',
      attachmentName: 'Summit_Pass_Registration.pdf',
      attachmentSize: '412 KB',
      status: 'pending',
      appliedAt: '2026-10-04 09:30',
      reviewer: 'Marites De Leon',
      remarks: 'Under evaluation by engineering lead.'
    },
    {
      id: 'LR-2026-003',
      type: 'Sick Leave',
      startDate: '2026-09-21',
      endDate: '2026-09-22',
      totalDays: 2,
      reason: 'Acute seasonal flu and doctor-ordered rest as per medical certificate.',
      attachmentName: 'Medical_Certificate_DrSantos.pdf',
      attachmentSize: '820 KB',
      status: 'approved',
      appliedAt: '2026-09-21 07:15',
      reviewedAt: '2026-09-21 10:20',
      reviewer: 'Marites De Leon',
      remarks: 'Approved. Please rest well and ensure daily sync is covered by secondary lead.'
    },
    {
      id: 'LR-2026-002',
      type: 'Special Privilege Leave',
      startDate: '2026-08-14',
      endDate: '2026-08-14',
      totalDays: 1,
      reason: 'Personal administrative compliance and government passport renewal appointment.',
      attachmentName: 'DFA_Appointment_Slip.pdf',
      attachmentSize: '290 KB',
      status: 'approved',
      appliedAt: '2026-08-08 14:00',
      reviewedAt: '2026-08-09 11:45',
      reviewer: 'HR Department',
      remarks: 'Official SPL granted under annual employee benefits program.'
    },
    {
      id: 'LR-2026-001',
      type: 'Vacation Leave',
      startDate: '2026-07-01',
      endDate: '2026-07-04',
      totalDays: 4,
      reason: 'Mid-year family vacation trip to Palawan.',
      attachmentName: null,
      attachmentSize: null,
      status: 'rejected',
      appliedAt: '2026-06-20 16:10',
      reviewedAt: '2026-06-22 09:05',
      reviewer: 'Marites De Leon',
      remarks: 'Conflict with Q3 major system release window. Rescheduled to August upon mutual agreement.'
    }
  ],

  tasks: [
    {
      id: 'TSK-101',
      title: 'Implement Microservice Health Probe & Telemetry',
      description: 'Add Prometheus metrics exporter and custom OpenTelemetry traces for authentication gateway.',
      project: 'Core Infrastructure v2',
      priority: 'high',
      dueDate: '2026-10-12',
      status: 'ongoing',
      progress: 65,
      updatedAt: '2026-10-05 16:40',
      notes: 'Exporter scaffolding completed. Refining tracing spans on token verification.'
    },
    {
      id: 'TSK-102',
      title: 'Audit User Session Invalidation Flow',
      description: 'Ensure token revocation hits distributed Redis cache across all edge cluster regions.',
      project: 'Security & Compliance',
      priority: 'urgent',
      dueDate: '2026-10-08',
      status: 'ongoing',
      progress: 40,
      updatedAt: '2026-10-06 10:15',
      notes: 'Reproduced stale session issue in staging environment. Fixing TTL handling.'
    },
    {
      id: 'TSK-103',
      title: 'Refactor Employee User Profile API Endpoints',
      description: 'Implement payload validation schemas, rate limiting, and audit logging for profile mutations.',
      project: 'EMS Internal Platform',
      priority: 'medium',
      dueDate: '2026-10-20',
      status: 'pending',
      progress: 0,
      updatedAt: '2026-10-02 11:00',
      notes: 'Waiting for final DB migration schema approval from DBA group.'
    },
    {
      id: 'TSK-104',
      title: 'Database Index Optimization for Attendance Logs',
      description: 'Analyze query plan for monthly calendar aggregation over 50,000+ employee clock entries.',
      project: 'EMS Database Tuning',
      priority: 'normal',
      dueDate: '2026-10-25',
      status: 'pending',
      progress: 10,
      updatedAt: '2026-10-03 14:20',
      notes: 'Initial slow queries identified on timestamp range partitions.'
    },
    {
      id: 'TSK-105',
      title: 'Figma UI Alignment for Employee User Manual Screens',
      description: 'Review EMS prototype screens against user manual requirements and verify responsive views.',
      project: 'UI/UX Design Systems',
      priority: 'urgent',
      dueDate: '2026-10-06',
      status: 'finished',
      progress: 100,
      updatedAt: '2026-10-06 12:30',
      notes: 'Completed review against Figma link PzzBSTjoZPtcJyPYhn98Xo and user manual specification.'
    },
    {
      id: 'TSK-106',
      title: 'Quarterly Security Vulnerability Scan Patching',
      description: 'Upgrade base container images and update npm dependencies flagged in monthly scan.',
      project: 'DevSecOps',
      priority: 'high',
      dueDate: '2026-09-30',
      status: 'finished',
      progress: 100,
      updatedAt: '2026-09-29 18:00',
      notes: 'All CVEs resolved. Container builds verified in CI/CD pipeline.'
    }
  ],

  announcements: [
    {
      id: 'ANN-2026-09',
      title: 'Mandatory EMS Account Security & Password Policy Update',
      category: 'Policy',
      date: '2026-10-05',
      author: 'Information Security & Compliance Office',
      priority: 'urgent',
      isRead: false,
      summary: 'Effective October 15, all employee accounts must update to compliant 12-character passphrases with multi-factor verification.',
      fullContent: `To: All Emperio Corporation Employees\nFrom: InfoSec & Compliance Group\nDate: October 5, 2026\nSubject: Mandatory System Security & Password Standard Update\n\nIn accordance with ISO/IEC 27001 standards and recent security audit recommendations, the Employee Management System (EMS) requires all staff to comply with updated authentication guidelines:\n\n1. Password length must be at least 12 characters, including upper and lower case letters, numbers, and symbols.\n2. Passwords will expire every 90 days.\n3. Default passwords provided during onboarding must be changed immediately upon first login.\n4. Account sharing and credential disclosure to third parties is strictly prohibited.\n\nPlease refer to the attached corporate memo PDF for full compliance details.`,
      pdfName: 'Policy_Memo_2026_09_Password_Standards.pdf',
      pdfSize: '1.4 MB'
    },
    {
      id: 'ANN-2026-08',
      title: 'Year-End Performance Evaluation & Appraisal Timeline',
      category: 'HR Notice',
      date: '2026-10-02',
      author: 'People & Culture Department',
      priority: 'normal',
      isRead: false,
      summary: 'Self-assessment submissions for the 2026 annual performance cycle open on October 20 via the EMS portal.',
      fullContent: `Dear Team,\n\nThe 2026 Annual Performance Review cycle is scheduled to commence on October 20, 2026. Employees are requested to review assigned OKRs and update task deliverables in advance.\n\nKey Dates:\n- Oct 20 - Nov 05: Employee Self-Appraisal window\n- Nov 06 - Nov 20: Manager One-on-One reviews\n- Dec 01 - Dec 15: Calibration and merit adjustments\n\nDetailed evaluation rubrics and guidebooks are available in the accompanying documentation.`,
      pdfName: 'HR_Annual_Review_Guide_2026.pdf',
      pdfSize: '2.8 MB'
    },
    {
      id: 'ANN-2026-07',
      title: 'Upcoming Public Holiday Observance: Philippine National Holidays',
      category: 'Operations',
      date: '2026-09-28',
      author: 'HR Operations',
      priority: 'normal',
      isRead: true,
      summary: 'Special non-working holidays schedule and shift coverage details for the upcoming November long weekend.',
      fullContent: `Please be advised of the upcoming holiday schedule for all corporate offices and engineering support squads. Normal office operations will resume on the subsequent business day. On-call support engineers will receive standard holiday premium compensation.`,
      pdfName: 'Holiday_Operations_Schedule_Q4.pdf',
      pdfSize: '650 KB'
    },
    {
      id: 'ANN-2026-06',
      title: 'Q4 Townhall Meeting & Tech Innovation Showcase',
      category: 'Event',
      date: '2026-09-15',
      author: 'Corporate Communications',
      priority: 'normal',
      isRead: true,
      summary: 'Join executive leadership on October 18 for our hybrid quarterly townhall and live engineering demos.',
      fullContent: `We invite everyone to celebrate our Q3 engineering milestones and discuss strategic priorities for the upcoming fiscal quarter. Food and refreshments will be provided for on-site attendees in the main amphitheater.`,
      pdfName: 'Townhall_Agenda_Invite.pdf',
      pdfSize: '980 KB'
    }
  ],

  // Monthly Attendance Log dataset (October 2026 & September 2026)
  attendance: {
    selectedMonth: '2026-10',
    todayStatus: {
      date: '2026-10-06',
      clockedIn: true,
      clockInTime: '08:42 AM',
      clockedOut: false,
      clockOutTime: '--:--',
      currentHours: '5h 38m',
      status: 'present'
    },
    records: {
      '2026-10-01': { status: 'present', clockIn: '08:45 AM', clockOut: '05:35 PM', hoursWorked: 8.8, note: 'Normal regular shift' },
      '2026-10-02': { status: 'present', clockIn: '08:50 AM', clockOut: '05:40 PM', hoursWorked: 8.8, note: 'Sprint planning day' },
      '2026-10-03': { status: 'weekend', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Saturday' },
      '2026-10-04': { status: 'weekend', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Sunday' },
      '2026-10-05': { status: 'late', clockIn: '09:22 AM', clockOut: '06:15 PM', hoursWorked: 8.9, note: 'Late 22 mins due to traffic rain' },
      '2026-10-06': { status: 'present', clockIn: '08:42 AM', clockOut: '--:--', hoursWorked: 5.6, note: 'Active session today' },
      '2026-10-07': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-08': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-09': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-10': { status: 'weekend', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Saturday' },
      '2026-10-11': { status: 'weekend', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Sunday' },
      '2026-10-12': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-13': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-14': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-15': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-16': { status: 'leave', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Pending Vacation Leave' },
      '2026-10-17': { status: 'leave', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Pending Vacation Leave' },
      '2026-10-18': { status: 'weekend', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Saturday' },
      '2026-10-19': { status: 'weekend', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Sunday' },
      '2026-10-20': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-21': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-22': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-23': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-24': { status: 'weekend', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Saturday' },
      '2026-10-25': { status: 'weekend', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Sunday' },
      '2026-10-26': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-27': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-28': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-29': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-30': { status: 'scheduled', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Scheduled shift' },
      '2026-10-31': { status: 'holiday', clockIn: null, clockOut: null, hoursWorked: 0, note: 'Special Non-Working Holiday' }
    }
  }
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveState(initialData);
      return JSON.parse(JSON.stringify(initialData));
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load local state, using initial:', err);
    return JSON.parse(JSON.stringify(initialData));
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function resetDemoState() {
  localStorage.removeItem(STORAGE_KEY);
  saveState(initialData);
  return JSON.parse(JSON.stringify(initialData));
}
