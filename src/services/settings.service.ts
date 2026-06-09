import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function getSettings(group?: string) {
  return prisma.setting.findMany({ where: group ? { group } : undefined, orderBy: { key: "asc" } });
}

export function upsertSetting(key: string, value: Prisma.InputJsonValue, group = "general") {
  return prisma.setting.upsert({
    where: { key },
    update: { value, group },
    create: { key, value, group }
  });
}
