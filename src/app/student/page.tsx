import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { StudentContent } from "./_components/student-content";

export const metadata = {
  title: "Students",
};

export default function StudentPage() {
  return (
    <>
      <Breadcrumb pageName="Students" />
      <StudentContent />
    </>
  );
}
