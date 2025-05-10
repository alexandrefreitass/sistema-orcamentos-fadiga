import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency in Brazilian Real format: R$ 1.234,56
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Parse Brazilian Real currency format (R$ 1.234,56) to number
export function parseCurrency(value: string): number {
  if (!value) return 0;
  
  // Remove R$ and any non-numeric characters except comma and dot
  const cleanValue = value.replace(/[^0-9,.]/g, '');
  
  // Replace dots with empty string and comma with dot
  const normalizedValue = cleanValue.replace(/\./g, '').replace(',', '.');
  
  return parseFloat(normalizedValue) || 0;
}

// Format date in Brazilian format: DD/MM/YYYY
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

// Get the current date formatted for display on quotations
export function getCurrentFormattedDate(): string {
  const months = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  
  const now = new Date();
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  
  return `São João da Boa Vista, ${day} de ${month} de ${year}`;
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Calculate the minimum wage value in BRL
export function calculateMinimumWage(multiplier: string): number {
  // Current minimum wage in Brazil (2024)
  const minimumWage = 1412;
  return minimumWage * parseFloat(multiplier || '0');
}

// Format monthly service display value
export function formatMonthlyService(value: string): string {
  if (!value) return '';
  
  switch (value) {
    case '0.5': return 'Meio salário mínimo';
    case '1': return '1 salário mínimo';
    case '1.5': return '1,5 salário mínimo';
    case '2': return '2 salários mínimos';
    case '2.5': return '2,5 salários mínimos';
    case '3': return '3 salários mínimos';
    default: return '';
  }
}
