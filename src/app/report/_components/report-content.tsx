"use client";

import {
  attendanceStorage,
  studentStorage,
  classStorage,
  Student,
} from "@/lib/storage";
import { useState, useEffect } from "react";
import { Download, Printer } from "lucide-react";

interface ReportData {
  studentName: string;
  rollNumber: string;
  className: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}

export function ReportContent() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [filterClassId, setFilterClassId] = useState("");
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const students = studentStorage.getAll();
    const attendance = attendanceStorage.getAll();
    const classesData = classStorage.getAll();
    setClasses(classesData);

    const reportData = students.map((student: Student) => {
      const studentAttendance = attendance.filter(
        (a) => a.studentId === student.id
      );

      const counts = {
        total: studentAttendance.length,
        present: studentAttendance.filter((a) => a.status === "present").length,
        absent: studentAttendance.filter((a) => a.status === "absent").length,
        late: studentAttendance.filter((a) => a.status === "late").length,
        excused: studentAttendance.filter((a) => a.status === "excused").length,
      };

      const percentage =
        counts.total > 0
          ? Math.round(((counts.present + counts.late) / counts.total) * 100)
          : 0;

      return {
        studentName: student.name,
        rollNumber: student.rollNumber,
        className:
          classesData.find((c) => c.id === student.classId)?.name || "N/A",
        ...counts,
        percentage,
      };
    });

    setReports(reportData);
  };

  const getClassSummary = (classId: string) => {
    const students = studentStorage.getByClass(classId);
    const attendance = attendanceStorage.getByClass(classId);

    if (students.length === 0) return null;

    const counts = {
      present: attendance.filter((a) => a.status === "present").length,
      absent: attendance.filter((a) => a.status === "absent").length,
      late: attendance.filter((a) => a.status === "late").length,
      excused: attendance.filter((a) => a.status === "excused").length,
      total: attendance.length,
    };

    return counts;
  };

  const filteredReports = filterClassId
    ? reports.filter((r) => r.className === classStorage.getById(filterClassId)?.name)
    : reports;

  const overallStats = {
    totalRecords: attendanceStorage.getAll().length,
    totalStudents: studentStorage.getAll().length,
    totalClasses: classes.length,
  };

  const handleExportCSV = () => {
    if (filteredReports.length === 0) return;
    
    const headers = ["Student Name", "Roll Number", "Class", "Present", "Absent", "Late", "Excused", "Percentage"];
    const csvContent = [
      headers.join(","),
      ...filteredReports.map(r => 
        `"${r.studentName}","${r.rollNumber}","${r.className}",${r.present},${r.absent},${r.late},${r.excused},"${r.percentage}%"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Attendance Reports
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            <Printer className="h-5 w-5" />
            Print / PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-opacity-90"
          >
            <Download className="h-5 w-5" />
            Export Excel (CSV)
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="px-4 py-6 sm:px-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Records
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {overallStats.totalRecords}
            </p>
          </div>
        </div>

        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="px-4 py-6 sm:px-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Students
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {overallStats.totalStudents}
            </p>
          </div>
        </div>

        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="px-4 py-6 sm:px-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Classes
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {overallStats.totalClasses}
            </p>
          </div>
        </div>
      </div>

      {/* Class Filter */}
      <div className="max-w-sm">
        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
          Filter by Class
        </label>
        <select
          value={filterClassId}
          onChange={(e) => setFilterClassId(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>
      </div>

      {/* Class Summary */}
      {filterClassId && getClassSummary(filterClassId) && (
        <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-gray-200 px-4 py-6 dark:border-gray-700 sm:px-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {classStorage.getById(filterClassId)?.name} - Summary
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-5 sm:p-6">
            {(() => {
              const summary = getClassSummary(filterClassId);
              return (
                <>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Present
                    </p>
                    <p className="mt-1 text-2xl font-bold text-green-600">
                      {summary?.present}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Absent
                    </p>
                    <p className="mt-1 text-2xl font-bold text-red-600">
                      {summary?.absent}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Late
                    </p>
                    <p className="mt-1 text-2xl font-bold text-yellow-600">
                      {summary?.late}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Excused
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-600">
                      {summary?.excused}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Total
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                      {summary?.total}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Reports Table */}
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-gray-200 px-4 py-6 dark:border-gray-700 sm:px-6">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Student Reports ({filteredReports.length})
          </h3>
        </div>
        <div className="overflow-x-auto p-4 sm:p-6">
          {filteredReports.length === 0 ? (
            <p className="text-center text-gray-500">No records found</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    Student Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    Roll Number
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">
                    Class
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                    Present
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                    Absent
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                    Late
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                    Excused
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-700 dark:text-gray-300">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {report.studentName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {report.rollNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {report.className}
                    </td>
                    <td className="px-4 py-3 text-center text-green-600 font-medium">
                      {report.present}
                    </td>
                    <td className="px-4 py-3 text-center text-red-600 font-medium">
                      {report.absent}
                    </td>
                    <td className="px-4 py-3 text-center text-yellow-600 font-medium">
                      {report.late}
                    </td>
                    <td className="px-4 py-3 text-center text-blue-600 font-medium">
                      {report.excused}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded px-2.5 py-1 text-xs font-medium ${
                          report.percentage >= 80
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : report.percentage >= 60
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {report.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
