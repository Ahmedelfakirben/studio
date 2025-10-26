"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FacturaAchatForm } from "@/components/achats/facture-achat-form";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/page-header";
import { facturasAchatService } from "@/lib/api";

const EditFacturaAchatPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [factura, setFactura] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        setIsLoading(true);
        // En un entorno real, esto haría una llamada a la API
        // const response = await facturasAchatService.getById(params.id);
        // setFactura(response.data);
        
        // Por ahora, simulamos datos para desarrollo
        setFactura({
          _id: params.id,
          proveedorId: "123",
          fecha: "2024-09-01",
          fechaVencimiento: "2024-10-01",
          numero: `FAC-ACHAT-2024-00${params.id}`,
          referencia: "REF-PROV-001",
          notas: "Commande urgente, livraison effectuée le 31/08/2024",
          formaPago: "transferencia",
          metodoPago: "banco",
          items: [
            {
              descripcion: "Matériel de construction",
              cantidad: 5,
              precioUnitario: 120,
              tipoIVA: 20
            }
          ],
          totalHT: 600,
          totalTVA: 120,
          totalTTC: 720
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar la factura",
          variant: "destructive",
        });
        router.push("/achats/factures");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFactura();
  }, [params.id, toast, router]);

  const handleUpdateFactura = async (data: any): Promise<void> => {
    try {
      // En un entorno real, esto haría una llamada a la API
      // await facturasAchatService.update(params.id, data);
      
      console.log("Actualizando factura de compra:", data);
      
      // Simulamos un delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error al actualizar factura:", error);
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
      <PageHeader title={`Modifier la Facture: ${factura.numero}`} />
      
      <FacturaAchatForm 
        initialData={factura} 
        onSubmit={handleUpdateFactura} 
        isEditing={true} 
      />
    </div>
  );
};

export default EditFacturaAchatPage;
