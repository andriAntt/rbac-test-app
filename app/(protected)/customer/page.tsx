import CustomerInfo from "@/components/customer-info";

export default async function ProtectedPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      Customer Dashboard

      <CustomerInfo />
    </div>
  );
}
