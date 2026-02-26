
CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings
CREATE POLICY "Anyone can read settings" ON public.site_settings FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL USING (public.is_admin(auth.uid()));

INSERT INTO public.site_settings (id, value) VALUES ('pricing_visible', '{"enabled": true}');
