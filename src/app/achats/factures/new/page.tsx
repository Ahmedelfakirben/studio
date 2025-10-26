"use client";

import React from "react";
import { FacturaAchatForm } from "@/components/achats/facture-achat-form";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import { facturasAchatService } from "@/lib/api";

const NewFactureAchatPage: React.FC = () => {
  const { toast } = useToast();

  const handleCreateFactura = async (data: any): Promise<void> => {
    try {
      // En un entorno real, esto haría una llamada a la API
      // await facturasAchatService.create(data);
      
      console.log("Creando factura de compra:", data);
      
      // Simulamos un delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error al crear factura:", error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Créer une Facture d'Achat" />
      
      <FacturaAchatForm onSubmit={handleCreateFactura} />
    </div>
  );
};

export default NewFactureAchatPage;
