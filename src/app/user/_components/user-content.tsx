"use client";

import { useAuth } from "@/context/auth-context";
import { DataTable } from "@/components/DataTable";
import { userStorage, UserRecord } from "@/lib/storage";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/Modal";

export function UserContent() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "teacher",
    password: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allUsers = userStorage.getAll();
    setUsers(allUsers);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.name || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    userStorage.add({
      email: formData.email,
      name: formData.name,
      role: formData.role,
      password: formData.password,
    });

    setFormData({
      email: "",
      name: "",
      role: "teacher",
      password: "",
    });
    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = (userRecord: UserRecord) => {
    if (confirm(`Delete ${userRecord.name}?`)) {
      userStorage.delete(userRecord.id);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Users Management
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90"
        >
          <Plus className="h-5 w-5" />
          Add User
        </button>
      </div>

      {/* Current User Info */}
      {currentUser && (
        <div className="rounded-[10px] bg-blue-50 shadow-1 dark:bg-blue-900/20 dark:shadow-card">
          <div className="px-4 py-6 sm:px-6">
            <h3 className="mb-4 font-semibold text-blue-900 dark:text-blue-400">
              Your Profile
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300">Name</p>
                <p className="mt-1 font-medium text-blue-900 dark:text-blue-200">
                  {currentUser.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300">Email</p>
                <p className="mt-1 font-medium text-blue-900 dark:text-blue-200">
                  {currentUser.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300">Role</p>
                <p className="mt-1 font-medium text-blue-900 dark:text-blue-200 capitalize">
                  {currentUser.role}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300">Status</p>
                <p className="mt-1 font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
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
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              Add User
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

      {/* Users Table */}
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-gray-200 px-4 py-6 dark:border-gray-700 sm:px-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            All Users ({users.length})
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <DataTable<UserRecord>
            data={users}
            columns={[
              { key: "name", label: "Name" },
              { key: "email", label: "Email" },
              { key: "role", label: "Role" },
              {
                key: "createdAt",
                label: "Created At",
                render: (date) => new Date(date as string).toLocaleDateString(),
              },
            ]}
            onDelete={handleDelete}
            emptyMessage="No users found. Add one to get started!"
          />
        </div>
      </div>
    </div>
  );
}
