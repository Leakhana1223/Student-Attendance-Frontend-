// Storage utility functions for managing data in localStorage

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  classId: string;
  dateOfBirth: string;
  address: string;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  section: string;
  description?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  session: "morning" | "afternoon";
  status: "present" | "absent" | "late" | "excused";
  remark?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  classId: string;
  credits?: number;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  password?: string;
  createdAt: string;
}

export interface BlacklistEntry {
  id: string;
  studentId: string;
  reason: string;
  addedDate: string;
}

// Student Management
export const studentStorage = {
  getAll: (): Student[] => {
    const data = localStorage.getItem("students");
    return data ? JSON.parse(data) : [];
  },

  add: (student: Omit<Student, "id">): Student => {
    const students = studentStorage.getAll();
    const newStudent: Student = {
      ...student,
      id: `student_${Date.now()}`,
    };
    students.push(newStudent);
    localStorage.setItem("students", JSON.stringify(students));
    return newStudent;
  },

  update: (id: string, updates: Partial<Student>): Student | null => {
    const students = studentStorage.getAll();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) return null;

    students[index] = { ...students[index], ...updates };
    localStorage.setItem("students", JSON.stringify(students));
    return students[index];
  },

  delete: (id: string): boolean => {
    const students = studentStorage.getAll();
    const filtered = students.filter((s) => s.id !== id);
    if (filtered.length === students.length) return false;

    localStorage.setItem("students", JSON.stringify(filtered));
    return true;
  },

  getById: (id: string): Student | null => {
    const students = studentStorage.getAll();
    return students.find((s) => s.id === id) || null;
  },

  getByClass: (classId: string): Student[] => {
    return studentStorage.getAll().filter((s) => s.classId === classId);
  },
};

// Class Management
export const classStorage = {
  getAll: (): Class[] => {
    const data = localStorage.getItem("classes");
    return data ? JSON.parse(data) : [];
  },

  add: (classData: Omit<Class, "id">): Class => {
    const classes = classStorage.getAll();
    const newClass: Class = {
      ...classData,
      id: `class_${Date.now()}`,
    };
    classes.push(newClass);
    localStorage.setItem("classes", JSON.stringify(classes));
    return newClass;
  },

  update: (id: string, updates: Partial<Class>): Class | null => {
    const classes = classStorage.getAll();
    const index = classes.findIndex((c) => c.id === id);
    if (index === -1) return null;

    classes[index] = { ...classes[index], ...updates };
    localStorage.setItem("classes", JSON.stringify(classes));
    return classes[index];
  },

  delete: (id: string): boolean => {
    const classes = classStorage.getAll();
    const filtered = classes.filter((c) => c.id !== id);
    if (filtered.length === classes.length) return false;

    localStorage.setItem("classes", JSON.stringify(filtered));
    return true;
  },

  getById: (id: string): Class | null => {
    const classes = classStorage.getAll();
    return classes.find((c) => c.id === id) || null;
  },
};

// Attendance Management
export const attendanceStorage = {
  getAll: (): Attendance[] => {
    const data = localStorage.getItem("attendance");
    return data ? JSON.parse(data) : [];
  },

  add: (attendance: Omit<Attendance, "id">): Attendance => {
    const records = attendanceStorage.getAll();
    const newRecord: Attendance = {
      ...attendance,
      id: `attendance_${Date.now()}`,
    };
    records.push(newRecord);
    localStorage.setItem("attendance", JSON.stringify(records));
    return newRecord;
  },

  update: (id: string, updates: Partial<Attendance>): Attendance | null => {
    const records = attendanceStorage.getAll();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return null;

    records[index] = { ...records[index], ...updates };
    localStorage.setItem("attendance", JSON.stringify(records));
    return records[index];
  },

  delete: (id: string): boolean => {
    const records = attendanceStorage.getAll();
    const filtered = records.filter((r) => r.id !== id);
    if (filtered.length === records.length) return false;

    localStorage.setItem("attendance", JSON.stringify(filtered));
    return true;
  },

  getByStudent: (studentId: string): Attendance[] => {
    return attendanceStorage.getAll().filter((a) => a.studentId === studentId);
  },

  getByClass: (classId: string): Attendance[] => {
    return attendanceStorage.getAll().filter((a) => a.classId === classId);
  },

  getByDate: (date: string): Attendance[] => {
    return attendanceStorage.getAll().filter((a) => a.date === date);
  },

  getByClassAndDate: (classId: string, date: string): Attendance[] => {
    return attendanceStorage
      .getAll()
      .filter((a) => a.classId === classId && a.date === date);
  },
};

// Subject Management
export const subjectStorage = {
  getAll: (): Subject[] => {
    const data = localStorage.getItem("subjects");
    return data ? JSON.parse(data) : [];
  },

  add: (subject: Omit<Subject, "id">): Subject => {
    const subjects = subjectStorage.getAll();
    const newSubject: Subject = {
      ...subject,
      id: `subject_${Date.now()}`,
    };
    subjects.push(newSubject);
    localStorage.setItem("subjects", JSON.stringify(subjects));
    return newSubject;
  },

  update: (id: string, updates: Partial<Subject>): Subject | null => {
    const subjects = subjectStorage.getAll();
    const index = subjects.findIndex((s) => s.id === id);
    if (index === -1) return null;

    subjects[index] = { ...subjects[index], ...updates };
    localStorage.setItem("subjects", JSON.stringify(subjects));
    return subjects[index];
  },

  delete: (id: string): boolean => {
    const subjects = subjectStorage.getAll();
    const filtered = subjects.filter((s) => s.id !== id);
    if (filtered.length === subjects.length) return false;

    localStorage.setItem("subjects", JSON.stringify(filtered));
    return true;
  },

  getByClass: (classId: string): Subject[] => {
    return subjectStorage.getAll().filter((s) => s.classId === classId);
  },
};

// User Management
export const userStorage = {
  getAll: (): UserRecord[] => {
    const data = localStorage.getItem("users");
    return data ? JSON.parse(data) : [];
  },

  add: (user: Omit<UserRecord, "id" | "createdAt">): UserRecord => {
    const users = userStorage.getAll();
    const newUser: UserRecord = {
      ...user,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    return newUser;
  },

  delete: (id: string): boolean => {
    const users = userStorage.getAll();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) return false;

    localStorage.setItem("users", JSON.stringify(filtered));
    return true;
  },
};

// Blacklist Management
export const blacklistStorage = {
  getAll: (): BlacklistEntry[] => {
    const data = localStorage.getItem("blacklist");
    return data ? JSON.parse(data) : [];
  },

  add: (entry: Omit<BlacklistEntry, "id">): BlacklistEntry => {
    const blacklist = blacklistStorage.getAll();
    const newEntry: BlacklistEntry = {
      ...entry,
      id: `blacklist_${Date.now()}`,
    };
    blacklist.push(newEntry);
    localStorage.setItem("blacklist", JSON.stringify(blacklist));
    return newEntry;
  },

  delete: (id: string): boolean => {
    const blacklist = blacklistStorage.getAll();
    const filtered = blacklist.filter((b) => b.id !== id);
    if (filtered.length === blacklist.length) return false;

    localStorage.setItem("blacklist", JSON.stringify(filtered));
    return true;
  },

  isBlacklisted: (studentId: string): boolean => {
    return blacklistStorage.getAll().some((b) => b.studentId === studentId);
  },

  getByStudent: (studentId: string): BlacklistEntry | null => {
    return blacklistStorage.getAll().find((b) => b.studentId === studentId) || null;
  },
};
