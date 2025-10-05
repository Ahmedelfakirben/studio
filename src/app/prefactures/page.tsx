
'use client';
import * as React from 'react';
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MoreHorizontal, FileDown, Search } from "lucide-react"
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

const allPreInvoices = [
    {
        id: "PRE-2024-001",
        client: "Client S.A.",
        date: "2024-07-25",
        amount: "28,202.50€",
        status: "Approuvée",
    },
    {
        id: "PRE-2024-002",
        client: "Mairie de Ville-Haute",
        date: "2024-07-20",
        amount: "51,648.00€",
        status: "En attente",
    },
    {
        id: "PRE-2024-003",
        client: "Constructa S.A.",
        date: "2024-07-10",
        amount: "12,350.50€",
        status: "Refusée",
    },
];

export default function PreInvoicesListPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const preInvoices = allPreInvoices.filter(invoice => 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Préfactures">
                <Button asChild>
                    <Link href="/factures/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Créer une préfacture
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Préfactures</CardTitle>
                    <CardDescription>Consultez et gérez toutes vos préfactures.</CardDescription>
                     <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Filtrer par N°, client ou statut..."
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
                                <TableHead>Préfacture</TableHead>
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
                            {preInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">
                                         <Link href={`/prefactures/${invoice.id}`} className="hover:underline">
                                            {invoice.id}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{invoice.client}</TableCell>
                                    <TableCell>{invoice.date}</TableCell>
                                    <TableCell className="text-right">{invoice.amount}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={
                                            invoice.status === "Approuvée" ? "secondary" : invoice.status === "Refusée" ? "destructive" : "outline"
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
                                                    <Link href={`/prefactures/${invoice.id}`}>Voir le détail</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Convertir en Facture</DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/prefactures/${invoice.id}/edit`}>Modifier</Link>
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
