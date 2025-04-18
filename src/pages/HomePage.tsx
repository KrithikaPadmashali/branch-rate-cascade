
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, PercentSquare, ArrowRight, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user } = useAuth();

  // Mock data
  const currentRate = 5.25;
  const childBranchesCount = user?.branch.type === "parent" ? 2 : 0;
  const accountsCount = user?.branch.type === "parent" ? 12 : 5;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome to {user?.branch.name}
        </h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Rate</CardTitle>
            <PercentSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentRate}%</div>
            <p className="text-xs text-muted-foreground">
              Last updated: Today
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Branch Type</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{user?.branch.type}</div>
            <p className="text-xs text-muted-foreground">
              {user?.branch.type === "parent" ? "Has child branches" : "No child branches"}
            </p>
          </CardContent>
        </Card>
        
        {user?.branch.type === "parent" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Child Branches</CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{childBranchesCount}</div>
              <p className="text-xs text-muted-foreground">
                Under your management
              </p>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountsCount}</div>
            <p className="text-xs text-muted-foreground">
              Active accounts in branch
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rate Management</CardTitle>
            <CardDescription>
              View and update branch rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Branch Rate</p>
                <p className="text-2xl font-bold">{currentRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <Button asChild className="w-full">
              <Link to={`/branches/${user?.branch.id}/rate`}>
                Manage Rate <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Branch Structure</CardTitle>
            <CardDescription>
              View branch hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user?.branch.type === "parent" ? "Manage Child Branches" : "View Parent Branch"}</p>
                <p className="text-lg font-medium">{user?.branch.name}</p>
              </div>
              <GitBranch className="h-8 w-8 text-blue-500" />
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/branches">
                View Branches <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
