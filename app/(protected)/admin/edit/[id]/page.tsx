import { AdminContext } from "@/contexts/admin";
import EditEntityFormWrapper from "@/components/edit-entity-form-wrapper";

export default async function Page() {
  return <EditEntityFormWrapper context={AdminContext} />;
}