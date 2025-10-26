"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { BonLivraisonTable } from "@/components/bons-livraison/bon-livraison-table";
import { bonsLivraisonService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const BonsLivraisonListPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [bonsLivraison, setBonsLivraison] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBonsLivraison = async () => {
    try {
      setIsLoading(true);
      const response = await bonsLivraisonService.getAll();
      setBonsLivraison(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al cargar los bons de livraison",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBonsLivraison();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await bonsLivraisonService.delete(id);
      toast({
        title: "Éxito",
        description: "Bon de livraison eliminado correctamente",
      });
      fetchBonsLivraison();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al eliminar el bon de livraison",
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
          <h1 className="text-3xl font-bold tracking-tight">Bons de Livraison</h1>
          <p className="text-muted-foreground">
            Gestiona todos los bons de livraison de materiales
          </p>
        </div>
        <Button onClick={() => router.push("/bons-de-livraison/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau BL
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
        <BonLivraisonTable bonsLivraison={bonsLivraison} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default BonsLivraisonListPage;
