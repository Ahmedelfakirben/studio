
'use client';
import * as React from 'react';
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MoreHorizontal, Search } from "lucide-react"
import Link from 'next/link';
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

const allReceptionNotes = [
    {
        id: "BR-2024-001",
        fournisseur: "Matériaux Express",
        date: "2024-07-24",
        status: "Reçu",
    },
    {
        id: "BR-2024-002",
        fournisseur: "Béton Pro",
        date: "2024-07-22",
        status: "Partiellement Reçu",
    },
    {
        id: "BR-2024-003",
        fournisseur: "Acier Durable S.L.",
        date: "2024-07-20",
        status: "En attente",
    },
];

export default function BonsDeReceptionPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const receptionNotes = allReceptionNotes.filter(note => 
        note.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Bons de Réception">
                 <Button asChild>
                    <Link href="/factures/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un bon de réception
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Bons de Réception</CardTitle>
                    <CardDescription>Consultez et gérez vos réceptions de matériel.</CardDescription>
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
                                <TableHead>Bon de Réception</TableHead>
                                <TableHead>Fournisseur</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {receptionNotes.map((note) => (
                                <TableRow key={note.id}>
                                    <TableCell className="font-medium">{note.id}</TableCell>
                                    <TableCell>{note.fournisseur}</TableCell>
                                    <TableCell>{note.date}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={
                                            note.status === "Reçu" ? "secondary" 
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
                                                <DropdownMenuItem>Voir le détail</DropdownMenuItem>
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
