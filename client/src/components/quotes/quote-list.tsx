import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QuotePreview } from "./quote-preview";
import { Quote } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { Eye, FileText, Trash2, Edit } from "lucide-react";
import { generateQuotePDF } from "@/lib/pdf-generator";

interface QuoteListProps {
  quotes: Quote[];
  onDelete: (id: string) => void;
}

export function QuoteList({ quotes, onDelete }: QuoteListProps) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | undefined>(undefined);
  const [, setLocation] = useLocation();

  const handlePreview = (quote: Quote) => {
    setSelectedQuote(quote);
    setOpenPreview(true);
  };

  const handleDelete = (quote: Quote) => {
    setSelectedQuote(quote);
    setOpenDeleteDialog(true);
  };

  const handleGeneratePDF = (quote: Quote) => {
    generateQuotePDF(quote);
  };

  const handleEdit = (quote: Quote) => {
    // Store the quote in localStorage so we can retrieve it in the generate-quote page
    localStorage.setItem('editQuote', JSON.stringify(quote));
    setLocation('/generate-quote?edit=true');
  };

  const confirmDelete = () => {
    if (selectedQuote) {
      onDelete(selectedQuote.id);
    }
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Orçamentos</h1>
        <Link href="/generate-quote">
          <Button>Novo Orçamento</Button>
        </Link>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Produtos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Nenhum orçamento encontrado.
                </TableCell>
              </TableRow>
            ) : (
              quotes.map((quote) => {
                const totalProducts = quote.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );
                const totalValue = quote.items.reduce(
                  (sum, item) => sum + item.quantity * item.unitPrice,
                  0
                ) + quote.laborCost;

                return (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">
                      {quote.client.name}
                    </TableCell>
                    <TableCell>{formatDate(quote.createdAt)}</TableCell>
                    <TableCell>{totalProducts}</TableCell>
                    <TableCell>{formatCurrency(totalValue)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePreview(quote)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(quote)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4 text-[#4f94cd]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleGeneratePDF(quote)}
                          title="Gerar PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(quote)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedQuote && (
        <QuotePreview
          quote={selectedQuote}
          open={openPreview}
          onOpenChange={setOpenPreview}
        />
      )}

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o orçamento para{" "}
              <strong>{selectedQuote?.client.name}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
