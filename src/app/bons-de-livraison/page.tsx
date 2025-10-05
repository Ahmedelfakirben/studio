import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const deliveryNoteData = {
    number: "BL-2024-001",
    date: "2024-07-26",
    supplier: {
        name: "A.L.Y Travaux Publique",
        address: "123 Rue du Chantier, 75000 Paris",
    },
    client: {
        name: "Chantier Central",
        address: "Zone Industrielle Nord, 93200 Saint-Denis",
    },
    project: "Construction Hangar H-05",
    items: [
        { prix: '1', designation: 'Sable 0/4', unite: 'Tonne', quantite: 15 },
        { prix: '2', designation: 'Gravier 4/16', unite: 'Tonne', quantite: 25 },
        { prix: '3', designation: 'Ciment CEM II/B-LL 32,5 R', unite: 'Sac 25kg', quantite: 200 },
        { prix: '4', designation: 'Armatures métalliques HA10', unite: 'kg', quantite: 550 },
        { prix: '5', designation: 'Tuyaux PVC Ø 100', unite: 'mL', quantite: 120 },
    ],
};

export default function DeliveryNotesPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Bon de Livraison">
                <Button asChild>
                    <Link href="/factures/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Créer un bon
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader className="space-y-4">
                    <CardTitle className="text-2xl">BON DE LIVRAISON N° {deliveryNoteData.number}</CardTitle>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <h3 className="font-semibold">Fournisseur</h3>
                            <p>{deliveryNoteData.supplier.name}</p>
                            <p>{deliveryNoteData.supplier.address}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Livré à</h3>
                            <p>{deliveryNoteData.client.name}</p>
                            <p>{deliveryNoteData.client.address}</p>
                        </div>
                        <div className="text-right">
                             <p><span className="font-semibold">Date:</span> {deliveryNoteData.date}</p>
                             <p><span className="font-semibold">Projet:</span> {deliveryNoteData.project}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Nº de PRIX</TableHead>
                                    <TableHead>DESIGNATION DES MATERIAUX</TableHead>
                                    <TableHead className="w-[100px]">UNITÉ</TableHead>
                                    <TableHead className="text-right w-[100px]">QUANTITÉ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deliveryNoteData.items.map((item) => (
                                    <TableRow key={item.prix}>
                                        <TableCell>{item.prix}</TableCell>
                                        <TableCell className="font-medium">{item.designation}</TableCell>
                                        <TableCell>{item.unite}</TableCell>
                                        <TableCell className="text-right">{item.quantite}</TableCell>
                                    </TableRow>
                                ))}
                                {Array.from({ length: Math.max(0, 20 - deliveryNoteData.items.length) }).map((_, index) => (
                                     <TableRow key={`empty-${index}`} className="h-[53px]">
                                        <TableCell>&nbsp;</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between mt-6 pt-6 border-t">
                    <div className="text-sm">
                        <p className="font-semibold">Fait à [Ville], le [Date]</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-8">Sceau et Signature (Livreur)</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-8">Sceau et Signature (Client)</p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
