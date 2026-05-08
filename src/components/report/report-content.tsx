"use client";

import { useState, useMemo, useEffect } from "react";
import { Download, Printer, GraduationCap } from "lucide-react";
import { useGetStudentReportsQuery } from "@/redux/features/report/reportApi";
import { useGetClassesQuery } from "@/redux/features/class/classApi";
import { useAuth } from "@/context/auth-context";

export function ReportContent() {
  const { user } = useAuth();
  const [filterClassId, setFilterClassId] = useState<string>("");

  const { data: classes = [], isLoading: isClassesLoading } = useGetClassesQuery();

  // Compute classes available to this user
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

  // Auto-select first class for teacher when classes load
  useEffect(() => {
    if (user?.role === "teacher" && filteredClasses.length > 0 && !filterClassId) {
      setFilterClassId(filteredClasses[0].id.toString());
    }
  }, [user, filteredClasses, filterClassId]);

  // Build classId param to send to the API
  const queryClassId = useMemo(() => {
    if (filterClassId && filterClassId !== "all") return filterClassId;
    return undefined;
  }, [filterClassId]);

  const {
    data: reports = [],
    isLoading: isReportsLoading,
    isFetching,
  } = useGetStudentReportsQuery({ classId: queryClassId });

  const selectedClassName = useMemo(() => {
    if (!filterClassId || filterClassId === "all") return null;
    const cls = filteredClasses.find((c: any) => c.id.toString() === filterClassId);
    return cls ? cls.className : null;
  }, [filterClassId, filteredClasses]);

  const summary = useMemo(() => {
    if (reports.length === 0) return null;
    return {
      present: reports.reduce((acc: number, curr: any) => acc + (curr.present || 0), 0),
      absent: reports.reduce((acc: number, curr: any) => acc + (curr.absent || 0), 0),
      late: reports.reduce((acc: number, curr: any) => acc + (curr.late || 0), 0),
      permission: reports.reduce((acc: number, curr: any) => acc + (curr.permission || 0), 0),
      total: reports.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0),
      avgPercentage:
        reports.length > 0
          ? Math.round(
              (reports.reduce((acc: number, curr: any) => acc + (curr.percentage || 0), 0) /
                reports.length) *
                100
            ) / 100
          : 0,
    };
  }, [reports]);

  const handleExportCSV = () => {
    if (reports.length === 0) return;
    const headers = ["Student Name", "Class", "Present", "Absent", "Late", "Permission", "Total", "Attendance %"];
    const csvContent = [
      headers.join(","),
      ...reports.map((r: any) =>
        `"${r.studentName}","${r.className}",${r.present},${r.absent},${r.late},${r.permission},${r.total},"${r.percentage}%"`
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute(
      "download",
      `attendance_report_${selectedClassName?.replace(/\s+/g, "_") || "all"}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isLoading = isClassesLoading || isReportsLoading || isFetching;
  const showClassCol = (!filterClassId || filterClassId === "all") && user?.role === "admin";

  return (
    /* ── Outer wrapper — matches AttendanceTable outer card ── */
    <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
      <div className="p-4 sm:p-6 lg:p-8">

        {/* ── Page Header ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Attendance Reports
              {selectedClassName && (
                <span className="ml-2 text-lg font-medium text-primary">
                  — {selectedClassName}
                </span>
              )}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {reports.length} student{reports.length !== 1 ? "s" : ""} in report
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm font-medium text-black transition hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
            >
              <Printer className="h-5 w-5" />
              Print / PDF
            </button>
            <button
              onClick={handleExportCSV}
              disabled={reports.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total Records", value: summary?.total ?? 0, color: "text-black dark:text-white" },
            { label: "Students",      value: reports.length,       color: "text-black dark:text-white" },
            { label: "Avg Attendance",value: `${summary?.avgPercentage ?? 0}%`, color: "text-green-600 dark:text-green-400" },
            { label: "Total Absent",  value: summary?.absent ?? 0, color: "text-red-600 dark:text-red-400" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="rounded-xl border border-stroke bg-gray-50 px-4 py-5 dark:border-strokedark dark:bg-meta-4"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {label}
              </p>
              <p className={`mt-2 text-3xl font-bold ${color}`}>
                {isLoading ? "—" : value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Filter Row: Class Selector + Summary Stats ── */}
        <div className="mb-6 rounded-xl border border-stroke bg-gray-50 px-4 py-4 dark:border-strokedark dark:bg-meta-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-center gap-6">

            {/* Select Class */}
            <div className="min-w-[280px] flex-shrink-0" style={{ flexBasis: "40%", maxWidth: "40%" }}>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-black dark:text-white">
                <GraduationCap className="h-4 w-4 text-primary" />
                Select Class
              </label>
              <select
                value={filterClassId}
                onChange={(e) => setFilterClassId(e.target.value)}
                className="w-full rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary dark:border-strokedark dark:bg-boxdark dark:text-white"
              >
                {user?.role === "admin" && (
                  <option value="all">All Classes</option>
                )}
                {filteredClasses.length === 0 ? (
                  <option value="" disabled>No classes assigned</option>
                ) : (
                  filteredClasses.map((cls: any) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.className}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Summary Stats — same border & height as select */}
            {summary && (
              <div className="flex flex-col">
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Summary
                </label>
                <div className="flex flex-wrap items-center gap-5 rounded-lg border border-stroke bg-white px-4 py-2.5 text-sm dark:border-strokedark dark:bg-boxdark">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Present: <strong className="text-black dark:text-white">{summary.present}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Absent: <strong className="text-black dark:text-white">{summary.absent}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Late: <strong className="text-black dark:text-white">{summary.late}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Permission: <strong className="text-black dark:text-white">{summary.permission}</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Reports Table ── */}
        <div className="relative overflow-x-auto rounded-xl border border-stroke dark:border-strokedark">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center bg-white dark:bg-boxdark">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            </div>
          ) : filteredClasses.length === 0 ? (
            <p className="bg-white py-10 text-center text-sm text-gray-500 dark:bg-boxdark dark:text-gray-400">
              No classes assigned to your account.
            </p>
          ) : reports.length === 0 ? (
            <p className="bg-white py-10 text-center text-sm text-gray-500 dark:bg-boxdark dark:text-gray-400">
              No attendance records found for this class.
            </p>
          ) : (
            <table className="w-full table-auto text-left text-sm">
              <thead className="bg-gray-50 dark:bg-meta-4">
                <tr>
                  <th className="border-b border-stroke px-4 py-3 font-semibold text-black dark:border-strokedark dark:text-white">
                    #
                  </th>
                  <th className="border-b border-stroke px-4 py-3 font-semibold text-black dark:border-strokedark dark:text-white">
                    Student Name
                  </th>
                  {showClassCol && (
                    <th className="border-b border-stroke px-4 py-3 font-semibold text-black dark:border-strokedark dark:text-white">
                      Class
                    </th>
                  )}
                  <th className="border-b border-stroke px-4 py-3 text-center font-semibold text-green-700 dark:border-strokedark dark:text-green-400">
                    Present
                  </th>
                  <th className="border-b border-stroke px-4 py-3 text-center font-semibold text-red-700 dark:border-strokedark dark:text-red-400">
                    Absent
                  </th>
                  <th className="border-b border-stroke px-4 py-3 text-center font-semibold text-yellow-600 dark:border-strokedark dark:text-yellow-400">
                    Late
                  </th>
                  <th className="border-b border-stroke px-4 py-3 text-center font-semibold text-orange-600 dark:border-strokedark dark:text-orange-400">
                    Permission
                  </th>
                  <th className="border-b border-stroke px-4 py-3 text-center font-semibold text-black dark:border-strokedark dark:text-white">
                    Total
                  </th>
                  <th className="border-b border-stroke px-4 py-3 text-center font-semibold text-black dark:border-strokedark dark:text-white">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report: any, idx: number) => (
                  <tr
                    key={report.studentId ?? idx}
                    className="border-b border-stroke bg-white transition-colors last:border-none hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-meta-4/50"
                  >
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-black dark:text-white">
                      {report.studentName}
                    </td>
                    {showClassCol && (
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {report.className}
                      </td>
                    )}
                    <td className="px-4 py-3 text-center font-semibold text-green-600 dark:text-green-400">
                      {report.present}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-red-600 dark:text-red-400">
                      {report.absent}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-yellow-600 dark:text-yellow-400">
                      {report.late}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-orange-500 dark:text-orange-400">
                      {report.permission}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-black dark:text-white">
                      {report.total}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block min-w-[56px] rounded-full px-2.5 py-1 text-xs font-bold ${
                          report.percentage >= 80
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : report.percentage >= 60
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
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
