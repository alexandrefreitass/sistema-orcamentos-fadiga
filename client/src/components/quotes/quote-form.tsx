import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuotePreview } from "./quote-preview";
import { Client, Product, Quote, QuoteItem, MonthlyServiceOption } from "@/lib/types";
import { formatCurrency, parseCurrency, generateId } from "@/lib/utils";
import { ClientForm } from "@/components/clients/client-form";
import { ProductForm } from "@/components/products/product-form";
import { Trash2, PlusCircle, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { generateQuotePDF } from "@/lib/pdf-generator";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface QuoteFormProps {
  clients: Client[];
  products: Product[];
  onSaveClient: (client: Omit<Client, "id">) => Client;
  onSaveProduct: (product: Omit<Product, "id">) => Product;
  onSaveQuote: (quote: Omit<Quote, "id" | "createdAt">) => Quote;
  initialData?: Quote | null;
}

export function QuoteForm({
  clients,
  products,
  onSaveClient,
  onSaveProduct,
  onSaveQuote,
  initialData
}: QuoteFormProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  // Usar localStorage para manter os itens ao mudar de aba
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(() => {
    const savedItems = localStorage.getItem('quoteItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [laborCost, setLaborCost] = useState<string>(() => {
    return localStorage.getItem('laborCost') || "";
  });
  const [monthlyService, setMonthlyService] = useState<MonthlyServiceOption>(() => {
    return (localStorage.getItem('monthlyService') as MonthlyServiceOption) || "0.5";
  });
  const [openClientForm, setOpenClientForm] = useState(false);
  const [openProductForm, setOpenProductForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load initial data if editing an existing quote
  useEffect(() => {
    if (initialData) {
      setIsEditing(true);
      setSelectedClientId(initialData.client.id);
      setQuoteItems(initialData.items);
      setLaborCost(formatCurrency(initialData.laborCost));
      setMonthlyService(initialData.monthlyService);
      
      // Salvar no localStorage
      localStorage.setItem('quoteItems', JSON.stringify(initialData.items));
      localStorage.setItem('laborCost', formatCurrency(initialData.laborCost));
      localStorage.setItem('monthlyService', initialData.monthlyService);
    }
  }, [initialData]);
  
  // Salvar itens no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('quoteItems', JSON.stringify(quoteItems));
  }, [quoteItems]);
  
  useEffect(() => {
    localStorage.setItem('laborCost', laborCost);
  }, [laborCost]);
  
  useEffect(() => {
    localStorage.setItem('monthlyService', monthlyService);
  }, [monthlyService]);

  // Calculate totals
  const productsTotal = quoteItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice, 
    0
  );
  
  const totalWithLabor = productsTotal + parseCurrency(laborCost || "0");



  const handleAddItem = () => {
    if (!selectedProductId) return;
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;
    
    // Check if product already exists in the quote
    const existingItemIndex = quoteItems.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Increment quantity if already exists
      const updatedItems = [...quoteItems];
      updatedItems[existingItemIndex].quantity += 1;
      setQuoteItems(updatedItems);
    } else {
      // Add new item
      setQuoteItems(prev => [
        ...prev,
        {
          product,
          quantity: 1,
          unitPrice: product.price,
        }
      ]);
    }
    
    setSelectedProductId("");
  };
  


  const handleRemoveItem = (index: number) => {
    setQuoteItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, value: number) => {
    // Ensure value is >= 1
    const quantity = Math.max(1, value);
    
    const updatedItems = [...quoteItems];
    updatedItems[index].quantity = quantity;
    setQuoteItems(updatedItems);
  };

  const handleUnitPriceChange = (index: number, value: string) => {
    const updatedItems = [...quoteItems];
    updatedItems[index].unitPrice = parseCurrency(value);
    setQuoteItems(updatedItems);
  };

  const handleLaborCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Format as currency
    const numericValue = value.replace(/\D/g, '');
    if (numericValue) {
      const formatted = formatCurrency(Number(numericValue) / 100);
      setLaborCost(formatted);
    } else {
      setLaborCost('');
    }
  };

  const handleSaveQuote = (generatePdf: boolean = false) => {
    if (!selectedClientId) {
      toast({
        title: "Cliente obrigatório",
        description: "Por favor, selecione um cliente para o orçamento.",
        variant: "destructive",
      });
      return;
    }
    
    if (quoteItems.length === 0) {
      toast({
        title: "Nenhum produto adicionado",
        description: "Por favor, adicione pelo menos um produto ao orçamento.",
        variant: "destructive",
      });
      return;
    }
    
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;
    
    const newQuote: Omit<Quote, "id" | "createdAt"> = {
      client,
      items: quoteItems,
      laborCost: parseCurrency(laborCost || "0"),
      monthlyService,
    };
    
    const savedQuote = onSaveQuote(newQuote);
    
    toast({
      title: isEditing ? "Orçamento atualizado" : "Orçamento salvo",
      description: isEditing 
        ? "O orçamento foi atualizado com sucesso." 
        : "O orçamento foi salvo com sucesso.",
    });
    
    if (generatePdf) {
      generateQuotePDF(savedQuote);
    }
    
    // Reset form and redirect to quotes list after saving
    setTimeout(() => {
      // Clear form
      setSelectedClientId("");
      setQuoteItems([]);
      setLaborCost("");
      setMonthlyService("0.5");
      setIsEditing(false);
      
      // Redirect to quotes list
      setLocation('/quotes');
    }, 1000);
  };
  
  const handleSaveClient = (data: Omit<Client, "id">) => {
    const newClient = onSaveClient(data);
    setSelectedClientId(newClient.id);
  };
  
  const handleSaveProduct = (data: Omit<Product, "id">) => {
    onSaveProduct(data);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">{isEditing ? 'Editar Orçamento' : 'Gerar Orçamento'}</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            {isEditing 
              ? 'Modifique o orçamento existente conforme necessário' 
              : 'Crie um novo orçamento personalizado para seu cliente'
            }
          </p>
        </div>
        <div>
          <Button
            variant="ghost"
            onClick={() => setShowPreview(true)}
            className="w-full sm:w-auto mt-2 sm:mt-0"
          >
            Visualizar
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Informações do Cliente</h2>
          
          <div className="mb-6">
            <div className="flex flex-col md:flex-row justify-between md:items-end mb-4">
              <Label className="block text-sm font-medium mb-2 md:mb-0">Selecione o Cliente</Label>
              <Button 
                variant="link" 
                onClick={() => setOpenClientForm(true)}
                className="mt-2 md:mt-0 p-0 h-auto text-[#4f94cd]"
              >
                Novo Cliente
              </Button>
            </div>
            <Select
              value={selectedClientId}
              onValueChange={setSelectedClientId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Produtos</h2>
          
          <div className="mb-4">
            <div className="flex flex-col md:flex-row justify-between md:items-end mb-4">
              <Label className="block text-sm font-medium mb-2 md:mb-0">Adicionar Produto</Label>
              <Button 
                variant="link" 
                onClick={() => setOpenProductForm(true)}
                className="mt-2 md:mt-0 p-0 h-auto text-[#4f94cd]"
              >
                + Novo Produto
              </Button>
            </div>
            
            <div className="grid gap-4 mb-4">
              <div>
                <Label htmlFor="product-select" className="block mb-2">Selecionar Produto</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Select
                    onValueChange={(value) => {
                      setSelectedProductId(value);
                    }}
                    value={selectedProductId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id} className="py-2">
                          <div className="flex items-center w-full">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded mr-3 overflow-hidden">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.description}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <span className="text-xs text-gray-400">Sem imagem</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatCurrency(product.price)}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={handleAddItem} 
                    className="flex items-center justify-center mt-2"
                    disabled={!selectedProductId}
                  >
                    <PlusCircle size={16} className="mr-2" /> Adicionar Produto
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela Desktop */}
          <div className="overflow-x-auto mb-6 hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Valor Unit.</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quoteItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      Nenhum produto adicionado ao orçamento.
                    </TableCell>
                  </TableRow>
                ) : (
                  quoteItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded">
                            {item.product.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.description}
                                className="h-10 w-10 rounded object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <span className="text-xs text-gray-400">Sem imagem</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.product.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                          className="w-16"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={formatCurrency(item.unitPrice)}
                          onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                          className="w-32 text-right font-mono"
                        />
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Versão Mobile em Cards */}
          <div className="block sm:hidden mb-6">
            {quoteItems.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-md">
                Nenhum produto adicionado ao orçamento.
              </div>
            ) : (
              <div className="space-y-4">
                {quoteItems.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.description}
                              className="h-12 w-12 rounded object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <span className="text-xs text-gray-400">Sem imagem</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 leading-tight">{item.product.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                          className="h-8 w-8 ml-auto"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div>
                          <Label htmlFor={`quantity-${index}`} className="text-xs mb-1 block">Quantidade</Label>
                          <Input
                            id={`quantity-${index}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`price-${index}`} className="text-xs mb-1 block">Valor Unit.</Label>
                          <Input
                            id={`price-${index}`}
                            type="text"
                            value={formatCurrency(item.unitPrice)}
                            onChange={(e) => handleUnitPriceChange(index, e.target.value)}
                            className="text-right font-mono"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t flex justify-between items-center">
                        <span className="text-sm">Total:</span>
                        <span className="font-medium font-mono">{formatCurrency(item.quantity * item.unitPrice)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Serviços e Suporte</h2>
          
          <div className="mb-6">
            <Label htmlFor="laborCost" className="block mb-2">Mão de obra, Instalações e Configurações</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <Input
                id="laborCost"
                value={laborCost}
                onChange={handleLaborCostChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="monthlyService" className="block mb-2">Serviços Mensais</Label>
            <Select
              value={monthlyService}
              onValueChange={(value) => setMonthlyService(value as MonthlyServiceOption)}
            >
              <SelectTrigger id="monthlyService">
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">Meio salário mínimo</SelectItem>
                <SelectItem value="1">1 salário mínimo</SelectItem>
                <SelectItem value="1.5">1,5 salário mínimo</SelectItem>
                <SelectItem value="2">2 salários mínimos</SelectItem>
                <SelectItem value="2.5">2,5 salários mínimos</SelectItem>
                <SelectItem value="3">3 salários mínimos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total dos Produtos:</span>
              <span className="font-mono">{formatCurrency(productsTotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Mão de Obra e Instalações:</span>
              <span className="font-mono">{laborCost || formatCurrency(0)}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="font-medium">Serviços Mensais:</span>
              <span className="font-mono">
                {monthlyService === "0.5" ? "Meio salário mínimo" : 
                 monthlyService === "1" ? "1 salário mínimo" :
                 monthlyService === "1.5" ? "1,5 salário mínimo" :
                 monthlyService === "2" ? "2 salários mínimos" :
                 monthlyService === "2.5" ? "2,5 salários mínimos" :
                 monthlyService === "3" ? "3 salários mínimos" : ""}
              </span>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-semibold">Total Geral:</span>
              <span className="text-lg font-semibold font-mono">{formatCurrency(totalWithLabor)}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-8 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleSaveQuote(false)}
              className="flex items-center justify-center w-full sm:w-auto"
            >
              {isEditing ? 'Atualizar' : 'Salvar'}
            </Button>
            <Button 
              onClick={() => handleSaveQuote(true)}
              className="flex items-center justify-center w-full sm:w-auto bg-[#a5c52a] hover:bg-[#94b324] text-white"
            >
              {isEditing ? 'Atualizar + Gerar PDF' : 'Salvar + Gerar PDF'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ClientForm
        open={openClientForm}
        onOpenChange={setOpenClientForm}
        onSave={handleSaveClient}
      />

      <ProductForm
        open={openProductForm}
        onOpenChange={setOpenProductForm}
        onSave={handleSaveProduct}
      />
      


      {showPreview && clients.find(c => c.id === selectedClientId) && (
        <QuotePreview
          quote={{
            id: "preview",
            client: clients.find(c => c.id === selectedClientId)!,
            items: quoteItems,
            laborCost: parseCurrency(laborCost || "0"),
            monthlyService,
            createdAt: new Date(),
          }}
          open={showPreview}
          onOpenChange={setShowPreview}
        />
      )}
    </>
  );
}
