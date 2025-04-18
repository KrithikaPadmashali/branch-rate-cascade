import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, useBranches } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GitBranch, AlertTriangle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface BranchWithRate {
  id: string;
  name: string;
  type: string;
  parentId: string | null;
  rate: number;
}

const BranchRatePage = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const { user } = useAuth();
  const { branches } = useBranches();
  const navigate = useNavigate();
  
  const [currentRate, setCurrentRate] = useState<number>(5.25);
  const [newRate, setNewRate] = useState<string>("5.25");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [affectedBranches, setAffectedBranches] = useState<BranchWithRate[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  
  const branch = branches.find(b => b.id === branchId);
  
  const canModifyRate = user?.branch.type === "parent" || user?.branchId === branchId;
  
  useEffect(() => {
    if (branch) {
      setNewRate(currentRate.toString());
    }
  }, [branch, currentRate]);
  
  const findChildBranches = (parentId: string): BranchWithRate[] => {
    const children = branches.filter(b => b.parentId === parentId).map(b => ({
      ...b,
      rate: currentRate,
    }));
    
    return [
      ...children,
      ...children.flatMap(child => findChildBranches(child.id))
    ];
  };
  
  const handleUpdateRate = async () => {
    const parsedRate = parseFloat(newRate);
    
    if (isNaN(parsedRate) || parsedRate < 0) {
      toast.error("Please enter a valid rate");
      return;
    }
    
    if (branch) {
      const affected = findChildBranches(branch.id).map(b => ({
        ...b,
        rate: parsedRate,
      }));
      
      setAffectedBranches([
        {
          ...branch,
          rate: parsedRate,
          type: branch.parent ? "child" : "parent"
        },
        ...affected
      ]);
      
      setIsConfirmDialogOpen(true);
    }
  };
  
  const confirmRateUpdate = async () => {
    setIsUpdating(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/rate/${branchId}?rate=${parseFloat(newRate)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update rate');
      }

      setCurrentRate(parseFloat(newRate));
      setIsConfirmDialogOpen(false);
      setIsSuccessful(true);
      
      setTimeout(() => {
        setIsSuccessful(false);
        toast.success(`Rate updated successfully to ${newRate}%`);
      }, 2000);
    } catch (error) {
      toast.error('Failed to update rate');
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (!branch) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Branch Not Found</h2>
        <p className="text-gray-500 mb-6">The branch you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/branches")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Branches
        </Button>
      </div>
    );
  }
  
  if (isSuccessful) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Rate Updated!</h2>
          <p className="text-gray-500 mb-6">The new rate has been applied to all affected branches.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate("/branches")} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Branch Rate</h2>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${branch.type === "parent" ? "bg-blue-500" : "bg-green-500"} text-white`}>
              <GitBranch size={24} />
            </div>
            <div>
              <CardTitle className="text-xl">{branch.name}</CardTitle>
              <p className="text-sm text-gray-500 capitalize">{branch.type} Branch</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Current Rate</Label>
            <div className="text-3xl font-bold">{currentRate}%</div>
            <p className="text-sm text-gray-500">
              This rate affects {branch.type === "parent" 
                ? "this branch and all child branches" 
                : "only this branch"}
            </p>
          </div>
          
          {canModifyRate && (
            <div className="pt-4 border-t space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-rate">New Rate</Label>
                <div className="flex space-x-4">
                  <div className="relative flex-1">
                    <Input
                      id="new-rate"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newRate}
                      onChange={(e) => setNewRate(e.target.value)}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                  </div>
                  <Button onClick={handleUpdateRate}>
                    Update Rate
                  </Button>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important</p>
                    <p>Updating the rate for this branch will affect all child branches that inherit this rate.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!canModifyRate && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Permission Notice</p>
                  <p>You don't have permission to modify the rate for this branch. Only parent branches or branch administrators can change rates.</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Rate Update</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to update the rate from {currentRate}% to {newRate}%.
              This will affect the following {affectedBranches.length} branch(es):
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="max-h-60 overflow-auto py-2">
            {affectedBranches.map(branch => (
              <div key={branch.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center">
                  <GitBranch size={16} className="mr-2 text-gray-500" />
                  <span>{branch.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500">{currentRate}%</span>
                  <ArrowRight size={16} className="mx-2 text-gray-400" />
                  <span className="font-medium">{parseFloat(newRate)}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isUpdating} onClick={confirmRateUpdate}>
              {isUpdating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                  Updating...
                </>
              ) : (
                "Confirm Update"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BranchRatePage;
