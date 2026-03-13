import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Globe, TrendingUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleBookCard } from "@/components/GoogleBookCard";
import { GoogleBookDetailModal } from "@/components/GoogleBookDetailModal";
import { BookGridSkeleton } from "@/components/BookCardSkeleton";
import { useGoogleBooksSearch, useTrendingBooks, type GoogleBook } from "@/services/googleBooks";

const genres = ["All", "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Mystery", "Romance", "Self-Help", "Biography", "History", "Horror", "Poetry"];

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);
  const [activeTab, setActiveTab] = useState<"discover" | "trending">("discover");

  const { data: searchResults = [], isLoading: searchLoading } = useGoogleBooksSearch(
    searchQuery.length > 2 ? searchQuery : ""
  );
  
  const { data: trendingBooks = [], isLoading: trendingLoading } = useTrendingBooks();

  const getGenreQuery = (genre: string) => {
    if (genre === "All") return "subject:fiction";
    if (genre === "Sci-Fi") return "subject:science fiction";
    if (genre === "Self-Help") return "subject:self-help";
    return `subject:${genre.toLowerCase()}`;
  };

  const { data: genreBooks = [], isLoading: genreLoading } = useGoogleBooksSearch(
    activeTab === "discover" && selectedGenre !== "All" ? getGenreQuery(selectedGenre) : ""
  );

  const displayBooks = searchQuery.length > 2 
    ? searchResults 
    : activeTab === "trending" 
      ? trendingBooks 
      : selectedGenre !== "All" 
        ? genreBooks 
        : trendingBooks;

  const isLoading = searchLoading || (activeTab === "trending" ? trendingLoading : genreLoading);

  return (
    <div className="py-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Global Discovery</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-2">
            Book <span className="text-primary">Market</span>
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Discover millions of books from around the world. Search by title, author, or browse by genre.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              className="pl-10 h-12 bg-card border-border text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="h-12 rounded-lg border border-border bg-card px-4 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
            >
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        {!searchQuery && (
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setActiveTab("discover")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                activeTab === "discover"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Globe className="h-4 w-4" /> Discover
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                activeTab === "trending"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="h-4 w-4" /> Trending
            </button>
          </div>
        )}

        {!isLoading && displayBooks.length > 0 && (
          <p className="text-sm text-muted-foreground mb-6">
            Showing <span className="text-primary font-semibold">{displayBooks.length}</span> books
            {searchQuery && ` for "${searchQuery}"`}
            {selectedGenre !== "All" && !searchQuery && ` in ${selectedGenre}`}
          </p>
        )}

        {isLoading ? (
          <BookGridSkeleton count={12} />
        ) : displayBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {displayBooks.map((book, i) => (
              <GoogleBookCard 
                key={book.id} 
                book={book} 
                index={i} 
                onClick={setSelectedBook} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">No books found</p>
            <p className="text-sm">Try adjusting your search or browse a different genre</p>
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

export default Marketplace;