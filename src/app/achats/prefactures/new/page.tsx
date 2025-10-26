"use client";

import React from "react";
import { PrefacturaAchatForm } from "@/components/achats/prefactura-achat-form";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import { prefacturasAchatService } from "@/lib/api";

const NewPrefacturaAchatPage: React.FC = () => {
  const { toast } = useToast();

  const handleCreatePrefactura = async (data: any): Promise<void> => {
    try {
      // En un entorno real, esto haría una llamada a la API
      // await prefacturasAchatService.create(data);
      
      console.log("Creando préfacture d'achat:", data);
      
      // Simulamos un delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error al crear préfacture:", error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Créer une Préfacture d'Achat" />
      
      <PrefacturaAchatForm onSubmit={handleCreatePrefactura} />
    </div>
  );
};

export default NewPrefacturaAchatPage;
