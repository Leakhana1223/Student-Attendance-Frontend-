"use client";

import { DataTable } from "@/components/DataTable";
import { useState, useMemo } from "react";
import { Filter, ShieldAlert, GraduationCap } from "lucide-react";
import { 
  useGetBlacklistHistoryQuery,
  useRemoveFromBlacklistMutation 
} from "@/redux/features/blacklist/blacklistApi";
import { useGetStudentsQuery } from "@/redux/features/student/studentApi";
import { useGetClassesQuery } from "@/redux/features/class/classApi";
import { useAuth } from "@/context/auth-context";

export function BlacklistContent() {
  const { user } = useAuth();
  const [filterMonths, setFilterMonths] = useState<string>("3");
  const [selectedClassId, setSelectedClassId] = useState<string>("all");

  const { data: blacklistHistory = [], isLoading: isHistoryLoading } = useGetBlacklistHistoryQuery({
    months: filterMonths === "all" ? undefined : parseInt(filterMonths),
    classId: selectedClassId === "all" ? undefined : selectedClassId
  });
  const { data: students = [], isLoading: isStudentsLoading } = useGetStudentsQuery();
  const { data: classes = [], isLoading: isClassesLoading } = useGetClassesQuery();
  const [removeFromBlacklist] = useRemoveFromBlacklistMutation();

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

  const handleDelete = async (entry: any) => {
    if (confirm("Remove this blacklist history record?")) {
      try {
        await removeFromBlacklist(entry.id).unwrap();
      } catch (error) {
        console.error("Failed to remove:", error);
        alert("Failed to remove record");
      }
    }
  };

  const displayData = useMemo(() => {
    if (isHistoryLoading || isStudentsLoading || isClassesLoading) return [];

    // Group history by student to find latest record and counts
    const studentHistoryMap = new Map<string, any[]>();
    blacklistHistory.forEach((h: any) => {
      const sId = h.studentId?.toString();
      if (!studentHistoryMap.has(sId)) {
        studentHistoryMap.set(sId, []);
      }
      studentHistoryMap.get(sId)?.push(h);
    });

    // We want to show students who are either in the history for this period
    // OR who are currently blacklisted (if they fall into the class filter)
    
    // 1. Get IDs of students in history
    const historyStudentIds = Array.from(studentHistoryMap.keys());
    
    // 2. Get IDs of students who are currently blacklisted
    const currentlyBlacklistedIds = students
      .filter((s: any) => s.blacklisted)
      .filter((s: any) => {
        // Apply class filter if selected
        if (selectedClassId !== "all" && s.classId?.toString() !== selectedClassId) return false;
        // Apply teacher role filter
        if (user?.role === "teacher") {
          return filteredClasses.some((c: any) => c.id.toString() === s.classId?.toString());
        }
        return true;
      })
      .map((s: any) => s.id?.toString());

    // Merge IDs
    const allRelevantIds = Array.from(new Set([...historyStudentIds, ...currentlyBlacklistedIds]));

    return allRelevantIds
      .map((sId: string) => {
        const student = students.find((s: any) => s.id?.toString() === sId);
        if (!student) return null;

        const history = studentHistoryMap.get(sId) || [];
        const studentClass = classes.find((c: any) => c.id.toString() === student.classId?.toString());
        
        const latestHistory = [...history].sort((a: any, b: any) => 
          new Date(b.addedDate || b.createdAt).getTime() - new Date(a.addedDate || a.createdAt).getTime()
        )[0];

        return {
          id: student.id,
          studentName: student.name,
          className: studentClass?.className || "N/A",
          currentPoints: student.currentBlacklistPoints,
          blacklistCount: student.blacklistCount,
          lastBlacklistDate: latestHistory?.addedDate || latestHistory?.createdAt || student.lastBlacklistReset,
          status: student.blacklisted ? "Blacklisted" : "Active",
          isBlacklisted: student.blacklisted
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => (b.isBlacklisted ? 1 : 0) - (a.isBlacklisted ? 1 : 0)); // Show blacklisted first
  }, [students, classes, blacklistHistory, user, filteredClasses, selectedClassId, filterMonths, isHistoryLoading, isStudentsLoading, isClassesLoading]);

  if (isHistoryLoading || isStudentsLoading || isClassesLoading) {
    return (
      <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stroke bg-white shadow-sm dark:border-strokedark dark:bg-boxdark">
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header & Main Filters */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Blacklist Management
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and manage students with high absence points.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Class Filter */}
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-gray-400 dark:text-gray-500" />
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
              >
                <option value="all">All Classes</option>
                {filteredClasses.map((cls: any) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400 dark:text-gray-500" />
              <select
                value={filterMonths}
                onChange={(e) => setFilterMonths(e.target.value)}
                className="rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-black outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
              >
                <option value="1">Last 1 Month</option>
                <option value="3">Last 3 Months</option>
                <option value="6">Last 6 Months</option>
                <option value="12">Last 1 Year</option>
                <option value="all">All Time</option>
              </select>
            </div>
          </div>
        </div>

      {/* Warning Alert */}
      <div className="flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-400">
        <ShieldAlert size={24} />
        <div>
          <p className="font-medium">Automatic Enforcement Active</p>
          <p className="text-sm">Students are automatically blacklisted upon reaching 20 absence points.</p>
        </div>
      </div>

      {/* Table Section */}
      <div>
        <div className="border-b border-stroke pb-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">
            Students Found
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-meta-4 dark:text-gray-300">
              {displayData.length}
            </span>
          </h3>
        </div>

        <div className="pt-4">
          <DataTable<any>
            data={displayData}
            columns={[
              {
                key: "studentName",
                label: "Student Name",
                render: (name, item) => (
                  <div className="flex flex-col">
                    <span className="font-medium text-black dark:text-white">{name}</span>
                    <span className="text-xs text-gray-500">ID: {item.id}</span>
                  </div>
                )
              },
              {
                key: "className",
                label: "Class",
              },
              { 
                key: "currentPoints", 
                label: "Current Points",
                render: (points) => (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-strokedark">
                      <div
                        className={`h-full ${Number(points) >= 15 ? 'bg-red-500' : 'bg-yellow-500'}`}
                        style={{ width: `${Math.min((Number(points) / 20) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-black dark:text-white">{Number(points).toFixed(1)}</span>
                  </div>
                )
              },
              { 
                key: "blacklistCount", 
                label: "Blacklist Count",
                render: (count) => (
                  <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    {count} Times
                  </span>
                )
              },
              {
                key: "lastBlacklistDate",
                label: "Last Blacklist Date",
                render: (date) => date ? new Date(date as string).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : "No Records",
              },
              {
                key: "status",
                label: "Status",
                render: (status, item) => (
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    item.isBlacklisted ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {status}
                  </span>
                )
              },
            ]}
            onDelete={user?.role === "admin" ? handleDelete : undefined}
            emptyMessage="No students found matching the selected class and time period."
          />
        </div>
      </div>
      </div>
    </div>
  );
}
