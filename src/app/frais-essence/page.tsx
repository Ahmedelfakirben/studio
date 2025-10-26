
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
import { useSearchParams } from 'next/navigation';
import { SearchInput } from '@/components/search-input';
import { fraisEssenceService } from '@/lib/api';


const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

interface Expense {
    id: string;
    fecha: string;
    numeroBL: string;
    designacionServicio: string;
    monto: number;
}

export default function GasExpensesPage({ searchParams }: { searchParams: { search?: string } }) {
    const sParams = useSearchParams();
    const searchTerm = sParams.get('search') || '';
    const [expenses, setExpenses] = React.useState<Expense[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    // Fetch expenses from API
    const fetchExpenses = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await fraisEssenceService.getAll();
            let data = response.data;

            // Filter by search term if provided
            if (searchTerm) {
                data = data.filter((expense: Expense) =>
                    expense.numeroBL.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    expense.designacionServicio.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            setExpenses(data);
        } catch (error: any) {
            console.error('Error fetching expenses:', error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger les dépenses. " + (error.response?.data?.message || error.message),
            });
        } finally {
            setLoading(false);
        }
    }, [searchTerm, toast]);

    React.useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleDelete = async (expenseToDelete: Expense) => {
        try {
            await fraisEssenceService.delete(expenseToDelete.id);

            toast({
                title: "Dépense supprimée",
                description: `Le gasto avec BL N° ${expenseToDelete.numeroBL} a été supprimé avec succès.`,
            });

            // Refresh the list
            fetchExpenses();
        } catch (error: any) {
            console.error('Error deleting expense:', error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de supprimer la dépense. " + (error.response?.data?.message || error.message),
            });
        }
    };

    const totalTTC = expenses.reduce((sum, expense) => sum + expense.monto, 0);

    // Format date from ISO to DD/MM/YYYY
    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('fr-FR');
    };

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
                    <CardDescription>STATION AFRIQUIA - {new Date().getFullYear()}</CardDescription>
                     <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <SearchInput placeholder="Filtrer par N° BL ou désignation..." />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-muted-foreground">Chargement...</p>
                        </div>
                    ) : expenses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <p className="text-muted-foreground">Aucune dépense trouvée.</p>
                            <Button className="mt-4">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Ajouter la première dépense
                            </Button>
                        </div>
                    ) : (
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
                                            <TableCell>{formatDate(expense.fecha)}</TableCell>
                                            <TableCell>{expense.numeroBL}</TableCell>
                                            <TableCell>{expense.designacionServicio}</TableCell>
                                            <TableCell className="text-right font-medium">{formatCurrency(expense.monto)}</TableCell>
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
                                                                Cette action est irréversible. Le gasto sera définitivement supprimé.
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
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
