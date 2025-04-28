import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Appointment, Service, insertAppointmentSchema } from "@shared/schema";
import PixelBorder from "./PixelBorder";
import { formatDateForInput, generateTimeSlots, formatTimeDisplay } from "@/lib/utils";

interface BookingProps {
  services: Service[];
  isLoading: boolean;
}

export default function Booking({ services, isLoading }: BookingProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<string>(formatDateForInput(new Date()));
  
  // Get all time slots
  const allTimeSlots = generateTimeSlots();
  
  // Fetch booked time slots for the selected date
  const { 
    data: bookedTimeSlots = [],
    isLoading: isLoadingTimeSlots,
    refetch: refetchTimeSlots
  } = useQuery<string[]>({
    queryKey: ['/api/appointments/date', selectedDate],
    queryFn: async () => {
      const res = await fetch(`/api/appointments/date/${selectedDate}`);
      if (!res.ok) throw new Error('Failed to fetch booked slots');
      return res.json();
    },
    enabled: !!selectedDate
  });
  
  // Calculate available time slots
  const availableTimeSlots = allTimeSlots.filter(time => !bookedTimeSlots.includes(time));
  
  // Extended schema with validations
  const formSchema = insertAppointmentSchema.extend({
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      date: selectedDate,
      time: "",
      notes: ""
    }
  });
  
  // Update form date value when selectedDate changes
  useEffect(() => {
    form.setValue('date', selectedDate);
  }, [selectedDate, form]);
  
  // Appointment creation mutation
  const createAppointment = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest('POST', '/api/appointments', data);
      return response.json() as Promise<Appointment>;
    },
    onSuccess: () => {
      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been successfully scheduled.",
        variant: "default",
      });
      
      // Reset form and refetch time slots
      form.reset({
        name: "",
        email: "",
        phone: "",
        service: "",
        date: selectedDate,
        time: "",
        notes: ""
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/appointments/date', selectedDate] });
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    form.setValue('date', newDate);
    // Reset time selection when date changes
    form.setValue('time', '');
  };
  
  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createAppointment.mutate(values);
  };
  
  return (
    <section id="booking" className="py-16 bg-primary text-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-pixel text-2xl md:text-3xl mb-4">BOOK AN APPOINTMENT</h2>
          <p className="max-w-2xl mx-auto">Reserve your spot online and skip the wait. Choose your preferred date, time, and service.</p>
        </div>
        
        <div className="max-w-2xl mx-auto bg-background text-foreground p-6 pixel-border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pixel text-xs">PHONE</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="tel"
                          className="w-full bg-muted border-2 border-primary p-3 focus:outline-none focus:border-secondary transition-colors duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pixel text-xs">SERVICE</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full bg-muted border-2 border-primary p-3 focus:outline-none focus:border-secondary transition-colors duration-200">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoading ? (
                            <SelectItem value="loading" disabled>Loading services...</SelectItem>
                          ) : (
                            services.map((service) => (
                              <SelectItem key={service.id} value={service.name}>
                                {service.name} - ${service.price}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pixel text-xs">DATE</FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="date"
                          min={formatDateForInput(new Date())}
                          onChange={handleDateChange}
                          className="w-full bg-muted border-2 border-primary p-3 focus:outline-none focus:border-secondary transition-colors duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pixel text-xs">TIME</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full bg-muted border-2 border-primary p-3 focus:outline-none focus:border-secondary transition-colors duration-200">
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingTimeSlots ? (
                            <SelectItem value="loading" disabled>Loading available times...</SelectItem>
                          ) : availableTimeSlots.length === 0 ? (
                            <SelectItem value="none" disabled>No available times for this date</SelectItem>
                          ) : (
                            availableTimeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {formatTimeDisplay(time)}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-pixel text-xs">SPECIAL REQUESTS</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field}
                        className="w-full bg-muted border-2 border-primary p-3 h-32 resize-none focus:outline-none focus:border-secondary transition-colors duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="text-center">
                <Button 
                  type="submit" 
                  className="bg-secondary hover:bg-opacity-80 text-background transition-colors duration-200 px-6 py-3 font-pixel text-sm"
                  disabled={createAppointment.isPending}
                >
                  {createAppointment.isPending ? "BOOKING..." : "CONFIRM BOOKING"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
