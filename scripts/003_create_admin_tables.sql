-- Table: admin_users (for admin panel access - separate from auth.users for flexibility)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin', -- 'super_admin', 'admin', 'editor'
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: audit_log (track all admin actions)
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Admin users can read their own record
CREATE POLICY "Admin can read own profile" ON admin_users FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to check if they are admin
CREATE POLICY "Check admin status" ON admin_users FOR SELECT USING (auth.uid() IS NOT NULL);
