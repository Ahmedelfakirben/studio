'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FileText,
  Truck,
  Fuel,
  Hammer,
  Settings,
  CircleUser,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/prefactures', label: 'Préfactures', icon: FileText },
  { href: '/factures', label: 'Factures', icon: FileText },
  { href: '/bons-de-livraison', label: 'Bons de Livraison', icon: Truck },
  { href: '/frais-essence', label: 'Frais d\'Essence', icon: Fuel },
  { href: '/location-materiel', label: 'Location Matériel', icon: Hammer },
];

export function SidebarNav() {
  const pathname = usePathname();

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
          {menuItems.map((item) => (
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
