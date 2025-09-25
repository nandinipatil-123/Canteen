#!/usr/bin/env node
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔐 Admin Password Hash Generator');
console.log('This will generate a secure bcrypt hash for your admin password.');
console.log('');

rl.question('Enter admin password: ', (password) => {
  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters long');
    rl.close();
    return;
  }
  
  console.log('⏳ Generating secure hash...');
  const hash = bcrypt.hashSync(password, 12);
  
  console.log('');
  console.log('✅ Generated hash:');
  console.log(hash);
  console.log('');
  console.log('💡 Add this to your environment variables:');
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log('');
  
  rl.close();
});