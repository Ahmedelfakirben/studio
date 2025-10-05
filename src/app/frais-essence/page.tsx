
'use client'

import * as React from 'react';
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle, Printer } from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@/components/ui/table"

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const gasExpenses = [
    { date: '01/07/2024', bl: 'BL-G-001', ds: 'Véhicule A - Gasoil', mt: 55.50 },
    { date: '02/07/2024', bl: 'BL-G-002', ds: 'Véhicule B - Gasoil', mt: 62.00 },
    { date: '03/07/2024', bl: 'BL-G-003', ds: 'Camion 1 - Gasoil', mt: 150.25 },
    { date: '04/07/2024', bl: 'BL-G-004', ds: 'Véhicule A - Gasoil', mt: 58.75 },
    { date: '05/07/2024', bl: 'BL-G-005', ds: 'Groupe Électrogène', mt: 45.00 },
    { date: '08/07/2024', bl: 'BL-G-006', ds: 'Camion 2 - AdBlue', mt: 30.00 },
    { date: '09/07/2024', bl: 'BL-G-007', ds: 'Véhicule B - Gasoil', mt: 61.30 },
    { date: '10/07/2024', bl: 'BL-G-008', ds: 'Camion 1 - Gasoil', mt: 145.80 },
    { date: '11/07/2024', bl: 'BL-G-009', ds: 'Véhicule A - Gasoil', mt: 59.90 },
    { date: '12/07/2024', bl: 'BL-G-010', ds: 'Nacelle - Essence', mt: 35.00 },
];

export default function GasExpensesPage() {

    const totalTTC = gasExpenses.reduce((sum, expense) => sum + expense.mt, 0);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Frais d'Essence">
                <div className="flex items-center gap-2">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une dépense
                    </Button>
                     <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer / PDF
                    </Button>
                </div>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Suivi des Dépenses de Carburant</CardTitle>
                    <CardDescription>STATION AFRIQUIA - Juillet 2024</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-1/4">DATE</TableHead>
                                    <TableHead className="w-1/4">N° BL</TableHead>
                                    <TableHead className="w-1/2">DESIGNATION DU SERVICE</TableHead>
                                    <TableHead className="text-right">MONTANT TOTAL</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {gasExpenses.map((expense, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{expense.date}</TableCell>
                                        <TableCell>{expense.bl}</TableCell>
                                        <TableCell>{expense.ds}</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(expense.mt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                 <TableRow>
                                    <TableCell colSpan={3} className="text-right font-bold text-base text-primary">TOTAL TTC</TableCell>
                                    <TableCell className="text-right font-bold text-base text-primary">{formatCurrency(totalTTC)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
