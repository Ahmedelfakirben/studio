"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FactureAchatTable } from "@/components/achats/facture-achat-table";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { facturasAchatService } from "@/lib/api";

const FacturesAchatPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [facturas, setFacturas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFacturas = async () => {
    try {
      setIsLoading(true);
      // Por ahora, utilizamos datos simulados para desarrollo
      // Cuando el backend esté listo, descomentar estas líneas:
      // const response = await facturasAchatService.getAll();
      // setFacturas(response.data);
      
      // Mientras tanto, usamos datos de ejemplo
      setTimeout(() => {
      setFacturas([
      {
        _id: '1',
        numero: 'FAC-ACHAT-2024-001',
        fecha: '2024-09-01',
        proveedor: { razonSocial: 'Matériaux Express' },
        totalHT: 1200.50,
        totalTVA: 240.10,
          totalTTC: 1440.60
        },
      {
        _id: '2',
        numero: 'FAC-ACHAT-2024-002',
        fecha: '2024-09-15',
        proveedor: { razonSocial: 'Béton Pro' },
        totalHT: 560.00,
        totalTVA: 112.00,
          totalTTC: 672.00
        },
      {
        _id: '3',
        numero: 'FAC-ACHAT-2024-003',
        fecha: '2024-09-30',
        proveedor: { razonSocial: 'Acier Durable S.L.' },
        totalHT: 850.75,
        totalTVA: 170.15,
          totalTTC: 1020.90
          }
            ]);
            setIsLoading(false);
          }, 500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al cargar las facturas de compra",
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
      // En un entorno real, esto haría la llamada a la API
      // await facturasAchatService.delete(id);
      
      toast({
        title: "Éxito",
        description: "Factura eliminada correctamente",
      });
      
      // Actualizar la lista eliminando la factura eliminada
      setFacturas(prevFacturas => prevFacturas.filter(f => f._id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al eliminar la factura",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Factures d'Achat">
        <Button onClick={() => router.push("/achats/factures/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Facture
        </Button>
      </PageHeader>

      {/* Tabla */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <FactureAchatTable facturas={facturas} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default FacturesAchatPage;
