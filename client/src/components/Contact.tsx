import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import PixelBorder from "./PixelBorder";
import PixelImage from "./PixelImage";
import { insertContactMessageSchema, ContactMessage } from "@shared/schema";

export default function Contact() {
  const { toast } = useToast();
  
  // Extended schema with validations
  const formSchema = insertContactMessageSchema.extend({
    email: z.string().email("Please enter a valid email address"),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });
  
  // Contact message mutation
  const createContactMessage = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json() as Promise<ContactMessage>;
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thanks for reaching out. We'll get back to you soon.",
        variant: "default",
      });
      
      // Reset form
      form.reset({
        name: "",
        email: "",
        message: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Message Failed",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createContactMessage.mutate(values);
  };
  
  return (
    <section id="contact" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-pixel text-2xl mb-6 text-primary">FIND US</h2>
            
            <PixelBorder className="mb-6 overflow-hidden">
              <PixelImage 
                src="https://images.unsplash.com/photo-1516175663209-ac2459a5652f?ixlib=rb-4.0.3"
                alt="8-Bit Barbers location"
                className="w-full h-64 object-cover"
              />
            </PixelBorder>
            
            <div className="mb-6">
              <div className="font-pixel text-sm text-secondary mb-2">ADDRESS</div>
              <p>123 Pixel Street, Downtown<br/>New York, NY 10001</p>
            </div>
            
            <div className="mb-6">
              <div className="font-pixel text-sm text-secondary mb-2">CONTACT</div>
              <p>Phone: (555) 123-4567<br/>Email: info@8bitbarbers.com</p>
            </div>
            
            <div className="mb-6">
              <div className="font-pixel text-sm text-secondary mb-2">FOLLOW US</div>
              <div className="flex space-x-4">
                <a href="#" className="text-primary hover:text-secondary transition-colors duration-200 text-2xl">
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-primary hover:text-secondary transition-colors duration-200 text-2xl">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-primary hover:text-secondary transition-colors duration-200 text-2xl">
                  <Twitter size={24} />
                </a>
                <a href="#" className="text-primary hover:text-secondary transition-colors duration-200 text-2xl">
                  <SiTiktok size={24} />
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="font-pixel text-2xl mb-6 text-primary">MESSAGE US</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pixel text-xs">YOUR NAME</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="w-full bg-muted border-2 border-primary p-3 focus:outline-none focus:border-secondary transition-colors duration-200"
                        />
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
                      <FormLabel className="font-pixel text-xs">EMAIL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="email"
                          className="w-full bg-muted border-2 border-primary p-3 focus:outline-none focus:border-secondary transition-colors duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pixel text-xs">MESSAGE</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field}
                          className="w-full bg-muted border-2 border-primary p-3 h-40 resize-none focus:outline-none focus:border-secondary transition-colors duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div>
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-opacity-80 transition-colors duration-200 px-6 py-3 font-pixel text-sm"
                    disabled={createContactMessage.isPending}
                  >
                    {createContactMessage.isPending ? "SENDING..." : "SEND MESSAGE"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
