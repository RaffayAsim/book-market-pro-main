import { motion } from "framer-motion";
import { PenTool, Globe, Shield, Zap } from "lucide-react";

const features = [
  { icon: PenTool, title: "Write & Publish", description: "Upload your manuscript, set your cover, choose formats — publish in minutes, not months.", color: "bg-coral-light text-coral" },
  { icon: Globe, title: "Global Reach", description: "Your books are instantly available to readers worldwide in eBook, paperback, and hardcover.", color: "bg-teal-light text-teal" },
  { icon: Shield, title: "You Own Everything", description: "Keep 100% of your rights. Set your own prices. We never lock you into exclusivity.", color: "bg-purple-light text-purple" },
  { icon: Zap, title: "Instant Royalties", description: "Track every sale in real-time from your dashboard. Get paid fast with transparent royalties.", color: "bg-amber-light text-amber" },
];

const FeaturesSection = () => (
  <section className="py-20 bg-card border-y border-border">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Why Book Market</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
          Everything You Need to Publish
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mt-3">
          From manuscript to marketplace in minutes. We handle the tech so you can focus on writing.
        </p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-background p-6 hover:shadow-card transition-shadow"
          >
            <div className={`h-12 w-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
