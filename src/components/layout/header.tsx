'use client';

import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { CircleUser, Search, LogOut, Settings as SettingsIcon, Shield, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { Badge } from '@/components/ui/badge';

const breadcrumbLabels: { [key: string]: string } = {
  dashboard: 'Tableau de Bord',
  vente: 'Vente',
  clients: 'Clients',
  prefactures: 'Préfactures',
  factures: 'Factures',
  'bons-de-livraison': 'Bons de Livraison',
  achat: 'Achat',
  achats: 'Achat',
  fournisseurs: 'Fournisseurs',
  'bons-de-reception': 'Bons de Réception',
  'frais-essence': "Frais d'Essence",
  'location-materiel': 'Location Matériel',
  settings: 'Paramètres',
};

export function Header() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      
      <div className="hidden sm:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Accueil</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={segment}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index === pathSegments.length - 1 ? (
                    <BreadcrumbPage>{breadcrumbLabels[segment] || segment}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={`/${pathSegments.slice(0, index + 1).join('/')}`}>
                        {breadcrumbLabels[segment] || segment}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher..."
          className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.nombre}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              <Badge variant={isAdmin ? "default" : "secondary"} className="w-fit mt-1">
                {isAdmin ? (
                  <><Shield className="mr-1 h-3 w-3" />Admin</>
                ) : (
                  <><User className="mr-1 h-3 w-3" />User</>
                )}
              </Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings" className="w-full cursor-pointer">
              <SettingsIcon className="mr-2 h-4 w-4" />
              Paramètres
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
