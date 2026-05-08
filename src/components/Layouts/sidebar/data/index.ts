import * as Icons from "../icons";

export interface NavItem {
  title: string;
  url?: string;
  icon?: any;
  items: { title: string; url: string }[];
  allowedRoles?: string[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Icons.Dashboard,
        items: [],
        allowedRoles: ["admin"],
      },
      {
        title: "Student",
        url: "/student",
        icon: Icons.Student,
        items: [],
        allowedRoles: ["admin", "teacher"],
      },
      {
        title: "Attendance",
        url: "/attendance",
        icon: Icons.Attendance,
        items: [],
        allowedRoles: ["admin", "teacher"],
      },
      {
        title: "Class",
        url: "/class",
        icon: Icons.Class,
        items: [],
        allowedRoles: ["admin"],
      },
      {
        title: "Blacklist",
        url: "/blacklist",
        icon: Icons.Blacklist,
        items: [],
        allowedRoles: ["admin", "teacher"],
      },
      {
        title: "Users",
        url: "/user",
        icon: Icons.User,
        items: [],
        allowedRoles: ["admin"],
      },
      {
        title: "Reports",
        url: "/report",
        icon: Icons.Reports,
        items: [],
        allowedRoles: ["admin", "teacher"],
      },
      {
        title: "Subjects",
        url: "/subject",
        icon: Icons.Class,
        items: [],
        allowedRoles: ["admin"],
      },
    ],
  }
];
