
'use client'

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewFournisseurPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Créer un nouveau Fournisseur" />
      <Card>
        <CardHeader>
            <CardTitle>Informations du Fournisseur</CardTitle>
            <CardDescription>Remplissez les détails ci-dessous pour ajouter un nouveau fournisseur.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="fournisseur-name">Raison Sociale / Nom</Label>
                <Input id="fournisseur-name" placeholder="Ex: Matériaux Express" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="fournisseur-address">Adresse</Label>
                <Textarea id="fournisseur-address" placeholder="Ex: 123 Rue de la Fourniture, 75000 Paris" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="fournisseur-vat">N° de TVA</Label>
                <Input id="fournisseur-vat" placeholder="Ex: FR 12 345678901" />
            </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Annuler</Button>
            <Button>Enregistrer le Fournisseur</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
