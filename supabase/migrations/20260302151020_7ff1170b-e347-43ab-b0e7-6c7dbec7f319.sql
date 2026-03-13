
-- Profiles table for author info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Books table
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  genre TEXT DEFAULT 'Fiction',
  cover_url TEXT DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'In Review', 'Published', 'Archived')),
  format TEXT[] DEFAULT ARRAY['eBook']::TEXT[],
  page_count INTEGER DEFAULT 0,
  isbn TEXT DEFAULT '',
  manuscript_url TEXT DEFAULT '',
  sales_count INTEGER DEFAULT 0,
  revenue NUMERIC(10,2) DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Authors can CRUD their own books
CREATE POLICY "Authors can view own books" ON public.books FOR SELECT TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Authors can insert books" ON public.books FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own books" ON public.books FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own books" ON public.books FOR DELETE TO authenticated USING (auth.uid() = author_id);
-- Anyone can view published books (for marketplace)
CREATE POLICY "Anyone can view published books" ON public.books FOR SELECT USING (status = 'Published');

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL NOT NULL,
  format TEXT NOT NULL DEFAULT 'eBook',
  price NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = buyer_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

-- Storage bucket for book covers and manuscripts
INSERT INTO storage.buckets (id, name, public) VALUES ('book-assets', 'book-assets', true);

CREATE POLICY "Anyone can view book assets" ON storage.objects FOR SELECT USING (bucket_id = 'book-assets');
CREATE POLICY "Authenticated users can upload book assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'book-assets');
CREATE POLICY "Users can update own book assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'book-assets');
CREATE POLICY "Users can delete own book assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'book-assets');
