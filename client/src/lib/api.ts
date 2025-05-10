import { Client, Product, Quote } from './types';

const API_BASE_URL = 'https://lemonchiffon-ferret-583001.hostingersite.com/api'; // Troque para o seu domínio real!

// Função genérica para fazer requisições
async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Serviços para Produtos
export const ProductsAPI = {
  getAll: (): Promise<Product[]> => request('/listar_produtos.php'),

  getById: (id: string): Promise<Product> => request(`/listar_produtos.php?id=${id}`),

  create: (product: Omit<Product, 'id'>): Promise<Product> => 
    request('/cadastrar_produto.php', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  update: (id: string, product: Partial<Omit<Product, 'id'>>): Promise<Product> =>
    request(`/editar_produto.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  delete: (id: string): Promise<void> =>
    request(`/excluir_produto.php?id=${id}`),
};

// Serviços para Clientes
export const ClientsAPI = {
  getAll: (): Promise<Client[]> => request('/listar_clientes.php'),

  getById: (id: string): Promise<Client> => request(`/listar_clientes.php?id=${id}`),

  create: (client: Omit<Client, 'id'>): Promise<Client> =>
    request('/cadastrar_cliente.php', {
      method: 'POST',
      body: JSON.stringify(client),
    }),

  update: (id: string, client: Partial<Omit<Client, 'id'>>): Promise<Client> =>
    request(`/editar_cliente.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify(client),
    }),

  delete: (id: string): Promise<void> =>
    request(`/excluir_cliente.php?id=${id}`),
};

// Serviços para Orçamentos (Quotes)
export const QuotesAPI = {
  getAll: (): Promise<Quote[]> => request('/listar_orcamentos.php'),

  getById: (id: string): Promise<Quote> => request(`/listar_orcamentos.php?id=${id}`),

  create: (quote: Omit<Quote, 'id' | 'createdAt'>): Promise<Quote> =>
    request('/cadastrar_orcamento.php', {
      method: 'POST',
      body: JSON.stringify({
        clientId: parseInt(quote.client.id),
        laborCost: quote.laborCost,
        monthlyService: quote.monthlyService,
        items: JSON.stringify(quote.items.map(item => ({
          productId: parseInt(item.product.id),
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))),
        total: quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) + quote.laborCost
      }),
    }),

  delete: (id: string): Promise<void> =>
    request(`/excluir_orcamento.php?id=${id}`),
};
