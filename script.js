/* ===================================================
   CampusCare – Smart Complaint Management System
   script.js – Complete JavaScript Logic
   
   Data is stored in localStorage (browser storage)
   This simulates a real database for the frontend.
   In production, replace localStorage calls with
   fetch() API calls to your PHP/Node.js backend.
   =================================================== */

"use strict";

/* ============================================================
   STORAGE KEYS – Used as "table names" for localStorage
   ============================================================ */
const KEYS = {
  STUDENTS: "cc_students",       // Array of student objects
  COMPLAINTS: "cc_complaints",   // Array of complaint objects
  ADMIN: "cc_admin",             // Admin credentials (single object)
  CURRENT_USER: "cc_current_user", // Logged-in student
  DARK_MODE: "cc_dark_mode",     // Dark mode preference
  COMPLAINT_COUNTER: "cc_counter" // Auto-increment complaint counter
};

/* ============================================================
   DATABASE HELPERS
   These functions mimic SQL operations on localStorage
   ============================================================ */

// SELECT * FROM table
function dbGetAll(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

// INSERT INTO table VALUES (...)
function dbInsert(key, record) {
  const data = dbGetAll(key);
  data.push(record);
  localStorage.setItem(key, JSON.stringify(data));
  return record;
}

// UPDATE table SET ... WHERE id = ?
function dbUpdate(key, id, updates) {
  const data = dbGetAll(key);
  const idx = data.findIndex(r => r.id === id);
  if (idx !== -1) {
    data[idx] = { ...data[idx], ...updates };
    localStorage.setItem(key, JSON.stringify(data));
    return data[idx];
  }
  return null;
}

// DELETE FROM table WHERE id = ?
function dbDelete(key, id) {
  const data = dbGetAll(key);
  const filtered = data.filter(r => r.id !== id);
  localStorage.setItem(key, JSON.stringify(filtered));
}

// SELECT * FROM table WHERE key = value
function dbFind(key, field, value) {
  return dbGetAll(key).find(r => r[field] === value) || null;
}

// Get & increment auto-increment counter (like AUTO_INCREMENT in SQL)
function nextComplaintId() {
  let counter = parseInt(localStorage.getItem(KEYS.COMPLAINT_COUNTER) || "0") + 1;
  localStorage.setItem(KEYS.COMPLAINT_COUNTER, counter.toString());
  const year = new Date().getFullYear();
  return `CC-${year}-${String(counter).padStart(4, "0")}`;
}

/* ============================================================
   SEED DEFAULT DATA
   Creates sample data if the app is loaded for first time
   ============================================================ */
function seedDefaultData() {
  // Default Admin
  if (!localStorage.getItem(KEYS.ADMIN)) {
    localStorage.setItem(KEYS.ADMIN, JSON.stringify({
      id: "admin-001",
      name: "Administrator",
      email: "admin@college.edu",
      password: "admin123",
      role: "Super Admin"
    }));
  }

  // Sample Students (if empty)
  if (dbGetAll(KEYS.STUDENTS).length === 0) {
    const sampleStudents = [
      {
        id: "s1",
        firstName: "Rahul", lastName: "Sharma",
        enrollment: "2024CS001",
        email: "rahul@college.edu",
        department: "Computer Science",
        year: "3rd Year",
        phone: "9876543210",
        password: "student123",
        registeredAt: "2024-01-15T10:00:00"
      },
      {
        id: "s2",
        firstName: "Priya", lastName: "Patel",
        enrollment: "2024EC002",
        email: "priya@college.edu",
        department: "Electronics",
        year: "2nd Year",
        phone: "9123456789",
        password: "student123",
        registeredAt: "2024-01-18T11:30:00"
      }
    ];
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(sampleStudents));
  }

  // Sample Complaints (if empty)
  if (dbGetAll(KEYS.COMPLAINTS).length === 0) {
    localStorage.setItem(KEYS.COMPLAINT_COUNTER, "3");
    const sampleComplaints = [
      {
        id: "CC-2024-0001",
        studentId: "s1",
        studentName: "Rahul Sharma",
        studentEnrollment: "2024CS001",
        title: "WiFi not working in Computer Lab 3",
        category: "WiFi",
        priority: "High",
        location: "Block A, Lab 3",
        description: "The WiFi connection in Computer Lab 3 has been down for the past 3 days. Students are unable to complete their online assignments. Immediate attention is required.",
        status: "In Progress",
        submittedAt: "2024-06-01T09:15:00",
        updatedAt: "2024-06-02T14:30:00"
      },
      {
        id: "CC-2024-0002",
        studentId: "s2",
        studentName: "Priya Patel",
        studentEnrollment: "2024EC002",
        title: "Broken ceiling fan in Classroom 201",
        category: "Electrical",
        priority: "Medium",
        location: "Block B, Room 201",
        description: "The ceiling fan in Classroom 201 is making loud noise and one blade is bent. It is causing distraction during lectures and could be a safety hazard.",
        status: "Pending",
        submittedAt: "2024-06-03T11:45:00",
        updatedAt: "2024-06-03T11:45:00"
      },
      {
        id: "CC-2024-0003",
        studentId: "s1",
        studentName: "Rahul Sharma",
        studentEnrollment: "2024CS001",
        title: "Water leakage near washroom corridor",
        category: "Water",
        priority: "Urgent",
        location: "Block C, Ground Floor",
        description: "There is a water leakage near the washroom corridor on the ground floor of Block C. The floor is always wet and slippery, which is causing safety issues.",
        status: "Resolved",
        submittedAt: "2024-05-28T08:30:00",
        updatedAt: "2024-05-30T16:00:00"
      }
    ];
    localStorage.setItem(KEYS.COMPLAINTS, JSON.stringify(sampleComplaints));
  }
}

/* ============================================================
   DARK MODE
   ============================================================ */
function initDarkMode() {
  const isDark = localStorage.getItem(KEYS.DARK_MODE) === "true";
  if (isDark) {
    document.body.classList.add("dark-mode");
    updateDarkModeIcon(true);
  }
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem(KEYS.DARK_MODE, isDark.toString());
  updateDarkModeIcon(isDark);
}

function updateDarkModeIcon(isDark) {
  document.querySelectorAll("#darkToggle").forEach(btn => {
    btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });
}

/* ============================================================
   NAVBAR SCROLL EFFECT
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;
  
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });

  // Mobile hamburger menu
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }
}

/* ============================================================
   HERO STATS COUNTER ANIMATION
   ============================================================ */
function animateCounter() {
  const complaints = dbGetAll(KEYS.COMPLAINTS);
  const statComplaints = document.querySelector("#statComplaints .stat-num");
  const statResolved = document.querySelector("#statResolved .stat-num");

  if (statComplaints) {
    animateNum(statComplaints, complaints.length);
  }
  if (statResolved) {
    const resolved = complaints.filter(c => c.status === "Resolved").length;
    animateNum(statResolved, resolved);
  }
}

function animateNum(el, target) {
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 30));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */

// Format date nicely
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

// Short date
function formatDateShort(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// Show/hide element
function show(id) { const el = document.getElementById(id); if (el) el.style.display = ""; }
function hide(id) { const el = document.getElementById(id); if (el) el.style.display = "none"; }

// Set inner HTML
function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
function setHTML(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }

// Status badge HTML
function statusBadge(status) {
  const map = {
    "Pending": '<span class="badge badge-pending"><i class="fas fa-clock"></i> Pending</span>',
    "In Progress": '<span class="badge badge-progress"><i class="fas fa-spinner fa-spin"></i> In Progress</span>',
    "Resolved": '<span class="badge badge-resolved"><i class="fas fa-check-circle"></i> Resolved</span>'
  };
  return map[status] || `<span class="badge">${status}</span>`;
}

// Priority badge HTML
function priorityBadge(priority) {
  const map = {
    "Low": '<span class="badge priority-low">🟢 Low</span>',
    "Medium": '<span class="badge priority-medium">🟡 Medium</span>',
    "High": '<span class="badge priority-high">🔴 High</span>',
    "Urgent": '<span class="badge priority-urgent">🚨 Urgent</span>'
  };
  return map[priority] || `<span class="badge">${priority}</span>`;
}

// Category icon
function catIcon(cat) {
  const map = {
    "Electrical": "⚡", "Water": "💧", "Cleanliness": "🧹",
    "WiFi": "📶", "Classroom": "🏫", "Hostel": "🏠", "Others": "➕"
  };
  return map[cat] || "📝";
}

// Show notification popup
function showNotification(title, msg, type = "success") {
  const popup = document.getElementById("notificationPopup");
  if (!popup) return;
  document.getElementById("notifTitle").textContent = title;
  document.getElementById("notifMsg").textContent = msg;
  popup.style.borderLeftColor = type === "success" ? "var(--success)" : "var(--danger)";
  popup.querySelector(".notif-icon").style.color = type === "success" ? "var(--success)" : "var(--danger)";
  popup.style.display = "flex";
  setTimeout(closeNotification, 5000);
}

function closeNotification() {
  const popup = document.getElementById("notificationPopup");
  if (popup) popup.style.display = "none";
}

// Form loader
function setLoading(btnId, isLoading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const text = btn.querySelector(".btn-text");
  const loader = btn.querySelector(".btn-loader");
  if (text) text.style.display = isLoading ? "none" : "";
  if (loader) loader.style.display = isLoading ? "" : "none";
  btn.disabled = isLoading;
}

// Toggle password visibility
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isText = input.type === "text";
  input.type = isText ? "password" : "text";
  btn.innerHTML = isText ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
}

// Show/Hide alert
function showAlert(id, msg, type = "success") {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = "flex";
  el.className = `alert alert-${type}`;
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

// Field error
function setFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearFieldErrors(...ids) {
  ids.forEach(id => setFieldError(id, ""));
}

// Modal
function closeModal() {
  const overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.style.display = "none";
}

function openModal() {
  const overlay = document.getElementById("modalOverlay");
  if (overlay) overlay.style.display = "flex";
}

/* ============================================================
   STUDENT REGISTRATION
   ============================================================ */
function initRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    clearFieldErrors("regFNameErr","regLNameErr","regEnrollErr","regEmailErr","regDeptErr","regYearErr","regPhoneErr","regPassErr","regConfirmPassErr");
    hideAlert("regError"); hideAlert("regSuccess");

    const firstName  = document.getElementById("regFirstName").value.trim();
    const lastName   = document.getElementById("regLastName").value.trim();
    const enrollment = document.getElementById("regEnroll").value.trim();
    const email      = document.getElementById("regEmail").value.trim();
    const dept       = document.getElementById("regDept").value;
    const year       = document.getElementById("regYear").value;
    const phone      = document.getElementById("regPhone").value.trim();
    const password   = document.getElementById("regPassword").value;
    const confirmPass= document.getElementById("regConfirmPass").value;

    let valid = true;

    if (!firstName) { setFieldError("regFNameErr", "First name is required"); valid = false; }
    if (!lastName)  { setFieldError("regLNameErr", "Last name is required");  valid = false; }
    if (!enrollment){ setFieldError("regEnrollErr","Enrollment number is required"); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("regEmailErr", "Enter a valid email address"); valid = false;
    }
    if (!dept) { setFieldError("regDeptErr", "Select your department"); valid = false; }
    if (!year) { setFieldError("regYearErr", "Select your year"); valid = false; }
    if (!phone || !/^\d{10}$/.test(phone)) {
      setFieldError("regPhoneErr", "Enter a valid 10-digit phone number"); valid = false;
    }
    if (!password || password.length < 6) {
      setFieldError("regPassErr", "Password must be at least 6 characters"); valid = false;
    }
    if (password !== confirmPass) {
      setFieldError("regConfirmPassErr", "Passwords do not match"); valid = false;
    }

    if (!valid) return;

    // Check duplicate email or enrollment
    const students = dbGetAll(KEYS.STUDENTS);
    if (students.find(s => s.email === email)) {
      showAlert("regError", "⚠️ This email is already registered.", "error"); return;
    }
    if (students.find(s => s.enrollment === enrollment)) {
      showAlert("regError", "⚠️ This enrollment number is already registered.", "error"); return;
    }

    setLoading("regBtn", true);

    setTimeout(() => {
      const student = {
        id: "s" + Date.now(),
        firstName, lastName,
        enrollment, email,
        department: dept,
        year, phone, password,
        registeredAt: new Date().toISOString()
      };

      dbInsert(KEYS.STUDENTS, student);
      setLoading("regBtn", false);
      showAlert("regSuccess", "✅ Registration successful! Redirecting to login...", "success");

      setTimeout(() => { window.location.href = "student-login.html"; }, 2000);
    }, 1000);
  });
}

/* ============================================================
   STUDENT LOGIN
   ============================================================ */
function initStudentLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearFieldErrors("loginEmailErr", "loginPassErr");
    hideAlert("loginError"); hideAlert("loginSuccess");

    const emailOrEnroll = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    let valid = true;
    if (!emailOrEnroll) { setFieldError("loginEmailErr", "Email or enrollment number is required"); valid = false; }
    if (!password)       { setFieldError("loginPassErr", "Password is required"); valid = false; }
    if (!valid) return;

    setLoading("loginBtn", true);

    setTimeout(() => {
      const students = dbGetAll(KEYS.STUDENTS);
      const student = students.find(s =>
        (s.email === emailOrEnroll || s.enrollment === emailOrEnroll) &&
        s.password === password
      );

      if (!student) {
        setLoading("loginBtn", false);
        showAlert("loginError", "❌ Invalid credentials. Please check your email/enrollment and password.", "error");
        return;
      }

      // Save current user to localStorage (like a session)
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify({ ...student, role: "student" }));
      showAlert("loginSuccess", "✅ Login successful! Redirecting...", "success");
      setLoading("loginBtn", false);
      setTimeout(() => { window.location.href = "student-dashboard.html"; }, 1200);
    }, 900);
  });
}

/* ============================================================
   ADMIN LOGIN
   ============================================================ */
function initAdminLogin() {
  const form = document.getElementById("adminLoginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearFieldErrors("adminEmailErr", "adminPassErr");
    hideAlert("adminLoginError"); hideAlert("adminLoginSuccess");

    const email    = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    let valid = true;
    if (!email)    { setFieldError("adminEmailErr", "Email is required"); valid = false; }
    if (!password) { setFieldError("adminPassErr", "Password is required"); valid = false; }
    if (!valid) return;

    setLoading("adminLoginBtn", true);

    setTimeout(() => {
      const admin = JSON.parse(localStorage.getItem(KEYS.ADMIN) || "{}");

      if (admin.email !== email || admin.password !== password) {
        setLoading("adminLoginBtn", false);
        showAlert("adminLoginError", "❌ Invalid admin credentials.", "error");
        return;
      }

      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify({ ...admin, role: "admin" }));
      showAlert("adminLoginSuccess", "✅ Admin login successful! Redirecting...", "success");
      setLoading("adminLoginBtn", false);
      setTimeout(() => { window.location.href = "admin-dashboard.html"; }, 1200);
    }, 900);
  });
}

/* ============================================================
   AUTH GUARD
   Redirect to login if not authenticated
   ============================================================ */
function requireStudentAuth() {
  const user = JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || "null");
  if (!user || user.role !== "student") {
    window.location.href = "student-login.html";
    return null;
  }
  return user;
}

function requireAdminAuth() {
  const user = JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || "null");
  if (!user || user.role !== "admin") {
    window.location.href = "admin-login.html";
    return null;
  }
  return user;
}

/* ============================================================
   SIDEBAR & PAGE SWITCHING (Dashboard)
   ============================================================ */
let currentPage = "overview";

function switchPage(page) {
  // Hide all pages
  document.querySelectorAll(".dash-page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(li => li.classList.remove("active"));

  // Show target page
  const targetPage = document.getElementById(`page-${page}`);
  if (targetPage) targetPage.classList.add("active");

  // Update sidebar active state
  document.querySelectorAll(`[data-page="${page}"]`).forEach(li => li.classList.add("active"));

  // Update topbar title
  const titles = {
    overview: "Dashboard Overview",
    submit: "Submit Complaint",
    mycomplaints: "My Complaints",
    escalate: "Escalated Complaints",
    track: "Track Complaint",
    profile: "My Profile",
    allcomplaints: "All Complaints",
    escalated: "Escalated Complaints",
    students: "Registered Students",
    reports: "Reports & Analytics"
  };
  setText("topbarTitle", titles[page] || page);

  currentPage = page;

  // Close sidebar on mobile
  closeMobileSidebar();

  // Load page data
  if (page === "mycomplaints") loadMyComplaints();
  if (page === "escalate") loadEscalatedComplaints();
  if (page === "overview" && document.getElementById("recentComplaintsBody")) loadStudentOverview();
  if (page === "overview" && document.getElementById("adminRecentBody")) loadAdminOverview();
  if (page === "allcomplaints") loadAllComplaints();
  if (page === "escalated") loadAdminEscalated();
  if (page === "students") loadStudentsTable();
  if (page === "reports") loadReports();
}

function initSidebar() {
  // Sidebar nav items
  document.querySelectorAll(".nav-item[data-page]").forEach(li => {
    li.addEventListener("click", function (e) {
      e.preventDefault();
      const page = this.dataset.page;
      switchPage(page);
    });
  });

  // Hamburger / menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const sidebarClose = document.getElementById("sidebarClose");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.add("open");
      overlay.classList.add("active");
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", closeMobileSidebar);
  }

  if (overlay) {
    overlay.addEventListener("click", closeMobileSidebar);
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (sidebar) sidebar.classList.remove("open");
  if (overlay) overlay.classList.remove("active");
}

/* ============================================================
   STUDENT DASHBOARD – extra inits
   ============================================================ */
function updateEscalateBadge() {
  const user = JSON.parse(localStorage.getItem(KEYS.CURRENT_USER));
  if (!user) return;
  const count = dbGetAll(KEYS.COMPLAINTS)
    .filter(c => (c.studentId === user.id || c.realStudentId === user.id) && c.isEscalated).length;
  const badge = document.getElementById("escalateBadge");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "inline-flex" : "none";
  }
}

function loadEscalatedComplaints() {
  const user = JSON.parse(localStorage.getItem(KEYS.CURRENT_USER));
  if (!user) return;
  const complaints = dbGetAll(KEYS.COMPLAINTS)
    .filter(c => (c.studentId === user.id || c.realStudentId === user.id) && c.isEscalated)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  const tbody = document.getElementById("escalatedComplaintsBody");
  if (!tbody) return;

  if (complaints.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-row"><i class="fas fa-level-up-alt"></i><br>No escalated complaints yet</td></tr>`;
    return;
  }

  tbody.innerHTML = complaints.map(c => `
    <tr class="escalated-row">
      <td><code style="color:var(--primary);font-weight:700;font-size:0.8rem;">${c.id}</code></td>
      <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c.title}</td>
      <td><span class="authority-badge"><i class="fas fa-user-tie"></i> ${c.escalatedTo}</span></td>
      <td>${priorityBadge(c.priority)}</td>
      <td>${formatDateShort(c.submittedAt)}</td>
      <td>${statusBadge(c.status)}</td>
      <td>
        <button class="action-btn view" title="View" onclick="viewComplaintModal('${c.id}')">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

/* ============================================================
   ADMIN DASHBOARD – Escalated Complaints
   ============================================================ */
function loadAdminEscalated() {
  const complaints = dbGetAll(KEYS.COMPLAINTS)
    .filter(c => c.isEscalated)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  // Update admin badge
  const adminBadge = document.getElementById("adminEscalateBadge");
  if (adminBadge) {
    const pending = complaints.filter(c => c.status === "Pending").length;
    adminBadge.textContent = pending;
    adminBadge.style.display = pending > 0 ? "inline-flex" : "none";
  }

  const tbody = document.getElementById("adminEscalatedBody");
  if (!tbody) return;

  if (complaints.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty-row"><i class="fas fa-level-up-alt"></i><br>No escalated complaints</td></tr>`;
    return;
  }

  tbody.innerHTML = complaints.map(c => {
    // Student display — if anonymous show special label
    const studentDisplay = c.isAnonymous
      ? `<div style="font-weight:600;font-size:0.82rem;"><i class="fas fa-user-secret"></i> Anonymous</div><div style="color:var(--text-muted);font-size:0.72rem;">****</div>`
      : `<div style="font-weight:600;font-size:0.82rem;">${c.studentName}</div><div style="color:var(--text-muted);font-size:0.72rem;">${c.studentEnrollment}</div>`;

    // Photos column
    const photoCount = (c.photos && c.photos.length) || 0;
    const photoHtml = photoCount > 0
      ? `<button class="action-btn view" style="width:auto;padding:0 0.6rem;" onclick="adminViewPhotos('${c.id}')" title="View ${photoCount} photo(s)">
           <i class="fas fa-camera"></i> ${photoCount}
         </button>`
      : `<span style="color:var(--text-muted);font-size:0.75rem;">—</span>`;

    return `
    <tr class="escalated-row">
      <td><code style="color:var(--primary);font-weight:700;font-size:0.78rem;">${c.id}</code></td>
      <td>${studentDisplay}</td>
      <td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c.title}</td>
      <td><span class="authority-badge"><i class="fas fa-user-tie"></i> ${c.escalatedTo}</span></td>
      <td>${priorityBadge(c.priority)}</td>
      <td>${formatDateShort(c.submittedAt)}</td>
      <td>${statusBadge(c.status)}</td>
      <td>${photoHtml}</td>
      <td>
        <div class="action-btn-group">
          <button class="action-btn view" title="View" onclick="adminViewComplaint('${c.id}')">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit" title="Update Status" onclick="adminUpdateStatus('${c.id}')">
            <i class="fas fa-edit"></i>
          </button>
        </div>
      </td>
    </tr>
    `;
  }).join("");
}

// Admin view photos for a complaint
function adminViewPhotos(complaintId) {
  const c = dbFind(KEYS.COMPLAINTS, "id", complaintId);
  if (!c || !c.photos || c.photos.length === 0) return;
  openLightbox(c.photos, 0);
}

/* ============================================================
   STUDENT DASHBOARD
   ============================================================ */
function initStudentDashboard() {
  const user = requireStudentAuth();
  if (!user) return;

  // Set user name
  const displayName = `${user.firstName} ${user.lastName}`;
  setText("sidebarUserName", displayName);
  setText("topbarUserName", user.firstName);
  document.getElementById("welcomeMsg").textContent =
    `Welcome back, ${user.firstName}! Here's a summary of your complaints.`;

  initSidebar();
  loadStudentOverview();
  initComplaintForm();
  initMyComplaintsFilters();
  loadMyComplaints();
  initProfilePage(user);
  updateEscalateBadge();

  // Logout
  const logoutBtn = document.getElementById("studentLogout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(KEYS.CURRENT_USER);
      window.location.href = "student-login.html";
    });
  }

  // Dark mode
  document.querySelectorAll("#darkToggle").forEach(btn => {
    btn.addEventListener("click", toggleDarkMode);
  });

  // Notification badge
  const complaints = dbGetAll(KEYS.COMPLAINTS)
    .filter(c => c.studentId === user.id || c.realStudentId === user.id);
  const pending = complaints.filter(c => c.status === "Pending").length;
  if (pending > 0) {
    const badge = document.getElementById("notifBadge");
    if (badge) { badge.textContent = pending; badge.style.display = "flex"; }
  }
}


function loadStudentOverview() {
  const user = JSON.parse(localStorage.getItem(KEYS.CURRENT_USER));
  if (!user) return;

  const complaints = dbGetAll(KEYS.COMPLAINTS).filter(c => c.studentId === user.id);

  const total      = complaints.length;
  const pending    = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved   = complaints.filter(c => c.status === "Resolved").length;

  setText("statTotal", total);
  setText("statPending", pending);
  setText("statInProgress", inProgress);
  setText("statResolved", resolved);

  // Recent complaints (last 5)
  const recent = [...complaints].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 5);
  const tbody = document.getElementById("recentComplaintsBody");
  if (!tbody) return;

  if (recent.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-row"><i class="fas fa-inbox"></i><br>No complaints submitted yet</td></tr>`;
    return;
  }

  tbody.innerHTML = recent.map(c => `
    <tr>
      <td><code style="color:var(--primary);font-weight:700;">${c.id}</code></td>
      <td>${c.title}</td>
      <td>${catIcon(c.category)} ${c.category}</td>
      <td>${priorityBadge(c.priority)}</td>
      <td>${formatDateShort(c.submittedAt)}</td>
      <td>${statusBadge(c.status)}</td>
    </tr>
  `).join("");
}

/* ============================================================
   SUBMIT COMPLAINT FORM (with Photo, Anonymous, Escalation)
   ============================================================ */

// Stores base64 photo data for current complaint being composed
let pendingPhotos = []; // Array of { name, dataUrl }
let lightboxImages = []; // Array of dataUrls for lightbox
let lightboxIndex  = 0;

function initComplaintForm() {
  const form = document.getElementById("complaintForm");
  if (!form) return;

  // Character counter
  const desc = document.getElementById("cDescription");
  const charCount = document.getElementById("charCount");
  if (desc && charCount) {
    desc.addEventListener("input", () => {
      const len = desc.value.length;
      charCount.textContent = len;
      charCount.style.color = len > 450 ? "var(--danger)" : "var(--text-muted)";
    });
  }

  // ---- Anonymous Toggle ----
  const anonCb  = document.getElementById("cAnonymous");
  const anonBox = document.getElementById("anonToggleBox");
  const anonWarn= document.getElementById("anonWarning");
  if (anonCb) {
    anonCb.addEventListener("change", () => {
      anonBox.classList.toggle("active", anonCb.checked);
      anonWarn.style.display = anonCb.checked ? "flex" : "none";
    });
  }

  // ---- Escalation Toggle ----
  const escalateCb  = document.getElementById("cEscalate");
  const escalateBox = document.getElementById("escalateBox");
  const authSelector= document.getElementById("escalateAuthoritySelector");
  if (escalateCb) {
    escalateCb.addEventListener("change", () => {
      escalateBox.classList.toggle("active-escalate", escalateCb.checked);
      authSelector.style.display = escalateCb.checked ? "block" : "none";
    });
  }

  // ---- Photo Upload ----
  initPhotoUpload();

  // ---- Clear Form Button ----
  const clearBtn = document.getElementById("clearFormBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      pendingPhotos = [];
      renderPhotoPreviews();
      if (anonCb) { anonCb.checked = false; anonBox.classList.remove("active"); anonWarn.style.display = "none"; }
      if (escalateCb) { escalateCb.checked = false; escalateBox.classList.remove("active-escalate"); authSelector.style.display = "none"; }
    });
  }

  // ---- Form Submit ----
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearFieldErrors("cTitleErr", "cCategoryErr", "cPriorityErr", "cDescErr");
    hideAlert("submitSuccess"); hideAlert("submitError");

    const title    = document.getElementById("cTitle").value.trim();
    const category = document.getElementById("cCategory").value;
    const priority = document.getElementById("cPriority").value;
    const location = document.getElementById("cLocation").value.trim();
    const descVal  = document.getElementById("cDescription").value.trim();
    const isAnon   = document.getElementById("cAnonymous")?.checked || false;
    const isEscalated = document.getElementById("cEscalate")?.checked || false;
    const authority= document.getElementById("cAuthority")?.value || "";

    let valid = true;
    if (!title)    { setFieldError("cTitleErr", "Complaint title is required"); valid = false; }
    if (!category) { setFieldError("cCategoryErr", "Select a category"); valid = false; }
    if (!priority) { setFieldError("cPriorityErr", "Select priority level"); valid = false; }
    if (!descVal || descVal.length < 20) {
      setFieldError("cDescErr", "Description must be at least 20 characters"); valid = false;
    }
    if (!valid) return;

    const user = JSON.parse(localStorage.getItem(KEYS.CURRENT_USER));
    const complaintId = nextComplaintId();
    const now = new Date().toISOString();

    const complaint = {
      id: complaintId,
      studentId: user.id,
      // If anonymous, store "Anonymous" as display name
      studentName: isAnon ? "Anonymous Student" : `${user.firstName} ${user.lastName}`,
      studentEnrollment: isAnon ? "****" : user.enrollment,
      // Always keep real ID so student can track their own
      realStudentId: user.id,
      isAnonymous: isAnon,
      title, category, priority, location,
      description: descVal,
      photos: pendingPhotos.map(p => p.dataUrl), // Base64 images
      isEscalated,
      escalatedTo: isEscalated ? authority : "",
      status: "Pending",
      submittedAt: now,
      updatedAt: now
    };

    dbInsert(KEYS.COMPLAINTS, complaint);

    // Prepare success message
    let successMsg = `✅ Complaint submitted! Your ID: ${complaintId}`;
    if (isAnon) successMsg += " | Submitted anonymously";
    if (isEscalated) successMsg += ` | Escalated to: ${authority}`;
    if (pendingPhotos.length > 0) successMsg += ` | ${pendingPhotos.length} photo(s) attached`;

    showAlert("submitSuccess", successMsg, "success");
    showNotification(
      isEscalated ? "⬆️ Escalated Successfully!" : "✅ Complaint Submitted!",
      `ID: ${complaintId}${isEscalated ? " — Sent to " + authority : ""}`
    );

    // Reset form
    form.reset();
    pendingPhotos = [];
    renderPhotoPreviews();
    if (charCount) charCount.textContent = "0";
    if (anonCb) { anonCb.checked = false; anonBox.classList.remove("active"); anonWarn.style.display = "none"; }
    if (escalateCb) { escalateCb.checked = false; escalateBox.classList.remove("active-escalate"); authSelector.style.display = "none"; }

    loadStudentOverview();
    updateEscalateBadge();
  });
}

/* ============================================================
   PHOTO UPLOAD
   ============================================================ */
function initPhotoUpload() {
  const input     = document.getElementById("cPhotos");
  const uploadArea= document.getElementById("photoUploadArea");
  if (!input || !uploadArea) return;

  // File input change
  input.addEventListener("change", () => {
    addPhotos(Array.from(input.files));
    input.value = ""; // Reset so same file can be re-added
  });

  // Drag and drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("drag-over");
  });

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("drag-over");
  });

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    addPhotos(files);
  });
}

function addPhotos(files) {
  const MAX_PHOTOS = 3;
  const MAX_SIZE   = 5 * 1024 * 1024; // 5MB

  if (pendingPhotos.length >= MAX_PHOTOS) {
    showNotification("Max 3 photos allowed", "Remove a photo first to add a new one.", "error");
    return;
  }

  const remaining = MAX_PHOTOS - pendingPhotos.length;
  const toAdd = files.slice(0, remaining);

  toAdd.forEach(file => {
    if (file.size > MAX_SIZE) {
      showNotification("File too large", `${file.name} exceeds 5MB limit.`, "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      pendingPhotos.push({ name: file.name, dataUrl: e.target.result });
      renderPhotoPreviews();
    };
    reader.readAsDataURL(file);
  });
}

function renderPhotoPreviews() {
  const container  = document.getElementById("photoPreviews");
  const placeholder= document.getElementById("photoPlaceholder");
  if (!container) return;

  if (pendingPhotos.length === 0) {
    placeholder.style.display = "block";
    container.innerHTML = "";
    return;
  }

  placeholder.style.display = "none";
  container.innerHTML = `
    <div class="photo-count-label"><i class="fas fa-images"></i> ${pendingPhotos.length}/3 photo(s) attached</div>
    <div style="display:flex;gap:0.75rem;flex-wrap:wrap;padding:0 0.75rem 0.75rem;">
      ${pendingPhotos.map((p, idx) => `
        <div class="photo-preview-item">
          <img src="${p.dataUrl}" alt="${p.name}" onclick="openLightbox([${pendingPhotos.map(x => '"' + x.dataUrl + '"').join(',')}], ${idx})"/>
          <button class="photo-preview-remove" onclick="removePhoto(${idx})" title="Remove">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `).join("")}
    </div>
  `;
}

function removePhoto(idx) {
  pendingPhotos.splice(idx, 1);
  renderPhotoPreviews();
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLightbox(images, startIdx) {
  lightboxImages = images;
  lightboxIndex  = startIdx;
  const overlay  = document.getElementById("lightboxOverlay");
  if (!overlay) return;
  overlay.style.display = "flex";
  renderLightboxImage();
}

function renderLightboxImage() {
  const img     = document.getElementById("lightboxImg");
  const counter = document.getElementById("lightboxCounter");
  const prev    = document.getElementById("lightboxPrev");
  const next    = document.getElementById("lightboxNext");
  if (!img) return;
  img.src = lightboxImages[lightboxIndex];
  if (counter) counter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
  if (prev) prev.style.display = lightboxImages.length > 1 ? "flex" : "none";
  if (next) next.style.display = lightboxImages.length > 1 ? "flex" : "none";
}

function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  renderLightboxImage();
}

function closeLightbox() {
  const overlay = document.getElementById("lightboxOverlay");
  if (overlay) overlay.style.display = "none";
}

// Close lightbox on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") lightboxNav(1);
  if (e.key === "ArrowLeft")  lightboxNav(-1);
});


/* ============================================================
   MY COMPLAINTS (updated with anonymous & escalation flags)
   ============================================================ */
function loadMyComplaints(filterStatus = "", filterCategory = "", searchTerm = "") {
  const user = JSON.parse(localStorage.getItem(KEYS.CURRENT_USER));
  if (!user) return;

  // Show own complaints (match on realStudentId OR studentId for backward compat)
  let complaints = dbGetAll(KEYS.COMPLAINTS)
    .filter(c => c.studentId === user.id || c.realStudentId === user.id)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  if (filterStatus)   complaints = complaints.filter(c => c.status === filterStatus);
  if (filterCategory) complaints = complaints.filter(c => c.category === filterCategory);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    complaints = complaints.filter(c =>
      c.title.toLowerCase().includes(term) ||
      c.id.toLowerCase().includes(term) ||
      c.category.toLowerCase().includes(term)
    );
  }

  const tbody = document.getElementById("myComplaintsBody");
  if (!tbody) return;

  if (complaints.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-row"><i class="fas fa-inbox"></i><br>No complaints found</td></tr>`;
    return;
  }

  tbody.innerHTML = complaints.map(c => {
    // Flags column
    let flags = [];
    if (c.isAnonymous) flags.push(`<span class="flag-anon"><i class="fas fa-user-secret"></i> Anon</span>`);
    if (c.isEscalated) flags.push(`<span class="flag-escalated"><i class="fas fa-level-up-alt"></i> ${c.escalatedTo}</span>`);
    const flagsHtml = flags.length ? `<div class="flags-cell">${flags.join("")}</div>` : `<span style="color:var(--text-muted)">—</span>`;

    // Photo thumbnail
    const hasPhotos = c.photos && c.photos.length > 0;

    return `
    <tr class="${c.isEscalated ? 'escalated-row' : ''}">
      <td><code style="color:var(--primary);font-weight:700;font-size:0.8rem;">${c.id}</code></td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${c.title}">${c.title}${hasPhotos ? ' <i class="fas fa-camera" style="color:var(--primary);font-size:0.7rem;" title="Has photos"></i>' : ''}</td>
      <td>${catIcon(c.category)} ${c.category}</td>
      <td>${priorityBadge(c.priority)}</td>
      <td>${formatDateShort(c.submittedAt)}</td>
      <td>${statusBadge(c.status)}</td>
      <td>${flagsHtml}</td>
      <td>
        <div class="action-btn-group">
          <button class="action-btn view" title="View Details" onclick="viewComplaintModal('${c.id}')">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </td>
    </tr>
    `;
  }).join("");
}

function initMyComplaintsFilters() {
  const filterStatus   = document.getElementById("filterStatus");
  const filterCategory = document.getElementById("filterCategory");
  const search         = document.getElementById("searchComplaints");
  if (!filterStatus) return;

  const reload = () => {
    loadMyComplaints(filterStatus.value, filterCategory.value, search.value);
  };

  filterStatus.addEventListener("change", reload);
  filterCategory.addEventListener("change", reload);
  search.addEventListener("input", reload);
}

/* ============================================================
   COMPLAINT DETAIL MODAL (Student View) – with photos
   ============================================================ */
function viewComplaintModal(complaintId) {
  const complaint = dbFind(KEYS.COMPLAINTS, "id", complaintId);
  if (!complaint) return;

  const modalBody = document.getElementById("modalBody");
  if (!modalBody) return;

  // Build photos section
  let photosHtml = "";
  if (complaint.photos && complaint.photos.length > 0) {
    const thumbs = complaint.photos.map((src, idx) =>
      `<img class="photo-thumb" src="${src}" alt="Photo ${idx+1}" onclick="openLightbox([${complaint.photos.map(s => '\'' + s + '\'').join(',')}], ${idx})"/>`
    ).join("");
    photosHtml = `
      <div class="modal-detail-desc">
        <strong><i class="fas fa-camera"></i> Attached Photos (${complaint.photos.length}):</strong>
        <div class="photo-thumb-strip">${thumbs}</div>
      </div>
    `;
  }

  // Build flags
  const flags = [];
  if (complaint.isAnonymous) flags.push(`<span class="flag-anon"><i class="fas fa-user-secret"></i> Anonymous</span>`);
  if (complaint.isEscalated) flags.push(`<span class="flag-escalated"><i class="fas fa-level-up-alt"></i> Escalated to ${complaint.escalatedTo}</span>`);

  modalBody.innerHTML = `
    <div class="modal-detail-row">
      <span class="md-label">Complaint ID</span>
      <span class="md-value" style="color:var(--primary);font-family:monospace;">${complaint.id}</span>
    </div>
    <div class="modal-detail-row">
      <span class="md-label">Title</span>
      <span class="md-value">${complaint.title}</span>
    </div>
    <div class="modal-detail-row">
      <span class="md-label">Category</span>
      <span class="md-value">${catIcon(complaint.category)} ${complaint.category}</span>
    </div>
    <div class="modal-detail-row">
      <span class="md-label">Priority</span>
      <span class="md-value">${priorityBadge(complaint.priority)}</span>
    </div>
    <div class="modal-detail-row">
      <span class="md-label">Location</span>
      <span class="md-value">${complaint.location || "Not specified"}</span>
    </div>
    ${flags.length ? `
    <div class="modal-detail-row">
      <span class="md-label">Flags</span>
      <span class="md-value" style="display:flex;gap:0.35rem;flex-wrap:wrap;">${flags.join("")}</span>
    </div>` : ""}
    <div class="modal-detail-row">
      <span class="md-label">Status</span>
      <span class="md-value">${statusBadge(complaint.status)}</span>
    </div>
    <div class="modal-detail-row">
      <span class="md-label">Submitted On</span>
      <span class="md-value">${formatDate(complaint.submittedAt)}</span>
    </div>
    <div class="modal-detail-row">
      <span class="md-label">Last Updated</span>
      <span class="md-value">${formatDate(complaint.updatedAt)}</span>
    </div>
    <div class="modal-detail-desc">
      <strong>Description:</strong><br/>
      <p style="margin-top:0.5rem;">${complaint.description}</p>
    </div>
    ${photosHtml}
  `;

  openModal();
}

/* ============================================================
   TRACK COMPLAINT STATUS
   ============================================================ */
function trackComplaint() {
  const input = document.getElementById("trackId");
  const resultDiv = document.getElementById("trackResult");
  if (!input || !resultDiv) return;

  const id = input.value.trim().toUpperCase();
  if (!id) { alert("Please enter a Complaint ID"); return; }

  const complaint = dbFind(KEYS.COMPLAINTS, "id", id);
  if (!complaint) {
    resultDiv.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--danger);">
        <i class="fas fa-times-circle" style="font-size:2rem;"></i>
        <p style="margin-top:0.5rem;">No complaint found with ID: <strong>${id}</strong></p>
        <p style="color:var(--text-muted);font-size:0.85rem;">Double-check your Complaint ID and try again.</p>
      </div>
    `;
    resultDiv.style.display = "block";
    return;
  }

  const steps = ["Pending", "In Progress", "Resolved"];
  const currentIdx = steps.indexOf(complaint.status);

  const progressHTML = steps.map((step, idx) => {
    let cls = "";
    if (idx < currentIdx) cls = "done";
    else if (idx === currentIdx) cls = "active";

    const icons = ["fa-clock", "fa-spinner", "fa-check-circle"];
    const connectorDone = idx < currentIdx ? "done" : "";

    return `
      <div class="track-step ${cls}">
        <div class="track-step-circle"><i class="fas ${icons[idx]}"></i></div>
        <div class="track-step-label">${step}</div>
      </div>
      ${idx < steps.length - 1 ? `<div class="track-connector ${connectorDone}"></div>` : ""}
    `;
  }).join("");

  resultDiv.innerHTML = `
    <div class="track-result-header">
      <div>
        <div class="track-result-id">${complaint.id}</div>
        <div class="track-result-title">${complaint.title}</div>
      </div>
      ${statusBadge(complaint.status)}
    </div>
    <div class="track-progress">${progressHTML}</div>
    <div class="track-details-grid">
      <div class="track-detail-item">
        <label>Category</label>
        <span>${catIcon(complaint.category)} ${complaint.category}</span>
      </div>
      <div class="track-detail-item">
        <label>Priority</label>
        <span>${priorityBadge(complaint.priority)}</span>
      </div>
      <div class="track-detail-item">
        <label>Submitted By</label>
        <span>${complaint.studentName}</span>
      </div>
      <div class="track-detail-item">
        <label>Location</label>
        <span>${complaint.location || "Not specified"}</span>
      </div>
      <div class="track-detail-item">
        <label>Submitted On</label>
        <span>${formatDate(complaint.submittedAt)}</span>
      </div>
      <div class="track-detail-item">
        <label>Last Updated</label>
        <span>${formatDate(complaint.updatedAt)}</span>
      </div>
    </div>
  `;

  resultDiv.style.display = "block";
}

/* ============================================================
   PROFILE PAGE
   ============================================================ */
function initProfilePage(user) {
  const profileInfo = document.getElementById("profileInfo");
  if (!profileInfo) return;

  profileInfo.innerHTML = `
    <div class="profile-field"><label>Full Name</label><span>${user.firstName} ${user.lastName}</span></div>
    <div class="profile-field"><label>Enrollment No.</label><span>${user.enrollment}</span></div>
    <div class="profile-field"><label>Email</label><span>${user.email}</span></div>
    <div class="profile-field"><label>Phone</label><span>${user.phone}</span></div>
    <div class="profile-field"><label>Department</label><span>${user.department}</span></div>
    <div class="profile-field"><label>Year</label><span>${user.year}</span></div>
    <div class="profile-field"><label>Role</label><span>Student</span></div>
    <div class="profile-field"><label>Registered On</label><span>${formatDateShort(user.registeredAt)}</span></div>
  `;
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
function initAdminDashboard() {
  const user = requireAdminAuth();
  if (!user) return;

  initSidebar();
  loadAdminOverview();

  // Logout
  const logoutBtn = document.getElementById("adminLogout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(KEYS.CURRENT_USER);
      window.location.href = "admin-login.html";
    });
  }

  // Dark mode
  document.querySelectorAll("#darkToggle").forEach(btn => {
    btn.addEventListener("click", toggleDarkMode);
  });

  // Filters
  initAdminComplaintsFilters();
}

/* ============================================================
   ADMIN OVERVIEW – updated with escalation badge + flags
   ============================================================ */
function loadAdminOverview() {
  const complaints = dbGetAll(KEYS.COMPLAINTS).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  const students = dbGetAll(KEYS.STUDENTS);

  const total      = complaints.length;
  const pending    = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved   = complaints.filter(c => c.status === "Resolved").length;

  setText("adminStatTotal", total);
  setText("adminStatPending", pending);
  setText("adminStatInProgress", inProgress);
  setText("adminStatResolved", resolved);
  setText("adminStatStudents", students.length);

  // Update escalated badge in sidebar
  loadAdminEscalated();

  // Category breakdown
  const categories = ["Electrical", "Water", "Cleanliness", "WiFi", "Classroom", "Hostel", "Others"];
  const catBreakdown = document.getElementById("categoryBreakdown");
  if (catBreakdown) {
    catBreakdown.innerHTML = categories.map(cat => {
      const count = complaints.filter(c => c.category === cat).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return `
        <div class="cat-bar-item">
          <div class="cat-bar-label">
            <span>${catIcon(cat)} ${cat}</span>
            <span>${count} (${pct}%)</span>
          </div>
          <div class="cat-bar-track">
            <div class="cat-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Recent complaints (admin view - last 5)
  const recent = complaints.slice(0, 5);
  const tbody = document.getElementById("adminRecentBody");
  if (tbody) renderAdminComplaintsTable(tbody, recent, true);
}

function loadAllComplaints(filterStatus = "", filterCategory = "", filterPriority = "", searchTerm = "") {
  let complaints = dbGetAll(KEYS.COMPLAINTS)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

  if (filterStatus)   complaints = complaints.filter(c => c.status === filterStatus);
  if (filterCategory) complaints = complaints.filter(c => c.category === filterCategory);
  if (filterPriority) complaints = complaints.filter(c => c.priority === filterPriority);
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    complaints = complaints.filter(c =>
      c.id.toLowerCase().includes(term) ||
      c.title.toLowerCase().includes(term) ||
      c.studentName.toLowerCase().includes(term) ||
      c.studentEnrollment.toLowerCase().includes(term)
    );
  }

  const tbody = document.getElementById("adminAllComplaintsBody");
  if (tbody) renderAdminComplaintsTable(tbody, complaints, false);
}

function renderAdminComplaintsTable(tbody, complaints, compact) {
  if (complaints.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty-row"><i class="fas fa-inbox"></i><br>No complaints found</td></tr>`;
    return;
  }

  tbody.innerHTML = complaints.map(c => {
    // Student display (respect anonymous)
    const studentDisplay = c.isAnonymous
      ? `<div style="font-weight:600;font-size:0.82rem;"><i class="fas fa-user-secret"></i> Anonymous</div><div style="color:var(--text-muted);font-size:0.72rem;">****</div>`
      : `<div style="font-weight:600;font-size:0.82rem;">${c.studentName}</div><div style="color:var(--text-muted);font-size:0.72rem;">${c.studentEnrollment}</div>`;

    // Flags
    let flags = [];
    if (c.isAnonymous) flags.push(`<span class="flag-anon"><i class="fas fa-user-secret"></i> Anon</span>`);
    if (c.isEscalated) flags.push(`<span class="flag-escalated"><i class="fas fa-level-up-alt"></i> ${c.escalatedTo}</span>`);
    const flagsHtml = flags.length ? `<div class="flags-cell">${flags.join("")}</div>` : `<span style="color:var(--text-muted)">—</span>`;

    return `
    <tr class="${c.isEscalated ? 'escalated-row' : ''}">
      <td><code style="color:var(--primary);font-weight:700;font-size:0.78rem;">${c.id}</code></td>
      <td>${studentDisplay}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${c.title}">${c.title}</td>
      <td>${catIcon(c.category)} ${c.category}</td>
      <td>${priorityBadge(c.priority)}</td>
      <td>${formatDateShort(c.submittedAt)}</td>
      <td>${statusBadge(c.status)}</td>
      <td>${flagsHtml}</td>
      <td>
        <div class="action-btn-group">
          <button class="action-btn view" title="View" onclick="adminViewComplaint('${c.id}')">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit" title="Update Status" onclick="adminUpdateStatus('${c.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" title="Delete" onclick="adminDeleteComplaint('${c.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
    `;
  }).join("");
}

function initAdminComplaintsFilters() {
  const filterStatus   = document.getElementById("adminFilterStatus");
  const filterCategory = document.getElementById("adminFilterCategory");
  const filterPriority = document.getElementById("adminFilterPriority");
  const search         = document.getElementById("adminSearchComplaints");
  if (!filterStatus) return;

  const reload = () => {
    loadAllComplaints(filterStatus.value, filterCategory.value, filterPriority.value, search.value);
  };

  filterStatus.addEventListener("change", reload);
  filterCategory.addEventListener("change", reload);
  filterPriority.addEventListener("change", reload);
  search.addEventListener("input", reload);
}

/* ============================================================
   ADMIN – VIEW COMPLAINT DETAIL (with photos + flags)
   ============================================================ */
function adminViewComplaint(complaintId) {
  const c = dbFind(KEYS.COMPLAINTS, "id", complaintId);
  if (!c) return;

  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  if (modalTitle) modalTitle.innerHTML = `<i class="fas fa-file-alt"></i> Complaint Details`;

  // Build photo section
  let photosHtml = "";
  if (c.photos && c.photos.length > 0) {
    const thumbs = c.photos.map((src, idx) =>
      `<img class="photo-thumb" src="${src}" alt="Photo ${idx+1}" onclick="openLightbox([${c.photos.map(s => '\'' + s + '\'').join(',')}], ${idx})"/>`
    ).join("");
    photosHtml = `
      <div class="modal-detail-desc">
        <strong><i class="fas fa-camera"></i> Attached Photos (${c.photos.length}):</strong>
        <div class="photo-thumb-strip">${thumbs}</div>
      </div>
    `;
  }

  // Build flags
  const flags = [];
  if (c.isAnonymous) flags.push(`<span class="flag-anon"><i class="fas fa-user-secret"></i> Anonymous Submission</span>`);
  if (c.isEscalated) flags.push(`<span class="flag-escalated"><i class="fas fa-level-up-alt"></i> Escalated to ${c.escalatedTo}</span>`);

  const studentDisplay = c.isAnonymous
    ? `<em style="color:var(--text-muted);">Anonymous (identity hidden)</em>`
    : `${c.studentName} (${c.studentEnrollment})`;

  if (modalBody) {
    modalBody.innerHTML = `
      ${flags.length ? `
      <div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1rem;">${flags.join("")}</div>
      ` : ""}
      <div class="modal-detail-row">
        <span class="md-label">Complaint ID</span>
        <span class="md-value" style="color:var(--primary);font-family:monospace;">${c.id}</span>
      </div>
      <div class="modal-detail-row">
        <span class="md-label">Student</span>
        <span class="md-value">${studentDisplay}</span>
      </div>
      <div class="modal-detail-row">
        <span class="md-label">Title</span>
        <span class="md-value">${c.title}</span>
      </div>
      <div class="modal-detail-row">
        <span class="md-label">Category</span>
        <span class="md-value">${catIcon(c.category)} ${c.category}</span>
      </div>
      <div class="modal-detail-row">
        <span class="md-label">Priority</span>
        <span class="md-value">${priorityBadge(c.priority)}</span>
      </div>
      <div class="modal-detail-row">
        <span class="md-label">Location</span>
        <span class="md-value">${c.location || "Not specified"}</span>
      </div>
      <div class="modal-detail-row">
        <span class="md-label">Status</span>
        <span class="md-value">${statusBadge(c.status)}</span>
      </div>
      <div class="modal-detail-row">
        <span class="md-label">Submitted</span>
        <span class="md-value">${formatDate(c.submittedAt)}</span>
      </div>
      <div class="modal-detail-row">
        <span class="md-label">Last Updated</span>
        <span class="md-value">${formatDate(c.updatedAt)}</span>
      </div>
      <div class="modal-detail-desc">
        <strong>Description:</strong>
        <p style="margin-top:0.5rem;">${c.description}</p>
      </div>
      ${photosHtml}
    `;
  }

  openModal();
}

/* ============================================================
   ADMIN – UPDATE COMPLAINT STATUS
   ============================================================ */
function adminUpdateStatus(complaintId) {
  const c = dbFind(KEYS.COMPLAINTS, "id", complaintId);
  if (!c) return;

  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  if (modalTitle) modalTitle.innerHTML = `<i class="fas fa-edit"></i> Update Complaint Status`;

  if (modalBody) {
    modalBody.innerHTML = `
      <div style="margin-bottom:1rem;">
        <p style="font-size:0.88rem;color:var(--text-secondary);">
          Updating status for: <strong>${c.id}</strong> – ${c.title}
        </p>
      </div>
      <div class="status-update-form">
        <div class="form-group">
          <label><i class="fas fa-tag"></i> Current Status</label>
          <div>${statusBadge(c.status)}</div>
        </div>
        <div class="form-group">
          <label for="newStatus"><i class="fas fa-sync-alt"></i> Update to</label>
          <select id="newStatus">
            <option value="Pending"    ${c.status==="Pending"?"selected":""}>⏳ Pending</option>
            <option value="In Progress"${c.status==="In Progress"?"selected":""}>🔄 In Progress</option>
            <option value="Resolved"   ${c.status==="Resolved"?"selected":""}>✅ Resolved</option>
          </select>
        </div>
        <div style="display:flex;gap:0.75rem;margin-top:0.5rem;">
          <button class="btn-secondary" onclick="closeModal()">Cancel</button>
          <button class="btn-primary" onclick="saveStatusUpdate('${complaintId}')">
            <i class="fas fa-save"></i> Save Status
          </button>
        </div>
      </div>
    `;
  }

  openModal();
}

function saveStatusUpdate(complaintId) {
  const newStatus = document.getElementById("newStatus").value;
  dbUpdate(KEYS.COMPLAINTS, complaintId, { status: newStatus, updatedAt: new Date().toISOString() });
  closeModal();
  loadAllComplaints();
  loadAdminOverview();
  showNotification("Status Updated!", `Complaint ${complaintId} is now: ${newStatus}`);
}

/* ============================================================
   ADMIN – DELETE COMPLAINT
   ============================================================ */
function adminDeleteComplaint(complaintId) {
  if (!confirm(`Are you sure you want to DELETE complaint ${complaintId}?\nThis action cannot be undone.`)) return;
  dbDelete(KEYS.COMPLAINTS, complaintId);
  loadAllComplaints();
  loadAdminOverview();
  showNotification("Complaint Deleted", `Complaint ${complaintId} has been removed.`, "danger");
}

/* ============================================================
   ADMIN – STUDENTS TABLE
   ============================================================ */
function loadStudentsTable(searchTerm = "") {
  let students = dbGetAll(KEYS.STUDENTS)
    .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    students = students.filter(s =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.enrollment.toLowerCase().includes(term)
    );
  }

  const tbody = document.getElementById("studentsTableBody");
  if (!tbody) return;

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-row"><i class="fas fa-users"></i><br>No students found</td></tr>`;
    return;
  }

  tbody.innerHTML = students.map((s, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong>${s.firstName} ${s.lastName}</strong></td>
      <td><code style="color:var(--primary)">${s.enrollment}</code></td>
      <td>${s.email}</td>
      <td>${s.department}</td>
      <td>${s.year}</td>
      <td>${s.phone}</td>
      <td>${formatDateShort(s.registeredAt)}</td>
    </tr>
  `).join("");

  // Search students
  const searchInput = document.getElementById("adminSearchStudents");
  if (searchInput) {
    searchInput.addEventListener("input", () => loadStudentsTable(searchInput.value));
  }
}

/* ============================================================
   ADMIN – REPORTS
   ============================================================ */
function loadReports() {
  const complaints = dbGetAll(KEYS.COMPLAINTS);
  const total = complaints.length;

  // Status distribution
  const statusChart = document.getElementById("statusChart");
  if (statusChart) {
    const statusData = {
      "Pending": { count: 0, color: "#ea580c" },
      "In Progress": { count: 0, color: "#1a6fca" },
      "Resolved": { count: 0, color: "#10b981" }
    };
    complaints.forEach(c => { if (statusData[c.status]) statusData[c.status].count++; });

    statusChart.innerHTML = Object.entries(statusData).map(([label, { count, color }]) => {
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return `
        <div class="bar-item-row">
          <div class="bar-item-label">${label}</div>
          <div class="bar-item-track">
            <div class="bar-item-fill" style="width:${pct}%;background:${color};">${count}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Category chart
  const categoryChart = document.getElementById("categoryChart");
  if (categoryChart) {
    const cats = ["Electrical","Water","Cleanliness","WiFi","Classroom","Hostel","Others"];
    const colors = ["#f59e0b","#3b82f6","#10b981","#8b5cf6","#14b8a6","#ef4444","#64748b"];
    categoryChart.innerHTML = cats.map((cat, i) => {
      const count = complaints.filter(c => c.category === cat).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return `
        <div class="bar-item-row">
          <div class="bar-item-label">${catIcon(cat)} ${cat}</div>
          <div class="bar-item-track">
            <div class="bar-item-fill" style="width:${pct}%;background:${colors[i]};">${count}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Priority chart
  const priorityChart = document.getElementById("priorityChart");
  if (priorityChart) {
    const priorities = { "Low": "#10b981", "Medium": "#f59e0b", "High": "#ef4444", "Urgent": "#9d174d" };
    priorityChart.innerHTML = Object.entries(priorities).map(([label, color]) => {
      const count = complaints.filter(c => c.priority === label).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return `
        <div class="bar-item-row">
          <div class="bar-item-label">${label}</div>
          <div class="bar-item-track">
            <div class="bar-item-fill" style="width:${pct}%;background:${color};">${count}</div>
          </div>
        </div>
      `;
    }).join("");
  }
}

/* ============================================================
   CONTACT FORM (About Page)
   ============================================================ */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      form.reset();
      show("contactSuccess");
      setTimeout(() => hide("contactSuccess"), 4000);
    }, 500);
  });
}

/* ============================================================
   CATEGORY CARDS CLICK (Home Page)
   ============================================================ */
function initCategoryCards() {
  document.querySelectorAll(".cat-card").forEach(card => {
    card.addEventListener("click", () => {
      const cat = card.dataset.cat;
      window.location.href = `student-login.html?cat=${cat}`;
    });
  });
}

/* ============================================================
   MAIN INITIALIZER
   Detects which page we're on and runs the right init function
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  // Initialize shared features
  seedDefaultData();
  initDarkMode();
  initNavbar();

  const body = document.body;

  // Home Page
  if (body.classList.contains("home-page") && document.getElementById("statComplaints")) {
    animateCounter();
    initCategoryCards();
  }

  // Student Login
  if (document.getElementById("loginForm")) {
    initStudentLogin();
  }

  // Student Register
  if (document.getElementById("registerForm")) {
    initRegisterForm();
  }

  // Student Dashboard
  if (document.getElementById("studentDashboardPage")) {
    initStudentDashboard();
  }

  // Admin Login
  if (document.getElementById("adminLoginForm")) {
    initAdminLogin();
  }

  // Admin Dashboard
  if (document.getElementById("adminDashboardPage")) {
    initAdminDashboard();
  }

  // About / Contact Page
  if (document.getElementById("contactForm")) {
    initContactForm();
  }

  // Dark mode button for non-dashboard pages
  document.querySelectorAll("#darkToggle").forEach(btn => {
    btn.addEventListener("click", toggleDarkMode);
  });
});

/* ============================================================
   SQL REFERENCE SECTION
   The following is the equivalent SQL schema and queries
   for when you connect this to a real MySQL database.
   
   ============================================================
   
   -- DATABASE SCHEMA (MySQL)
   
   CREATE DATABASE campuscare;
   USE campuscare;
   
   CREATE TABLE admin (
     id VARCHAR(20) PRIMARY KEY,
     name VARCHAR(100),
     email VARCHAR(150) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(50) DEFAULT 'Super Admin',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   CREATE TABLE students (
     id VARCHAR(30) PRIMARY KEY,
     first_name VARCHAR(100) NOT NULL,
     last_name VARCHAR(100) NOT NULL,
     enrollment VARCHAR(50) UNIQUE NOT NULL,
     email VARCHAR(150) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     department VARCHAR(100),
     year VARCHAR(20),
     phone VARCHAR(15),
     registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   CREATE TABLE complaints (
     id VARCHAR(20) PRIMARY KEY,
     student_id VARCHAR(30),
     student_name VARCHAR(200),
     student_enrollment VARCHAR(50),
     title VARCHAR(255) NOT NULL,
     category ENUM('Electrical','Water','Cleanliness','WiFi','Classroom','Hostel','Others'),
     priority ENUM('Low','Medium','High','Urgent'),
     location VARCHAR(255),
     description TEXT,
     status ENUM('Pending','In Progress','Resolved') DEFAULT 'Pending',
     submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
   );
   
   -- SAMPLE SQL QUERIES
   
   -- INSERT a new student:
   -- INSERT INTO students (id, first_name, last_name, enrollment, email, password, department, year, phone)
   -- VALUES ('s1', 'Rahul', 'Sharma', '2024CS001', 'rahul@college.edu', 'hashed_password', 'Computer Science', '3rd Year', '9876543210');
   
   -- INSERT a new complaint:
   -- INSERT INTO complaints (id, student_id, student_name, student_enrollment, title, category, priority, location, description)
   -- VALUES ('CC-2024-0001', 's1', 'Rahul Sharma', '2024CS001', 'WiFi not working', 'WiFi', 'High', 'Lab 3', 'Description here...');
   
   -- UPDATE complaint status:
   -- UPDATE complaints SET status = 'In Progress', updated_at = NOW() WHERE id = 'CC-2024-0001';
   
   -- SELECT all complaints with student info:
   -- SELECT c.*, s.first_name, s.last_name, s.email FROM complaints c
   -- JOIN students s ON c.student_id = s.id
   -- ORDER BY c.submitted_at DESC;
   
   -- SELECT complaints by student:
   -- SELECT * FROM complaints WHERE student_id = 's1' ORDER BY submitted_at DESC;
   
   -- DELETE a complaint:
   -- DELETE FROM complaints WHERE id = 'CC-2024-0001';
   
   -- SELECT complaints count by status:
   -- SELECT status, COUNT(*) AS total FROM complaints GROUP BY status;
   
   -- SELECT complaints by category:
   -- SELECT category, COUNT(*) AS total FROM complaints GROUP BY category ORDER BY total DESC;
   
   ============================================================ */
