ALTER TABLE public.subcategories REPLICA IDENTITY FULL;
ALTER TABLE public.category_images REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.subcategories;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.category_images;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;