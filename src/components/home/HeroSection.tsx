
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Users, Bed } from 'lucide-react';
import { cn } from '@/lib/utils';

const HeroSection: React.FC = () => {
  const [searchActive, setSearchActive] = useState(false);

  return (
    <section className="relative h-screen flex items-end justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1496307653780-42ee777d4833?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Hotel Vitória"
          className="w-full h-full object-cover object-center animate-blur-in"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white mb-32 px-4 w-full max-w-4xl mx-auto animate-stagger">
        <div className="animate-fade-up opacity-0">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Hotel Vitória
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/80">
            Um refúgio de luxo onde cada detalhe é pensado para proporcionar momentos inesquecíveis
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="max-w-6xl mx-auto px-4 mb-8">
          <div 
            className={cn(
              "bg-white/90 backdrop-blur-lg rounded-xl shadow-xl transition-all duration-500 overflow-hidden dark:bg-hotel-900/90",
              searchActive ? "p-6" : "p-4"
            )}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className="bg-hotel-50 dark:bg-hotel-800 p-4 rounded-lg cursor-pointer"
                onClick={() => setSearchActive(true)}
              >
                <div className="flex items-center text-hotel-800 dark:text-hotel-200">
                  <CalendarIcon className="mr-2 h-5 w-5 text-hotel-600 dark:text-hotel-400" />
                  <div>
                    <p className="text-sm font-medium">Check-in / Check-out</p>
                    <p className="text-xs text-hotel-600 dark:text-hotel-400">Selecione as datas</p>
                  </div>
                </div>
              </div>

              <div 
                className="bg-hotel-50 dark:bg-hotel-800 p-4 rounded-lg cursor-pointer"
                onClick={() => setSearchActive(true)}
              >
                <div className="flex items-center text-hotel-800 dark:text-hotel-200">
                  <Users className="mr-2 h-5 w-5 text-hotel-600 dark:text-hotel-400" />
                  <div>
                    <p className="text-sm font-medium">Hóspedes</p>
                    <p className="text-xs text-hotel-600 dark:text-hotel-400">Adultos, crianças</p>
                  </div>
                </div>
              </div>

              <div 
                className="bg-hotel-50 dark:bg-hotel-800 p-4 rounded-lg cursor-pointer"
                onClick={() => setSearchActive(true)}
              >
                <div className="flex items-center text-hotel-800 dark:text-hotel-200">
                  <Bed className="mr-2 h-5 w-5 text-hotel-600 dark:text-hotel-400" />
                  <div>
                    <p className="text-sm font-medium">Tipo de Quarto</p>
                    <p className="text-xs text-hotel-600 dark:text-hotel-400">Suite, Standard, etc.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
