import { useState, useEffect } from "react";
import { QuoteForm } from "@/components/quotes/quote-form";
import { Client, Product, Quote } from "@/lib/types";
import { 
  getClients, 
  getProducts, 
  saveClient, 
  saveProduct, 
  saveQuote,
  updateQuote,
  initializeData
} from "@/lib/data";
import { useLocation } from "wouter";

export default function GenerateQuote() {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editQuote, setEditQuote] = useState<Quote | null>(null);
  const [location] = useLocation();

  useEffect(() => {
    // Initialize data if needed and load data
    initializeData();
    
    const loadedClients = getClients();
    const loadedProducts = getProducts();
    
    setClients(loadedClients);
    setProducts(loadedProducts);
    
    // Check if we're in edit mode (from URL params)
    const isEditing = location.includes('?edit=true');
    
    if (isEditing) {
      // Get the quote from localStorage
      const storedQuote = localStorage.getItem('editQuote');
      if (storedQuote) {
        try {
          const quote = JSON.parse(storedQuote);
          // Convert string date back to Date object
          if (typeof quote.createdAt === 'string') {
            quote.createdAt = new Date(quote.createdAt);
          }
          setEditQuote(quote);
          
          // Clean up localStorage after use
          localStorage.removeItem('editQuote');
        } catch (error) {
          console.error('Error parsing stored quote:', error);
        }
      }
    }
  }, [location]);

  const handleSaveClient = (client: Omit<Client, "id">) => {
    const newClient = saveClient(client);
    setClients([...clients, newClient]);
    return newClient;
  };

  const handleSaveProduct = (product: Omit<Product, "id">) => {
    const newProduct = saveProduct(product);
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const handleSaveQuote = (quote: Omit<Quote, "id" | "createdAt">) => {
    if (editQuote) {
      // If we're editing an existing quote, preserve the ID and createdAt
      const updatedQuote = {
        ...quote,
        id: editQuote.id,
        createdAt: editQuote.createdAt
      };
      return updateQuote(updatedQuote);
    } else {
      // Create a new quote
      return saveQuote(quote);
    }
  };

  return (
    <QuoteForm
      clients={clients}
      products={products}
      onSaveClient={handleSaveClient}
      onSaveProduct={handleSaveProduct}
      onSaveQuote={handleSaveQuote}
      initialData={editQuote}
    />
  );
}
