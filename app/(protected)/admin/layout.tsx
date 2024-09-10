import AdminHeader from "@/components/headers/admin";
import AdminProvider from "@/contexts/admin";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="flex-1 w-full flex flex-col gap-12">
        <div className="flex flex-col gap-4 max-w-4xl">
          <AdminHeader />
          {children}
        </div>        
      </div>
    </AdminProvider>
  );
}