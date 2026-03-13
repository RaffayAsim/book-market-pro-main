import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Flame, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  MoreHorizontal,
  Star,
  MapPin,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import PersonalizationQuiz from "@/components/PersonalizationQuiz";

interface ReadingProgress {
  bookId: string;
  title: string;
  author: string;
  cover: string;
  progress: number;
  lastRead: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const ReaderDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [streak, setStreak] = useState(12);
  const [activeReads, setActiveReads] = useState<ReadingProgress[]>([
    {
      bookId: "1",
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&h=300&fit=crop",
      progress: 65,
      lastRead: "2 hours ago"
    },
    {
      bookId: "2",
      title: "Atomic Habits",
      author: "James Clear",
      cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200&h=300&fit=crop",
      progress: 32,
      lastRead: "Yesterday"
    }
  ]);
  
  const [achievements] = useState<Achievement[]>([
    { id: "1", name: "First Steps", description: "Read your first book", icon: "🎯", unlocked: true, unlockedAt: "2024-01-15" },
    { id: "2", name: "7-Day Streak", description: "Read 7 days in a row", icon: "🔥", unlocked: true, unlockedAt: "2024-01-20" },
    { id: "3", name: "Bookworm", description: "Read 10 books", icon: "📚", unlocked: false },
    { id: "4", name: "Night Owl", description: "Read past midnight", icon: "🦉", unlocked: true, unlockedAt: "2024-02-01" },
    { id: "5", name: "Speed Reader", description: "Finish a book in 24 hours", icon: "⚡", unlocked: false },
  ]);

  // Show quiz on first login if not completed
  useEffect(() => {
    if (profile && !profile.metadata?.quizCompleted) {
      setShowQuiz(true);
    }
  }, [profile]);

  const handleUpgradeToAuthor = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: "author" })
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast({ 
        title: "Welcome, Author!", 
        description: "Your account has been upgraded. Let's set up your author profile." 
      });
      
      navigate("/author-dashboard");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
    // Refresh the page to get updated profile
    window.location.reload();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Glassmorphism Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl" />
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
              Welcome back, {profile?.full_name?.split(" ")[0] || "Reader"} ✨
            </h1>
            <p className="text-blue-200/70">Continue your reading journey</p>
          </div>
          <Button 
            onClick={handleUpgradeToAuthor}
            className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 hover:from-amber-500 hover:to-orange-600 shadow-lg shadow-amber-500/25"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Start Writing
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Reads Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  Currently Reading
                </h2>
                <Button variant="ghost" size="sm" className="text-blue-300 hover:text-white">
                  View Library <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {activeReads.map((book) => (
                  <div 
                    key={book.bookId}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-4 hover:border-blue-400/50 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={book.cover} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="icon" className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30">
                            <Play className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate mb-1">{book.title}</h3>
                        <p className="text-sm text-blue-200/60 mb-3">{book.author}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-blue-200/50">
                            <span>{book.progress}% complete</span>
                            <span>{book.lastRead}</span>
                          </div>
                          <Progress value={book.progress} className="h-1.5 bg-white/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Personalized Recommendations */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  Picked for You
                </h2>
                <div className="flex gap-2">
                  {profile?.metadata?.favoriteGenres?.slice(0, 3).map((genre: string) => (
                    <span key={genre} className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                      <img 
                        src={`https://images.unsplash.com/photo-${i === 1 ? '1544947950-fa07a98d237f' : i === 2 ? '1512820790803-83ca734da794' : i === 3 ? '1495446815901-a7297e633e8d' : '1481627834827-6ce0f4395d45'}?w=200&h=300&fit=crop`}
                        alt="Book cover"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="text-sm font-medium text-white truncate">Recommended Book {i}</h4>
                    <p className="text-xs text-blue-200/50">Based on your taste</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Gamification */}
          <div className="space-y-6">
            {/* Streak Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-xl bg-orange-500/30 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{streak}</p>
                  <p className="text-sm text-orange-200/70">Day Streak</p>
                </div>
              </div>
              <div className="flex gap-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div 
                    key={day + i}
                    className={`flex-1 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                      i < 5 ? "bg-orange-500/40 text-white" : "bg-white/10 text-white/40"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <p className="text-xs text-orange-200/50 mt-3 text-center">
                Keep reading to maintain your streak!
              </p>
            </motion.div>

            {/* Achievements */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-yellow-400" />
                <h3 className="font-display text-lg font-semibold text-white">Achievements</h3>
              </div>
              <div className="space-y-3">
                {achievements.slice(0, 4).map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${
                      achievement.unlocked 
                        ? "bg-yellow-500/10 border-yellow-500/30" 
                        : "bg-white/5 border-white/10 opacity-60"
                    }`}
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${achievement.unlocked ? "text-white" : "text-white/60"}`}>
                        {achievement.name}
                      </p>
                      <p className="text-xs text-white/40">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    )}
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="w-full mt-4 text-blue-300 hover:text-white">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>

            {/* Reading Stats */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Books Read</span>
                  <span className="text-white font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Pages Read</span>
                  <span className="text-white font-semibold">8,432</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Hours Read</span>
                  <span className="text-white font-semibold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Avg. Rating</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    4.2 <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Personalization Quiz Modal */}
      {user && (
        <PersonalizationQuiz 
          isOpen={showQuiz} 
          onClose={handleQuizClose}
          userId={user.id}
        />
      )}
    </div>
  );
};

export default ReaderDashboard;