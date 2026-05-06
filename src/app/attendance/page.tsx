import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { AttendanceContent } from "./_components/attendance-content";

export const metadata = {
  title: "Attendance",
};

export default function AttendancePage() {
  return (
    <>
      <Breadcrumb pageName="Attendance" />
      <AttendanceContent />
    </>
  );
}
