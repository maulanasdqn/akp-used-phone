/**
 * Database Seeding Script
 *
 * This script populates the database with initial data for development and testing.
 * It creates a complete RBAC system with roles, permissions, users, and sample products.
 *
 * Features:
 * - Idempotent operations (safe to run multiple times)
 * - Comprehensive RBAC setup
 * - Sample data for all major entities
 * - Proper error handling and logging
 *
 * Usage:
 * - Development: bun run db:seed
 * - Production: Should be run once during initial deployment
 */

async function main() {
  const { prisma } = await import('@/shared/api/database');
  console.log('🌱 Starting database seeding...');

  /**
   * Create system permissions
   *
   * These permissions define granular access controls for different
   * parts of the application. They follow a resource.action pattern.
   */
  const permissions = [
    { name: 'users.read' }, // View user information
    { name: 'users.write' }, // Create and update users
    { name: 'users.delete' }, // Delete users
    { name: 'products.read' }, // View products
    { name: 'products.write' }, // Create and update products
    { name: 'products.delete' }, // Delete products
    { name: 'admin.access' }, // Access admin panel
  ];

  console.log('📝 Creating permissions...');
  // Use upsert to make this operation idempotent
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {}, // No updates needed if exists
      create: permission,
    });
  }

  /**
   * Create system roles
   *
   * Three-tier role system:
   * - Admin: Full system access
   * - Manager: Business operations access
   * - User: Basic customer access
   */
  console.log('👑 Creating roles...');

  // Admin role - full system access
  let adminRole = await prisma.role.findFirst({
    where: { name: 'admin' },
  });
  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: { name: 'admin' },
    });
  }

  // User role - basic customer access
  let userRole = await prisma.role.findFirst({
    where: { name: 'user' },
  });
  if (!userRole) {
    userRole = await prisma.role.create({
      data: { name: 'user' },
    });
  }

  // Manager role - business operations access
  let managerRole = await prisma.role.findFirst({
    where: { name: 'manager' },
  });
  if (!managerRole) {
    managerRole = await prisma.role.create({
      data: { name: 'manager' },
    });
  }

  console.log('👑 Creating role permissions...');

  /**
   * Assign all permissions to admin role
   *
   * Admins have unrestricted access to all system functions
   */
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

  /**
   * Assign limited permissions to manager role
   *
   * Managers can:
   * - Read and write users (for customer service)
   * - Read and write products (for inventory management)
   * - Cannot delete users or access full admin panel
   */
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

  /**
   * Assign minimal permissions to user role
   *
   * Regular users can only:
   * - Read products (browse the store)
   * - Manage their own profile (handled by authentication)
   */
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

  /**
   * Create system users
   *
   * These users are created for testing and initial system access.
   * In production, the admin user should have their password changed immediately.
   */
  console.log('👥 Creating users...');

  // System administrator
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

  // Regular customer user
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

  // Store manager
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

  /**
   * Create additional test users
   *
   * These users provide more data for testing pagination,
   * user management features, and general application testing.
   */
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

  /**
   * Sample product data
   *
   * These products represent typical used phone inventory.
   * Prices are in Indonesian Rupiah (IDR).
   *
   * Each product includes:
   * - Unique SKU for inventory management
   * - SEO-friendly slug for URLs
   * - Realistic pricing and stock levels
   * - Proper categorization and descriptions
   */
  const sampleProducts = [
    {
      sku: 'IPHONE-14-128-BLK',
      slug: 'iphone-14-128gb-black',
      name: 'iPhone 14 128GB Black',
      description:
        'Apple iPhone 14 with 128GB storage in Black color. Excellent condition, minimal wear.',
      price: 12500000, // Rp 12,500,000
      imageUrl: 'https://example.com/images/iphone-14-black.jpg',
      stockQuantity: 5,
      minimumOrderQuantity: 1,
      createdBy: '', // Will be set to admin user ID
    },
    {
      sku: 'SAMSUNG-S23-256-WHT',
      slug: 'samsung-galaxy-s23-256gb-white',
      name: 'Samsung Galaxy S23 256GB White',
      description:
        'Samsung Galaxy S23 with 256GB storage in Phantom White. Like new condition.',
      price: 11000000, // Rp 11,000,000
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
      price: 7500000, // Rp 7,500,000
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
      price: 5500000, // Rp 5,500,000
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
      price: 6200000, // Rp 6,200,000
      imageUrl: 'https://example.com/images/vivo-v27-purple.jpg',
      stockQuantity: 4,
      minimumOrderQuantity: 1,
      createdBy: '',
    },
  ];

  /**
   * Get admin user for product creation
   *
   * All sample products are created by the admin user to maintain
   * proper audit trails and ownership.
   */
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!adminUser) {
    throw new Error(
      'Admin user not found. Please ensure users are created first.'
    );
  }

  // Create each product with proper ownership
  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        ...product,
        createdBy: adminUser.id, // Set admin as creator
      },
    });
  }

  /**
   * Seeding completion summary
   *
   * Display what was created for easy reference during development
   */
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

/**
 * Execute seeding with proper error handling
 *
 * The script will exit with code 1 if any errors occur,
 * making it suitable for CI/CD pipelines and automated deployments.
 */
main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Prisma client will be disconnected automatically when the process exits
  });
