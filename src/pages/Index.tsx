import { Flame, Award } from "lucide-react";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import GenresSection from "@/components/home/GenresSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import BookCarousel from "@/components/home/BookCarousel";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

const featuredBooks = [
  { id: 1, title: "The Midnight Library", author: "Matt Haig", cover: "https://covers.openlibrary.org/b/isbn/0525559477-L.jpg", rating: 4.8, genre: "Fiction" },
  { id: 2, title: "Atomic Habits", author: "James Clear", cover: "https://covers.openlibrary.org/b/isbn/0735211299-L.jpg", rating: 4.9, genre: "Self-Help" },
  { id: 3, title: "Project Hail Mary", author: "Andy Weir", cover: "https://covers.openlibrary.org/b/isbn/0593135202-L.jpg", rating: 4.7, genre: "Sci-Fi" },
  { id: 4, title: "The Song of Achilles", author: "Madeline Miller", cover: "https://covers.openlibrary.org/b/isbn/0062060627-L.jpg", rating: 4.6, genre: "Historical" },
  { id: 5, title: "Educated", author: "Tara Westover", cover: "https://covers.openlibrary.org/b/isbn/0399590501-L.jpg", rating: 4.7, genre: "Memoir" },
  { id: 6, title: "Dune", author: "Frank Herbert", cover: "https://covers.openlibrary.org/b/isbn/0441013597-L.jpg", rating: 4.8, genre: "Sci-Fi" },
];

const topRated = [
  { id: 7, title: "Where the Crawdads Sing", author: "Delia Owens", cover: "https://covers.openlibrary.org/b/isbn/0735219109-L.jpg", rating: 4.8, genre: "Fiction" },
  { id: 8, title: "Sapiens", author: "Yuval Noah Harari", cover: "https://covers.openlibrary.org/b/isbn/0062316095-L.jpg", rating: 4.7, genre: "Non-Fiction" },
  { id: 9, title: "The Alchemist", author: "Paulo Coelho", cover: "https://covers.openlibrary.org/b/isbn/0062315005-L.jpg", rating: 4.6, genre: "Fiction" },
  { id: 10, title: "Becoming", author: "Michelle Obama", cover: "https://covers.openlibrary.org/b/isbn/1524763136-L.jpg", rating: 4.9, genre: "Memoir" },
  { id: 11, title: "The Great Gatsby", author: "F. Scott Fitzgerald", cover: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg", rating: 4.5, genre: "Classic" },
  { id: 12, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", cover: "https://covers.openlibrary.org/b/isbn/0374533555-L.jpg", rating: 4.6, genre: "Psychology" },
];

const Index = () => (
  <div>
    <HeroSection />
    <StatsBar />
    <BookCarousel
      title="Featured Books"
      subtitle="This Month"
      icon={<Flame className="h-5 w-5 text-primary" />}
      books={featuredBooks}
    />
    <GenresSection />
    <BookCarousel
      title="Top Rated Books"
      subtitle="Highest Rated"
      icon={<Award className="h-5 w-5 text-primary" />}
      books={topRated}
    />
    <FeaturesSection />
    <HowItWorks />
    <TestimonialsSection />
    <CTASection />
  </div>
);

export default Index;
