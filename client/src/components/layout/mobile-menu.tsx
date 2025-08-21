import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface NavigationItem {
  href: string;
  label: string;
  color?: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  isAuthenticated: boolean;
  handleLogout: () => void;
}

export function MobileMenu({ isOpen, onClose, navigationItems, isAuthenticated, handleLogout }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed top-16 left-0 right-0 bg-white shadow-lg z-40">
      <div className="px-2 pt-2 pb-3 space-y-1">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <span
              className={`block px-3 py-2 text-base font-medium text-gray-700 hover:text-${
                item.color || "primary"
              } cursor-pointer`}
              onClick={onClose}
            >
              {item.label}
            </span>
          </Link>
        ))}
        <Link href="/contact">
          <Button
            className="block mx-3 mt-2 bg-primary text-white hover:bg-blue-700 w-[calc(100%-1.5rem)]"
            onClick={onClose}
          >
            Contact
          </Button>
        </Link>
        
        {/* Authentication Section */}
        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="px-3">
            {isAuthenticated ? (
              <Button 
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-800"
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
              >
                <User size={16} />
                Déconnexion
              </Button>
            ) : (
              <Link href="/login">
                <Button 
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={onClose}
                >
                  <User size={16} />
                  Se connecter
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
