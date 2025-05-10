import { useState, useEffect } from "react";
import { ProductList } from "@/components/products/product-list";
import { Product } from "@/lib/types";
import { ProductsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load products on mount
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductsAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (product: Omit<Product, "id">) => {
    try {
      const newProduct = await ProductsAPI.create(product);
      setProducts([...products, newProduct]);
      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso!",
      });
      return newProduct;
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o produto. Tente novamente mais tarde.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdate = async (product: Product) => {
    try {
      const updatedProduct = await ProductsAPI.update(product.id, product);
      setProducts(products.map(p => p.id === product.id ? updatedProduct : p));
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!",
      });
      return updatedProduct;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto. Tente novamente mais tarde.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await ProductsAPI.delete(id);
      setProducts(products.filter(p => p.id !== id));
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o produto. Verifique se ele não está sendo utilizado em algum orçamento.",
        variant: "destructive",
      });
    }
  };

  return (
    <ProductList
      products={products}
      onSave={handleSave}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
