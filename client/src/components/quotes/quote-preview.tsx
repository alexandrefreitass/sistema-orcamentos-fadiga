import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Quote } from "@/lib/types";
import { KonnekitLogo } from "@/lib/logo";
import { formatCurrency, getCurrentFormattedDate, formatMonthlyService } from "@/lib/utils";
import { generateQuotePDF } from "@/lib/pdf-generator";

interface QuotePreviewProps {
  quote: Quote;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuotePreview({ quote, open, onOpenChange }: QuotePreviewProps) {
  const handleGeneratePDF = () => {
    generateQuotePDF(quote);
  };

  const productsTotal = quote.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  
  const totalWithLabor = productsTotal + quote.laborCost;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            Pré-visualização do Orçamento
          </h2>
          <Button onClick={handleGeneratePDF}>
            Gerar PDF
          </Button>
        </div>
        
        <div className="mt-4 border p-6 bg-gray-50 rounded overflow-y-auto max-h-[75vh]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <KonnekitLogo />
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">ORÇAMENTO DE EQUIPAMENTOS DE REDE</h2>
              <p className="text-lg mt-1">{quote.client.name}</p>
              <p className="text-sm mt-4">{getCurrentFormattedDate()}</p>
            </div>
          </div>
          
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full divide-y divide-gray-300 border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagem</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Unitário</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quote.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3" style={{ width: "80px" }}>
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded overflow-hidden">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.description}
                            className="h-16 w-16 object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="text-xs text-gray-400">Sem imagem</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{item.product.description}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-3 text-sm text-center">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col md:flex-row md:justify-between border-t pt-6">
            <div className="md:w-1/2">
              <h3 className="text-lg font-semibold mb-2">Observações:</h3>
              <p className="text-sm text-gray-600">Este orçamento tem validade de 30 dias.</p>
              <p className="text-sm text-gray-600 mt-2">
                Monitoramento, suporte e manutenção mensal: {formatMonthlyService(quote.monthlyService)}
              </p>
            </div>
            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="border rounded-md p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Total Produtos:</span>
                  <span className="text-sm font-medium">{formatCurrency(productsTotal)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Mão de Obra:</span>
                  <span className="text-sm font-medium">{formatCurrency(quote.laborCost)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">TOTAL GERAL:</span>
                    <span className="font-medium">{formatCurrency(totalWithLabor)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t text-center text-xs text-gray-500">
            <p>Rua Dr. Teófilo Ribeiro de Andrade, 308</p>
            <p>Edifício Trade Center – Sala 13 - Centro</p>
            <p>São João da Boa Vista - SP - CEP 13870-210</p>
            <p className="mt-1">(19) 3633-5771 | (19) 99119-1186</p>
            <p>contato@KONNEKIT.com.br</p>
            <p>www.KONNEKIT.com.br</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
