import { motion } from "framer-motion";

const stats = [
  { value: "50K+", label: "Books Published", color: "text-primary" },
  { value: "120K+", label: "Active Authors", color: "text-accent" },
  { value: "2M+", label: "Readers Worldwide", color: "text-purple" },
  { value: "98%", label: "Author Satisfaction", color: "text-amber" },
];

const StatsBar = () => (
  <section className="py-12 bg-card border-y border-border">
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <p className={`font-display text-3xl md:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsBar;
