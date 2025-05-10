import { Client, Product, Quote, MonthlyServiceOption } from './types';
import { generateId } from './utils';

// LocalStorage keys
const CLIENTS_KEY = 'konnekit-clients';
const PRODUCTS_KEY = 'konnekit-products';
const QUOTES_KEY = 'konnekit-quotes';

// Client Data Operations
export const getClients = (): Client[] => {
  const clients = localStorage.getItem(CLIENTS_KEY);
  return clients ? JSON.parse(clients) : [];
};

export const getClient = (id: string): Client | undefined => {
  const clients = getClients();
  return clients.find(client => client.id === id);
};

export const saveClient = (client: Omit<Client, 'id'>): Client => {
  const clients = getClients();
  const newClient = { ...client, id: generateId() };
  clients.push(newClient);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  return newClient;
};

export const updateClient = (client: Client): Client => {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === client.id);
  if (index >= 0) {
    clients[index] = client;
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  }
  return client;
};

export const deleteClient = (id: string): void => {
  const clients = getClients();
  const filtered = clients.filter(client => client.id !== id);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(filtered));
};

// Product Data Operations
export const getProducts = (): Product[] => {
  const products = localStorage.getItem(PRODUCTS_KEY);
  return products ? JSON.parse(products) : [];
};

export const getProduct = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(product => product.id === id);
};

export const saveProduct = (product: Omit<Product, 'id'>): Product => {
  const products = getProducts();
  const newProduct = { ...product, id: generateId() };
  products.push(newProduct);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return newProduct;
};

export const updateProduct = (product: Product): Product => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }
  return product;
};

export const deleteProduct = (id: string): void => {
  const products = getProducts();
  const filtered = products.filter(product => product.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
};

// Quote Data Operations
export const getQuotes = (): Quote[] => {
  const quotes = localStorage.getItem(QUOTES_KEY);
  return quotes ? JSON.parse(quotes).map((quote: any) => ({
    ...quote,
    createdAt: new Date(quote.createdAt),
  })) : [];
};

export const getQuote = (id: string): Quote | undefined => {
  const quotes = getQuotes();
  return quotes.find(quote => quote.id === id);
};

export const saveQuote = (quote: Omit<Quote, 'id' | 'createdAt'>): Quote => {
  const quotes = getQuotes();
  const newQuote = {
    ...quote,
    id: generateId(),
    createdAt: new Date(),
  };
  quotes.push(newQuote);
  localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  return newQuote;
};

export const updateQuote = (quote: Quote): Quote => {
  const quotes = getQuotes();
  const index = quotes.findIndex(q => q.id === quote.id);
  if (index >= 0) {
    quotes[index] = quote;
    localStorage.setItem(QUOTES_KEY, JSON.stringify(quotes));
  }
  return quote;
};

export const deleteQuote = (id: string): void => {
  const quotes = getQuotes();
  const filtered = quotes.filter(quote => quote.id !== id);
  localStorage.setItem(QUOTES_KEY, JSON.stringify(filtered));
};

// Utility to calculate quote totals
export const calculateQuoteTotals = (quote: Pick<Quote, 'items' | 'laborCost'>) => {
  const productsTotal = quote.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  
  const totalWithLabor = productsTotal + quote.laborCost;
  
  return {
    productsTotal,
    totalWithLabor,
  };
};

// Initialize with sample data if needed
export const initializeData = () => {
  // Only initialize if there's no data yet
  if (localStorage.getItem(CLIENTS_KEY) === null) {
    const sampleClients: Client[] = [
      { id: generateId(), name: 'PANCINI', phone: '(19) 99999-9999', email: 'contato@pancini.com.br' },
    ];
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(sampleClients));
  }
  
  if (localStorage.getItem(PRODUCTS_KEY) === null) {
    const sampleProducts: Product[] = [
      { id: generateId(), description: 'KIT RACK', price: 2920.00, imageUrl: 'https://images.unsplash.com/photo-1605765356360-2d4a7136c42c?q=80&w=150&auto=format&fit=crop' },
      { id: generateId(), description: 'REGUA DE ENERGIA 12 TOMADAS', price: 105.00, imageUrl: 'https://images.unsplash.com/photo-1622676666769-1a0743952ff9?q=80&w=150&auto=format&fit=crop' },
      { id: generateId(), description: 'PATCH PANEL 24 PORTAS', price: 490.00, imageUrl: 'https://images.unsplash.com/photo-1558050032-160f36233a07?q=80&w=150&auto=format&fit=crop' },
      { id: generateId(), description: 'SWITCH 16 PORTAS POE', price: 3100.00, imageUrl: 'https://images.unsplash.com/photo-1562976540-9a0111cb1241?q=80&w=150&auto=format&fit=crop' },
      { id: generateId(), description: 'SWITCH 24 PORTAS GIGABIT', price: 1100.00, imageUrl: 'https://images.unsplash.com/photo-1591808216268-ce0b82787efe?q=80&w=150&auto=format&fit=crop' },
      { id: generateId(), description: 'UNIFI – PONTO DE ACESSO WIFI', price: 1255.00, imageUrl: 'https://images.unsplash.com/photo-1648376004254-f4e746ca8d7f?q=80&w=150&auto=format&fit=crop' },
    ];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(sampleProducts));
  }
};
