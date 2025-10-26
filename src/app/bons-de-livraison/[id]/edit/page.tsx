"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BonLivraisonForm } from "@/components/bons-livraison/bon-livraison-form";
import { bonsLivraisonService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const EditBonLivraisonPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [bonLivraison, setBonLivraison] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bonId = params.id as string;

  useEffect(() => {
    const fetchBonLivraison = async () => {
      try {
        setIsLoading(true);
        const response = await bonsLivraisonService.getById(bonId);
        setBonLivraison(response.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar el bon de livraison",
          variant: "destructive",
        });
        router.push("/bons-de-livraison");
      } finally {
        setIsLoading(false);
      }
    };

    if (bonId) {
      fetchBonLivraison();
    }
  }, [bonId]);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await bonsLivraisonService.update(bonId, data);
      toast({
        title: "Éxito",
        description: "Bon de livraison actualizado correctamente",
      });
      router.push(`/bons-de-livraison/${bonId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al actualizar el bon de livraison",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!bonLivraison) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Éditer Bon de Livraison</h1>
          <p className="text-muted-foreground">
            Modifie les informations du bon {bonLivraison.numero}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <BonLivraisonForm
        initialData={{
          numero: bonLivraison.numero,
          fecha: bonLivraison.fecha.split("T")[0],
          referenciaProyecto: bonLivraison.referenciaProyecto || "",
          clienteId: bonLivraison.clienteId,
          lineasMaterial: bonLivraison.lineasMaterial,
        }}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        submitLabel="Mettre à jour le BL"
      />
    </div>
  );
};

export default EditBonLivraisonPage;
