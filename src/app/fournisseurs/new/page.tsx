"use client";

import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import { ProveedorForm } from "@/components/fournisseur-form";
import { proveedoresService } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function NewFournisseurPage() {
  const { toast } = useToast();
  const router = useRouter();

  // Manejar la creación del proveedor
  const handleCreateFournisseur = async (data: any) => {
    try {
      // Adaptamos los datos al formato esperado por la API
      const formattedData = {
        ...data,
        razonSocial: data.nombre,
      };
      
      console.log("Enviando datos al backend:", formattedData);
      
      // Intentar crear el proveedor en el backend
      const response = await proveedoresService.create(formattedData);
      console.log("Respuesta del backend:", response);
      
      toast({
        title: "Éxito",
        description: "Proveedor creado correctamente",
      });
      
      // Redirigir a la lista de proveedores
      router.push("/fournisseurs");
    } catch (error: any) {
      console.error("Error al crear proveedor:", error);
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al crear el proveedor",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Créer un Nouveau Fournisseur" />
      <ProveedorForm onSubmit={handleCreateFournisseur} />
    </div>
  );
}
