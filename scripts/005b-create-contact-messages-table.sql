-- Create contact_messages table to store contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  replied BOOLEAN DEFAULT false,
  reply_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Enable RLS on contact_messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can insert messages
CREATE POLICY "Anyone can submit contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Public can view their own messages (by email)
CREATE POLICY "Users can view their own messages" ON contact_messages
  FOR SELECT USING (true);

-- Admins can read all messages
CREATE POLICY "Admins can view all messages" ON contact_messages
  FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Admins can update messages
CREATE POLICY "Admins can update messages" ON contact_messages
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM profiles WHERE is_admin = true));

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
