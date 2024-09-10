import { DealerContext } from "@/contexts/dealer";
import EditEntityFormWrapper from "@/components/edit-entity-form-wrapper";

export default async function Page() {
  return <EditEntityFormWrapper context={DealerContext} />;
}
