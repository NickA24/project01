"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/leads", label: "Leads", icon: "◈" },
  { href: "/calculator", label: "Calculator", icon: "◇" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-border bg-bg-surface">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <span className="text-lg text-accent">⬢</span>
        <span className="font-mono text-sm font-bold tracking-wider text-text">
          WHOLESALE
        </span>
        <span className="font-mono text-sm font-bold tracking-wider text-secondary">
          ENGINE
        </span>
      </div>

      <nav className="flex-1 px-2 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-accent/15 text-accent"
                      : "text-text-muted hover:bg-bg-elevated hover:text-text"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-4 py-3">
        <p className="font-mono text-xs text-text-muted">v0.1.0 — MVP</p>
      </div>
    </aside>
  );
}
