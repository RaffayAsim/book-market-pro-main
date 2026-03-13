import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink, BookOpen, Loader2, Globe, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleBookCard } from "@/components/GoogleBookCard";
import { GoogleBookDetailModal } from "@/components/GoogleBookDetailModal";
import { BookGridSkeleton } from "@/components/BookCardSkeleton";
import { useGoogleBooksSearch, type GoogleBook } from "@/services/googleBooks";

const BookSearchPage = () => {
  const [query, setQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);

  const { data: results = [], isLoading, error } = useGoogleBooksSearch(searchTrigger);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchTrigger(query);
  };

  return (
    <div className="py-12">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold mb-4">
            <Globe className="h-3.5 w-3.5" /> Search the World Wide Web
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Find <span className="text-gold">Any Book</span> Ever Published
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Search across millions of books worldwide. Find links, details, and availability for any title — powered by Google Books.
          </p>
        </motion.div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, ISBN, or keyword..."
              className="pl-10 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" variant="gold" size="lg" disabled={isLoading} className="px-8">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 mb-6"
          >
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </motion.div>
        )}

        {!searchTrigger && !isLoading && (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg mb-2">Start your search</p>
            <p className="text-sm max-w-md mx-auto">
              Enter a book title, author name, or keyword above to search millions of books from Google Books.
            </p>
          </div>
        )}

        {isLoading && <BookGridSkeleton count={12} />}

        <AnimatePresence>
          {!isLoading && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {results.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex gap-4 rounded-xl border border-border bg-surface p-4 hover:border-gold/30 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedBook(book)}
                >
                  {book.thumbnail ? (
                    <img
                      src={book.thumbnail}
                      alt={`Cover of ${book.title}`}
                      className="h-28 w-20 rounded-md object-cover flex-shrink-0 bg-muted"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-28 w-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold text-foreground leading-snug line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gold mt-0.5">{book.authors.join(", ")}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {book.publisher}{book.publishedDate && ` · ${book.publishedDate}`}
                      {book.pageCount > 0 && ` · ${book.pageCount} pages`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {book.description || "No description available."}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-1.5 gap-1 text-gold hover:text-gold-light p-0 h-auto text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(book.infoLink, "_blank");
                      }}
                    >
                      View on Google Books <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && searchTrigger && results.length === 0 && !error && (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No books found. Try a different search term.</p>
          </div>
        )}
      </div>

      <GoogleBookDetailModal 
        book={selectedBook} 
        isOpen={!!selectedBook} 
        onClose={() => setSelectedBook(null)} 
      />
    </div>
  );
};

export default BookSearchPage;