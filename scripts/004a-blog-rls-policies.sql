-- Row Level Security policies for blog interactions

-- Blog Likes RLS
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blog likes" ON blog_likes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can add blog likes" ON blog_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their own likes" ON blog_likes
  FOR DELETE USING (
    session_id IS NOT NULL OR 
    (user_id IS NOT NULL AND auth.uid() = user_id)
  );

-- Blog Comments RLS
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved comments" ON blog_comments
  FOR SELECT USING (approved = true OR auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

CREATE POLICY "Anyone can insert comments" ON blog_comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update comments" ON blog_comments
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

CREATE POLICY "Admins can delete comments" ON blog_comments
  FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Blog Shares RLS
ALTER TABLE blog_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blog shares" ON blog_shares
  FOR SELECT USING (true);

CREATE POLICY "Anyone can track blog shares" ON blog_shares
  FOR INSERT WITH CHECK (true);
