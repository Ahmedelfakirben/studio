"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FactureForm } from "@/components/factures/facture-form";
import { facturasService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const NewFacturePage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log('📤 Enviando datos de factura:', data);
    
    try {
      setIsLoading(true);
      const response = await facturasService.create(data);
      console.log('✅ Respuesta del servidor:', response.data);
      
      toast({
        title: "Éxito",
        description: "Factura creada correctamente",
      });
      router.push("/factures");
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      console.error('❌ Error response:', error.response);
      
      const errorMessage = error.response?.data?.mensaje 
        || error.response?.data?.error
        || error.message 
        || "Error al crear la factura";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Mostrar detalles en consola para debugging
      if (error.response?.data?.detalles) {
        console.error('📋 Detalles del error:', error.response.data.detalles);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nouvelle Facture</h1>
          <p className="text-muted-foreground">
            Complète le formulaire pour créer une nouvelle facture de vente
          </p>
        </div>
      </div>

      {/* Formulario */}
      <FactureForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Créer la Facture"
      />
    </div>
  );
};

export default NewFacturePage;
