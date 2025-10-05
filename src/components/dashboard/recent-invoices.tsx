import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  
  const invoices = [
    { name: "Liam Johnson", email: "liam@example.com", amount: "+250.00€", avatarSeed: 1 },
    { name: "Olivia Smith", email: "olivia@example.com", amount: "+150.75€", avatarSeed: 2 },
    { name: "Noah Williams", email: "noah@example.com", amount: "+350.00€", avatarSeed: 3 },
    { name: "Emma Brown", email: "emma@example.com", amount: "+450.50€", avatarSeed: 4 },
    { name: "James Jones", email: "james@example.com", amount: "+550.00€", avatarSeed: 5 },
  ];
  
  export function RecentInvoices() {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Factures Récentes</CardTitle>
          <CardDescription>
            Vous avez 25 factures ce mois-ci.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {invoices.map((invoice) => (
            <div key={invoice.email} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={`https://picsum.photos/seed/${invoice.avatarSeed}/40/40`} alt="Avatar" data-ai-hint="person" />
                <AvatarFallback>{invoice.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{invoice.name}</p>
                <p className="text-sm text-muted-foreground">{invoice.email}</p>
              </div>
              <div className="ml-auto font-medium">{invoice.amount}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
