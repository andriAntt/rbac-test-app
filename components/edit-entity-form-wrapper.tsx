"use client";

import { useContext } from "react";
import { AdminContext } from "@/contexts/admin";
import NoData from "./no-data";
import EditEntityForm from "./edit-entity-form";

type Props = {
  context: typeof AdminContext;
};

export default function EditEntityFormWrapper({ context }: Props) {
  const contextData = useContext(context);

  if (!contextData) {
    return null;
  }

  const { currentEntity } = contextData;

  return (
    currentEntity ? <EditEntityForm context={context} /> : <NoData />
  );
}
