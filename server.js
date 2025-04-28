// Simple production server that doesn't depend on Vite
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import bodyParser from 'body-parser';

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
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'dist', 'client')));

// Import the storage
import { storage } from './dist/file-storage.js';

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