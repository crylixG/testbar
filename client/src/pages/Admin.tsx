import { useQuery, useMutation } from "@tanstack/react-query";
import { formatDateForInput, formatTimeDisplay } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, CheckSquare, Home, Mail, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import PixelBorder from "@/components/PixelBorder";
import AdminLogin from "@/components/AdminLogin";
import type { Appointment, ContactMessage } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Admin() {
  // Set up all hooks at the top level
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'contact'>('upcoming');
  const today = new Date().toISOString().split('T')[0];
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  // Confirmation dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState<'appointment' | 'message'>('appointment');
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  
  // Handle opening the delete confirmation dialog
  const openDeleteDialog = (type: 'appointment' | 'message', id: number) => {
    setDeleteItemType(type);
    setDeleteItemId(id);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle confirming deletion
  const handleConfirmDelete = () => {
    if (deleteItemId === null) return;
    
    if (deleteItemType === 'appointment') {
      deleteAppointmentMutation.mutate(deleteItemId);
    } else {
      deleteContactMessageMutation.mutate(deleteItemId);
    }
    
    setIsDeleteDialogOpen(false);
    setDeleteItemId(null);
  };
  
  // Data fetching hook - this will run regardless of authentication state
  // but will only be used when authenticated
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/admin/appointments'],
    refetchInterval: 10000, // Refetch every 10 seconds to keep the admin view up to date
    enabled: isAuthenticated && (activeTab === 'upcoming' || activeTab === 'past'), // Only run the query when authenticated and needed
  });
  
  // Query for contact messages
  const { data: contactMessages = [], isLoading: contactMessagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/contact-messages'],
    refetchInterval: 10000, // Refetch every 10 seconds
    enabled: isAuthenticated && activeTab === 'contact', // Only run when on contact tab
  });
  
  // Delete appointment mutation
  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/appointments/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Appointment deleted",
        description: "The appointment has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/appointments'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete appointment. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to delete appointment:", error);
    }
  });
  
  // Mark appointment as completed mutation
  const markCompletedMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('PATCH', `/api/admin/appointments/${id}/complete`);
    },
    onSuccess: () => {
      toast({
        title: "Appointment updated",
        description: "The appointment has been marked as completed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/appointments'] });
      
      // Automatically switch to past appointments tab when marking as completed
      setActiveTab('past');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update appointment. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update appointment:", error);
    }
  });
  
  // Delete contact message mutation
  const deleteContactMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/contact-messages/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Message deleted",
        description: "The contact message has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contact-messages'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete contact message. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to delete contact message:", error);
    }
  });
  
  // Check if the user is already authenticated (from localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('barber_admin_auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login
  const handleLogin = (status: boolean) => {
    setIsAuthenticated(status);
    if (status) {
      localStorage.setItem('barber_admin_auth', 'authenticated');
    }
  };

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }
  
  // Filter appointments based on the active tab
  const filteredAppointments = appointments.filter((appointment: Appointment) => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const currentDate = new Date();
    
    if (activeTab === 'upcoming') {
      // Show appointments that are not completed and are in the future
      return !appointment.completed && appointmentDate >= currentDate;
    } else {
      // Show appointments that are either completed or in the past
      return appointment.completed || appointmentDate < currentDate;
    }
  }).sort((a: Appointment, b: Appointment) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    
    if (activeTab === 'upcoming') {
      return dateA.getTime() - dateB.getTime(); // Ascending for upcoming
    } else {
      return dateB.getTime() - dateA.getTime(); // Descending for past
    }
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PixelBorder withCorners>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-primary">ADMIN DASHBOARD</h1>
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.removeItem('barber_admin_auth');
                setIsAuthenticated(false);
                toast({
                  title: "Logged out",
                  description: "You have been logged out successfully."
                });
              }}
            >
              Logout
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Button 
              variant={activeTab === 'upcoming' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming Appointments
            </Button>
            <Button 
              variant={activeTab === 'past' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('past')}
            >
              Past Appointments
            </Button>
            <Button 
              variant={activeTab === 'contact' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('contact')}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Contact Messages
            </Button>
          </div>
          
          <div className="flex justify-center mb-6">
            <Button
              variant="secondary"
              className="flex items-center gap-2"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4" />
              Go Back to Main Page
            </Button>
          </div>
          
          {activeTab === 'contact' ? (
            /* Contact Messages Tab */
            contactMessagesLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-16" />
                ))}
              </div>
            ) : contactMessages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl">No contact messages found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{message.name}</TableCell>
                        <TableCell>{message.email}</TableCell>
                        <TableCell className="max-w-[300px]">
                          <div className="line-clamp-3">{message.message}</div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog('message', message.id)}
                            disabled={deleteContactMessageMutation.isPending}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="sr-only md:not-sr-only md:inline-block">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : appointmentsLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-full h-16" />
              ))}
            </div>
          ) : filteredAppointments?.length === 0 && (activeTab === 'upcoming' || activeTab === 'past') ? (
            <div className="text-center py-12">
              <p className="text-xl">No {activeTab} appointments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment: Appointment) => {
                    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
                    const isPast = appointmentDate < new Date();
                    
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{formatDateForInput(new Date(appointment.date))}</TableCell>
                        <TableCell>{formatTimeDisplay(appointment.time)}</TableCell>
                        <TableCell>{appointment.name}</TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell className="max-w-[200px]">
                          <div>{appointment.email}</div>
                          <div>{appointment.phone}</div>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {appointment.notes || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={appointment.completed ? "outline" : isPast ? "secondary" : "default"}>
                            {appointment.completed ? 'Completed' : isPast ? 'Past' : 'Scheduled'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {!appointment.completed && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markCompletedMutation.mutate(appointment.id)}
                                disabled={markCompletedMutation.isPending}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <CheckSquare className="h-4 w-4 mr-1" />
                                <span className="sr-only md:not-sr-only md:inline-block">Complete</span>
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog('appointment', appointment.id)}
                              disabled={deleteAppointmentMutation.isPending}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span className="sr-only md:not-sr-only md:inline-block">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </PixelBorder>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {deleteItemType}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}