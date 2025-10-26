"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PrefactureForm } from "@/components/prefactures/prefacture-form";
import { prefacturasService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const NewPrefacturePage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log('📤 Enviando datos de prefactura:', data);
    
    try {
      setIsLoading(true);
      const response = await prefacturasService.create(data);
      console.log('✅ Respuesta del servidor:', response.data);
      
      toast({
        title: "Éxito",
        description: "Prefactura creada correctamente",
      });
      router.push("/prefactures");
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      
      const errorMessage = error.response?.data?.mensaje 
        || error.response?.data?.error
        || error.message 
        || "Error al crear la prefactura";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
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
          <h1 className="text-3xl font-bold tracking-tight">Nouvelle Préfacture</h1>
          <p className="text-muted-foreground">
            Complète le formulaire pour créer une nouvelle préfacture de vente
          </p>
        </div>
      </div>

      {/* Formulario */}
      <PrefactureForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Créer la Préfacture"
      />
    </div>
  );
};

export default NewPrefacturePage;
