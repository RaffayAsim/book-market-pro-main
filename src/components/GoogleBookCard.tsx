import { motion } from "framer-motion";
import { Star, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GoogleBook } from "@/services/googleBooks";

interface GoogleBookCardProps {
  book: GoogleBook;
  index?: number;
  onClick?: (book: GoogleBook) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export const GoogleBookCard = ({ book, index = 0, onClick }: GoogleBookCardProps) => {
  const genre = book.categories[0] || "Fiction";
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      custom={index}
      variants={fadeUp}
      className="group cursor-pointer"
      onClick={() => onClick?.(book)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:shadow-card hover:border-primary/20">
        <div className="aspect-[2/3] overflow-hidden bg-muted">
          {book.thumbnail ? (
            <img
              src={book.thumbnail}
              alt={`Cover of ${book.title}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="p-3">
          <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider mb-1.5 line-clamp-1">
            {genre}
          </span>
          <h3 className="font-display text-sm font-semibold text-foreground leading-tight line-clamp-1">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{book.authors.join(", ")}</p>
          {book.averageRating > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="h-3 w-3 text-amber fill-amber" />
              <span className="text-xs font-medium text-amber">{book.averageRating.toFixed(1)}</span>
              {book.ratingsCount > 0 && (
                <span className="text-[10px] text-muted-foreground">({book.ratingsCount})</span>
              )}
            </div>
          )}
          <div className="mt-3">
            <Button 
              variant="gold" 
              size="sm" 
              className="h-7 w-full text-xs gap-1 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(book);
              }}
            >
              <ExternalLink className="h-3 w-3" /> View Details
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};