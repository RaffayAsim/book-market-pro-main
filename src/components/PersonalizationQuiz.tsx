import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Heart, BookOpen, Coffee, Moon, Sun, Zap, Music, Plane, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PersonalizationQuizProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const genres = [
  "Fiction", "Mystery", "Romance", "Sci-Fi", "Fantasy", 
  "Thriller", "Biography", "Self-Help", "History", "Poetry"
];

const moods = [
  { name: "Cozy", icon: Coffee, color: "bg-orange-500/20 text-orange-400" },
  { name: "Adventurous", icon: Plane, color: "bg-blue-500/20 text-blue-400" },
  { name: "Thoughtful", icon: Brain, color: "bg-purple-500/20 text-purple-400" },
  { name: "Energetic", icon: Zap, color: "bg-yellow-500/20 text-yellow-400" },
  { name: "Relaxed", icon: Music, color: "bg-green-500/20 text-green-400" },
  { name: "Dreamy", icon: Moon, color: "bg-indigo-500/20 text-indigo-400" },
];

const PersonalizationQuiz = ({ isOpen, onClose, userId }: PersonalizationQuizProps) => {
  const [step, setStep] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else if (selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const toggleMood = (mood: string) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter(m => m !== mood));
    } else if (selectedMoods.length < 3) {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const handleSave = async () => {
    if (selectedGenres.length === 0 || selectedMoods.length === 0) {
      toast({ title: "Please select at least one genre and mood", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          metadata: {
            favoriteGenres: selectedGenres,
            favoriteMoods: selectedMoods,
            quizCompleted: true,
            completedAt: new Date().toISOString()
          }
        })
        .eq("id", userId);

      if (error) throw error;
      
      toast({ title: "Preferences saved!", description: "We'll personalize your reading experience." });
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border border-white/20 rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Personalize Your Experience</h2>
              <p className="text-white/60 text-sm">Step {step} of 2</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2].map((s) => (
            <div 
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? "bg-gradient-to-r from-pink-500 to-purple-500" : "bg-white/10"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">What genres do you love?</h3>
              <p className="text-white/60 mb-6">Select up to 3 genres that interest you most</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedGenres.includes(genre)
                        ? "border-pink-500 bg-pink-500/20 text-white"
                        : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    <BookOpen className="h-5 w-5 mx-auto mb-2 opacity-70" />
                    <span className="text-sm font-medium">{genre}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <span className="text-white/50 text-sm">{selectedGenres.length}/3 selected</span>
                <Button 
                  onClick={() => setStep(2)}
                  disabled={selectedGenres.length === 0}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0"
                >
                  Continue <span className="ml-2">→</span>
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-xl font-semibold text-white mb-2">What's your reading mood?</h3>
              <p className="text-white/60 mb-6">Select up to 3 moods that match how you like to feel while reading</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {moods.map((mood) => (
                  <button
                    key={mood.name}
                    onClick={() => toggleMood(mood.name)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedMoods.includes(mood.name)
                        ? "border-purple-500 bg-purple-500/20 text-white"
                        : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10"
                    }`}
                  >
                    <mood.icon className={`h-5 w-5 mx-auto mb-2 ${mood.color}`} />
                    <span className="text-sm font-medium">{mood.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(1)}
                  className="text-white/60 hover:text-white"
                >
                  ← Back
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={selectedMoods.length === 0 || loading}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0"
                >
                  {loading ? "Saving..." : "Complete Setup"} <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PersonalizationQuiz;