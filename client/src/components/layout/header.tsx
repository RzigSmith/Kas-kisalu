import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "Accueil" },
    { href: "/construction", label: "Construction", color: "construction" },
    { href: "/agriculture", label: "Agriculture", color: "agriculture" },
    { href: "/elevage", label: "Élevage", color: "elevage" },
    { href: "/transport", label: "Transport", color: "transport" },
  ];

  return (
    <>
      <header className="bg-white shadow-lg fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <img 
                    src="/attached_assets/IMG_1406_1753812393970.jpeg" 
                    alt="Kas Kisalu Logo" 
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <h1 className="text-2xl font-bold text-primary">
                    Kas Kisalu
                  </h1>
                </div>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                        location === item.href
                          ? `text-${item.color || "primary"}`
                          : `text-gray-700 hover:text-${item.color || "primary"}`
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
                <Link href="/contact">
                  <Button className="bg-primary text-white hover:bg-blue-700">
                    Contact
                  </Button>
                </Link>
                
                <Button 
                  asChild
                  variant="outline"
                  className="ml-4"
                >
                  <a href="/api/login">
                    <User className="h-4 w-4 mr-1" />
                    Connexion
                  </a>
                </Button>
              </div>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
      />
    </>
  );
}
