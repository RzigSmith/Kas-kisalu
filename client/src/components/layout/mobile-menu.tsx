import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

interface NavigationItem {
  href: string;
  label: string;
  color?: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  user?: any;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function MobileMenu({ isOpen, onClose, navigationItems, user, isAuthenticated, isLoading }: MobileMenuProps) {
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
        {!isLoading && (
          <div className="border-t border-gray-200 mt-4 pt-4">
            {isAuthenticated ? (
              <div className="px-3 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  {(user as any)?.profileImageUrl && (
                    <img 
                      src={(user as any).profileImageUrl} 
                      alt="Profile" 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  )}
                  <span>Bonjour, {(user as any)?.firstName || 'Utilisateur'}</span>
                </div>
                <Button 
                  asChild
                  variant="outline" 
                  size="sm"
                  className="w-full text-gray-700 hover:text-gray-900"
                  onClick={onClose}
                >
                  <a href="/api/logout">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </a>
                </Button>
              </div>
            ) : (
              <div className="px-3">
                <Button 
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={onClose}
                >
                  <a href="/api/login">
                    <User className="h-4 w-4 mr-2" />
                    Connexion
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
