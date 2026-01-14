-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Blogs policies (public read, admin write)
CREATE POLICY "Published blogs are viewable by everyone" ON blogs
  FOR SELECT USING (published = true OR auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

CREATE POLICY "Admins can insert blogs" ON blogs
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

CREATE POLICY "Admins can update blogs" ON blogs
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

CREATE POLICY "Admins can delete blogs" ON blogs
  FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Blog tags policies
CREATE POLICY "Blog tags are viewable by everyone" ON blog_tags
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage blog tags" ON blog_tags
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Projects policies (public read, admin write)
CREATE POLICY "Projects are viewable by everyone" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

CREATE POLICY "Admins can update projects" ON projects
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

CREATE POLICY "Admins can delete projects" ON projects
  FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Products policies (public read, admin write)
CREATE POLICY "Active products are viewable by everyone" ON products
  FOR SELECT USING (active = true OR auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));
