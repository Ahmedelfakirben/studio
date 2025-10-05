'use client'

import * as React from 'react';
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle, Printer, Trash2, Search } from "lucide-react"
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

export const initialGasExpenses = [
    { id: 1, date: '01/07/2024', bl: 'BL-G-001', ds: 'Véhicule A - Gasoil', mt: 55.50 },
    { id: 2, date: '02/07/2024', bl: 'BL-G-002', ds: 'Véhicule B - Gasoil', mt: 62.00 },
    { id: 3, date: '03/07/2024', bl: 'BL-G-003', ds: 'Camion 1 - Gasoil', mt: 150.25 },
    { id: 4, date: '04/07/2024', bl: 'BL-G-004', ds: 'Véhicule A - Gasoil', mt: 58.75 },
    { id: 5, date: '05/07/2024', bl: 'BL-G-005', ds: 'Groupe Électrogène', mt: 45.00 },
    { id: 6, date: '08/07/2024', bl: 'BL-G-006', ds: 'Camion 2 - AdBlue', mt: 30.00 },
    { id: 7, date: '09/07/2024', bl: 'BL-G-007', ds: 'Véhicule B - Gasoil', mt: 61.30 },
    { id: 8, date: '10/07/2024', bl: 'BL-G-008', ds: 'Camion 1 - Gasoil', mt: 145.80 },
    { id: 9, date: '11/07/2024', bl: 'BL-G-009', ds: 'Véhicule A - Gasoil', mt: 59.90 },
    { id: 10, date: '12/07/2024', bl: 'BL-G-010', ds: 'Nacelle - Essence', mt: 35.00 },
];

type Expense = typeof initialGasExpenses[0];

export default function GasExpensesPage() {
    const [expenses, setExpenses] = React.useState(initialGasExpenses);
    const [searchTerm, setSearchTerm] = React.useState('');
    const { toast } = useToast();

    const handleDelete = (expenseToDelete: Expense) => {
        const user = "Admin Doe"; 
        const event = {
            type: "Suppression de dépense",
            date: new Date().toISOString(),
            user: user,
            details: `Le gasto d'essence avec BL N° ${expenseToDelete.bl} d'un montant de ${formatCurrency(expenseToDelete.mt)} a été supprimé.`,
        };

        const storedEvents = JSON.parse(localStorage.getItem('app_events') || '[]');
        localStorage.setItem('app_events', JSON.stringify([...storedEvents, event]));
        
        setExpenses(currentExpenses => currentExpenses.filter(expense => expense.id !== expenseToDelete.id));
        
        toast({
            title: "Dépense supprimée",
            description: `Le gasto avec BL N° ${expenseToDelete.bl} a été supprimé avec succès.`,
        });
    };

    const filteredExpenses = expenses.filter(expense => 
        expense.bl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.ds.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalTTC = filteredExpenses.reduce((sum, expense) => sum + expense.mt, 0);

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
                     <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Filtrer par N° BL ou désignation..."
                            className="w-full rounded-lg bg-muted pl-8 md:w-[320px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-1/4">DATE</TableHead>
                                    <TableHead className="w-1/4">N° BL</TableHead>
                                    <TableHead className="w-1/2">DESIGNATION DU SERVICE</TableHead>
                                    <TableHead className="text-right">MONTANT</TableHead>
                                    <TableHead className="w-[100px] text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredExpenses.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell>{expense.date}</TableCell>
                                        <TableCell>{expense.bl}</TableCell>
                                        <TableCell>{expense.ds}</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(expense.mt)}</TableCell>
                                        <TableCell className="text-center">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Cette action est irréversible. Le gasto sera définitivement supprimé et un événement sera enregistré dans l'historique.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(expense)}
                                                            className="bg-destructive hover:bg-destructive/90"
                                                        >
                                                            Supprimer
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                 <TableRow>
                                    <TableCell colSpan={3} className="text-right font-bold text-base text-primary">TOTAL TTC</TableCell>
                                    <TableCell className="text-right font-bold text-base text-primary">{formatCurrency(totalTTC)}</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
