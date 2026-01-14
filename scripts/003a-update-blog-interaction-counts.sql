-- Create function to update likes count for a blog
CREATE OR REPLACE FUNCTION update_blog_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE blogs SET likes_count = likes_count + 1 WHERE id = NEW.blog_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE blogs SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.blog_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update likes count
DROP TRIGGER IF EXISTS update_blog_likes_count_trigger ON blog_likes;
CREATE TRIGGER update_blog_likes_count_trigger
  AFTER INSERT OR DELETE ON blog_likes
  FOR EACH ROW EXECUTE FUNCTION update_blog_likes_count();

-- Create function to update comments count for a blog
CREATE OR REPLACE FUNCTION update_blog_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.approved THEN
    UPDATE blogs SET comments_count = comments_count + 1 WHERE id = NEW.blog_id;
  ELSIF TG_OP = 'DELETE' AND OLD.approved THEN
    UPDATE blogs SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.blog_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.approved AND NOT OLD.approved THEN
      UPDATE blogs SET comments_count = comments_count + 1 WHERE id = NEW.blog_id;
    ELSIF NOT NEW.approved AND OLD.approved THEN
      UPDATE blogs SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = NEW.blog_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update comments count
DROP TRIGGER IF EXISTS update_blog_comments_count_trigger ON blog_comments;
CREATE TRIGGER update_blog_comments_count_trigger
  AFTER INSERT OR DELETE OR UPDATE ON blog_comments
  FOR EACH ROW EXECUTE FUNCTION update_blog_comments_count();

-- Create function to update shares count for a blog
CREATE OR REPLACE FUNCTION update_blog_shares_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE blogs SET shares_count = shares_count + 1 WHERE id = NEW.blog_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE blogs SET shares_count = GREATEST(shares_count - 1, 0) WHERE id = OLD.blog_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update shares count
DROP TRIGGER IF EXISTS update_blog_shares_count_trigger ON blog_shares;
CREATE TRIGGER update_blog_shares_count_trigger
  AFTER INSERT OR DELETE ON blog_shares
  FOR EACH ROW EXECUTE FUNCTION update_blog_shares_count();
