import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Sarah Mitchell", role: "Bestselling Fiction Author", quote: "Book Market transformed my career. I went from querying agents for years to publishing and earning within a week.", avatar: "SM" },
  { name: "David Chen", role: "Self-Help Author", quote: "The dashboard is incredible. I can see every sale, every review, every dollar earned — all in real-time. It's addictive.", avatar: "DC" },
  { name: "Maya Rodriguez", role: "Poetry & Non-Fiction", quote: "No other platform gives you this much control. I set my own prices, keep my rights, and the royalties are unmatched.", avatar: "MR" },
];

const TestimonialsSection = () => (
  <section className="py-20 bg-card border-y border-border">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Authors Love Us</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
          What Our Authors Say
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-background p-6 hover:shadow-card transition-shadow"
          >
            <Quote className="h-8 w-8 text-primary/20 mb-3" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.quote}"</p>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className="h-4 w-4 text-amber fill-amber" />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {t.avatar}
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
