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
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { initialGasExpenses, getGasExpenses } from '@/lib/data';
import { SearchInput } from '@/components/search-input';


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

type Expense = typeof initialGasExpenses[0];

export default function GasExpensesPage({ searchParams }: { searchParams: { search?: string } }) {
    // This page must remain a client component because it has state management for deleting items.
    const searchTerm = searchParams.search || '';
    const [expenses, setExpenses] = React.useState(() => getGasExpenses(searchTerm));
    const { toast } = useToast();
    
    React.useEffect(() => {
        setExpenses(getGasExpenses(searchTerm));
    }, [searchTerm]);

    const handleDelete = (expenseToDelete: Expense) => {
        const user = "Admin Doe"; 
        const event = {
            type: "Suppression de dépense",
            date: new Date().toISOString(),
            user: user,
            details: `Le gasto d'essence avec BL N° ${expenseToDelete.bl} d'un montant de ${formatCurrency(expenseToDelete.mt)} a été supprimé.`,
        };

        // In a real app, this would be an API call. Here we use localStorage for demonstration.
        const storedEvents = JSON.parse(localStorage.getItem('app_events') || '[]');
        localStorage.setItem('app_events', JSON.stringify([...storedEvents, event]));
        
        // This is a mock deletion. In a real app, you'd call an API and then refetch the data.
        setExpenses(currentExpenses => currentExpenses.filter(expense => expense.id !== expenseToDelete.id));
        
        toast({
            title: "Dépense supprimée",
            description: `Le gasto avec BL N° ${expenseToDelete.bl} a été supprimé avec succès.`,
        });
    };

    const totalTTC = expenses.reduce((sum, expense) => sum + expense.mt, 0);

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
                        <SearchInput placeholder="Filtrer par N° BL ou désignation..." />
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
                                {expenses.map((expense) => (
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
