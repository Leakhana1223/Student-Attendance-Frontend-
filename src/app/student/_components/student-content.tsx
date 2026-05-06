"use client";

import { DataTable } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { classStorage, studentStorage, Student } from "@/lib/storage";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export function StudentContent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rollNumber: "",
    classId: "",
    dateOfBirth: new Date().toISOString().split("T")[0],
    address: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStudents(studentStorage.getAll());
    setClasses(classStorage.getAll());
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.rollNumber || !formData.classId) {
      alert("Please fill all fields");
      return;
    }

    studentStorage.add({
      name: formData.name,
      email: formData.email,
      rollNumber: formData.rollNumber,
      classId: formData.classId,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
    });

    setFormData({
      name: "",
      email: "",
      rollNumber: "",
      classId: "",
      dateOfBirth: new Date().toISOString().split("T")[0],
      address: "",
    });
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (student: Student) => {
    if (confirm(`Delete ${student.name}?`)) {
      studentStorage.delete(student.id);
      loadData();
    }
  };

  const getClassName = (classId: string) => {
    const cls = classes.find((c) => c.id === classId);
    return cls ? cls.name : "N/A";
  };

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
              Roll Number
            </label>
            <input
              type="text"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="STU001"
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
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
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
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="123 Main St"
              required
            />
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
          <DataTable<Student>
            data={students}
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "rollNumber", label: "Roll Number" },
              {
                key: "classId",
                label: "Class",
                render: (classId) => getClassName(classId as string),
              },
              {
                key: "dateOfBirth",
                label: "Date of Birth",
                render: (date) => new Date(date as string).toLocaleDateString(),
              },
              { key: "address", label: "Address" },
            ]}
            onDelete={handleDelete}
            emptyMessage="No students found. Add one to get started!"
          />
        </div>
      </div>
    </div>
  );
}
