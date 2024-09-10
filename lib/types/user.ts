import { Database } from "@/lib/types/supabase";
import { CreateEntityInput } from "@/schemas/create-entity";

export enum UserRole {
  ADMIN = 'admin',
  DEALER = 'dealer',
  CUSTOMER = 'customer',
}

export type EntityType = Database['public']['Tables']['app_user']['Row'];

export interface EntityContextProviderType {
  entityType: UserRole;
  currentEntity: EntityType | null;
  entities: EntityType[];
  deleteEntity: (id: string) => Promise<boolean>;
  updateEntity: (id: string, { email, name}: Partial<CreateEntityInput> ) => Promise<boolean>;
  createEntity: ({ email, name }: CreateEntityInput) => Promise<boolean>;
  error: string | null;
}
