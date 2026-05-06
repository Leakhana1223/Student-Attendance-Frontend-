"use client";

import { DataTable } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { useState } from "react";
import { Plus } from "lucide-react";
import { 
  useGetAttendanceQuery, 
  useGetAttendanceByFilterQuery, 
  useRecordAttendanceMutation, 
  useDeleteAttendanceMutation 
} from "@/redux/features/attendance/attendanceApi";
import { useGetStudentsQuery } from "@/redux/features/student/studentApi";
import { useGetClassesQuery } from "@/redux/features/class/classApi";
import { useAuth } from "@/context/auth-context";

export function AttendanceContent() {
  const { user } = useAuth();
  const [filterClassId, setFilterClassId] = useState("");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);

  const { data: allAttendance = [], isLoading: isAttendanceLoading } = useGetAttendanceQuery();
  const { data: filteredAttendance = [], isLoading: isFilteredLoading } = useGetAttendanceByFilterQuery(
    { classId: filterClassId, date: filterDate },
    { skip: !filterClassId || !filterDate }
  );

  const { data: students = [], isLoading: isStudentsLoading } = useGetStudentsQuery();
  const { data: classes = [], isLoading: isClassesLoading } = useGetClassesQuery();
  
  const [recordAttendance] = useRecordAttendanceMutation();
  const [deleteAttendance] = useDeleteAttendanceMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    studentId: string;
    classId: string;
    date: string;
    session: "morning" | "afternoon";
    status: "present" | "absent" | "late" | "excused";
    remark: string;
  }>({
    studentId: "",
    classId: "",
    date: new Date().toISOString().split("T")[0],
    session: "morning",
    status: "present",
    remark: "",
  });

  const handleRecordAttendance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studentId || !formData.classId || !formData.date) {
      alert("Please fill required fields");
      return;
    }

    try {
      await recordAttendance({
        studentId: formData.studentId,
        classId: formData.classId,
        date: formData.date,
        timeSlot: formData.session.toUpperCase(),
        status: formData.status.toUpperCase(),
        recordedById: user?.id,
        remark: formData.remark,
      }).unwrap();

      setFormData({
        studentId: "",
        classId: "",
        date: new Date().toISOString().split("T")[0],
        session: "morning",
        status: "present",
        remark: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to record attendance:", error);
      alert("Failed to record attendance");
    }
  };

  const handleDelete = async (record: any) => {
    if (confirm("Delete this attendance record?")) {
      try {
        await deleteAttendance(record.id).unwrap();
      } catch (error) {
        console.error("Failed to delete attendance:", error);
        alert("Failed to delete attendance");
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PRESENT: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      ABSENT: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      LATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      EXCUSED: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    };
    return colors[status?.toUpperCase()] || colors.PRESENT;
  };

  const displayData = filterClassId && filterDate ? filteredAttendance : allAttendance;

  if (isAttendanceLoading || isStudentsLoading || isClassesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Attendance Management
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90"
        >
          <Plus className="h-5 w-5" />
          Mark Attendance
        </button>
      </div>

      {/* Mark Attendance Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Mark Attendance"
      >
        <form onSubmit={handleRecordAttendance} className="space-y-4">
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
              {students.map((student: any) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Session
              </label>
              <select
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="excused">Excused</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
              Remark (Optional)
            </label>
            <textarea
              value={formData.remark}
              onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              placeholder="Any remarks..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90"
            >
              Mark Attendance
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

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Filter by Class
          </label>
          <select
            value={filterClassId}
            onChange={(e) => setFilterClassId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="">All Classes</option>
            {classes.map((cls: any) => (
              <option key={cls.id} value={cls.id}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Filter by Date
          </label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-gray-200 px-4 py-6 dark:border-gray-700 sm:px-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Attendance Records ({displayData.length})
          </h3>
        </div>
        <div className="p-4 sm:p-6">
          <DataTable<any>
            data={displayData}
            columns={[
              {
                key: "studentName",
                label: "Student",
              },
              {
                key: "className",
                label: "Class",
              },
              {
                key: "sessionDate",
                label: "Date",
                render: (date) => date ? new Date(date as string).toLocaleDateString() : "N/A",
              },
              {
                key: "sessionTimeSlot",
                label: "Session",
                render: (session) => session ? (session as string).charAt(0).toUpperCase() + (session as string).slice(1).toLowerCase() : "N/A",
              },
              {
                key: "status",
                label: "Status",
                render: (status) => (
                  <span
                    className={`inline-block rounded px-2.5 py-1 text-xs font-medium ${getStatusColor(status as string)}`}
                  >
                    {(status as string).charAt(0).toUpperCase() + (status as string).slice(1).toLowerCase()}
                  </span>
                ),
              },
              { key: "remark", label: "Remark" },
            ]}
            onDelete={handleDelete}
            emptyMessage="No attendance records found."
          />
        </div>
      </div>
    </div>
  );
}
