import { motion } from "framer-motion";
import { Upload, CheckCircle2, DollarSign } from "lucide-react";

const steps = [
  { step: "01", title: "Upload Your Manuscript", desc: "Drop your manuscript, add a cover image, set your genre, price, and available formats.", icon: Upload, color: "bg-coral-light text-coral" },
  { step: "02", title: "We Review & Approve", desc: "Our team reviews your submission for quality. Most books are approved within 24 hours.", icon: CheckCircle2, color: "bg-teal-light text-teal" },
  { step: "03", title: "Earn From Every Sale", desc: "Your book goes live on the marketplace. Track sales, reviews, and revenue in real-time.", icon: DollarSign, color: "bg-amber-light text-amber" },
];

const HowItWorks = () => (
  <section className="py-20">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-xs font-semibold text-accent uppercase tracking-wider">Simple Process</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
          Publish in 3 Easy Steps
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center rounded-2xl border border-border bg-card p-8 hover:shadow-card transition-shadow"
          >
            <div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-5`}>
              <item.icon className="h-7 w-7" />
            </div>
            <span className="font-display text-4xl font-bold gradient-gold-text">{item.step}</span>
            <h3 className="font-display text-xl font-semibold text-foreground mt-3 mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
