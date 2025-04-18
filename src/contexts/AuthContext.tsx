
import React, { createContext, useState, useContext, useEffect } from "react";

interface Account {
  id: number;
  name: string;
  rate: number;
  branch: Branch;
}

interface Branch {
  id: number;
  name: string;
  rate: number;
  parent: Branch | null;
  children: Branch[];
  accounts: Account[];
}

interface User {
  id: number;
  branchId: number;
  branch: Branch;
}

interface AuthContextType {
  user: User | null;
  login: (branchId: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:8080/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (branchId: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Fetch branch details from your API
      const response = await fetch(`${API_BASE_URL}/branches`);
      const branches: Branch[] = await response.json();
      
      const branch = branches.find(b => b.id.toString() === branchId);
      
      if (!branch) {
        throw new Error("Invalid branch ID");
      }

      // In a real app, you would validate credentials against your backend
      // For now, we'll just create a user object based on the branch
      const loggedInUser = {
        id: Date.now(),
        branchId: branch.id,
        branch: branch
      };
      
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    } catch (error) {
      throw new Error("Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useBranches = () => {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/branches`);
        const data = await response.json();
        setBranches(data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
  }, []);

  return { branches };
};

