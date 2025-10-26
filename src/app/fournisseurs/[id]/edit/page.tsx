"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import { ProveedorForm } from "@/components/fournisseur-form";
import { proveedoresService } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditFournisseurPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [fournisseur, setFournisseur] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del proveedor
  useEffect(() => {
    const fetchFournisseur = async () => {
      try {
        setIsLoading(true);
        // En un entorno real, esto haría una llamada a la API
        // const response = await proveedoresService.getById(params.id);
        // setFournisseur(response.data);
        
        // Simulamos los datos para desarrollo
        setTimeout(() => {
          setFournisseur({
            id: params.id,
            razonSocial: "Matériaux Express",
            email: "contact@materiaux-express.fr",
            telefono: "+33 123456789",
            direccion: "123 Rue de la Construction, 75001 Paris, France",
            numeroTVA: "FR12345678901"
          });
          setIsLoading(false);
        }, 500);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.response?.data?.mensaje || "Error al cargar los datos del proveedor",
          variant: "destructive",
        });
        router.push("/fournisseurs");
      }
    };

    fetchFournisseur();
  }, [params.id, toast, router]);

  // Manejar la actualización del proveedor
  const handleUpdateFournisseur = async (data: any) => {
    try {
      // Adaptamos los datos al formato esperado por la API
      const formattedData = {
        ...data,
        razonSocial: data.nombre,
      };
      
      // En un entorno real, esto haría una llamada a la API
      // await proveedoresService.update(params.id, formattedData);
      
      console.log("Datos enviados al servidor:", formattedData);
      
      // Simular un delay para mostrar el efecto de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Éxito",
        description: "Proveedor actualizado correctamente",
      });
      
      // Redirigir al detalle del proveedor
      router.push(`/fournisseurs/${params.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al actualizar el proveedor",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Mostrar esqueleto mientras carga
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  // Adaptamos los nombres de campos para el formulario
  const formData = {
    ...fournisseur,
    nombre: fournisseur.razonSocial
  };

  return (
    <div className="space-y-6">
      <PageHeader title={`Modifier ${fournisseur.razonSocial}`} />
      
      <ProveedorForm 
        initialData={formData} 
        onSubmit={handleUpdateFournisseur} 
        isEditing={true}
      />
    </div>
  );
}
