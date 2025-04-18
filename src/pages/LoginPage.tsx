
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth, useBranches } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const LoginPage = () => {
  const { user, login, isLoading } = useAuth();
  const { branches } = useBranches();
  const navigate = useNavigate();
  const [branchId, setBranchId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await login(branchId, password);
      toast.success("Logged in successfully");
      navigate("/home");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to login");
      toast.error("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <GitBranch size={24} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Branch Login</CardTitle>
            <p className="text-sm text-gray-500">
              Sign in to your branch account
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name} ({branch.type === 'parent' ? 'Parent' : 'Child'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••"
                />
                <p className="text-xs text-gray-500">
                  For demo purposes, any password will work
                </p>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !branchId}
              >
                {isLoading ? 
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                    <span>Logging in...</span>
                  </div> 
                  : "Sign in"
                }
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <p className="text-xs text-center text-gray-500 w-full">
              This is a demo application. Select any branch and use any password to login.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
