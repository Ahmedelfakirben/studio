
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { allInvoices as purchaseInvoices } from "@/app/achats/factures/page"
import { initialGasExpenses } from "@/app/frais-essence/page"
import { allRentalSheets } from "@/app/location-materiel/page"
import { Badge } from "../ui/badge";
import { CreditCard, Fuel, Hammer } from "lucide-react";

const parseAmount = (amount: string) => {
    return parseFloat(amount.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const lastPurchase = purchaseInvoices.slice(0, 2).map(i => ({
    id: i.id,
    type: 'Achat Facture',
    description: `Facture de ${i.fournisseur}`,
    amount: parseAmount(i.amount),
    date: new Date(i.date),
    icon: CreditCard,
}));

const lastGas = initialGasExpenses.slice(0, 2).map(g => {
    const dateParts = g.date.split('/');
    return {
        id: g.bl,
        type: 'Frais Essence',
        description: g.ds,
        amount: g.mt,
        date: new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]),
        icon: Fuel,
    }
});

const lastRental = allRentalSheets.slice(0, 1).map(r => ({
    id: r.id,
    type: 'Location Matériel',
    description: `Feuille de location ${r.month}`,
    amount: parseAmount(r.amount),
    date: new Date(r.date),
    icon: Hammer,
}));


const allExpenses = [...lastPurchase, ...lastGas, ...lastRental].sort((a,b) => b.date.getTime() - a.date.getTime());


export function RecentExpenses() {
  const recentExpenses = allExpenses.slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Dépenses Récentes</CardTitle>
        <CardDescription>
          Aperçu des derniers achats, frais et locations enregistrés.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {recentExpenses.map((expense) => (
          <div key={`${expense.type}-${expense.id}`} className="flex items-center gap-4">
            <expense.icon className="h-6 w-6 text-muted-foreground" />
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{expense.description}</p>
              <p className="text-sm text-muted-foreground">{expense.date.toLocaleDateString('fr-FR')}</p>
            </div>
             <div className="ml-auto flex flex-col items-end">
              <span className="font-medium text-destructive">-{formatCurrency(expense.amount)}</span>
               <Badge variant="outline" className="mt-1">
                  {expense.type}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
