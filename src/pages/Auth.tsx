import { useState, useEffect } from "react";
import { MnemonicWallet } from '@avalabs/avalanche-wallet-sdk';
// Update this import to match your actual firebase exports.
// For example, if your firebase.ts exports default and named 'db':
// import firebase, { db } from "../firebase";
// Or if it exports an object:
import { auth, db } from "../firebase";
// If your firebase.ts exports 'auth' and 'db' named exports, use the above line.
// Adjust the import according to your actual firebase.ts exports.

// If your firebase.ts exports only 'db', use:
// import { db } from "../firebase";
import { useToast } from "@/components/ui/use-toast";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

// Map Firebase Auth errors to friendly messages
import type { FirebaseError } from "firebase/app";

function getFriendlyAuthError(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) return "An unexpected error occurred. Please try again.";
  const code = (error as FirebaseError).code;
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Invalid email or password. Please try again.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection.";
    case "auth/email-already-in-use":
      return "This email is already in use.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    default:
      return "Authentication failed. Please try again.";
  }
}

const Auth = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [tab, setTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const navigate = useNavigate();

  // Clear email and password from localStorage when signup tab is active or on mount
  useEffect(() => {
    if (tab === 'signup') {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      setEmail('');
      setPassword('');
    }
  }, [tab]);

  const getPasswordStrength = (password: string) => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    if (password.length < 6) return { strength: 'weak', color: 'text-destructive', bg: 'bg-destructive', bar: '33%' };
    if (password.length < 8 || !(hasLower && hasUpper && hasDigit)) 
      return { strength: 'medium', color: 'text-yellow-600', bg: 'bg-yellow-500', bar: '66%' };
    if (hasLower && hasUpper && hasDigit && hasSpecial)
      return { strength: 'strong', color: 'text-green-600', bg: 'bg-green-500', bar: '100%' };
    // 8+ chars but missing special char: still medium
    return { strength: 'medium', color: 'text-yellow-600', bg: 'bg-yellow-500', bar: '66%' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (tab === "signup") {
        // Signup with Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Generate Avalanche mnemonic wallet
        const mnemonic = MnemonicWallet.generateMnemonicPhrase();
        const wallet = MnemonicWallet.fromMnemonic(mnemonic);
        const addressC = wallet.getAddressC();

        // Save user and wallet info to Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          createdAt: new Date().toISOString(),
          tokensEarned: 0,
          booksRead: 0,
          dayStreak: 0,
          walletAddress: addressC,
          walletMnemonic: mnemonic
        });
        navigate("/bible");
      } else {
        // Signin with Firebase
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/bible");
      }
    } catch (err: unknown) {
      toast({
        title: "Authentication failed",
        description: getFriendlyAuthError(err),
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  // Google sign-in
  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString()
      }, { merge: true });
      navigate("/bible");
    } catch (err: unknown) {
      toast({
        title: "Google sign-in failed",
        description: getFriendlyAuthError(err),
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">FaithChain</CardTitle>
          <CardDescription>Earn While You Grow Spiritually</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full" value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-xl text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
                <Button type="button" variant="outline" className="w-full flex items-center gap-2" onClick={handleGoogle} disabled={isLoading}>
                  <FcGoogle className="w-5 h-5" />
                  Sign In with Google
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="Enter your name" required value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-xl text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowSignupPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showSignupPassword ? <HiEyeOff /> : <HiEye />}
                  </button>
                  {password && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.bg}`}
                            style={{ width: passwordStrength.bar }}
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
                <Button type="button" variant="outline" className="w-full flex items-center gap-2" onClick={handleGoogle} disabled={isLoading}>
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