import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  Building2,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AdminSidebarProps {
  onLogout: () => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projets",
    href: "/admin/projects",
    icon: Building2,
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Statistiques", 
    href: "/admin/stats",
    icon: BarChart3,
  },
  {
    title: "Gestion du site",
    href: "/admin/site-management",
    icon: Settings,
  },
];

export function AdminSidebar({ onLogout, isMobileOpen = false, onMobileToggle }: AdminSidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex h-full w-64 flex-col fixed left-0 top-0 z-50 bg-gray-900 transform transition-transform duration-200 ease-in-out",
        "lg:translate-x-0", // Always visible on desktop
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0" // Mobile responsive
      )}>
        {/* Header avec bouton mobile */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">Admin Kas Kisalu</h2>
          {/* Bouton fermer mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-300 hover:text-white"
            onClick={onMobileToggle}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                  onClick={() => {
                    // Fermer le menu mobile après clic
                    if (onMobileToggle && isMobileOpen) {
                      onMobileToggle();
                    }
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-800 p-4">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </div>
    </>
  );
}