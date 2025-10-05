import {
    Avatar,
    AvatarFallback,
  } from "@/components/ui/avatar"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import { getAllSalesInvoices } from "@/lib/data"
  import Link from "next/link"
  import { Badge } from "../ui/badge";
  
  export function RecentInvoices() {
    const recentInvoices = getAllSalesInvoices().slice(0, 5);
  
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Factures de Vente Récentes</CardTitle>
          <CardDescription>
            Aperçu des dernières factures que vous avez créées.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {recentInvoices.map((invoice, index) => (
            <div key={invoice.id} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarFallback>{invoice.client.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                 <Link href={`/factures/${invoice.id}`} className="text-sm font-medium leading-none hover:underline">
                    {invoice.client}
                </Link>
                <p className="text-sm text-muted-foreground">{invoice.id} - {invoice.date}</p>
              </div>
               <div className="ml-auto flex flex-col items-end">
                <span className="font-medium">{invoice.amount}</span>
                 <Badge variant={
                    invoice.status === "Payée" ? "secondary" : invoice.status === "En retard" ? "destructive" : "outline"
                } className="mt-1">
                    {invoice.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
