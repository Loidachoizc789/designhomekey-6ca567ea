-- Create table for category page images (deliverables section, etc.)
CREATE TABLE public.category_page_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_slug TEXT NOT NULL,
  section_key TEXT NOT NULL, -- e.g., 'deliverables', 'hero', etc.
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category_slug, section_key)
);

-- Enable RLS
ALTER TABLE public.category_page_images ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Anyone can view category page images" 
ON public.category_page_images 
FOR SELECT 
USING (true);

-- Only admins can modify
CREATE POLICY "Admins can insert category page images" 
ON public.category_page_images 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update category page images" 
ON public.category_page_images 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete category page images" 
ON public.category_page_images 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_category_page_images_updated_at
BEFORE UPDATE ON public.category_page_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();