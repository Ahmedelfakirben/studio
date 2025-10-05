'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarMenuSub,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FileText,
  Truck,
  Fuel,
  Hammer,
  Settings,
  Users,
  ShoppingCart,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const topMenuItems = [
  { href: '/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
];

const venteSubItems = [
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/prefactures', label: 'Préfactures', icon: FileText },
    { href: '/factures', label: 'Factures', icon: FileText },
    { href: '/bons-de-livraison', label: 'Bons de Livraison', icon: Truck },
]

const achatSubItems = [
    { href: '/fournisseurs', label: 'Fournisseurs', icon: Users },
    { href: '/achats/prefactures', label: 'Préfactures', icon: FileText },
    { href: '/achats/factures', label: 'Factures', icon: FileText },
    { href: '/achats/bons-de-reception', label: 'Bons de Réception', icon: Truck },
]

const bottomMenuItems = [
  { href: '/frais-essence', label: 'Frais d\'Essence', icon: Fuel },
  { href: '/location-materiel', label: 'Location Matériel', icon: Hammer },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  
  const isVenteActive = venteSubItems.some(item => pathname.startsWith(item.href));
  const isAchatActive = achatSubItems.some(item => pathname.startsWith(item.href));

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-2">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <span className="text-xl font-bold text-primary-foreground">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base text-sidebar-foreground group-data-[collapsible=icon]:hidden">A.L.Y</span>
            <span className="text-xs text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">Travaux Publique</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {topMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
            <Collapsible defaultOpen={isVenteActive} asChild>
                 <SidebarMenuItem>
                    <div className='relative'>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton isActive={isVenteActive} className="w-full">
                                <ShoppingCart/>
                                <span className="group-data-[collapsible=icon]:hidden flex-1 text-left">Vente</span>
                                <ChevronRight className={cn("group-data-[collapsible=icon]:hidden h-4 w-4 transition-transform duration-200", isVenteActive && "rotate-90")} />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                         <SidebarMenuSub>
                            {venteSubItems.map((item) => (
                                 <SidebarMenuItem key={item.href}>
                                     <SidebarMenuSubButton asChild isActive={pathname.startsWith(item.href)}>
                                         <Link href={item.href}>
                                            <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                                         </Link>
                                     </SidebarMenuSubButton>
                                 </SidebarMenuItem>
                            ))}
                         </SidebarMenuSub>
                    </CollapsibleContent>
                 </SidebarMenuItem>
            </Collapsible>
            <Collapsible defaultOpen={isAchatActive} asChild>
                 <SidebarMenuItem>
                    <div className='relative'>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton isActive={isAchatActive} className="w-full">
                                <ShoppingBag/>
                                <span className="group-data-[collapsible=icon]:hidden flex-1 text-left">Achat</span>
                                <ChevronRight className={cn("group-data-[collapsible=icon]:hidden h-4 w-4 transition-transform duration-200", isAchatActive && "rotate-90")} />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                         <SidebarMenuSub>
                            {achatSubItems.map((item) => (
                                 <SidebarMenuItem key={item.href}>
                                     <SidebarMenuSubButton asChild isActive={pathname.startsWith(item.href)}>
                                         <Link href={item.href}>
                                            <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                                         </Link>
                                     </SidebarMenuSubButton>
                                 </SidebarMenuItem>
                            ))}
                         </SidebarMenuSub>
                    </CollapsibleContent>
                 </SidebarMenuItem>
            </Collapsible>
            
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t border-sidebar-border">
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/settings'}
                tooltip={{ children: 'Paramètres', side: 'right' }}
              >
                <Link href="/settings">
                  <Settings />
                  <span className="group-data-[collapsible=icon]:hidden">Paramètres</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
