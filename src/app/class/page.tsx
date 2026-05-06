import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ClassContent } from "./_components/class-content";

export const metadata = {
  title: "Classes",
};

export default function ClassPage() {
  return (
    <>
      <Breadcrumb pageName="Classes" />
      <ClassContent />
    </>
  );
}
