export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface Product {
  id: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface QuoteItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface Quote {
  id: string;
  client: Client;
  items: QuoteItem[];
  laborCost: number;
  monthlyService: MonthlyServiceOption;
  createdAt: Date;
}

export type MonthlyServiceOption = "0.5" | "1" | "1.5" | "2" | "2.5" | "3" | "";
