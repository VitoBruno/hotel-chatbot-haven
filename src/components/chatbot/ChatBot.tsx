
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ArrowUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Olá! Sou o assistente virtual do Serenity Hotel. Como posso ajudar você hoje?',
    isBot: true,
    timestamp: new Date(),
  },
];

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate API call with timeout
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        reserva: "Para fazer uma reserva, você pode utilizar nosso sistema online ou ligar para +55 (11) 9876-5432. Posso ajudar com mais informações sobre disponibilidade, tipos de quarto ou tarifas?",
        quarto: "Temos diversos tipos de quartos e suítes, desde Standard até Suítes Presidenciais. Todos incluem Wi-Fi, ar-condicionado, TV de tela plana, minibar e amenidades de luxo. Algum tipo específico que gostaria de conhecer?",
        restaurante: "Nosso hotel conta com 3 restaurantes: o Terrazzo (culinária internacional), o Sakura (japonês) e o Olivetto (italiano). Servimos café da manhã das 6h às 10h, almoço das 12h às 15h e jantar das 19h às 23h.",
        checkout: "Nosso horário de check-out é às 12h, mas podemos oferecer late check-out até às 14h mediante disponibilidade. Há alguma data específica para sua saída?",
        checkin: "O check-in pode ser realizado a partir das 14h. Para early check-in, recomendamos solicitar antecipadamente, sujeito à disponibilidade.",
        piscina: "Temos uma piscina ao ar livre no terraço com vista panorâmica e uma piscina interna aquecida no spa. O horário de funcionamento é das 7h às 22h.",
        spa: "Nosso spa oferece diversos tratamentos, massagens e terapias. Funciona diariamente das 9h às 21h. Recomendamos reservar seu tratamento com antecedência.",
        estacionamento: "Oferecemos serviço de manobrista e estacionamento seguro para nossos hóspedes. O valor da diária é de R$40,00.",
        wifi: "Oferecemos Wi-Fi gratuito de alta velocidade em todas as áreas do hotel.",
        pets: "Somos pet-friendly! Aceitamos animais de pequeno porte com taxa adicional de R$80 por dia. Temos amenidades especiais para seu pet."
      };

      let botResponse = "Não entendi completamente sua pergunta. Posso ajudar com informações sobre reservas, quartos, restaurantes, check-in/out, instalações como piscina e spa, estacionamento, Wi-Fi ou política para pets.";
      
      // Check if message contains any of the keywords
      for (const [keyword, response] of Object.entries(botResponses)) {
        if (userMessage.text.toLowerCase().includes(keyword.toLowerCase())) {
          botResponse = response;
          break;
        }
      }

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed right-5 bottom-5 z-50 p-4 rounded-full shadow-lg transition-all duration-300",
          isOpen 
            ? "bg-hotel-100 text-hotel-800 hover:bg-hotel-200" 
            : "bg-hotel-800 text-white hover:bg-hotel-700"
        )}
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      <div
        className={cn(
          "fixed right-5 bottom-20 z-50 w-[90%] sm:w-[400px] h-[500px] rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ease-in-out flex flex-col bg-white dark:bg-hotel-900 border border-hotel-100 dark:border-hotel-800",
          isOpen 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-95 translate-y-8 pointer-events-none"
        )}
      >
        {/* Chat header */}
        <div className="p-4 border-b border-hotel-100 dark:border-hotel-800 bg-hotel-50 dark:bg-hotel-950">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-hotel-800 flex items-center justify-center text-white mr-3 animate-subtle-float">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className="font-medium text-hotel-900 dark:text-hotel-100">Assistente Serenity</h3>
              <p className="text-xs text-hotel-500 dark:text-hotel-400">Online • Resposta em instantes</p>
            </div>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-end mb-4 animate-fade-up",
                  message.isBot ? "justify-start" : "justify-end"
                )}
              >
                {message.isBot && (
                  <div className="w-8 h-8 rounded-full bg-hotel-800 flex items-center justify-center text-white mr-2 flex-shrink-0">
                    <MessageCircle size={14} />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 max-w-[85%]",
                    message.isBot
                      ? "bg-hotel-50 dark:bg-hotel-800 text-hotel-900 dark:text-hotel-100 rounded-bl-none"
                      : "bg-hotel-800 text-white rounded-br-none"
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-[10px] mt-1 opacity-60">
                    {new Intl.DateTimeFormat('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end mb-4 justify-start animate-fade-up">
                <div className="w-8 h-8 rounded-full bg-hotel-800 flex items-center justify-center text-white mr-2 flex-shrink-0">
                  <MessageCircle size={14} />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-hotel-50 dark:bg-hotel-800 text-hotel-900 dark:text-hotel-100 rounded-bl-none">
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-hotel-100 dark:border-hotel-800 bg-hotel-50 dark:bg-hotel-950">
          <div className="flex items-center">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 p-3 rounded-l-lg border-y border-l border-hotel-200 dark:border-hotel-700 focus:outline-none focus:ring-1 focus:ring-hotel-500 bg-white dark:bg-hotel-900 dark:text-hotel-100 resize-none overflow-hidden max-h-[120px]"
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="rounded-l-none rounded-r-lg bg-hotel-800 hover:bg-hotel-700 h-full px-4"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
          <p className="text-xs text-hotel-500 dark:text-hotel-400 mt-2 text-center">
            Atendimento 24 horas para melhor atendê-lo
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
