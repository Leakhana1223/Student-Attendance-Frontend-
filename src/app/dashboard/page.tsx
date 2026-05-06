import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DashboardContent } from "./_components/dashboard-content";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <Breadcrumb pageName="Dashboard" />
      <DashboardContent />
    </>
  );
}
