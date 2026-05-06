import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { BlacklistContent } from "./_components/blacklist-content";

export const metadata = {
  title: "Blacklist",
};

export default function BlacklistPage() {
  return (
    <>
      <Breadcrumb pageName="Blacklist" />
      <BlacklistContent />
    </>
  );
}
