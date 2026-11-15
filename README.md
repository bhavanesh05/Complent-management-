# CampusCare – Smart Complaint Management System
### College Mini-Project | 5th Semester | HTML + CSS + JS

---

## 📁 Project Structure

```
CampusCare/
├── index.html            ← Home Page
├── student-login.html    ← Student Login
├── student-register.html ← Student Registration
├── student-dashboard.html← Student Dashboard (Submit, Track, View)
├── admin-login.html      ← Admin Login
├── admin-dashboard.html  ← Admin Dashboard (Manage All Complaints)
├── about.html            ← About / Contact Page
├── style.css             ← All CSS Styles
├── script.js             ← All JavaScript Logic
└── database.sql          ← MySQL Schema & Sample Queries
```

---

## 🚀 How to Run

### Option 1: Open Directly in Browser (No backend required)
1. Open `index.html` in any modern browser (Chrome, Firefox, Edge)
2. All data is stored in `localStorage` (browser storage)
3. No server setup needed!

### Option 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using VS Code → Install "Live Server" extension → Right click index.html → "Open with Live Server"
```

---

## 🔐 Demo Login Credentials

| Role    | Email / ID          | Password     |
|---------|---------------------|--------------|
| Admin   | admin@college.edu   | admin123     |
| Student | rahul@college.edu   | student123   |
| Student | priya@college.edu   | student123   |

> **Or** register a new student account from the Register page!

---

## ✨ Features

### Student Features
- ✅ Register with enrollment number, email, department, year
- ✅ Login with email or enrollment number
- ✅ Submit complaints with title, category, priority, description
- ✅ Auto-generated Complaint ID (e.g. CC-2024-0001)
- ✅ View all submitted complaints
- ✅ Filter complaints by status and category
- ✅ Track complaint status with visual progress bar
- ✅ View profile information

### Admin Features
- ✅ Secure admin login
- ✅ View all student complaints
- ✅ Update complaint status (Pending → In Progress → Resolved)
- ✅ Delete complaints
- ✅ Search and filter by status, category, priority, keyword
- ✅ View all registered students
- ✅ Visual reports/analytics with bar charts
- ✅ Category-wise complaint breakdown

### Extra Features
- ✅ Dark mode toggle
- ✅ Notification popup on complaint submission
- ✅ Auto-timestamp for complaints
- ✅ Responsive design (Mobile + Desktop)
- ✅ Form validation with helpful error messages
- ✅ Password show/hide toggle

---

## 🗄️ Database Tables (MySQL)

```sql
-- Three main tables:
admin       -- Admin credentials
students    -- Registered students
complaints  -- All submitted complaints
```

See `database.sql` for complete schema and sample queries.

---

## 🎨 Design

- **Color Theme**: White & Blue (Professional college portal style)
- **Font**: Inter (Google Fonts)
- **Icons**: Font Awesome 6
- **Layout**: Responsive grid with sidebar dashboard
- **Animations**: CSS animations, hover effects, smooth transitions
- **Dark Mode**: Full dark theme support

---

## 📊 Complaint Categories

| Icon | Category     |
|------|-------------|
| ⚡   | Electrical  |
| 💧   | Water       |
| 🧹   | Cleanliness |
| 📶   | WiFi        |
| 🏫   | Classroom   |
| 🏠   | Hostel      |
| ➕   | Others      |

---

## 🔁 Complaint Status Flow

```
SUBMITTED → [Pending] → [In Progress] → [Resolved]
```

---

## 💡 How localStorage Works (as a Database)

```javascript
// Like a SQL table – stored in browser
localStorage.setItem("cc_complaints", JSON.stringify(complaintsArray));

// SELECT * FROM complaints
const complaints = JSON.parse(localStorage.getItem("cc_complaints"));

// INSERT new complaint
complaints.push(newComplaint);
localStorage.setItem("cc_complaints", JSON.stringify(complaints));

// UPDATE status
complaints[idx].status = "Resolved";
localStorage.setItem("cc_complaints", JSON.stringify(complaints));

// DELETE
const filtered = complaints.filter(c => c.id !== "CC-2024-0001");
localStorage.setItem("cc_complaints", JSON.stringify(filtered));
```

---

## 📝 Project Notes (For Viva/Presentation)

1. **Frontend**: Pure HTML5, CSS3, JavaScript – no frameworks used
2. **Data Storage**: localStorage simulates a MySQL database on the frontend
3. **Production Backend**: Replace localStorage calls with `fetch()` API to PHP/Node.js
4. **Password Security**: In production, passwords should be hashed (bcrypt/SHA256)
5. **Auto ID**: Complaint IDs are generated like CC-YYYY-XXXX
6. **Responsive**: Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer     | Technology           |
|-----------|---------------------|
| Frontend  | HTML5, CSS3, JS      |
| Storage   | localStorage (demo)  |
| Database  | MySQL (production)   |
| Icons     | Font Awesome 6       |
| Fonts     | Google Fonts (Inter) |

---

*CampusCare – Designed as a 4th Semester College Mini Project*
