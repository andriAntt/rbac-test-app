import { AdminContext } from "@/contexts/admin";
import CreateEntity from "@/components/create-entity-form";

export default async function Page() {
  return <CreateEntity context={AdminContext} />;
}