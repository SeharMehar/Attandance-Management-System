"use strict";
const STUDENTS_KEY = "nexapresence_students";
const ATTENDANCE_KEY = "nexapresence_attendance";
const USER_KEY = "smart_attendance_user";
const DEFAULT_USER = "admin";
const DEFAULT_PASS = "admin123";

const loginScreen = document.getElementById("loginScreen");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const loginButton = document.getElementById("loginButton");

function getStudents() {
  return JSON.parse(localStorage.getItem(STUDENTS_KEY) || "[]");
}

function saveStudents(arr) {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(arr));
}

function getAttendance() {
  return JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || "{}");
}

function saveAttendance(obj) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(obj));
}
const TIMETABLE_KEY = "smart_attendance_timetable";

function getTimetable() {
  return JSON.parse(localStorage.getItem(TIMETABLE_KEY) || "[]");
}

function saveTimetable(arr) {
  localStorage.setItem(TIMETABLE_KEY, JSON.stringify(arr));
}

(function seedData() {
  if (getStudents().length) return;
  const seed = [
    {
      id: uid(),
      name: "Sehar Mehar",
      roll: "2024-001",
      cls: "BSET",
      email: "sehar@ptut.edu",
      phone: "0300-1111111",
      status: "Active",
    },
    {
      id: uid(),
      name: "Sehrish Hina",
      roll: "24-SET-001",
      cls: "BSCS",
      email: "sehrish@ptut.edu",
      phone: "0300-3333333",
      status: "Active",
    },
    {
      id: uid(),
      name: "Fatima Kanwal",
      roll: "24-ST-002",
      cls: "BSIT",
      email: "fatima@ptut.edu",
      phone: "0300-4444444",
      status: "Active",
    },
    {
      id: uid(),
      name: "Mishee",
      roll: "24-CS-003",
      cls: "BSCS",
      email: "mishee@ptut.edu",
      phone: "0300-5555555",
      status: "Inactive",
    },
    {
      id: uid(),
      name: "Abdul Rehman",
      roll: "24-IT-004",
      cls: "BSIT",
      email: "ahsan@ptut.edu",
      phone: "0300-9999999",
      status: "Active",
    }
  ];
  saveStudents(seed);

  // Seed some attendance records for the last 7 days
  const att = {};
  const statuses = [
    "Present",
    "Present",
    "Present",
    "Present",
    "Absent",
    "Late",
    "Leave",
  ];
  for (let d = 0; d < 7; d++) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    const key = dateKey(date);
    att[key] = {};
    seed.forEach((s) => {
      att[key][s.id] = {
        status: statuses[Math.floor(Math.random() * statuses.length)],
        remark: "",
      };
    });
  }
  saveAttendance(att);

  if (!getTimetable().length) {
    saveTimetable([
      {
        day: "Monday",
        slots: ["Database Systems", "Web Development", "Data Structures", "Engineering Maths"],
      },
      {
        day: "Tuesday",
        slots: ["Operating Systems", "Software Testing", "UI/UX Design", "English"],
      },
      {
        day: "Wednesday",
        slots: ["Algorithms", "Networking", "Cyber Security", "Project Work"],
      },
      {
        day: "Thursday",
        slots: ["Machine Learning", "Mobile Apps", "Database Lab", "Communication Skills"],
      },
      {
        day: "Friday",
        slots: ["Data Science", "Cloud Computing", "Programming Lab", "Free Study"],
      },
    ]);
  }
})();
function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function dateKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function today() {
  return dateKey();
}

function isLoggedIn() {
  return localStorage.getItem(USER_KEY) === "true";
}

function updateLoginState() {
  if (isLoggedIn()) {
    loginScreen.classList.add("hidden");
    logoutBtn.style.display = "inline-flex";
  } else {
    loginScreen.classList.remove("hidden");
    logoutBtn.style.display = "none";
  }
}

function login() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  if (!user || !pass) {
    loginError.textContent = "Please enter both username and password.";
    return;
  }

  if (user.toLowerCase() === DEFAULT_USER && pass.toLowerCase() === DEFAULT_PASS) {
    localStorage.setItem(USER_KEY, "true");
    loginError.textContent = "";
    updateLoginState();
    navigateToPage("dashboard");
    showToast("Welcome back, admin!", "success");
  } else {
    loginError.textContent = "Invalid credentials. Please try again.";
  }
}

function logout() {
  localStorage.removeItem(USER_KEY);
  updateLoginState();
  navigateToPage("dashboard");
  showToast("You have been logged out.", "info");
}

function navigateToPage(page) {
  navItems.forEach((item) => item.classList.toggle("active", item.dataset.page === page));
  pages.forEach((p) => p.classList.toggle("active", p.id === `page-${page}`));
  const navItem = document.querySelector(`[data-page="${page}"]`);
  if (navItem) pageTitle.textContent = navItem.querySelector("span").textContent;
  if (page === "dashboard") renderDashboard();
  if (page === "students") renderStudentTable();
  if (page === "attendance") initAttendance();
  if (page === "timetable") renderTimetable();
  if (page === "reports") renderReports();
}

function renderTimetable() {
  const timetable = getTimetable();
  const body = document.getElementById("timetableBody");
  const empty = document.getElementById("timetableEmpty");

  if (!timetable.length) {
    body.innerHTML = "";
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  body.innerHTML = timetable
    .map(
      (row, idx) => `
      <tr data-index="${idx}">
        <td>
          <select class="tt-day">
            <option value="Monday" ${row.day === "Monday" ? "selected" : ""}>Monday</option>
            <option value="Tuesday" ${row.day === "Tuesday" ? "selected" : ""}>Tuesday</option>
            <option value="Wednesday" ${row.day === "Wednesday" ? "selected" : ""}>Wednesday</option>
            <option value="Thursday" ${row.day === "Thursday" ? "selected" : ""}>Thursday</option>
            <option value="Friday" ${row.day === "Friday" ? "selected" : ""}>Friday</option>
          </select>
        </td>
        <td><input class="tt-slot" data-slot="0" type="text" value="${row.slots[0] || ""}" /></td>
        <td><input class="tt-slot" data-slot="1" type="text" value="${row.slots[1] || ""}" /></td>
        <td><input class="tt-slot" data-slot="2" type="text" value="${row.slots[2] || ""}" /></td>
        <td><input class="tt-slot" data-slot="3" type="text" value="${row.slots[3] || ""}" /></td>
        <td>
          <div class="actions-cell">
            <button class="icon-btn edit" title="Edit" onclick="openTimetableModal(${idx})">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="icon-btn del" title="Delete" onclick="deleteTimetableEntry(${idx})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
    )
    .join("");
}

function saveTimetableTable() {
  const rows = document.querySelectorAll("#timetableBody tr");
  const timetable = [];
  const seenDays = new Set();
  let invalid = false;

  rows.forEach((row) => {
    const day = row.querySelector(".tt-day").value;
    const slots = Array.from(row.querySelectorAll(".tt-slot")).map((input) => input.value.trim());

    if (!day) {
      invalid = true;
      return;
    }

    if (seenDays.has(day)) {
      invalid = true;
      return;
    }

    seenDays.add(day);
    timetable.push({ day, slots });
  });

  if (invalid) {
    showToast("Please ensure each row has a valid unique day.", "error");
    return;
  }

  saveTimetable(timetable);
  renderTimetable();
  showToast("Timetable saved successfully.", "success");
}

function openTimetableModal(index = null) {
  editingTimetableIndex = index;
  const modal = document.getElementById("timetableModal");
  const entry = index !== null ? getTimetable()[index] : null;

  document.getElementById("ttModalTitle").textContent = entry ? "Edit Timetable Entry" : "Add Timetable Entry";
  document.getElementById("ttDay").value = entry?.day || "";
  document.getElementById("ttSlot1").value = entry?.slots[0] || "";
  document.getElementById("ttSlot2").value = entry?.slots[1] || "";
  document.getElementById("ttSlot3").value = entry?.slots[2] || "";
  document.getElementById("ttSlot4").value = entry?.slots[3] || "";
  document.getElementById("ttFormError").textContent = "";
  modal.classList.add("open");
}

window.deleteTimetableEntry = function (index) {
  if (!confirm("Delete this timetable entry?")) return;
  const timetable = getTimetable();
  timetable.splice(index, 1);
  saveTimetable(timetable);
  renderTimetable();
  showToast("Timetable entry deleted.", "error");
};

function saveTimetableEntry() {
  const day = document.getElementById("ttDay").value;
  const slots = [
    document.getElementById("ttSlot1").value.trim(),
    document.getElementById("ttSlot2").value.trim(),
    document.getElementById("ttSlot3").value.trim(),
    document.getElementById("ttSlot4").value.trim(),
  ];
  const errEl = document.getElementById("ttFormError");
  const timetable = getTimetable();

  if (!day) {
    errEl.textContent = "Please choose a day.";
    return;
  }

  const duplicateDay = timetable.find(
    (item, idx) => item.day === day && idx !== editingTimetableIndex,
  );

  if (duplicateDay) {
    errEl.textContent = "An entry already exists for this day.";
    return;
  }

  const entry = { day, slots };

  if (editingTimetableIndex !== null) {
    timetable[editingTimetableIndex] = entry;
    showToast("Timetable entry updated.", "success");
  } else {
    timetable.push(entry);
    showToast("Timetable entry added.", "success");
  }

  saveTimetable(timetable);
  document.getElementById("timetableModal").classList.remove("open");
  renderTimetable();
}

function getReportGrade(pct) {
  if (pct >= 90) return "A";
  if (pct >= 75) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

function getReportRows() {
  const students = getStudents();
  const att = getAttendance();
  const allDates = Object.keys(att);

  return students.map((student) => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;

    allDates.forEach((date) => {
      const record = att[date][student.id];
      if (!record) return;

      if (record.status === "Present") present++;
      else if (record.status === "Absent") absent++;
      else if (record.status === "Late") late++;
      else if (record.status === "Leave") leave++;
    });

    const total = present + absent + late + leave;
    const pct = total ? Math.round(((present + late * 0.5) / total) * 100) : 0;

    return {
      id: student.id,
      name: student.name,
      roll: student.roll,
      cls: student.cls,
      total,
      present,
      absent,
      late,
      leave,
      pct,
      grade: getReportGrade(pct),
      color: pct >= 75 ? "var(--green)" : pct >= 50 ? "var(--accent)" : "var(--red)",
    };
  });
}

function getFilteredReportRows() {
  const query = reportQuery.trim().toLowerCase();

  return getReportRows().filter((row) => {
    const matchesQuery =
      !query ||
      row.name.toLowerCase().includes(query) ||
      row.roll.toLowerCase().includes(query) ||
      row.cls.toLowerCase().includes(query);
    const matchesClass = !reportClassFilter || row.cls === reportClassFilter;
    return matchesQuery && matchesClass;
  });
}

function syncReportClassFilterOptions() {
  const select = document.getElementById("reportClassFilter");
  if (!select) return;

  const classOptions = [...new Set(getStudents().map((student) => student.cls).filter(Boolean))].sort();
  const options = ['<option value="">All Classes</option>'].concat(
    classOptions.map((cls) => `<option value="${cls}">${cls}</option>`),
  );

  select.innerHTML = options.join("");

  if (reportClassFilter && !classOptions.includes(reportClassFilter)) {
    reportClassFilter = "";
  }

  select.value = reportClassFilter;
}

function csvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function exportReportsCsv() {
  const rows = getFilteredReportRows();
  if (!rows.length) {
    showToast("No report rows available to export.", "info");
    return;
  }

  const csvRows = [
    ["Name", "Roll No", "Class", "Total Days", "Present", "Absent", "Late", "Leave", "Percentage", "Grade"]
      .map(csvEscape)
      .join(","),
    ...rows.map((row) =>
      [
        row.name,
        row.roll,
        row.cls,
        row.total,
        row.present,
        row.absent,
        row.late,
        row.leave,
        `${row.pct}%`,
        row.grade,
      ]
        .map(csvEscape)
        .join(","),
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `attendance-reports-${today()}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 100);

  showToast(`Exported ${rows.length} report rows.`, "success");
}

function renderReports() {
  syncReportClassFilterOptions();

  const table = document.getElementById("reportTable");
  const tbody = document.getElementById("reportTableBody");
  const empty = document.getElementById("reportEmpty");
  const summary = document.getElementById("reportSummary");
  const rows = getFilteredReportRows();

  summary.textContent = `${rows.length} record${rows.length === 1 ? "" : "s"}`;

  if (!rows.length) {
    tbody.innerHTML = "";
    table.style.display = "none";
    empty.style.display = "block";
    return;
  }

  table.style.display = "table";
  empty.style.display = "none";
  tbody.innerHTML = rows
    .map(
      (row, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${row.name}</strong></td>
        <td>${row.roll}</td>
        <td>${row.cls}</td>
        <td>${row.total}</td>
        <td><span class="status-badge present">${row.present}</span></td>
        <td><span class="status-badge absent">${row.absent}</span></td>
        <td><span class="status-badge late">${row.late}</span></td>
        <td>
          <div class="pct-bar-wrap">
            <div class="pct-bar">
              <div class="pct-fill" style="width:${row.pct}%; background:${row.color};"></div>
            </div>
            <span class="pct-label" style="color:${row.color}">${row.pct}%</span>
          </div>
        </td>
        <td><div class="grade-badge grade-${row.grade}">${row.grade}</div></td>
      </tr>
    `,
    )
    .join("");
}

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");
const pageTitle = document.getElementById("pageTitle");

navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const pg = item.dataset.page;
    navigateToPage(pg);
    sidebar.classList.remove("open");
  });
});

// Mobile sidebar toggle
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
menuToggle.addEventListener("click", () => {
  if (sidebar.classList.contains("open")) {
    sidebar.classList.remove("open");
  } else {
    sidebar.classList.add("open");
  }
});
document.addEventListener("click", (e) => {
  if (
    window.innerWidth <= 768 &&
    !sidebar.contains(e.target) &&
    e.target !== menuToggle
  ) {
    sidebar.classList.remove("open");
  }
});

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark");
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
} else {
  themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

loginButton.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);
document.getElementById("loginPass").addEventListener("keydown", (e) => {
  if (e.key === "Enter") login();
});

(function setDate() {
  const el = document.getElementById("currentDate");
  const d = new Date();
  el.textContent = d.toLocaleDateString("en-PK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  document.getElementById("attDate").value = today();
})();

function renderDashboard() {
  renderStats();        
  renderBarChart();
  renderActivity();
}

function getAttSummaryToday() {
  const att = getAttendance()[today()] || {};
  let present = 0,
    absent = 0,
    late = 0,
    leave = 0;
  Object.values(att).forEach((r) => {
    if (r.status === "Present") present++;
    else if (r.status === "Absent") absent++;
    else if (r.status === "Late") late++;
    else if (r.status === "Leave") leave++;
  });
  return { present, absent, late, leave };
}

function renderStats() {
  const students = getStudents();
  const s = getAttSummaryToday();
  const pct = students.length
    ? Math.round((s.present / students.length) * 100)
    : 0;
  const stats = [
    {
      label: "Total Students",
      value: students.length,
      icon: "fa-users",
      color: "yellow",
      change: "+2",
      dir: "up",
    },
    {
      label: "Present Today",
      value: s.present,
      icon: "fa-user-check",
      color: "green",
      change: `${pct}%`,
      dir: "up",
    },
    {
      label: "Absent Today",
      value: s.absent,
      icon: "fa-user-xmark",
      color: "red",
      change: s.absent > 0 ? `${s.absent}` : "0",
      dir: s.absent > 2 ? "down" : "up",
    },
    {
      label: "Late / Leave",
      value: s.late + s.leave,
      icon: "fa-clock-rotate-left",
      color: "blue",
      change: `${s.late}L`,
      dir: "up",
    },
  ];
  const grid = document.getElementById("statsGrid");
  grid.innerHTML = stats
    .map(
      (st) => `
    <div class="stat-card ${st.color}">
      <span class="stat-change ${st.dir}">${st.change}</span>
      <div class="stat-icon"><i class="fa-solid ${st.icon}"></i></div>
      <div class="stat-value">${st.value}</div>
      <div class="stat-label">${st.label}</div>
    </div>
  `,
    )
    .join("");
}

function renderBarChart() {
  const att = getAttendance();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    const rec = att[key] || {};
    const present = Object.values(rec).filter(
      (r) => r.status === "Present",
    ).length;
    const total = Object.values(rec).length;
    days.push({
      label: d.toLocaleDateString("en", { weekday: "short" }),
      pct: total ? Math.round((present / total) * 100) : 0,
      present,
      total,
    });
  }

  const maxPct = Math.max(...days.map((d) => d.pct), 1);
  const colors = [
    "#f5c542",
    "#3ecf8e",
    "#4da6ff",
    "#a78bfa",
    "#f25f5c",
    "#3ecf8e",
    "#f5c542",
  ];

  document.getElementById("barChart").innerHTML = days
    .map(
      (d, i) => `
    <div class="bar-wrap">
      <div class="bar-col" data-tip="${d.present}/${d.total} (${d.pct}%)"
           style="height:${Math.max((d.pct / maxPct) * 140, 4)}px; background:${colors[i]}; opacity:.85;"></div>
      <span class="bar-day">${d.label}</span>
    </div>
  `,
    )
    .join("");
}

function renderActivity() {
  const students = getStudents();
  const att = getAttendance()[today()] || {};
  const items = [];

  Object.entries(att).forEach(([sid, rec]) => {
    const st = students.find((s) => s.id === sid);
    if (!st) return;
    const colors = {
      Present: "green",
      Absent: "red",
      Late: "yellow",
      Leave: "blue",
    };
    items.push({
      name: st.name,
      status: rec.status,
      color: colors[rec.status] || "blue",
    });
  });

  const list = document.getElementById("activityList");
  if (!items.length) {
    list.innerHTML =
      '<li style="color:var(--muted);padding:16px 22px;font-size:.85rem">No attendance marked today.</li>';
    return;
  }

  const recent = items.slice(0, 8);
  list.innerHTML = recent
    .map(
      (it) => `
    <li>
      <span class="act-dot ${it.color}"></span>
      <span class="act-text"><strong>${it.name}</strong> marked <em>${it.status}</em></span>
      <span class="act-time">Today</span>
    </li>
  `,
    )
    .join("");
}

let editingId = null;
let deleteId = null;
let searchQuery = "";
let reportQuery = "";
let reportClassFilter = "";
let editingTimetableIndex = null;

function renderStudentTable() {
  const students = getStudents();
  const tbody = document.getElementById("studentTableBody");
  const empty = document.getElementById("studentEmpty");

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery) ||
      s.roll.toLowerCase().includes(searchQuery) ||
      s.cls.toLowerCase().includes(searchQuery) ||
      s.email.toLowerCase().includes(searchQuery),
  );

  tbody.innerHTML = "";
  if (!filtered.length) {
    empty.style.display = "block";
    document.getElementById("studentTable").style.display = "none";
    return;
  }

  empty.style.display = "none";
  document.getElementById("studentTable").style.display = "table";

  filtered.forEach((s, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td><strong>${s.name}</strong></td>
      <td>${s.roll}</td>
      <td>${s.cls}</td>
      <td>${s.email || "—"}</td>
      <td>${s.phone || "—"}</td>
      <td><span class="status-badge ${s.status.toLowerCase()}">${s.status}</span></td>
      <td>
        <div class="actions-cell">
          <button class="icon-btn edit" title="Edit" onclick="openEditStudent('${s.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="icon-btn del" title="Delete" onclick="openDeleteModal('${s.id}','${escHtml(s.name)}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function escHtml(str) {
  return str.replace(/'/g, "\\'");
}

// Search
document.getElementById("studentSearch").addEventListener("input", function () {
  searchQuery = this.value.trim().toLowerCase();
  renderStudentTable();
});

document.getElementById("reportSearch").addEventListener("input", function () {
  reportQuery = this.value.trim();
  renderReports();
});

document.getElementById("reportClassFilter").addEventListener("change", function () {
  reportClassFilter = this.value;
  renderReports();
});

document.getElementById("exportReports").addEventListener("click", exportReportsCsv);

// Add Student Button
document.getElementById("openAddStudent").addEventListener("click", () => {
  openStudentModal();
});

document.getElementById("openAddSchedule").addEventListener("click", () => {
  openTimetableModal();
});

document.getElementById("saveTimetableTable").addEventListener("click", saveTimetableTable);

function openStudentModal(student = null) {
  editingId = student ? student.id : null;
  document.getElementById("modalTitle").textContent = student
    ? "Edit Student"
    : "Add Student";
  document.getElementById("fName").value = student?.name || "";
  document.getElementById("fRoll").value = student?.roll || "";
  document.getElementById("fClass").value = student?.cls || "";
  document.getElementById("fEmail").value = student?.email || "";
  document.getElementById("fPhone").value = student?.phone || "";
  document.getElementById("fStatus").value = student?.status || "Active";
  document.getElementById("formError").textContent = "";
  document.getElementById("studentModal").classList.add("open");
  document.getElementById("fName").focus();
}

window.openEditStudent = function (id) {
  const s = getStudents().find((s) => s.id === id);
  if (s) openStudentModal(s);
};

window.openDeleteModal = function (id, name) {
  deleteId = id;
  document.getElementById("deleteStudentName").textContent = name;
  document.getElementById("deleteModal").classList.add("open");
};

// Close modals
["closeModal", "cancelModal"].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("click", () =>
      document.getElementById("studentModal").classList.remove("open"),
    );
});

["closeDelete", "cancelDelete"].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("click", () =>
      document.getElementById("deleteModal").classList.remove("open"),
    );
});

["closeNotification"].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("click", () =>
      document.getElementById("notificationModal").classList.remove("open"),
    );
});

["closeTtModal", "cancelTtModal"].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("click", () =>
      document.getElementById("timetableModal").classList.remove("open"),
    );
});

// Close on overlay click
["studentModal", "deleteModal", "notificationModal", "timetableModal"].forEach((id) => {
  document.getElementById(id).addEventListener("click", (e) => {
    if (e.target.id === id)
      document.getElementById(id).classList.remove("open");
  });
});

// Save Student (Create / Update)
document.getElementById("saveTimetableEntry").addEventListener("click", saveTimetableEntry);

document.getElementById("saveStudent").addEventListener("click", () => {
  const name = document.getElementById("fName").value.trim();
  const roll = document.getElementById("fRoll").value.trim();
  const cls = document.getElementById("fClass").value;
  const email = document.getElementById("fEmail").value.trim();
  const phone = document.getElementById("fPhone").value.trim();
  const status = document.getElementById("fStatus").value;
  const errEl = document.getElementById("formError");

  if (!name) {
    errEl.textContent = "Full name is required.";
    return;
  }
  if (!roll) {
    errEl.textContent = "Roll number is required.";
    return;
  }
  if (!cls) {
    errEl.textContent = "Please select a class.";
    return;
  }

  const students = getStudents();

  // Check duplicate roll
  const dupRoll = students.find((s) => s.roll === roll && s.id !== editingId);
  if (dupRoll) {
    errEl.textContent = "Roll number already exists.";
    return;
  }

  if (editingId) {
    // UPDATE
    const idx = students.findIndex((s) => s.id === editingId);
    if (idx > -1)
      students[idx] = {
        ...students[idx],
        name,
        roll,
        cls,
        email,
        phone,
        status,
      };
    saveStudents(students);
    showToast(`${name} updated successfully.`, "success");
  } else {
    // CREATE
    students.push({ id: uid(), name, roll, cls, email, phone, status });
    saveStudents(students);
    showToast(`${name} added successfully.`, "success");
  }

  document.getElementById("studentModal").classList.remove("open");
  renderStudentTable();
  renderStats();
});

// Confirm Delete
document.getElementById("confirmDelete").addEventListener("click", () => {
  const students = getStudents().filter((s) => s.id !== deleteId);
  saveStudents(students);
  deleteId = null;
  document.getElementById("deleteModal").classList.remove("open");
  renderStudentTable();
  renderStats();
  showToast("Student deleted.", "error");
});

function initAttendance() {
  // Table is empty until Load is pressed
  document.getElementById("attTableBody").innerHTML = "";
  document.getElementById("attEmpty").style.display = "block";
  document.getElementById("attTable").style.display = "none";
}

document
  .getElementById("loadAttendance")
  .addEventListener("click", loadAttendanceTable);
document
  .getElementById("saveAttendance")
  .addEventListener("click", saveAttendanceTable);

function loadAttendanceTable() {
  const date = document.getElementById("attDate").value;
  const cls = document.getElementById("attClass").value;

  if (!date) {
    showToast("Please select a date.", "error");
    return;
  }

  let students = getStudents().filter((s) => s.status === "Active");
  if (cls) students = students.filter((s) => s.cls === cls);

  if (!students.length) {
    showToast("No active students found for this filter.", "info");
    return;
  }

  const att = getAttendance();
  const rec = att[date] || {};
  const tbody = document.getElementById("attTableBody");

  document.getElementById("attEmpty").style.display = "none";
  document.getElementById("attTable").style.display = "table";

  tbody.innerHTML = students
    .map((s, i) => {
      const existing = rec[s.id] || { status: "Present", remark: "" };
      return `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${s.name}</strong></td>
        <td>${s.roll}</td>
        <td>${s.cls}</td>
        <td>
          <div class="att-radio-group">
            ${["Present", "Absent", "Late", "Leave"]
              .map(
                (st) => `
              <span class="r-${st.toLowerCase()}">
                <input type="radio" name="att_${s.id}" id="att_${s.id}_${st}"
                  value="${st}" ${existing.status === st ? "checked" : ""}>
                <label for="att_${s.id}_${st}">${st}</label>
              </span>
            `,
              )
              .join("")}
          </div>
        </td>
        <td>
          <input class="remark-input" data-sid="${s.id}" type="text"
            placeholder="Optional remark…" value="${existing.remark || ""}"/>
        </td>
      </tr>
    `;
    })
    .join("");

  showToast(`Loaded ${students.length} students for ${date}.`, "info");
}

function saveAttendanceTable() {
  const date = document.getElementById("attDate").value;
  if (!date) {
    showToast("Please load attendance first.", "error");
    return;
  }

  const rows = document.querySelectorAll("#attTableBody tr");
  if (!rows.length) {
    showToast("No attendance rows to save.", "error");
    return;
  }

  const att = getAttendance();
  att[date] = att[date] || {};

  rows.forEach((row) => {
    const radios = row.querySelectorAll('input[type="radio"]');
    const remarkEl = row.querySelector(".remark-input");
    if (!radios.length) return;

    const sid = radios[0].name.replace("att_", "");
    let status = "Present";
    radios.forEach((r) => {
      if (r.checked) status = r.value;
    });
    att[date][sid] = { status, remark: remarkEl ? remarkEl.value.trim() : "" };
  });

  saveAttendance(att);
  showToast(`Attendance saved for ${date}.`, "success");
  renderStats();
  renderBarChart();
  renderActivity();
}

const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(message, type = "info") {
  if (!toast) return;

  const tone = ["success", "error", "info"].includes(type) ? type : "info";
  toast.textContent = message;
  toast.className = `toast ${tone}`;
  void toast.offsetWidth;
  toast.classList.add("show");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// ============================================================
// NOTIFICATIONS
// ============================================================

const notifBtn = document.querySelector(".notif-btn");
const notificationModal = document.getElementById("notificationModal");
const closeNotification = document.getElementById("closeNotification");

notifBtn.addEventListener("click", () => {
  renderNotifications();
  notificationModal.classList.add("open");
});

closeNotification.addEventListener("click", () => {
  notificationModal.classList.remove("open");
});

function renderNotifications() {
  const notificationList = document.getElementById("notificationList");
  // Sample notifications - in a real app, these would come from a server or local storage
  const notifications = [
    {
      id: 1,
      icon: "fa-user-plus",
      title: "New Student Request",
      desc: "Abdul Rehman has requested to join BSIT class.",
      action: "students"
    },
    {
      id: 2,
      icon: "fa-calendar-times",
      title: "Leave Request",
      desc: "Fatima Kanwal requested leave for tomorrow.",
      action: "attendance"
    },
    {
      id: 3,
      icon: "fa-edit",
      title: "Attendance Correction",
      desc: "Sehar Mehar wants to correct yesterday's attendance.",
      action: "attendance"
    }
  ];

  notificationList.innerHTML = notifications.map(notif => `
    <li data-id="${notif.id}">
      <div class="notification-icon">
        <i class="fa-solid ${notif.icon}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${notif.title}</div>
        <div class="notification-desc">${notif.desc}</div>
      </div>
      <div class="notification-actions">
        <button class="btn-small view-btn" data-action="${notif.action}">View</button>
        <button class="btn-small dismiss-btn">Dismiss</button>
      </div>
    </li>
  `).join("");

  // Add event listeners for buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      // Navigate to the relevant page
      const navItem = document.querySelector(`[data-page="${action}"]`);
      if (navItem) navItem.click();
      // Close modal
      document.getElementById("notificationModal").classList.remove("open");
      showToast(`Viewing ${action} page.`, "info");
    });
  });

  document.querySelectorAll('.dismiss-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      li.remove();
      // Update badge count
      const remaining = document.querySelectorAll('#notificationList li').length;
      const badge = document.querySelector('.badge');
      if (badge) {
        badge.textContent = remaining;
        if (remaining === 0) {
          badge.style.display = 'none';
        }
      }
      showToast("Notification dismissed.", "info");
    });
  });
}

// ============================================================
// INIT
// ============================================================

updateLoginState();
renderDashboard();
renderStudentTable();
