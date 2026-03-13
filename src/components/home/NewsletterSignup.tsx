import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: email.trim().toLowerCase() });

      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already subscribed!", description: "This email is already on our list." });
        } else {
          throw error;
        }
      } else {
        setSubscribed(true);
        toast({ title: "Subscribed!", description: "You'll receive book recommendations soon." });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="rounded-2xl border border-accent/20 bg-teal-light p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-3" />
        <h3 className="font-display text-xl font-bold text-foreground mb-1">You're In!</h3>
        <p className="text-sm text-muted-foreground">Watch your inbox for curated book picks every week.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/10 bg-coral-light p-8">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="h-5 w-5 text-primary" />
        <h3 className="font-display text-xl font-bold text-foreground">Weekly Book Picks</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Get handpicked book recommendations, new releases, and author spotlights delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="h-11 bg-card border-border flex-1"
        />
        <Button type="submit" variant="gold" className="h-11 px-5 rounded-full gap-1.5 shrink-0" disabled={loading}>
          {loading ? "..." : "Subscribe"} <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
      <p className="text-[11px] text-muted-foreground mt-3">No spam. Unsubscribe anytime.</p>
    </div>
  );
};

export default NewsletterSignup;
