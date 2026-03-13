import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, TrendingUp, Eye, Clock, Plus, BarChart3, Edit2, Trash2, X, Upload, Loader2, FileText, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  description: string;
  genre: string;
  cover_url: string;
  manuscript_url: string;
  price: number;
  status: string;
  format: string[];
  page_count: number;
  isbn: string;
  sales_count: number;
  revenue: number;
  created_at: string;
}

const genres = ["Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Mystery", "Romance", "Self-Help", "Biography", "History", "Horror", "Poetry", "Children", "Historical Fiction", "Psychology", "Classic"];
const formats = ["eBook", "Paperback", "Hardcover"];

const statusConfig: Record<string, { bg: string; dot: string }> = {
  Published: { bg: "bg-accent/10 text-accent border-accent/20", dot: "bg-accent" },
  "In Review": { bg: "bg-amber/10 text-amber border-amber/20", dot: "bg-amber" },
  Draft: { bg: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" },
  Archived: { bg: "bg-destructive/10 text-destructive border-destructive/20", dot: "bg-destructive" },
};

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "draft" | "review" | "published">("all");

  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "Fiction",
    price: "0",
    format: ["eBook"] as string[],
    page_count: "",
    isbn: "",
  });

  const fetchBooks = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setBooks(data as unknown as Book[]);
    setLoading(false);
  };

  useEffect(() => { fetchBooks(); }, [user]);

  const resetForm = () => {
    setForm({ title: "", description: "", genre: "Fiction", price: "0", format: ["eBook"], page_count: "", isbn: "" });
    setCoverFile(null);
    setManuscriptFile(null);
    setEditingBook(null);
  };

  const openNew = () => { resetForm(); setShowModal(true); };
  const openEdit = (book: Book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      description: book.description,
      genre: book.genre,
      price: String(book.price),
      format: book.format || ["eBook"],
      page_count: String(book.page_count || ""),
      isbn: book.isbn || "",
    });
    setShowModal(true);
  };

  const toggleFormat = (f: string) => {
    setForm(prev => ({
      ...prev,
      format: prev.format.includes(f) ? prev.format.filter(x => x !== f) : [...prev.format, f],
    }));
  };

  const uploadFile = async (file: File, folder: string, bookId: string): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${bookId}.${ext}`;
    const { error } = await supabase.storage.from("book-assets").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("book-assets").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.title.trim()) return;
    setSaving(true);

    try {
      const bookId = editingBook?.id || crypto.randomUUID();
      const cover_url = coverFile ? await uploadFile(coverFile, "covers", bookId) : (editingBook?.cover_url || "");
      const manuscript_url = manuscriptFile ? await uploadFile(manuscriptFile, "manuscripts", bookId) : (editingBook?.manuscript_url || "");

      const bookData = {
        title: form.title.trim(),
        description: form.description.trim(),
        genre: form.genre,
        price: parseFloat(form.price) || 0,
        format: form.format,
        page_count: parseInt(form.page_count) || 0,
        isbn: form.isbn.trim(),
        cover_url,
        manuscript_url,
        updated_at: new Date().toISOString(),
      };

      if (editingBook) {
        const { error } = await supabase.from("books").update(bookData as any).eq("id", editingBook.id);
        if (error) throw error;
        toast({ title: "Book updated!" });
      } else {
        const { error } = await supabase.from("books").insert({
          ...bookData,
          id: bookId,
          author_id: user.id,
          status: "Draft",
        } as any);
        if (error) throw error;
        toast({ title: "Book created!", description: "Your book is saved as a draft. Submit it for review when ready." });
      }
      setShowModal(false);
      resetForm();
      fetchBooks();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteBook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Book deleted" });
      fetchBooks();
    }
  };

  const submitForReview = async (book: Book) => {
    if (!book.cover_url) {
      toast({ title: "Cover required", description: "Please upload a cover image before submitting.", variant: "destructive" });
      return;
    }
    if (!book.description) {
      toast({ title: "Description required", description: "Please add a description before submitting.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("books").update({ status: "In Review" } as any).eq("id", book.id);
    if (!error) { toast({ title: "Submitted for review!", description: "Your book will be reviewed within 24 hours." }); fetchBooks(); }
  };

  const publishBook = async (id: string) => {
    const { error } = await supabase.from("books").update({
      status: "Published",
      published_at: new Date().toISOString(),
    } as any).eq("id", id);
    if (!error) { toast({ title: "Book published!", description: "Your book is now live on the marketplace." }); fetchBooks(); }
  };

  const totalSales = books.reduce((s, b) => s + (b.sales_count || 0), 0);
  const totalRevenue = books.reduce((s, b) => s + (Number(b.revenue) || 0), 0);
  const publishedCount = books.filter(b => b.status === "Published").length;

  const filteredBooks = activeTab === "all" ? books :
    activeTab === "draft" ? books.filter(b => b.status === "Draft") :
    activeTab === "review" ? books.filter(b => b.status === "In Review") :
    books.filter(b => b.status === "Published");

  const stats = [
    { label: "Total Sales", value: totalSales.toLocaleString(), icon: TrendingUp, color: "text-primary" },
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: BarChart3, color: "text-accent" },
    { label: "Published", value: String(publishedCount), icon: CheckCircle2, color: "text-accent" },
    { label: "All Books", value: String(books.length), icon: BookOpen, color: "text-purple" },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4"
        >
          <div>
            <h1 className="font-display text-3xl font-bold">Author Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your publications and track performance.</p>
          </div>
          <Button variant="gold" className="gap-2 self-start rounded-full" onClick={openNew}>
            <Plus className="h-4 w-4" /> New Book
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <span className="text-2xl font-bold font-display text-foreground">{s.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all", label: "All Books" },
            { key: "draft", label: "Drafts" },
            { key: "review", label: "In Review" },
            { key: "published", label: "Published" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookshelf */}
        <div>
          {filteredBooks.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-soft">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground mb-4">
                {activeTab === "all" ? "You haven't added any books yet." : `No ${activeTab} books.`}
              </p>
              {activeTab === "all" && (
                <Button variant="gold" onClick={openNew} className="gap-2 rounded-full">
                  <Plus className="h-4 w-4" /> Add Your First Book
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book, i) => {
                const sc = statusConfig[book.status] || statusConfig.Draft;
                return (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-card transition-shadow"
                  >
                    <div className="flex gap-4">
                      {book.cover_url ? (
                        <img src={book.cover_url} alt="" className="h-28 w-20 rounded-lg object-cover flex-shrink-0 shadow-soft" />
                      ) : (
                        <div className="h-28 w-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display font-semibold text-foreground text-sm line-clamp-1">{book.title}</h3>
                          <span className={`inline-flex items-center gap-1 shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${sc.bg}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                            {book.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{book.genre}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{book.description || "No description"}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs">
                          <span className="font-semibold text-primary">
                            {Number(book.price) === 0 ? "Free" : `$${Number(book.price).toFixed(2)}`}
                          </span>
                          <span className="text-muted-foreground">{book.sales_count || 0} sales</span>
                          <span className="text-muted-foreground">{(book.format || []).join(", ")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                      {book.status === "Draft" && (
                        <Button variant="gold" size="sm" className="h-8 text-xs gap-1 rounded-full flex-1" onClick={() => submitForReview(book)}>
                          <Send className="h-3 w-3" /> Submit for Review
                        </Button>
                      )}
                      {book.status === "In Review" && (
                        <Button variant="gold" size="sm" className="h-8 text-xs gap-1 rounded-full flex-1" onClick={() => publishBook(book.id)}>
                          <CheckCircle2 className="h-3 w-3" /> Publish Now
                        </Button>
                      )}
                      {book.status === "Published" && (
                        <span className="text-xs text-accent font-medium flex items-center gap-1 flex-1">
                          <CheckCircle2 className="h-3 w-3" /> Live on Marketplace
                        </span>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(book)}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteBook(book.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Book Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 max-h-[90vh] overflow-y-auto shadow-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold">{editingBook ? "Edit Book" : "Create New Book"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Title *</label>
                  <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required placeholder="Enter your book title" className="bg-background border-border" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Description *</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    rows={4}
                    placeholder="Write a compelling description for your book..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Genre</label>
                    <select
                      value={form.genre}
                      onChange={e => setForm(p => ({ ...p, genre: e.target.value }))}
                      className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none"
                    >
                      {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Price ($)</label>
                    <Input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="0 for free" className="bg-background border-border" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Page Count</label>
                    <Input type="number" value={form.page_count} onChange={e => setForm(p => ({ ...p, page_count: e.target.value }))} placeholder="e.g. 320" className="bg-background border-border" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">ISBN (optional)</label>
                    <Input value={form.isbn} onChange={e => setForm(p => ({ ...p, isbn: e.target.value }))} placeholder="e.g. 978-0-123456-78-9" className="bg-background border-border" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Available Formats</label>
                  <div className="flex gap-2">
                    {formats.map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFormat(f)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold border transition-all ${
                          form.format.includes(f)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-border hover:border-primary/30"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Cover Image</label>
                  <label className="flex items-center gap-3 cursor-pointer rounded-xl border-2 border-dashed border-border bg-background px-4 py-4 text-sm text-muted-foreground hover:border-primary/30 transition-colors">
                    <Upload className="h-5 w-5 text-primary" />
                    <div>
                      <span className="font-medium text-foreground">{coverFile ? coverFile.name : "Upload cover image"}</span>
                      <p className="text-xs mt-0.5">JPG, PNG or WebP. Recommended 600×900px</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Manuscript File</label>
                  <label className="flex items-center gap-3 cursor-pointer rounded-xl border-2 border-dashed border-border bg-background px-4 py-4 text-sm text-muted-foreground hover:border-primary/30 transition-colors">
                    <FileText className="h-5 w-5 text-accent" />
                    <div>
                      <span className="font-medium text-foreground">{manuscriptFile ? manuscriptFile.name : "Upload manuscript"}</span>
                      <p className="text-xs mt-0.5">PDF, EPUB, or DOCX format</p>
                    </div>
                    <input type="file" accept=".pdf,.epub,.docx,.doc" className="hidden" onChange={e => setManuscriptFile(e.target.files?.[0] || null)} />
                  </label>
                </div>

                <div className="bg-muted rounded-xl p-4 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Publishing Workflow</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Create your book as a <strong>Draft</strong></li>
                    <li>Add cover, description, and manuscript</li>
                    <li><strong>Submit for Review</strong> when ready</li>
                    <li>Click <strong>Publish</strong> to go live on the marketplace</li>
                  </ol>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" variant="gold" className="flex-1 gap-2 rounded-full" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    {editingBook ? "Save Changes" : "Create Book"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
