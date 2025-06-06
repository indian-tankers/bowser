"use client"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect, useState } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from '@/components/layout/Sidebar';
import { isAuthenticated } from '@/lib/auth';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsAuth(isAuthenticated());
  }, [pathname]);

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className={`dark:bg-background dark:text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {isAuth && <Sidebar />}
          <div className={`min-h-full`}>
            <main className="md:px-8 p-4 md:pb-8">
              {children}
              <SpeedInsights />
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
