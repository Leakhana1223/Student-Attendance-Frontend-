"use client";

import { DataTable } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { subjectStorage, classStorage, Subject } from "@/lib/storage";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export function SubjectContent() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    classId: "",
    credits: "3",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSubjects(subjectStorage.getAll());
    setClasses(classStorage.getAll());
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.classId) {
      alert("Please fill required fields");
      return;
    }

    subjectStorage.add({
      name: formData.name,
      code: formData.code,
      classId: formData.classId,
      credits: formData.credits ? parseInt(formData.credits) : undefined,
    });

    setFormData({
      name: "",
      code: "",
      classId: "",
      credits: "3",
    });
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (subject: Subject) => {
    if (confirm(`Delete ${subject.name}?`)) {
      subjectStorage.delete(subject.id);
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
          Subjects Management
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90"
        >
          <Plus className="h-5 w-5" />
          Add Subject
        </button>
      </div>

      {/* Add Subject Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Subject"
      >
        <form onSubmit={handleAddSubject} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Subject Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="Mathematics"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Subject Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="MAT101"
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
              Credits (Optional)
            </label>
            <input
              type="number"
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="3"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              Add Subject
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
            All Subjects ({subjects.length})
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <DataTable<Subject>
            data={subjects}
            columns={[
              { key: "name", label: "Subject Name" },
              { key: "code", label: "Code" },
              {
                key: "classId",
                label: "Class",
                render: (classId) => getClassName(classId as string),
              },
              {
                key: "credits",
                label: "Credits",
                render: (credits) => credits || "N/A",
              },
            ]}
            onDelete={handleDelete}
            emptyMessage="No subjects found. Add one to get started!"
          />
        </div>
      </div>
    </div>
  );
}
