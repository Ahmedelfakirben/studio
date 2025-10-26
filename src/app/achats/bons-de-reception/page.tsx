"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BonReceptionTable } from "@/components/achats/bon-reception-table";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { bonsReceptionService } from "@/lib/api";

const BonsReceptionPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [bons, setBons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBons = async () => {
    try {
      setIsLoading(true);
      // Por ahora, utilizamos datos simulados para desarrollo
      // Cuando el backend esté listo, descomentar estas líneas:
      // const response = await bonsReceptionService.getAll();
      // setBons(response.data);
      
      // Mientras tanto, usamos datos de ejemplo
      setBons([
        {
          _id: '1',
          numero: 'BR-2024-001',
          fecha: '2024-09-01',
          proveedor: { nombre: 'Fournisseur Example 1' },
          totalHT: 1200.50
        },
        {
          _id: '2',
          numero: 'BR-2024-002',
          fecha: '2024-09-15',
          proveedor: { nombre: 'Fournisseur Example 2' },
          totalHT: 560.00
        },
        {
          _id: '3',
          numero: 'BR-2024-003',
          fecha: '2024-09-30',
          proveedor: { nombre: 'Fournisseur Example 3' },
          totalHT: 850.75
        }
      ]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al cargar los bons de réception",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBons();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      // En un entorno real, esto haría la llamada a la API
      // await bonsReceptionService.delete(id);
      
      toast({
        title: "Éxito",
        description: "Bon de réception eliminado correctamente",
      });
      
      // Actualizar la lista eliminando el bon eliminado
      setBons(prevBons => prevBons.filter(b => b._id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al eliminar el bon de réception",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Bons de Réception">
        <Button onClick={() => router.push("/achats/bons-de-reception/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Bon de Réception
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
        <BonReceptionTable bons={bons} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default BonsReceptionPage;
