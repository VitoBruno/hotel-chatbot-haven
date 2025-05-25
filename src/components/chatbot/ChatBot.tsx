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
    text: 'Olá! Boas-vindas ao Hotel Vitória! Sou seu assistente virtual e estou aqui para ajudar com suas dúvidas e solicitações. Como posso ser útil hoje?',
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
    let userMessageText = '';
    // Find the text of the option clicked by the user
    const lastBotMessageWithOptions = messages.slice().reverse().find(m => m.isBot && m.options && m.options.length > 0);
    if (lastBotMessageWithOptions && lastBotMessageWithOptions.options) {
        const clickedOption = lastBotMessageWithOptions.options.find(opt => opt.action === action);
        if (clickedOption) {
            userMessageText = clickedOption.text;
        }
    }
    // If not found in last bot message, check initial messages (less likely for subsequent interactions but good for robustness)
    if (!userMessageText) {
        const initialOption = initialMessages[0].options?.find(opt => opt.action === action);
        if (initialOption) {
            userMessageText = initialOption.text;
        }
    }
    // Fallback if text not found (e.g. direct action call)
    if (!userMessageText) {
        userMessageText = action.replace(/_/g, ' '); // Simple fallback
        userMessageText = userMessageText.charAt(0).toUpperCase() + userMessageText.slice(1);
    }

    let userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
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
          botResponse.text = 'Com certeza! Você pode fazer sua reserva de forma rápida e segura através do nosso site. Se preferir, posso te guiar pelo processo por aqui. O que acha?';
          botResponse.options = [
            { text: 'Quero fazer uma reserva agora.', action: 'fazer_reserva' },
            { text: 'Quero saber mais sobre os quartos disponíveis.', action: 'info_quartos' },
          ];
          break;
        case 'fazer_reserva':
          botResponse.text = 'Excelente escolha! Para começarmos, por favor, me informe para qual data você gostaria de fazer a reserva?';
          botResponse.options = [
            { text: 'Próximo fim de semana', action: 'data_selecionada' },
            { text: 'Próximo mês', action: 'data_selecionada' },
            { text: 'Outra data', action: 'data_selecionada' },
          ];
          break;
        case 'data_selecionada':
          botResponse.text = 'Perfeito! Verifiquei aqui e temos disponibilidade para a data selecionada. Agora, qual tipo de quarto melhor se adapta às suas necessidades? Temos algumas opções excelentes.';
          botResponse.options = [
            { text: 'Solteiro - R$110', action: 'quarto_selecionado' },
            { text: 'Solteiro com Ar Condicionado - R$150', action: 'quarto_selecionado' },
            { text: 'Casal - R$190', action: 'quarto_selecionado' },
            { text: 'Casal com Ar Condicionado - R$220', action: 'quarto_selecionado' },
          ];
          break;
        case 'quarto_selecionado':
          botResponse.text = 'Ótima escolha! Estamos quase lá. Para confirmar, sua pré-reserva inclui o tipo de quarto selecionado para as datas escolhidas. Deseja prosseguir com a confirmação?';
          botResponse.options = [
            { text: 'Confirmar a reserva.', action: 'confirmar_reserva' },
            { text: 'Alterar detalhes.', action: 'reserva' },
          ];
          break;
        case 'confirmar_reserva':
          botResponse.text = 'Parabéns! Sua reserva no Hotel Vitória foi confirmada com sucesso! Em instantes, você receberá um e-mail com todos os detalhes. Há algo mais em que posso te ajudar agora?';
          botResponse.options = [
            { text: 'Não, obrigado(a).', action: 'encerrar' },
            { text: 'Sim, tenho outra dúvida.', action: 'inicio' },
          ];
          break;
        case 'duvida_reserva':
          botResponse.text = 'Entendido. Para que eu possa localizar sua reserva rapidamente e te ajudar da melhor forma, por favor, informe o código da reserva ou o nome completo em que ela foi realizada.';
          botResponse.options = [
            { text: 'Informar código/nome', action: 'info_reserva' }, // Changed action to be more generic, or expect text input
            { text: 'Não tenho os dados agora', action: 'sem_codigo' },
          ];
          break;
        case 'info_reserva':
          // This case now assumes user will type info, or we need another step.
          // For simplicity, let's assume this is a placeholder response after they *would* provide info.
          botResponse.text = 'Obrigado pelas informações! Localizei sua reserva. Como posso te ajudar com ela hoje? Você pode querer modificar, cancelar ou apenas tirar alguma dúvida sobre os detalhes.';
          botResponse.options = [
            { text: 'Quero modificar minha reserva.', action: 'modificar_reserva' }, // Placeholder actions
            { text: 'Quero cancelar minha reserva.', action: 'cancelar_reserva' },   // Placeholder actions
            { text: 'Voltar ao início', action: 'inicio' },
          ];
          break;
        case 'sem_codigo':
          botResponse.text = 'Não se preocupe. Se não tiver o código ou o nome exato, o ideal é entrar em contato diretamente com nossa recepção pelo telefone (35) 99982-2446. Nossa equipe terá prazer em localizar sua reserva e ajudar com o que precisar.';
          botResponse.options = [
            { text: 'Entendi, obrigado(a).', action: 'encerrar' },
            { text: 'Tenho outra dúvida.', action: 'inicio' },
          ];
          break;
        case 'servicos':
          botResponse.text = 'No Hotel Vitória, oferecemos uma variedade de serviços pensados para tornar sua estadia ainda mais especial e confortável. Sobre qual deles você gostaria de mais informações?';
          botResponse.options = [
            { text: 'Café da Manhã', action: 'cafe_manha' },
            { text: 'Academia e Spa', action: 'academia_spa' },
            { text: 'Estacionamento', action: 'estacionamento' },
            { text: 'Outras informações', action: 'outras_infos' }, // Placeholder for more services
          ];
          break;
        case 'cafe_manha':
          botResponse.text = 'Nosso delicioso café da manhã é servido diariamente das 6h às 10h em nosso restaurante principal. Preparamos uma seleção variada com frutas da estação, pães fresquinhos, queijos, frios, bolos caseiros, sucos naturais, café e muito mais para você começar o dia com energia!';
          botResponse.options = [
            { text: 'Voltar aos serviços', action: 'servicos' },
            { text: 'Tenho outra dúvida', action: 'inicio' },
          ];
          break;
        case 'academia_spa':
          botResponse.text = 'Para seu bem-estar, nossa academia moderna fica à disposição dos hóspedes 24 horas por dia. Além disso, nosso Spa oferece uma gama de massagens relaxantes e tratamentos de beleza revigorantes. Lembre-se que os serviços do Spa requerem agendamento prévio na recepção.';
          botResponse.options = [
            { text: 'Voltar aos serviços', action: 'servicos' },
            { text: 'Tenho outra dúvida', action: 'inicio' },
          ];
          break;
        case 'estacionamento':
          botResponse.text = 'Para sua comodidade e segurança, oferecemos estacionamento gratuito e coberto para todos os nossos hóspedes, com monitoramento 24 horas.';
          botResponse.options = [
            { text: 'Voltar aos serviços', action: 'servicos' },
            { text: 'Tenho outra dúvida', action: 'inicio' },
          ];
          break;
        case 'suporte':
          botResponse.text = 'Lamento que esteja enfrentando um problema. Para que eu possa te direcionar ao suporte correto ou tentar ajudar, por favor, descreva a dificuldade que está encontrando.';
          botResponse.options = [
            { text: 'O Wi-Fi não está funcionando.', action: 'wifi_problema' },
            { text: 'Problema com TV a cabo.', action: 'tv_problema' }, // Placeholder
            { text: 'Ar-condicionado não liga.', action: 'ar_problema' }, // Placeholder
            { text: 'Outro problema.', action: 'outro_problema' }, // Placeholder
          ];
          break;
        case 'wifi_problema':
          botResponse.text = 'Claro, vamos tentar resolver isso! Por favor, tente se desconectar da rede "Hotel_Vitoria" e conectar novamente. A senha padrão é o número do seu quarto seguido da palavra "guest" (ex: 101guest). Se o problema continuar, me avise para que eu possa notificar nossa equipe de suporte técnico imediatamente.';
          botResponse.options = [
            { text: 'Funcionou, obrigado(a)!', action: 'encerrar' },
            { text: 'Ainda não funciona', action: 'suporte_humano' }, // Placeholder
          ];
          break;
        case 'feedback':
          botResponse.text = 'Sua opinião é muito valiosa para nós! Gostaríamos muito de saber como foi sua experiência no Hotel Vitória. Como você a avaliaria?';
          botResponse.options = [
            { text: 'Excelente!', action: 'feedback_excelente' },
            { text: 'Boa, mas poderia melhorar.', action: 'feedback_bom' }, // Placeholder
            { text: 'Não foi uma boa experiência.', action: 'feedback_ruim' }, // Placeholder
          ];
          break;
        case 'feedback_excelente':
          botResponse.text = 'Que notícia fantástica! Ficamos imensamente felizes em saber que sua experiência conosco foi excelente. Seu feedback positivo é um grande incentivo para toda nossa equipe. Muito obrigado por compartilhar e esperamos ter o prazer de recebê-lo novamente em breve!';
          botResponse.options = [
            { text: 'Tenho outra dúvida', action: 'inicio' },
            { text: 'Encerrar conversa', action: 'encerrar' },
          ];
          break;
        case 'encerrar':
          botResponse.text = 'Foi um prazer ajudar! Agradeço por conversar comigo. Se precisar de qualquer outra assistência no futuro, estou à disposição. Tenha um excelente dia e aproveite sua estadia (ou futura estadia) no Hotel Vitória! 😊';
          botResponse.options = [
            { text: 'Iniciar nova conversa', action: 'inicio' },
          ];
          break;
        case 'inicio':
          botResponse = {
            ...initialMessages[0], // Use the full initial message object structure
            id: (Date.now() + 1).toString(), // New ID
            timestamp: new Date(), // New timestamp
            text: 'Estou à disposição! Como posso te ajudar agora?', // More natural re-greeting
          };
          break;
        default:
          botResponse.text = 'Peço desculpas, mas não consegui compreender sua solicitação. Para que eu possa te ajudar melhor, você poderia escolher uma das opções abaixo ou tentar reformular sua pergunta?';
          botResponse.options = initialMessages[0].options ? [...initialMessages[0].options] : [];
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

    setTimeout(() => {
      let botResponseText = "Hmm, não tenho certeza se entendi sua pergunta. Para garantir que eu possa te ajudar da melhor forma, que tal escolher uma das opções abaixo? Elas cobrem os pedidos mais comuns de nossos hóspedes.";
      let responseOptions: ChatOption[] = initialMessages[0].options || [];
      
      const keywords = {
        reserva: ['reserva', 'reservar', 'quarto', 'agendar', 'marcar', 'hospedagem'],
        duvida: ['dúvida', 'duvida', 'minha reserva', 'confirmação', 'alterar reserva', 'cancelar reserva'],
        servicos: ['serviço', 'servico', 'wifi', 'café', 'restaurante', 'spa', 'academia', 'estacionamento'],
        suporte: ['problema', 'não funciona', 'quebrado', 'suporte', 'ajuda técnica', 'dificuldade'],
        feedback: ['feedback', 'opinião', 'avaliação', 'comentário', 'sugestão', 'elogio', 'reclamação']
      };
      
      const lowerCaseMessage = userMessage.text.toLowerCase();
      
      // Prioritize keyword actions if matched
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
        text: botResponseText,
        isBot: true,
        timestamp: new Date(),
        options: responseOptions
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
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
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
            {messages.length > 0 && messages[messages.length - 1].isBot && messages[messages.length - 1].options && messages[messages.length - 1].options!.length > 0 && !isLoading && (
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
              style={{ fieldSizing: 'content' }} // For auto-expanding textarea if supported
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
