import fs from 'fs';
import path from 'path';
import { IStorage } from './storage';
import { 
  User, InsertUser, 
  Appointment, InsertAppointment, 
  Testimonial, InsertTestimonial,
  ContactMessage, InsertContactMessage,
  Service
} from '@shared/schema';

// Define the storage directory - using a path that works in both development and production
// In Heroku, use the tmp directory for data storage since the filesystem is ephemeral
const isDev = process.env.NODE_ENV === 'development';
const DATA_DIR = isDev 
  ? path.join(process.cwd(), 'data')
  : path.join(process.env.HOME || '/tmp', 'barber_shop_data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`Created data directory at ${DATA_DIR}`);
}

// File paths for each data type
const FILES = {
  users: path.join(DATA_DIR, 'users.json'),
  appointments: path.join(DATA_DIR, 'appointments.json'),
  testimonials: path.join(DATA_DIR, 'testimonials.json'),
  contactMessages: path.join(DATA_DIR, 'contact-messages.json'),
  services: path.join(DATA_DIR, 'services.json')
};

// Initialize files if they don't exist
Object.values(FILES).forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
  }
});

// Helper functions for reading/writing JSON files
function readJsonFile<T>(filePath: string): T {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [] as unknown as T;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}

// FileStorage implementation of IStorage
export class FileStorage implements IStorage {
  constructor() {
    // Initialize with default data if files are empty
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const users = readJsonFile<User[]>(FILES.users);
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = readJsonFile<User[]>(FILES.users);
    return users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = readJsonFile<User[]>(FILES.users);
    const id = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
    
    const newUser: User = {
      ...insertUser,
      id
    };
    
    users.push(newUser);
    writeJsonFile(FILES.users, users);
    return newUser;
  }

  // Appointment methods
  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const appointments = readJsonFile<Appointment[]>(FILES.appointments);
    const id = appointments.length > 0 ? Math.max(...appointments.map(apt => apt.id)) + 1 : 1;
    
    // Extract necessary fields explicitly to avoid type issues
    const {
      date,
      name,
      email,
      phone,
      service,
      time,
      notes: rawNotes
    } = insertAppointment;
    
    // Ensure notes is always string | null
    const notes = rawNotes === undefined ? null : rawNotes;
    
    const newAppointment: Appointment = {
      id,
      date,
      name,
      email,
      phone,
      service,
      time,
      notes,
      completed: false,
      createdAt: new Date()
    };
    
    appointments.push(newAppointment);
    writeJsonFile(FILES.appointments, appointments);
    return newAppointment;
  }

  async getAppointments(): Promise<Appointment[]> {
    return readJsonFile<Appointment[]>(FILES.appointments);
  }

  async getAppointmentById(id: number): Promise<Appointment | undefined> {
    const appointments = readJsonFile<Appointment[]>(FILES.appointments);
    return appointments.find(apt => apt.id === id);
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const appointments = readJsonFile<Appointment[]>(FILES.appointments);
    return appointments.filter(apt => apt.date === date);
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const appointments = readJsonFile<Appointment[]>(FILES.appointments);
    const initialLength = appointments.length;
    
    const filteredAppointments = appointments.filter(apt => apt.id !== id);
    writeJsonFile(FILES.appointments, filteredAppointments);
    
    return initialLength > filteredAppointments.length;
  }

  async updateAppointmentStatus(id: number, completed: boolean): Promise<Appointment> {
    const appointments = readJsonFile<Appointment[]>(FILES.appointments);
    const appointmentIndex = appointments.findIndex(apt => apt.id === id);
    
    if (appointmentIndex === -1) {
      throw new Error(`Appointment with id ${id} not found`);
    }
    
    appointments[appointmentIndex].completed = completed;
    writeJsonFile(FILES.appointments, appointments);
    
    return appointments[appointmentIndex];
  }

  // Testimonial methods
  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const testimonials = readJsonFile<Testimonial[]>(FILES.testimonials);
    const id = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
    
    const newTestimonial: Testimonial = {
      ...insertTestimonial,
      id,
      approved: true, // Auto-approve for demo purposes
      createdAt: new Date()
    };
    
    testimonials.push(newTestimonial);
    writeJsonFile(FILES.testimonials, testimonials);
    return newTestimonial;
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    const testimonials = readJsonFile<Testimonial[]>(FILES.testimonials);
    return testimonials.filter(t => t.approved);
  }

  // Contact message methods
  async createContactMessage(insertContactMessage: InsertContactMessage): Promise<ContactMessage> {
    const messages = readJsonFile<ContactMessage[]>(FILES.contactMessages);
    const id = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
    
    const newMessage: ContactMessage = {
      ...insertContactMessage,
      id,
      createdAt: new Date()
    };
    
    messages.push(newMessage);
    writeJsonFile(FILES.contactMessages, messages);
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return readJsonFile<ContactMessage[]>(FILES.contactMessages);
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    const messages = readJsonFile<ContactMessage[]>(FILES.contactMessages);
    const initialLength = messages.length;
    
    const filteredMessages = messages.filter(m => m.id !== id);
    writeJsonFile(FILES.contactMessages, filteredMessages);
    
    return initialLength > filteredMessages.length;
  }

  // Services methods
  async getServices(): Promise<Service[]> {
    return readJsonFile<Service[]>(FILES.services);
  }

  // Initialize data with default values if files are empty
  async initializeData(): Promise<void> {
    // Initialize users if empty
    const users = readJsonFile<User[]>(FILES.users);
    if (users.length === 0) {
      const defaultAdmin: User = {
        id: 1,
        username: 'deep',
        password: '2fbb28b155e75a89f19ef18f5583bbf2be847a42e2a4d47d2aef136a5d4f5c07.1c27a9e4e53c4a1ff89b58d0fec3f938' // "deep8670"
      };
      writeJsonFile(FILES.users, [defaultAdmin]);
    }

    // Initialize services if empty
    const services = readJsonFile<Service[]>(FILES.services);
    if (services.length === 0) {
      const defaultServices: Service[] = [
        {
          id: 1,
          name: 'CLASSIC CUT',
          description: 'Traditional haircut with scissors and clippers',
          price: 25,
          icon: 'scissors'
        },
        {
          id: 2,
          name: 'BEARD TRIM',
          description: 'Professional beard styling and trimming',
          price: 15,
          icon: 'beard'
        },
        {
          id: 3,
          name: 'RAZOR SHAVE',
          description: 'Hot towel and straight razor traditional shave',
          price: 30,
          icon: 'razor'
        },
        {
          id: 4,
          name: 'HAIR + BEARD',
          description: 'Complete hair and beard styling package',
          price: 35,
          icon: 'combo'
        }
      ];
      writeJsonFile(FILES.services, defaultServices);
    }

    // Initialize testimonials if empty
    const testimonials = readJsonFile<Testimonial[]>(FILES.testimonials);
    if (testimonials.length === 0) {
      const defaultTestimonials: Testimonial[] = [
        {
          id: 1,
          name: 'MARK T.',
          rating: 5,
          comment: 'Best barber in town! Always leave looking and feeling great.',
          approved: true,
          createdAt: new Date()
        },
        {
          id: 2,
          name: 'JAMES L.',
          rating: 5,
          comment: 'Been coming here for years. Consistent quality and great conversation!',
          approved: true,
          createdAt: new Date()
        },
        {
          id: 3,
          name: 'ROBERT K.',
          rating: 4,
          comment: 'Love the atmosphere and always get exactly what I ask for.',
          approved: true,
          createdAt: new Date()
        }
      ];
      writeJsonFile(FILES.testimonials, defaultTestimonials);
    }
  }
}