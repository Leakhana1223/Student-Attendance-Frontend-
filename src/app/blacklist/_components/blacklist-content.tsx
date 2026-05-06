"use client";

import { DataTable } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { blacklistStorage, studentStorage, BlacklistEntry, Student } from "@/lib/storage";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

export function BlacklistContent() {
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    reason: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBlacklist(blacklistStorage.getAll());
    setStudents(studentStorage.getAll());
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studentId || !formData.reason) {
      alert("Please fill all fields");
      return;
    }

    // Check if already blacklisted
    if (blacklistStorage.isBlacklisted(formData.studentId)) {
      alert("This student is already in the blacklist");
      return;
    }

    blacklistStorage.add({
      studentId: formData.studentId,
      reason: formData.reason,
      addedDate: new Date().toISOString().split("T")[0],
    });

    setFormData({
      studentId: "",
      reason: "",
    });
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (entry: BlacklistEntry) => {
    if (confirm("Remove from blacklist?")) {
      blacklistStorage.delete(entry.id);
      loadData();
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student
      ? `${student.name} (${student.rollNumber})`
      : "Unknown Student";
  };

  // Get students not in blacklist
  const availableStudents = students.filter(
    (s) => !blacklist.some((b) => b.studentId === s.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Blacklist Management
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={availableStudents.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          <Plus className="h-5 w-5" />
          Add Entry
        </button>
      </div>

      {/* Info Card */}
      <div className="rounded-[10px] bg-yellow-50 shadow-1 dark:bg-yellow-900/20 dark:shadow-card">
        <div className="px-4 py-6 sm:px-6">
          <h3 className="mb-2 font-semibold text-yellow-900 dark:text-yellow-400">
            ⚠️ Blacklist Information
          </h3>
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            Students added to the blacklist may have restricted access or special tracking.
            Use this feature carefully and maintain proper records.
          </p>
        </div>
      </div>

      {/* Add Blacklist Entry Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add to Blacklist"
      >
        <form onSubmit={handleAddEntry} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Student
            </label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="">Select a student</option>
              {availableStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Reason
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="Reason for adding to blacklist..."
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700"
            >
              Add to Blacklist
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
            Blacklisted Students ({blacklist.length})
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <DataTable<BlacklistEntry>
            data={blacklist}
            columns={[
              {
                key: "studentId",
                label: "Student",
                render: (studentId) => getStudentName(studentId as string),
              },
              { key: "reason", label: "Reason" },
              {
                key: "addedDate",
                label: "Added Date",
                render: (date) => new Date(date as string).toLocaleDateString(),
              },
            ]}
            onDelete={handleDelete}
            emptyMessage="No students in blacklist."
          />
        </div>
      </div>
    </div>
  );
}
