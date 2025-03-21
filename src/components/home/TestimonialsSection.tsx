
import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface TestimonialProps {
  quote: string;
  author: string;
  location: string;
  rating: number;
  image: string;
}

const testimonials: TestimonialProps[] = [
  {
    quote: "Uma experiência inesquecível! O hotel superou todas as nossas expectativas, desde o atendimento impecável até a qualidade das acomodações. Definitivamente voltaremos.",
    author: "Carlos Oliveira",
    location: "São Paulo, Brasil",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
  },
  {
    quote: "A atenção aos detalhes é impressionante! Desde o momento do check-in até nossa saída, nos sentimos verdadeiramente especiais. O café da manhã é excepcional.",
    author: "Ana Martins",
    location: "Rio de Janeiro, Brasil",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80"
  },
  {
    quote: "As instalações do spa são de outro mundo! Tivemos momentos de puro relaxamento, e a equipe atendeu a todas as nossas necessidades com profissionalismo e simpatia.",
    author: "Paulo Mendes",
    location: "Belo Horizonte, Brasil",
    rating: 4,
    image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
  },
];

const ReviewForm = ({ onClose }: { onClose: () => void }) => {
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!review || !name) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu nome e sua avaliação.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real application, this would send the review to a backend
    toast({
      title: "Avaliação enviada!",
      description: "Obrigado por compartilhar sua experiência conosco.",
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium mb-1">Avaliação</label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star 
                size={24} 
                className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Seu Nome*</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-1">Localização</label>
        <input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Cidade, País"
        />
      </div>
      
      <div>
        <label htmlFor="review" className="block text-sm font-medium mb-1">Sua Avaliação*</label>
        <Textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full"
          rows={5}
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Enviar Avaliação</Button>
      </div>
    </form>
  );
};

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-20 bg-hotel-800 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonalLines" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalLines)" />
        </svg>
      </div>

      <div className="section-container relative z-10">
        <div className="text-center mb-16 animate-fade-up opacity-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O Que Dizem Nossos Hóspedes
          </h2>
          <p className="text-hotel-300 max-w-xl mx-auto mb-8">
            Experiências autênticas compartilhadas por quem vivenciou a hospitalidade do Hotel Vitória.
          </p>
          
          <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Deixe sua Avaliação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Compartilhe sua Experiência</DialogTitle>
                <DialogDescription>
                  Conte-nos como foi sua estadia no Hotel Vitória. Sua opinião é muito importante para nós!
                </DialogDescription>
              </DialogHeader>
              <ReviewForm onClose={() => setIsReviewOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <div 
            className="transition-all duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-hotel-900/30 backdrop-blur-sm p-8 rounded-xl border border-white/10 flex flex-col md:flex-row items-center gap-8 animate-fade-up opacity-0">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-hotel-400/20">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={18} 
                            className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"} 
                          />
                        ))}
                      </div>
                      <blockquote className="text-lg mb-4 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-hotel-300 text-sm">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button 
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full -ml-4 backdrop-blur-sm transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full -mr-4 backdrop-blur-sm transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  index === currentIndex 
                    ? "bg-white w-6" 
                    : "bg-white/30 hover:bg-white/50"
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
