'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import { allInvoices as salesInvoices } from '@/app/factures/page';
import { allInvoices as purchaseInvoices } from '@/app/achats/factures/page';
import { initialGasExpenses } from '@/app/frais-essence/page';

const parseAmount = (amount: string) => {
    return parseFloat(amount.replace(/[^0-9,-]+/g, "").replace(",", "."));
};

// Group data by month
const monthlyData: { [key: string]: { revenus: number; depenses: number } } = {};

const processInvoices = (invoices: any[], type: 'revenus' | 'depenses') => {
    invoices.forEach(invoice => {
        const date = new Date(invoice.date);
        const month = date.toLocaleString('fr-FR', { month: 'short' });
        const year = date.getFullYear();
        const key = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;

        if (!monthlyData[key]) {
            monthlyData[key] = { revenus: 0, depenses: 0 };
        }
        monthlyData[key][type] += parseAmount(invoice.amount);
    });
};

const processGasExpenses = (expenses: any[]) => {
    expenses.forEach(expense => {
        const dateParts = expense.date.split('/');
        const date = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
        const month = date.toLocaleString('fr-FR', { month: 'short' });
        const year = date.getFullYear();
        const key = `${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
        
        if (!monthlyData[key]) {
            monthlyData[key] = { revenus: 0, depenses: 0 };
        }
        monthlyData[key].depenses += expense.mt;
    })
}

processInvoices(salesInvoices, 'revenus');
processInvoices(purchaseInvoices, 'depenses');
processGasExpenses(initialGasExpenses);


const chartData = Object.entries(monthlyData).map(([month, data]) => ({
    month: month.split(' ')[0],
    ...data
})).sort((a, b) => {
    const months = ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."];
    return months.indexOf(a.month) - months.indexOf(b.month);
});


const chartConfig = {
  revenus: {
    label: "Revenus",
    color: "hsl(var(--primary))",
  },
  depenses: {
    label: "Dépenses",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Revenus vs Dépenses</CardTitle>
        <CardDescription>Données basées sur les factures et dépenses enregistrées.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `${Number(value) / 1000}k€`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
             <Legend />
            <Bar dataKey="revenus" fill="var(--color-revenus)" radius={4} />
            <Bar dataKey="depenses" fill="var(--color-depenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
