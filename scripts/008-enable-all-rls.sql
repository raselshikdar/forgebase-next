-- =============================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_details ENABLE ROW LEVEL SECURITY;

-- =============================================
-- BLOG LIKES POLICIES
-- =============================================
DROP POLICY IF EXISTS "Anyone can view blog likes" ON blog_likes;
CREATE POLICY "Anyone can view blog likes" ON blog_likes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can like blogs" ON blog_likes;
CREATE POLICY "Anyone can like blogs" ON blog_likes
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can unlike their own likes" ON blog_likes;
CREATE POLICY "Users can unlike their own likes" ON blog_likes
    FOR DELETE USING (true);

-- =============================================
-- BLOG SHARES POLICIES
-- =============================================
DROP POLICY IF EXISTS "Anyone can view blog shares" ON blog_shares;
CREATE POLICY "Anyone can view blog shares" ON blog_shares
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can share blogs" ON blog_shares;
CREATE POLICY "Anyone can share blogs" ON blog_shares
    FOR INSERT WITH CHECK (true);

-- =============================================
-- BLOG COMMENTS POLICIES
-- =============================================
DROP POLICY IF EXISTS "Anyone can view approved comments" ON blog_comments;
CREATE POLICY "Anyone can view approved comments" ON blog_comments
    FOR SELECT USING (approved = true);

DROP POLICY IF EXISTS "Admins can view all comments" ON blog_comments;
CREATE POLICY "Admins can view all comments" ON blog_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

DROP POLICY IF EXISTS "Anyone can submit comments" ON blog_comments;
CREATE POLICY "Anyone can submit comments" ON blog_comments
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update comments" ON blog_comments;
CREATE POLICY "Admins can update comments" ON blog_comments
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

DROP POLICY IF EXISTS "Admins can delete comments" ON blog_comments;
CREATE POLICY "Admins can delete comments" ON blog_comments
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- =============================================
-- COMMENT REPLIES POLICIES
-- =============================================
DROP POLICY IF EXISTS "Anyone can view approved replies" ON comment_replies;
CREATE POLICY "Anyone can view approved replies" ON comment_replies
    FOR SELECT USING (approved = true);

DROP POLICY IF EXISTS "Admins can view all replies" ON comment_replies;
CREATE POLICY "Admins can view all replies" ON comment_replies
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

DROP POLICY IF EXISTS "Anyone can submit replies" ON comment_replies;
CREATE POLICY "Anyone can submit replies" ON comment_replies
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage replies" ON comment_replies;
CREATE POLICY "Admins can manage replies" ON comment_replies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- =============================================
-- CONTACT MESSAGES POLICIES
-- =============================================
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON contact_messages;
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all contact messages" ON contact_messages;
CREATE POLICY "Admins can view all contact messages" ON contact_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

DROP POLICY IF EXISTS "Admins can update contact messages" ON contact_messages;
CREATE POLICY "Admins can update contact messages" ON contact_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

DROP POLICY IF EXISTS "Admins can delete contact messages" ON contact_messages;
CREATE POLICY "Admins can delete contact messages" ON contact_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- =============================================
-- GALLERY PHOTOS POLICIES
-- =============================================
DROP POLICY IF EXISTS "Anyone can view gallery photos" ON gallery_photos;
CREATE POLICY "Anyone can view gallery photos" ON gallery_photos
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage gallery photos" ON gallery_photos;
CREATE POLICY "Admins can manage gallery photos" ON gallery_photos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- =============================================
-- GALLERY VIDEOS POLICIES
-- =============================================
DROP POLICY IF EXISTS "Anyone can view gallery videos" ON gallery_videos;
CREATE POLICY "Anyone can view gallery videos" ON gallery_videos
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage gallery videos" ON gallery_videos;
CREATE POLICY "Admins can manage gallery videos" ON gallery_videos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- =============================================
-- GALLERY AUDIOS POLICIES
-- =============================================
DROP POLICY IF EXISTS "Anyone can view gallery audios" ON gallery_audios;
CREATE POLICY "Anyone can view gallery audios" ON gallery_audios
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage gallery audios" ON gallery_audios;
CREATE POLICY "Admins can manage gallery audios" ON gallery_audios
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- =============================================
-- GALLERY NOTES POLICIES
-- =============================================
DROP POLICY IF EXISTS "Anyone can view gallery notes" ON gallery_notes;
CREATE POLICY "Anyone can view gallery notes" ON gallery_notes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage gallery notes" ON gallery_notes;
CREATE POLICY "Admins can manage gallery notes" ON gallery_notes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- =============================================
-- GALLERY QUOTES POLICIES
-- =============================================
DROP POLICY IF EXISTS "Anyone can view gallery quotes" ON gallery_quotes;
CREATE POLICY "Anyone can view gallery quotes" ON gallery_quotes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage gallery quotes" ON gallery_quotes;
CREATE POLICY "Admins can manage gallery quotes" ON gallery_quotes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- =============================================
-- ABOUT DETAILS POLICIES
-- =============================================
DROP POLICY IF EXISTS "Anyone can view about details" ON about_details;
CREATE POLICY "Anyone can view about details" ON about_details
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage about details" ON about_details;
CREATE POLICY "Admins can manage about details" ON about_details
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_admin = true
        )
    );

-- =============================================
-- DONE!
-- =============================================
