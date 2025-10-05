import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
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

const preInvoices = [
    {
        id: "PRE-001",
        client: "Chantier A",
        date: "2024-07-10",
        status: "brouillon",
        amount: "5,500.00€",
    },
    {
        id: "PRE-002",
        client: "Projet B",
        date: "2024-07-12",
        status: "envoyée",
        amount: "1,200.00€",
    },
    {
        id: "PRE-003",
        client: "Chantier C",
        date: "2024-07-14",
        status: "approuvée",
        amount: "8,900.50€",
    },
    {
        id: "PRE-004",
        client: "Projet D",
        date: "2024-07-18",
        status: "brouillon",
        amount: "2,100.00€",
    },
];

const getStatusBadgeVariant = (status: string) => {
    switch (status) {
        case "approuvée":
            return "secondary";
        case "envoyée":
            return "outline";
        case "brouillon":
            return "default";
        default:
            return "default";
    }
}

export default function PreInvoicesPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Préfactures">
                <Button asChild>
                    <Link href="/prefactures/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Créer une préfacture
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Préfactures</CardTitle>
                    <CardDescription>Créez, envoyez et suivez vos préfactures.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Préfacture</TableHead>
                                <TableHead>Client / Chantier</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Montant Estimé</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {preInvoices.map((invoice) => (
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