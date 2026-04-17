
CREATE TABLE public.subcategories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_slug TEXT NOT NULL,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (category_slug, slug)
);

ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subcategories" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Admins can insert subcategories" ON public.subcategories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update subcategories" ON public.subcategories FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete subcategories" ON public.subcategories FOR DELETE USING (is_admin());

CREATE TRIGGER update_subcategories_updated_at
BEFORE UPDATE ON public.subcategories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.category_images
ADD COLUMN subcategory_slug TEXT;

CREATE INDEX idx_category_images_subcategory ON public.category_images(category_slug, subcategory_slug);
CREATE INDEX idx_subcategories_category ON public.subcategories(category_slug, display_order);

-- Seed dữ liệu mẫu cho danh mục 3D đã có sẵn (3D Event / 3D Virtual)
INSERT INTO public.subcategories (category_slug, slug, name, display_order) VALUES
  ('3d-design', '3d-event', '3D Event', 0),
  ('3d-design', '3d-virtual', '3D Virtual', 1)
ON CONFLICT (category_slug, slug) DO NOTHING;
