import { AdminContext } from "@/contexts/admin";
import EntitiesList from "@/components/lists";

export default async function Page() {
  return <EntitiesList context={AdminContext} />;
}
