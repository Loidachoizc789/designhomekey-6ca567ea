-- Create homepage_stats table for managing hero section statistics
CREATE TABLE public.homepage_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key TEXT NOT NULL UNIQUE,
  stat_value TEXT NOT NULL,
  stat_label TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_stats ENABLE ROW LEVEL SECURITY;

-- Public can read stats
CREATE POLICY "Anyone can view homepage stats" 
ON public.homepage_stats 
FOR SELECT 
USING (true);

-- Only admins can modify
CREATE POLICY "Admins can insert homepage stats" 
ON public.homepage_stats 
FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update homepage stats" 
ON public.homepage_stats 
FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete homepage stats" 
ON public.homepage_stats 
FOR DELETE 
USING (public.is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_homepage_stats_updated_at
BEFORE UPDATE ON public.homepage_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default stats
INSERT INTO public.homepage_stats (stat_key, stat_value, stat_label, display_order) VALUES
('asset_3d', '500+', 'ASSET 3D', 1),
('projects', '50+', 'DỰ ÁN HOÀN THÀNH', 2),
('realtime', '100%', 'REALTIME RENDER', 3);