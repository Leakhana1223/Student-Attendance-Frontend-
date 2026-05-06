import "@/css/satoshi.css";
import "@/css/style.css";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { RootLayoutClient } from "./root-layout-client";

export const metadata: Metadata = {
  title: {
    template: "%s | Student Attendance System",
    default: "Student Attendance System",
  },
  description:
    "Complete Student Attendance Management System with real-time tracking and reporting.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
