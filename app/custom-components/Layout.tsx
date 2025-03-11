// components/Layout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, CreditCard, Gift, DollarSign, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/", icon: Activity },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Categories", href: "/categories", icon: Gift },
  { name: "Budget", href: "/budget", icon: DollarSign },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Finance Tracker</h1>
          <div className="flex items-center gap-3">
            <button
              className="md:hidden rounded-full bg-slate-100 p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2 border-b">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg p-2 text-sm",
                    isActive(item.href)
                      ? "bg-slate-100 font-medium"
                      : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <div className="flex flex-1">
        {/* Side Navigation (hidden on mobile) */}
        <aside className="hidden w-64 border-r p-4 md:block">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg p-2 text-sm",
                  isActive(item.href)
                    ? "bg-slate-100 font-medium"
                    : "text-slate-500 hover:bg-slate-50"
                )}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 bg-slate-50 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-white p-2">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center p-2",
                isActive(item.href) ? "text-blue-600" : "text-slate-500"
              )}
            >
              <item.icon size={20} />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
