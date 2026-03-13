import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Globe, 
  Edit3, 
  BarChart3, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Heart,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  cover: string;
  reads: number;
  revenue: number;
  rating: number;
  status: "published" | "draft" | "review";
  lastUpdated: string;
}

interface CountryStat {
  country: string;
  code: string;
  readers: number;
  percentage: number;
}

const AuthorDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "The Art of Storytelling",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop",
      reads: 12453,
      revenue: 2847.50,
      rating: 4.8,
      status: "published",
      lastUpdated: "2 days ago"
    },
    {
      id: "2",
      title: "Midnight Chronicles",
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=300&fit=crop",
      reads: 8321,
      revenue: 1654.25,
      rating: 4.6,
      status: "published",
      lastUpdated: "1 week ago"
    },
    {
      id: "3",
      title: "Digital Dreams",
      cover: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=300&fit=crop",
      reads: 0,
      revenue: 0,
      rating: 0,
      status: "draft",
      lastUpdated: "3 days ago"
    }
  ]);

  const [countryStats] = useState<CountryStat[]>([
    { country: "United States", code: "US", readers: 4523, percentage: 35 },
    { country: "United Kingdom", code: "GB", readers: 2134, percentage: 17 },
    { country: "Germany", code: "DE", readers: 1892, percentage: 15 },
    { country: "Canada", code: "CA", readers: 1245, percentage: 10 },
    { country: "Australia", code: "AU", readers: 987, percentage: 8 },
    { country: "Others", code: "OT", readers: 1993, percentage: 15 },
  ]);

  const totalReads = books.reduce((sum, b) => sum + b.reads, 0);
  const totalRevenue = books.reduce((sum, b) => sum + b.revenue, 0);
  const avgEngagement = 4.2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-white mb-1">
              Author Studio
            </h1>
            <p className="text-amber-200/60">Manage your literary empire</p>
          </div>
          <Button className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-500/25">
            <Plus className="h-4 w-4 mr-2" />
            New Book
          </Button>
        </motion.div>

        {/* Analytics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-400" />
                </div>
                <span className="flex items-center text-green-400 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +12.5%
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{totalReads.toLocaleString()}</p>
              <p className="text-white/60 text-sm">Total Reads</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl group-hover:bg-amber-500/30 transition-colors" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-amber-400" />
                </div>
                <span className="flex items-center text-green-400 text-sm font-medium">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +8.3%
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">${totalRevenue.toLocaleString()}</p>
              <p className="text-white/60 text-sm">Estimated Royalties</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:bg-purple-500/30 transition-colors" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-purple-400" />
                </div>
                <span className="flex items-center text-red-400 text-sm font-medium">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  -2.1%
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{avgEngagement}</p>
              <p className="text-white/60 text-sm">Reader Engagement</p>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - Books */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-400" />
                  My Published Works
                </h2>
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {books.map((book) => (
                  <div 
                    key={book.id}
                    className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all"
                  >
                    <div className="relative w-16 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={book.cover} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      {book.status !== "published" && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-[10px] uppercase font-bold text-white">
                            {book.status}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{book.title}</h3>
                        {book.status === "published" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">
                            Live
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/50">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {book.reads.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" /> ${book.revenue.toFixed(2)}
                        </span>
                        {book.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <span className="text-amber-400">★</span> {book.rating}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Global Pulse */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-5 w-5 text-cyan-400" />
                <h3 className="font-display text-lg font-semibold text-white">The Pulse</h3>
              </div>

              {/* Simplified World Map Visualization */}
              <div className="relative h-48 mb-6 bg-slate-800/50 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-6 gap-2 w-full h-full p-4">
                    {countryStats.map((stat, i) => (
                      <div 
                        key={stat.code}
                        className="flex flex-col items-center justify-center"
                        style={{ opacity: 0.3 + (stat.percentage / 100) * 0.7 }}
                      >
                        <div 
                          className="w-8 h-8 rounded-lg bg-cyan-500/40 border border-cyan-400/50 flex items-center justify-center text-xs font-bold text-cyan-300"
                          title={`${stat.country}: ${stat.readers.toLocaleString()} readers`}
                        >
                          {stat.code}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 text-[10px] text-white/40">
                  Live readers worldwide
                </div>
              </div>

              <div className="space-y-3">
                {countryStats.map((stat) => (
                  <div key={stat.code} className="flex items-center gap-3">
                    <span className="text-lg">{stat.code === "US" ? "🇺🇸" : stat.code === "GB" ? "🇬🇧" : stat.code === "DE" ? "🇩🇪" : stat.code === "CA" ? "🇨🇦" : stat.code === "AU" ? "🇦🇺" : "🌍"}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white/80">{stat.country}</span>
                        <span className="text-xs text-white/50">{stat.readers.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="backdrop-blur-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6"
            >
              <h3 className="font-display text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Continue Writing
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Reader Comments
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;