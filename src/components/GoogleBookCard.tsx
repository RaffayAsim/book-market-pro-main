import { motion } from "framer-motion";
import { Star, BookOpen, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GoogleBook } from "@/services/googleBooks";

interface GoogleBookCardProps {
  book: GoogleBook;
  index?: number;
  onClick?: (book: GoogleBook) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      delay: i * 0.05, 
      duration: 0.5, 
      ease: [0.25, 0.1, 0.25, 1] as const 
    },
  }),
};

export const GoogleBookCard = ({ book, index = 0, onClick }: GoogleBookCardProps) => {
  const genre = book.categories[0] || "Fiction";
  const hasRating = book.averageRating > 0;
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      custom={index}
      variants={fadeUp}
      className="group cursor-pointer h-full"
      onClick={() => onClick?.(book)}
    >
      <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-500 hover:shadow-gold hover:border-primary/30 hover:-translate-y-2">
        {/* Cover Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          {book.thumbnail ? (
            <img
              src={book.thumbnail}
              alt={`Cover of ${book.title}`}
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/80 p-4">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <span className="text-xs text-muted-foreground text-center">No Cover Available</span>
            </div>
          )}
          
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Rating Badge */}
          {hasRating && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-amber/90 backdrop-blur-sm px-2 py-1 shadow-lg">
              <Star className="h-3 w-3 text-white fill-white" />
              <span className="text-xs font-bold text-white">{book.averageRating.toFixed(1)}</span>
            </div>
          )}

          {/* Free Badge */}
          {book.isAvailableForFree && (
            <div className="absolute top-3 left-3 rounded-full bg-accent/90 backdrop-blur-sm px-2 py-1 shadow-lg">
              <span className="text-[10px] font-bold text-white uppercase">Free</span>
            </div>
          )}

          {/* Quick View Button - Appears on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Button 
                variant="gold" 
                size="sm" 
                className="gap-2 rounded-full shadow-gold px-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.(book);
                }}
              >
                <Eye className="h-4 w-4" /> Quick View
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Genre Tag */}
          <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider mb-2">
            {genre}
          </span>
          
          {/* Title */}
          <h3 className="font-display text-sm font-semibold text-foreground leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors duration-300">
            {book.title}
          </h3>
          
          {/* Author */}
          <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{book.authors.join(", ")}</p>
          
          {/* Footer Info */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            {book.pageCount > 0 ? (
              <span className="text-[10px] text-muted-foreground">{book.pageCount} pages</span>
            ) : (
              <span className="text-[10px] text-muted-foreground">{book.publishedDate?.split('-')[0] || 'Unknown'}</span>
            )}
            
            {!hasRating && (
              <span className="text-[10px] text-muted-foreground/60">No ratings</span>
            )}
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-gold to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </motion.div>
  );
};