"use client";

import React from "react";
import { BonReceptionForm } from "@/components/achats/bon-reception-form";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import { bonsReceptionService } from "@/lib/api";

const NewBonReceptionPage: React.FC = () => {
  const { toast } = useToast();

  const handleCreateBon = async (data: any): Promise<void> => {
    try {
      // En un entorno real, esto haría una llamada a la API
      // await bonsReceptionService.create(data);
      
      console.log("Creando bon de réception:", data);
      
      // Simulamos un delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error al crear bon de réception:", error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Créer un Bon de Réception" />
      
      <BonReceptionForm onSubmit={handleCreateBon} />
    </div>
  );
};

export default NewBonReceptionPage;
