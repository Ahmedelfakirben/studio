
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

const rentalSheets = [
    {
        id: "loc-juillet-2024",
        month: "Juillet 2024",
        date: "2024-07-31",
        amount: "3,740.00€",
        status: "Finalisé",
    },
    {
        id: "loc-juin-2024",
        month: "Juin 2024",
        date: "2024-06-30",
        amount: "5,200.00€",
        status: "Facturé",
    },
]

export default function MaterialRentalListPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Location de Matériel">
                <Button asChild>
                    <Link href="/location-materiel/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Créer une feuille de location
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Suivi des Locations</CardTitle>
                    <CardDescription>Consultez et gérez vos feuilles de location mensuelles.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Document</TableHead>
                                <TableHead>Date de fin</TableHead>
                                <TableHead className="text-right">Montant Total</TableHead>
                                <TableHead className="text-center">Statut</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rentalSheets.map((sheet) => (
                                <TableRow key={sheet.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/location-materiel/${sheet.id}`} className="hover:underline">
                                            {sheet.month}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{sheet.date}</TableCell>
                                    <TableCell className="text-right">{sheet.amount}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={
                                            sheet.status === "Facturé" ? "secondary" 
                                            : "outline"
                                        }>
                                            {sheet.status}
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
                                                    <Link href={`/location-materiel/${sheet.id}`}>Voir le détail</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/location-materiel/${sheet.id}/edit`}>Modifier</Link>
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
