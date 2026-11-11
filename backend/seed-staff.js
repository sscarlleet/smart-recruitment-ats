require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const staff = [
  { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD, role: 'ADMIN', name: 'Admin' },
  { email: process.env.SEED_HR_EMAIL,    password: process.env.SEED_HR_PASSWORD,    role: 'HR',    name: 'HR Manager' },
];

async function main() {
  for (const s of staff) {
    if (!s.email || !s.password) {
      throw new Error(`Missing email or password in .env for ${s.role}`);
    }
    if (s.password.length < 12 || Buffer.byteLength(s.password, 'utf8') > 72) {
      throw new Error(`${s.role} password must be 12-72 bytes`);
    }

    const hashed = await bcrypt.hash(s.password, 12);

    await prisma.user.upsert({
      where: { email: s.email },
      update: { password: hashed, role: s.role },
      create: { email: s.email, password: hashed, role: s.role, name: s.name },
    });

    console.log(`${s.role} ready: ${s.email}`);
  }
}

main()
  .catch((e) => { console.error('Seeding failed:', e.message); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
