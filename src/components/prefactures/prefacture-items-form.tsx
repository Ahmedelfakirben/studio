"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface LineaDetalle {
  numeroPrix: string;
  designacion: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  montoHT: number;
}

interface PrefactureItemsFormProps {
  items: LineaDetalle[];
  onChange: (items: LineaDetalle[]) => void;
}

export function PrefactureItemsForm({ items, onChange }: PrefactureItemsFormProps) {
  const addItem = () => {
    onChange([
      ...items,
      {
        numeroPrix: "",
        designacion: "",
        unidad: "U",
        cantidad: 1,
        precioUnitario: 0,
        montoHT: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof LineaDetalle, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Recalcular montoHT si cambia cantidad o precioUnitario
    if (field === "cantidad" || field === "precioUnitario") {
      const cantidad = field === "cantidad" ? parseFloat(value) || 0 : newItems[index].cantidad;
      const precioUnitario = field === "precioUnitario" ? parseFloat(value) || 0 : newItems[index].precioUnitario;
      newItems[index].montoHT = cantidad * precioUnitario;
    }

    onChange(newItems);
  };

  const unidadesComunes = ["U", "m3", "m2", "mL", "Tonne", "kg", "Sac", "Jour", "H"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Líneas de Detalle</CardTitle>
          <Button type="button" onClick={addItem} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Línea
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No hay líneas de detalle. Agrega una para empezar.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Nº de PRIX */}
                    <div className="col-span-12 sm:col-span-2">
                      <Label>Nº PRIX</Label>
                      <Input
                        value={item.numeroPrix}
                        onChange={(e) => updateItem(index, "numeroPrix", e.target.value)}
                        placeholder="001"
                      />
                    </div>

                    {/* Designación */}
                    <div className="col-span-12 sm:col-span-4">
                      <Label>Designación de Obras</Label>
                      <Input
                        value={item.designacion}
                        onChange={(e) => updateItem(index, "designacion", e.target.value)}
                        placeholder="Descripción del trabajo"
                      />
                    </div>

                    {/* Unidad */}
                    <div className="col-span-6 sm:col-span-2">
                      <Label>Unidad</Label>
                      <select
                        value={item.unidad}
                        onChange={(e) => updateItem(index, "unidad", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {unidadesComunes.map((u) => (
                          <option key={u} value={u}>
                            {u}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cantidad */}
                    <div className="col-span-6 sm:col-span-2">
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.cantidad}
                        onChange={(e) => updateItem(index, "cantidad", e.target.value)}
                      />
                    </div>

                    {/* Precio Unitario */}
                    <div className="col-span-6 sm:col-span-2">
                      <Label>P.U. HT</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.precioUnitario}
                        onChange={(e) => updateItem(index, "precioUnitario", e.target.value)}
                      />
                    </div>

                    {/* Monto HT (calculado) */}
                    <div className="col-span-6 sm:col-span-2">
                      <Label>Monto HT</Label>
                      <Input
                        type="number"
                        value={item.montoHT.toFixed(2)}
                        disabled
                        className="bg-muted"
                      />
                    </div>

                    {/* Botón Eliminar */}
                    <div className="col-span-12 flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
