"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Download } from "lucide-react";
import { BonLivraisonDetail } from "@/components/bons-livraison/bon-livraison-detail";
import { BonLivraisonPrint } from "@/components/bons-livraison/bon-livraison-print";
import { bonsLivraisonService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const BonLivraisonDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [bonLivraison, setBonLivraison] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!bonLivraison) {
    return null;
  }

  return (
    <>
      {/* Vista de pantalla - con botones */}
      <div className="space-y-6 print:hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                BL {bonLivraison.numero}
              </h1>
              <p className="text-muted-foreground">
                {bonLivraison.cliente.razonSocial}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Imprimer / PDF
            </Button>
            <Button onClick={() => router.push(`/bons-de-livraison/${bonId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Éditer
            </Button>
          </div>
        </div>

        {/* Detalle para ver en pantalla */}
        <BonLivraisonDetail bonLivraison={bonLivraison} />
      </div>

      {/* Vista de impresión - profesional */}
      <div className="hidden print:block">
        <BonLivraisonPrint bonLivraison={bonLivraison} />
      </div>
    </>
  );
};

export default BonLivraisonDetailPage;
