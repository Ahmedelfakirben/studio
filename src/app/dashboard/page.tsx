import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { RecentInvoices } from '@/components/dashboard/recent-invoices';
import { CreditCard, DollarSign, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
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
          title="Revenu Total (30j)"
          value="45,231.89€"
          change="+20.1% depuis le mois dernier"
          icon={DollarSign}
        />
        <StatCard
          title="Dépenses (30j)"
          value="12,145.20€"
          change="-5.2% depuis le mois dernier"
          icon={CreditCard}
        />
        <StatCard
          title="Clients Actifs"
          value="+23"
          change="+2 depuis le mois dernier"
          icon={Users}
        />
        <StatCard
          title="Factures en Attente"
          value="15"
          change="+5 par rapport à hier"
          icon={FileText}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
            <RevenueChart />
        </div>
        <div className="lg:col-span-5">
            <RecentInvoices />
        </div>
      </div>
    </div>
  );
}
