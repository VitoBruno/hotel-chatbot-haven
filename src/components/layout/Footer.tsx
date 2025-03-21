
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  return (
    <footer className="bg-hotel-50 dark:bg-hotel-950 border-t border-hotel-100 dark:border-hotel-800">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="block text-2xl font-semibold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-hotel-800 to-hotel-600 dark:from-hotel-200 dark:to-hotel-400">
                Serenity Hotel
              </span>
            </Link>
            <p className="text-hotel-600 dark:text-hotel-400 max-w-xs">
              Um refúgio de tranquilidade e sofisticação, onde cada detalhe é pensado para proporcionar uma experiência excepcional.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-hotel-500 hover:text-hotel-700 dark:text-hotel-400 dark:hover:text-hotel-200 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-hotel-500 hover:text-hotel-700 dark:text-hotel-400 dark:hover:text-hotel-200 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-hotel-500 hover:text-hotel-700 dark:text-hotel-400 dark:hover:text-hotel-200 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-hotel-500 hover:text-hotel-700 dark:text-hotel-400 dark:hover:text-hotel-200 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-hotel-800 dark:text-hotel-200">Links Rápidos</h3>
            <ul className="space-y-2">
              {['Sobre Nós', 'Acomodações', 'Serviços', 'Galeria', 'Ofertas', 'Contato'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(/\s/g, '-')}`}
                    className="text-hotel-600 hover:text-hotel-800 dark:text-hotel-400 dark:hover:text-hotel-200 transition-colors inline-flex items-center group"
                  >
                    <ArrowRight size={14} className="mr-2 transition-transform group-hover:translate-x-1" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-hotel-800 dark:text-hotel-200">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mt-1 mr-3 text-hotel-500 dark:text-hotel-400 flex-shrink-0" />
                <span className="text-hotel-600 dark:text-hotel-400">
                  Av. Beira Mar, 1000, Praia Dourada<br />
                  São Paulo - SP, 01234-567
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3 text-hotel-500 dark:text-hotel-400 flex-shrink-0" />
                <span className="text-hotel-600 dark:text-hotel-400">+55 (11) 9876-5432</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3 text-hotel-500 dark:text-hotel-400 flex-shrink-0" />
                <span className="text-hotel-600 dark:text-hotel-400">contato@serenityhotel.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-hotel-800 dark:text-hotel-200">Newsletter</h3>
            <p className="text-hotel-600 dark:text-hotel-400 mb-4">
              Inscreva-se para receber ofertas exclusivas e novidades.
            </p>
            <div className="space-y-3">
              <Input 
                type="email" 
                placeholder="Seu email" 
                className="bg-white dark:bg-hotel-900 border-hotel-200 dark:border-hotel-700" 
              />
              <Button className="w-full bg-hotel-800 hover:bg-hotel-700 text-white">
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-hotel-200 dark:border-hotel-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-hotel-500 dark:text-hotel-400 text-sm">
            © 2023 Serenity Hotel. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/termos-de-uso" className="text-hotel-500 hover:text-hotel-700 dark:text-hotel-400 dark:hover:text-hotel-200 text-sm">
              Termos de Uso
            </Link>
            <Link to="/politica-de-privacidade" className="text-hotel-500 hover:text-hotel-700 dark:text-hotel-400 dark:hover:text-hotel-200 text-sm">
              Política de Privacidade
            </Link>
            <Link to="/cookies" className="text-hotel-500 hover:text-hotel-700 dark:text-hotel-400 dark:hover:text-hotel-200 text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
