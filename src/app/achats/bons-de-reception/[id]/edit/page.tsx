"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BonReceptionForm } from "@/components/achats/bon-reception-form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { bonsReceptionService } from "@/lib/api";

const EditBonReceptionPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [bon, setBon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBon = async () => {
      try {
        setIsLoading(true);
        // En un entorno real, esto haría una llamada a la API
        // const response = await bonsReceptionService.getById(params.id);
        // setBon(response.data);
        
        // Por ahora, simulamos datos para desarrollo
        setBon({
          _id: params.id,
          proveedorId: "123",
          fecha: "2024-09-01",
          numero: `BR-2024-00${params.id}`,
          referencia: "REF-PROV-001",
          notas: "Livraison effectuée le 01/09/2024",
          items: [
            {
              descripcion: "Matériel de bureau",
              cantidad: 5,
              precioUnitario: 120
            },
            {
              descripcion: "Fournitures diverses",
              cantidad: 10,
              precioUnitario: 15
            }
          ],
          totalHT: 750
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar el bon de réception",
          variant: "destructive",
        });
        router.push("/achats/bons-de-reception");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBon();
  }, [params.id, toast, router]);

  const handleUpdateBon = async (data: any): Promise<void> => {
    try {
      // En un entorno real, esto haría una llamada a la API
      // await bonsReceptionService.update(params.id, data);
      
      console.log("Actualizando bon de réception:", data);
      
      // Simulamos un delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error al actualizar bon de réception:", error);
      return Promise.reject(error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Modifier le Bon de Réception: ${bon.numero}`} />
      
      <BonReceptionForm 
        initialData={bon} 
        onSubmit={handleUpdateBon} 
        isEditing={true} 
      />
    </div>
  );
};

export default EditBonReceptionPage;
