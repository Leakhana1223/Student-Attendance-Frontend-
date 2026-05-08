"use client";

import { DataTable } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  useGetStudentsQuery,
  useAddStudentMutation,
  useDeleteStudentMutation,
} from "@/redux/features/student/studentApi";
import { useGetClassesQuery } from "@/redux/features/class/classApi";
import { useAuth } from "@/context/auth-context";

export function StudentContent() {
  const { user } = useAuth();
  const { data: students = [], isLoading: isStudentsLoading } = useGetStudentsQuery();
  const { data: classes = [], isLoading: isClassesLoading } = useGetClassesQuery();
  const [addStudent] = useAddStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    classId: "",
    dateOfBirth: new Date().toISOString().split("T")[0],
  });

  // Compute classes this teacher/admin can access
  const filteredClasses = useMemo(() => {
    if (!user) return [];
    if (user.role === "admin") return classes;
    if (user.role === "teacher") {
      // Filter to only classes where this teacher is assigned
      return classes.filter((cls: any) =>
        cls.teachers?.some((t: any) => t.id.toString() === user.id.toString())
      );
    }
    return [];
  }, [classes, user]);

  // Auto-assign classId for teachers when modal opens
  useEffect(() => {
    if (user?.role === "teacher" && filteredClasses.length > 0 && isModalOpen) {
      setFormData((prev) => ({
        ...prev,
        classId: prev.classId || filteredClasses[0].id.toString(),
      }));
    }
  }, [user, filteredClasses, isModalOpen]);

  // Filter displayed students based on teacher's assigned classes
  const displayStudents = useMemo(() => {
    if (!user) return [];
    if (user.role === "admin") return students;
    if (user.role === "teacher") {
      // Use filtered classes from API — supports multi-class teachers
      const teacherClassIds = new Set(
        filteredClasses.map((c: any) => c.id.toString())
      );
      return students.filter((s: any) =>
        s.classId != null && teacherClassIds.has(s.classId.toString())
      );
    }
    return [];
  }, [students, user, filteredClasses]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    // For teachers: use their first assigned class or selected class
    const classIdToUse =
      user?.role === "teacher"
        ? formData.classId || (filteredClasses[0]?.id?.toString() ?? "")
        : formData.classId;

    if (!formData.name || !formData.email || !classIdToUse) {
      alert("Please fill all required fields including class.");
      return;
    }

    try {
      await addStudent({
        name: formData.name,
        email: formData.email,
        classId: classIdToUse,
        dateOfBirth: formData.dateOfBirth,
        password: "Student@123", // Default password
        gender: "MALE",
        phoneNumber: "",
      }).unwrap();

      setFormData({
        name: "",
        email: "",
        classId:
          user?.role === "teacher"
            ? filteredClasses[0]?.id?.toString() ?? ""
            : "",
        dateOfBirth: new Date().toISOString().split("T")[0],
      });
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to add student:", error);
      const msg = error?.data?.message || "Failed to add student";
      alert(msg);
    }
  };

  const handleDelete = async (student: any) => {
    if (confirm(`Delete ${student.name}?`)) {
      try {
        await deleteStudent(student.id).unwrap();
      } catch (error: any) {
        console.error("Failed to delete student:", error);
        const msg = error?.data?.message || "Failed to delete student";
        alert(msg);
      }
    }
  };

  const getClassName = (classId: string) => {
    const cls = classes.find((c: any) => c.id.toString() === classId?.toString());
    return cls ? cls.className : "N/A";
  };

  if (isStudentsLoading || isClassesLoading) {
    return (
      <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  const pageTitle =
    user?.role === "teacher"
      ? filteredClasses.length === 1
        ? `Class Students — ${filteredClasses[0]?.className}`
        : `Class Students (${filteredClasses.length} classes)`
      : "Students Management";

  return (
    <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          {pageTitle}
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90"
        >
          <Plus className="h-5 w-5" />
          Add Student
        </button>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Student"
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          {/* Class selector — admin sees all classes, teacher selects from their assigned ones */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Class
            </label>
            {user?.role === "teacher" && filteredClasses.length === 1 ? (
              // Single class teacher: show read-only
              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
                {filteredClasses[0]?.className}
              </div>
            ) : (
              <select
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              >
                <option value="">Select a class</option>
                {filteredClasses.map((cls: any) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.className}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              Add Student
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Table */}
      <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-4 py-5 dark:border-strokedark sm:px-6">
          <h3 className="font-semibold text-black dark:text-white">
            {user?.role === "teacher" ? "Class Students" : "All Students"}
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-meta-4 dark:text-gray-300">
              {displayStudents.length}
            </span>
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <DataTable<any>
            data={displayStudents}
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              {
                key: "classId",
                label: "Class",
                render: (classId) => getClassName(classId),
              },
              {
                key: "dateOfBirth",
                label: "Date of Birth",
                render: (date) =>
                  date ? new Date(date as string).toLocaleDateString() : "N/A",
              },
              {
                key: "blacklisted",
                label: "Status",
                render: (blacklisted) => (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      blacklisted
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {blacklisted ? "Blacklisted" : "Active"}
                  </span>
                ),
              },
            ]}
            onDelete={user?.role === "admin" ? handleDelete : undefined}
            emptyMessage="No students found."
          />
        </div>
      </div>
      </div>
    </div>
  );
}
