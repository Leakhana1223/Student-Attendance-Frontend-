"use client";

import { DataTable } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { useState } from "react";
import { Plus } from "lucide-react";
import { 
  useGetStudentsQuery, 
  useAddStudentMutation, 
  useDeleteStudentMutation 
} from "@/redux/features/student/studentApi";
import { useGetClassesQuery } from "@/redux/features/class/classApi";

export function StudentContent() {
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

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.classId) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addStudent({
        name: formData.name,
        email: formData.email,
        classId: formData.classId,
        dateOfBirth: formData.dateOfBirth,
        password: "Student@123", // Default password
        gender: "MALE", // Default gender, should ideally be in form
        phoneNumber: "",
      }).unwrap();

      setFormData({
        name: "",
        email: "",
        classId: "",
        dateOfBirth: new Date().toISOString().split("T")[0],
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add student:", error);
      alert("Failed to add student");
    }
  };

  const handleDelete = async (student: any) => {
    if (confirm(`Delete ${student.name}?`)) {
      try {
        await deleteStudent(student.id).unwrap();
      } catch (error) {
        console.error("Failed to delete student:", error);
        alert("Failed to delete student");
      }
    }
  };

  const getClassName = (classId: string) => {
    // In the new API, we might need a different way to get class name
    // But for now, if students data doesn't include class name, we look it up
    const cls = classes.find((c) => c.id.toString() === classId?.toString());
    return cls ? cls.className : "N/A";
  };

  if (isStudentsLoading || isClassesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Students Management
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

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Class
            </label>
            <select
              value={formData.classId}
              onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="">Select a class</option>
              {classes.map((cls: any) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className}
                </option>
              ))}
            </select>
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
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-gray-200 px-4 py-6 dark:border-gray-700 sm:px-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            All Students ({students.length})
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <DataTable<any>
            data={students}
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              {
                key: "classId",
                label: "Class",
                render: (classId) => {
                    const cls = classes.find((c: any) => c.id.toString() === classId?.toString());
                    return cls ? cls.className : "N/A";
                },
              },
              {
                key: "dateOfBirth",
                label: "Date of Birth",
                render: (date) => date ? new Date(date as string).toLocaleDateString() : "N/A",
              },
            ]}
            onDelete={handleDelete}
            emptyMessage="No students found. Add one to get started!"
          />
        </div>
      </div>
    </div>
  );
}
