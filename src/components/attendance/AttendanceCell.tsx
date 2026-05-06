"use client";

import React from "react";
import { AttendanceStatus } from "./AttendanceTable";
import { Check, X, Clock, FileText } from "lucide-react";

interface AttendanceCellProps {
  status: AttendanceStatus;
  day: number;
  onClick?: () => void;
  disabled?: boolean;
}

export function AttendanceCell({ status, day, onClick, disabled }: AttendanceCellProps) {
  const getStyles = () => {
    if (disabled) {
      return "bg-gray-100/50 text-gray-300 dark:bg-gray-800/20 dark:text-gray-600 border-gray-100 dark:border-gray-800 cursor-not-allowed opacity-50";
    }
    switch (status) {
      case "Present":
        return "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 border-green-200 dark:border-green-800";
      case "Absent":
        return "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 border-red-200 dark:border-red-800";
      case "Late":
        return "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800";
      case "Permission":
        return "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800";
      default:
        return "bg-gray-50 text-gray-400 hover:bg-gray-100 dark:bg-gray-800/50 dark:text-gray-500 dark:hover:bg-gray-800 border-gray-100 dark:border-gray-700";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "Present":
        return <Check size={16} strokeWidth={3} />;
      case "Absent":
        return <X size={16} strokeWidth={3} />;
      case "Late":
        return <Clock size={16} strokeWidth={3} />;
      case "Permission":
        return <FileText size={16} strokeWidth={3} />;
      default:
        return <span className="text-xs font-medium">{day}</span>;
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-1">
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${!disabled ? 'active:scale-95' : ''} ${getStyles()}`}
        title={disabled ? "Future date" : `${day}: ${status}`}
      >
        {getIcon()}
      </button>
    </div>
  );
}
