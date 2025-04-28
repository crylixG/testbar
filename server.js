// Simple production server that doesn't depend on external dependencies
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

// Set NODE_ENV to production if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

console.log(`Starting server in ${process.env.NODE_ENV} mode`);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'dist', 'client')));

//----------------------------------------------
// INLINE FILE STORAGE - No external dependencies
//----------------------------------------------

// Schemas for our data types
const schemas = {
  // These match the schemas in shared/schema.ts
  users: {
    id: 'number',
    username: 'string',
    password: 'string'
  },
  appointments: {
    id: 'number',
    date: 'string',
    time: 'string',
    name: 'string',
    email: 'string',
    phone: 'string',
    service: 'string',
    notes: 'string?',
    completed: 'boolean',
    createdAt: 'Date'
  },
  testimonials: {
    id: 'number',
    name: 'string',
    rating: 'number',
    comment: 'string',
    approved: 'boolean',
    createdAt: 'Date'
  },
  contactMessages: {
    id: 'number',
    name: 'string',
    email: 'string',
    message: 'string',
    createdAt: 'Date'
  },
  services: {
    id: 'number',
    name: 'string',
    description: 'string',
    price: 'number',
    icon: 'string'
  }
};

// Define the storage directory - using a path that works in Heroku
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
    console.log(`Created empty file: ${file}`);
  }
});

// Helper functions for reading/writing JSON files
function readJsonFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File ${filePath} does not exist, creating empty file`);
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error(`Error parsing JSON from ${filePath}:`, parseError);
      // If the file exists but is corrupted, create a new one
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    // Create the parent directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory ${dir}`);
    }
    
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    console.log(`Created empty file at ${filePath}`);
    return [];
  }
}

function writeJsonFile(filePath, data) {
  try {
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory ${dir}`);
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    // Try to determine what went wrong
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
    }
  }
}

// Auth helpers
const scryptAsync = promisify(scrypt);

async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Storage class implementation
class FileStorage {
  constructor() {
    // Initialize with default data if files are empty
    this.initializeData();
  }

  // User methods
  async getUser(id) {
    const users = readJsonFile(FILES.users);
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username) {
    const users = readJsonFile(FILES.users);
    return users.find(user => user.username === username);
  }

  async createUser(insertUser) {
    const users = readJsonFile(FILES.users);
    const id = users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1;
    
    const newUser = {
      ...insertUser,
      id
    };
    
    users.push(newUser);
    writeJsonFile(FILES.users, users);
    return newUser;
  }

  // Appointment methods
  async createAppointment(insertAppointment) {
    const appointments = readJsonFile(FILES.appointments);
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
    
    const newAppointment = {
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

  async getAppointments() {
    return readJsonFile(FILES.appointments);
  }

  async getAppointmentById(id) {
    const appointments = readJsonFile(FILES.appointments);
    return appointments.find(apt => apt.id === id);
  }

  async getAppointmentsByDate(date) {
    const appointments = readJsonFile(FILES.appointments);
    return appointments.filter(apt => apt.date === date);
  }

  async deleteAppointment(id) {
    const appointments = readJsonFile(FILES.appointments);
    const initialLength = appointments.length;
    
    const filteredAppointments = appointments.filter(apt => apt.id !== id);
    writeJsonFile(FILES.appointments, filteredAppointments);
    
    return initialLength > filteredAppointments.length;
  }

  async updateAppointmentStatus(id, completed) {
    const appointments = readJsonFile(FILES.appointments);
    const appointmentIndex = appointments.findIndex(apt => apt.id === id);
    
    if (appointmentIndex === -1) {
      throw new Error(`Appointment with id ${id} not found`);
    }
    
    appointments[appointmentIndex].completed = completed;
    writeJsonFile(FILES.appointments, appointments);
    
    return appointments[appointmentIndex];
  }

  // Testimonial methods
  async createTestimonial(insertTestimonial) {
    const testimonials = readJsonFile(FILES.testimonials);
    const id = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
    
    const newTestimonial = {
      ...insertTestimonial,
      id,
      approved: true, // Auto-approve for demo purposes
      createdAt: new Date()
    };
    
    testimonials.push(newTestimonial);
    writeJsonFile(FILES.testimonials, testimonials);
    return newTestimonial;
  }

  async getApprovedTestimonials() {
    const testimonials = readJsonFile(FILES.testimonials);
    return testimonials.filter(t => t.approved);
  }

  // Contact message methods
  async createContactMessage(insertContactMessage) {
    const messages = readJsonFile(FILES.contactMessages);
    const id = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
    
    const newMessage = {
      ...insertContactMessage,
      id,
      createdAt: new Date()
    };
    
    messages.push(newMessage);
    writeJsonFile(FILES.contactMessages, messages);
    return newMessage;
  }

  async getContactMessages() {
    return readJsonFile(FILES.contactMessages);
  }

  async deleteContactMessage(id) {
    const messages = readJsonFile(FILES.contactMessages);
    const initialLength = messages.length;
    
    const filteredMessages = messages.filter(m => m.id !== id);
    writeJsonFile(FILES.contactMessages, filteredMessages);
    
    return initialLength > filteredMessages.length;
  }

  // Services methods
  async getServices() {
    return readJsonFile(FILES.services);
  }

  // Initialize data with default values if files are empty
  async initializeData() {
    // Initialize users if empty
    const users = readJsonFile(FILES.users);
    if (users.length === 0) {
      const defaultAdmin = {
        id: 1,
        username: 'deep',
        password: '2fbb28b155e75a89f19ef18f5583bbf2be847a42e2a4d47d2aef136a5d4f5c07.1c27a9e4e53c4a1ff89b58d0fec3f938' // "deep8670"
      };
      writeJsonFile(FILES.users, [defaultAdmin]);
    }

    // Initialize services if empty
    const services = readJsonFile(FILES.services);
    if (services.length === 0) {
      const defaultServices = [
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
    const testimonials = readJsonFile(FILES.testimonials);
    if (testimonials.length === 0) {
      const defaultTestimonials = [
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

// Create and initialize the storage instance
const storage = new FileStorage();

// Define API routes
app.get('/api/services', async (_req, res) => {
  try {
    const services = await storage.getServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.post('/api/appointments', async (req, res) => {
  try {
    const appointment = await storage.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

app.get('/api/appointments/date/:date', async (req, res) => {
  try {
    const appointments = await storage.getAppointmentsByDate(req.params.date);
    const bookedTimes = appointments.map(app => app.time);
    res.json(bookedTimes);
  } catch (error) {
    console.error('Error fetching appointments by date:', error);
    res.status(500).json({ error: 'Failed to fetch appointments by date' });
  }
});

app.get('/api/admin/appointments', async (_req, res) => {
  try {
    const appointments = await storage.getAppointments();
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching all appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

app.delete('/api/admin/appointments/:id', async (req, res) => {
  try {
    const deleted = await storage.deleteAppointment(Number(req.params.id));
    if (deleted) {
      res.json({ message: 'Appointment deleted successfully' });
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

app.patch('/api/admin/appointments/:id/complete', async (req, res) => {
  try {
    const appointment = await storage.updateAppointmentStatus(Number(req.params.id), req.body.completed);
    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
});

app.get('/api/testimonials', async (_req, res) => {
  try {
    const testimonials = await storage.getApprovedTestimonials();
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const testimonial = await storage.createTestimonial(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const contactMessage = await storage.createContactMessage(req.body);
    res.status(201).json(contactMessage);
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Failed to create contact message' });
  }
});

app.get('/api/admin/contact-messages', async (_req, res) => {
  try {
    const messages = await storage.getContactMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

app.delete('/api/admin/contact-messages/:id', async (req, res) => {
  try {
    const deleted = await storage.deleteContactMessage(Number(req.params.id));
    if (deleted) {
      res.json({ message: 'Contact message deleted successfully' });
    } else {
      res.status(404).json({ error: 'Contact message not found' });
    }
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ error: 'Failed to delete contact message' });
  }
});

// Make sure all routes route to index.html for the SPA
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'client', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});