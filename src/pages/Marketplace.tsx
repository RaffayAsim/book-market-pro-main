import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Globe, TrendingUp, BookOpen, Sparkles, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleBookCard } from "@/components/GoogleBookCard";
import { GoogleBookDetailModal } from "@/components/GoogleBookDetailModal";
import { BookGridSkeleton } from "@/components/BookCardSkeleton";
import { useGoogleBooksSearch, useTrendingBooks, type GoogleBook } from "@/services/googleBooks";

const genres = ["All", "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Mystery", "Romance", "Self-Help", "Biography", "History", "Horror", "Poetry", "Thriller", "Business"];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);
  const [activeTab, setActiveTab] = useState<"discover" | "trending">("discover");

  // Always fetch trending for initial display
  const { data: trendingBooks = [], isLoading: trendingLoading } = useTrendingBooks();
  
  // Search results
  const { data: searchResults = [], isLoading: searchLoading } = useGoogleBooksSearch(
    searchQuery.length > 2 ? searchQuery : ""
  );

  // Genre filter - only active when a genre is selected and no search
  const getGenreQuery = (genre: string) => {
    if (genre === "All") return "subject:fiction";
    if (genre === "Sci-Fi") return "subject:science fiction";
    if (genre === "Self-Help") return "subject:self-help";
    return `subject:${genre.toLowerCase()}`;
  };

  const { data: genreBooks = [], isLoading: genreLoading } = useGoogleBooksSearch(
    activeTab === "discover" && selectedGenre !== "All" && !searchQuery ? getGenreQuery(selectedGenre) : ""
  );

  // Determine which books to display
  const displayBooks = searchQuery.length > 2 
    ? searchResults 
    : activeTab === "trending" 
      ? trendingBooks 
      : selectedGenre !== "All" 
        ? genreBooks 
        : trendingBooks; // Default to trending books

  const isLoading = searchLoading || trendingLoading || genreLoading;

  // Shuffle array for random display
  const shuffleArray = (array: GoogleBook[]) => {
    if (!array || array.length === 0) return [];
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const [randomizedBooks, setRandomizedBooks] = useState<GoogleBook[]>([]);

  // Update randomized books when data changes
  useEffect(() => {
    if (displayBooks.length > 0) {
      setRandomizedBooks(shuffleArray(displayBooks));
    }
  }, [displayBooks, activeTab, selectedGenre, searchQuery]);

  return (
    <div className="py-12">
      <div className="container">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold mb-4">
            <Globe className="h-3.5 w-3.5" /> Global Discovery
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">
            Discover Your Next <span className="gradient-gold-text">Great Read</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore millions of books from around the world. From timeless classics to trending bestsellers.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or keyword..."
                className="pl-12 h-14 bg-card border-border text-foreground text-base rounded-full shadow-soft focus:shadow-gold transition-shadow"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground ml-2" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="h-14 rounded-full border border-border bg-card px-5 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none cursor-pointer hover:border-primary/30 transition-colors"
              >
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        {!searchQuery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-3 mb-10"
          >
            <button
              onClick={() => setActiveTab("discover")}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                activeTab === "discover"
                  ? "bg-primary text-primary-foreground shadow-gold scale-105"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <Sparkles className="h-4 w-4" /> Discover
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                activeTab === "trending"
                  ? "bg-primary text-primary-foreground shadow-gold scale-105"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              <TrendingUp className="h-4 w-4" /> Trending
            </button>
            <button
              onClick={() => setRandomizedBooks(shuffleArray(displayBooks))}
              className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-300"
            >
              <Shuffle className="h-4 w-4" /> Surprise Me
            </button>
          </motion.div>
        )}

        {/* Results Info */}
        <AnimatePresence mode="wait">
          {!isLoading && randomizedBooks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <p className="text-sm text-muted-foreground">
                Showing <span className="text-primary font-semibold">{randomizedBooks.length}</span> books
                {searchQuery && ` for "${searchQuery}"`}
                {selectedGenre !== "All" && !searchQuery && ` in ${selectedGenre}`}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="h-3 w-3" />
                Powered by Google Books
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Books Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BookGridSkeleton count={12} />
            </motion.div>
          ) : randomizedBooks.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
            >
              {randomizedBooks.map((book, i) => (
                <GoogleBookCard 
                  key={book.id} 
                  book={book} 
                  index={i} 
                  onClick={setSelectedBook} 
                />
              ))}
            </motion.div>
          ) : (
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
              <p className="text-sm max-w-md mx-auto">Try adjusting your search or browse a different genre to discover amazing reads.</p>
            </motion.div>
          )}
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

export default Marketplace;