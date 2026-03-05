import * as Icons from "../icons";

export const NAV_DATA = [
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
        title: "User ",
        url: "/user",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Report ",
        url: "/report",
        icon: Icons.Reports,
        items: [],
      },
      
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Basic Chart",
            url: "/charts/basic-chart",
          },
        ],
      },
      {
        title: "UI Elements",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Alerts",
            url: "/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
        ],
      },
    ],
  },
];
