import { PrismaClient, UserRole } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const requestedRole = process.argv[3] ?? "SUPER_ADMIN";
  const password = process.argv[4];
  const role = requestedRole === "ADMIN" ? UserRole.ADMIN : requestedRole === "SUPER_ADMIN" ? UserRole.SUPER_ADMIN : null;

  if (!email) {
    throw new Error("Usage: npm run promote-admin -- admin@example.com [ADMIN|SUPER_ADMIN]");
  }

  if (!role) {
    throw new Error("Role must be ADMIN or SUPER_ADMIN.");
  }

  const authUser = await findOrCreateSupabaseAuthUser(email, role, password);
  const existing = await prisma.userProfile.findUnique({ where: { email } });

  if (existing) {
    await prisma.userProfile.update({
      where: { email },
      data: {
        authUserId: existing.authUserId ?? authUser?.id ?? null,
        fullName: existing.fullName ?? authUser?.user_metadata?.full_name ?? authUser?.user_metadata?.name ?? email.split("@")[0],
        role,
        status: "ACTIVE"
      }
    });
  } else {
    await prisma.userProfile.create({
      data: {
        authUserId: authUser?.id ?? null,
        email,
        fullName: authUser?.user_metadata?.full_name ?? authUser?.user_metadata?.name ?? email.split("@")[0],
        phone: authUser?.phone ?? null,
        avatarUrl: authUser?.user_metadata?.avatar_url ?? null,
        role,
        status: "ACTIVE"
      }
    });
  }

  console.log(`${email} is now ${role} and ACTIVE.`);
  if (!authUser) {
    console.log("No Supabase Auth user was found. Pass a password as the 3rd argument and set SUPABASE_SERVICE_ROLE_KEY to create the Auth user too.");
  }
}

async function findOrCreateSupabaseAuthUser(email: string, role: "ADMIN" | "SUPER_ADMIN", password?: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey || serviceRoleKey.includes("YOUR_")) return null;

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const found = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (found) {
      await supabase.auth.admin.updateUserById(found.id, {
        user_metadata: {
          ...found.user_metadata,
          role
        }
      });
      return found;
    }
    if (data.users.length < 100) break;
  }

  if (!password) return null;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: email.split("@")[0],
      role
    }
  });
  if (error) throw error;
  return data.user;
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error.message);
    await prisma.$disconnect();
    process.exit(1);
  });
