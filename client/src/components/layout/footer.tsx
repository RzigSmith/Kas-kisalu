import { Link } from "wouter";
import { Facebook, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Kas Kisalu</h3>
            <p className="text-gray-400 mb-4">
              Votre partenaire multi-sectoriel pour tous vos projets de construction, agriculture, élevage et transport.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Nos Secteurs</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/construction">
                  <span className="hover:text-white transition-colors cursor-pointer">Construction</span>
                </Link>
              </li>
              <li>
                <Link href="/agriculture">
                  <span className="hover:text-white transition-colors cursor-pointer">Agriculture</span>
                </Link>
              </li>
              <li>
                <Link href="/elevage">
                  <span className="hover:text-white transition-colors cursor-pointer">Élevage</span>
                </Link>
              </li>
              <li>
                <Link href="/transport">
                  <span className="hover:text-white transition-colors cursor-pointer">Transport</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Devis gratuit</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Consultation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support 24/7</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Maintenance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Avenue de la Paix</li>
              <li>Kinshasa, RDC</li>
              <li>+243 81 234 56 78</li>
              <li>contact@kaskisalu.cd</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2023 Kas Kisalu. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
