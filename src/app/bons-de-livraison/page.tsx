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
import { getAllDeliveryNotes } from "@/lib/data"
import { SearchInput } from "@/components/search-input"

export default function DeliveryNotesListPage({ searchParams }: { searchParams: { search?: string } }) {
    const searchTerm = searchParams.search || '';
    const deliveryNotes = getAllDeliveryNotes(searchTerm);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Bons de Livraison">
                <Button asChild>
                    <Link href="/factures/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Créer un bon
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Bons de Livraison</CardTitle>
                    <CardDescription>Consultez et gérez tous vos bons de livraison.</CardDescription>
                     <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <SearchInput placeholder="Filtrer par N°, client ou statut..." />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Bon de Livraison</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deliveryNotes.map((note) => (
                                <TableRow key={note.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/bons-de-livraison/${note.id}`} className="hover:underline">
                                            {note.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{note.client}</TableCell>
                                    <TableCell>{note.date}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={
                                            note.status === "Livré" ? "secondary" 
                                            : note.status === "Annulé" ? "destructive" 
                                            : "outline"
                                        }>
                                            {note.status}
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
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/bons-de-livraison/${note.id}`}>Voir le détail</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                   <Link href={`/bons-de-livraison/${note.id}/edit`}>Modifier</Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
