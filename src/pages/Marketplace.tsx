import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, ShoppingCart, BookOpen, Filter, Loader2, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

const genres = ["All", "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Mystery", "Romance", "Self-Help", "Biography", "History", "Horror", "Historical Fiction", "Poetry", "Psychology", "Classic"];

interface MarketBook {
  id: string;
  title: string;
  description: string;
  genre: string;
  cover_url: string;
  price: number;
  format: string[];
  rating: number;
  rating_count: number;
  sales_count: number;
  page_count: number;
  author_name: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const Marketplace = () => {
  const [searchParams] = useSearchParams();
  const initialGenre = searchParams.get("genre") || "All";
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "price-low" | "price-high">("popular");
  const [books, setBooks] = useState<MarketBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<MarketBook | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);

    const { data: booksData, error: booksError } = await supabase
      .from("books")
      .select("id, title, description, genre, cover_url, price, format, rating, rating_count, sales_count, page_count, author_id")
      .eq("status", "Published")
      .order("created_at", { ascending: false });

    if (booksError || !booksData) {
      console.error("Marketplace fetch error:", booksError);
      setLoading(false);
      return;
    }

    const authorIds = [...new Set(booksData.map((b) => b.author_id).filter(Boolean))];
    const { data: profilesData, error: profilesError } = authorIds.length
      ? await supabase.from("profiles").select("id, full_name").in("id", authorIds)
      : { data: [], error: null };

    if (profilesError) {
      console.error("Marketplace profiles fetch error:", profilesError);
    }

    const authorMap = new Map((profilesData || []).map((p) => [p.id, p.full_name || "Unknown Author"]));

    setBooks(
      booksData.map((b) => ({
        id: b.id,
        title: b.title,
        description: b.description || "",
        genre: b.genre || "Fiction",
        cover_url: b.cover_url || "",
        price: Number(b.price) || 0,
        format: b.format || ["eBook"],
        rating: Number(b.rating) || 0,
        rating_count: b.rating_count || 0,
        sales_count: b.sales_count || 0,
        page_count: b.page_count || 0,
        author_name: authorMap.get(b.author_id) || "Unknown Author",
      }))
    );

    setLoading(false);
  };

  const handlePurchase = async (book: MarketBook, format: string) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to purchase books.", variant: "destructive" });
      return;
    }
    setPurchasing(true);
    try {
      const { error } = await supabase.from("orders").insert({
        buyer_id: user.id,
        book_id: book.id,
        format,
        price: book.price,
      } as any);
      if (error) throw error;
      toast({ title: "Purchase successful!", description: `You bought "${book.title}" (${format})` });
      setSelectedBook(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setPurchasing(false);
    }
  };

  const filtered = books
    .filter((b) => selectedGenre === "All" || b.genre === selectedGenre)
    .filter((b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return b.sales_count - a.sales_count;
    });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-display text-4xl font-bold mb-2">
            Book <span className="text-primary">Market</span>
          </h1>
          <p className="text-muted-foreground">
            Browse and purchase books published on our platform — eBooks, paperbacks, and hardcovers.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search marketplace..."
              className="pl-10 h-11 bg-card border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-11 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Genre tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                selectedGenre === g
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Book Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((book, i) => (
              <motion.div
                key={book.id}
                initial="hidden"
                animate="visible"
                custom={i}
                variants={fadeUp}
                className="group cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:border-primary/20 hover:shadow-card">
                  <div className="aspect-[2/3] overflow-hidden bg-muted">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        alt={`Cover of ${book.title}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider mb-1.5">
                      {book.genre}
                    </span>
                    <h3 className="font-display text-sm font-semibold text-foreground leading-tight line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{book.author_name}</p>
                    {book.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star className="h-3 w-3 text-amber fill-amber" />
                        <span className="text-xs font-medium text-amber">{book.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-display text-lg font-bold text-primary">
                        {book.price === 0 ? "Free" : `$${book.price.toFixed(2)}`}
                      </span>
                      <Button variant="gold" size="sm" className="h-7 px-2 text-xs gap-1 rounded-full" onClick={(e) => { e.stopPropagation(); setSelectedBook(book); }}>
                        <Eye className="h-3 w-3" /> View
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>{books.length === 0 ? "No books published yet. Be the first to publish!" : "No books found matching your filters."}</p>
          </div>
        )}
      </div>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
            onClick={() => setSelectedBook(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 max-h-[90vh] overflow-y-auto shadow-card"
            >
              <div className="flex justify-between mb-4">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase">{selectedBook.genre}</span>
                <Button variant="ghost" size="icon" onClick={() => setSelectedBook(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-5 mb-5">
                {selectedBook.cover_url ? (
                  <img src={selectedBook.cover_url} alt="" className="h-40 w-28 rounded-lg object-cover flex-shrink-0 shadow-soft" />
                ) : (
                  <div className="h-40 w-28 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{selectedBook.title}</h2>
                  <p className="text-sm text-primary mt-1">{selectedBook.author_name}</p>
                  {selectedBook.rating > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 text-amber fill-amber" />
                      <span className="text-sm font-medium text-amber">{selectedBook.rating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({selectedBook.rating_count} reviews)</span>
                    </div>
                  )}
                  {selectedBook.page_count > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">{selectedBook.page_count} pages</p>
                  )}
                  <p className="font-display text-3xl font-bold text-primary mt-3">
                    {selectedBook.price === 0 ? "Free" : `$${selectedBook.price.toFixed(2)}`}
                  </p>
                </div>
              </div>

              {selectedBook.description && (
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{selectedBook.description}</p>
              )}

              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Choose Format</p>
                {selectedBook.format.map((f) => (
                  <Button
                    key={f}
                    variant="gold-outline"
                    className="w-full justify-between gap-2 rounded-full"
                    disabled={purchasing}
                    onClick={() => handlePurchase(selectedBook, f)}
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      {selectedBook.price === 0 ? `Get ${f} Free` : `Buy ${f}`}
                    </span>
                    <span>{selectedBook.price === 0 ? "Free" : `$${selectedBook.price.toFixed(2)}`}</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;
