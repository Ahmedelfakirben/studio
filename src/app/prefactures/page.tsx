import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { InvoiceItemTable } from "@/components/invoice/invoice-item-table"

const preInvoiceData = {
    number: "PRE-2024-001",
    date: "2024-07-25",
    supplier: {
        name: "A.L.Y Travaux Publique",
        address: "123 Rue du Chantier, 75000 Paris",
        taxId: "FR 12 345678901",
    },
    client: {
        name: "Client S.A.",
        address: "456 Avenue des Projets, 69000 Lyon",
        taxId: "FR 98 765432109",
    },
    project: "Aménagement de la place du marché",
    items: [
        { prix: '1.1', designation: 'Déblais toute nature y compris rocher aux explosifs', unite: 'm3', quantite: 150, prixUnitaire: 25.50 },
        { prix: '1.2', designation: 'Remblais régalés par couches successives', unite: 'm3', quantite: 120, prixUnitaire: 18.00 },
        { prix: '2.1', designation: 'Couche de fondation en grave 0/31.5', unite: 'm3', quantite: 80, prixUnitaire: 45.20 },
        { prix: '2.2', designation: 'Couche de base en grave 0/20', unite: 'm2', quantite: 200, prixUnitaire: 22.00 },
        { prix: '2.3', designation: 'Revêtement en béton bitumineux 0/10', unite: 'm2', quantite: 500, prixUnitaire: 35.75 },
        { prix: '3.1', designation: 'Bordures type T2', unite: 'mL', quantite: 0, prixUnitaire: 0 },
        { prix: '3.2', designation: 'Caniveaux type CS1', unite: 'mL', quantite: 0, prixUnitaire: 0 },
        { prix: '4.1', designation: 'Tuyaux PVC série 1 Ø400', unite: 'mL', quantite: 0, prixUnitaire: 0 },
        { prix: '4.2', designation: 'Regard de visite 100x100', unite: 'U', quantite: 0, prixUnitaire: 0 },
        { prix: '5.1', designation: 'Fourniture et pose de signalisation verticale des carrefours', unite: 'U', quantite: 0, prixUnitaire: 0 },
    ],
};

export default function PreInvoicesPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Préfacture">
                <Button asChild>
                    <Link href="/factures/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Créer une préfacture
                    </Link>
                </Button>
            </PageHeader>
            <Card>
                <CardHeader className="space-y-4">
                    <CardTitle className="text-2xl">PRÉFACTURE N° {preInvoiceData.number}</CardTitle>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <h3 className="font-semibold">Fournisseur</h3>
                            <p>{preInvoiceData.supplier.name}</p>
                            <p>{preInvoiceData.supplier.address}</p>
                            <p>TVA: {preInvoiceData.supplier.taxId}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Client</h3>
                            <p>{preInvoiceData.client.name}</p>
                            <p>{preInvoiceData.client.address}</p>
                            <p>TVA: {preInvoiceData.client.taxId}</p>
                        </div>
                        <div className="text-right">
                             <p><span className="font-semibold">Date:</span> {preInvoiceData.date}</p>
                             <p><span className="font-semibold">Projet:</span> {preInvoiceData.project}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <InvoiceItemTable items={preInvoiceData.items} />
                </CardContent>
            </Card>
        </div>
    )
}
