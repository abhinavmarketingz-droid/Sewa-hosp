// This script tests bcryptjs hash generation
// Run with: node scripts/test-bcrypt-hash.js

const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Admin@1230';
  const rounds = 10;
  
  console.log('Generating bcryptjs hash...');
  console.log('Password:', password);
  console.log('Rounds:', rounds);
  
  try {
    const hash = await bcrypt.hash(password, rounds);
    console.log('\nGenerated hash:');
    console.log(hash);
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('\nHash verification:');
    console.log('Password matches hash:', isValid);
    
    // Output SQL
    console.log('\nSQL to update database:');
    console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE email = 'admin@it.com';`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

generateHash();
