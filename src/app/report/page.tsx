import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ReportContent } from "./_components/report-content";

export const metadata = {
  title: "Reports",
};

export default function ReportPage() {
  return (
    <>
      <Breadcrumb pageName="Reports" />
      <ReportContent />
    </>
  );
}
