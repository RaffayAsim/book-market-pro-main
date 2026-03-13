import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink, BookOpen, Loader2, Globe, AlertTriangle, Sparkles, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleBookCard } from "@/components/GoogleBookCard";
import { GoogleBookDetailModal } from "@/components/GoogleBookDetailModal";
import { BookGridSkeleton } from "@/components/BookCardSkeleton";
import { useGoogleBooksSearch, useFeaturedBooks, type GoogleBook } from "@/services/googleBooks";

const popularSearches = ["Harry Potter", "The Great Gatsby", "Dune", "Atomic Habits", "1984", "Pride and Prejudice"];

const BookSearchPage = () => {
  const [query, setQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState("");
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);

  const { data: results = [], isLoading, error } = useGoogleBooksSearch(searchTrigger);
  
  // Show featured books when no search
  const { data: defaultBooks = [], isLoading: defaultLoading } = useFeaturedBooks();

  const displayBooks = searchTrigger ? results : defaultBooks;
  const loading = searchTrigger ? isLoading : defaultLoading;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchTrigger(query);
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
    setSearchTrigger(term);
  };

  return (
    <div className="py-12">
      <div className="container max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold mb-4">
            <Globe className="h-3.5 w-3.5" /> Search the World Wide Web
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Find <span className="gradient-gold-text">Any Book</span> Ever Published
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Search across millions of books worldwide. Find links, details, and availability for any title — powered by Google Books.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSearch} 
          className="max-w-2xl mx-auto mb-6"
        >
          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, ISBN, or keyword..."
                className="pl-12 h-14 bg-card border-border text-foreground placeholder:text-muted-foreground rounded-full shadow-soft focus:shadow-gold transition-shadow text-base"
              />
            </div>
            <Button type="submit" variant="gold" size="lg" disabled={isLoading} className="px-8 rounded-full h-14">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
            </Button>
          </div>
        </motion.form>

        {/* Popular Searches */}
        {!searchTrigger && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            <span className="text-xs text-muted-foreground mr-2 py-2">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularSearch(term)}
                className="text-xs px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                {term}
              </button>
            ))}
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 mb-6 max-w-2xl mx-auto"
            >
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Title */}
        <AnimatePresence mode="wait">
          {!loading && displayBooks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-2">
                {searchTrigger ? (
                  <>
                    <Search className="h-4 w-4 text-primary" />
                    <h2 className="font-display text-xl font-semibold">Search Results</h2>
                  </>
                ) : (
                  <>
                    <Library className="h-4 w-4 text-primary" />
                    <h2 className="font-display text-xl font-semibold">Featured Collection</h2>
                  </>
                )}
                <span className="text-sm text-muted-foreground">({displayBooks.length} books)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BookGridSkeleton count={12} />
            </motion.div>
          ) : displayBooks.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
            >
              {displayBooks.map((book, i) => (
                <GoogleBookCard 
                  key={book.id} 
                  book={book} 
                  index={i} 
                  onClick={setSelectedBook} 
                />
              ))}
            </motion.div>
          ) : searchTrigger ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 text-muted-foreground"
            >
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-muted mb-6">
                <BookOpen className="h-10 w-10 opacity-30" />
              </div>
              <p className="text-xl font-display font-semibold mb-2">No books found</p>
              <p className="text-sm max-w-md mx-auto">Try a different search term or browse our featured collection.</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
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