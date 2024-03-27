import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const seed = async () => {
  try {
    const superAdminRole = await prisma.role.upsert({
      where: { slug: "superAdmin" },
      update: {},
      create: {
        name: "SuperAdmin",
        slug: "superAdmin",
      },
    });
    const password = "super@123";
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.upsert({
      where: { email: "superadmin@admin.com" },
      update: {},
      create: {
        email: "superadmin@admin.com",
        name: "Superadmin",
        password: hashedPassword,
        roleId: superAdminRole.id,
      },
    });

    await prisma.role.createMany({
      data: [
        {
          name: "Restaurant Admin",
          slug: "restaurantAdmin",
        },
        {
          name: "Delivery Partner",
          slug: "deliveryPartner",
        },
        {
          name: "Customer",
          slug: "customer",
        },
      ],
    });

    await prisma.menuCategory.createMany({
      data: [
        {
          name: "Breakfast",
          slug: "breakfast",
        },
        {
          name: "Lunch",
          slug: "lunch",
        },
        {
          name: "Dinner",
          slug: "dinner",
        },
        {
          name: "Snacks",
          slug: "snacks",
        },
      ],
    });

    const superAdminRolePermissions: { roleId: number }[] = [];

    if (superAdminRole.id) {
      const usersModule = await prisma.module.findFirst({
        where: {
          slug: "users",
        },
      });

      if (!usersModule?.id) {
        await prisma.module.create({
          data: {
            name: "Users",
            slug: "users",
            description: "Users Module",
            sortOrder: 1,
            permission: {
              create: [
                {
                  name: "Full",
                  slug: "full",
                  description: "Full Permission",
                  sortOrder: 1,
                  rolePermissions: {
                    create: superAdminRolePermissions,
                  },
                },
              ],
            },
          },
        });
      }
    }

    const restaurantRolePermissions: { roleId: number }[] = [];

    const restaurantAdminRole = await prisma.role.findFirst({
      where: {
        slug: "restaurantAdmin",
      },
    });

    if (restaurantAdminRole?.id) {
      restaurantRolePermissions.push({
        roleId: restaurantAdminRole.id,
      });

      const restaurantModule = await prisma.module.findFirst({
        where: {
          slug: "restaurants",
        },
      });

      if (!restaurantModule?.id) {
        await prisma.module.create({
          data: {
            name: "Restaurants",
            slug: "restaurants",
            description: "Restaurants Module",
            sortOrder: 1,
            permission: {
              create: [
                {
                  name: "Full",
                  slug: "full",
                  description: "Full Permission",
                  sortOrder: 1,
                  rolePermissions: {
                    create: restaurantRolePermissions,
                  },
                },
              ],
            },
          },
        });
      }

      const foodItemsModule = await prisma.module.findFirst({
        where: {
          slug: "food-items",
        },
      });

      if (!foodItemsModule?.id) {
        await prisma.module.create({
          data: {
            name: "Food Items",
            slug: "food-items",
            description: "Food Items Module",
            sortOrder: 2,
            permission: {
              create: [
                {
                  name: "Full",
                  slug: "full",
                  description: "Full Permission",
                  sortOrder: 1,
                  rolePermissions: {
                    create: restaurantRolePermissions,
                  },
                },
              ],
            },
          },
        });
      }

      const taxFeesModule = await prisma.module.findFirst({
        where: {
          slug: "food-items",
        },
      });

      if (!taxFeesModule?.id) {
        await prisma.module.create({
          data: {
            name: "Tax Fees",
            slug: "tax-fees",
            description: "Tax Fees Module",
            sortOrder: 2,
            permission: {
              create: [
                {
                  name: "Full",
                  slug: "full",
                  description: "Full Permission",
                  sortOrder: 1,
                  rolePermissions: {
                    create: restaurantRolePermissions,
                  },
                },
              ],
            },
          },
        });
      }
    }

    console.log({ user });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
