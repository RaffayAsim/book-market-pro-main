import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import NewsletterSignup from "@/components/home/NewsletterSignup";

const Footer = () => (
  <footer className="border-t border-border bg-muted/50 pt-12 pb-8">
    <div className="container">
      {/* Newsletter */}
      <div className="mb-12 max-w-xl mx-auto">
        <NewsletterSignup />
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold text-foreground">
              BOOK <span className="text-primary">MARKET</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The world's most advanced book publishing and marketplace platform.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Platform</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/search" className="hover:text-primary transition-colors">Search Books</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Author Dashboard</Link></li>
            <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Formats</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>eBook (DRM Protected)</li>
            <li>Paperback via Lulu</li>
            <li>Hardcover via Lulu</li>
            <li>AI Narration Add-on</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © 2026 Book Market. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
