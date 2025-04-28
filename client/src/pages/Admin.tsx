import { useQuery } from "@tanstack/react-query";
import { formatDateForInput, formatTimeDisplay } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import PixelBorder from "@/components/PixelBorder";
import type { Appointment } from "@shared/schema";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const today = new Date().toISOString().split('T')[0];
  
  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ['/api/admin/appointments'],
    refetchInterval: 10000, // Refetch every 10 seconds to keep the admin view up to date
  });
  
  // Filter appointments based on the active tab
  const filteredAppointments = appointments.filter((appointment: Appointment) => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const currentDate = new Date();
    
    if (activeTab === 'upcoming') {
      return appointmentDate >= currentDate;
    } else {
      return appointmentDate < currentDate;
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
          <h1 className="text-3xl font-bold mb-6 text-center text-primary">ADMIN DASHBOARD</h1>
          
          <div className="flex justify-center gap-4 mb-6">
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
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-full h-16" />
              ))}
            </div>
          ) : filteredAppointments?.length === 0 ? (
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
                          <Badge variant={isPast ? "outline" : "default"}>
                            {isPast ? 'Completed' : 'Scheduled'}
                          </Badge>
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
    </div>
  );
}