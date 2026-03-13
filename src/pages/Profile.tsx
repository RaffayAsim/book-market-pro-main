import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, BookOpen, Edit2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, profile, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: form.full_name,
          bio: form.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      
      toast({ title: "Profile updated!" });
      setEditing(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = () => {
    if (profile?.role === 'author') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <BookOpen className="h-3 w-3" /> Author
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
        <User className="h-3 w-3" /> Reader
      </span>
    );
  };

  return (
    <div className="py-12">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-8 shadow-card"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground mt-1">Manage your account settings</p>
            </div>
            {getRoleBadge()}
          </div>

          <div className="space-y-6">
            {/* Avatar placeholder */}
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-lg">
                  {profile?.full_name || "No name set"}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {user.email}
                </p>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                {editing ? (
                  <Input
                    value={form.full_name}
                    onChange={(e) => setForm(p => ({ ...p, full_name: e.target.value }))}
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="text-foreground">{profile?.full_name || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Bio</label>
                {editing ? (
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
                  />
                ) : (
                  <p className="text-foreground">{profile?.bio || "No bio yet"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Role</label>
                <p className="text-foreground capitalize">{profile?.role || "reader"}</p>
                {profile?.role === 'reader' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Want to publish books? Contact support to upgrade to author.
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              {editing ? (
                <>
                  <Button variant="ghost" className="flex-1" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="gold" className="flex-1 gap-2" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setEditing(true)}>
                    <Edit2 className="h-4 w-4" /> Edit Profile
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;