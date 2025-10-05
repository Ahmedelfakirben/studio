
'use client';

import * as React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { SplashScreen } from '@/components/layout/splash-screen';

// This is a client component, but we can still have metadata
// export const metadata: Metadata = {
//   title: 'ALY Gestion',
//   description: "Application de gestion pour A.L.Y Travaux Publique",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, []);


  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <title>ALY Gestion</title>
        <meta name="description" content="Application de gestion pour A.L.Y Travaux Publique" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body bg-background text-foreground antialiased')}>
        {loading ? (
          <SplashScreen finished={!loading} />
        ) : (
          <>
            <SidebarProvider>
                <Sidebar>
                    <SidebarNav />
                </Sidebar>
                <SidebarInset>
                    <Header />
                    <main className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </>
        )}
      </body>
    </html>
  );
}
