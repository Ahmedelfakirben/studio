
'use client';
import * as React from 'react';
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
import { Input } from '@/components/ui/input';

const allClients = [
    {
        id: "client-001",
        name: "Chantier Central",
        initials: "CC",
        projects: 2,
        totalBilled: "23,450.00€",
    },
    {
        id: "client-002",
        name: "Mairie de Ville-Haute",
        initials: "MV",
        projects: 1,
        totalBilled: "51,648.00€",
    },
    {
        id: "client-003",
        name: "Constructa S.A.",
        initials: "CS",
        projects: 2,
        totalBilled: "24,701.00€",
    },
    {
        id: "client-004",
        name: "BTP-IDF",
        initials: "BI",
        projects: 1,
        totalBilled: "8,900.00€",
    },
    {
        id: "client-005",
        name: "Client S.A.",
        initials: "CS",
        projects: 1,
        totalBilled: "28,202.50€",
    },
];

export default function ClientsListPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const clients = allClients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Clients">
                <Button asChild>
                    <Link href="/clients/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter un client
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Clients</CardTitle>
                    <CardDescription>Consultez et gérez tous vos clients.</CardDescription>
                     <div className="relative mt-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Filtrer par nom..."
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
                                <TableHead className="w-[80px]">Client</TableHead>
                                <TableHead>Projets Actifs</TableHead>
                                <TableHead className="text-right">Total Facturé</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarFallback>{client.initials}</AvatarFallback>
                                            </Avatar>
                                            <Link href={`/clients/${client.id}`} className="font-medium hover:underline">
                                                {client.name}
                                            </Link>
                                        </div>
                                    </TableCell>
                                    <TableCell>{client.projects}</TableCell>
                                    <TableCell className="text-right">{client.totalBilled}</TableCell>
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
                                                    <Link href={`/clients/${client.id}`}>Voir le détail</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/clients/${client.id}/edit`}>Modifier</Link>
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
