
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Users, CreditCard, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ReservationDialogProps {
  trigger?: React.ReactNode;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({ trigger }) => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [roomType, setRoomType] = useState('');
  const [adults, setAdults] = useState('1');
  const [children, setChildren] = useState('0');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCheckOutCalendarOpen, setIsCheckOutCalendarOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!checkIn || !checkOut || !roomType || !name || !email || !phone) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Submit the form - in a real app, this would be an API call
    toast({
      title: "Reserva enviada!",
      description: "Entraremos em contato em breve para confirmar sua reserva.",
    });
  };

  const defaultTrigger = (
    <Button className="bg-hotel-800 hover:bg-hotel-700 text-white">
      Reservar Agora
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Faça sua reserva</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para reservar seu quarto no Hotel Vitória.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Check-in date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Check-in</label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkIn && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? (
                      format(checkIn, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={(date) => {
                      setCheckIn(date);
                      setIsCalendarOpen(false);
                    }}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Check-out date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Check-out</label>
              <Popover open={isCheckOutCalendarOpen} onOpenChange={setIsCheckOutCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOut && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? (
                      format(checkOut, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={(date) => {
                      setCheckOut(date);
                      setIsCheckOutCalendarOpen(false);
                    }}
                    initialFocus
                    disabled={(date) => !checkIn || date <= checkIn}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Room type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Quarto</label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de quarto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Quarto Standard</SelectItem>
                <SelectItem value="deluxe">Quarto Deluxe</SelectItem>
                <SelectItem value="suite-executiva">Suíte Executiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Guests */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Adultos</label>
              <Select value={adults} onValueChange={setAdults}>
                <SelectTrigger>
                  <SelectValue placeholder="Adultos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Adulto</SelectItem>
                  <SelectItem value="2">2 Adultos</SelectItem>
                  <SelectItem value="3">3 Adultos</SelectItem>
                  <SelectItem value="4">4 Adultos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Crianças</label>
              <Select value={children} onValueChange={setChildren}>
                <SelectTrigger>
                  <SelectValue placeholder="Crianças" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 Crianças</SelectItem>
                  <SelectItem value="1">1 Criança</SelectItem>
                  <SelectItem value="2">2 Crianças</SelectItem>
                  <SelectItem value="3">3 Crianças</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome completo</label>
            <div className="relative">
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Seu nome completo" 
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="seu@email.com" 
                  className="pl-10"
                  required
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Telefone</label>
              <div className="relative">
                <Input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="(00) 00000-0000" 
                  className="pl-10"
                  required
                />
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-2">
            <Button type="submit" className="w-full bg-hotel-800 hover:bg-hotel-700 text-white">
              Enviar Solicitação de Reserva
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
