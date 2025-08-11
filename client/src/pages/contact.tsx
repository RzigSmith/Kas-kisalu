import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ContactForm } from "@/components/contact/contact-form";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-Nous</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Prêts à discuter de votre projet ? Notre équipe est à votre disposition
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <ContactForm />

              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de Contact</h2>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Adresse</h3>
                      <p className="text-gray-600">Avenue de la Paix<br />Kinshasa, RDC</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Téléphone</h3>
                      <p className="text-gray-600">+243 858650570</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">contact@kaskisalu.cd</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Horaires</h3>
                      <p className="text-gray-600">Lun-Ven: 8h00-18h00<br />Sam: 8h00-12h00</p>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    asChild
                    className="bg-secondary text-white hover:bg-emerald-700"
                  >
                    <a href="tel:+243858650570" className="flex items-center justify-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Appeler</span>
                    </a>
                  </Button>
                  <Button
                    asChild
                    className="bg-accent text-white hover:bg-amber-700"
                  >
                    <a href="mailto:kaskisalu@gmail.com" className="flex items-center justify-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
