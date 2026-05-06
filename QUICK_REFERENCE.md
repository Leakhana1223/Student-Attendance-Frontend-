# Quick Reference Guide

## 🎯 Core Files

### Authentication
- **`src/context/auth-context.tsx`** [NEW]
  - Manages user login/logout
  - Handles localStorage persistence
  - Provides `useAuth()` hook

### Data Management
- **`src/lib/storage.ts`** [NEW]
  - CRUD operations for all entities
  - Storage functions:
    - `studentStorage`
    - `classStorage`
    - `attendanceStorage`
    - `subjectStorage`
    - `userStorage`
    - `blacklistStorage`

### Layout & Navigation
- **`src/app/layout.tsx`** [UPDATED]
  - Root layout with auth routing
  - Uses `RootLayoutClient` for client-side logic

- **`src/app/root-layout-client.tsx`** [NEW]
  - Client-side layout wrapper
  - Handles auth guard and routing
  - Shows/hides sidebar based on auth

- **`src/app/providers.tsx`** [UPDATED]
  - Added `AuthProvider` wrapper
  - Provides auth context to app

### Pages
- **`src/app/dashboard/page.tsx`** [NEW]
  - Landing page after login
  - Shows statistics and quick links

- **`src/app/student/page.tsx`** [NEW]
  - Student management interface
  - Add/view/delete students

- **`src/app/attendance/page.tsx`** [NEW]
  - Mark and track attendance
  - Filter by class and date

- **`src/app/class/page.tsx`** [NEW]
  - Class management

- **`src/app/report/page.tsx`** [NEW]
  - Attendance reports and analytics

- **`src/app/subject/page.tsx`** [NEW]
  - Subject management

- **`src/app/user/page.tsx`** [NEW]
  - User profile and management

- **`src/app/blacklist/page.tsx`** [NEW]
  - Blacklist management

### Components
- **`src/components/DataTable.tsx`** [NEW]
  - Generic reusable table component
  - Props: `data`, `columns`, `onDelete`

- **`src/components/Modal.tsx`** [NEW]
  - Reusable modal/dialog component
  - Props: `isOpen`, `onClose`, `title`, `size`

- **`src/components/Auth-Guard.tsx`** [NEW]
  - Route protection component
  - Shows loading state while checking auth

- **`src/components/Auth/SigninWithPassword.tsx`** [UPDATED]
  - Added login logic
  - Now calls `login()` and redirects to `/dashboard`

- **`src/components/Layouts/sidebar/icons.tsx`** [UPDATED]
  - Added `Calendar` icon export

- **`src/components/Layouts/sidebar/data/index.ts`** [UPDATED]
  - Added `/subject` route to navigation
  - All 8 dashboard routes now in sidebar

---

## 🔄 Data Flow

### Login Flow
1. User enters email/password at `/auth/sign-in`
2. `SigninWithPassword` calls `login()` from `useAuth()`
3. User object saved to localStorage
4. Redirect to `/dashboard`
5. `RootLayoutClient` detects authentication
6. Shows sidebar + header + main content

### Add Student Flow
1. User clicks "Add Student" on `/student`
2. Modal opens with form
3. Form submitted → `studentStorage.add()`
4. Data saved to localStorage under `students` key
5. Table refreshes with new student
6. Data persists on page refresh

### Mark Attendance Flow
1. User navigates to `/attendance`
2. Loads students, classes, existing records
3. Selects class/student/date/status
4. `attendanceStorage.add()` saves record
5. Table updates immediately
6. Can filter by class/date to view records

---

## 📊 localStorage Schema

### students
```javascript
[
  {
    id: "student_1234567890",
    name: "John Doe",
    email: "john@example.com",
    rollNumber: "STU001",
    classId: "class_9876543210",
    enrollmentDate: "2024-05-01"
  }
]
```

### classes
```javascript
[
  {
    id: "class_9876543210",
    name: "Class 10-A",
    code: "CLS001",
    section: "A",
    description: "10th Grade Section A"
  }
]
```

### attendance
```javascript
[
  {
    id: "attendance_1111111111",
    studentId: "student_1234567890",
    classId: "class_9876543210",
    date: "2024-05-01",
    session: "morning",
    status: "present",
    remark: "On time"
  }
]
```

### user (current logged-in user)
```javascript
{
  id: "user_1234567890",
  email: "admin@example.com",
  name: "Admin",
  role: "admin"
}
```

---

## 🛠️ Common Modifications

### Add New Student Field
**File**: `src/lib/storage.ts`
```javascript
export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  classId: string;
  enrollmentDate: string;
  // Add your field here:
  phoneNumber?: string;
}
```

**File**: `src/app/student/_components/student-content.tsx`
```javascript
const [formData, setFormData] = useState({
  // ... existing fields
  phoneNumber: "", // Add this
});
```

### Change Table Columns
**File**: `src/app/student/_components/student-content.tsx`
```javascript
<DataTable<Student>
  data={students}
  columns={[
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    // Add more columns here
    {
      key: "phoneNumber",
      label: "Phone",
      render: (value) => value || "N/A"
    },
  ]}
  // ...
/>
```

### Add New Page
1. Create: `src/app/newpage/page.tsx`
2. Create: `src/app/newpage/_components/content.tsx`
3. Add route to sidebar: `src/components/Layouts/sidebar/data/index.ts`
4. Add icon to: `src/components/Layouts/sidebar/icons.tsx` (if needed)

---

## 🔑 Key Hooks

### useAuth()
```javascript
import { useAuth } from "@/context/auth-context";

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Hello {user?.name}</p>}
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### useRouter()
```javascript
import { useRouter } from "next/navigation";

export function MyComponent() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push("/dashboard");
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

---

## 📝 Common Tasks

### Filter Data
```javascript
const filtered = studentStorage.getAll()
  .filter(s => s.classId === selectedClassId);
```

### Get Related Data
```javascript
// Get all students in a class
const students = studentStorage.getByClass(classId);

// Get all attendance for a student
const attendance = attendanceStorage.getByStudent(studentId);

// Get attendance for a specific class and date
const records = attendanceStorage.getByClassAndDate(classId, date);
```

### Check Blacklist Status
```javascript
const isBlacklisted = blacklistStorage.isBlacklisted(studentId);
const entry = blacklistStorage.getByStudent(studentId);
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Manual Deploy
```bash
npm run build
npm start
```

### Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_DEMO_USER_MAIL=demo@example.com
NEXT_PUBLIC_DEMO_USER_PASS=password123
```

---

## 🧪 Testing

### Test Login
1. Navigate to `/auth/sign-in`
2. Enter any email and password
3. Should redirect to `/dashboard`
4. Check localStorage: `console.log(localStorage.getItem('user'))`

### Test Data Creation
1. Add a class
2. Add a student to that class
3. Mark attendance
4. Refresh page - data should persist

### Test Filters
1. Go to `/attendance`
2. Add multiple records with different classes/dates
3. Use filter dropdowns
4. Table should update

---

## 💡 Pro Tips

1. **View localStorage in DevTools**
   - Open DevTools (F12)
   - Go to Application tab
   - Check Local Storage
   - Look for: `students`, `classes`, `attendance`, `user`, etc.

2. **Clear localStorage** (to reset)
   ```javascript
   localStorage.clear();
   location.reload();
   ```

3. **Export Data** (to backup)
   ```javascript
   const backup = {
     students: localStorage.getItem('students'),
     classes: localStorage.getItem('classes'),
     attendance: localStorage.getItem('attendance'),
   };
   console.log(JSON.stringify(backup));
   ```

4. **Import Data** (to restore)
   ```javascript
   const backup = {...}; // Your backup
   Object.entries(backup).forEach(([key, value]) => {
     localStorage.setItem(key, value);
   });
   ```

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All pages respond automatically using Tailwind's responsive classes.

---

## 🔗 Important Links

- **Dashboard**: http://localhost:3000/dashboard
- **Students**: http://localhost:3000/student
- **Attendance**: http://localhost:3000/attendance
- **Classes**: http://localhost:3000/class
- **Reports**: http://localhost:3000/report
- **Subjects**: http://localhost:3000/subject
- **Users**: http://localhost:3000/user
- **Blacklist**: http://localhost:3000/blacklist
- **Login**: http://localhost:3000/auth/sign-in

---

**Need more details? Check SETUP_GUIDE.md for comprehensive documentation!**
