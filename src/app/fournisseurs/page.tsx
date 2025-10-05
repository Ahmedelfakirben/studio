import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAllFournisseurs } from "@/lib/data"
import { SearchInput } from "@/components/search-input"

export default function FournisseursPage({ searchParams }: { searchParams: { search?: string } }) {
    const searchTerm = searchParams.search || '';
    const fournisseurs = getAllFournisseurs(searchTerm);

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Fournisseurs">
                 <Button asChild>
                    <Link href="/fournisseurs/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un fournisseur
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Fournisseurs</CardTitle>
                    <CardDescription>Consultez et gérez tous vos fournisseurs.</CardDescription>
                     <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <SearchInput placeholder="Filtrer par nom..." />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fournisseur</TableHead>
                                <TableHead className="text-right">Total Acheté</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fournisseurs.map((fournisseur) => (
                                <TableRow key={fournisseur.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{fournisseur.initials}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{fournisseur.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{fournisseur.totalBilled}</TableCell>
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
                                                <DropdownMenuItem>Voir le détail</DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/fournisseurs/${fournisseur.id}/edit`}>Modifier</Link>
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
