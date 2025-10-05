import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle, File as FileIcon } from "lucide-react"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const invoices = [
    {
        id: "FAC-001",
        client: "Dupont S.A.",
        date: "2024-06-15",
        status: "payée",
        amount: "1,250.00€",
    },
    {
        id: "FAC-002",
        client: "Martin & Fils",
        date: "2024-06-20",
        status: "en attente",
        amount: "850.50€",
    },
    {
        id: "FAC-003",
        client: "Bernard TP",
        date: "2024-06-22",
        status: "en retard",
        amount: "3,200.00€",
    },
    {
        id: "FAC-004",
        client: "Petit Terrassement",
        date: "2024-07-01",
        status: "payée",
        amount: "500.00€",
    },
    {
        id: "FAC-005",
        client: "Leroy VRD",
        date: "2024-07-05",
        status: "en attente",
        amount: "1,800.75€",
    },
];

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case "payée":
            return "secondary";
        case "en attente":
            return "outline";
        case "en retard":
            return "destructive";
        default:
            return "default";
    }
}


export default function InvoicesPage() {
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
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Montant</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.client}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(invoice.status)} className="capitalize">{invoice.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{invoice.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}