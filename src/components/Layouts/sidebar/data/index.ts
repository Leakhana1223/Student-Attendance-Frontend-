import * as Icons from "../icons";

export interface NavItem {
  title: string;
  url?: string;
  icon?: any;
  items: { title: string; url: string }[];
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
      },
      {
        title: "Student",
        url: "/student",
        icon: Icons.Student,
        items: [],
      },
      {
        title: "Attendance",
        url: "/attendance",
        icon: Icons.Attendance,
        items: [],
      },
      {
        title: "Class",
        url: "/class",
        icon: Icons.Class,
        items: [],
      },
      {
        title: "Blacklist",
        url: "/blacklist",
        icon: Icons.Blacklist,
        items: [],
      },
      {
        title: "Users",
        url: "/user",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Reports",
        url: "/report",
        icon: Icons.Reports,
        items: [],
      },
      {
        title: "Subjects",
        url: "/subject",
        icon: Icons.Class,
        items: [],
      },
    ],
  }
];
