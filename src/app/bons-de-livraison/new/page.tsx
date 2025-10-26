"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BonLivraisonForm } from "@/components/bons-livraison/bon-livraison-form";
import { bonsLivraisonService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const NewBonLivraisonPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log('📤 Enviando datos de bon de livraison:', data);
    
    try {
      setIsLoading(true);
      const response = await bonsLivraisonService.create(data);
      console.log('✅ Respuesta del servidor:', response.data);
      
      toast({
        title: "Éxito",
        description: "Bon de livraison creado correctamente",
      });
      router.push("/bons-de-livraison");
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      
      const errorMessage = error.response?.data?.mensaje 
        || error.response?.data?.error
        || error.message 
        || "Error al crear el bon de livraison";
      
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
          <h1 className="text-3xl font-bold tracking-tight">Nouveau Bon de Livraison</h1>
          <p className="text-muted-foreground">
            Complète le formulaire pour créer un nouveau bon de livraison
          </p>
        </div>
      </div>

      {/* Formulario */}
      <BonLivraisonForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Créer le BL"
      />
    </div>
  );
};

export default NewBonLivraisonPage;
