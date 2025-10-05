
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer, Share2 } from "lucide-react"
import Link from "next/link"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import { InvoiceItemTable } from "@/components/invoice/invoice-item-table"

const invoiceData = {
    number: "FAC-2024-001",
    date: "2024-07-26",
    supplier: {
        name: "A.L.Y Travaux Publique",
        address: "123 Rue du Chantier, 75000 Paris",
        taxId: "FR 12 345678901",
    },
    client: {
        name: "Mairie de Ville-Haute",
        address: "1 Place de la Mairie, 75001 Paris",
        taxId: "FR 55 123456789",
    },
    project: "Réfection de la voirie Rue Principale",
    items: [
        { prix: '1.1', designation: 'Déblais toute nature y compris rocher aux explosifs', unite: 'm3', quantite: 250, prixUnitaire: 28.00 },
        { prix: '1.2', designation: 'Remblais régalés par couches successives', unite: 'm3', quantite: 1200, prixUnitaire: 4.50 },
        { prix: '2.1', designation: 'Couche de fondation en grave 0/31.5', unite: 'm3', quantite: 300, prixUnitaire: 40.00 },
        { prix: '2.2', designation: 'Couche de base en grave 0/20', unite: 'm2', quantite: 1200, prixUnitaire: 1.20 },
        { prix: '2.3', designation: 'Revêtement en béton bitumineux 0/10', unite: 'm2', quantite: 1200, prixUnitaire: 15.50 },
        { prix: '3.1', designation: 'Bordures type T2', unite: 'mL', quantite: 150, prixUnitaire: 38.00 },
        { prix: '3.2', designation: 'Caniveaux type CS1', unite: 'mL', quantite: 300, prixUnitaire: 9.80 },
        { prix: '4.1', designation: 'Tuyaux PVC série 1 Ø400', unite: 'mL', quantite: 0, prixUnitaire: 0 },
        { prix: '4.2', designation: 'Regard de visite 100x100', unite: 'U', quantite: 0, prixUnitaire: 0 },
        { prix: '5.1', designation: 'Fourniture et pose de signalisation verticale des carrefours', unite: 'U', quantite: 0, prixUnitaire: 0 },
    ],
};

export default function InvoiceDetailPage() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title={`Facture ${invoiceData.number}`}>
                 <Button variant="outline" asChild>
                    <Link href="/factures">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour
                    </Link>
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" />
                        Partager
                    </Button>
                    <Button>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer / PDF
                    </Button>
                </div>
            </PageHeader>
            <Card>
                <CardHeader className="space-y-4">
                    <CardTitle className="text-2xl">FACTURE N° {invoiceData.number}</CardTitle>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <h3 className="font-semibold">Fournisseur</h3>
                            <p>{invoiceData.supplier.name}</p>
                            <p>{invoiceData.supplier.address}</p>
                            <p>TVA: {invoiceData.supplier.taxId}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">Client</h3>
                            <p>{invoiceData.client.name}</p>
                            <p>{invoiceData.client.address}</p>
                            <p>TVA: {invoiceData.client.taxId}</p>
                        </div>
                        <div className="text-right">
                             <p><span className="font-semibold">Date:</span> {invoiceData.date}</p>
                             <p><span className="font-semibold">Projet:</span> {invoiceData.project}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <InvoiceItemTable items={invoiceData.items} />
                </CardContent>
            </Card>
        </div>
    )
}
