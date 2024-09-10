"use client";

import { useState, useEffect } from "react";
import { EntityType } from "@/lib/types/user";
import NoData from "./no-data";


export default function CustomerInfo() {
  const [customerData, setCustomerData] = useState<EntityType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEntities() {
      try {
        setError(null);

        const response = await fetch(`/api/customer/get`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          const { data } = await response.json();

          setError(data.message);
          return;
        }
  
        const { data } = (await response.json()) as { data: EntityType };

        setCustomerData(data);
      } catch (err) {
        setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    fetchEntities();
  }, []);

  if (!customerData || error) return <NoData />

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2">
        <p className="w-20">Email:</p>

        <p>{customerData.email}</p>
      </div>

      <div className="flex flex-row gap-2">
        <p className="w-20">Name:</p>

        <p>{customerData.name}</p>
      </div>
    </div>
  );
}
