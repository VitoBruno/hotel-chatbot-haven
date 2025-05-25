import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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

// Define the type for expected input
type ExpectedInputType = 'reservation_date' | 'reservation_code_or_name' | 'support_problem_description' | 'feedback_text' | null;

// Define the structure for action handler results
type ActionHandlerResult = Partial<Message> & {
  expectsInputType?: ExpectedInputType;
  // Store data temporarily if needed (e.g., selected date)
  // In a real app, this would be managed more robustly (context, state management library)
  // For simplicity, we'll pass data implicitly for now.
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

// Define action handlers outside the component
// Now returns ActionHandlerResult
const actionHandlers: Record<string, (userInput?: string) => ActionHandlerResult> = {
  'inicio': () => ({
    text: 'Como posso te ajudar hoje?',
    options: initialMessages[0].options,
    expectsInputType: null, // Explicitly clear expectation
  }),
  'reserva': () => ({
    text: 'Você pode fazer sua reserva diretamente pelo nosso site ou se preferir, posso te ajudar agora mesmo!',
    options: [
      { text: 'Quero fazer uma reserva agora.', action: 'fazer_reserva' },
      { text: 'Quero saber mais sobre os quartos disponíveis.', action: 'info_quartos' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'fazer_reserva': () => ({
    text: 'Ótimo! Para qual data você gostaria de reservar? (Por favor, digite a data desejada, ex: DD/MM/AAAA)',
    options: [
      { text: 'Voltar', action: 'reserva' },
    ],
    expectsInputType: 'reservation_date', // Expect date input
  }),
  'info_quartos': () => ({
    text: 'Temos os seguintes tipos de quarto: Solteiro (R$110), Solteiro com Ar (R$150), Casal (R$190), Casal com Ar (R$220). Gostaria de iniciar uma reserva?',
    options: [
      { text: 'Sim, iniciar reserva', action: 'fazer_reserva' },
      { text: 'Não, obrigado', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  // This action is now triggered *after* receiving the date input
  'process_reservation_date': (userInput) => ({
    // Basic validation (in real app, use date-fns or similar)
    text: `Ok, você selecionou a data: ${userInput}. Qual tipo de quarto você prefere?`,
    options: [
      { text: 'Solteiro - R$110', action: 'quarto_selecionado' },
      { text: 'Solteiro com Ar Condicionado - R$150', action: 'quarto_selecionado' },
      { text: 'Casal - R$190', action: 'quarto_selecionado' },
      { text: 'Casal com Ar Condicionado - R$220', action: 'quarto_selecionado' },
      { text: 'Voltar (escolher data)', action: 'fazer_reserva' },
    ],
    expectsInputType: null,
  }),
  'quarto_selecionado': (userInput) => {
    // UserInput here would be the text of the button clicked, e.g., 'Solteiro - R$110'
    // In a real app, you'd parse the room type and price
    return {
        text: `Perfeito! Sua reserva para ${userInput} está quase pronta. Posso confirmar?`,
        options: [
            { text: 'Confirmar a reserva.', action: 'confirmar_reserva' },
            { text: 'Alterar quarto.', action: 'process_reservation_date' }, // Go back to room selection (needs date context)
            { text: 'Alterar data.', action: 'fazer_reserva' },
        ],
        expectsInputType: null,
    };
  },
  'confirmar_reserva': () => ({
    text: 'Sua reserva foi feita com sucesso! Você receberá um e-mail com os detalhes. Precisa de mais alguma coisa?',
    options: [
      { text: 'Não, obrigado.', action: 'encerrar' },
      { text: 'Sim, tenho outra dúvida.', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'duvida_reserva': () => ({
    text: 'Certo! Para agilizar o atendimento, poderia informar seu código de reserva ou o nome completo utilizado na reserva? (Por favor, digite a informação)',
    options: [
      { text: 'Não tenho o código/nome', action: 'sem_codigo' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: 'reservation_code_or_name', // Expect code/name input
  }),
  // Triggered after receiving reservation code/name
  'process_reservation_info': (userInput) => ({
    // Placeholder response - needs backend integration
    text: `Obrigado! Buscando informações para: ${userInput}. Aqui estão os detalhes da sua reserva: Quarto simples para 2 noites. Posso te ajudar com mais alguma coisa?`,
    options: [
      { text: 'Quero modificar minha reserva.', action: 'modificar_reserva' },
      { text: 'Quero cancelar minha reserva.', action: 'cancelar_reserva' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'modificar_reserva': () => ({
    text: 'Para modificar sua reserva, por favor, entre em contato com nossa recepção pelo telefone 35 999822446.',
    options: [
      { text: 'Entendi, obrigado.', action: 'encerrar' },
      { text: 'Tenho outra dúvida.', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'cancelar_reserva': () => ({
    text: 'Para cancelar sua reserva, por favor, entre em contato com nossa recepção pelo telefone 35 999822446.',
    options: [
      { text: 'Entendi, obrigado.', action: 'encerrar' },
      { text: 'Tenho outra dúvida.', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'sem_codigo': () => ({
    text: 'Sem problemas. Neste caso, sugiro entrar em contato com nossa recepção pelo telefone 35 999822446. Eles poderão ajudar com todas as informações sobre sua reserva.',
    options: [
      { text: 'Entendi, obrigado.', action: 'encerrar' },
      { text: 'Tenho outra dúvida.', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'servicos': () => ({
    text: 'Temos diversos serviços para tornar sua estadia mais confortável! Sobre qual serviço deseja saber mais?',
    options: [
      { text: 'Café da Manhã', action: 'cafe_manha' },
      { text: 'Academia e Spa', action: 'academia_spa' },
      { text: 'Estacionamento', action: 'estacionamento' },
      { text: 'Outras informações', action: 'outras_infos' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'cafe_manha': () => ({
    text: 'Nosso café da manhã é servido das 6h às 10h no restaurante principal. Oferecemos uma variedade de opções, incluindo frutas frescas, pães, queijos, frios, bolos, sucos naturais e café.',
    options: [
      { text: 'Ver outros serviços', action: 'servicos' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'academia_spa': () => ({
    text: 'Nossa academia está disponível 24 horas para os hóspedes. O spa oferece massagens e tratamentos de beleza, mediante agendamento prévio na recepção.',
    options: [
      { text: 'Ver outros serviços', action: 'servicos' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'estacionamento': () => ({
    text: 'Oferecemos estacionamento gratuito para todos os hóspedes, com segurança 24 horas.',
    options: [
      { text: 'Ver outros serviços', action: 'servicos' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
   'outras_infos': () => ({
    text: 'Para outras informações sobre serviços, por favor, entre em contato com a recepção.',
    options: [
      { text: 'Ver outros serviços', action: 'servicos' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'suporte': () => ({
    text: 'Entendi! Pode me informar qual problema está enfrentando?',
    options: [
      { text: 'O Wi-Fi não está funcionando.', action: 'wifi_problema' },
      { text: 'Problema com TV a cabo.', action: 'tv_problema' },
      { text: 'Ar-condicionado não liga.', action: 'ar_problema' },
      { text: 'Outro problema.', action: 'outro_problema' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'wifi_problema': () => ({
    text: 'Vamos resolver isso! Tente desconectar e conectar novamente à rede "Hotel_Vitoria". A senha é o número do seu quarto seguido de "guest". Caso o problema persista, vou encaminhar sua solicitação para nossa equipe de suporte.',
    options: [
      { text: 'Funcionou, obrigado!', action: 'encerrar' },
      { text: 'Ainda não funciona', action: 'suporte_humano' },
      { text: 'Ver outros problemas', action: 'suporte' },
    ],
    expectsInputType: null,
  }),
  'tv_problema': () => ({
    text: 'Por favor, verifique se a TV e o receptor estão ligados na tomada e se os cabos estão bem conectados. Se o problema continuar, entre em contato com a recepção para enviarmos alguém.',
    options: [
      { text: 'Entendi, obrigado.', action: 'encerrar' },
      { text: 'Ver outros problemas', action: 'suporte' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'ar_problema': () => ({
    text: 'Verifique se o controle remoto está com pilhas e se o disjuntor do quarto está ligado. Se ainda assim não funcionar, por favor, contate a recepção.',
    options: [
      { text: 'Entendi, obrigado.', action: 'encerrar' },
      { text: 'Ver outros problemas', action: 'suporte' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'outro_problema': () => ({
    text: 'Por favor, descreva o problema que está enfrentando para que eu possa tentar ajudar ou direcionar para a equipe correta.',
    options: [
      { text: 'Voltar (escolher problema)', action: 'suporte' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: 'support_problem_description', // Expect problem description
  }),
  // Triggered after receiving problem description
  'process_support_description': (userInput) => ({
    text: `Entendido. Registrei o seguinte problema: "${userInput}". Encaminhei sua solicitação para nossa equipe responsável. Eles entrarão em contato em breve, se necessário. Precisa de mais alguma coisa?`,
    options: [
      { text: 'Não, obrigado.', action: 'encerrar' },
      { text: 'Sim, tenho outra dúvida.', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'suporte_humano': () => ({
    text: 'Entendido. Encaminhei sua solicitação para nossa equipe de suporte técnico. Eles entrarão em contato em breve. Precisa de mais alguma coisa?',
    options: [
      { text: 'Não, obrigado.', action: 'encerrar' },
      { text: 'Sim, tenho outra dúvida.', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'feedback': () => ({
    text: 'Adoraríamos ouvir sua opinião! Como você avalia sua experiência no nosso hotel?',
    options: [
      { text: 'Excelente!', action: 'feedback_excelente' },
      { text: 'Boa.', action: 'feedback_bom' },
      { text: 'Ruim.', action: 'feedback_ruim' },
      { text: 'Voltar ao início', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
  'feedback_excelente': () => ({
    text: 'Que maravilha! Ficamos muito felizes em saber que sua experiência foi excelente. Obrigado pelo feedback positivo! Gostaria de adicionar algum comentário?',
    options: [
      // Button removed, text input expected now
      // { text: 'Enviar comentário', action: 'enviar_feedback_texto' },
      { text: 'Não, obrigado', action: 'encerrar' },
      { text: 'Tenho outra dúvida', action: 'inicio' },
    ],
    expectsInputType: 'feedback_text',
  }),
  'feedback_bom': () => ({
    text: 'Obrigado pelo feedback! Gostaríamos de saber como podemos melhorar. Poderia nos contar um pouco mais?',
    options: [
      { text: 'Não, obrigado', action: 'encerrar' },
      { text: 'Tenho outra dúvida', action: 'inicio' },
    ],
    expectsInputType: 'feedback_text',
  }),
  'feedback_ruim': () => ({
    text: 'Lamentamos que sua experiência não tenha sido boa. Seu feedback é muito importante para nós. Por favor, conte-nos o que aconteceu para que possamos melhorar.',
    options: [
      { text: 'Não, obrigado', action: 'encerrar' },
      { text: 'Tenho outra dúvida', action: 'inicio' },
    ],
    expectsInputType: 'feedback_text',
  }),
  // Triggered after receiving feedback text
  'process_feedback_text': (userInput) => ({
    text: `Obrigado pelo seu comentário: "${userInput.substring(0, 50)}...". Ele é muito importante para nós. Esperamos ter a chance de recebê-lo novamente e oferecer uma experiência melhor.`,
    options: [
      { text: 'Tenho outra dúvida', action: 'inicio' },
      { text: 'Encerrar conversa', action: 'encerrar' },
    ],
    expectsInputType: null,
  }),
  'encerrar': () => ({
    text: 'Obrigado por falar comigo! Se precisar de mais alguma coisa, é só chamar. Tenha um ótimo dia! 😊',
    options: [
      { text: 'Iniciar nova conversa', action: 'inicio' },
    ],
    expectsInputType: null,
  }),
};

// Mapping from expected input type to the action that processes it
const inputProcessingActions: Partial<Record<ExpectedInputType, string>> = {
  'reservation_date': 'process_reservation_date',
  'reservation_code_or_name': 'process_reservation_info',
  'support_problem_description': 'process_support_description',
  'feedback_text': 'process_feedback_text',
};

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // State to track the type of input the bot is currently waiting for
  const [expectedInputType, setExpectedInputType] = useState<ExpectedInputType>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  // Function to trigger bot response based on action and optional user input
  const triggerBotResponse = (action: string, userInput?: string) => {
    setIsLoading(true);
    setExpectedInputType(null); // Assume input expectation is cleared unless set again

    setTimeout(() => {
      const handler = actionHandlers[action];
      let botResponseData: ActionHandlerResult;

      if (handler) {
        botResponseData = handler(userInput);
      } else {
        // Fallback for unknown action
        botResponseData = {
          text: 'Desculpe, ocorreu um erro interno. Por favor, tente começar de novo.',
          options: initialMessages[0].options,
          expectsInputType: null,
        };
      }

      addMessage({
        text: botResponseData.text || '...', // Default text if missing
        isBot: true,
        options: botResponseData.options,
      });

      // Set state if the bot expects further input
      if (botResponseData.expectsInputType) {
        setExpectedInputType(botResponseData.expectsInputType);
      }

      setIsLoading(false);
    }, 800); // Simulate network delay slightly shorter
  };

  const handleOptionClick = (action: string) => {
    // Find the text of the clicked option to display as user message
    const lastBotMessage = messages.slice().reverse().find(m => m.isBot && m.options);
    const optionText = lastBotMessage?.options?.find(opt => opt.action === action)?.text || action;

    addMessage({ text: optionText, isBot: false });
    // Trigger the bot response associated with the clicked action
    triggerBotResponse(action, optionText); // Pass optionText as potential userInput for context
  };

  const sendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    addMessage({ text: trimmedInput, isBot: false });
    const currentExpectedInput = expectedInputType; // Capture before clearing
    setInputValue('');
    setExpectedInputType(null); // Clear expectation immediately

    // Check if we were expecting a specific type of input
    if (currentExpectedInput) {
      const processingAction = inputProcessingActions[currentExpectedInput];
      if (processingAction) {
        // Trigger the action that processes this specific input
        triggerBotResponse(processingAction, trimmedInput);
      } else {
        // Fallback if processing action is missing (should not happen)
        triggerBotResponse('inicio');
      }
      return; // Stop further processing
    }

    // --- If no specific input was expected, use Basic Keyword Matching ---
    setIsLoading(true);
    setTimeout(() => {
      const keywords = {
        reserva: ['reserva', 'reservar', 'quarto', 'agendar', 'marcar', 'preço', 'disponibilidade', 'data'],
        duvida: ['dúvida', 'duvida', 'minha reserva', 'confirmação', 'código', 'nome'],
        servicos: ['serviço', 'servico', 'wifi', 'café', 'restaurante', 'spa', 'academia', 'estacionamento'],
        suporte: ['problema', 'não funciona', 'quebrado', 'suporte', 'ajuda', 'técnica', 'tv', 'ar', 'internet', 'wi-fi'],
        feedback: ['feedback', 'opinião', 'avaliação', 'comentário', 'sugestão', 'reclamar'],
      };
      const lowerCaseMessage = trimmedInput.toLowerCase();
      let matchedAction: string | null = null;

      // Simple keyword check - first match wins
      if (keywords.reserva.some(word => lowerCaseMessage.includes(word))) matchedAction = 'reserva';
      else if (keywords.duvida.some(word => lowerCaseMessage.includes(word))) matchedAction = 'duvida_reserva';
      else if (keywords.servicos.some(word => lowerCaseMessage.includes(word))) matchedAction = 'servicos';
      else if (keywords.suporte.some(word => lowerCaseMessage.includes(word))) matchedAction = 'suporte';
      else if (keywords.feedback.some(word => lowerCaseMessage.includes(word))) matchedAction = 'feedback';

      if (matchedAction) {
        // Trigger the matched action
        triggerBotResponse(matchedAction);
      } else {
        // Fallback for free text not matching keywords and not expected
        addMessage({
          text: 'Desculpe, não entendi bem sua pergunta. Você pode tentar reformular ou escolher uma das opções abaixo:',
          isBot: true,
          options: initialMessages[0].options,
        });
        setIsLoading(false); // Ensure loading stops on fallback
      }
    }, 800);
    // --- End Keyword Matching ---
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    // Auto-resize textarea
    const textarea = e.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
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
                  <p className="text-[10px] mt-1 opacity-60 text-right">
                    {new Intl.DateTimeFormat('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Options buttons - Hide if expecting text input? Or keep for navigation? Keep for now. */}
            {messages.length > 0 && messages[messages.length - 1].options && messages[messages.length - 1].options!.length > 0 && !isLoading && (
              <div className="flex flex-col space-y-2 mt-4 animate-fade-up">
                {messages[messages.length - 1].options!.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option.action)}
                    disabled={isLoading}
                    className="text-sm bg-hotel-50 hover:bg-hotel-100 dark:bg-hotel-800 dark:hover:bg-hotel-700 text-hotel-800 dark:text-hotel-100 px-4 py-2 rounded-lg text-left transition-colors border border-hotel-200 dark:border-hotel-700 disabled:opacity-50"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-end mb-4 justify-start animate-fade-up">
                <div className="w-8 h-8 rounded-full bg-hotel-800 flex items-center justify-center text-white mr-2 flex-shrink-0">
                  <MessageCircle size={14} />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-hotel-50 dark:bg-hotel-800 text-hotel-900 dark:text-hotel-100 rounded-bl-none">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-hotel-400 rounded-full animate-bounce delay-0"></span>
                    <span className="w-2 h-2 bg-hotel-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-hotel-400 rounded-full animate-bounce delay-300"></span>
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
              placeholder={expectedInputType ? `Por favor, digite ${expectedInputType.replace(/_/g, ' ')}...` : "Digite sua mensagem..."} // Dynamic placeholder
              className="flex-1 p-3 rounded-l-lg border-y border-l border-hotel-200 dark:border-hotel-700 focus:outline-none focus:ring-1 focus:ring-hotel-500 bg-white dark:bg-hotel-900 dark:text-hotel-100 resize-none overflow-hidden min-h-[44px] max-h-[120px] text-sm"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="rounded-l-none rounded-r-lg bg-hotel-800 hover:bg-hotel-700 h-[44px] px-4 self-end" // Match height
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

