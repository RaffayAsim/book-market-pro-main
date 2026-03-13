import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="py-20">
    <div className="container">
      <div className="rounded-3xl bg-gradient-to-br from-primary to-gold-dark p-10 md:p-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(0_0%_100%/0.1),transparent_60%)]" />
        <div className="relative z-10">
          <BookOpen className="h-12 w-12 text-primary-foreground/80 mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Publish Your Book?
          </h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 text-lg">
            Join thousands of authors. Start for $12/month or save with our annual plan at $59/year.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/pricing">
              <Button size="lg" className="text-base px-10 gap-2 rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                View Plans <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="text-base px-10 rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CTASection;
