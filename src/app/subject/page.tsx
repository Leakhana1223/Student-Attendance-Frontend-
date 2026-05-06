import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { SubjectContent } from "./_components/subject-content";

export const metadata = {
  title: "Subjects",
};

export default function SubjectPage() {
  return (
    <>
      <Breadcrumb pageName="Subjects" />
      <SubjectContent />
    </>
  );
}
