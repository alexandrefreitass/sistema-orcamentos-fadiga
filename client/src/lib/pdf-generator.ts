import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Quote } from './types';
import { formatCurrency, formatMonthlyService, getCurrentFormattedDate } from './utils';
import logoHorizontal from "@assets/LOGO-KONNEKIT-DEITADO.png";

export const generateQuotePDF = async (quote: Quote): Promise<void> => {
  // Create a new jsPDF instance
  const pdf = new jsPDF('p', 'mm', 'a4');
  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();

  // Create a temporary div for the PDF content
  const element = document.createElement('div');
  document.body.appendChild(element);

  // Setup PDF content with styling
  element.innerHTML = `
    <div id="pdf-content" style="padding: 20px; font-family: 'Inter', Arial, sans-serif; width: 210mm;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div>
          <img src="${logoHorizontal}" alt="KONNEKIT GESTÃO DE TI" style="height: 70px;" />
        </div>
        <div style="text-align: right; margin-top: 10px;">
          <h2 style="font-size: 18px; font-weight: bold; margin: 0;">ORÇAMENTO DE EQUIPAMENTOS DE REDE</h2>
          <p style="font-size: 16px; margin: 5px 0;">${quote.client.name}</p>
          <p style="font-size: 12px; margin-top: 15px;">${getCurrentFormattedDate()}</p>
        </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; text-align: center; font-size: 12px; font-weight: bold; border: 1px solid #e5e7eb; width: 120px;">IMAGEM</th>
            <th style="padding: 10px; text-align: center; font-size: 12px; font-weight: bold; border: 1px solid #e5e7eb;">PRODUTO</th>
            <th style="padding: 10px; text-align: center; font-size: 12px; font-weight: bold; border: 1px solid #e5e7eb;">VALOR UNITÁRIO</th>
            <th style="padding: 10px; text-align: center; font-size: 12px; font-weight: bold; border: 1px solid #e5e7eb;">QTD</th>
            <th style="padding: 10px; text-align: right; font-size: 12px; font-weight: bold; border: 1px solid #e5e7eb;">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${quote.items.map(item => `
            <tr>
              <td style="padding: 15px; font-size: 12px; border: 1px solid #e5e7eb; width: 120px; text-align: center; vertical-align: middle;">
                ${item.product.imageUrl ? 
                  `<img src="${item.product.imageUrl}" alt="" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;" />` 
                : 
                  `<div style="width: 100px; height: 100px; background-color: #f3f4f6; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; color: #9ca3af;">Sem imagem</div>`
                }
              </td>
              <td style="padding: 10px; font-size: 12px; border: 1px solid #e5e7eb; text-align: center;">${item.product.description}</td>
              <td style="padding: 10px; font-size: 12px; border: 1px solid #e5e7eb; text-align: center;">${formatCurrency(item.unitPrice)}</td>
              <td style="padding: 10px; font-size: 12px; text-align: center; border: 1px solid #e5e7eb;">${item.quantity}</td>
              <td style="padding: 10px; font-size: 12px; text-align: right; border: 1px solid #e5e7eb;">${formatCurrency(item.quantity * item.unitPrice)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="display: flex; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
        <div style="flex: 1;">
          <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">Observações:</h3>
          <p style="font-size: 12px; color: #4b5563;">Este orçamento tem validade de 30 dias.</p>
          <p style="font-size: 12px; color: #000000; margin-top: 12px; font-weight: bold;">Monitoramento, suporte e manutenção mensal: ${formatMonthlyService(quote.monthlyService)}</p>
        </div>
        <div style="flex-basis: 33%; border: 1px solid #e5e7eb; padding: 15px; background-color: #f9fafb; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 12px;">Total Produtos:</span>
            <span style="font-size: 12px; font-weight: 500;">${formatCurrency(quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0))}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 12px;">Mão de Obra:</span>
            <span style="font-size: 12px; font-weight: 500;">${formatCurrency(quote.laborCost)}</span>
          </div>
          <div style="border-top: 1px solid #e5e7eb; margin-top: 8px; padding-top: 8px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 500;">TOTAL GERAL:</span>
              <span style="font-weight: 500;">${formatCurrency(quote.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) + quote.laborCost)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div style="margin-top: 120px; border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center; font-size: 10px; color: #6b7280;">
        <p style="margin: 2px 0;">Rua Dr. Teófilo Ribeiro de Andrade, 308</p>
        <p style="margin: 2px 0;">Edifício Trade Center – Sala 13 - Centro</p>
        <p style="margin: 2px 0;">São João da Boa Vista - SP - CEP 13870-210</p>
        <p style="margin: 2px 0;">(19) 3633-5771 | (19) 99119-1186</p>
        <p style="margin: 2px 0;">contato@KONNEKIT.com.br</p>
        <p style="margin: 2px 0;">www.KONNEKIT.com.br</p>
      </div>
    </div>
  `;

  try {
    // Convert HTML to Canvas
    const canvas = await html2canvas(element.querySelector('#pdf-content') as HTMLElement, {
      scale: 1.5, // Increase quality
    });

    // Add the canvas as an image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, width, 0, undefined, 'FAST');

    // Save the PDF with standardized name
    pdf.save(`Orçamento de Equipamentos de Rede - ${quote.client.name}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    // Remove the temporary element
    document.body.removeChild(element);
  }
};
