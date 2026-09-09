import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { config } from "./config.js";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = config.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
