
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import FormHeader from "./FormHeader";
import FormFooter from "./FormFooter";
import PasswordInput from "./PasswordInput";
import PasswordRequirements from "./PasswordRequirements";

// Define a strong password regex: at least 8 characters, one letter, one number, one special character
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
    .regex(passwordRegex, { 
      message: "A senha deve conter pelo menos uma letra, um número e um caractere especial" 
    }),
  confirmPassword: z.string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

interface RegisterFormProps {
  onRegisterSuccess?: () => void;
  onLoginClick?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onLoginClick }) => {
  const { toast } = useToast();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Verificar se já existe um usuário com este e-mail
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (users.some((user: any) => user.email === values.email)) {
        throw new Error("Este e-mail já está em uso");
      }
      
      // Adicionar novo usuário
      const newUser = {
        name: values.name,
        email: values.email,
        password: values.password,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Login automático após registro
      login(values.email, values.name);
      
      toast({
        title: "Conta criada!",
        description: "Sua conta foi criada com sucesso e você já está logado.",
      });
      
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-1">
      <FormHeader 
        title="Criar uma conta"
        description="Preencha os dados abaixo para criar sua conta"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="seu@email.com" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <PasswordInput 
                  field={field} 
                  placeholder="Crie uma senha" 
                  disabled={isLoading} 
                />
                <PasswordRequirements />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar senha</FormLabel>
                <PasswordInput 
                  field={field} 
                  placeholder="Confirme sua senha" 
                  disabled={isLoading} 
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full bg-hotel-800 hover:bg-hotel-700 text-white" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
      </Form>
      
      <FormFooter 
        message="Já tem uma conta?"
        linkText="Fazer login"
        onLinkClick={onLoginClick}
      />
    </div>
  );
};

export default RegisterForm;
