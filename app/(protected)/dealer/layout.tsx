import DealerHeader from "@/components/headers/dealer";
import DealerProvider from "@/contexts/dealer";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DealerProvider>
      <div className="flex-1 w-full flex flex-col gap-12">
        <div className="flex flex-col gap-4 max-w-4xl">
          <DealerHeader />
          {children}
        </div>        
      </div>
    </DealerProvider>
  );
}
