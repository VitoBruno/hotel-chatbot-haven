
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const ContactSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-hotel-50 dark:from-hotel-900 dark:to-hotel-950">
      <div className="section-container">
        <div className="text-center mb-16 animate-fade-up opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-hotel-800 dark:text-hotel-200">
            Entre em Contato
          </h2>
          <p className="text-hotel-600 dark:text-hotel-400 max-w-xl mx-auto">
            Estamos à disposição para sanar dúvidas, receber sugestões ou ajudar com sua reserva.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-fade-up opacity-0" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white dark:bg-hotel-900 rounded-xl shadow-sm p-8 border border-hotel-100 dark:border-hotel-800">
              <h3 className="text-xl font-semibold mb-6 text-hotel-800 dark:text-hotel-200">
                Envie-nos uma mensagem
              </h3>
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-hotel-700 dark:text-hotel-300 mb-1">
                      Nome completo
                    </label>
                    <Input 
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      className="w-full border-hotel-200 dark:border-hotel-700 focus:ring-hotel-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-hotel-700 dark:text-hotel-300 mb-1">
                      Email
                    </label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="w-full border-hotel-200 dark:border-hotel-700 focus:ring-hotel-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-hotel-700 dark:text-hotel-300 mb-1">
                    Assunto
                  </label>
                  <Input 
                    id="subject"
                    type="text"
                    placeholder="Como podemos ajudar?"
                    className="w-full border-hotel-200 dark:border-hotel-700 focus:ring-hotel-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-hotel-700 dark:text-hotel-300 mb-1">
                    Mensagem
                  </label>
                  <Textarea 
                    id="message"
                    placeholder="Digite sua mensagem aqui..."
                    className="w-full h-32 border-hotel-200 dark:border-hotel-700 focus:ring-hotel-500"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-hotel-800 hover:bg-hotel-700 text-white"
                >
                  Enviar Mensagem
                </Button>
              </form>
            </div>
          </div>
          
          <div className="animate-fade-up opacity-0" style={{ animationDelay: '0.3s' }}>
            <div className="grid grid-cols-1 gap-8 h-full">
              <div className="bg-white dark:bg-hotel-900 rounded-xl shadow-sm p-8 border border-hotel-100 dark:border-hotel-800">
                <h3 className="text-xl font-semibold mb-6 text-hotel-800 dark:text-hotel-200">
                  Informações de Contato
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-hotel-100 dark:bg-hotel-800 flex items-center justify-center text-hotel-600 dark:text-hotel-400 mr-4 flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-hotel-800 dark:text-hotel-200 mb-1">Localização</h4>
                      <p className="text-hotel-600 dark:text-hotel-400">
                        Avenida princesa do Sul N°28, Jardim Andere<br />
                        Varginha - MG
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-hotel-100 dark:bg-hotel-800 flex items-center justify-center text-hotel-600 dark:text-hotel-400 mr-4 flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-hotel-800 dark:text-hotel-200 mb-1">Telefone</h4>
                      <p className="text-hotel-600 dark:text-hotel-400">
                        35 999822446
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-hotel-900 rounded-xl shadow-sm p-8 border border-hotel-100 dark:border-hotel-800 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-hotel-800 dark:text-hotel-200">
                  Horários de Atendimento
                </h3>
                
                <div className="flex-1">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-hotel-600 dark:text-hotel-400">Recepção:</span>
                      <span className="text-hotel-800 dark:text-hotel-200 font-medium">24 horas</span>
                    </div>
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

export default ContactSection;
