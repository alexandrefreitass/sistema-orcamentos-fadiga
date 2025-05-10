import React from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar defaultCollapsed={isMobile} />
      <main className={cn(
        "flex-1 overflow-auto",
        isMobile ? "pt-16 px-4 pb-4" : "p-4 md:p-6"
      )}>
        {children}
      </main>
    </div>
  );
}

// Importar a função cn para composição de classes
import { cn } from "@/lib/utils";
