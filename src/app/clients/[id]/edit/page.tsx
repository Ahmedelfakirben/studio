
'use client'

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data, in a real app you would fetch this based on params.id
const clientData: { [key: string]: { name: string, address: string, vat: string } } = {
    "client-001": { name: "Chantier Central", address: "Zone Industrielle Nord, 93200 Saint-Denis", vat: "FR XX XXXXXXXXX" },
    "client-002": { name: "Mairie de Ville-Haute", address: "1 Place de la Mairie, 75001 Paris", vat: "FR 55 123456789" },
    "client-003": { name: "Constructa S.A.", address: "456 Avenue des Ponts, 69002 Lyon", vat: "FR XY YYYYYYYYY" },
    "client-004": { name: "BTP-IDF", address: "789 Boulevard des Bâtisseurs, 92100 Boulogne-Billancourt", vat: "FR XZ ZZZZZZZZZ" },
    "client-005": { name: "Client S.A.", address: "456 Avenue des Projets, 69000 Lyon", vat: "FR 98 765432109" },
};


export default function EditClientPage({ params }: { params: { id: string } }) {
  const client = clientData[params.id] || { name: "", address: "", vat: "" };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={`Modifier le Client: ${client.name}`} />
      <Card>
        <CardHeader>
            <CardTitle>Informations du Client</CardTitle>
            <CardDescription>Mettez à jour les détails du client.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="client-name">Raison Sociale / Nom</Label>
                <Input id="client-name" defaultValue={client.name} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="client-address">Adresse</Label>
                <Textarea id="client-address" defaultValue={client.address} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="client-vat">N° de TVA</Label>
                <Input id="client-vat" defaultValue={client.vat} />
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
