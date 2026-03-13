import { Link, useLocation } from "react-router-dom";
import { BookOpen, Search, LayoutDashboard, DollarSign, ShoppingBag, LogIn, LogOut, Home, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Book Market", path: "/marketplace", icon: ShoppingBag },
  { label: "Search", path: "/search", icon: Search },
  { label: "Pricing", path: "/pricing", icon: DollarSign },
];

const Navbar = () => {
  const location = useLocation();
  const { user, signOut, isAuthor, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border">
      <div className="container">
        {/* Main bar */}
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <BookOpen className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold tracking-wide text-foreground">
              BOOK <span className="text-primary">MARKET</span>
            </span>
          </Link>

          {/* Desktop: all links always visible */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-1.5 text-sm font-medium ${
                      active
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <>
                {isAuthor && (
                  <Link to="/dashboard">
                    <Button
                      variant={location.pathname === "/dashboard" ? "gold" : "gold-outline"}
                      size="sm"
                      className="gap-1.5 rounded-full"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut} 
                  className="text-muted-foreground gap-1"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="gold" size="sm" className="gap-1.5 rounded-full">
                  <LogIn className="h-4 w-4" /> Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile expanded menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="py-3 space-y-1">
                {navItems.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-muted"
                      }`}>
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
                <div className="pt-2 border-t border-border mt-2 px-3">
                  {loading ? (
                    <div className="h-10 rounded-full bg-muted animate-pulse" />
                  ) : user ? (
                    <div className="space-y-2">
                      {isAuthor && (
                        <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                          <Button variant="gold" size="sm" className="w-full gap-2 rounded-full">
                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-muted-foreground gap-2"
                        onClick={() => { signOut(); setMobileOpen(false); }}
                      >
                        <LogOut className="h-4 w-4" /> Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setMobileOpen(false)}>
                      <Button variant="gold" size="sm" className="w-full gap-2 rounded-full">
                        <LogIn className="h-4 w-4" /> Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;