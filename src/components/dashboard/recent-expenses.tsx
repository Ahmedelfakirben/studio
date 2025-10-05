import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "../ui/badge";
import { CreditCard, Fuel, Hammer } from "lucide-react";
import { getRecentExpenses } from "@/lib/data";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const iconMap = {
    'Achat Facture': CreditCard,
    'Frais Essence': Fuel,
    'Location Matériel': Hammer,
};

export function RecentExpenses() {
  const recentExpenses = getRecentExpenses();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Dépenses Récentes</CardTitle>
        <CardDescription>
          Aperçu des derniers achats, frais et locations enregistrés.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {recentExpenses.map((expense) => {
            const Icon = iconMap[expense.type];
            return (
              <div key={`${expense.type}-${expense.id}`} className="flex items-center gap-4">
                <Icon className="h-6 w-6 text-muted-foreground" />
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
            )
        })}
      </CardContent>
    </Card>
  )
}
