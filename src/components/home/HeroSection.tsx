import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroVideo from "@/assets/hero-video.mp4";

const HeroSection = () => (
  <section className="relative overflow-hidden">
    {/* Video background */}
    <div className="absolute inset-0 z-0">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-card/95 via-card/80 to-card/40" />
    </div>

    <div className="container relative z-10 py-20 md:py-32 lg:py-40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 backdrop-blur px-4 py-1.5 text-xs font-semibold text-primary mb-6">
          <Sparkles className="h-3.5 w-3.5" /> #1 Self-Publishing Platform
        </span>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground">
          Publish Your Book.{" "}
          <span className="gradient-gold-text">Reach the World.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
          Write, publish, and sell your books to millions of readers worldwide. eBooks, paperbacks, hardcovers — all from one powerful platform. No gatekeepers. You keep your rights.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
          <Link to="/auth">
            <Button variant="gold" size="lg" className="text-base px-8 gap-2 rounded-full shadow-gold">
              Start Publishing Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/marketplace">
            <Button variant="gold-outline" size="lg" className="text-base px-8 gap-2 rounded-full">
              <BookOpen className="h-4 w-4" /> Browse Books
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-display text-sm font-bold text-primary">50K+</span>
            </div>
            <span className="text-xs text-muted-foreground">Books<br/>Published</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="font-display text-sm font-bold text-accent">120K</span>
            </div>
            <span className="text-xs text-muted-foreground">Active<br/>Authors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-purple/10 flex items-center justify-center">
              <span className="font-display text-sm font-bold text-purple">2M+</span>
            </div>
            <span className="text-xs text-muted-foreground">Readers<br/>Worldwide</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
