import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Rocket, Heart, Brain, Landmark, Wand2, Globe2, Lightbulb } from "lucide-react";
import genresVideo from "@/assets/genres-video.mp4";

const genres = [
  { name: "Fiction", icon: BookOpen, color: "bg-coral-light text-coral", border: "border-coral/20" },
  { name: "Sci-Fi", icon: Rocket, color: "bg-purple-light text-purple", border: "border-purple/20" },
  { name: "Romance", icon: Heart, color: "bg-coral-light text-coral", border: "border-coral/20" },
  { name: "Self-Help", icon: Lightbulb, color: "bg-amber-light text-amber", border: "border-amber/20" },
  { name: "History", icon: Landmark, color: "bg-teal-light text-teal", border: "border-teal/20" },
  { name: "Fantasy", icon: Wand2, color: "bg-purple-light text-purple", border: "border-purple/20" },
  { name: "Non-Fiction", icon: Globe2, color: "bg-teal-light text-teal", border: "border-teal/20" },
  { name: "Psychology", icon: Brain, color: "bg-amber-light text-amber", border: "border-amber/20" },
];

const GenresSection = () => (
  <section className="py-20">
    <div className="container">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Explore</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            Browse by Genre
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Discover thousands of books across every genre. From timeless classics to trending new releases.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {genres.map((genre, i) => (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/marketplace?genre=${encodeURIComponent(genre.name)}`}
                  className={`flex items-center gap-3 rounded-xl border ${genre.border} p-3.5 hover:shadow-soft transition-all bg-card`}
                >
                  <div className={`h-9 w-9 rounded-lg ${genre.color} flex items-center justify-center`}>
                    <genre.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm text-foreground">{genre.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-card">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto"
            >
              <source src={genresVideo} type="video/mp4" />
            </video>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default GenresSection;
