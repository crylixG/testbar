import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateTimeSlots(): string[] {
  const timeSlots = [];
  
  // Generate time slots from 9:00 AM to 7:00 PM
  for (let hour = 9; hour <= 19; hour++) {
    const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
    timeSlots.push(`${formattedHour}:00`);
  }
  
  return timeSlots;
}

export function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':');
  const hourNum = parseInt(hours, 10);
  const suffix = hourNum >= 12 ? 'PM' : 'AM';
  const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
  return `${displayHour}:${minutes} ${suffix}`;
}
