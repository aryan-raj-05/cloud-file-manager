import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { prisma } from "./prisma.js";
import { FileUploadStatus } from "../generated/prisma/enums.js";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:5173"],
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
              uploadStatus: FileUploadStatus.completed,
              storageKey: `users/${user.id}/files/root`,
            },
          });
        },
      },
    },
  },
});
