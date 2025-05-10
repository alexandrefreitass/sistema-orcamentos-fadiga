import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KonnekitLogoSimple } from "@/lib/logo";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  Files,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultCollapsed?: boolean;
}

export function Sidebar({
  className,
  defaultCollapsed = false,
  ...props
}: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  React.useEffect(() => {
    // Fechar o menu quando mudar de página em dispositivos móveis
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location, isMobile]);

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  // Para dispositivos móveis, vamos usar um comportamento diferente
  if (isMobile) {
    return (
      <>
        {/* Botão de menu para dispositivos móveis */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-3 left-3 z-50 h-10 w-10 rounded-full bg-white shadow-md"
          onClick={handleToggle}
        >
          <Menu size={20} />
        </Button>

        {/* Menu deslizante para dispositivos móveis */}
        <div 
          className={cn(
            "fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Overlay de fundo */}
          <div 
            className={cn(
              "absolute inset-0 bg-black/50 transition-opacity",
              mobileOpen ? "opacity-100" : "opacity-0"
            )}
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Menu lateral */}
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col h-full">
            <div className="flex h-14 items-center justify-between border-b px-4 py-4">
              <div className="flex items-center">
                <KonnekitLogoSimple />
              </div>
              <Button 
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setMobileOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <nav className="flex flex-col gap-2 p-2">
                <Link href="/">
                  <NavItem 
                    icon={<LayoutDashboard className="h-5 w-5" />} 
                    label="Dashboard" 
                    collapsed={false}
                    active={location === '/'} 
                  />
                </Link>
                <Link href="/products">
                  <NavItem 
                    icon={<Package className="h-5 w-5" />} 
                    label="Produtos" 
                    collapsed={false}
                    active={location === '/products'} 
                  />
                </Link>
                <Link href="/clients">
                  <NavItem 
                    icon={<Users className="h-5 w-5" />} 
                    label="Clientes" 
                    collapsed={false}
                    active={location === '/clients'} 
                  />
                </Link>
                <Link href="/generate-quote">
                  <NavItem 
                    icon={<FileText className="h-5 w-5" />} 
                    label="Gerar Orçamento" 
                    collapsed={false}
                    active={location === '/generate-quote'} 
                  />
                </Link>
                <Link href="/quotes">
                  <NavItem 
                    icon={<Files className="h-5 w-5" />} 
                    label="Orçamentos" 
                    collapsed={false}
                    active={location === '/quotes'} 
                  />
                </Link>
              </nav>
            </ScrollArea>
            <div className="border-t py-4 px-2 text-center text-sm text-gray-500">
              <p>KONNEKIT GESTÃO DE TI</p>
              <p className="text-xs mt-1">v1.0.0</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Versão desktop
  return (
    <div 
      data-collapsed={collapsed} 
      className={cn(
        "group relative h-screen border-r bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-3 py-4">
          <Button 
            variant="ghost"
            size="icon"
            className="h-auto w-auto p-1"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
          </Button>
          {!collapsed && (
            <div className="flex justify-center w-full overflow-hidden">
              <KonnekitLogoSimple />
            </div>
          )}
        </div>
        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-2 p-2">
            <Link href="/">
              <NavItem 
                icon={<LayoutDashboard className="h-5 w-5" />} 
                label="Dashboard" 
                collapsed={collapsed}
                active={location === '/'} 
              />
            </Link>
            <Link href="/products">
              <NavItem 
                icon={<Package className="h-5 w-5" />} 
                label="Produtos" 
                collapsed={collapsed}
                active={location === '/products'} 
              />
            </Link>
            <Link href="/clients">
              <NavItem 
                icon={<Users className="h-5 w-5" />} 
                label="Clientes" 
                collapsed={collapsed}
                active={location === '/clients'} 
              />
            </Link>
            <Link href="/generate-quote">
              <NavItem 
                icon={<FileText className="h-5 w-5" />} 
                label="Gerar Orçamento" 
                collapsed={collapsed}
                active={location === '/generate-quote'} 
              />
            </Link>
            <Link href="/quotes">
              <NavItem 
                icon={<Files className="h-5 w-5" />} 
                label="Orçamentos" 
                collapsed={collapsed}
                active={location === '/quotes'} 
              />
            </Link>
          </nav>
        </ScrollArea>
        <div className="border-t py-4 px-2 text-center text-sm text-gray-500">
          {!collapsed && (
            <>
              <p>KONNEKIT GESTÃO DE TI</p>
              <p className="text-xs mt-1">v1.0.0</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
}

function NavItem({ icon, label, collapsed, active }: NavItemProps) {
  return (
    <button 
      className={cn(
        "flex items-center py-3 px-4 rounded-md text-gray-800 hover:bg-gray-100 transition-colors w-full",
        active && "border-l-4 border-[#a5c52a] bg-opacity-10 bg-[#a5c52a]"
      )}
    >
      <span className="flex items-center">
        <span className={cn(
          active ? "text-[#a5c52a]" : "text-gray-600",
        )}>
          {icon}
        </span>
        {!collapsed && (
          <span className={cn("ml-3", active && "font-medium")}>
            {label}
          </span>
        )}
      </span>
    </button>
  );
}
