
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  name?: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Verificar se o usuário está logado ao carregar a página
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (loggedIn) {
      const email = localStorage.getItem('userEmail') || '';
      const name = localStorage.getItem('userName');
      
      // Verificar se o usuário realmente existe no sistema
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((u: any) => u.email === email);
      
      if (userExists) {
        setUser({
          email,
          name: name || undefined
        });
        setIsLoggedIn(true);
      } else {
        // Se o usuário não existir mais, faça logout
        logout();
      }
    }
  }, []);

  const login = (email: string, name?: string) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    
    if (name) {
      localStorage.setItem('userName', name);
    }
    
    setUser({ email, name });
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};
