import { Prisma } from "@/generated/prisma";
import { PrismaModels } from "prisma-models";

export type Models = PrismaModels<Prisma.ModelName, Prisma.TypeMap>;