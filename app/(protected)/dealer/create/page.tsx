import { DealerContext } from "@/contexts/dealer";
import CreateEntity from "@/components/create-entity-form";

export default async function Page() {
  return <CreateEntity context={DealerContext} />;
}
