
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MoreHorizontal, FileDown } from "lucide-react"
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

const invoices = [
    {
        id: "FAC-2024-001",
        client: "Mairie de Ville-Haute",
        date: "2024-07-26",
        amount: "51,648.00€",
        status: "Payée",
    },
    {
        id: "FAC-2024-002",
        client: "Constructa S.A.",
        date: "2024-07-15",
        amount: "12,350.50€",
        status: "En attente",
    },
    {
        id: "FAC-2024-003",
        client: "BTP-IDF",
        date: "2024-07-05",
        amount: "8,900.00€",
        status: "En retard",
    },
     {
        id: "FAC-2024-004",
        client: "Chantier Central",
        date: "2024-06-28",
        amount: "23,450.00€",
        status: "Payée",
    },
]

export default function InvoicesListPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Factures">
                <Button asChild>
                    <Link href="/factures/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Créer une facture
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Factures</CardTitle>
                    <CardDescription>Consultez et gérez toutes vos factures.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Facture</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Date d'émission</TableHead>
                                <TableHead className="text-right">Montant</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/factures/${invoice.id}`} className="hover:underline">
                                            {invoice.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{invoice.client}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell className="text-right">{invoice.amount}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={
                                            invoice.status === "Payée" ? "secondary" : invoice.status === "En retard" ? "destructive" : "outline"
                                        }>
                                            {invoice.status}
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
                                                    <Link href={`/factures/${invoice.id}`}>Voir le détail</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/factures/${invoice.id}/edit`}>Modifier</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <FileDown className="mr-2 h-4 w-4" />
                                                    Télécharger
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
