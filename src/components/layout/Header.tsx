import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReservationDialog from "@/components/reservation/ReservationDialog";
import AuthDialog from "@/components/auth/AuthDialog";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Carregar a foto de perfil do localStorage
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find((u: any) => u.email === user.email);
      
      if (currentUser && currentUser.profilePic) {
        setProfilePic(currentUser.profilePic);
      } else {
        setProfilePic(null);
      }
    } else {
      setProfilePic(null);
    }
  }, [isLoggedIn, user?.email]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    logout();
  };

  // Componente para Avatar do usuário (foto ou ícone)
  const UserAvatar = () => {
    if (profilePic) {
      return (
        <img 
          src={profilePic} 
          alt="Perfil" 
          className="w-7 h-7 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            // Fallback para o ícone padrão se a imagem falhar
            setProfilePic(null);
          }}
        />
      );
    }
    
    return <UserCircle size={18} />;
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
              Hotel Vitória Palace
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
            
            {isLoggedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <UserAvatar />
                      <span className="hidden sm:inline-block">
                        {user?.name || user?.email.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Minhas Reservas</DropdownMenuItem>
                    <Link to="/myAccount">
                      <DropdownMenuItem>Minha Conta</DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ReservationDialog />
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAuthDialogOpen(true)}
                  className="text-hotel-800 dark:text-hotel-200"
                >
                  Entrar
                </Button>
                <ReservationDialog 
                  onBeforeReserve={() => {
                    if (!isLoggedIn) {
                      setIsAuthDialogOpen(true);
                      return false;
                    }
                    return true;
                  }}
                />
              </>
            )}
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
            
            {isLoggedIn ? (
              <>
                <div className="flex flex-col items-center gap-2 text-center mb-2">
                  {profilePic ? (
                    <img 
                      src={profilePic} 
                      alt="Perfil" 
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      onError={() => setProfilePic(null)}
                    />
                  ) : (
                    <UserCircle size={40} className="text-hotel-800 dark:text-hotel-200" />
                  )}
                  <p className="text-hotel-800 dark:text-hotel-200">
                    {user?.name || user?.email.split('@')[0]}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full"
                >
                  <LogOut size={16} />
                  <span>Sair</span>
                </Button>
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
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAuthDialogOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full"
                >
                  Entrar / Criar Conta
                </Button>
                <ReservationDialog 
                  trigger={
                    <Button 
                      className="bg-hotel-800 hover:bg-hotel-700 text-white w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Reservar Agora
                    </Button>
                  }
                  onBeforeReserve={() => {
                    if (!isLoggedIn) {
                      setIsAuthDialogOpen(true);
                      setIsOpen(false);
                      return false;
                    }
                    return true;
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setIsAuthDialogOpen} 
      />
    </header>
  );
};

export default Header;