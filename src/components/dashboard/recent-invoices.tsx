'use client';

import {
    Avatar,
    AvatarFallback,
  } from "@/components/ui/avatar"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { getRecentInvoicesFromAPI } from "@/lib/dashboard-service"
  import Link from "next/link"
  import { Badge } from "../ui/badge";
  import { useEffect, useState } from "react";
  import { Skeleton } from "../ui/skeleton";

  export function RecentInvoices() {
    const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchInvoices = async () => {
        try {
          const invoices = await getRecentInvoicesFromAPI(5);
          setRecentInvoices(invoices);
        } catch (error) {
          console.error('Error fetching recent invoices:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchInvoices();
    }, []);

    if (loading) {
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Factures de Vente Récentes</CardTitle>
            <CardDescription>
              Aperçu des dernières factures que vous avez créées.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="grid gap-1 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }

    if (recentInvoices.length === 0) {
      return (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Factures de Vente Récentes</CardTitle>
            <CardDescription>
              Aperçu des dernières factures que vous avez créées.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-48">
            <p className="text-sm text-muted-foreground">Aucune facture récente</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Factures de Vente Récentes</CardTitle>
          <CardDescription>
            Aperçu des dernières factures que vous avez créées.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {recentInvoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarFallback>{invoice.cliente.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                 <Link href={`/factures/${invoice.id}`} className="text-sm font-medium leading-none hover:underline">
                    {invoice.cliente}
                </Link>
                <p className="text-sm text-muted-foreground">{invoice.numero} - {new Date(invoice.fecha).toLocaleDateString('fr-FR')}</p>
              </div>
               <div className="ml-auto flex flex-col items-end">
                <span className="font-medium">{invoice.montoTTC.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                 <Badge variant={
                    invoice.status === "Payée" ? "secondary" : invoice.status === "En retard" ? "destructive" : "outline"
                } className="mt-1">
                    {invoice.status || 'Émise'}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
