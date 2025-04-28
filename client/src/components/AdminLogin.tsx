import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PixelBorder from "./PixelBorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface AdminLoginProps {
  onLogin: (isAuthenticated: boolean) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: LoginFormValues) => {
    setIsLoading(true);
    
    // Hardcoded credentials check
    if (values.username === "deep" && values.password === "deep8670") {
      // Successful login
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard.",
        });
        onLogin(true);
      }, 500);
    } else {
      // Failed login
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Authentication failed",
          description: "Invalid username or password.",
          variant: "destructive",
        });
        form.reset();
      }, 500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <PixelBorder className="max-w-md w-full p-1">
        <div className="bg-background p-6 md:p-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-primary">ADMIN LOGIN</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Login"}
              </Button>
            </form>
          </Form>
        </div>
      </PixelBorder>
    </div>
  );
}