import { DealerContext } from "@/contexts/dealer";
import EntitiesList from "@/components/lists";

export default async function Page() {
  return <EntitiesList context={DealerContext} />;
}
