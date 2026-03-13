import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Mail, Lock, Eye, EyeOff, ArrowRight, User, Loader2 } from "lucide-react";
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
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { 
              full_name: fullName,
              role: role 
            },
          },
        });
        if (error) throw error;
        toast({ 
          title: "Account created!", 
          description: "Check your email to verify your account." 
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Redirect to home after login - dashboard will be accessible via nav for authors
        navigate("/");
      }
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.message, 
        variant: "destructive" 
      });
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  required
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
                placeholder="Password"
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

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;