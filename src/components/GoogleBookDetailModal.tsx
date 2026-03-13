import { motion, AnimatePresence } from "framer-motion";
import { X, Star, BookOpen, ExternalLink, Calendar, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GoogleBook } from "@/services/googleBooks";

interface GoogleBookDetailModalProps {
  book: GoogleBook | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleBookDetailModal = ({ book, isOpen, onClose }: GoogleBookDetailModalProps) => {
  if (!book) return null;

  const genre = book.categories[0] || "Fiction";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 max-h-[90vh] overflow-y-auto shadow-card"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase">
                {genre}
              </span>
              <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {book.thumbnail ? (
                <img 
                  src={book.thumbnail} 
                  alt={book.title} 
                  className="h-56 w-40 rounded-lg object-cover shadow-soft flex-shrink-0 mx-auto md:mx-0"
                />
              ) : (
                <div className="h-56 w-40 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {book.title}
                </h2>
                <p className="text-primary font-medium mb-3">{book.authors.join(", ")}</p>
                
                {book.averageRating > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.round(book.averageRating) ? "text-amber fill-amber" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-amber">{book.averageRating.toFixed(1)}</span>
                    {book.ratingsCount > 0 && (
                      <span className="text-sm text-muted-foreground">({book.ratingsCount.toLocaleString()} reviews)</span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  {book.publisher && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{book.publisher}</span>
                    </div>
                  )}
                  {book.publishedDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{book.publishedDate}</span>
                    </div>
                  )}
                  {book.pageCount > 0 && (
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{book.pageCount} pages</span>
                    </div>
                  )}
                </div>

                {book.categories.length > 1 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {book.categories.slice(1).map((cat, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {book.description && (
              <div className="mb-6">
                <h3 className="font-display font-semibold text-foreground mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
                  {book.description}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              {book.webReaderLink ? (
                <Button 
                  variant="gold" 
                  className="flex-1 gap-2 rounded-full"
                  onClick={() => window.open(book.webReaderLink!, "_blank")}
                >
                  <BookOpen className="h-4 w-4" /> Read Preview
                </Button>
              ) : (
                <Button 
                  variant="gold" 
                  className="flex-1 gap-2 rounded-full"
                  onClick={() => window.open(book.infoLink, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" /> View on Google Books
                </Button>
              )}
              <Button 
                variant="outline" 
                className="flex-1 gap-2 rounded-full"
                onClick={() => window.open(book.infoLink, "_blank")}
              >
                <ExternalLink className="h-4 w-4" /> More Info
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};