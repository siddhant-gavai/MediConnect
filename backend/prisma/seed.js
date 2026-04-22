const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seed started...');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  // 1. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mediconnect.com' },
    update: {},
    create: {
      name: 'Global Admin',
      email: 'admin@mediconnect.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 2. Create a Doctor (Unverified initially)
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@mediconnect.com' },
    update: {},
    create: {
      name: 'Gregory House',
      email: 'doctor@mediconnect.com',
      password: hashedPassword,
      role: 'DOCTOR',
    },
  });

  const doctorProfile = await prisma.doctorProfile.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      specialization: 'Cardiology',
      experience: 15,
      fees: 150,
      about: 'Expert in infectious diseases and cardiology with a unique diagnostic approach.',
      isVerified: true,
    },
  });

  // 3. Create a Patient
  const patient = await prisma.user.upsert({
    where: { email: 'patient@mediconnect.com' },
    update: {},
    create: {
      name: 'John Wilson',
      email: 'patient@mediconnect.com',
      password: hashedPassword,
      role: 'PATIENT',
    },
  });

  console.log('Seed completed successfully!');
  console.log('--- Credentials ---');
  console.log('Admin:', 'admin@mediconnect.com / password123');
  console.log('Doctor:', 'doctor@mediconnect.com / password123');
  console.log('Patient:', 'patient@mediconnect.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
