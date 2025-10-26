"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Download } from "lucide-react";
import { PrefactureDetail } from "@/components/prefactures/prefacture-detail";
import { prefacturasService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const PrefactureDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [prefactura, setPrefactura] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const prefacturaId = params.id as string;

  useEffect(() => {
    const fetchPrefactura = async () => {
      try {
        setIsLoading(true);
        const response = await prefacturasService.getById(prefacturaId);
        setPrefactura(response.data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar la prefactura",
          variant: "destructive",
        });
        router.push("/prefactures");
      } finally {
        setIsLoading(false);
      }
    };

    if (prefacturaId) {
      fetchPrefactura();
    }
  }, [prefacturaId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!prefactura) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Préfacture {prefactura.numero}
            </h1>
            <p className="text-muted-foreground">
              {prefactura.cliente.razonSocial}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          <Button onClick={() => router.push(`/prefactures/${prefacturaId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Éditer
          </Button>
        </div>
      </div>

      {/* Detalle */}
      <PrefactureDetail prefactura={prefactura} />
    </div>
  );
};

export default PrefactureDetailPage;
