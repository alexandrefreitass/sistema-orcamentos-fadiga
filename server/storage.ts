import { 
  users, type User, type InsertUser,
  clients, type Client, type InsertClient,
  products, type Product, type InsertProduct,
  quotes, type Quote, type InsertQuote 
} from "@shared/schema";
import { generateId } from "../client/src/lib/utils";

// Define the storage interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Clients
  getClients(): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: number, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Quotes
  getQuotes(): Promise<Quote[]>;
  getQuote(id: number): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  deleteQuote(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private products: Map<number, Product>;
  private quotes: Map<number, Quote>;
  private nextUserId: number;
  private nextClientId: number;
  private nextProductId: number;
  private nextQuoteId: number;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.products = new Map();
    this.quotes = new Map();
    this.nextUserId = 1;
    this.nextClientId = 1;
    this.nextProductId = 1;
    this.nextQuoteId = 1;
    
    // Initialize with sample data
    this.initSampleData();
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
    const id = this.nextUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Client methods
  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }
  
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }
  
  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.nextClientId++;
    const client: Client = { ...insertClient, id, createdAt: new Date() };
    this.clients.set(id, client);
    return client;
  }
  
  async updateClient(id: number, clientData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;
    
    const updatedClient: Client = { ...client, ...clientData };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }
  
  async deleteClient(id: number): Promise<boolean> {
    return this.clients.delete(id);
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.nextProductId++;
    const product: Product = { ...insertProduct, id, createdAt: new Date() };
    this.products.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct: Product = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Quote methods
  async getQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values());
  }
  
  async getQuote(id: number): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }
  
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = this.nextQuoteId++;
    const quote: Quote = { ...insertQuote, id, createdAt: new Date() };
    this.quotes.set(id, quote);
    return quote;
  }
  
  async deleteQuote(id: number): Promise<boolean> {
    return this.quotes.delete(id);
  }
  
  // Initialize with sample data
  private initSampleData() {
    // Sample clients
    this.createClient({
      name: "PANCINI",
      phone: "(19) 99999-9999",
      email: "contato@pancini.com.br",
    });
    
    // Sample products
    this.createProduct({
      description: "KIT RACK",
      price: 2920.00,
      imageUrl: "https://images.unsplash.com/photo-1605765356360-2d4a7136c42c?q=80&w=150&auto=format&fit=crop",
    });
    
    this.createProduct({
      description: "REGUA DE ENERGIA 12 TOMADAS",
      price: 105.00,
      imageUrl: "https://images.unsplash.com/photo-1622676666769-1a0743952ff9?q=80&w=150&auto=format&fit=crop",
    });
    
    this.createProduct({
      description: "PATCH PANEL 24 PORTAS",
      price: 490.00,
      imageUrl: "https://images.unsplash.com/photo-1558050032-160f36233a07?q=80&w=150&auto=format&fit=crop",
    });
    
    this.createProduct({
      description: "SWITCH 16 PORTAS POE",
      price: 3100.00,
      imageUrl: "https://images.unsplash.com/photo-1562976540-9a0111cb1241?q=80&w=150&auto=format&fit=crop",
    });
    
    this.createProduct({
      description: "SWITCH 24 PORTAS GIGABIT",
      price: 1100.00,
      imageUrl: "https://images.unsplash.com/photo-1591808216268-ce0b82787efe?q=80&w=150&auto=format&fit=crop",
    });
    
    this.createProduct({
      description: "UNIFI – PONTO DE ACESSO WIFI",
      price: 1255.00,
      imageUrl: "https://images.unsplash.com/photo-1648376004254-f4e746ca8d7f?q=80&w=150&auto=format&fit=crop",
    });
  }
}

export const storage = new MemStorage();
