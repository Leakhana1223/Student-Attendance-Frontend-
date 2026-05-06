"use client";

import { DataTable } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { useState } from "react";
import { Plus } from "lucide-react";
import { 
  useGetClassesQuery, 
  useAddClassMutation, 
  useDeleteClassMutation 
} from "@/redux/features/class/classApi";

export function ClassContent() {
  const { data: classes = [], isLoading } = useGetClassesQuery();
  const [addClass] = useAddClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    section: "",
    description: "",
  });

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.section) {
      alert("Please fill required fields");
      return;
    }

    try {
      await addClass({
        className: formData.name,
        code: formData.code,
        section: formData.section,
        description: formData.description,
        year: new Date().getFullYear(),
      }).unwrap();

      setFormData({
        name: "",
        code: "",
        section: "",
        description: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add class:", error);
      alert("Failed to add class");
    }
  };

  const handleDelete = async (classItem: any) => {
    if (confirm(`Delete ${classItem.className}?`)) {
      try {
        await deleteClass(classItem.id).unwrap();
      } catch (error) {
        console.error("Failed to delete class:", error);
        alert("Failed to delete class");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Classes Management
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90"
        >
          <Plus className="h-5 w-5" />
          Add Class
        </button>
      </div>

      {/* Add Class Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Class"
      >
        <form onSubmit={handleAddClass} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Class Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="Class 10-A"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Class Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="CLS001"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Section
            </label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="A"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="Class description..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              Add Class
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
            All Classes ({classes.length})
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <DataTable<any>
            data={classes}
            columns={[
              { key: "className", label: "Class Name" },
              { key: "code", label: "Code" },
              { key: "section", label: "Section" },
              { key: "description", label: "Description" },
            ]}
            onDelete={handleDelete}
            emptyMessage="No classes found. Add one to get started!"
          />
        </div>
      </div>
    </div>
  );
}
