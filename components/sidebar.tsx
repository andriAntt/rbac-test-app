"use client";

import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/types/user";

export default function Sidebar() {
  const pathname = usePathname();

  const router = useRouter();

  return (
    <div className="border-r border-solid w-[200px] py-4">
      <div className="flex flex-col gap-2 px-2">
        {
          pathname.startsWith(`/${UserRole.ADMIN}`) ?
            <Button onClick={() => router.push('/admin')}>Dealers</Button> :
            pathname.startsWith(`/${UserRole.DEALER}`) ?
              <Button onClick={() => router.push('/dealer')}>Customers</Button> :
              <Button onClick={() => router.push('/customer')}>Dashboard</Button>
        }
        <Button>Settings</Button>

        <Button>Users</Button>

        <Button>Plans</Button>
      </div>
    </div>
  );
}
