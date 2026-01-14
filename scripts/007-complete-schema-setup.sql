-- =============================================
-- COMPLETE DATABASE SCHEMA SETUP
-- Run this script to set up all required tables
-- =============================================

-- ===================
-- 1. UPDATE BLOGS TABLE - Add missing columns
-- ===================
DO $$
BEGIN
    -- Add featured column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'featured') THEN
        ALTER TABLE blogs ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;
    
    -- Add category column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'category') THEN
        ALTER TABLE blogs ADD COLUMN category TEXT DEFAULT 'General';
    END IF;
    
    -- Add likes_count column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'likes_count') THEN
        ALTER TABLE blogs ADD COLUMN likes_count INTEGER DEFAULT 0;
    END IF;
    
    -- Add comments_count column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'comments_count') THEN
        ALTER TABLE blogs ADD COLUMN comments_count INTEGER DEFAULT 0;
    END IF;
    
    -- Add shares_count column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blogs' AND column_name = 'shares_count') THEN
        ALTER TABLE blogs ADD COLUMN shares_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- ===================
-- 2. UPDATE PRODUCTS TABLE - Add missing columns
-- ===================
DO $$
BEGIN
    -- Add category column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'category') THEN
        ALTER TABLE products ADD COLUMN category TEXT DEFAULT 'Digital';
    END IF;
    
    -- Add external_link column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'external_link') THEN
        ALTER TABLE products ADD COLUMN external_link TEXT;
    END IF;
END $$;

-- ===================
-- 3. CREATE BLOG LIKES TABLE
-- ===================
CREATE TABLE IF NOT EXISTS blog_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(blog_id, session_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_session_id ON blog_likes(session_id);

-- ===================
-- 4. CREATE BLOG SHARES TABLE
-- ===================
CREATE TABLE IF NOT EXISTS blog_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_shares_blog_id ON blog_shares(blog_id);

-- ===================
-- 5. CREATE BLOG COMMENTS TABLE
-- ===================
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_approved ON blog_comments(approved);

-- ===================
-- 6. CREATE COMMENT REPLIES TABLE
-- ===================
CREATE TABLE IF NOT EXISTS comment_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES blog_comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comment_replies_comment_id ON comment_replies(comment_id);

-- ===================
-- 7. CREATE CONTACT MESSAGES TABLE
-- ===================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread',
    replied BOOLEAN DEFAULT false,
    reply_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- ===================
-- 8. CREATE GALLERY PHOTOS TABLE
-- ===================
CREATE TABLE IF NOT EXISTS gallery_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_photos_display_order ON gallery_photos(display_order);

-- ===================
-- 9. CREATE GALLERY VIDEOS TABLE
-- ===================
CREATE TABLE IF NOT EXISTS gallery_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    youtube_url TEXT NOT NULL,
    thumbnail_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_videos_display_order ON gallery_videos(display_order);

-- ===================
-- 10. CREATE GALLERY AUDIOS TABLE
-- ===================
CREATE TABLE IF NOT EXISTS gallery_audios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL,
    cover_image TEXT,
    duration TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_audios_display_order ON gallery_audios(display_order);

-- ===================
-- 11. CREATE GALLERY NOTES TABLE
-- ===================
CREATE TABLE IF NOT EXISTS gallery_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_notes_display_order ON gallery_notes(display_order);

-- ===================
-- 12. CREATE GALLERY QUOTES TABLE
-- ===================
CREATE TABLE IF NOT EXISTS gallery_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote TEXT NOT NULL,
    author TEXT,
    source TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_quotes_display_order ON gallery_quotes(display_order);

-- ===================
-- 13. CREATE ABOUT DETAILS TABLE
-- ===================
CREATE TABLE IF NOT EXISTS about_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_title TEXT NOT NULL,
    content TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_about_details_display_order ON about_details(display_order);

-- ===================
-- 14. CREATE INCREMENT BLOG VIEWS FUNCTION
-- ===================
CREATE OR REPLACE FUNCTION increment_blog_views(blog_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blogs SET views = views + 1 WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================
-- 15. CREATE FUNCTION TO UPDATE BLOG INTERACTION COUNTS
-- ===================
CREATE OR REPLACE FUNCTION update_blog_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blogs SET likes_count = likes_count + 1 WHERE id = NEW.blog_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blogs SET likes_count = likes_count - 1 WHERE id = OLD.blog_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_blog_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blogs SET comments_count = comments_count + 1 WHERE id = NEW.blog_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blogs SET comments_count = comments_count - 1 WHERE id = OLD.blog_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_blog_shares_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blogs SET shares_count = shares_count + 1 WHERE id = NEW.blog_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist, then create new ones
DROP TRIGGER IF EXISTS trigger_update_blog_likes_count ON blog_likes;
CREATE TRIGGER trigger_update_blog_likes_count
AFTER INSERT OR DELETE ON blog_likes
FOR EACH ROW EXECUTE FUNCTION update_blog_likes_count();

DROP TRIGGER IF EXISTS trigger_update_blog_comments_count ON blog_comments;
CREATE TRIGGER trigger_update_blog_comments_count
AFTER INSERT OR DELETE ON blog_comments
FOR EACH ROW EXECUTE FUNCTION update_blog_comments_count();

DROP TRIGGER IF EXISTS trigger_update_blog_shares_count ON blog_shares;
CREATE TRIGGER trigger_update_blog_shares_count
AFTER INSERT ON blog_shares
FOR EACH ROW EXECUTE FUNCTION update_blog_shares_count();

-- ===================
-- DONE!
-- ===================
