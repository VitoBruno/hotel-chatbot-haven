
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { is } from 'date-fns/locale';

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: ChatOption[];
};

type ChatOption = {
  text: string;
  action: string;
};

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Olá! Bem-vindo ao Hotel Vitória. Como posso te ajudar hoje?',
    isBot: true,
    timestamp: new Date(),
    options: [
      { text: 'Como posso fazer minha reserva?', action: 'reserva' },
      { text: 'Tenho uma dúvida sobre minha reserva.', action: 'duvida_reserva' },
      { text: 'Gostaria de saber mais sobre os serviços do hotel.', action: 'servicos' },
      { text: 'Preciso de suporte técnico.', action: 'suporte' },
      { text: 'Quero deixar um feedback.', action: 'feedback' },
    ],
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

  const handleOptionClick = (action: string) => {
    let userMessage: Message = {
      id: Date.now().toString(),
      text: messages.find(m => m.options?.some(opt => opt.action === action))?.options?.find(opt => opt.action === action)?.text || '',
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    setTimeout(() => {
      let botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: '',
        isBot: true,
        timestamp: new Date(),
        options: [],
      };

      switch (action) {
        case 'reserva':
          botResponse.text = 'Você pode fazer sua reserva diretamente pelo nosso site ou se preferir, posso te ajudar agora mesmo!';
          botResponse.options = [
            { text: 'Quero fazer uma reserva agora.', action: 'fazer_reserva' },
            { text: 'Quero saber mais sobre os quartos disponíveis.', action: 'info_quartos' },
          ];
          break;
        case 'fazer_reserva':
          botResponse.text = 'Ótimo! Para qual data você gostaria de reservar?';
          // Aqui seria ideal ter um componente de calendário, mas vamos simplificar
          botResponse.options = [
            { text: 'Próximo fim de semana', action: 'data_selecionada' },
            { text: 'Próximo mês', action: 'data_selecionada' },
            { text: 'Outra data', action: 'data_selecionada' },
          ];
          break;
        case 'data_selecionada':
          botResponse.text = 'Temos disponibilidade para essa data. Qual tipo de quarto você prefere?';
          botResponse.options = [
            { text: 'Solteiro - R$110', action: 'quarto_selecionado' },
            { text: 'Solteiro com Ar Condicionado - R$150', action: 'quarto_selecionado' },
            { text: 'Casal - R$190', action: 'quarto_selecionado' },
            { text: 'Casal com Ar Condicionado - R$220', action: 'quarto_selecionado' },
          ];
          break;
        case 'quarto_selecionado':
          botResponse.text = 'Perfeito! Sua reserva está quase pronta. Posso confirmar os seguintes detalhes: 1 quarto para a data selecionada.';
          botResponse.options = [
            { text: 'Confirmar a reserva.', action: 'confirmar_reserva' },
            { text: 'Alterar detalhes.', action: 'reserva' },
          ];
          break;
        case 'confirmar_reserva':
          botResponse.text = 'Sua reserva foi feita com sucesso! Você receberá um e-mail com os detalhes. Precisa de mais alguma coisa?';
          botResponse.options = [
            { text: 'Não, obrigado.', action: 'encerrar' },
            { text: 'Sim, tenho outra dúvida.', action: 'inicio' },
          ];
          break;
        case 'duvida_reserva':
          botResponse.text = 'Certo! Para agilizar o atendimento, poderia informar seu código de reserva ou o nome utilizado na reserva?';
          // Simplificando para demonstração
          botResponse.options = [
            { text: 'Informar código', action: 'info_reserva' },
            { text: 'Não tenho o código', action: 'sem_codigo' },
          ];
          break;
        case 'info_reserva':
          botResponse.text = 'Obrigado! Aqui estão os detalhes da sua reserva: Quarto simples para 2 noites. Posso te ajudar com mais alguma coisa?';
          botResponse.options = [
            { text: 'Quero modificar minha reserva.', action: 'modificar_reserva' },
            { text: 'Quero cancelar minha reserva.', action: 'cancelar_reserva' },
            { text: 'Outra dúvida.', action: 'inicio' },
          ];
          break;
        case 'sem_codigo':
          botResponse.text = 'Sem problemas. Neste caso, sugiro entrar em contato com nossa recepção pelo telefone 35 999822446. Eles poderão ajudar com todas as informações sobre sua reserva.';
          botResponse.options = [
            { text: 'Entendi, obrigado.', action: 'encerrar' },
            { text: 'Tenho outra dúvida.', action: 'inicio' },
          ];
          break;
        case 'servicos':
          botResponse.text = 'Temos diversos serviços para tornar sua estadia mais confortável! Sobre qual serviço deseja saber mais?';
          botResponse.options = [
            { text: 'Café da Manhã', action: 'cafe_manha' },
            { text: 'Academia e Spa', action: 'academia_spa' },
            { text: 'Estacionamento', action: 'estacionamento' },
            { text: 'Outras informações', action: 'outras_infos' },
          ];
          break;
        case 'cafe_manha':
          botResponse.text = 'Nosso café da manhã é servido das 6h às 10h no restaurante principal. Oferecemos uma variedade de opções, incluindo frutas frescas, pães, queijos, frios, bolos, sucos naturais e café.';
          botResponse.options = [
            { text: 'Voltar aos serviços', action: 'servicos' },
            { text: 'Tenho outra dúvida', action: 'inicio' },
          ];
          break;
        case 'academia_spa':
          botResponse.text = 'Nossa academia está disponível 24 horas para os hóspedes. O spa oferece massagens e tratamentos de beleza, mediante agendamento prévio na recepção.';
          botResponse.options = [
            { text: 'Voltar aos serviços', action: 'servicos' },
            { text: 'Tenho outra dúvida', action: 'inicio' },
          ];
          break;
        case 'estacionamento':
          botResponse.text = 'Oferecemos estacionamento gratuito para todos os hóspedes, com segurança 24 horas.';
          botResponse.options = [
            { text: 'Voltar aos serviços', action: 'servicos' },
            { text: 'Tenho outra dúvida', action: 'inicio' },
          ];
          break;
        case 'suporte':
          botResponse.text = 'Entendi! Pode me informar qual problema está enfrentando?';
          botResponse.options = [
            { text: 'O Wi-Fi não está funcionando.', action: 'wifi_problema' },
            { text: 'Problema com TV a cabo.', action: 'tv_problema' },
            { text: 'Ar-condicionado não liga.', action: 'ar_problema' },
            { text: 'Outro problema.', action: 'outro_problema' },
          ];
          break;
        case 'wifi_problema':
          botResponse.text = 'Vamos resolver isso! Tente desconectar e conectar novamente à rede "Hotel_Vitoria". A senha é o número do seu quarto seguido de "guest". Caso o problema persista, vou encaminhar sua solicitação para nossa equipe de suporte.';
          botResponse.options = [
            { text: 'Funcionou, obrigado!', action: 'encerrar' },
            { text: 'Ainda não funciona', action: 'suporte_humano' },
          ];
          break;
        case 'feedback':
          botResponse.text = 'Adoraríamos ouvir sua opinião! Como você avalia sua experiência no nosso hotel?';
          botResponse.options = [
            { text: 'Excelente!', action: 'feedback_excelente' },
            { text: 'Boa, mas poderia melhorar.', action: 'feedback_bom' },
            { text: 'Não foi uma boa experiência.', action: 'feedback_ruim' },
          ];
          break;
        case 'feedback_excelente':
          botResponse.text = 'Que maravilha! Ficamos muito felizes em saber que sua experiência foi excelente. Obrigado pelo feedback positivo, ele é muito importante para nós! Esperamos recebê-lo novamente em breve.';
          botResponse.options = [
            { text: 'Tenho outra dúvida', action: 'inicio' },
            { text: 'Encerrar conversa', action: 'encerrar' },
          ];
          break;
        case 'encerrar':
          botResponse.text = 'Obrigado por falar comigo! Se precisar de mais alguma coisa, é só chamar. Tenha um ótimo dia! 😊';
          botResponse.options = [
            { text: 'Iniciar nova conversa', action: 'inicio' },
          ];
          break;
        case 'inicio':
          // Retorna ao menu inicial
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: 'Como posso te ajudar hoje?',
            isBot: true,
            timestamp: new Date(),
            options: initialMessages[0].options,
          };
          break;
        default:
          botResponse.text = 'Desculpe, não entendi sua solicitação. Como posso te ajudar?';
          botResponse.options = initialMessages[0].options;
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

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

    // Simulate response based on keywords
    setTimeout(() => {
      // Default response if no keywords match
      let botResponse = "Desculpe, não entendi completamente sua pergunta. Você pode escolher uma das opções abaixo para que eu possa te ajudar melhor.";
      let options: ChatOption[] = initialMessages[0].options || [];
      
      const keywords = {
        reserva: ['reserva', 'reservar', 'quarto', 'agendar', 'marcar'],
        duvida: ['dúvida', 'duvida', 'reserva existente', 'confirmação'],
        servicos: ['serviço', 'servico', 'wifi', 'café', 'restaurante', 'spa'],
        suporte: ['problema', 'não funciona', 'quebrado', 'suporte', 'ajuda técnica'],
        feedback: ['feedback', 'opinião', 'avaliação', 'comentário', 'sugestão']
      };
      
      // Check for keywords in user message
      const lowerCaseMessage = userMessage.text.toLowerCase();
      
      if (keywords.reserva.some(word => lowerCaseMessage.includes(word))) {
        handleOptionClick('reserva');
        return;
      } else if (keywords.duvida.some(word => lowerCaseMessage.includes(word))) {
        handleOptionClick('duvida_reserva');
        return;
      } else if (keywords.servicos.some(word => lowerCaseMessage.includes(word))) {
        handleOptionClick('servicos');
        return;
      } else if (keywords.suporte.some(word => lowerCaseMessage.includes(word))) {
        handleOptionClick('suporte');
        return;
      } else if (keywords.feedback.some(word => lowerCaseMessage.includes(word))) {
        handleOptionClick('feedback');
        return;
      }

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
        options: options
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
              <h3 className="font-medium text-hotel-900 dark:text-hotel-100">Assistente Hotel Vitória</h3>
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

            {/* Options buttons */}
            {messages.length > 0 && messages[messages.length - 1].options && messages[messages.length - 1].options!.length > 0 && (
              <div className="flex flex-col space-y-2 mt-4">
                {messages[messages.length - 1].options!.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option.action)}
                    className="text-sm bg-hotel-50 hover:bg-hotel-100 dark:bg-hotel-800 dark:hover:bg-hotel-700 text-hotel-800 dark:text-hotel-100 px-4 py-2 rounded-lg text-left transition-colors border border-hotel-200 dark:border-hotel-700"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}

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
