"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BarChart3,
    Newspaper,
    Terminal,
    ChevronLeft,
    ChevronRight,
    Zap,
    Globe,
    KeyRound,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useApiKeyContext } from "@/lib/api-key-context";
import styles from "./Sidebar.module.css";

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    href: string;
    badge?: string;
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
    {
        title: "OVERVIEW",
        items: [
            { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} />, href: "/" },
            { id: "sectors", label: "Sectors", icon: <BarChart3 size={16} />, href: "/sectors", badge: "10" },
            { id: "news", label: "News Feed", icon: <Newspaper size={16} />, href: "/news" },
        ],
    },
    {
        title: "INTELLIGENCE",
        items: [
            { id: "terminal", label: "AI Terminal", icon: <Terminal size={16} />, href: "/terminal" },
        ],
    },
    {
        title: "MARKETS",
        items: [
            { id: "us", label: "US Markets", icon: <Globe size={16} />, href: "/us-markets" },
            { id: "in", label: "Indian Markets", icon: <Globe size={16} />, href: "/indian-markets" },
        ],
    },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { hasApiKey, setShowModal } = useApiKeyContext();

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
            {/* Brand */}
            <div className={styles.brand}>
                <div className={styles.logo}>
                    <Zap size={18} className={styles.logoIcon} />
                    {!collapsed && <span className={styles.logoText}>MarketMind</span>}
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={styles.toggle}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            <Separator className={styles.sep} />

            {/* Navigation */}
            <nav className={styles.nav}>
                {NAV_SECTIONS.map((section) => (
                    <div key={section.title} className={styles.section}>
                        {!collapsed && (
                            <div className={styles.sectionTitle}>{section.title}</div>
                        )}
                        {section.items.map((item) => {
                            const active = isActive(item.href);
                            const link = (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`${styles.navItem} ${active ? styles.active : ""}`}
                                >
                                    <span className={styles.navIcon}>{item.icon}</span>
                                    {!collapsed && (
                                        <>
                                            <span className={styles.navLabel}>{item.label}</span>
                                            {item.badge && (
                                                <span className={styles.navBadge}>{item.badge}</span>
                                            )}
                                        </>
                                    )}
                                    {active && <span className={styles.activeDot} />}
                                </Link>
                            );

                            if (collapsed) {
                                return (
                                    <Tooltip key={item.id}>
                                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                                        <TooltipContent side="right" sideOffset={8}>
                                            {item.label}
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            }

                            return link;
                        })}
                    </div>
                ))}
            </nav>

            {/* API Key Settings */}
            <div className={styles.section} style={{ marginTop: "auto" }}>
                {!collapsed && <div className={styles.sectionTitle}>SETTINGS</div>}
                {(() => {
                    const keyButton = (
                        <button
                            onClick={() => setShowModal(true)}
                            className={styles.navItem}
                        >
                            <span className={styles.navIcon}><KeyRound size={16} /></span>
                            {!collapsed && (
                                <>
                                    <span className={styles.navLabel}>API Key</span>
                                    <span
                                        className={styles.statusDot}
                                        style={{
                                            background: hasApiKey ? "var(--green)" : "var(--red)",
                                            boxShadow: hasApiKey
                                                ? "0 0 6px rgba(0,255,136,0.5)"
                                                : "0 0 6px rgba(255,59,92,0.5)",
                                        }}
                                    />
                                </>
                            )}
                        </button>
                    );
                    if (collapsed) {
                        return (
                            <Tooltip>
                                <TooltipTrigger asChild>{keyButton}</TooltipTrigger>
                                <TooltipContent side="right" sideOffset={8}>
                                    API Key {hasApiKey ? "(Active)" : "(Not Set)"}
                                </TooltipContent>
                            </Tooltip>
                        );
                    }
                    return keyButton;
                })()}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
                <Separator className={styles.sep} />
                <div className={styles.status}>
                    <span className={styles.statusDot} />
                    {!collapsed && (
                        <span className={styles.statusText}>
                            GraphQL <span className={styles.statusGreen}>Connected</span>
                        </span>
                    )}
                </div>
                {!collapsed && (
                    <div className={styles.version}>v0.1.0 — Phase 1</div>
                )}
            </div>
        </aside>
    );
}
