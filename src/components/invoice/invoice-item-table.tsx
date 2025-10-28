'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CardFooter } from "@/components/ui/card";

type InvoiceItem = {
    prix: string;
    designation: string;
    unite: string;
    quantite: number;
    prixUnitaire: number;
};

type InvoiceItemTableProps = {
    items: InvoiceItem[];
};

export function InvoiceItemTable({ items }: InvoiceItemTableProps) {
    const montantHT = items.reduce((total, item) => total + item.quantite * item.prixUnitaire, 0);
    const tva = montantHT * 0.20;
    const montantTTC = montantHT + tva;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MAD' }).format(amount);
    };

    return (
        <>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Nº de PRIX</TableHead>
                            <TableHead>DESIGNATION DES OUVRAGES</TableHead>
                            <TableHead className="w-[100px]">UNITÉ</TableHead>
                            <TableHead className="text-right w-[120px]">QUANTITÉ</TableHead>
                            <TableHead className="text-right w-[180px]">PRIX UNITAIRE HT EN CHIFFRE</TableHead>
                            <TableHead className="text-right w-[180px]">MONTANT HT</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.prix}>
                                <TableCell>{item.prix}</TableCell>
                                <TableCell className="font-medium">{item.designation}</TableCell>
                                <TableCell>{item.unite}</TableCell>
                                <TableCell className="text-right">{item.quantite.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.prixUnitaire)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.quantite * item.prixUnitaire)}</TableCell>
                            </TableRow>
                        ))}
                        {Array.from({ length: Math.max(0, 20 - items.length) }).map((_, index) => (
                             <TableRow key={`empty-${index}`} className="h-[53px]">
                                <TableCell>&nbsp;</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="grid grid-cols-5 mt-4">
                <div className="col-start-3 col-span-3">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableHead className="text-right">MONTANT HT</TableHead>
                                <TableCell className="text-right w-[180px]">{formatCurrency(montantHT)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableHead className="text-right">TVA 20%</TableHead>
                                <TableCell className="text-right">{formatCurrency(tva)}</TableCell>
                            </TableRow>
                            <TableRow className="bg-muted/50">
                                <TableHead className="text-right text-lg font-bold text-primary">MONTANT TTC</TableHead>
                                <TableCell className="text-right text-lg font-bold text-primary">{formatCurrency(montantTTC)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
            <CardFooter className="flex flex-col items-start gap-4 mt-8 pt-6 border-t">
                 <div className="w-full">
                    <p className="text-sm">Arrêté la présente facture à la somme de : <span className="font-semibold">[Montant TTC en lettres]</span></p>
                </div>
                <div className="w-full flex justify-between text-sm">
                    <p>Fait à [Ville], le [Date]</p>
                    <div className="flex flex-col items-center">
                        <p className="mb-10 font-semibold">Sceau et Signature</p>
                    </div>
                </div>
            </CardFooter>
        </>
    );
}
