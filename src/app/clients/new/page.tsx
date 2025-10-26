"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "@/components/clients/client-form";
import { clientesService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const NewClientPage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await clientesService.create(data);
      toast({
        title: "Éxito",
        description: "Cliente creado correctamente",
      });
      router.push("/clients");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.mensaje || "Error al crear el cliente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h1>
          <p className="text-muted-foreground">
            Completa el formulario para crear un nuevo cliente
          </p>
        </div>
      </div>

      {/* Formulario */}
      <ClientForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Crear Cliente"
      />
    </div>
  );
};

export default NewClientPage;
