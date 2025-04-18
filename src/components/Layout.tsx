
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  Home, 
  GitBranch, 
  PercentSquare, 
  Menu, 
  LogOut, 
  ChevronDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const navItems = [
    { path: "/home", label: "Dashboard", icon: <Home size={18} /> },
    { path: "/branches", label: "Branches", icon: <GitBranch size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-gray-200 transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            {sidebarOpen && (
              <h1 className="text-xl font-semibold text-gray-800">BranchRate</h1>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </Button>
          </div>

          <div className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <div className="mr-3">{item.icon}</div>
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            {sidebarOpen ? (
              <div className="flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    {user?.branch.name.charAt(0)}
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-700 truncate">{user?.branch.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.branch.type === "parent" ? "Parent Branch" : "Child Branch"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut size={20} />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-800">
              {location.pathname === "/home" && "Dashboard"}
              {location.pathname === "/branches" && "Branch Management"}
              {location.pathname.includes("/rate") && "Rate Management"}
            </h1>
          </div>
          <div className="flex items-center">
            <div className="text-right mr-4">
              <p className="text-sm font-medium text-gray-700">{user?.branch.name}</p>
              <p className="text-xs text-gray-500">
                {user?.branch.type === "parent" ? "Parent Branch" : "Child Branch"}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
              {user?.branch.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
