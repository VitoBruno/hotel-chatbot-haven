import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const UserAccount: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  
  // Carregar dados do usuário do localStorage quando o componente montar
  useEffect(() => {
    if (user?.email) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find((u: any) => u.email === user.email);
      
      if (currentUser) {
        setName(currentUser.name || '');
        setEmail(currentUser.email || '');
        // Carregar a imagem de perfil se existir
        if (currentUser.profilePic) {
          setProfilePic(currentUser.profilePic);
        }
      }
    }
  }, [user?.email]);

  const handleSave = () => {
    try {
      // Obter a lista de usuários
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Encontrar o índice do usuário atual
      const userIndex = users.findIndex((u: any) => u.email === user?.email);
      
      if (userIndex !== -1) {
        // Atualizar o usuário na lista
        users[userIndex] = {
          ...users[userIndex],
          name,
          email,
          profilePic,
          updatedAt: new Date().toISOString()
        };
        
        // Salvar a lista atualizada
        localStorage.setItem('users', JSON.stringify(users));
        
        // Atualizar o estado do usuário no contexto de autenticação
        updateUser({ name, email, profilePic });
        
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram atualizadas com sucesso.",
        });
        
        setEditing(false);
      } else {
        throw new Error("Usuário não encontrado");
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar o tamanho do arquivo (limitar a 1MB para evitar problemas com localStorage)
      if (file.size > 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 1MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePic(result);
        
        // Opcional: salvar imediatamente a imagem no localStorage
        try {
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userIndex = users.findIndex((u: any) => u.email === user?.email);
          
          if (userIndex !== -1) {
            users[userIndex] = {
              ...users[userIndex],
              profilePic: result,
              updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem('users', JSON.stringify(users));
            
            // Atualizar também no contexto de autenticação
            updateUser({ ...user, profilePic: result });
            
            toast({
              title: "Foto atualizada",
              description: "Sua foto de perfil foi atualizada com sucesso.",
            });
          }
        } catch (error) {
          console.error("Erro ao salvar imagem:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center space-x-4">
            <img
              src={profilePic || '/default-profile.png'}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
              onError={(e) => {
                // Fallback para imagem padrão se houver erro ao carregar
                (e.target as HTMLImageElement).src = '/default-profile.png';
              }}
            />
            <div>
              <label className="text-sm font-medium">Trocar foto</label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
          
          {editing ? (
            <>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
              <div className="flex space-x-2">
                <Button onClick={handleSave}>Salvar</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-semibold">{name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold">{email}</p>
              </div>
              <Button onClick={() => setEditing(true)}>Editar</Button>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="text-lg font-semibold">Plano de Assinatura</h2>
          <p>Plano atual: <strong>Básico</strong></p>
          <Button variant="outline">Alterar plano</Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 space-y-2">
          <h2 className="text-lg font-semibold">Histórico de Reservas</h2>
          <ul className="list-disc pl-4 text-sm text-gray-600">
            <li>Hotel Mar Azul – 12/01/2025</li>
            <li>Pousada Sol Nascente – 23/03/2025</li>
            {/* Lista dinâmica pode vir do backend */}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAccount;