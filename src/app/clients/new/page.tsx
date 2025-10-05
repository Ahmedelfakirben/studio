
'use client'

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewClientPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Créer un nouveau Client" />
      <Card>
        <CardHeader>
            <CardTitle>Informations du Client</CardTitle>
            <CardDescription>Remplissez les détails ci-dessous pour ajouter un nouveau client.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="client-name">Raison Sociale / Nom</Label>
                <Input id="client-name" placeholder="Ex: Constructa S.A." />
            </div>
             <div className="space-y-2">
                <Label htmlFor="client-address">Adresse</Label>
                <Textarea id="client-address" placeholder="Ex: 123 Rue du Projet, 75000 Paris" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="client-vat">N° de TVA</Label>
                <Input id="client-vat" placeholder="Ex: FR 12 345678901" />
            </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline">Annuler</Button>
            <Button>Enregistrer le Client</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
