
import React from 'react';
import { Utensils, Wifi, CarFront, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="bg-white dark:bg-hotel-900 p-6 rounded-xl shadow-sm border border-hotel-100 dark:border-hotel-800 hover:shadow-md transition-all duration-300 group animate-fade-up opacity-0"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="w-12 h-12 bg-hotel-50 dark:bg-hotel-800 rounded-full flex items-center justify-center text-hotel-600 dark:text-hotel-300 mb-4 group-hover:bg-hotel-100 dark:group-hover:bg-hotel-700 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-hotel-800 dark:text-hotel-200">{title}</h3>
      <p className="text-hotel-600 dark:text-hotel-400">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    { 
      icon: <Utensils size={24} />, 
      title: 'Café da Manhã', 
      description: 'Buffet matinal completo com opções internacionais e especialidades locais das 6h às 10h.'
    },
    { 
      icon: <Wifi size={24} />, 
      title: 'Wi-Fi de Alta Velocidade', 
      description: 'Conexão gratuita em todas as áreas do hotel para sua conveniência.'
    },
    { 
      icon: <CarFront size={24} />, 
      title: 'Estacionamento', 
      description: 'Serviço de manobrista e estacionamento seguro para seu veículo.'
    },
    { 
      icon: <Clock size={24} />, 
      title: 'Recepção 24h', 
      description: 'Atendimento personalizado a qualquer hora do dia ou da noite.'
    },
  ];

  return (
    <section className="py-20 bg-hotel-50 dark:bg-gradient-to-b dark:from-hotel-950 dark:to-hotel-900">
      <div className="section-container">
        <div className="text-center mb-16 animate-fade-up opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-hotel-800 dark:text-hotel-200">
            Comodidades Exclusivas
          </h2>
          <p className="text-hotel-600 dark:text-hotel-400 max-w-xl mx-auto">
            Cada aspecto do Hotel Vitória foi cuidadosamente pensado para proporcionar uma experiência excepcional aos nossos hóspedes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Feature 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index + 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
