# 🚀 Getting Started in 5 Minutes

## Step 1: Start the Development Server
```bash
npm run dev
```
✅ Server will start on `http://localhost:3000`

---

## Step 2: Login
1. Browser opens to `/auth/sign-in`
2. Enter **any email** and **any password** (demo mode)
   - Example: `admin@example.com` / `password123`
3. Click **"Sign In"**
4. You'll be redirected to the **Dashboard**

---

## Step 3: Create Test Data

### Create a Class
1. Click **"Class"** in the sidebar
2. Click **"Add Class"** button
3. Fill in:
   - Class Name: `Class 10-A`
   - Class Code: `CLS001`
   - Section: `A`
4. Click **"Add Class"**

### Add Students
1. Click **"Student"** in the sidebar
2. Click **"Add Student"** button
3. Fill in:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Roll Number: `STU001`
   - Class: `Class 10-A` (select from dropdown)
4. Click **"Add Student"**
5. Repeat for 2-3 more students

### Mark Attendance
1. Click **"Attendance"** in the sidebar
2. Click **"Mark Attendance"** button
3. Fill in:
   - Class: `Class 10-A`
   - Student: `John Doe`
   - Date: Today
   - Session: `Morning`
   - Status: `Present`
4. Click **"Mark Attendance"**
5. Repeat for other students

### View Reports
1. Click **"Report"** in the sidebar
2. Select a class from the dropdown
3. See attendance statistics
4. View student-wise percentage

---

## Step 4: Explore Other Features

### 📚 Subjects
- Add subjects to classes
- Track course credits

### 👥 Users
- View your profile
- Add new users to the system

### ⛔ Blacklist
- Add students with reasons
- Manage restrictions

---

## That's It! 🎉

Your dashboard is now working with test data. All data is saved locally in your browser.

---

## Sidebar Navigation

The left sidebar has all the pages:
- 🏠 **Dashboard** - Overview and stats
- 👥 **Students** - Student management
- 📅 **Attendance** - Mark attendance
- 📚 **Classes** - Class management
- 📊 **Reports** - Analytics
- 🎓 **Subjects** - Course management
- 👤 **Users** - User profiles
- ⛔ **Blacklist** - Blacklist management

---

## Useful Tips

### 🔄 Refresh Page
All your data persists! Data is saved in browser's localStorage.

### 🗑️ Delete Data
Click the **"Delete"** button in any table to remove an item.

### 📋 Edit Data
To edit data, delete and re-add with new values.

### 🌙 Dark Mode
Toggle in the top-right corner of the page.

### 📱 Mobile View
Works on phones and tablets too!

---

## Common Questions

**Q: Where is my data stored?**
A: Locally in your browser's localStorage. Refresh the page - data persists!

**Q: Can anyone login?**
A: Yes, for this demo. Any email/password works. This is for testing only.

**Q: How do I reset everything?**
A: Clear browser history/cache to clear localStorage.

**Q: Can I use this in production?**
A: This is a demo. For production, you'll need a backend API and real authentication.

**Q: How do I add custom fields?**
A: See QUICK_REFERENCE.md for code examples.

---

## Need Help?

- 📖 Full guide: **SETUP_GUIDE.md**
- 🔧 Quick reference: **QUICK_REFERENCE.md**
- 📝 Implementation details: **IMPLEMENTATION_SUMMARY.md**

---

## Next Steps

### When Ready for Production:
1. Set up a backend database (PostgreSQL, MongoDB, etc.)
2. Create API endpoints
3. Add real user authentication (JWT, OAuth2)
4. Deploy to production server
5. Set up SSL/HTTPS

### For More Features:
1. PDF export for reports
2. Email notifications
3. Bulk import from CSV
4. Advanced analytics
5. Mobile app

---

**Happy tracking! 📊✨**

Start by creating a class, add some students, and mark attendance. Then explore the reports page to see the analytics!
