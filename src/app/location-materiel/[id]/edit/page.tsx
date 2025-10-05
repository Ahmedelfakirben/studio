
'use client';

import * as React from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter as ShadcnTableFooter } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const initialNiveleuseData = [
    { id: 1, date: '2024-07-01', bl: 'BL-N-01', jrs: 1, pu: 500 },
    { id: 2, date: '2024-07-02', bl: 'BL-N-02', jrs: 1, pu: 500 },
    { id: 3, date: '2024-07-03', bl: 'BL-N-03', jrs: 1, pu: 500 },
    { id: 4, date: '2024-07-04', bl: 'BL-N-04', jrs: 1, pu: 500 },
    { id: 5, date: '2024-07-05', bl: 'BL-N-05', jrs: 1, pu: 500 },
    { id: 6, date: '2024-07-08', bl: 'BL-N-06', jrs: 1, pu: 500 },
];

const initialCiterneData = [
    { id: 1, date: '2024-07-05', bl: 'BL-C-01', v: 2, pu: 80 },
    { id: 2, date: '2024-07-06', bl: 'BL-C-02', v: 3, pu: 80 },
    { id: 3, date: '2024-07-10', bl: 'BL-C-03', v: 1, pu: 80 },
    { id: 4, date: '2024-07-12', bl: 'BL-C-04', v: 2, pu: 80 },
];

export default function EditMaterialRentalPage({ params }: { params: { id: string } }) {
    const [niveleuseData, setNiveleuseData] = React.useState(initialNiveleuseData);
    const [citerneData, setCiterneData] = React.useState(initialCiterneData);

    const title = params.id ? `Modifier Location - ${decodeURIComponent(params.id).replace('loc-', '').replace(/-/g, ' ')}` : 'Modifier Location';
    
    const totalNiveleuse = niveleuseData.reduce((sum, item) => sum + (item.jrs * item.pu), 0);
    const totalCiterne = citerneData.reduce((sum, item) => sum + (item.v * item.pu), 0);
    const grandTotal = totalNiveleuse + totalCiterne;
    
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title={title}>
                 <Button variant="outline" asChild>
                    <Link href="/location-materiel">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Link>
                </Button>
            </PageHeader>

            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Tabla Niveleuse */}
                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-lg font-semibold text-primary">NIVELEUSE</h3>
                             <div className="flex items-center gap-2">
                                <Label>Fournisseur:</Label>
                                <Input className="w-[150px]" defaultValue="RACHID" />
                            </div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-1/5">DATE</TableHead>
                                        <TableHead className="w-1/5">N° BL</TableHead>
                                        <TableHead className="w-1/5 text-center">JRS</TableHead>
                                        <TableHead className="w-1/5 text-right">PU</TableHead>
                                        <TableHead className="w-1/5 text-right">PT</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {niveleuseData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Input type="date" className="h-8" defaultValue={item.date} /></TableCell>
                                            <TableCell><Input className="h-8" defaultValue={item.bl} /></TableCell>
                                            <TableCell><Input type="number" className="h-8 text-center" defaultValue={item.jrs} /></TableCell>
                                            <TableCell><Input type="number" className="h-8 text-right" defaultValue={item.pu} /></TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(item.jrs * item.pu)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <ShadcnTableFooter>
                                     <TableRow>
                                        <TableCell colSpan={4} className="text-right font-bold text-base">TOTAL NIVELEUSE</TableCell>
                                        <TableCell className="text-right font-bold text-base">{formatCurrency(totalNiveleuse)}</TableCell>
                                    </TableRow>
                                </ShadcnTableFooter>
                            </Table>
                        </div>
                    </div>

                    {/* Tabla Citerne */}
                    <div>
                         <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-lg font-semibold text-primary">CITERNE</h3>
                            <div className="flex items-center gap-2">
                                <Label>Fournisseur:</Label>
                                <Input className="w-[150px]" defaultValue="REDA" />
                            </div>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-1/5">DATE</TableHead>
                                        <TableHead className="w-1/5">N° BL</TableHead>
                                        <TableHead className="w-1/5 text-center">V</TableHead>
                                        <TableHead className="w-1/5 text-right">PU</TableHead>
                                        <TableHead className="w-1/s text-right">PT</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {citerneData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell><Input type="date" className="h-8" defaultValue={item.date} /></TableCell>
                                            <TableCell><Input className="h-8" defaultValue={item.bl} /></TableCell>
                                            <TableCell><Input type="number" className="h-8 text-center" defaultValue={item.v} /></TableCell>
                                            <TableCell><Input type="number" className="h-8 text-right" defaultValue={item.pu} /></TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(item.v * item.pu)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <ShadcnTableFooter>
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-right font-bold text-base">TOTAL CITERNE</TableCell>
                                        <TableCell className="text-right font-bold text-base">{formatCurrency(totalCiterne)}</TableCell>
                                    </TableRow>
                                </ShadcnTableFooter>
                            </Table>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-6 mt-6 border-t flex flex-col items-end gap-4">
                     <div className="w-full max-w-xs space-y-2">
                        <div className="flex justify-between font-bold text-lg">
                            <span>TOTAL GÉNÉRAL HT:</span>
                            <span className="text-primary">{formatCurrency(grandTotal)}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">Annuler</Button>
                        <Button>Enregistrer les modifications</Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
