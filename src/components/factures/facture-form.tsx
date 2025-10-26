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
import { Loader2, Calculator } from "lucide-react";
import { FactureItemsForm } from "./facture-items-form";
import { clientesService } from "@/lib/api";

// Schema de validación
const facturaSchema = z.object({
  numero: z.string().min(1, "El número de factura es obligatorio"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  referenciaProyecto: z.string().optional(),
  clienteId: z.string().min(1, "Debe seleccionar un cliente"),
});

type FacturaFormData = z.infer<typeof facturaSchema>;

interface LineaDetalle {
  numeroPrix: string;
  designacion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  montoHT: number;
}

interface FactureFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export function FactureForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = "Guardar",
}: FactureFormProps) {
  const [clientes, setClientes] = useState<any[]>([]);
  const [items, setItems] = useState<LineaDetalle[]>(
    initialData?.lineasDetalle || []
  );

  const form = useForm<FacturaFormData>({
    resolver: zodResolver(facturaSchema),
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

  // Calcular totales
  const calcularTotales = () => {
    const montoHT = items.reduce((sum, item) => sum + item.montoHT, 0);
    const montTVA = montoHT * 0.2; // 20% TVA
    const montoTTC = montoHT + montTVA;
    return { montoHT, montTVA, montoTTC };
  };

  const totales = calcularTotales();

  const handleSubmit = async (data: FacturaFormData) => {
    if (items.length === 0) {
      alert("Debe agregar al menos una línea de detalle");
      return;
    }

    const facturaCompleta = {
      ...data,
      lineasDetalle: items,
      montoHT: totales.montoHT,
      montTVA: totales.montTVA,
      montoTTC: totales.montoTTC,
    };

    try {
      await onSubmit(facturaCompleta);
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
                  <FormLabel>Número de Factura *</FormLabel>
                  <FormControl>
                    <Input placeholder="FAC-2024-001" {...field} />
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

        {/* Líneas de Detalle */}
        <FactureItemsForm items={items} onChange={setItems} />

        {/* Totales */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">Monto HT:</span>
                <span className="font-bold">{totales.montoHT.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-medium">TVA (20%):</span>
                <span className="font-bold">{totales.montTVA.toFixed(2)} MAD</span>
              </div>
              <div className="border-t pt-2 mt-2" />
              <div className="flex justify-between items-center text-xl">
                <span className="font-bold">Monto TTC:</span>
                <span className="font-bold text-primary">
                  {totales.montoTTC.toFixed(2)} MAD
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading || items.length === 0}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground flex items-center">
              Agregue al menos una línea de detalle
            </p>
          )}
        </div>
      </form>
    </Form>
  );
}
