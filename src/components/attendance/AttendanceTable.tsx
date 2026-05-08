"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import { AttendanceToolbar } from "./AttendanceToolbar";
import { AttendanceRow } from "./AttendanceRow";
import {
  useGetAttendanceQuery,
  useRecordAttendanceMutation,
  useDeleteAttendanceMutation,
} from "@/redux/features/attendance/attendanceApi";
import { useGetStudentsQuery } from "@/redux/features/student/studentApi";
import { useGetClassesQuery } from "@/redux/features/class/classApi";
import { Modal } from "@/components/Modal";
import { Check, X, FileText, Clock } from "lucide-react";

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Permission" | "None";

export interface StudentAttendance {
  id: string;
  name: string;
  // Key represents the day of the month (1-31), value is the status
  attendance: Record<number, AttendanceStatus>;
  // Track attendance record IDs for deletion: key is day number
  recordIds: Record<number, number>;
}

export function AttendanceTable() {
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // State for the cell update modal
  const [selectedCell, setSelectedCell] = useState<{
    studentId: string;
    studentName: string;
    day: number;
    currentStatus: AttendanceStatus;
    existingRecordId?: number;
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Local overrides for optimistic UI updates: key is "studentId-day"
  const [localOverrides, setLocalOverrides] = useState<Record<string, AttendanceStatus>>({});

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { user } = useAuth();
  const { data: allAttendance = [], isLoading: isAttendanceLoading } = useGetAttendanceQuery();
  const [recordAttendance] = useRecordAttendanceMutation();
  const [deleteAttendance] = useDeleteAttendanceMutation();
  const { data: allStudents = [], isLoading: isStudentsLoading } = useGetStudentsQuery();
  const { data: classes = [], isLoading: isClassesLoading } = useGetClassesQuery();

  const filteredClasses = useMemo(() => {
    if (!user) return [];
    if (user.role === "admin") return classes;
    if (user.role === "teacher") {
      return classes.filter((cls: any) =>
        cls.teachers?.some((t: any) => t.id.toString() === user.id.toString())
      );
    }
    return [];
  }, [classes, user]);

  React.useEffect(() => {
    if (filteredClasses.length > 0 && !selectedClassId) {
      setSelectedClassId(filteredClasses[0].id.toString());
    }
  }, [filteredClasses, selectedClassId]);

  const isLoading = isAttendanceLoading || isStudentsLoading || isClassesLoading;

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Generate an array of days [1, 2, 3, ..., daysInMonth]
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get day of week (e.g., "M", "T", "W") for a specific date
  const getDayOfWeek = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
    return dayNames[date.getDay()];
  };

  const mapStatus = (statusStr: string): AttendanceStatus => {
    switch (statusStr?.toUpperCase()) {
      case "PRESENT": return "Present";
      case "ABSENT": return "Absent";
      case "LATE": return "Late";
      case "PERMISSION": return "Permission";
      default: return "None";
    }
  };

  const handleUpdateStatus = async (status: AttendanceStatus) => {
    if (!selectedCell) return;

    // Validation: Cannot update future attendance
    const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedCell.day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (cellDate > today) {
      alert("Cannot update attendance for future dates.");
      setSelectedCell(null);
      return;
    }

    // Ensure we have a classId
    const student = allStudents.find((s: any) => s.id.toString() === selectedCell.studentId.toString());
    const classId = selectedClassId || student?.classId;

    if (!classId) {
      alert("Please select a class to record attendance.");
      setSelectedCell(null);
      return;
    }

    setIsUpdating(true);

    // Optimistic Update
    const overrideKey = `${selectedCell.studentId}-${selectedCell.day}`;
    setLocalOverrides(prev => ({ ...prev, [overrideKey]: status }));

    try {
      // "None" / Clear Status: delete the existing record if it exists
      if (status === "None") {
        if (selectedCell.existingRecordId) {
          await deleteAttendance(selectedCell.existingRecordId).unwrap();
        }
        // If no existing record, nothing to do
      } else {
        let apiStatus = "PRESENT";
        if (status === "Absent") apiStatus = "ABSENT";
        else if (status === "Late") apiStatus = "LATE";
        else if (status === "Permission") apiStatus = "PERMISSION";

        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = selectedCell.day.toString().padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        await recordAttendance({
          studentId: Number(selectedCell.studentId),
          classId: Number(classId),
          date: dateString,
          status: apiStatus,
          timeSlot: "08:00 - 10:00", // Default time slot
          recordedById: user?.id ? Number(user.id) : null,
          remark: "",
        }).unwrap();
      }
    } catch (err: any) {
      console.error("Failed to update attendance:", err);
      const errorMessage = err?.data?.message || err?.message || "Unknown error";
      // Revert optimistic update on failure
      setLocalOverrides(prev => {
        const next = { ...prev };
        delete next[overrideKey];
        return next;
      });
      alert(`Failed to update attendance: ${errorMessage}`);
    } finally {
      setIsUpdating(false);
      setSelectedCell(null);
    }
  };

  const students = useMemo(() => {
    if (isLoading) return [];

    // Filter students by class if a class is selected
    const filteredStudents = selectedClassId
      ? allStudents.filter((s: any) => s.classId?.toString() === selectedClassId.toString())
      : allStudents;

    return filteredStudents.map((student: any) => {
      const attendanceRecord: Record<number, AttendanceStatus> = {};
      const recordIds: Record<number, number> = {};

      // Filter attendance records for this student and this month/year
      const studentRecords = Array.isArray(allAttendance)
        ? allAttendance.filter((record: any) => {
            if (!record || record.studentId?.toString() !== student.id?.toString()) return false;

            // Use sessionDate (field from AttendanceResponse DTO)
            const dateStr = record.sessionDate;
            if (!dateStr || typeof dateStr !== "string") return false;

            const parts = dateStr.split("-");
            if (parts.length < 3) return false;

            const y = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10);

            return (
              y === currentDate.getFullYear() &&
              m - 1 === currentDate.getMonth()
            );
          })
        : [];

      studentRecords.forEach((record: any) => {
        const dateStr = record.sessionDate;
        const parts = dateStr.split("-");
        const d = parseInt(parts[2], 10);
        if (!isNaN(d)) {
          attendanceRecord[d] = mapStatus(record.status);
          // Store the attendance record ID for deletion support
          if (record.id) {
            recordIds[d] = record.id;
          }
        }
      });

      // Apply optimistic overrides
      for (let d = 1; d <= daysInMonth; d++) {
        const overrideKey = `${student.id}-${d}`;
        if (localOverrides[overrideKey]) {
          attendanceRecord[d] = localOverrides[overrideKey];
        }
      }

      return {
        id: student.id,
        name: student.name,
        attendance: attendanceRecord,
        recordIds,
      };
    });
  }, [allStudents, allAttendance, selectedClassId, currentDate, isLoading, localOverrides, daysInMonth]);

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark sm:p-6 lg:p-8">
        <div className="flex h-64 items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (!students || students.length === 0) {
      alert("No data to export.");
      return;
    }

    // Header row
    const headers = ["Student Name", ...days.map(d => `${d} ${currentDate.toLocaleString("default", { month: "short" })}`)];
    
    // Data rows
    const rows = students.map((student: any) => {
      const row = [student.name];
      days.forEach(d => {
        const status = student.attendance[d];
        row.push(!status || status === "None" ? "-" : status);
      });
      return row;
    });

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    const selectedClassObj = classes.find((c: any) => c.id.toString() === selectedClassId?.toString());
    const className = selectedClassObj ? selectedClassObj.className : "all_classes";
    const monthYear = `${currentDate.toLocaleString("default", { month: "short" })}_${currentDate.getFullYear()}`;
    link.setAttribute("download", `attendance_${className.replace(/\s+/g, "_")}_${monthYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark sm:p-6 lg:p-8">
      {/* Status Update Modal */}
      <Modal
        isOpen={!!selectedCell}
        onClose={() => !isUpdating && setSelectedCell(null)}
        title={selectedCell ? `Update Attendance` : ""}
        size="sm"
      >
        {selectedCell && (
          <div className="space-y-4">
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              <p>Student: <span className="font-semibold text-black dark:text-white">{selectedCell.studentName}</span></p>
              <p>Date: <span className="font-semibold text-black dark:text-white">{getDayOfWeek(selectedCell.day)}, {selectedCell.day} {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</span></p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleUpdateStatus("Present")}
                disabled={isUpdating}
                className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100 disabled:opacity-50 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              >
                <Check size={18} />
                Present
              </button>
              <button
                onClick={() => handleUpdateStatus("Absent")}
                disabled={isUpdating}
                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                <X size={18} />
                Absent
              </button>
              <button
                onClick={() => handleUpdateStatus("Permission")}
                disabled={isUpdating}
                className="flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:opacity-50 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50"
              >
                <FileText size={18} />
                Permission
              </button>
              <button
                onClick={() => handleUpdateStatus("Late")}
                disabled={isUpdating}
                className="flex items-center justify-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 py-3 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100 disabled:opacity-50 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
              >
                <Clock size={18} />
                Late
              </button>
              <button
                onClick={() => handleUpdateStatus("None")}
                disabled={isUpdating || !selectedCell.existingRecordId}
                className="col-span-2 flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                {isUpdating ? "Updating..." : "Clear Status (Delete Record)"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Toolbar */}
      <AttendanceToolbar
        currentMonth={currentDate}
        onMonthChange={setCurrentDate}
        onExport={handleExportCSV}
      />

      {/* Class Selector and Legend */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-black dark:text-white">Class:</label>
          {filteredClasses.length === 0 ? (
            <span className="text-sm text-gray-500">No classes assigned</span>
          ) : (
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="rounded-lg border border-stroke bg-transparent px-4 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4"
            >
              {filteredClasses.map((cls: any) => (
                <option key={cls.id} value={cls.id}>
                  {cls.className}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800"></div>
            <span className="text-gray-600 dark:text-gray-300">Present</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800"></div>
            <span className="text-gray-600 dark:text-gray-300">Absent</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded bg-yellow-100 border border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800"></div>
            <span className="text-gray-600 dark:text-gray-300">Late</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-4 w-4 rounded bg-orange-100 border border-orange-200 dark:bg-orange-900/30 dark:border-orange-800"></div>
            <span className="text-gray-600 dark:text-gray-300">Permission</span>
          </div>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="relative overflow-x-auto rounded-xl border border-stroke dark:border-strokedark custom-scrollbar pb-2">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-50 dark:bg-meta-4">
            <tr>
              {/* Sticky Header: No. */}
              <th className="sticky left-0 top-0 z-20 min-w-[50px] bg-gray-50 px-4 py-3 text-sm font-semibold text-black dark:bg-meta-4 dark:text-white border-b border-r border-stroke dark:border-strokedark">
                No
              </th>
              {/* Sticky Header: Student Name */}
              <th className="sticky left-[52px] top-0 z-20 min-w-[200px] bg-gray-50 px-4 py-3 text-sm font-semibold text-black dark:bg-meta-4 dark:text-white whitespace-nowrap border-b border-r border-stroke dark:border-strokedark shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Student Name
              </th>

              {/* Dynamic Day Headers */}
              {days.map((day) => (
                <th key={day} className="min-w-[48px] px-1 py-2 border-b border-stroke dark:border-strokedark">
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {getDayOfWeek(day)}
                    </span>
                    <span className="text-sm font-semibold text-black dark:text-white">
                      {day}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="border-b border-stroke dark:border-strokedark last:border-none animate-pulse">
                  <td className="sticky left-0 z-10 bg-white dark:bg-boxdark px-4 py-4 border-r border-stroke dark:border-strokedark">
                    <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </td>
                  <td className="sticky left-[52px] z-10 bg-white dark:bg-boxdark px-4 py-4 border-r border-stroke dark:border-strokedark shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
                  </td>
                  {days.map((d) => (
                    <td key={d} className="px-1 py-2 text-center">
                      <div className="mx-auto h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : students.length > 0 ? (
              // Actual Data
              students.map((student, idx) => (
                <AttendanceRow
                  key={student.id}
                  student={student}
                  index={idx}
                  daysInMonth={daysInMonth}
                  currentYear={currentDate.getFullYear()}
                  currentMonth={currentDate.getMonth()}
                  onCellClick={(id, day, status) => {
                    const existingRecordId = student.recordIds?.[day];
                    setSelectedCell({
                      studentId: id,
                      studentName: student.name,
                      day,
                      currentStatus: status,
                      existingRecordId,
                    });
                  }}
                />
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan={daysInMonth + 2} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {filteredClasses.length === 0
                    ? "No classes assigned to your account."
                    : "No students or records found for this selection."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 4px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #475569;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
