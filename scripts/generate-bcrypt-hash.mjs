import bcrypt from 'bcryptjs';

async function generateHash() {
  const password = 'Admin@1230';
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log('Password:', password);
    console.log('Bcryptjs Hash:');
    console.log(hash);
    console.log('\nUse this SQL to update the database:');
    console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE email = 'admin@it.com';`);
  } catch (error) {
    console.error('Error:', error);
  }
}

generateHash();
