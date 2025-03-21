
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReservationDialog from "@/components/reservation/ReservationDialog";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        scrolled 
          ? "py-3 bg-white/80 backdrop-blur-lg shadow-sm dark:bg-hotel-950/80" 
          : "py-5 bg-transparent"
      )}
    >
      <div className="section-container">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-semibold tracking-tight transition-transform hover:scale-[1.02] relative"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-hotel-800 to-hotel-600 dark:from-hotel-200 dark:to-hotel-400">
              Hotel Vitória
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-hotel-400/40 to-transparent"></span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            
            <ReservationDialog />
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-hotel-600 hover:text-hotel-800 dark:text-hotel-300 dark:hover:text-hotel-100"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-50 bg-white/90 backdrop-blur-md dark:bg-hotel-950/90 transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 p-4 animate-stagger">
          <div className="flex flex-col items-center space-y-4 animate-fade-up opacity-0 pt-6">
            <button 
              onClick={toggleTheme} 
              className="p-3 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            
            <ReservationDialog 
              trigger={
                <Button 
                  className="bg-hotel-800 hover:bg-hotel-700 text-white w-full"
                  onClick={() => setIsOpen(false)}
                >
                  Reservar Agora
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
