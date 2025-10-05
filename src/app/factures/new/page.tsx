'use client';

import * as React from 'react';
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Trash2 } from 'lucide-react';

const initialItems = [
    { id: 1, prix: '1.1', designation: 'Déblais toute nature y compris rocher aux explosifs', unite: 'm3', quantite: 0, prixUnitaire: 0 },
    { id: 2, prix: '1.2', designation: 'Remblais régalés par couches successives', unite: 'm3', quantite: 0, prixUnitaire: 0 },
    { id: 3, prix: '2.1', designation: 'Couche de fondation en grave 0/31.5', unite: 'm3', quantite: 0, prixUnitaire: 0 },
    { id: 4, prix: '2.2', designation: 'Couche de base en grave 0/20', unite: 'm2', quantite: 0, prixUnitaire: 0 },
    { id: 5, prix: '2.3', designation: 'Revêtement en béton bitumineux 0/10', unite: 'm2', quantite: 0, prixUnitaire: 0 },
    { id: 6, prix: '3.1', designation: 'Bordures type T2', unite: 'mL', quantite: 0, prixUnitaire: 0 },
    { id: 7, prix: '3.2', designation: 'Caniveaux type CS1', unite: 'mL', quantite: 0, prixUnitaire: 0 },
    { id: 8, prix: '4.1', designation: 'Tuyaux PVC série 1 Ø400', unite: 'mL', quantite: 0, prixUnitaire: 0 },
    { id: 9, prix: '4.2', designation: 'Regard de visite 100x100', unite: 'U', quantite: 0, prixUnitaire: 0 },
    { id: 10, prix: '5.1', designation: 'Fourniture et pose de signalisation verticale des carrefours', unite: 'U', quantite: 0, prixUnitaire: 0 },
];

// Fill up to 20 items
for (let i = initialItems.length + 1; i <= 20; i++) {
    initialItems.push({ id: i, prix: '', designation: '', unite: '', quantite: 0, prixUnitaire: 0 });
}


export default function NewInvoicePage() {
    const [items, setItems] = React.useState(initialItems);
    const [totalHT, setTotalHT] = React.useState(0);
    const [tva, setTva] = React.useState(0);
    const [totalTTC, setTotalTTC] = React.useState(0);

    const handleItemChange = (id: number, field: string, value: any) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const calculateTotals = React.useCallback(() => {
        const newTotalHT = items.reduce((sum, item) => {
            const quantite = Number(item.quantite) || 0;
            const prixUnitaire = Number(item.prixUnitaire) || 0;
            return sum + (quantite * prixUnitaire);
        }, 0);

        const newTva = newTotalHT * 0.20;
        const newTotalTTC = newTotalHT + newTva;

        setTotalHT(newTotalHT);
        setTva(newTva);
        setTotalTTC(newTotalTTC);
    }, [items]);

    React.useEffect(() => {
        calculateTotals();
    }, [items, calculateTotals]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
    }
    
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Créer une Facture" />
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>FACTURE N° <Input className="w-[150px] inline-block" placeholder="..."/> </CardTitle>
                        <div className="text-sm">
                            <Label htmlFor="invoice-date">Date de Facture: </Label>
                            <Input id="invoice-date" type="date" className="w-[150px] inline-block" defaultValue={new Date().toISOString().substring(0, 10)} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Informations du Proveedor</Label>
                            <Textarea placeholder="Razón Social, Dirección, N° de Identificación Fiscal/Patente" defaultValue="A.L.Y Travaux Publique\n123 Rue du Chantier, 75000 Paris\nFR 12 345678901" />
                        </div>
                        <div className="space-y-2">
                            <Label>Informations du Client</Label>
                            <Textarea placeholder="Razón Social, Dirección, N° de Identificación Fiscal" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="project-ref">Referencia del Proyecto</Label>
                        <Input id="project-ref" placeholder="Nombre o Referencia del Proyecto" />
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Nº de PRIX</TableHead>
                                    <TableHead>DESIGNATION DES OUVRAGES</TableHead>
                                    <TableHead className="w-[100px]">UNITÉ</TableHead>
                                    <TableHead className="w-[120px]">QUANTITÉ</TableHead>
                                    <TableHead className="w-[180px]">PRIX UNITAIRE HT</TableHead>
                                    <TableHead className="text-right w-[180px]">MONTANT HT</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => {
                                    const montant = (Number(item.quantite) || 0) * (Number(item.prixUnitaire) || 0);
                                    return (
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
                                            <TableCell>
                                                <Input type="number" value={item.prixUnitaire} onChange={(e) => handleItemChange(item.id, 'prixUnitaire', parseFloat(e.target.value))} className="h-8 text-right"/>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(montant)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end">
                        <div className="w-full max-w-sm space-y-2">
                             <div className="flex justify-between">
                                <span>MONTANT HT:</span>
                                <span>{formatCurrency(totalHT)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>TVA 20%:</span>
                                <span>{formatCurrency(tva)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                <span>MONTANT TTC:</span>
                                <span className="text-primary">{formatCurrency(totalTTC)}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-4">
                     <div className="w-full space-y-2">
                        <Label htmlFor="total-in-words">Arrêté la présente facture à la somme de:</Label>
                        <Textarea id="total-in-words" placeholder="... euros et ... centimes" />
                    </div>
                     <div className="w-full flex justify-between items-center">
                        <div className="space-y-2">
                            <Label htmlFor="place-date">Fait à:</Label>
                            <div className="flex gap-2">
                                <Input id="place-date" placeholder="Ciudad" className="w-[150px]"/>
                                <Input type="date" className="w-[150px]" defaultValue={new Date().toISOString().substring(0, 10)}/>
                            </div>
                        </div>
                        <div className="space-y-2 text-center">
                            <Label>Sello y Firma</Label>
                            <div className="w-48 h-24 border border-dashed rounded-md flex items-center justify-center text-muted-foreground">
                                Cachet & Signature
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex justify-end gap-2">
                        <Button variant="outline">Sauvegarder en Brouillon</Button>
                        <Button>Générer la Facture</Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
