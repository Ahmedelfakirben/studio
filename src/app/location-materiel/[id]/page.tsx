
'use client';

import * as React from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Share2 } from 'lucide-react';
import Link from 'next/link';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const niveleuseData = [
    { date: '01/07/2024', bl: 'BL-N-01', jrs: 1, pu: 500 },
    { date: '02/07/2024', bl: 'BL-N-02', jrs: 1, pu: 500 },
    { date: '03/07/2024', bl: 'BL-N-03', jrs: 1, pu: 500 },
    { date: '04/07/2024', bl: 'BL-N-04', jrs: 1, pu: 500 },
    { date: '05/07/2024', bl: 'BL-N-05', jrs: 1, pu: 500 },
    { date: '08/07/2024', bl: 'BL-N-06', jrs: 1, pu: 500 },
];

const citerneData = [
    { date: '05/07/2024', bl: 'BL-C-01', v: 2, pu: 80 },
    { date: '06/07/2024', bl: 'BL-C-02', v: 3, pu: 80 },
    { date: '10/07/2024', bl: 'BL-C-03', v: 1, pu: 80 },
    { date: '12/07/2024', bl: 'BL-C-04', v: 2, pu: 80 },
];


export default function MaterialRentalDetailPage({ params }: { params: { id: string } }) {
    const totalNiveleuse = niveleuseData.reduce((sum, item) => sum + (item.jrs * item.pu), 0);
    const totalCiterne = citerneData.reduce((sum, item) => sum + (item.v * item.pu), 0);
    const grandTotal = totalNiveleuse + totalCiterne;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Location Matériel - Juillet 2024">
                 <Button variant="outline" asChild>
                    <Link href="/location-materiel">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Link>
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Partager
                    </Button>
                    <Button>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer / PDF
                    </Button>
                </div>
            </PageHeader>

            <Card>
                <CardHeader>
                    <CardTitle>Détail des Locations - {decodeURIComponent(params.id).replace('loc-', '').replace('-', ' ')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Tabla Niveleuse */}
                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-lg font-semibold text-primary">NIVELEUSE</h3>
                            <p className="text-sm font-medium">Fournisseur: RACHID</p>
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
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>{item.bl}</TableCell>
                                            <TableCell className="text-center">{item.jrs}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.pu)}</TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(item.jrs * item.pu)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-right font-bold text-base">TOTAL NIVELEUSE</TableCell>
                                        <TableCell className="text-right font-bold text-base">{formatCurrency(totalNiveleuse)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </div>

                    {/* Tabla Citerne */}
                    <div>
                         <div className="flex justify-between items-baseline mb-2">
                            <h3 className="text-lg font-semibold text-primary">CITERNE</h3>
                            <p className="text-sm font-medium">Fournisseur: REDA</p>
                        </div>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-1/5">DATE</TableHead>
                                        <TableHead className="w-1/5">N° BL</TableHead>
                                        <TableHead className="w-1/5 text-center">V</TableHead>
                                        <TableHead className="w-1/5 text-right">PU</TableHead>
                                        <TableHead className="w-1/5 text-right">PT</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {citerneData.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.date}</TableCell>
                                            <TableCell>{item.bl}</TableCell>
                                            <TableCell className="text-center">{item.v}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(item.pu)}</TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(item.v * item.pu)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-right font-bold text-base">TOTAL CITERNE</TableCell>
                                        <TableCell className="text-right font-bold text-base">{formatCurrency(totalCiterne)}</TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-6 mt-6 border-t">
                    <div className="w-full flex justify-end">
                        <div className="w-full max-w-xs space-y-2">
                            <div className="flex justify-between font-bold text-lg">
                                <span>TOTAL GÉNÉRAL HT:</span>
                                <span className="text-primary">{formatCurrency(grandTotal)}</span>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
