
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Bed, Users, Tv, Wifi, Bath, Wind } from 'lucide-react';

interface RoomsDisplayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoomsDisplayDialog: React.FC<RoomsDisplayDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const singleRooms = [
    {
      image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      title: "Solteiro - 2 Camas",
      description: "Quarto aconchegante com duas camas de solteiro, ideal para amigos ou familiares.",
      price: 170,
      capacity: 2,
      features: ["Wi-Fi", "TV", "Frigobar", "Ar-condicionado"]
    },
    {
      image: "https://images.unsplash.com/photo-1629371997433-d11ee6b12f64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      title: "Solteiro - 3 Camas",
      description: "Espaçoso quarto compartilhado com três camas de solteiro, perfeito para grupos.",
      price: 230,
      capacity: 3,
      features: ["Wi-Fi", "TV", "Frigobar", "Ar-condicionado", "Banheiro amplo"]
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-hotel-800 dark:text-hotel-200">
            Quartos de Solteiro com Múltiplas Camas
          </DialogTitle>
          <DialogDescription className="text-hotel-600 dark:text-hotel-400">
            Opções perfeitas para grupos de amigos ou familiares que desejam compartilhar o mesmo ambiente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 mt-4">
          {singleRooms.map((room, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-6 bg-white dark:bg-hotel-900 p-4 rounded-xl border border-hotel-100 dark:border-hotel-800">
              <div className="md:w-1/3 h-60 rounded-lg overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="md:w-2/3 space-y-4">
                <div>
                  <div className="flex items-center text-hotel-600 dark:text-hotel-400 mb-2">
                    <Users size={16} className="mr-1" />
                    <span className="text-sm">Até {room.capacity} pessoas</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-hotel-800 dark:text-hotel-200">{room.title}</h3>
                  <p className="text-hotel-600 dark:text-hotel-400">{room.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.features.map((feature, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center bg-hotel-50 dark:bg-hotel-800 text-hotel-700 dark:text-hotel-300 text-xs px-2 py-1 rounded-md"
                    >
                      {feature === 'TV' && <Tv size={12} className="mr-1" />}
                      {feature === 'Wi-Fi' && <Wifi size={12} className="mr-1" />}
                      {feature === 'Banheira' && <Bath size={12} className="mr-1" />}
                      {feature === 'Ar-condicionado' && <Wind size={12} className="mr-1" />}
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xl font-semibold text-hotel-800 dark:text-hotel-200">
                    R$ {room.price}/noite
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomsDisplayDialog;
