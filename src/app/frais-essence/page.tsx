
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from 'next/navigation';
import { SearchInput } from '@/components/search-input';
import { fraisEssenceService } from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';

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
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const { toast } = useToast();

    // Form state
    const [formData, setFormData] = React.useState({
        fecha: new Date().toISOString().split('T')[0],
        numeroBL: '',
        designacionServicio: '',
        monto: 0
    });

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

    const handleCreate = async () => {
        // Validation
        if (!formData.numeroBL.trim() || !formData.designacionServicio.trim() || formData.monto <= 0) {
            toast({
                variant: "destructive",
                title: "Erreur de validation",
                description: "Veuillez remplir tous les champs requis.",
            });
            return;
        }

        try {
            setSaving(true);
            await fraisEssenceService.create(formData);

            toast({
                title: "Dépense créée",
                description: "La dépense a été créée avec succès.",
            });

            // Reset form
            setFormData({
                fecha: new Date().toISOString().split('T')[0],
                numeroBL: '',
                designacionServicio: '',
                monto: 0
            });

            setIsDialogOpen(false);
            fetchExpenses();
        } catch (error: any) {
            console.error('Error creating expense:', error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de créer la dépense. " + (error.response?.data?.message || error.message),
            });
        } finally {
            setSaving(false);
        }
    };

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
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Ajouter une dépense
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nouvelle Dépense de Carburant</DialogTitle>
                                <DialogDescription>
                                    Ajoutez une nouvelle dépense de carburant à la liste.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="fecha">Date *</Label>
                                    <Input
                                        id="fecha"
                                        type="date"
                                        value={formData.fecha}
                                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="numeroBL">N° BL *</Label>
                                    <Input
                                        id="numeroBL"
                                        placeholder="ex: BL-001"
                                        value={formData.numeroBL}
                                        onChange={(e) => setFormData({ ...formData, numeroBL: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="designacionServicio">Désignation du Service *</Label>
                                    <Input
                                        id="designacionServicio"
                                        placeholder="ex: Carburant Diesel"
                                        value={formData.designacionServicio}
                                        onChange={(e) => setFormData({ ...formData, designacionServicio: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="monto">Montant (€) *</Label>
                                    <Input
                                        id="monto"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={formData.monto}
                                        onChange={(e) => setFormData({ ...formData, monto: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Annuler
                                </Button>
                                <Button onClick={handleCreate} disabled={saving}>
                                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={() => window.print()}>
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
                            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
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
