import { Flame, Award, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import GenresSection from "@/components/home/GenresSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import { GoogleBookCard } from "@/components/GoogleBookCard";
import { GoogleBookDetailModal } from "@/components/GoogleBookDetailModal";
import { BookGridSkeleton } from "@/components/BookCardSkeleton";
import { useFeaturedBooks, useTopRatedBooks, type GoogleBook } from "@/services/googleBooks";
import { useState } from "react";

const BookCarouselSection = ({ 
  title, 
  subtitle, 
  icon, 
  books, 
  isLoading, 
  onBookClick 
}: { 
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  books: GoogleBook[];
  isLoading: boolean;
  onBookClick: (book: GoogleBook) => void;
}) => (
  <section className="py-16">
    <div className="container">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {icon}
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">{subtitle}</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">{title}</h2>
        </div>
      </div>
      
      {isLoading ? (
        <BookGridSkeleton count={6} />
      ) : books.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {books.slice(0, 6).map((book, i) => (
            <GoogleBookCard key={book.id} book={book} index={i} onClick={onBookClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No books found. Try refreshing the page.</p>
        </div>
      )}
    </div>
  </section>
);

const Index = () => {
  const { data: featuredBooks = [], isLoading: featuredLoading } = useFeaturedBooks();
  const { data: topRatedBooks = [], isLoading: topRatedLoading } = useTopRatedBooks();
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);

  return (
    <div>
      <HeroSection />
      <StatsBar />
      
      <BookCarouselSection
        title="Featured Books"
        subtitle="This Month"
        icon={<Flame className="h-5 w-5 text-primary" />}
        books={featuredBooks}
        isLoading={featuredLoading}
        onBookClick={setSelectedBook}
      />
      
      <GenresSection />
      
      <BookCarouselSection
        title="Top Rated Books"
        subtitle="Highest Rated"
        icon={<Award className="h-5 w-5 text-primary" />}
        books={topRatedBooks}
        isLoading={topRatedLoading}
        onBookClick={setSelectedBook}
      />
      
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
      
      <GoogleBookDetailModal 
        book={selectedBook} 
        isOpen={!!selectedBook} 
        onClose={() => setSelectedBook(null)} 
      />
    </div>
  );
};

export default Index;