-- Migrate ảnh
UPDATE category_images SET category_slug = '3d-design', subcategory_slug = '3d-event' WHERE category_slug = '3d-event';
UPDATE category_images SET category_slug = '3d-design', subcategory_slug = '3d-virtual' WHERE category_slug = '3d-virtual';
UPDATE category_images SET category_slug = 'noi-ngoai-that', subcategory_slug = 'noi-that' WHERE category_slug = 'noi-that';
UPDATE category_images SET category_slug = 'noi-ngoai-that', subcategory_slug = 'ngoai-that' WHERE category_slug = 'ngoai-that';

-- Tạo sub Nội Thất / Ngoại Thất
INSERT INTO subcategories (category_slug, slug, name, display_order) VALUES
  ('noi-ngoai-that', 'noi-that', 'Nội Thất', 0),
  ('noi-ngoai-that', 'ngoai-that', 'Ngoại Thất', 1)
ON CONFLICT DO NOTHING;

-- Pricing: gộp về cha (không có UNIQUE nên update an toàn)
UPDATE category_pricing SET category_slug = '3d-design' WHERE category_slug IN ('3d-event','3d-virtual');
UPDATE category_pricing SET category_slug = 'noi-ngoai-that' WHERE category_slug IN ('noi-that','ngoai-that');

-- Pricing notes có UNIQUE(category_slug): xóa bản trùng, giữ 1 bản rồi đổi slug
DELETE FROM category_pricing_notes WHERE category_slug = '3d-virtual';
UPDATE category_pricing_notes SET category_slug = '3d-design' WHERE category_slug = '3d-event';

DELETE FROM category_pricing_notes WHERE category_slug = 'ngoai-that';
UPDATE category_pricing_notes SET category_slug = 'noi-ngoai-that' WHERE category_slug = 'noi-that';

-- Page images
UPDATE category_page_images SET category_slug = '3d-design' WHERE category_slug IN ('3d-event','3d-virtual');
UPDATE category_page_images SET category_slug = 'noi-ngoai-that' WHERE category_slug IN ('noi-that','ngoai-that');

-- Xóa sub test "1"
DELETE FROM subcategories WHERE category_slug = 'after-effects' AND slug = '1';