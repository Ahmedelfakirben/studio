
'use client';

import * as React from 'react';
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea';

const initialItems = [
    { id: 1, prix: '1', designation: 'Sable 0/4', unite: 'Tonne', quantite: 15 },
    { id: 2, prix: '2', designation: 'Gravier 4/16', unite: 'Tonne', quantite: 25 },
    { id: 3, prix: '3', designation: 'Ciment CEM II/B-LL 32,5 R', unite: 'Sac 25kg', quantite: 200 },
    { id: 4, prix: '4', designation: 'Armatures métalliques HA10', unite: 'kg', quantite: 550 },
    { id: 5, prix: '5', designation: 'Tuyaux PVC Ø 100', unite: 'mL', quantite: 120 },
];

for (let i = initialItems.length + 1; i <= 20; i++) {
    initialItems.push({ id: i, prix: '', designation: '', unite: '', quantite: 0 });
}

export default function EditDeliveryNotePage({ params }: { params: { id: string } }) {
    const [items, setItems] = React.useState(initialItems);

    const handleItemChange = (id: number, field: string, value: any) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };
    
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title={`Modifier le Bon de Livraison ${params.id}`} />
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>BON DE LIVRAISON N° <Input className="w-[150px] inline-block" defaultValue={params.id}/> </CardTitle>
                        <div className="text-sm">
                            <Label htmlFor="invoice-date">Date: </Label>
                            <Input id="invoice-date" type="date" className="w-[150px] inline-block" defaultValue={"2024-07-26"} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Informations du Fournisseur</Label>
                            <Textarea placeholder="Raison Sociale, Direction,..." defaultValue="A.L.Y Travaux Publique\n123 Rue du Chantier, 75000 Paris" />
                        </div>
                        <div className="space-y-2">
                            <Label>Informations du Client</Label>
                            <Textarea placeholder="Raison Sociale, Direction,..." defaultValue={"Chantier Central\nZone Industrielle Nord, 93200 Saint-Denis"} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="project-ref">Référence du Projet</Label>
                        <Input id="project-ref" placeholder="Nombre o Referencia del Proyecto" defaultValue={"Construction Hangar H-05"}/>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Nº de PRIX</TableHead>
                                    <TableHead>DESIGNATION DES MATERIAUX</TableHead>
                                    <TableHead className="w-[100px]">UNITÉ</TableHead>
                                    <TableHead className="text-right w-[120px]">QUANTITÉ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Input value={item.prix} onChange={(e) => handleItemChange(item.id, 'prix', e.target.value)} className="h-8"/>
                                        </TableCell>
                                        <TableCell>
                                            <Input value={item.designation} onChange={(e) => handleItemChange(item.id, 'designation', e.target.value)} className="h-8"/>
                                        </TableCell>
                                        <TableCell>
                                            <Input value={item.unite} onChange={(e) => handleItemChange(item.id, 'unite', e.target.value)} className="h-8"/>
                                        </TableCell>
                                        <TableCell>
                                            <Input type="number" value={item.quantite} onChange={(e) => handleItemChange(item.id, 'quantite', parseFloat(e.target.value))} className="h-8 text-right"/>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                     <div className="w-full flex justify-between items-center mt-6 pt-6 border-t">
                        <div className="space-y-2 text-center">
                             <p className="font-semibold mb-8">Sceau et Signature (Livreur)</p>
                            <div className="w-48 h-24 border border-dashed rounded-md flex items-center justify-center text-muted-foreground">
                                Cachet & Signature
                            </div>
                        </div>
                         <div className="space-y-2 text-center">
                            <p className="font-semibold mb-8">Sceau et Signature (Client)</p>
                            <div className="w-48 h-24 border border-dashed rounded-md flex items-center justify-center text-muted-foreground">
                                Cachet & Signature
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-end gap-2">
                        <Button variant="outline">Annuler</Button>
                        <Button>Enregistrer les modifications</Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
