import { ReactNode, useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar 
        onLogout={handleLogout} 
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={toggleMobileMenu}
      />
      
      <main className="flex-1 lg:ml-64 overflow-auto">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="text-gray-600"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}