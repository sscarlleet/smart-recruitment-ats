
require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_HR_EMAIL;
  const password = process.env.SEED_HR_PASSWORD;

  if (!email || !password) {
    throw new Error('HR email or password is missing from .env');
  }

  if (
    password.length < 12 ||
    Buffer.byteLength(password, 'utf8') > 72
  ) {
    throw new Error('Password must be between 12 and 72 bytes');
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('HR account does not exist');
  }

  if (user.role !== 'HR' && user.role !== 'ADMIN') {
    throw new Error('Account is not an HR or Admin account');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  console.log('HR password updated successfully.');
  console.log('Account:', email);
  console.log('Role:', user.role);
}

main()
  .catch((error) => {
    console.error('Password reset failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
