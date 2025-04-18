
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useBranches } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GitBranch,
  ChevronRight,
  PercentSquare,
  Search,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const BranchListPage = () => {
  const { user } = useAuth();
  const { branches } = useBranches();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock rates data
  const branchRates = {
    "1": 5.25,
    "2": 5.25,
    "3": 5.25,
    "4": 5.25,
    "5": 5.25,
    "6": 5.25,
    "7": 5.25,
  };
  
  // Get the current branch and its children
  const currentBranch = branches.find(b => b.id === user?.branchId);
  
  // If parent branch, show direct children
  // If child branch, just show parent and siblings
  const parentId = currentBranch?.parentId || currentBranch?.id;
  const parentBranch = parentId ? branches.find(b => b.id === parentId) : null;
  
  // Get relevant branches based on current user's branch type
  let relevantBranches = [];
  if (currentBranch?.type === "parent") {
    // If parent, show all children
    relevantBranches = branches.filter(b => b.parentId === currentBranch.id);
  } else {
    // If child, show siblings and parent
    relevantBranches = parentBranch 
      ? [parentBranch, ...branches.filter(b => b.parentId === parentBranch.id && b.id !== currentBranch?.id)]
      : [];
  }
  
  // Filter branches by search term
  const filteredBranches = searchTerm 
    ? relevantBranches.filter(branch => 
        branch.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : relevantBranches;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Branch Management</h2>
          <p className="text-gray-500">
            {currentBranch?.type === "parent" 
              ? "Manage your child branches and their rates" 
              : "View your parent branch and sibling branches"}
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search branches..."
              className="w-full sm:w-[250px] pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Branch Hierarchy</CardTitle>
          <CardDescription>
            {currentBranch?.type === "parent" 
              ? "You are viewing child branches under your management" 
              : "You are viewing your parent branch and sibling branches"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch) => (
                <div 
                  key={branch.id} 
                  className="border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${branch.type === "parent" ? "bg-blue-500" : "bg-green-500"} text-white mr-4`}>
                      <GitBranch size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">{branch.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{branch.type} Branch</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex items-center">
                      <PercentSquare size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm">Rate: {branchRates[branch.id as keyof typeof branchRates]}%</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm">Accounts: {branch.type === "parent" ? 12 : 5}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 w-full sm:w-auto">
                    <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                      <Link to={`/branches/${branch.id}/rate`}>
                        View Rate <ChevronRight size={16} className="ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                {searchTerm ? "No branches found matching your search" : "No branches available"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchListPage;
