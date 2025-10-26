'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "../ui/badge";
import { CreditCard, Fuel, Hammer } from "lucide-react";
import { getRecentExpensesFromAPI } from "@/lib/dashboard-service";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const iconMap = {
    'Achat Facture': CreditCard,
    'Frais Essence': Fuel,
    'Location Matériel': Hammer,
};

export function RecentExpenses() {
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenses = await getRecentExpensesFromAPI(5);
        setRecentExpenses(expenses);
      } catch (error) {
        console.error('Error fetching recent expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Dépenses Récentes</CardTitle>
          <CardDescription>
            Aperçu des derniers achats, frais et locations enregistrés.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-6 w-6" />
              <div className="grid gap-1 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (recentExpenses.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Dépenses Récentes</CardTitle>
          <CardDescription>
            Aperçu des derniers achats, frais et locations enregistrés.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <p className="text-sm text-muted-foreground">Aucune dépense récente</p>
        </CardContent>
      </Card>
    );
  }

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
                  <p className="text-sm text-muted-foreground">{new Date(expense.date).toLocaleDateString('fr-FR')}</p>
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
