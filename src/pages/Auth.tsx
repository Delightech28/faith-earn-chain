import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const getPasswordStrength = (password: string) => {
    if (password.length < 6) return { strength: 'weak', color: 'text-red-500', bg: 'bg-red-500' };
    if (password.length < 10 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) 
      return { strength: 'medium', color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { strength: 'strong', color: 'text-green-500', bg: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication - in real app, this would connect to backend
    setTimeout(() => {
      localStorage.setItem("faithchain_user", "authenticated");
      navigate("/bible");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">FaithChain</CardTitle>
          <CardDescription>Earn While You Grow Spiritually</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
                <Button type="button" variant="outline" className="w-full flex items-center gap-2">
                  <FcGoogle className="w-5 h-5" />
                  Sign In with Google
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="Enter your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="Enter your email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    placeholder="Create a password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  {password && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${passwordStrength.bg}`}
                            style={{ 
                              width: password.length < 6 ? '33%' : password.length < 10 ? '66%' : '100%' 
                            }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${passwordStrength.color}`}>
                          {passwordStrength.strength}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
                <Button type="button" variant="outline" className="w-full flex items-center gap-2">
                  <FcGoogle className="w-5 h-5" />
                  Sign Up with Google
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;