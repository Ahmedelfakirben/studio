'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
  { month: "Jan", revenus: 18600, depenses: 8000 },
  { month: "Fév", revenus: 30500, depenses: 20000 },
  { month: "Mar", revenus: 23700, depenses: 12000 },
  { month: "Avr", revenus: 7300, depenses: 19000 },
  { month: "Mai", revenus: 20900, depenses: 13000 },
  { month: "Juin", revenus: 21400, depenses: 14000 },
];

const chartConfig = {
  revenus: {
    label: "Revenus",
    color: "hsl(var(--primary))",
  },
  depenses: {
    label: "Dépenses",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export function RevenueChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Revenus vs Dépenses</CardTitle>
        <CardDescription>Janvier - Juin 2024</CardDescription>
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
            <Bar dataKey="revenus" fill="var(--color-revenus)" radius={4} />
            <Bar dataKey="depenses" fill="var(--color-depenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
