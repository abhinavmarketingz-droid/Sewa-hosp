#!/usr/bin/env node

/**
 * This script generates a bcrypt hash for admin passwords
 * Run: node scripts/generate-admin-password.js
 */

const bcrypt = require('bcryptjs');

async function generatePasswordHash(password = 'admin123') {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    console.log('\n========================================');
    console.log('BCRYPT PASSWORD HASH GENERATOR');
    console.log('========================================');
    console.log(`\nPassword: ${password}`);
    console.log(`\nBcrypt Hash (copy this):\n${hash}\n`);
    console.log('========================================\n');
    
    // Also verify it works
    const isMatch = await bcrypt.compare(password, hash);
    console.log(`Verification: ${isMatch ? '✓ PASS' : '✗ FAIL'}\n`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

generatePasswordHash('admin123');
