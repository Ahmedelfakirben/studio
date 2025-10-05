
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, MoreHorizontal, PlusCircle } from "lucide-react"
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Mock data - in a real app, this would be fetched based on the client ID
const clientData = {
    "client-001": {
        name: "Chantier Central",
        prefactures: [],
        factures: [
            {
                id: "FAC-2024-004",
                date: "2024-06-28",
                amount: "23,450.00€",
                status: "Payée",
            },
        ],
        bonsDeLivraison: [
             {
                id: "BL-2024-001",
                date: "2024-07-26",
                status: "Livré",
            },
        ]
    },
    "client-002": {
        name: "Mairie de Ville-Haute",
        prefactures: [
            {
                id: "PRE-2024-002",
                date: "2024-07-20",
                amount: "51,648.00€",
                status: "En attente",
            },
        ],
        factures: [
             {
                id: "FAC-2024-001",
                date: "2024-07-26",
                amount: "51,648.00€",
                status: "Payée",
            },
        ],
        bonsDeLivraison: [
            {
                id: "BL-2024-002",
                date: "2024-07-24",
                status: "Livré",
            },
        ]
    },
    "client-003": {
        name: "Constructa S.A.",
        prefactures: [
            {
                id: "PRE-2024-003",
                date: "2024-07-10",
                amount: "12,350.50€",
                status: "Refusée",
            },
        ],
        factures: [
            {
                id: "FAC-2024-002",
                client: "Constructa S.A.",
                date: "2024-07-15",
                amount: "12,350.50€",
                status: "En attente",
            },
        ],
        bonsDeLivraison: [
             {
                id: "BL-2024-003",
                date: "2024-07-22",
                status: "Partiellement livré",
            },
        ]
    },
     "client-004": {
        name: "BTP-IDF",
        prefactures: [],
        factures: [
            {
                id: "FAC-2024-003",
                date: "2024-07-05",
                amount: "8,900.00€",
                status: "En retard",
            },
        ],
        bonsDeLivraison: [
            {
                id: "BL-2024-004",
                date: "2024-07-20",
                status: "Annulé",
            },
        ]
    },
     "client-005": {
        name: "Client S.A.",
        prefactures: [
            {
                id: "PRE-2024-001",
                date: "2024-07-25",
                amount: "28,202.50€",
                status: "Approuvée",
            },
        ],
        factures: [],
        bonsDeLivraison: []
    }
}

export default function ClientDetailPage({ params }: { params: { id: keyof typeof clientData } }) {
    const client = clientData[params.id] || { name: "Client Inconnu", prefactures: [], factures: [], bonsDeLivraison: [] };

    return (
        <div className="flex flex-col gap-6">
            <PageHeader title={client.name}>
                <Button variant="outline" asChild>
                    <Link href="/clients">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour aux clients
                    </Link>
                </Button>
            </PageHeader>
            <Tabs defaultValue="factures">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="factures">Factures ({client.factures.length})</TabsTrigger>
                        <TabsTrigger value="prefactures">Préfactures ({client.prefactures.length})</TabsTrigger>
                        <TabsTrigger value="bons-de-livraison">Bons de Livraison ({client.bonsDeLivraison.length})</TabsTrigger>
                    </TabsList>
                    <Button asChild>
                        <Link href="/factures/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Créer un document
                        </Link>
                    </Button>
                </div>
                <TabsContent value="factures">
                    <Card>
                        <CardHeader>
                            <CardTitle>Factures</CardTitle>
                            <CardDescription>Liste des factures pour {client.name}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Facture</TableHead>
                                        <TableHead>Date d'émission</TableHead>
                                        <TableHead className="text-right">Montant</TableHead>
                                        <TableHead className="text-center">Statut</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {client.factures.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium">
                                                <Link href={`/factures/${invoice.id}`} className="hover:underline">
                                                    {invoice.id}
                                                </Link>
                                            </TableCell>
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
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent><DropdownMenuItem>Voir</DropdownMenuItem></DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="prefactures">
                    <Card>
                        <CardHeader>
                            <CardTitle>Préfactures</CardTitle>
                            <CardDescription>Liste des préfactures pour {client.name}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Préfacture</TableHead>
                                        <TableHead>Date d'émission</TableHead>
                                        <TableHead className="text-right">Montant</TableHead>
                                        <TableHead className="text-center">Statut</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {client.prefactures.map((invoice) => (
                                        <TableRow key={invoice.id}>
                                            <TableCell className="font-medium">
                                                <Link href={`/prefactures/${invoice.id}`} className="hover:underline">
                                                    {invoice.id}
                                                </Link>
                                            </TableCell>
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
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent><DropdownMenuItem>Voir</DropdownMenuItem></DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="bons-de-livraison">
                     <Card>
                        <CardHeader>
                            <CardTitle>Bons de Livraison</CardTitle>
                            <CardDescription>Liste des bons de livraison pour {client.name}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Bon de Livraison</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-center">Statut</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {client.bonsDeLivraison.map((note) => (
                                        <TableRow key={note.id}>
                                            <TableCell className="font-medium">
                                                <Link href={`/bons-de-livraison/${note.id}`} className="hover:underline">
                                                    {note.id}
                                                </Link>
                                            </TableCell>
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
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent><DropdownMenuItem>Voir</DropdownMenuItem></DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
