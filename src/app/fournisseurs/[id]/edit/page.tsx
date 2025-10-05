
'use client'

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data, in a real app you would fetch this based on params.id
const fournisseurData: { [key: string]: { name: string, address: string, vat: string } } = {
    "fourn-001": { name: "Matériaux Express", address: "123 Rue de la Fourniture, 75000 Paris", vat: "FR XX XXXXXXXXX" },
    "fourn-002": { name: "Béton Pro", address: "456 Avenue du Ciment, 69002 Lyon", vat: "FR XY YYYYYYYYY" },
    "fourn-003": { name: "Acier Durable S.L.", address: "789 Boulevard de la Ferraille, 13000 Marseille", vat: "FR XZ ZZZZZZZZZ" },
};


export default function EditFournisseurPage({ params }: { params: { id: string } }) {
  const fournisseur = fournisseurData[params.id] || { name: "", address: "", vat: "" };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Modifier le Fournisseur: ${fournisseur.name}`} />
      <Card>
        <CardHeader>
            <CardTitle>Informations du Fournisseur</CardTitle>
            <CardDescription>Mettez à jour les détails du fournisseur.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fournisseur-name">Raison Sociale / Nom</Label>
                <Input id="fournisseur-name" defaultValue={fournisseur.name} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="fournisseur-address">Adresse</Label>
                <Textarea id="fournisseur-address" defaultValue={fournisseur.address} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="fournisseur-vat">N° de TVA</Label>
                <Input id="fournisseur-vat" defaultValue={fournisseur.vat} />
            </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Annuler</Button>
            <Button>Enregistrer les modifications</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
