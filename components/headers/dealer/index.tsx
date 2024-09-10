"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function DealerHeader() {
  const router = useRouter();

  const handleCreate = () => router.push(`/dealer/create`);

  return (
    <div className="flex flex-row justify-between items-center w-full">
      <p>Dealer</p>
      <Button onClick={handleCreate}>Add Customer</Button>
    </div>
  );
}