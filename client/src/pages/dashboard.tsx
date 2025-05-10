import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getClients, getProducts, getQuotes, calculateQuoteTotals } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Package, Users, FileText, FileBarChart, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { KonnekitLogo } from "@/lib/logo";

type QuoteWithDate = {
  date: string;
  value: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProducts: 0,
    totalQuotes: 0,
    totalValue: 0,
  });
  const [chartData, setChartData] = useState<QuoteWithDate[]>([]);

  useEffect(() => {
    const clients = getClients();
    const products = getProducts();
    const quotes = getQuotes();
    
    const totalValue = quotes.reduce((sum, quote) => {
      const { totalWithLabor } = calculateQuoteTotals(quote);
      return sum + totalWithLabor;
    }, 0);
    
    // Prepare chart data - group by date
    const quotesByDate = new Map<string, number>();
    
    quotes.forEach(quote => {
      const { totalWithLabor } = calculateQuoteTotals(quote);
      const dateStr = formatDate(quote.createdAt).split(' ')[0]; // Get just the date part
      const currentValue = quotesByDate.get(dateStr) || 0;
      quotesByDate.set(dateStr, currentValue + totalWithLabor);
    });
    
    // Convert to array for the chart and sort by date
    const chartDataArray = Array.from(quotesByDate.entries()).map(([date, value]) => ({
      date,
      value
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    // Make sure we have at least 7 data points (for the last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);
    
    const dates: QuoteWithDate[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateStr = formatDate(date).split(' ')[0];
      
      // If we don't have data for this date, add it with 0 value
      if (!quotesByDate.has(dateStr)) {
        dates.push({ date: dateStr, value: 0 });
      }
    }
    
    // Combine existing data with empty dates and sort
    const fullChartData = [...chartDataArray, ...dates]
      .sort((a, b) => a.date.localeCompare(b.date))
      // Remove duplicates (keep the one with value)
      .reduce((acc: QuoteWithDate[], curr) => {
        const existing = acc.find(item => item.date === curr.date);
        if (existing) {
          if (curr.value > 0) {
            existing.value = curr.value;
          }
        } else {
          acc.push(curr);
        }
        return acc;
      }, []);
    
    setChartData(fullChartData);
    
    setStats({
      totalClients: clients.length,
      totalProducts: products.length,
      totalQuotes: quotes.length,
      totalValue,
    });
  }, []);

  // Format currency for chart tooltip
  const formatChartValue = (value: number) => {
    return formatCurrency(value);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Konnekit Gestão de TI</h1>
          <p className="text-gray-600 mt-1">
            Sistema de Orçamento de Equipamentos de Rede
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/generate-quote">
            <Button className="bg-[#a5c52a] hover:bg-[#94b324] text-white">
              Criar Novo Orçamento
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-[#4f94cd]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/clients" className="text-[#4f94cd] hover:underline">
                Ver clientes
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-[#4f94cd]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/products" className="text-[#4f94cd] hover:underline">
                Ver produtos
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Orçamentos Gerados
            </CardTitle>
            <FileText className="h-4 w-4 text-[#4f94cd]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuotes}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/quotes" className="text-[#4f94cd] hover:underline">
                Ver orçamentos
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Total
            </CardTitle>
            <FileBarChart className="h-4 w-4 text-[#4f94cd]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Soma de todos os orçamentos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Valor de Orçamentos por Dia</CardTitle>
          <TrendingUp className="h-4 w-4 text-[#4f94cd]" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-80 w-full p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  tickFormatter={(value) => `R$${value}`}
                />
                <Tooltip 
                  formatter={(value) => [formatChartValue(value as number), "Valor"]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Bar dataKey="value" fill="#4f94cd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
