-- Create a default admin user (password: Admin@123)
-- In production, change this password immediately after first login

INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES (
  'admin@sewa-hospitality.com',
  '$2a$10$D.DE5LbHPDOws5XojNdXb.9J7nSIJy2IxC/nwhYETLWNgD4.0tPZG', -- bcrypt hash of 'Admin@123'
  'Admin User',
  'super_admin',
  true
)
ON CONFLICT (email) DO NOTHING;
