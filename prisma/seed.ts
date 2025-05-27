async function main() {
  const { prisma } = await import('@/shared/api/database');
  console.log('🌱 Starting database seeding...');

  const permissions = [
    { name: 'users.read' },
    { name: 'users.write' },
    { name: 'users.delete' },
    { name: 'products.read' },
    { name: 'products.write' },
    { name: 'products.delete' },
    { name: 'admin.access' },
  ];

  console.log('📝 Creating permissions...');
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  let adminRole = await prisma.role.findFirst({
    where: { name: 'admin' },
  });
  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { name: 'admin' },
    });
  }

  let userRole = await prisma.role.findFirst({
    where: { name: 'user' },
  });
  if (!userRole) {
    userRole = await prisma.role.create({
      data: { name: 'user' },
    });
  }

  let managerRole = await prisma.role.findFirst({
    where: { name: 'manager' },
  });
  if (!managerRole) {
    managerRole = await prisma.role.create({
      data: { name: 'manager' },
    });
  }

  console.log('👑 Creating role permissions...');

  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  const managerPermissions = await prisma.permission.findMany({
    where: {
      name: {
        in: ['users.read', 'users.write', 'products.read', 'products.write'],
      },
    },
  });

  for (const permission of managerPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: managerRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: managerRole.id,
        permissionId: permission.id,
      },
    });
  }

  const userPermissions = await prisma.permission.findMany({
    where: {
      name: {
        in: ['products.read'],
      },
    },
  });

  for (const permission of userPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: userRole.id,
        permissionId: permission.id,
      },
    });
  }

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      roleId: adminRole.id,
      image:
        'https://www.shutterstock.com/image-vector/vector-design-avatar-dummy-sign-600nw-1290556063.jpg',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      roleId: userRole.id,
      image: 'https://example.com/images/user-avatar.jpg',
    },
  });

  await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      name: 'Store Manager',
      roleId: managerRole.id,
      image: 'https://example.com/images/manager-avatar.jpg',
    },
  });

  const additionalUsers = [
    {
      email: 'john.doe@example.com',
      name: 'John Doe',
      roleId: userRole.id,
      image: 'https://example.com/images/john-doe-avatar.jpg',
    },
    {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      roleId: userRole.id,
      image: 'https://example.com/images/jane-smith-avatar.jpg',
    },
  ];

  for (const user of additionalUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
      },
    });
  }

  console.log('📱 Creating sample products...');

  const sampleProducts = [
    {
      sku: 'IPHONE-14-128-BLK',
      slug: 'iphone-14-128gb-black',
      name: 'iPhone 14 128GB Black',
      description:
        'Apple iPhone 14 with 128GB storage in Black color. Excellent condition, minimal wear.',
      price: 12500000,
      imageUrl: 'https://example.com/images/iphone-14-black.jpg',
      stockQuantity: 5,
      minimumOrderQuantity: 1,
      createdBy: '',
    },
    {
      sku: 'SAMSUNG-S23-256-WHT',
      slug: 'samsung-galaxy-s23-256gb-white',
      name: 'Samsung Galaxy S23 256GB White',
      description:
        'Samsung Galaxy S23 with 256GB storage in Phantom White. Like new condition.',
      price: 11000000,
      imageUrl: 'https://example.com/images/samsung-s23-white.jpg',
      stockQuantity: 3,
      minimumOrderQuantity: 1,
      createdBy: '',
    },
    {
      sku: 'XIAOMI-13-128-BLU',
      slug: 'xiaomi-13-128gb-blue',
      name: 'Xiaomi 13 128GB Blue',
      description:
        'Xiaomi 13 with 128GB storage in Sky Blue. Good condition, some minor scratches.',
      price: 7500000,
      imageUrl: 'https://example.com/images/xiaomi-13-blue.jpg',
      stockQuantity: 8,
      minimumOrderQuantity: 1,
      createdBy: '',
    },
    {
      sku: 'OPPO-RENO8-128-GLD',
      slug: 'oppo-reno8-128gb-gold',
      name: 'OPPO Reno8 128GB Gold',
      description:
        'OPPO Reno8 with 128GB storage in Shimmer Gold. Very good condition.',
      price: 5500000,
      imageUrl: 'https://example.com/images/oppo-reno8-gold.jpg',
      stockQuantity: 6,
      minimumOrderQuantity: 1,
      createdBy: '',
    },
    {
      sku: 'VIVO-V27-256-PRP',
      slug: 'vivo-v27-256gb-purple',
      name: 'Vivo V27 256GB Purple',
      description:
        'Vivo V27 with 256GB storage in Magic Purple. Excellent camera quality, mint condition.',
      price: 6200000,
      imageUrl: 'https://example.com/images/vivo-v27-purple.jpg',
      stockQuantity: 4,
      minimumOrderQuantity: 1,
      createdBy: '',
    },
  ];

  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!adminUser) {
    throw new Error(
      'Admin user not found. Please ensure users are created first.'
    );
  }

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        ...product,
        createdBy: adminUser.id,
      },
    });
  }

  console.log('✅ Database seeding completed!');
  console.log('📊 Created:');
  console.log(`  - ${permissions.length} permissions`);
  console.log(`  - 3 roles (admin, manager, user)`);
  console.log(`  - 5 users:`);
  console.log(`    - Admin: admin@example.com / admin123`);
  console.log(`    - Manager: manager@example.com / manager123`);
  console.log(`    - User: user@example.com / user123`);
  console.log(`    - John Doe: john.doe@example.com / password123`);
  console.log(`    - Jane Smith: jane.smith@example.com / password123`);
  console.log(`  - ${sampleProducts.length} sample products`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Prisma client will be disconnected automatically when the process exits
  });
