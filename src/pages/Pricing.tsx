import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Monthly",
    price: "$12",
    period: "/month",
    highlight: false,
    features: [
      "Unlimited eBook publishing",
      "DRM-protected reader",
      "Author dashboard & analytics",
      "Paperback & hardcover via Lulu",
      "AI Narrator add-on available",
      "Cancel anytime",
    ],
  },
  {
    name: "Annual",
    price: "$59",
    period: "/year",
    highlight: true,
    badge: "Save 59%",
    features: [
      "Everything in Monthly",
      "Priority book review",
      "Featured author badge",
      "Advanced sales analytics",
      "AI Narrator add-on available",
      "Best value for serious authors",
    ],
  },
];

const Pricing = () => {
  return (
    <div className="py-20">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent <span className="text-gold">Pricing</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Everything you need to publish, sell, and grow — one subscription, no hidden fees.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-2xl border p-8 ${
                plan.highlight
                  ? "border-gold/40 bg-gold/5 shadow-gold"
                  : "border-border bg-surface"
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-bold text-primary-foreground">
                  <Sparkles className="h-3 w-3" /> {plan.badge}
                </span>
              )}
              <h3 className="font-display text-xl font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-gold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlight ? "gold" : "gold-outline"}
                className="w-full mt-8"
                size="lg"
              >
                Get Started
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          AI Book Narration is available as an add-on for readers at an additional fee per book.
        </motion.p>
      </div>
    </div>
  );
};

export default Pricing;
