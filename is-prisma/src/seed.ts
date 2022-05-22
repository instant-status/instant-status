import { Users } from "@prisma/client";

import { prisma } from "./index";

const userData: Omit<Users, "id" | "created_at">[] = [
  {
    email: "dev@instantstatus.local",
    first_name: "IS",
    last_name: "Dev",
    is_super_admin: true,
  },
];

const load = async () => {
  try {
    await prisma.users.createMany({
      data: userData,
    });
    console.log("Seeded user data");
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
