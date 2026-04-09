
-- Create checklist_items table
CREATE TABLE public.checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT false,
  memo TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read (no auth needed for this app)
CREATE POLICY "Anyone can view checklist items"
  ON public.checklist_items FOR SELECT
  USING (true);

-- Allow everyone to update checklist items
CREATE POLICY "Anyone can update checklist items"
  ON public.checklist_items FOR UPDATE
  USING (true);

-- Allow everyone to insert checklist items
CREATE POLICY "Anyone can insert checklist items"
  ON public.checklist_items FOR INSERT
  WITH CHECK (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_checklist_items_updated_at
  BEFORE UPDATE ON public.checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed sample data
INSERT INTO public.checklist_items (title, category, sort_order) VALUES
  ('고객정보 접근권한 확인', '월간 점검', 1),
  ('비밀번호 변경 여부', '월간 점검', 2),
  ('문서 보관 상태', '월간 점검', 3),
  ('시스템 로그 점검', '분기 점검', 4),
  ('외부감사 자료 준비', '분기 점검', 5),
  ('규정 변경사항 반영', '분기 점검', 6);
