
-- Drop all restrictive policies on books and replace with permissive ones
DROP POLICY IF EXISTS "Anyone can view published books" ON public.books;
DROP POLICY IF EXISTS "Authors can view own books" ON public.books;
DROP POLICY IF EXISTS "Authors can insert books" ON public.books;
DROP POLICY IF EXISTS "Authors can update own books" ON public.books;
DROP POLICY IF EXISTS "Authors can delete own books" ON public.books;

-- Permissive SELECT: anyone can see published books
CREATE POLICY "Anyone can view published books"
ON public.books FOR SELECT
USING (status = 'Published');

-- Permissive SELECT: authors can see all their own books
CREATE POLICY "Authors can view own books"
ON public.books FOR SELECT
TO authenticated
USING (auth.uid() = author_id);

-- Permissive INSERT
CREATE POLICY "Authors can insert books"
ON public.books FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Permissive UPDATE
CREATE POLICY "Authors can update own books"
ON public.books FOR UPDATE
TO authenticated
USING (auth.uid() = author_id);

-- Permissive DELETE
CREATE POLICY "Authors can delete own books"
ON public.books FOR DELETE
TO authenticated
USING (auth.uid() = author_id);

-- Fix newsletter policies
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "No public reads on newsletter" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers FOR INSERT
WITH CHECK (true);

CREATE POLICY "No public reads on newsletter"
ON public.newsletter_subscribers FOR SELECT
USING (false);

-- Also make profiles publicly viewable so author names show in marketplace
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Anyone can view profiles"
ON public.profiles FOR SELECT
USING (true);
