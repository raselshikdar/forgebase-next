-- Create blog_comment_replies table for nested comment replies
CREATE TABLE IF NOT EXISTS blog_comment_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES blog_comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_blog_comment_replies_comment_id ON blog_comment_replies(comment_id);
CREATE INDEX IF NOT EXISTS idx_blog_comment_replies_approved ON blog_comment_replies(approved);
CREATE INDEX IF NOT EXISTS idx_blog_comment_replies_created_at ON blog_comment_replies(created_at DESC);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_comment_replies_updated_at ON blog_comment_replies;
CREATE TRIGGER update_comment_replies_updated_at
  BEFORE UPDATE ON blog_comment_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE blog_comment_replies ENABLE ROW LEVEL SECURITY;

-- Public can view approved replies
CREATE POLICY "Anyone can view approved replies" ON blog_comment_replies
  FOR SELECT USING (approved = true);

-- Anyone can add replies
CREATE POLICY "Anyone can add comment replies" ON blog_comment_replies
  FOR INSERT WITH CHECK (true);

-- Admins can manage replies
CREATE POLICY "Admins can manage replies" ON blog_comment_replies
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

CREATE POLICY "Admins can delete replies" ON blog_comment_replies
  FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
