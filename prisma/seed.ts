import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hash('Admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      name: 'مدیر سیستم',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create manager user
  const managerPassword = await hash('Manager123', 12);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@gmail.com' },
    update: {},
    create: {
      email: 'manager@gmail.com',
      name: 'مدیر پروژه',
      password: managerPassword,
      role: 'MANAGER',
    },
  });

  // Create member user
  const memberPassword = await hash('Member123', 12);
  const member = await prisma.user.upsert({
    where: { email: 'member@gmail.com' },
    update: {},
    create: {
      email: 'member@gmail.com',
      name: 'عضو تیم',
      password: memberPassword,
      role: 'MEMBER',
    },
  });

  console.log({ admin, manager, member });
  console.log('Seed data created successfully!');
  console.log('\nTest Accounts:');
  console.log('Admin: admin@gmail.com / Admin123');
  console.log('Manager: manager@gmail.com / Manager123');
  console.log('Member: member@gmail.com / Member123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
