import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight, User, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type UserRole = 'author' | 'reader';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>('reader');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    
    if (isSignUp && password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);

    try {
      if (isSignUp) {
        console.log("Attempting signup with:", { email: email.trim().toLowerCase(), role });
        
        // Try to sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: password.trim(),
          options: {
            data: { 
              full_name: fullName.trim() || email.split('@')[0],
              role: role 
            },
          },
        });

        console.log("Signup response:", { signUpData, signUpError });

        if (signUpError) {
          // Handle specific errors
          if (signUpError.message.includes("already registered") || 
              signUpError.message.includes("already exists") ||
              signUpError.message.includes("User already registered")) {
            
            setErrorMessage("This email is already registered. Please sign in instead.");
            setIsSignUp(false);
            setLoading(false);
            return;
          }
          
          throw signUpError;
        }

        // Check if user was created
        if (!signUpData.user) {
          throw new Error("Failed to create user account");
        }

        // If email confirmation is required, show message
        if (signUpData.user.identities && signUpData.user.identities.length === 0) {
          setSuccessMessage("Account created! Please check your email to confirm, or try signing in if you've already confirmed.");
          setLoading(false);
          return;
        }

        // Try to sign in immediately (if auto-confirm is enabled)
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        });

        if (signInError) {
          // User created but needs email confirmation
          setSuccessMessage("Account created! Please check your email to confirm your account before signing in.");
          setIsSignUp(false);
          setLoading(false);
          return;
        }

        // Success! User is signed in
        toast({ 
          title: "Welcome!", 
          description: `Your account has been created as a ${role}.` 
        });
        
        // Redirect based on role
        if (role === 'author') {
          navigate("/author-dashboard");
        } else {
          navigate("/dashboard");
        }
        
      } else {
        // Sign in existing user
        console.log("Attempting signin with:", email.trim().toLowerCase());
        
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email: email.trim().toLowerCase(), 
          password: password.trim() 
        });
        
        console.log("Signin response:", { data, error });

        if (error) {
          if (error.message.includes("Invalid login")) {
            setErrorMessage("Invalid email or password. Please try again.");
          } else if (error.message.includes("Email not confirmed")) {
            setErrorMessage("Please confirm your email address before signing in. Check your inbox!");
          } else {
            setErrorMessage(error.message);
          }
          setLoading(false);
          return;
        }

        if (!data.user) {
          setErrorMessage("Sign in failed. Please try again.");
          setLoading(false);
          return;
        }
        
        toast({ title: "Welcome back!" });
        navigate("/");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmation = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter your email address first");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
      });
      
      if (error) throw error;
      
      setSuccessMessage("Confirmation email resent! Please check your inbox.");
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-4"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="font-display text-2xl font-bold text-foreground">
                BOOK <span className="text-primary">MARKET</span>
              </span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp ? "Start your publishing journey today" : "Sign in to your account"}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-destructive">{errorMessage}</p>
                {errorMessage.includes("confirm your email") && (
                  <button 
                    onClick={resendConfirmation}
                    className="text-xs text-primary hover:underline mt-1"
                  >
                    Resend confirmation email
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name (optional)"
                  className="pl-10 h-12 bg-background border-border"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="pl-10 h-12 bg-background border-border"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                required
                minLength={6}
                className="pl-10 pr-10 h-12 bg-background border-border"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {isSignUp && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">I want to join as:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('reader')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      role === 'reader'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/30 text-muted-foreground'
                    }`}
                  >
                    <BookOpen className="h-6 w-6" />
                    <span className="text-sm font-semibold">Reader</span>
                    <span className="text-xs opacity-70">Discover & read books</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('author')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      role === 'author'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/30 text-muted-foreground'
                    }`}
                  >
                    <User className="h-6 w-6" />
                    <span className="text-sm font-semibold">Author</span>
                    <span className="text-xs opacity-70">Publish & sell books</span>
                  </button>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              variant="gold" 
              className="w-full h-12 gap-2 rounded-full" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign In"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage("");
                setSuccessMessage("");
                setEmail("");
                setPassword("");
                setFullName("");
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
            
            {!isSignUp && (
              <button
                onClick={resendConfirmation}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Didn't receive confirmation email?
              </button>
            )}
          </div>
          
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-800 text-center">
              <strong>Tip:</strong> If you're not receiving emails, try using a Gmail address or check your spam folder.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;