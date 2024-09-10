"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function AdminHeader() {
  const router = useRouter();

  const handleCreate = () => router.push(`/admin/create`);

  return (
    <div className="flex flex-row justify-between items-center w-full">
      <p>Admin</p>
      <Button onClick={handleCreate}>Add Dealer</Button>
    </div>
  );
}