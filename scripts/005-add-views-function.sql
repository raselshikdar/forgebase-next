-- Function to increment blog views
CREATE OR REPLACE FUNCTION increment_blog_views(blog_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE blogs
  SET views = views + 1
  WHERE slug = blog_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
