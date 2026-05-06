"use client";

import React from "react";
import { Download, Calendar } from "lucide-react";

interface AttendanceToolbarProps {
  currentMonth: Date;
  onMonthChange?: (date: Date) => void;
  onExport?: () => void;
}

export function AttendanceToolbar({
  currentMonth,
  onMonthChange,
  onExport,
}: AttendanceToolbarProps) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (onMonthChange) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
      onMonthChange(newDate);
    }
  };

  const handleNextMonth = () => {
    if (onMonthChange) {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
      onMonthChange(newDate);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h2 className="text-2xl font-bold text-black dark:text-white">
        Attendance
      </h2>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Month/Date Selector */}
        <div className="flex items-center rounded-lg border border-stroke bg-white px-2 py-1.5 dark:border-strokedark dark:bg-boxdark">
          <button 
            onClick={handlePrevMonth}
            className="px-2 py-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors rounded hover:bg-gray-100 dark:hover:bg-meta-4"
          >
            &lt;
          </button>
          <div className="flex items-center gap-2 px-3 font-medium text-black dark:text-white min-w-[140px] justify-center">
            <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
            <span>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
          </div>
          <button 
            onClick={handleNextMonth}
            className="px-2 py-1 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors rounded hover:bg-gray-100 dark:hover:bg-meta-4"
          >
            &gt;
          </button>
        </div>

        {/* Export Button */}
        <button 
          onClick={onExport}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90 transition-colors shadow-sm"
        >
          <Download size={18} />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
}
