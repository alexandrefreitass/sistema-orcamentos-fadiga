import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/types";
import { formatCurrency, parseCurrency } from "@/lib/utils";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (product: Omit<Product, "id">) => void;
  initialData?: Product;
}

export function ProductForm({
  open,
  onOpenChange,
  onSave,
  initialData,
}: ProductFormProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<{
    description: string;
    price: string;
    imageUrl: string;
  }>({
    description: "",
    price: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Reset form when dialog opens and update with initialData if provided
  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          description: initialData.description,
          price: formatCurrency(initialData.price),
          imageUrl: initialData.imageUrl || "",
        });
        setImagePreview(initialData.imageUrl || null);
      } else {
        // Reset form when opening to add a new product
        setFormData({
          description: "",
          price: "",
          imageUrl: "",
        });
        setImagePreview(null);
      }
    }
  }, [open, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Format as currency as user types
      const numericValue = value.replace(/\D/g, '');
      if (numericValue) {
        const formatted = formatCurrency(Number(numericValue) / 100);
        setFormData((prev) => ({ ...prev, [name]: formatted }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast({
        title: "Descrição é obrigatória",
        description: "Por favor, preencha a descrição do produto.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.price) {
      toast({
        title: "Valor é obrigatório",
        description: "Por favor, preencha o valor do produto.",
        variant: "destructive",
      });
      return;
    }
    
    onSave({
      description: formData.description,
      price: parseCurrency(formData.price),
      imageUrl: formData.imageUrl,
    });
    
    // Reset form after saving
    setFormData({
      description: "",
      price: "",
      imageUrl: "",
    });
    setImagePreview(null);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Editar Produto" : "Cadastrar Novo Produto"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do produto abaixo.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="image">Imagem</Label>
              <div 
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-md h-40 cursor-pointer hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-500 p-4">
                    <ImageIcon className="h-10 w-10 mb-2" />
                    <p className="text-sm font-medium">Clique para fazer upload</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF até 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Valor *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
