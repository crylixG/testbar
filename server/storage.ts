import { 
  type User, 
  type InsertUser, 
  type Appointment, 
  type InsertAppointment, 
  type Testimonial, 
  type InsertTestimonial, 
  type ContactMessage, 
  type InsertContactMessage,
  type Service,
  type InsertService
} from "@shared/schema";
import { FileStorage } from "./file-storage";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Appointment methods
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentById(id: number): Promise<Appointment | undefined>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  deleteAppointment(id: number): Promise<boolean>;
  updateAppointmentStatus(id: number, completed: boolean): Promise<Appointment>;
  
  // Testimonial methods
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getApprovedTestimonials(): Promise<Testimonial[]>;
  
  // Contact message methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  deleteContactMessage(id: number): Promise<boolean>;
  
  // Services methods
  getServices(): Promise<Service[]>;
}

// We are now using FileStorage instead of DatabaseStorage

// Export FileStorage as the storage implementation
export const storage = new FileStorage();
