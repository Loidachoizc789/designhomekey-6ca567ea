
CREATE TABLE IF NOT EXISTS public.page_views (
  id TEXT PRIMARY KEY,
  count BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.page_views (id, count) VALUES ('total', 0)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view page views"
ON public.page_views FOR SELECT
USING (true);

CREATE OR REPLACE FUNCTION public.increment_page_view()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  UPDATE public.page_views
  SET count = count + 1, updated_at = now()
  WHERE id = 'total'
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_page_view() TO anon, authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;
ALTER TABLE public.page_views REPLICA IDENTITY FULL;
