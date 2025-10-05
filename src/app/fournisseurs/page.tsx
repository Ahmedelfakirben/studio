
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle, MoreHorizontal } from "lucide-react"
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

const fournisseurs = [
    {
        id: "fourn-001",
        name: "Matériaux Express",
        initials: "ME",
        totalBilled: "15,820.00€",
    },
    {
        id: "fourn-002",
        name: "Béton Pro",
        initials: "BP",
        totalBilled: "2,500.00€",
    },
    {
        id: "fourn-003",
        name: "Acier Durable S.L.",
        initials: "AD",
        totalBilled: "9,750.00€",
    },
]

export default function FournisseursPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Fournisseurs">
                 <Button asChild>
                    <Link href="/factures/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un fournisseur
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Fournisseurs</CardTitle>
                    <CardDescription>Consultez et gérez tous vos fournisseurs.</CardDescription>
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
                                                     <Link href="/factures/new">Modifier</Link>
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
