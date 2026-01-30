const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

// Generate hash for "Admin@1230"
hashPassword('Admin@1230').then(hash => {
  console.log('Password: Admin@1230');
  console.log('Bcrypt Hash:', hash);
  process.exit(0);
});
