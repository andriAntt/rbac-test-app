"use client";

import React, { createContext, useState, useEffect, type ReactNode } from "react";
import { useParams } from 'next/navigation';
import { UserRole } from "@/lib/types/user";
import { CreateEntityInput } from "@/schemas/create-entity";
import { EntityContextProviderType, EntityType } from "@/lib/types/user";

export const DealerContext = createContext<EntityContextProviderType | undefined>(undefined);

const DealerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entities, setEntities] = useState<EntityType[]>([]);
  const [currentEntity, setCurrentEntity] = useState<EntityType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();

  useEffect(() => {
    async function fetchEntities() {
      try {
        setError(null);

        const response = await fetch(`/api/dealer/get-list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          const errorMessage = `Error: ${response.status} ${response.statusText}`;
          setError(errorMessage);
          return;
        }
  
        const { data } = (await response.json()) as { data: EntityType[] };

        setEntities(data);
      } catch (err) {
        setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    fetchEntities();
  }, []);

  useEffect(() => {
    async function fetchEntities() {
      let response: Response | null = null;

      try {
        setError(null);
  
        response = await fetch(`/api/dealer/get-by-id/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!response.ok) {
          const { error } = await response.json();
  
          setError(error.message);
          return false;
        }
  
        const { data } = (await response.json()) as { data: EntityType };
  
        setCurrentEntity(data);
      } catch (err) {
        setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        return response ? response.ok : false;
      }
    }

    if (params.id) {
      fetchEntities();
    }

    return () => setCurrentEntity(null);
  }, [params.id]);


  const deleteEntity = async (id: string) => {
    let response: Response | null = null;

    try {
      setError(null);

      response = await fetch(`/api/dealer/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const { error } = await response.json();

        setError(error.message);
        return false;
      }

      const filteredEntities = entities.filter(entity => entity.id !== id);

      setEntities(filteredEntities);
    } catch (err) {
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      return response ? response.ok : false;
    }
  }

  const updateEntity = async (id: string, { email, name } : Partial<CreateEntityInput>) => {
    let response: Response | null = null;

    try {
      setError(null);

      const body = {
        ...(email && { email }),
        ...(name && { name }),
      };

      response = await fetch(`/api/dealer/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        const { error } = await response.json();

        setError(error.message);
        return false;
      }

      setEntities(prevState =>
        prevState.map((entity) =>
          entity.id === id ? { ...entity, ...(email && { email }), ...(name && { name }) } : entity
      ));
    } catch (err) {
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      return response ? response.ok : false;
    }
  }

  const createEntity = async ({ email, name }: CreateEntityInput) => {
    let response: Response | null = null;
    try {
      setError(null);

      response = await fetch(`/api/dealer/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });
  
      if (!response.ok) {
        const { error } = await response.json();

        setError(error.message);
        return false;
      }

      const { data } = (await response.json()) as { data: EntityType };

      setEntities(prevState => [ ...prevState, data ]);
    } catch (err) {
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      return response ? response.ok : false;
    }
  }

  return (
    <DealerContext.Provider
      value={{
        entityType: UserRole.DEALER,
        entities,
        currentEntity,
        deleteEntity,
        updateEntity,
        createEntity,
        error,
      }}
    >
      {children}
    </DealerContext.Provider>
  );
};

export default DealerProvider;
