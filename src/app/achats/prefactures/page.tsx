"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/search-input";
import { prefacturasAchatService } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function PrefacturesAchatPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const searchTerm = searchParams ? searchParams.get("search") || "" : "";
    
    const [prefactures, setPrefactures] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar prefacturas
    useEffect(() => {
        const fetchPrefactures = async () => {
            try {
                setIsLoading(true);
                const response = await prefacturasAchatService.getAll();
                setPrefactures(response.data);
            } catch (error: any) {
                toast({
                    title: "Error",
                    description: error.response?.data?.mensaje || "Error al cargar las prefacturas",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrefactures();
    }, [toast, searchTerm]);

    // Filtrar prefacturas según el término de búsqueda
    const filteredPrefactures = prefactures.filter(
        p => 
            p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.proveedor.razonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Función para determinar el color de la insignia según el estado
    const getBadgeVariant = (status: string) => {
        switch (status) {
            case "Approuvée":
                return "secondary";
            case "Refusée":
                return "destructive";
            default:
                return "outline";
        }
    };

    // Formatear moneda
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Préfactures (Achat)">
                <Button asChild>
                    <Link href="/achats/prefactures/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une préfacture
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Préfactures d'Achat</CardTitle>
                    <CardDescription>Consultez et gérez toutes vos préfactures fournisseurs.</CardDescription>
                    <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <SearchInput placeholder="Filtrer par N°, fournisseur ou statut..." />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        // Mostrar esqueletos mientras se carga
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Préfacture</TableHead>
                                    <TableHead>Fournisseur</TableHead>
                                    <TableHead>Date d'émission</TableHead>
                                    <TableHead className="text-right">Montant</TableHead>
                                    <TableHead className="text-center">Statut</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPrefactures.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            Aucune préfacture trouvée
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPrefactures.map((prefacture) => (
                                        <TableRow key={prefacture._id}>
                                            <TableCell className="font-medium">{prefacture.numero}</TableCell>
                                            <TableCell>{prefacture.proveedor.razonSocial}</TableCell>
                                            <TableCell>{prefacture.fecha}</TableCell>
                                            <TableCell className="text-right">{formatCurrency(prefacture.totalTTC)}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant={getBadgeVariant(prefacture.status)}>
                                                    {prefacture.status}
                                                </Badge>
                                            </TableCell>
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
                                                        <DropdownMenuItem 
                                                            onClick={() => router.push(`/achats/prefactures/${prefacture._id}`)}
                                                        >
                                                            Voir le détail
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => router.push(`/achats/prefactures/${prefacture._id}/edit`)}
                                                        >
                                                            Modifier
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
