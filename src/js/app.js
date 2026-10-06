/**
 * EMPERIO EMS - Employee Management System
 * Core Application Controller
 * Version 1.0 (Based on EMS Employee User Manual v1.0)
 */

import { loadState, saveState, resetDemoState } from './state.js';

let appState = loadState();

// DOM Content Loaded Initializer
document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initAuthFlow();
  initNavigation();
  initAttendanceSection();
  initTasksSection();
  initAnnouncementsSection();
  initLeaveSection();
  initProfileSection();
  initCredentialsSection();
  initGlobalControls();
  renderAllViews();
});

/* ========================================================
   1. AUTHENTICATION & LOGIN FLOW (Sections 4.1, 4.2 & 4.3)
   ======================================================== */
function initAuthFlow() {
  const authContainer = document.getElementById('authContainer');
  const appContainer = document.getElementById('appContainer');

  const tabLoginBtn = document.getElementById('tabLoginBtn');
  const tabActivateBtn = document.getElementById('tabActivateBtn');
  const tabFirstLoginBtn = document.getElementById('tabFirstLoginBtn');

  const loginForm = document.getElementById('loginForm');
  const activateForm = document.getElementById('activateForm');
  const firstLoginForm = document.getElementById('firstLoginForm');

  // Check auth state
  if (appState.currentUser.isAuthenticated) {
    authContainer.style.display = 'none';
    appContainer.style.display = 'flex';
  } else {
    authContainer.style.display = 'flex';
    appContainer.style.display = 'none';
  }

  // Auth Tab Switchers
  function switchAuthTab(activeBtn, activeForm) {
    [tabLoginBtn, tabActivateBtn, tabFirstLoginBtn].forEach(btn => btn.classList.remove('active'));
    [loginForm, activateForm, firstLoginForm].forEach(form => form.style.display = 'none');
    
    activeBtn.classList.add('active');
    activeForm.style.display = 'block';
  }

  tabLoginBtn?.addEventListener('click', () => switchAuthTab(tabLoginBtn, loginForm));
  tabActivateBtn?.addEventListener('click', () => switchAuthTab(tabActivateBtn, activateForm));
  tabFirstLoginBtn?.addEventListener('click', () => switchAuthTab(tabFirstLoginBtn, firstLoginForm));

  // 4.1 & 4.2: Login Submit & Validation
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const validationAlert = document.getElementById('loginValidationAlert');

    // Validation rule (Section 4.2)
    if (!email || !email.includes('@') || !password) {
      validationAlert.style.display = 'block';
      showToast('Validation Failed: Please enter email and password.', 'error');
      return;
    }

    // Check against current user
    if (email.toLowerCase() === appState.currentUser.email.toLowerCase() || email === 'admin@emperio.corp') {
      validationAlert.style.display = 'none';
      appState.currentUser.isAuthenticated = true;
      saveState(appState);

      showToast(`Welcome back, ${appState.currentUser.fullName}!`, 'success');
      authContainer.style.display = 'none';
      appContainer.style.display = 'flex';
      renderAllViews();
    } else {
      validationAlert.style.display = 'block';
      showToast('Authentication failed: Invalid credentials.', 'error');
    }
  });

  // Demo Quick-Fill
  document.getElementById('btnQuickDemoLogin')?.addEventListener('click', () => {
    document.getElementById('loginEmail').value = appState.currentUser.email;
    document.getElementById('loginPassword').value = 'Emp@Charles2026!';
    loginForm.dispatchEvent(new Event('submit'));
  });

  // Feature 1: Account Activation
  activateForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const empId = document.getElementById('activateEmpId').value.trim();
    const email = document.getElementById('activateEmail').value.trim();

    if (!empId || !email) {
      showToast('Please provide both Employee ID and registered company email.', 'error');
      return;
    }

    // Simulate account activation & default password dispatch
    showToast(`Account ${empId} activated! Default password sent to ${email}.`, 'success');
    switchAuthTab(tabFirstLoginBtn, firstLoginForm);
    document.getElementById('firstExistingPwd').value = 'DefaultEmp@2026';
    document.getElementById('firstNewUsername').value = email.split('@')[0];
  });

  // Feature 3: First Login Credential Setup
  firstLoginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const existing = document.getElementById('firstExistingPwd').value.trim();
    const newUsername = document.getElementById('firstNewUsername').value.trim();
    const newPwd = document.getElementById('firstNewPwd').value.trim();
    const confirmPwd = document.getElementById('firstConfirmPwd').value.trim();

    if (!existing) {
      showToast('Please enter your existing default password.', 'error');
      return;
    }
    if (newPwd.length < 8) {
      showToast('New password must be at least 8 characters.', 'error');
      return;
    }
    if (newPwd !== confirmPwd) {
      showToast('Password confirmation does not match.', 'error');
      return;
    }

    // Save updated credentials
    appState.currentUser.username = newUsername || appState.currentUser.username;
    appState.currentUser.isAuthenticated = true;
    appState.currentUser.isFirstLogin = false;
    saveState(appState);

    showToast('First-time setup completed! Account credentials updated.', 'success');
    authContainer.style.display = 'none';
    appContainer.style.display = 'flex';
    renderAllViews();
  });

  // Forgot password shortcut
  document.getElementById('linkForgotPassword')?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Password reset link sent to registered email address.', 'info');
  });
}

/* ========================================================
   2. APP SHELL NAVIGATION & SECTION ROUTING
   ======================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link, [data-target]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('data-target');
      if (!targetId) return;

      e.preventDefault();
      navigateToSection(targetId);
    });
  });

  // Top header button shortcuts
  document.getElementById('btnTopAnnouncements')?.addEventListener('click', () => {
    navigateToSection('announcementsSection');
  });

  document.getElementById('btnTopProfile')?.addEventListener('click', () => {
    navigateToSection('profileSection');
  });

  document.getElementById('btnRefJumpLogin')?.addEventListener('click', () => {
    logoutUser();
  });
}

function navigateToSection(sectionId) {
  const sections = document.querySelectorAll('.portal-section');
  const sidebarLinks = document.querySelectorAll('.sidebar-nav .nav-link');

  sections.forEach(sec => sec.classList.remove('active'));
  sidebarLinks.forEach(link => {
    if (link.getAttribute('data-target') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update Topbar Title according to section
  const headingTitles = {
    dashboardSection: { title: 'Employee Overview', desc: 'Centralized workspace for daily employee responsibilities & monitoring' },
    attendanceSection: { title: 'Attendance Records', desc: 'Review monthly attendance logs, punch times, and schedule' },
    tasksSection: { title: 'Assigned Tasks', desc: 'Track task milestones, status updates, and deliverables' },
    announcementsSection: { title: 'Company Announcements', desc: 'Official communications, policies, and supporting documents' },
    leaveSection: { title: 'Leave Management', desc: 'Leave credits review, 5-step application builder, and status tracking' },
    profileSection: { title: 'Personal Profile', desc: 'Employee personal and employment record maintenance' },
    credentialsSection: { title: 'Change Password', desc: 'Manage account security credentials and authentication' },
    manualGuideSection: { title: 'User Manual Map', desc: 'Quick reference guide matching Employee User Manual v1.0' }
  };

  const currentMeta = headingTitles[sectionId] || { title: 'Employee Portal', desc: 'Employee Management System' };
  document.getElementById('pageHeadingTitle').textContent = currentMeta.title;
  document.getElementById('pageHeadingDesc').textContent = currentMeta.desc;
}

function logoutUser() {
  appState.currentUser.isAuthenticated = false;
  saveState(appState);
  document.getElementById('appContainer').style.display = 'none';
  document.getElementById('authContainer').style.display = 'flex';
  showToast('Logged out successfully.', 'info');
}

/* ========================================================
   3. SECTION 4.5: ATTENDANCE RECORDS & CALENDAR
   ======================================================== */
function initAttendanceSection() {
  const selectMonth = document.getElementById('selectAttendanceMonth');
  const btnPrev = document.getElementById('btnPrevMonth');
  const btnNext = document.getElementById('btnNextMonth');

  selectMonth?.addEventListener('change', (e) => {
    appState.attendance.selectedMonth = e.target.value;
    saveState(appState);
    renderCalendar();
  });

  btnPrev?.addEventListener('click', () => {
    if (selectMonth.selectedIndex < selectMonth.options.length - 1) {
      selectMonth.selectedIndex++;
      selectMonth.dispatchEvent(new Event('change'));
    }
  });

  btnNext?.addEventListener('click', () => {
    if (selectMonth.selectedIndex > 0) {
      selectMonth.selectedIndex--;
      selectMonth.dispatchEvent(new Event('change'));
    }
  });

  // Time Tracker Clock In/Out Action
  const btnClockToggle = document.getElementById('btnClockToggle');
  btnClockToggle?.addEventListener('click', () => {
    const today = appState.attendance.todayStatus;
    if (today.clockedIn && !today.clockedOut) {
      // Clock out
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      today.clockedOut = true;
      today.clockOutTime = timeStr;
      showToast(`Clocked Out at ${timeStr}. Have a great evening!`, 'info');
    } else {
      // Clock in
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      today.clockedIn = true;
      today.clockedOut = false;
      today.clockInTime = timeStr;
      showToast(`Clocked In at ${timeStr}. Welcome!`, 'success');
    }
    saveState(appState);
    renderTimeTracker();
    renderCalendar();
  });
}

function renderTimeTracker() {
  const today = appState.attendance.todayStatus;
  const badge = document.getElementById('clockStatusBadge');
  const btn = document.getElementById('btnClockToggle');

  if (today.clockedIn && !today.clockedOut) {
    badge.className = 'tracker-status-tag clocked-in';
    badge.textContent = `● In: ${today.clockInTime}`;
    btn.className = 'btn-clock-action out';
    btn.textContent = 'Clock Out';
  } else if (today.clockedIn && today.clockedOut) {
    badge.className = 'tracker-status-tag clocked-out';
    badge.textContent = `Shift Ended (${today.clockOutTime})`;
    btn.className = 'btn-clock-action in';
    btn.textContent = 'Clock In';
  } else {
    badge.className = 'tracker-status-tag clocked-out';
    badge.textContent = '● Not Clocked In';
    btn.className = 'btn-clock-action in';
    btn.textContent = 'Clock In';
  }
}

function renderCalendar() {
  const container = document.getElementById('calendarDaysContainer');
  if (!container) return;

  const monthKey = appState.attendance.selectedMonth; // '2026-10'
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  container.innerHTML = '';

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const prevDayNum = daysInPrevMonth - i;
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell other-month';
    cell.innerHTML = `
      <div class="day-cell-header">
        <span class="day-number">${prevDayNum}</span>
      </div>
    `;
    container.appendChild(cell);
  }

  // Current month active days
  let countPresent = 0;
  let countLate = 0;
  let countAbsent = 0;
  let countLeave = 0;
  let totalHours = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const dateFormatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const record = appState.attendance.records[dateFormatted] || { status: 'scheduled' };
    const isToday = dateFormatted === appState.attendance.todayStatus.date;

    const cell = document.createElement('div');
    cell.className = `calendar-day-cell ${isToday ? 'today' : ''}`;

    let statusPillHtml = '';
    let timeStampHtml = '';

    if (record.status === 'present') {
      countPresent++;
      totalHours += record.hoursWorked || 8;
      statusPillHtml = `<span class="day-badge-pill present">Present</span>`;
      timeStampHtml = `<div class="day-time-stamp"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg> ${record.clockIn} - ${record.clockOut}</div>
                       <div class="day-hours-pill">${record.hoursWorked} hrs</div>`;
    } else if (record.status === 'late') {
      countLate++;
      totalHours += record.hoursWorked || 8;
      statusPillHtml = `<span class="day-badge-pill late">Late</span>`;
      timeStampHtml = `<div class="day-time-stamp"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg> ${record.clockIn} - ${record.clockOut}</div>
                       <div class="day-hours-pill">${record.hoursWorked} hrs (Late)</div>`;
    } else if (record.status === 'absent') {
      countAbsent++;
      statusPillHtml = `<span class="day-badge-pill absent">Absent</span>`;
    } else if (record.status === 'leave') {
      countLeave++;
      statusPillHtml = `<span class="day-badge-pill leave">Leave</span>`;
      timeStampHtml = `<div class="day-hours-pill" style="color: #7c3aed;">${record.note || 'Approved Leave'}</div>`;
    } else if (record.status === 'holiday') {
      statusPillHtml = `<span class="day-badge-pill holiday">Holiday</span>`;
      timeStampHtml = `<div class="day-hours-pill" style="color: #0284c7;">Special Non-Working</div>`;
    } else if (record.status === 'weekend') {
      statusPillHtml = `<span class="day-badge-pill weekend">Off</span>`;
    } else {
      statusPillHtml = `<span style="font-size: 10px; color: var(--slate-400);">Regular</span>`;
    }

    cell.innerHTML = `
      <div class="day-cell-header">
        <span class="day-number">${d}</span>
        ${statusPillHtml}
      </div>
      <div class="day-cell-meta">
        ${timeStampHtml}
      </div>
    `;

    // Interactive date click
    cell.addEventListener('click', () => {
      showToast(`Date: ${dateFormatted} | Status: ${record.status.toUpperCase()} | ${record.note || 'No special remarks'}`, 'info');
    });

    container.appendChild(cell);
  }

  // Update summary metrics in attendance header
  document.getElementById('metricWorkDays').textContent = '22';
  document.getElementById('metricDaysPresent').textContent = (countPresent + countLate).toString();
  document.getElementById('metricDaysLate').textContent = countLate.toString();
  document.getElementById('metricHoursLogged').textContent = `${totalHours.toFixed(1)}h`;
}

/* ========================================================
   4. SECTION 4.6: ASSIGNED TASKS & STATUS MODAL
   ======================================================== */
let activeTaskFilter = 'all';
let taskSearchQuery = '';
let currentEditingTaskId = null;

function initTasksSection() {
  const filterBtns = document.querySelectorAll('#taskFilterButtons .filter-pill-btn');
  const searchInput = document.getElementById('taskSearchInput');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTaskFilter = btn.getAttribute('data-filter');
      renderTasks();
    });
  });

  searchInput?.addEventListener('input', (e) => {
    taskSearchQuery = e.target.value.toLowerCase().trim();
    renderTasks();
  });

  // Modal event listeners
  const modal = document.getElementById('updateTaskModal');
  const btnClose = document.getElementById('btnCloseTaskModal');
  const btnCancel = document.getElementById('btnCancelTaskModal');
  const updateForm = document.getElementById('updateTaskForm');
  const progressSlider = document.getElementById('modalTaskProgressSlider');
  const progressText = document.getElementById('modalTaskProgressText');
  const statusSelect = document.getElementById('modalTaskStatusSelect');

  progressSlider?.addEventListener('input', (e) => {
    progressText.textContent = `${e.target.value}%`;
  });

  statusSelect?.addEventListener('change', (e) => {
    if (e.target.value === 'finished') {
      progressSlider.value = 100;
      progressText.textContent = '100%';
    } else if (e.target.value === 'pending') {
      progressSlider.value = 0;
      progressText.textContent = '0%';
    }
  });

  [btnClose, btnCancel].forEach(btn => {
    btn?.addEventListener('click', () => {
      modal.classList.remove('active');
      currentEditingTaskId = null;
    });
  });

  // Submit task status update
  updateForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentEditingTaskId) return;

    const task = appState.tasks.find(t => t.id === currentEditingTaskId);
    if (task) {
      task.status = statusSelect.value;
      task.progress = parseInt(progressSlider.value, 10);
      task.notes = document.getElementById('modalTaskNotes').value.trim();
      task.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

      saveState(appState);
      showToast(`Task ${task.id} status updated to ${task.status.toUpperCase()}!`, 'success');
      modal.classList.remove('active');
      renderTasks();
      renderDashboardPreview();
      updateBadges();
    }
  });
}

function openUpdateTaskModal(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;

  currentEditingTaskId = taskId;
  document.getElementById('modalTaskId').textContent = task.id;
  document.getElementById('modalTaskTitle').textContent = task.title;
  document.getElementById('modalTaskStatusSelect').value = task.status;
  document.getElementById('modalTaskProgressSlider').value = task.progress;
  document.getElementById('modalTaskProgressText').textContent = `${task.progress}%`;
  document.getElementById('modalTaskNotes').value = task.notes || '';

  const modal = document.getElementById('updateTaskModal');
  modal.classList.add('active');
}

function renderTasks() {
  const container = document.getElementById('tasksListContainer');
  if (!container) return;

  let filtered = appState.tasks.filter(task => {
    const matchesFilter = activeTaskFilter === 'all' || task.status === activeTaskFilter;
    const matchesSearch = !taskSearchQuery || 
      task.title.toLowerCase().includes(taskSearchQuery) || 
      task.project.toLowerCase().includes(taskSearchQuery);
    return matchesFilter && matchesSearch;
  });

  // Counts
  const ongoingCount = appState.tasks.filter(t => t.status === 'ongoing').length;
  const pendingCount = appState.tasks.filter(t => t.status === 'pending').length;
  const finishedCount = appState.tasks.filter(t => t.status === 'finished').length;

  document.getElementById('countTasksOngoing').textContent = ongoingCount;
  document.getElementById('countTasksPending').textContent = pendingCount;
  document.getElementById('countTasksFinished').textContent = finishedCount;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; background: var(--white); padding: 40px; text-align: center; border-radius: var(--radius-lg); border: 1px dashed var(--slate-300);">
        <p style="font-size: 14px; color: var(--slate-500); font-weight: 600;">No tasks found matching your filter criteria.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(task => `
    <div class="task-card" data-task-id="${task.id}">
      <div>
        <div class="task-card-header">
          <span class="task-id-badge">${task.id}</span>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="task-priority-pill ${task.priority}">${task.priority}</span>
            <!-- Three-dots action menu (Manual requirement 4.6) -->
            <button type="button" class="three-dots-btn btn-open-task-menu" title="Update Task Status" data-task-id="${task.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
            </button>
          </div>
        </div>

        <h3 class="task-title">${task.title}</h3>
        <p class="task-desc">${task.description}</p>
        <div style="font-size: 11.5px; color: var(--navy-700); font-weight: 700; margin-top: 8px;">
          Project: ${task.project}
        </div>
      </div>

      <div class="task-card-meta">
        <div class="task-meta-row">
          <span style="color: var(--slate-500);">Due: <strong>${task.dueDate}</strong></span>
          <span class="task-status-pill ${task.status}">${task.status}</span>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--slate-500); margin-bottom: 4px;">
            <span>Progress</span>
            <span style="font-weight: 700; color: var(--navy-900);">${task.progress}%</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width: ${task.progress}%;"></div>
          </div>
        </div>

        <button type="button" class="btn-secondary btn-quick-update" style="height: 34px; font-size: 12px; margin-top: 6px; width: 100%;" data-task-id="${task.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          <span>Update Task Pop-up</span>
        </button>
      </div>
    </div>
  `).join('');

  // Attach click listeners to three-dots menu & update buttons
  container.querySelectorAll('.btn-open-task-menu, .btn-quick-update').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-task-id');
      openUpdateTaskModal(id);
    });
  });
}

/* ========================================================
   5. SECTION 4.7: ANNOUNCEMENTS & PDF MODAL
   ======================================================== */
let activeAnnounceFilter = 'all';
let currentModalAnnounceId = null;

function initAnnouncementsSection() {
  const filterBtns = document.querySelectorAll('#announcementFilterButtons .filter-pill-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAnnounceFilter = btn.getAttribute('data-filter');
      renderAnnouncements();
    });
  });

  const modal = document.getElementById('announcementDetailModal');
  const btnClose = document.getElementById('btnCloseAnnounceModal');
  const btnCloseFooter = document.getElementById('btnCloseAnnounceFooter');
  const btnMarkRead = document.getElementById('btnModalMarkAsRead');
  const btnDownloadPdf = document.getElementById('btnDownloadMockPdf');

  [btnClose, btnCloseFooter].forEach(b => b?.addEventListener('click', () => {
    modal.classList.remove('active');
    currentModalAnnounceId = null;
  }));

  btnMarkRead?.addEventListener('click', () => {
    if (!currentModalAnnounceId) return;
    const ann = appState.announcements.find(a => a.id === currentModalAnnounceId);
    if (ann) {
      ann.isRead = !ann.isRead;
      saveState(appState);
      showToast(ann.isRead ? 'Marked announcement as read.' : 'Marked announcement as unread.', 'success');
      modal.classList.remove('active');
      renderAnnouncements();
      renderDashboardPreview();
      updateBadges();
    }
  });

  btnDownloadPdf?.addEventListener('click', () => {
    showToast('Official policy document PDF downloaded to system.', 'info');
  });
}

function openAnnouncementModal(id) {
  const ann = appState.announcements.find(a => a.id === id);
  if (!ann) return;

  currentModalAnnounceId = id;
  document.getElementById('announceModalCategory').textContent = ann.category.toUpperCase();
  document.getElementById('announceModalPriorityTag').style.display = ann.priority === 'urgent' ? 'inline-block' : 'none';
  document.getElementById('announceModalTitle').textContent = ann.title;
  document.getElementById('announceModalAuthor').textContent = `Author: ${ann.author}`;
  document.getElementById('announceModalDate').textContent = `Published: ${ann.date}`;
  document.getElementById('announceModalFullText').textContent = ann.fullContent;

  const pdfCard = document.getElementById('announcePdfAttachmentCard');
  if (ann.pdfName) {
    pdfCard.style.display = 'flex';
    document.getElementById('announcePdfFileName').textContent = ann.pdfName;
    document.getElementById('announcePdfFileSize').textContent = `${ann.pdfSize} • Official PDF Document`;
  } else {
    pdfCard.style.display = 'none';
  }

  const markBtnText = document.getElementById('btnModalMarkText');
  markBtnText.textContent = ann.isRead ? 'Mark as Unread' : 'Mark as Read';

  // Mark as read automatically when opened
  if (!ann.isRead) {
    ann.isRead = true;
    saveState(appState);
    updateBadges();
  }

  document.getElementById('announcementDetailModal').classList.add('active');
}

function renderAnnouncements() {
  const container = document.getElementById('announcementsContainer');
  if (!container) return;

  let filtered = appState.announcements.filter(ann => {
    if (activeAnnounceFilter === 'unread') return !ann.isRead;
    if (activeAnnounceFilter === 'urgent') return ann.priority === 'urgent';
    if (activeAnnounceFilter === 'policy') return ann.category.toLowerCase() === 'policy';
    return true;
  });

  const urgentCount = appState.announcements.filter(a => a.priority === 'urgent').length;
  const unreadCount = appState.announcements.filter(a => !a.isRead).length;

  document.getElementById('urgentAnnounceCount').textContent = `${urgentCount} Action Required`;
  document.getElementById('unreadAnnounceCount').textContent = `${unreadCount} Unread`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="background: var(--white); padding: 40px; text-align: center; border-radius: var(--radius-lg); border: 1px dashed var(--slate-300);">
        <p style="font-size: 14px; color: var(--slate-500); font-weight: 600;">No announcements found matching this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(ann => `
    <div class="announcement-card ${ann.priority === 'urgent' ? 'urgent' : ''} ${!ann.isRead ? 'unread' : ''}" data-id="${ann.id}">
      <div class="announcement-top">
        <div class="announcement-tags">
          <span class="badge-tag ${ann.category.toLowerCase()}">${ann.category}</span>
          ${ann.priority === 'urgent' ? '<span class="badge-tag urgent">URGENT</span>' : ''}
          ${!ann.isRead ? '<span class="badge-tag unread">NEW</span>' : ''}
        </div>
        <span style="font-size: 12px; color: var(--slate-400); font-weight: 600;">${ann.date}</span>
      </div>

      <h3 class="announcement-title">${ann.title}</h3>
      <p class="announcement-summary">${ann.summary}</p>

      <div class="announcement-bottom">
        <div class="announcement-author-meta">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span>${ann.author}</span>
        </div>

        <div class="announcement-actions">
          ${ann.pdfName ? `
            <button type="button" class="btn-pdf-view btn-view-pdf" data-id="${ann.id}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
              <span>Supporting PDF</span>
            </button>
          ` : ''}

          <button type="button" class="btn-secondary btn-read-notice" style="height: 32px; font-size: 12px;" data-id="${ann.id}">
            <span>Read Notice</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-read-notice, .btn-view-pdf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      openAnnouncementModal(id);
    });
  });
}

/* ========================================================
   6. SECTION 4.8: LEAVE MANAGEMENT & CREATION WORKFLOW
   ======================================================== */
let activeLeaveFilter = 'all';
let selectedMockAttachment = null;

function initLeaveSection() {
  const startDateInput = document.getElementById('leaveStartDate');
  const endDateInput = document.getElementById('leaveEndDate');
  const daysBadge = document.getElementById('leaveCalculatedDaysBadge');

  function calculateLeaveDays() {
    const start = new Date(startDateInput.value);
    const end = new Date(endDateInput.value);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      daysBadge.textContent = 'Invalid date range';
      return 0;
    }

    let count = 0;
    let cur = new Date(start);
    while (cur <= end) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) { // skip weekends
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    daysBadge.textContent = `${count} Working Day${count === 1 ? '' : 's'}`;
    return count;
  }

  startDateInput?.addEventListener('change', calculateLeaveDays);
  endDateInput?.addEventListener('change', calculateLeaveDays);

  // File Upload Dropzone
  const dropzone = document.getElementById('dropzoneAttachment');
  const fileInput = document.getElementById('leaveAttachmentInput');
  const fileTag = document.getElementById('attachedFileNameTag');
  const fileTagText = document.getElementById('attachedFileNameText');

  dropzone?.addEventListener('click', () => fileInput.click());
  fileInput?.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      selectedMockAttachment = {
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`
      };
      fileTagText.textContent = `${file.name} (${selectedMockAttachment.size})`;
      fileTag.style.display = 'inline-flex';
      showToast(`Attached document: ${file.name}`, 'info');
    }
  });

  // Submit Leave Request (Steps 01-05 in manual)
  const leaveForm = document.getElementById('createLeaveForm');
  leaveForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const leaveType = document.getElementById('leaveTypeSelect').value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const reason = document.getElementById('leaveReasonInput').value.trim();

    const days = calculateLeaveDays();
    if (days <= 0) {
      showToast('Please select a valid date range containing at least one working day.', 'error');
      return;
    }

    if (!reason) {
      showToast('Please provide a reason or justification for this leave request.', 'error');
      return;
    }

    // Generate new request ID
    const newId = `LR-2026-${String(appState.leaveRequests.length + 1).padStart(3, '0')}`;
    const newReq = {
      id: newId,
      type: leaveType,
      startDate,
      endDate,
      totalDays: days,
      reason,
      attachmentName: selectedMockAttachment ? selectedMockAttachment.name : null,
      attachmentSize: selectedMockAttachment ? selectedMockAttachment.size : null,
      status: 'pending',
      appliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      reviewer: appState.currentUser.reportingManager,
      remarks: 'Pending manager and HR review.'
    };

    appState.leaveRequests.unshift(newReq);

    // Update pending credit count
    if (leaveType.includes('Vacation')) {
      appState.leaveCredits.vacation.pending += days;
    } else if (leaveType.includes('Sick')) {
      appState.leaveCredits.sick.pending += days;
    }

    saveState(appState);
    showToast(`Leave request ${newId} submitted for approval!`, 'success');

    // Reset Form
    document.getElementById('leaveReasonInput').value = '';
    selectedMockAttachment = null;
    fileTag.style.display = 'none';

    renderLeaveCredits();
    renderLeaveHistory();
    renderDashboardPreview();
  });

  // Leave Status Filters
  const statusFilterBtns = document.querySelectorAll('#leaveStatusFilters .filter-pill-btn');
  statusFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      statusFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLeaveFilter = btn.getAttribute('data-filter');
      renderLeaveHistory();
    });
  });

  // Leave Detail Modal
  const detailModal = document.getElementById('leaveDetailModal');
  const btnCloseDetail = document.getElementById('btnCloseLeaveDetailModal');
  const btnCloseDetailFooter = document.getElementById('btnCloseLeaveDetailFooter');

  [btnCloseDetail, btnCloseDetailFooter].forEach(b => b?.addEventListener('click', () => {
    detailModal.classList.remove('active');
  }));
}

function openLeaveDetailModal(reqId) {
  const req = appState.leaveRequests.find(r => r.id === reqId);
  if (!req) return;

  document.getElementById('modalLeaveId').textContent = req.id;
  document.getElementById('modalLeaveType').textContent = req.type;
  
  const statusBadge = document.getElementById('modalLeaveStatusBadge');
  statusBadge.className = `task-status-pill ${req.status}`;
  statusBadge.textContent = req.status.toUpperCase();

  document.getElementById('modalLeaveDates').textContent = `${req.startDate} to ${req.endDate} (${req.totalDays} Day${req.totalDays === 1 ? '' : 's'})`;
  document.getElementById('modalLeaveReason').textContent = req.reason;

  const attachWrap = document.getElementById('modalLeaveAttachmentWrap');
  if (req.attachmentName) {
    attachWrap.style.display = 'block';
    document.getElementById('modalLeaveAttachmentName').textContent = `${req.attachmentName} (${req.attachmentSize || 'Doc'})`;
  } else {
    attachWrap.style.display = 'none';
  }

  document.getElementById('modalLeaveReviewer').textContent = `Evaluator: ${req.reviewer || 'Department Head'}`;
  document.getElementById('modalLeaveRemarks').textContent = req.remarks || 'No remarks provided.';

  document.getElementById('leaveDetailModal').classList.add('active');
}

function renderLeaveCredits() {
  const { vacation, sick, emergency, specialPrivilege } = appState.leaveCredits;
  document.getElementById('creditVLAvail').textContent = vacation.available;
  document.getElementById('creditSLAvail').textContent = sick.available;
  document.getElementById('creditELAvail').textContent = emergency.available;
  document.getElementById('creditSPLAvail').textContent = specialPrivilege.available;
}

function renderLeaveHistory() {
  const tbody = document.getElementById('leaveHistoryTableBody');
  if (!tbody) return;

  let filtered = appState.leaveRequests.filter(req => {
    if (activeLeaveFilter === 'all') return true;
    return req.status === activeLeaveFilter;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 32px; color: var(--slate-500);">
          No leave requests found matching status filter "${activeLeaveFilter}".
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(req => `
    <tr>
      <td><span class="task-id-badge">${req.id}</span></td>
      <td><strong>${req.type}</strong></td>
      <td>${req.startDate} → ${req.endDate}</td>
      <td><span style="font-weight: 700; color: var(--navy-900);">${req.totalDays}d</span></td>
      <td><span class="task-status-pill ${req.status}">${req.status}</span></td>
      <td style="font-size: 12px; color: var(--slate-500);">${req.appliedAt}</td>
      <td>
        ${req.attachmentName ? `
          <span title="${req.attachmentName}" style="display: inline-flex; align-items: center; gap: 4px; font-size: 11.5px; color: var(--teal-600); font-weight: 600;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
            ${req.attachmentName.substring(0, 16)}...
          </span>
        ` : '<span style="color: var(--slate-400); font-size: 11px;">None</span>'}
      </td>
      <td>
        <button type="button" class="btn-secondary btn-view-leave-detail" style="height: 30px; font-size: 11.5px; padding: 0 10px;" data-id="${req.id}">
          Review
        </button>
      </td>
    </tr>
  `).join('');

  tbody.querySelectorAll('.btn-view-leave-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openLeaveDetailModal(id);
    });
  });
}

/* ========================================================
   7. SECTION 4.4: VIEW & UPDATE PERSONAL PROFILE
   ======================================================== */
let isProfileEditMode = false;

function initProfileSection() {
  const toggleBtn = document.getElementById('btnToggleProfileEdit');
  const cancelBtn = document.getElementById('btnCancelProfileEdit');
  const form = document.getElementById('profileForm');
  const saveBar = document.getElementById('profileSaveBar');
  const modeIndicator = document.getElementById('profileCurrentModeIndicator');
  const btnText = document.getElementById('profileEditBtnText');

  const editableInputs = [
    document.getElementById('profPhone'),
    document.getElementById('profAddress'),
    document.getElementById('profEmergencyName'),
    document.getElementById('profEmergencyRel'),
    document.getElementById('profEmergencyPhone')
  ];

  function setMode(edit) {
    isProfileEditMode = edit;
    editableInputs.forEach(input => {
      if (input) input.disabled = !edit;
    });

    if (edit) {
      saveBar.style.display = 'flex';
      modeIndicator.textContent = 'Mode: EDIT';
      modeIndicator.style.background = 'var(--amber-50)';
      modeIndicator.style.color = 'var(--amber-600)';
      btnText.textContent = 'Editing Profile...';
      toggleBtn.disabled = true;
    } else {
      saveBar.style.display = 'none';
      modeIndicator.textContent = 'Mode: VIEW';
      modeIndicator.style.background = 'var(--slate-100)';
      modeIndicator.style.color = 'var(--slate-500)';
      btnText.textContent = 'Edit Profile';
      toggleBtn.disabled = false;
    }
  }

  toggleBtn?.addEventListener('click', () => setMode(true));
  cancelBtn?.addEventListener('click', () => {
    setMode(false);
    renderProfile(); // restore values
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = document.getElementById('profPhone').value.trim();
    const address = document.getElementById('profAddress').value.trim();
    const emergName = document.getElementById('profEmergencyName').value.trim();
    const emergRel = document.getElementById('profEmergencyRel').value.trim();
    const emergPhone = document.getElementById('profEmergencyPhone').value.trim();

    if (!phone || !address) {
      showToast('Please provide valid phone and address.', 'error');
      return;
    }

    appState.currentUser.phone = phone;
    appState.currentUser.address = address;
    appState.currentUser.emergencyContact = {
      name: emergName,
      relationship: emergRel,
      phone: emergPhone
    };

    saveState(appState);
    setMode(false);
    showToast('Personal profile updated and stored successfully (Mode: SAVE).', 'success');
    renderProfile();
  });
}

function renderProfile() {
  const u = appState.currentUser;
  document.getElementById('profHeroFullName').textContent = u.fullName;
  document.getElementById('profHeroPosition').textContent = `${u.position} • ${u.department}`;
  document.getElementById('profBadgeId').textContent = u.employeeId;

  document.getElementById('profEmpId').value = u.employeeId;
  document.getElementById('profFullName').value = u.fullName;
  document.getElementById('profDepartment').value = u.department;
  document.getElementById('profPosition').value = u.position;
  document.getElementById('profEmail').value = u.email;

  document.getElementById('profPhone').value = u.phone;
  document.getElementById('profAddress').value = u.address;
  document.getElementById('profEmergencyName').value = u.emergencyContact?.name || '';
  document.getElementById('profEmergencyRel').value = u.emergencyContact?.relationship || '';
  document.getElementById('profEmergencyPhone').value = u.emergencyContact?.phone || '';
}

/* ========================================================
   8. SECTION 4.3: CHANGE PASSWORD & CREDENTIALS
   ======================================================== */
function initCredentialsSection() {
  const pwdInput = document.getElementById('credNewPassword');
  const form = document.getElementById('changePasswordForm');

  pwdInput?.addEventListener('input', (e) => {
    const val = e.target.value;
    updatePasswordChecklist(val, 'credReqLen', 'credReqUpper', 'credReqNum', 'credReqSym');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const existing = document.getElementById('credExistingPassword').value.trim();
    const newPwd = document.getElementById('credNewPassword').value.trim();
    const confirmPwd = document.getElementById('credConfirmPassword').value.trim();
    const username = document.getElementById('credCurrentUsername').value.trim();

    if (!existing) {
      showToast('Please enter your existing account password.', 'error');
      return;
    }

    if (newPwd.length < 8) {
      showToast('New password must be at least 8 characters long.', 'error');
      return;
    }

    if (newPwd !== confirmPwd) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }

    appState.currentUser.username = username || appState.currentUser.username;
    saveState(appState);

    showToast('Password changed successfully! Security credentials updated.', 'success');
    form.reset();
    document.getElementById('credCurrentUsername').value = appState.currentUser.username;
    updatePasswordChecklist('', 'credReqLen', 'credReqUpper', 'credReqNum', 'credReqSym');
  });
}

function updatePasswordChecklist(val, idLen, idUpper, idNum, idSym) {
  const isLen = val.length >= 8;
  const isUpper = /[A-Z]/.test(val);
  const isNum = /[0-9]/.test(val);
  const isSym = /[^A-Za-z0-9]/.test(val);

  document.getElementById(idLen)?.classList.toggle('valid', isLen);
  document.getElementById(idUpper)?.classList.toggle('valid', isUpper);
  document.getElementById(idNum)?.classList.toggle('valid', isNum);
  document.getElementById(idSym)?.classList.toggle('valid', isSym);
}

/* ========================================================
   9. GLOBAL CONTROLS & DASHBOARD PREVIEW
   ======================================================== */
function initGlobalControls() {
  // Reset Demo Data
  document.getElementById('btnResetData')?.addEventListener('click', () => {
    if (confirm('Reset all demo entries, tasks, and attendance back to default user manual baseline?')) {
      appState = resetDemoState();
      renderAllViews();
      showToast('State successfully reset to User Manual baseline.', 'info');
    }
  });

  // Logout from sidebar
  document.getElementById('btnSidebarLogout')?.addEventListener('click', () => {
    logoutUser();
  });

  // Print view (Direct manual requirement: structured, minimal, and print-friendly)
  document.getElementById('btnPrintPage')?.addEventListener('click', () => {
    window.print();
  });
}

function initLiveClock() {
  const clockEl = document.getElementById('liveClockDisplay');
  function tick() {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  }
  tick();
  setInterval(tick, 1000);
}

function updateBadges() {
  const pendingTasks = appState.tasks.filter(t => t.status === 'pending' || t.status === 'ongoing').length;
  const unreadAnnounce = appState.announcements.filter(a => !a.isRead).length;

  const taskBadge = document.getElementById('sidebarPendingTasksBadge');
  const announceBadge = document.getElementById('sidebarUnreadAnnounceBadge');
  const notifDot = document.getElementById('headerNotifDot');

  if (taskBadge) taskBadge.textContent = pendingTasks;
  if (announceBadge) announceBadge.textContent = unreadAnnounce;
  if (notifDot) notifDot.style.display = unreadAnnounce > 0 ? 'block' : 'none';
}

function renderDashboardPreview() {
  const ongoing = appState.tasks.filter(t => t.status === 'ongoing').length;
  const pending = appState.tasks.filter(t => t.status === 'pending').length;
  const finished = appState.tasks.filter(t => t.status === 'finished').length;
  const unreadAnnounce = appState.announcements.filter(a => !a.isRead).length;
  const urgentAnnounce = appState.announcements.filter(a => a.priority === 'urgent').length;

  document.getElementById('dashTasksCount').textContent = `${ongoing} Ongoing`;
  document.getElementById('dashUrgentAnnounce').textContent = `${urgentAnnounce} Urgent`;
  document.getElementById('dashVacationDays').textContent = `${appState.leaveCredits.vacation.available} Days`;

  // Render recent 2 tasks in dashboard
  const taskContainer = document.getElementById('dashTasksListContainer');
  if (taskContainer) {
    const recentTasks = appState.tasks.slice(0, 3);
    taskContainer.innerHTML = recentTasks.map(t => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: var(--radius-md);">
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="task-id-badge">${t.id}</span>
            <span style="font-size: 13.5px; font-weight: 700; color: var(--navy-950);">${t.title}</span>
          </div>
          <div style="font-size: 11px; color: var(--slate-500); margin-top: 4px;">
            Due: ${t.dueDate} • Progress: ${t.progress}%
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="task-status-pill ${t.status}">${t.status}</span>
          <button type="button" class="three-dots-btn btn-dash-update-task" data-id="${t.id}" title="Update task">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>
    `).join('');

    taskContainer.querySelectorAll('.btn-dash-update-task').forEach(btn => {
      btn.addEventListener('click', () => {
        openUpdateTaskModal(btn.getAttribute('data-id'));
      });
    });
  }

  // Render recent 2 announcements in dashboard
  const announceContainer = document.getElementById('dashAnnounceListContainer');
  if (announceContainer) {
    const recentAnn = appState.announcements.slice(0, 2);
    announceContainer.innerHTML = recentAnn.map(a => `
      <div style="padding: 12px 14px; background: var(--slate-50); border-radius: var(--radius-md); border: 1px solid var(--slate-200); cursor: pointer;" class="btn-dash-open-ann" data-id="${a.id}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span class="badge-tag ${a.category.toLowerCase()}">${a.category}</span>
          <span style="font-size: 11px; color: var(--slate-400);">${a.date}</span>
        </div>
        <div style="font-size: 13px; font-weight: 700; color: var(--navy-950);">${a.title}</div>
      </div>
    `).join('');

    announceContainer.querySelectorAll('.btn-dash-open-ann').forEach(item => {
      item.addEventListener('click', () => {
        openAnnouncementModal(item.getAttribute('data-id'));
      });
    });
  }
}

function renderAllViews() {
  renderProfile();
  renderTimeTracker();
  renderCalendar();
  renderTasks();
  renderAnnouncements();
  renderLeaveCredits();
  renderLeaveHistory();
  renderDashboardPreview();
  updateBadges();
}

/* ========================================================
   10. TOAST NOTIFICATION UTILITY
   ======================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  } else if (type === 'error') {
    iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
  } else {
    iconSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  }

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
