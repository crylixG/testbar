import { 
  users, 
  type User, 
  type InsertUser, 
  type Appointment, 
  type InsertAppointment, 
  type Testimonial, 
  type InsertTestimonial, 
  type ContactMessage, 
  type InsertContactMessage,
  type Service
} from "@shared/schema";

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

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private appointments: Map<number, Appointment>;
  private testimonials: Map<number, Testimonial>;
  private contactMessages: Map<number, ContactMessage>;
  private services: Map<number, Service>;
  
  private userCurrentId: number;
  private appointmentCurrentId: number;
  private testimonialCurrentId: number;
  private contactMessageCurrentId: number;
  
  constructor() {
    this.users = new Map();
    this.appointments = new Map();
    this.testimonials = new Map();
    this.contactMessages = new Map();
    this.services = new Map();
    
    this.userCurrentId = 1;
    this.appointmentCurrentId = 1;
    this.testimonialCurrentId = 1;
    this.contactMessageCurrentId = 1;
    
    // Initialize with sample services
    this.initializeServices();
    
    // Initialize with sample testimonials
    this.initializeTestimonials();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Appointment methods
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentCurrentId++;
    const appointment: Appointment = { 
      ...insertAppointment, 
      id, 
      createdAt: new Date() 
    };
    this.appointments.set(id, appointment);
    return appointment;
  }
  
  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).sort((a, b) => 
      new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime()
    );
  }
  
  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }
  
  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.date === date)
      .sort((a, b) => a.time.localeCompare(b.time));
  }
  
  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }
  
  // Testimonial methods
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialCurrentId++;
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id, 
      approved: true, // Auto-approve for demo purposes
      createdAt: new Date() 
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values())
      .filter(testimonial => testimonial.approved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Contact message methods
  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageCurrentId++;
    const contactMessage: ContactMessage = { 
      ...insertContactMessage, 
      id, 
      createdAt: new Date() 
    };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }
  
  // Services methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  // Initialize with sample data
  private initializeServices() {
    const servicesList = [
      { 
        id: 1, 
        name: "CLASSIC CUT", 
        description: "Traditional haircut with attention to detail and styling.", 
        price: 25, 
        icon: "ri-scissors-cut-line" 
      },
      { 
        id: 2, 
        name: "FADE", 
        description: "Clean fade with your choice of style on top.", 
        price: 30, 
        icon: "ri-scissors-cut-line" 
      },
      { 
        id: 3, 
        name: "BEARD TRIM", 
        description: "Shape and trim beard for a clean, groomed appearance.", 
        price: 15, 
        icon: "ri-scissors-cut-line" 
      },
      { 
        id: 4, 
        name: "HOT TOWEL SHAVE", 
        description: "Luxurious straight razor shave with hot towel treatment.", 
        price: 35, 
        icon: "ri-scissors-cut-line" 
      },
      { 
        id: 5, 
        name: "KID'S CUT", 
        description: "Haircut for children under 12 years old.", 
        price: 20, 
        icon: "ri-scissors-cut-line" 
      },
      { 
        id: 6, 
        name: "FULL SERVICE", 
        description: "Haircut, beard trim, and styling in one package.", 
        price: 45, 
        icon: "ri-scissors-cut-line" 
      }
    ];
    
    servicesList.forEach(service => {
      this.services.set(service.id, service);
    });
  }
  
  private initializeTestimonials() {
    const testimonialsList = [
      {
        id: 1,
        name: "MARK T.",
        rating: 5,
        comment: "Best haircut I've ever had! The barber took the time to understand exactly what I wanted and delivered perfectly. The pixel art theme is super cool too!",
        approved: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        id: 2,
        name: "JAMES K.",
        rating: 5,
        comment: "Really impressed with the attention to detail on my fade. The online booking system made it super easy to schedule my appointment. Will definitely be coming back!",
        approved: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        id: 3,
        name: "ROBERT L.",
        rating: 4,
        comment: "The hot towel shave was amazing! The barber was friendly and professional, and the pixel art decor makes this place stand out from any other barber shop I've visited.",
        approved: true,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
      }
    ];
    
    testimonialsList.forEach(testimonial => {
      this.testimonials.set(testimonial.id, testimonial);
    });
  }
}

export const storage = new MemStorage();
