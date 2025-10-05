import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { RecentInvoices } from '@/components/dashboard/recent-invoices';
import { CreditCard, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getDashboardStats, getChartData } from '@/lib/data';
import { RecentExpenses } from '@/components/dashboard/recent-expenses';


export default async function DashboardPage() {
  const { 
    totalRevenue, 
    salesInvoicesCount, 
    totalExpenses, 
    purchaseInvoicesCount, 
    activeClients 
  } = await getDashboardStats();
  const chartData = await getChartData();

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Revenu Total (Brut)"
          value={`${totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`}
          change={`${salesInvoicesCount} factures émises`}
          icon={DollarSign}
        />
        <StatCard
          title="Dépenses Totales"
          value={`${totalExpenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`}
          change={`${purchaseInvoicesCount} factures d'achat`}
          icon={CreditCard}
        />
        <StatCard
          title="Clients Actifs"
          value={`+${activeClients}`}
          change="Total des clients enregistrés"
          icon={Users}
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
