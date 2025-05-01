import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  name?: string;
  email: string;
  profilePic?: string; // Para armazenar a foto do perfil
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void; // Nova função para atualizar o usuário
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
      const profilePic = localStorage.getItem('userProfilePic');
      
      // Verificar se o usuário realmente existe no sistema
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((u: any) => u.email === email);
      
      if (userExists) {
        setUser({
          email,
          name: name || undefined,
          profilePic: profilePic || undefined // Carregar a foto do perfil
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
    if (name) localStorage.setItem('userName', name);
    
    setUser({ email, name });
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userProfilePic'); // Remover foto de perfil também
    
    setUser(null);
    setIsLoggedIn(false);
  };

  // Função para atualizar os dados do usuário
  const updateUser = (updatedUser: User) => {
    localStorage.setItem('userEmail', updatedUser.email);
    if (updatedUser.name) localStorage.setItem('userName', updatedUser.name);
    if (updatedUser.profilePic) localStorage.setItem('userProfilePic', updatedUser.profilePic);

    setUser(updatedUser); // Atualiza o estado do usuário
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updateUser }}>
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
