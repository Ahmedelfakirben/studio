'use client';

import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { RecentInvoices } from '@/components/dashboard/recent-invoices';
import { CreditCard, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';
import { getDashboardStatsFromAPI, getChartDataFromAPI } from '@/lib/dashboard-service';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    salesInvoicesCount: 0,
    totalExpenses: 0,
    purchaseInvoicesCount: 0,
    activeClients: 0,
    profitMargin: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, chartDataResult] = await Promise.all([
          getDashboardStatsFromAPI(),
          getChartDataFromAPI()
        ]);
        setStats(statsData);
        setChartData(chartDataResult);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les données du tableau de bord. ' + (error.response?.data?.message || error.message)
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Tableau de Bord">
          <Button asChild>
            <Link href="/factures/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer une facture
            </Link>
          </Button>
        </PageHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Skeleton className="h-96" />
          </div>
          <div className="lg:col-span-5">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Tableau de Bord">
        <Button asChild>
          <Link href="/factures/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une facture
          </Link>
        </Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenu Total (Brut)"
          value={`${stats.totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}`}
          change={`${stats.salesInvoicesCount} factures émises`}
          icon={DollarSign}
        />
        <StatCard
          title="Dépenses Totales"
          value={`${stats.totalExpenses.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}`}
          change={`${stats.purchaseInvoicesCount} dépenses enregistrées`}
          icon={CreditCard}
        />
        <StatCard
          title="Clients Actifs"
          value={`${stats.activeClients}`}
          change="Total des clients enregistrés"
          icon={Users}
        />
        <StatCard
          title="Marge Bénéficiaire"
          value={`${stats.profitMargin.toFixed(1)}%`}
          change={stats.profitMargin >= 0 ? "Bénéfice positif" : "Perte"}
          icon={TrendingUp}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
            <RevenueChart chartData={chartData} />
        </div>
        <div className="lg:col-span-5">
            <RecentInvoices />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <RecentExpenses />
        </div>
      </div>
    </div>
  );
}
