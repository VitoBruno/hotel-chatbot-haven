import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

const UserAccount: React.FC = () => {
  const { user, updateUser } = useAuth(); // Supondo que você tenha esse hook
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const handleSave = () => {
    updateUser({ name, email, profilePic });
    setEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
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
              <Button onClick={handleSave}>Salvar</Button>
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
