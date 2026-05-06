import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { UserContent } from "./_components/user-content";

export const metadata = {
  title: "Users",
};

export default function UserPage() {
  return (
    <>
      <Breadcrumb pageName="Users" />
      <UserContent />
    </>
  );
}
