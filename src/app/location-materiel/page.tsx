'use client'

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MoreHorizontal, Search } from "lucide-react"
import Link from "next/link"
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
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchInput } from "@/components/search-input"
import { locationMaterielService } from "@/lib/api"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/formatters"

interface LocationMateriel {
    id: string;
    titulo: string;
    periodo: string;
    totalGeneral: number;
    createdAt: string;
    updatedAt: string;
}

export default function MaterialRentalListPage({ searchParams }: { searchParams: { search?: string } }) {
    const sParams = useSearchParams();
    const searchTerm = sParams.get('search') || '';
    const [rentalSheets, setRentalSheets] = useState<LocationMateriel[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchRentalSheets = async () => {
            try {
                setLoading(true);
                const response = await locationMaterielService.getAll();
                let data = response.data;

                // Filter by search term if provided
                if (searchTerm) {
                    data = data.filter((sheet: LocationMateriel) =>
                        sheet.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        sheet.periodo.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                setRentalSheets(data);
            } catch (error: any) {
                console.error('Error fetching rental sheets:', error);
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de charger les feuilles de location. " + (error.response?.data?.message || error.message),
                });
            } finally {
                setLoading(false);
            }
        };

        fetchRentalSheets();
    }, [searchTerm, toast]);

    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('fr-FR');
    };
    
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Location de Matériel">
                <Button asChild>
                    <Link href="/location-materiel/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Créer une feuille de location
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Suivi des Locations</CardTitle>
                    <CardDescription>Consultez et gérez vos feuilles de location mensuelles.</CardDescription>
                     <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <SearchInput placeholder="Filtrer par mois ou statut..." />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-muted-foreground">Chargement...</p>
                        </div>
                    ) : rentalSheets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <p className="text-muted-foreground">Aucune feuille de location trouvée.</p>
                            <Button className="mt-4" asChild>
                                <Link href="/location-materiel/new">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Créer la première feuille
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Document</TableHead>
                                    <TableHead>Période</TableHead>
                                    <TableHead>Date de création</TableHead>
                                    <TableHead className="text-right">Montant Total</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rentalSheets.map((sheet) => (
                                    <TableRow key={sheet.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/location-materiel/${sheet.id}`} className="hover:underline">
                                                {sheet.titulo}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{sheet.periodo}</TableCell>
                                        <TableCell>{formatDate(sheet.createdAt)}</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(sheet.totalGeneral)}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/location-materiel/${sheet.id}`}>Voir le détail</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/location-materiel/${sheet.id}/edit`}>Modifier</Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
