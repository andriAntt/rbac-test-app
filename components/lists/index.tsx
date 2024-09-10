"use client";

import { useContext, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { EntityContextProviderType } from "@/lib/types/user";
import Dialog from "@/components/dialog";

type Props = {
  context: React.Context<EntityContextProviderType | undefined>;
};

export default function EntitiesList({ context }: Props) {
  const router = useRouter();

  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const contextData = useContext(context);

  if (!contextData) {
    return null;
  }

  const { entities, entityType, deleteEntity } = contextData;

  const handleEdit = (id: string) => () => router.push(`/${entityType}/edit/${id}`);

  const handleDelete = async () => {
    try {
      if (!selectedEntity) return;

      await deleteEntity(selectedEntity);
    } catch (err) {
      console.log(err);
    } finally {
      setSelectedEntity(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-center w-full mt-12">
        {entities?.map(entity => <div key={entity?.id} className="flex flex-row justify-between items-center w-full">
          <p>{entity?.email}</p>
          <div className="flex flex-row gap-2">
            <Button onClick={handleEdit(entity?.id)}>Edit</Button>

            <Button onClick={() => setSelectedEntity(entity?.id)}>Delete</Button>
          </div>
        </div>)}
      </div>

      <Dialog
        title='Delete'
        isOpen={!!selectedEntity}
        onClose={() => setSelectedEntity(null)}
        onOk={handleDelete}
      >
        <p>
          {`Are you sure you want to delete selected entity ${entities.find(entity => entity.id === selectedEntity)?.email}?`}
        </p>
      </Dialog>
    </>
  );
}
