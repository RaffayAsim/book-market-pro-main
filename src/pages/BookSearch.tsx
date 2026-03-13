import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink, BookOpen, Loader2, Globe, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BookResult {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  infoLink: string;
  publishedDate: string;
  publisher: string;
  pageCount: number;
}

const BookSearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState("");

  const searchBooks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setError("");

    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=30`
      );
      
      if (res.status === 429) {
        setError("Search limit reached. Google Books API has a daily quota — please try again later or try a more specific search term.");
        setResults([]);
        setTotalItems(0);
        return;
      }
      
      if (!res.ok) {
        setError("Something went wrong with the search. Please try again.");
        setResults([]);
        return;
      }

      const data = await res.json();
      setTotalItems(data.totalItems || 0);
      const books: BookResult[] = (data.items || []).map((item: any) => ({
        id: item.id,
        title: item.volumeInfo?.title || "Untitled",
        authors: item.volumeInfo?.authors || ["Unknown Author"],
        description: item.volumeInfo?.description || "",
        thumbnail: item.volumeInfo?.imageLinks?.thumbnail || "",
        infoLink: item.volumeInfo?.infoLink || "#",
        publishedDate: item.volumeInfo?.publishedDate || "",
        publisher: item.volumeInfo?.publisher || "",
        pageCount: item.volumeInfo?.pageCount || 0,
      }));
      setResults(books);
    } catch {
      setError("Network error. Please check your connection and try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
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

        <form onSubmit={searchBooks} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, ISBN, or keyword..."
              className="pl-10 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" variant="gold" size="lg" disabled={loading} className="px-8">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 mb-6"
          >
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </motion.div>
        )}

        {searched && !loading && !error && totalItems > 0 && (
          <p className="text-sm text-muted-foreground mb-6">
            Found <span className="text-gold font-semibold">{totalItems.toLocaleString()}</span> results
          </p>
        )}

        {loading && (
          <div className="flex flex-col items-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
            <p className="text-sm text-muted-foreground">Searching the world wide web...</p>
          </div>
        )}

        <AnimatePresence>
          {!loading && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-4 md:grid-cols-2"
            >
              {results.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex gap-4 rounded-xl border border-border bg-surface p-4 hover:border-gold/30 transition-all duration-300"
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
                    <a href={book.infoLink} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="mt-1.5 gap-1 text-gold hover:text-gold-light p-0 h-auto text-xs">
                        View on Google Books <ExternalLink className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && searched && !error && results.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No books found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearchPage;
