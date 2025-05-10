import { useState, useEffect } from "react";
import { QuoteList } from "@/components/quotes/quote-list";
import { Quote } from "@/lib/types";
import { getQuotes, deleteQuote } from "@/lib/data";

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    // Load quotes on mount
    const loadedQuotes = getQuotes();
    setQuotes(loadedQuotes);
  }, []);

  const handleDelete = (id: string) => {
    deleteQuote(id);
    setQuotes(quotes.filter(q => q.id !== id));
  };

  return (
    <QuoteList
      quotes={quotes}
      onDelete={handleDelete}
    />
  );
}
