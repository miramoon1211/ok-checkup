
-- Add user_id column
ALTER TABLE public.checklist_items
  ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Remove old shared data
DELETE FROM public.checklist_items;

-- Make user_id NOT NULL now that old data is gone
ALTER TABLE public.checklist_items
  ALTER COLUMN user_id SET NOT NULL;

-- Drop old permissive policies
DROP POLICY IF EXISTS "Anyone can view checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can update checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can insert checklist items" ON public.checklist_items;
DROP POLICY IF EXISTS "Anyone can delete checklist items" ON public.checklist_items;

-- Create user-scoped policies
CREATE POLICY "Users can view own items"
  ON public.checklist_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items"
  ON public.checklist_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
  ON public.checklist_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items"
  ON public.checklist_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
