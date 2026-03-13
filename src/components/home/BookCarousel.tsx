import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  rating: number;
  genre: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const BookCard = ({ book, index }: { book: Book; index: number }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    custom={index}
    variants={fadeUp}
    className="group cursor-pointer"
  >
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:shadow-card hover:border-primary/20">
      <div className="aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider mb-2">
          {book.genre}
        </span>
        <h3 className="font-display text-sm font-semibold text-foreground leading-tight line-clamp-1">{book.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
        <div className="flex items-center gap-1 mt-2">
          <Star className="h-3 w-3 text-amber fill-amber" />
          <span className="text-xs font-medium text-amber">{book.rating}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

interface BookCarouselProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  books: Book[];
}

const BookCarousel = ({ title, subtitle, icon, books }: BookCarouselProps) => (
  <section className="py-16">
    <div className="container">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">{subtitle}</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">{title}</h2>
        </div>
        <Link to="/marketplace">
          <Button variant="ghost" className="text-primary hover:text-primary/80 gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {books.map((book, i) => (
          <BookCard key={book.id} book={book} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default BookCarousel;
