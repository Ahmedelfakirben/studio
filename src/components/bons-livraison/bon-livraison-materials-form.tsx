"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface LineaMaterial {
  numeroPrix: string;
  designacion: string;
  unidad: string;
  cantidad: number;
}

interface BonLivraisonMaterialsFormProps {
  materials: LineaMaterial[];
  onChange: (materials: LineaMaterial[]) => void;
}

export function BonLivraisonMaterialsForm({ materials, onChange }: BonLivraisonMaterialsFormProps) {
  const addMaterial = () => {
    onChange([
      ...materials,
      {
        numeroPrix: "",
        designacion: "",
        unidad: "Tonne",
        cantidad: 1,
      },
    ]);
  };

  const removeMaterial = (index: number) => {
    onChange(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (index: number, field: keyof LineaMaterial, value: any) => {
    const newMaterials = [...materials];
    newMaterials[index] = { ...newMaterials[index], [field]: value };
    onChange(newMaterials);
  };

  const unidadesComunes = ["Tonne", "Sac", "kg", "mL", "m3", "m2", "U"];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Matériaux Livrés</CardTitle>
          <Button type="button" onClick={addMaterial} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter Matériau
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {materials.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aucun matériau ajouté. Cliquez sur "Ajouter Matériau" pour commencer.
          </p>
        ) : (
          <div className="space-y-4">
            {materials.map((material, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-12 gap-4">
                    {/* Nº de PRIX */}
                    <div className="col-span-12 sm:col-span-2">
                      <Label>Nº PRIX</Label>
                      <Input
                        value={material.numeroPrix}
                        onChange={(e) => updateMaterial(index, "numeroPrix", e.target.value)}
                        placeholder="001"
                      />
                    </div>

                    {/* Designación */}
                    <div className="col-span-12 sm:col-span-6">
                      <Label>Désignation des Matériaux</Label>
                      <Input
                        value={material.designacion}
                        onChange={(e) => updateMaterial(index, "designacion", e.target.value)}
                        placeholder="Nom du matériau"
                      />
                    </div>

                    {/* Unidad */}
                    <div className="col-span-6 sm:col-span-2">
                      <Label>Unité</Label>
                      <select
                        value={material.unidad}
                        onChange={(e) => updateMaterial(index, "unidad", e.target.value)}
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
                      <Label>Quantité</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={material.cantidad}
                        onChange={(e) => updateMaterial(index, "cantidad", e.target.value)}
                      />
                    </div>

                    {/* Botón Eliminar */}
                    <div className="col-span-12 flex justify-end">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMaterial(index)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
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
