
'use client';
import * as React from 'react';
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
import { Input } from '@/components/ui/input';

const allInvoices = [
    {
        id: "FA-2024-001",
        fournisseur: "Matériaux Express",
        date: "2024-07-25",
        amount: "15,820.00€",
        status: "Payée",
    },
    {
        id: "FA-2024-002",
        fournisseur: "Béton Pro",
        date: "2024-07-15",
        amount: "2,500.00€",
        status: "En attente",
    },
];

export default function FacturesAchatPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const invoices = allInvoices.filter(invoice => 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Factures (Achat)">
                 <Button asChild>
                    <Link href="/achats/factures/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une facture
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Factures d'Achat</CardTitle>
                    <CardDescription>Consultez et gérez toutes vos factures fournisseurs.</CardDescription>
                     <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Filtrer par N°, fournisseur ou statut..."
                            className="w-full rounded-lg bg-muted pl-8 md:w-[320px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Facture</TableHead>
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
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.id}</TableCell>
                                    <TableCell>{invoice.fournisseur}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell className="text-right">{invoice.amount}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={
                                            invoice.status === "Payée" ? "secondary" : "outline"
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
                                                <DropdownMenuItem>Voir le détail</DropdownMenuItem>
                                                <DropdownMenuItem>Payer</DropdownMenuItem>
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
