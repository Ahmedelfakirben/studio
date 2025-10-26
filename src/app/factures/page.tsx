"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FactureTable } from "@/components/factures/facture-table";
import { facturasService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const FacturesListPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [facturas, setFacturas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFacturas = async () => {
    try {
      setIsLoading(true);
      const response = await facturasService.getAll();
      setFacturas(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al cargar las facturas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturas();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await facturasService.delete(id);
      toast({
        title: "Éxito",
        description: "Factura eliminada correctamente",
      });
      fetchFacturas(); // Recargar la lista
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al eliminar la factura",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Factures de Vente</h1>
          <p className="text-muted-foreground">
            Gestiona todas las facturas de venta a clientes
          </p>
        </div>
        <Button onClick={() => router.push("/factures/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Facture
        </Button>
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <FactureTable facturas={facturas} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default FacturesListPage;
