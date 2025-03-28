
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
import { Eye, EyeOff } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      // Simulando um registro bem-sucedido após 1 segundo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar no localStorage que o usuário está registrado e logado
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', values.name);
      localStorage.setItem('userEmail', values.email);
      
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
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-1">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-semibold text-hotel-800 dark:text-hotel-200">
          Criar uma conta
        </h2>
        <p className="text-sm text-muted-foreground">
          Preencha os dados abaixo para criar sua conta
        </p>
      </div>

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
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Crie uma senha" 
                      {...field} 
                      disabled={isLoading}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormControl>
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
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirme sua senha" 
                      {...field} 
                      disabled={isLoading}
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full bg-hotel-800 hover:bg-hotel-700 text-white" disabled={isLoading}>
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
      </Form>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <button
            onClick={onLoginClick}
            className="text-hotel-800 dark:text-hotel-200 hover:underline font-medium"
            type="button"
          >
            Fazer login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
