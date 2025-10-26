"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PrefacturaAchatForm } from "@/components/achats/prefactura-achat-form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { prefacturasAchatService } from "@/lib/api";

const EditPrefacturaAchatPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [prefactura, setPrefactura] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrefactura = async () => {
      try {
        setIsLoading(true);
        // En un entorno real, esto haría una llamada a la API
        // const response = await prefacturasAchatService.getById(params.id);
        // setPrefactura(response.data);
        
        // Por ahora, simulamos datos para desarrollo
        setPrefactura({
          _id: params.id,
          proveedorId: "123",
          fecha: "2024-09-01",
          fechaVencimiento: "2024-10-01",
          numero: `PREF-ACHAT-2024-00${params.id}`,
          referencia: "REF-PROV-001",
          notas: "Devis valable jusqu'au 31/10/2024",
          items: [
            {
              descripcion: "Matériel informatique",
              cantidad: 5,
              precioUnitario: 120,
              tipoIVA: 20
            },
            {
              descripcion: "Accessoires",
              cantidad: 10,
              precioUnitario: 15,
              tipoIVA: 20
            }
          ],
          totalHT: 750,
          totalTVA: 150,
          totalTTC: 900
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar la préfacture",
          variant: "destructive",
        });
        router.push("/achats/prefactures");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrefactura();
  }, [params.id, toast, router]);

  const handleUpdatePrefactura = async (data: any): Promise<void> => {
    try {
      // En un entorno real, esto haría una llamada a la API
      // await prefacturasAchatService.update(params.id, data);
      
      console.log("Actualizando préfacture d'achat:", data);
      
      // Simulamos un delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error al actualizar préfacture:", error);
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
      <PageHeader title={`Modifier la Préfacture: ${prefactura.numero}`} />
      
      <PrefacturaAchatForm 
        initialData={prefactura} 
        onSubmit={handleUpdatePrefactura} 
        isEditing={true} 
      />
    </div>
  );
};

export default EditPrefacturaAchatPage;
