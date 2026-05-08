"use client";

import { DataTable } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { useState, useEffect, useRef } from "react";
import { Plus, X, ChevronDown, Search } from "lucide-react";
import {
  useGetClassesQuery,
  useAddClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
} from "@/redux/features/class/classApi";
import { useGetTeachersQuery } from "@/redux/features/user/userApi";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeacherInfo {
  id: number;
  name: string;
  email: string;
}

interface ClassItem {
  id: number;
  className: string;
  description: string;
  year: number;
  createdDate: string;
  teachers: TeacherInfo[];
}

interface FormState {
  className: string;
  description: string;
  year: number;
  teacherIds: number[];
}

const EMPTY_FORM: FormState = {
  className: "",
  description: "",
  year: new Date().getFullYear(),
  teacherIds: [],
};

// ─── Multi-Select Teacher Picker ──────────────────────────────────────────────

interface TeacherPickerProps {
  teachers: TeacherInfo[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

function TeacherPicker({ teachers, selectedIds, onChange }: TeacherPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const selectedTeachers = teachers.filter((t) => selectedIds.includes(t.id));
  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  };

  const remove = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter((x) => x !== id));
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <div
        role="button"
        onClick={() => setOpen((o) => !o)}
        className="min-h-[42px] w-full cursor-pointer rounded-lg border border-stroke px-3 py-2 dark:border-strokedark dark:bg-boxdark dark:text-white"
      >
        {selectedTeachers.length === 0 ? (
          <span className="text-gray-400 dark:text-gray-500">Select teachers…</span>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedTeachers.map((t) => (
              <span
                key={t.id}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {t.name}
                <button
                  type="button"
                  onClick={(e) => remove(t.id, e)}
                  className="ml-0.5 rounded-full hover:bg-primary/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <ChevronDown
          className={`absolute right-3 top-3 h-4 w-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-stroke bg-white shadow-lg dark:border-strokedark dark:bg-boxdark">
          {/* Search */}
          <div className="border-b border-stroke p-2 dark:border-strokedark">
            <div className="flex items-center gap-2 rounded-md border border-stroke px-2 py-1 dark:border-strokedark">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search teachers…"
                className="w-full bg-transparent text-sm outline-none dark:text-white"
              />
            </div>
          </div>
          {/* Options */}
          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-400">No teachers found</li>
            ) : (
              filtered.map((t) => {
                const checked = selectedIds.includes(t.id);
                return (
                  <li
                    key={t.id}
                    onClick={() => toggle(t.id)}
                    className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-meta-4/50 ${
                      checked ? "bg-primary/5" : ""
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        checked
                          ? "border-primary bg-primary text-white"
                          : "border-stroke dark:border-strokedark"
                      }`}
                    >
                      {checked && (
                        <svg viewBox="0 0 12 10" className="h-2.5 w-2.5 fill-current">
                          <polyline points="1.5 6 4.5 9 10.5 1" strokeWidth="1.5" stroke="white" fill="none" />
                        </svg>
                      )}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{t.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.email}</p>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Class Form ───────────────────────────────────────────────────────────────

interface ClassFormProps {
  form: FormState;
  teachers: TeacherInfo[];
  errors: Partial<Record<keyof FormState, string>>;
  onChange: (f: FormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
  loading: boolean;
}

function ClassForm({
  form,
  teachers,
  errors,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  loading,
}: ClassFormProps) {
  const inputCls =
    "w-full rounded-lg border px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:bg-gray-800 dark:text-white";
  const errorCls = "mt-1 text-xs text-red-500";
  const labelCls = "mb-1.5 block text-sm font-medium text-gray-900 dark:text-white";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Class Name */}
      <div>
        <label className={labelCls}>
          Class Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.className}
          onChange={(e) => onChange({ ...form, className: e.target.value })}
          className={`${inputCls} ${errors.className ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`}
          placeholder="e.g. Mathematics Grade 10"
        />
        {errors.className && <p className={errorCls}>{errors.className}</p>}
      </div>

      {/* Teachers Multi-Select */}
      <div>
        <label className={labelCls}>
          Assigned Teachers <span className="text-red-500">*</span>
        </label>
        <TeacherPicker
          teachers={teachers}
          selectedIds={form.teacherIds}
          onChange={(ids) => onChange({ ...form, teacherIds: ids })}
        />
        {errors.teacherIds && <p className={errorCls}>{errors.teacherIds}</p>}
      </div>

      {/* Year */}
      <div>
        <label className={labelCls}>
          Year <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={form.year}
          min={2000}
          max={2100}
          onChange={(e) => onChange({ ...form, year: parseInt(e.target.value) || new Date().getFullYear() })}
          className={`${inputCls} ${errors.year ? "border-red-400" : "border-gray-300 dark:border-gray-600"}`}
        />
        {errors.year && <p className={errorCls}>{errors.year}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          className={`${inputCls} border-gray-300 dark:border-gray-600`}
          placeholder="Optional description…"
          rows={3}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving…" : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
  const errs: Partial<Record<keyof FormState, string>> = {};
  if (!form.className.trim()) errs.className = "Class name is required";
  if (!form.year || form.year < 2000) errs.year = "Enter a valid year";
  if (form.teacherIds.length === 0) errs.teacherIds = "Select at least one teacher";
  return errs;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ClassContent() {
  const { data: classes = [], isLoading } = useGetClassesQuery();
  const { data: teachers = [] } = useGetTeachersQuery();
  const [addClass, { isLoading: isAdding }] = useAddClassMutation();
  const [updateClass, { isLoading: isUpdating }] = useUpdateClassMutation();
  const [deleteClass] = useDeleteClassMutation();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addForm, setAddForm] = useState<FormState>(EMPTY_FORM);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
  const [addErrors, setAddErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(addForm);
    if (Object.keys(errs).length) { setAddErrors(errs); return; }
    try {
      await addClass({
        className: addForm.className,
        description: addForm.description,
        year: addForm.year,
        teacherIds: addForm.teacherIds,
      }).unwrap();
      setAddForm(EMPTY_FORM);
      setAddErrors({});
      setAddOpen(false);
    } catch (error) {
      console.error("Failed to add class:", error);
    }
  };

  const openEdit = (cls: ClassItem) => {
    setEditingId(cls.id);
    setEditForm({
      className: cls.className,
      description: cls.description ?? "",
      year: cls.year,
      teacherIds: cls.teachers.map((t) => t.id),
    });
    setEditErrors({});
    setEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(editForm);
    if (Object.keys(errs).length) { setEditErrors(errs); return; }
    try {
      await updateClass({
        id: editingId,
        className: editForm.className,
        description: editForm.description,
        year: editForm.year,
        teacherIds: editForm.teacherIds,
      }).unwrap();
      setEditOpen(false);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update class:", error);
    }
  };

  const handleDelete = async (cls: ClassItem) => {
    if (!confirm(`Delete "${cls.className}"? This cannot be undone.`)) return;
    try {
      await deleteClass(cls.id).unwrap();
    } catch (error) {
      console.error("Failed to delete class:", error);
      alert("Failed to delete class. It might be referenced by other records.");
    }
  };

  // ── Columns ─────────────────────────────────────────────────────────────────

  const columns = [
    {
      key: "className",
      label: "Class Name",
      render: (_: any, row: ClassItem) => (
        <span className="font-medium text-gray-900 dark:text-white">{row.className}</span>
      ),
    },
    {
      key: "teachers",
      label: "Assigned Teachers",
      render: (_: any, row: ClassItem) =>
        row.teachers && row.teachers.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {row.teachers.map((t) => (
              <span
                key={t.id}
                className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                title={t.email}
              >
                {t.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs italic text-gray-400">No teachers assigned</span>
        ),
    },
    {
      key: "createdDate",
      label: "Created Date",
      render: (_: any, row: ClassItem) =>
        row.createdDate
          ? new Date(row.createdDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "—",
    },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Classes Management
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create and manage classes with assigned teachers
          </p>
        </div>
        <button
          onClick={() => { setAddForm(EMPTY_FORM); setAddErrors({}); setAddOpen(true); }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90 transition-all"
        >
          <Plus className="h-5 w-5" />
          Add Class
        </button>
      </div>

      {/* Add Modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add New Class" size="lg">
          <ClassForm
          form={addForm}
          teachers={teachers}
          errors={addErrors}
          onChange={setAddForm}
          onSubmit={handleAddSubmit}
          onCancel={() => setAddOpen(false)}
          submitLabel="Create Class"
          loading={isAdding}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Class" size="lg">
        <ClassForm
          form={editForm}
          teachers={teachers}
          errors={editErrors}
          onChange={setEditForm}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditOpen(false)}
          submitLabel="Save Changes"
          loading={isUpdating}
        />
      </Modal>

      {/* Table Card */}
      <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between border-b border-stroke px-4 py-5 dark:border-strokedark sm:px-6">
          <h3 className="font-semibold text-black dark:text-white">
            All Classes
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-meta-4 dark:text-gray-300">
              {classes.length}
            </span>
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <DataTable<ClassItem>
            data={classes as ClassItem[]}
            columns={columns as any}
            onEdit={openEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            emptyMessage="No classes found. Create one to get started!"
          />
        </div>
      </div>
      </div>
    </div>
  );
}
