import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  // TODO: Add google login support
  // socialProviders: {
  user: {
    additionalFields: {
      role: {
        type: ["user", "admin"],
        defaultValue: "user",
        input: false,
        required: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.fileSystemNode.create({
            data: {
              name: "root",
              type: "folder",
              ownerId: user.id,
            },
          });
        },
      },
    },
  },
});
