"use client";

import React from "react";
import { StudentAttendance, AttendanceStatus } from "./AttendanceTable";
import { AttendanceCell } from "./AttendanceCell";

interface AttendanceRowProps {
  student: StudentAttendance;
  index: number;
  daysInMonth: number;
  currentYear: number;
  currentMonth: number;
  onCellClick?: (studentId: string, day: number, currentStatus: AttendanceStatus) => void;
}

export function AttendanceRow({ 
  student, 
  index, 
  daysInMonth, 
  currentYear, 
  currentMonth, 
  onCellClick 
}: AttendanceRowProps) {
  // Generate an array of days [1, 2, 3, ..., daysInMonth]
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <tr className="border-b border-stroke last:border-none hover:bg-gray-50 dark:border-strokedark dark:hover:bg-meta-4/50 transition-colors">
      {/* Sticky Column: No. */}
      <td className="sticky left-0 z-10 bg-white dark:bg-boxdark px-4 py-3 text-sm font-medium text-black dark:text-white border-r border-stroke dark:border-strokedark">
        {index + 1}
      </td>
      
      {/* Sticky Column: Name */}
      <td className="sticky left-[52px] z-10 bg-white dark:bg-boxdark px-4 py-3 text-sm font-medium text-black dark:text-white whitespace-nowrap min-w-[200px] border-r border-stroke dark:border-strokedark shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
        {student.name}
      </td>

      {/* Dynamic Day Columns */}
      {days.map((day) => {
        const status = student.attendance[day] || "None";
        
        // Check if the date is in the future
        const cellDate = new Date(currentYear, currentMonth, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isFuture = cellDate > today;

        return (
          <td key={day} className="min-w-[48px] px-1 py-2 text-center">
            <AttendanceCell
              day={day}
              status={status}
              disabled={isFuture}
              onClick={() => onCellClick?.(student.id, day, status)}
            />
          </td>
        );
      })}
    </tr>
  );
}
