'use client';

import * as React from 'react';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { SplashScreen } from '@/components/layout/splash-screen';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';

function AppShell({ children }: { children: React.ReactNode }) {
  const [splashLoading, setSplashLoading] = React.useState(true);
  const { user, loading: authLoading } = useAuth();
  const pathname = usePathname();

  React.useEffect(() => {
    const timer = setTimeout(() => setSplashLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Si estamos en login, no mostrar sidebar
  const isLoginPage = pathname === '/login';

  // Mostrar splash screen mientras carga
  if (splashLoading || authLoading) {
    return (
      <html lang="fr" suppressHydrationWarning>
        <head>
          <title>ALY Gestion</title>
          <meta name="description" content="Application de gestion pour A.L.Y Travaux Publique" />
          <link rel="icon" href="data:," />
        </head>
        <body className={cn('font-body bg-background text-foreground antialiased')}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SplashScreen finished={false} />
          </ThemeProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <title>ALY Gestion</title>
        <meta name="description" content="Application de gestion pour A.L.Y Travaux Publique" />
        <link rel="icon" href="data:," />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body bg-background text-foreground antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {isLoginPage ? (
            // Página de login sin sidebar
            <>
              {children}
              <Toaster />
            </>
          ) : (
            // Aplicación con sidebar
            <SidebarProvider>
              <Sidebar>
                <SidebarNav />
              </Sidebar>
              <SidebarInset>
                <Header />
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
              </SidebarInset>
              <Toaster />
            </SidebarProvider>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AppShell>{children}</AppShell>
    </AuthProvider>
  );
}
