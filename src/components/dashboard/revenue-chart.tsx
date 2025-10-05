'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';

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

export function RevenueChart({ chartData }: { chartData: any[] }) {
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
