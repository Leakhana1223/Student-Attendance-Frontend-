"use client";

import { useAuth } from "@/context/auth-context";
import { attendanceStorage, classStorage, studentStorage } from "@/lib/storage";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, BookOpen, ClipboardList, FileText, UserCheck, Trash2 } from "lucide-react";

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  href: string;
}

export function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    const students = studentStorage.getAll();
    const classes = classStorage.getAll();
    const attendance = attendanceStorage.getAll();

    setStats([
      {
        title: "Total Students",
        value: students.length,
        icon: <Users className="h-8 w-8" />,
        color: "bg-blue-50 dark:bg-blue-900/20",
        href: "/student",
      },
      {
        title: "Total Classes",
        value: classes.length,
        icon: <BookOpen className="h-8 w-8" />,
        color: "bg-green-50 dark:bg-green-900/20",
        href: "/class",
      },
      {
        title: "Total Records",
        value: attendance.length,
        icon: <ClipboardList className="h-8 w-8" />,
        color: "bg-yellow-50 dark:bg-yellow-900/20",
        href: "/attendance",
      },
      {
        title: "Reports",
        value: classes.length > 0 ? attendance.length : 0,
        icon: <FileText className="h-8 w-8" />,
        color: "bg-purple-50 dark:bg-purple-900/20",
        href: "/report",
      },
    ]);
  }, []);

  const menuItems = [
    {
      title: "Students",
      description: "Manage student information",
      icon: <Users className="h-6 w-6" />,
      href: "/student",
      bg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    },
    {
      title: "Attendance",
      description: "Mark and track attendance",
      icon: <UserCheck className="h-6 w-6" />,
      href: "/attendance",
      bg: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    },
    {
      title: "Classes",
      description: "Manage classes",
      icon: <BookOpen className="h-6 w-6" />,
      href: "/class",
      bg: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
    },
    {
      title: "Reports",
      description: "View attendance reports",
      icon: <FileText className="h-6 w-6" />,
      href: "/report",
      bg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    },
    {
      title: "Blacklist",
      description: "Manage blacklist",
      icon: <Trash2 className="h-6 w-6" />,
      href: "/blacklist",
      bg: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Here's what's happening with your attendance system today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <div className="rounded-[10px] bg-white shadow-1 transition hover:shadow-2 dark:bg-gray-dark dark:shadow-card">
              <div className={`rounded-[10px] p-4 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="px-4 py-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-gray-200 px-4 py-6 dark:border-gray-700 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Quick Links
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-5 lg:p-6">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="rounded-lg border border-gray-200 p-4 transition hover:border-primary hover:shadow-md dark:border-gray-700 dark:hover:border-primary">
                <div className={`mb-3 inline-flex rounded-lg p-2 ${item.bg}`}>
                  {item.icon}
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="border-b border-gray-200 px-4 py-6 dark:border-gray-700 sm:px-6 lg:px-8">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            System Information
          </h3>
        </div>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Logged in as
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Role
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {user?.role}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Session
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                Active
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Last Login
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                Now
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
