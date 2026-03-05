"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    BarChart3,
    Newspaper,
    Terminal,
    ChevronLeft,
    ChevronRight,
    Zap,
    Globe,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import styles from "./Sidebar.module.css";

interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
}

const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
    {
        title: "OVERVIEW",
        items: [
            { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
            { id: "sectors", label: "Sectors", icon: <BarChart3 size={16} />, badge: "10" },
            { id: "news", label: "News Feed", icon: <Newspaper size={16} /> },
        ],
    },
    {
        title: "INTELLIGENCE",
        items: [
            { id: "terminal", label: "AI Terminal", icon: <Terminal size={16} /> },
            { id: "agents", label: "Agents", icon: <Zap size={16} />, badge: "Q2" },
        ],
    },
    {
        title: "MARKETS",
        items: [
            { id: "us", label: "US Markets", icon: <Globe size={16} /> },
            { id: "in", label: "Indian Markets", icon: <Globe size={16} /> },
        ],
    },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [activeId, setActiveId] = useState("dashboard");

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
                            const isActive = item.id === activeId;
                            const button = (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveId(item.id)}
                                    className={`${styles.navItem} ${isActive ? styles.active : ""}`}
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
                                    {isActive && <span className={styles.activeDot} />}
                                </button>
                            );

                            if (collapsed) {
                                return (
                                    <Tooltip key={item.id}>
                                        <TooltipTrigger asChild>{button}</TooltipTrigger>
                                        <TooltipContent side="right" sideOffset={8}>
                                            {item.label}
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            }

                            return button;
                        })}
                    </div>
                ))}
            </nav>

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
