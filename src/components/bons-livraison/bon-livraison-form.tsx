"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BonLivraisonMaterialsForm } from "./bon-livraison-materials-form";
import { clientesService } from "@/lib/api";

// Schema de validación
const bonLivraisonSchema = z.object({
  numero: z.string().min(1, "El número de bon de livraison es obligatorio"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  referenciaProyecto: z.string().optional(),
  clienteId: z.string().min(1, "Debe seleccionar un cliente"),
});

type BonLivraisonFormData = z.infer<typeof bonLivraisonSchema>;

interface LineaMaterial {
  numeroPrix: string;
  designacion: string;
  unidad: string;
  cantidad: number;
}

interface BonLivraisonFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function BonLivraisonForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Guardar",
}: BonLivraisonFormProps) {
  const [clientes, setClientes] = useState<any[]>([]);
  const [materials, setMaterials] = useState<LineaMaterial[]>(
    initialData?.lineasMaterial || []
  );

  const form = useForm<BonLivraisonFormData>({
    resolver: zodResolver(bonLivraisonSchema),
    defaultValues: initialData || {
      numero: "",
      fecha: new Date().toISOString().split("T")[0],
      referenciaProyecto: "",
      clienteId: "",
    },
  });

  // Cargar clientes
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await clientesService.getAll();
        setClientes(response.data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  const handleSubmit = async (data: BonLivraisonFormData) => {
    if (materials.length === 0) {
      alert("Debe agregar al menos un material");
      return;
    }

    const bonCompleto = {
      ...data,
      lineasMaterial: materials,
    };

    try {
      await onSubmit(bonCompleto);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de BL *</FormLabel>
                  <FormControl>
                    <Input placeholder="BL-2024-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clienteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.razonSocial}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referenciaProyecto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referencia del Proyecto</FormLabel>
                  <FormControl>
                    <Input placeholder="PROJ-2024-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Materiales */}
        <BonLivraisonMaterialsForm materials={materials} onChange={setMaterials} />

        {/* Resumen */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total de matériaux</p>
              <p className="text-2xl font-bold">{materials.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading || materials.length === 0}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
          {materials.length === 0 && (
            <p className="text-sm text-muted-foreground flex items-center">
              Agregue al menos un material
            </p>
          )}
        </div>
      </form>
    </Form>
  );
}
