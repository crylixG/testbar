import { 
  users, 
  type User, 
  type InsertUser, 
  appointments,
  type Appointment, 
  type InsertAppointment, 
  testimonials,
  type Testimonial, 
  type InsertTestimonial, 
  contactMessages,
  type ContactMessage, 
  type InsertContactMessage,
  services,
  type Service,
  type InsertService
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { db } from "./db";

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
  
  // Testimonial methods
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getApprovedTestimonials(): Promise<Testimonial[]>;
  
  // Contact message methods
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  
  // Services methods
  getServices(): Promise<Service[]>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize the database with sample data when needed
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Appointment methods
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    // Ensure notes is explicitly null when undefined
    const appointmentData = {
      ...insertAppointment
    };
    
    // This ensures notes is always either string or null, never undefined
    if (appointmentData.notes === undefined) {
      appointmentData.notes = null;
    }
    
    const [appointment] = await db
      .insert(appointments)
      .values(appointmentData)
      .returning();
    return appointment;
  }
  
  async getAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments);
  }
  
  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }
  
  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const appointmentsOnDate = await db
      .select()
      .from(appointments)
      .where(eq(appointments.date, date))
      .orderBy(appointments.time);
    return appointmentsOnDate;
  }
  
  async deleteAppointment(id: number): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
  
  // Testimonial methods
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values({
        ...insertTestimonial,
        approved: true // Auto-approve for demo purposes
      })
      .returning();
    return testimonial;
  }
  
  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.approved, true))
      .orderBy(desc(testimonials.createdAt));
  }
  
  // Contact message methods
  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    const [contactMessage] = await db
      .insert(contactMessages)
      .values(insertContactMessage)
      .returning();
    return contactMessage;
  }
  
  // Services methods
  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }
  
  // Initialize database with sample data if needed
  async initializeData(): Promise<void> {
    try {
      // Check if services table is empty
      const existingServices = await db.select().from(services);
      
      if (existingServices.length === 0) {
        // Add default services
        const servicesList: InsertService[] = [
          { 
            name: "CLASSIC CUT", 
            description: "Traditional haircut with attention to detail and styling.", 
            price: 25, 
            icon: "ri-scissors-cut-line" 
          },
          { 
            name: "FADE", 
            description: "Clean fade with your choice of style on top.", 
            price: 30, 
            icon: "ri-scissors-cut-line" 
          },
          { 
            name: "BEARD TRIM", 
            description: "Shape and trim beard for a clean, groomed appearance.", 
            price: 15, 
            icon: "ri-scissors-cut-line" 
          },
          { 
            name: "HOT TOWEL SHAVE", 
            description: "Luxurious straight razor shave with hot towel treatment.", 
            price: 35, 
            icon: "ri-scissors-cut-line" 
          },
          { 
            name: "KID'S CUT", 
            description: "Haircut for children under 12 years old.", 
            price: 20, 
            icon: "ri-scissors-cut-line" 
          },
          { 
            name: "FULL SERVICE", 
            description: "Haircut, beard trim, and styling in one package.", 
            price: 45, 
            icon: "ri-scissors-cut-line" 
          }
        ];
        
        await db.insert(services).values(servicesList);
      }
      
      // Check if testimonials table is empty
      const existingTestimonials = await db.select().from(testimonials);
      
      if (existingTestimonials.length === 0) {
        // Add default testimonials
        const testimonialsList = [
          {
            name: "MARK T.",
            rating: 5,
            comment: "Best haircut I've ever had! The barber took the time to understand exactly what I wanted and delivered perfectly. The pixel art theme is super cool too!",
            approved: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
          },
          {
            name: "JAMES K.",
            rating: 5,
            comment: "Really impressed with the attention to detail on my fade. The online booking system made it super easy to schedule my appointment. Will definitely be coming back!",
            approved: true,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
          },
          {
            name: "ROBERT L.",
            rating: 4,
            comment: "The hot towel shave was amazing! The barber was friendly and professional, and the pixel art decor makes this place stand out from any other barber shop I've visited.",
            approved: true,
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
          }
        ];
        
        await db.insert(testimonials).values(testimonialsList);
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }
}

export const storage = new DatabaseStorage();
