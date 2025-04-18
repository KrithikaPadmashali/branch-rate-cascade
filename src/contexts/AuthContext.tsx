
import React, { createContext, useState, useContext, useEffect } from "react";

type BranchType = "parent" | "child";

interface Branch {
  id: string;
  name: string;
  type: BranchType;
  parentId: string | null;
}

interface User {
  id: string;
  branchId: string;
  branch: Branch;
}

interface AuthContextType {
  user: User | null;
  login: (branchId: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock branches data
const mockBranches: Branch[] = [
  { id: "1", name: "Head Office", type: "parent", parentId: null },
  { id: "2", name: "North Region", type: "parent", parentId: "1" },
  { id: "3", name: "South Region", type: "parent", parentId: "1" },
  { id: "4", name: "North City Branch", type: "child", parentId: "2" },
  { id: "5", name: "North Town Branch", type: "child", parentId: "2" },
  { id: "6", name: "South City Branch", type: "child", parentId: "3" },
  { id: "7", name: "South Town Branch", type: "child", parentId: "3" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (branchId: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // In a real app, you would validate credentials against a backend
    // For this demo, we'll just check if the branch exists
    const branch = mockBranches.find(b => b.id === branchId);
    
    if (!branch) {
      setIsLoading(false);
      throw new Error("Invalid branch ID");
    }

    // Mock successful login
    const loggedInUser = {
      id: `user-${Date.now()}`,
      branchId: branch.id,
      branch: branch
    };
    
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setIsLoading(false);
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
  return { branches: mockBranches };
};
