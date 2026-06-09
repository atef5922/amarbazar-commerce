import { PrismaClient, UserRole } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

const email = process.argv[2] ?? "admin@amarbazar.com";
const password = process.argv[3] ?? "AmarBazar@2026";

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: "AmarBazar Super Admin",
        role: UserRole.SUPER_ADMIN
      }
    }
  });

  if (error && !error.message.toLowerCase().includes("already registered")) {
    throw error;
  }

  await prisma.userProfile.upsert({
    where: { email },
    update: {
      authUserId: data.user?.id ?? undefined,
      fullName: "AmarBazar Super Admin",
      role: UserRole.SUPER_ADMIN,
      status: "ACTIVE"
    },
    create: {
      authUserId: data.user?.id ?? null,
      email,
      fullName: "AmarBazar Super Admin",
      role: UserRole.SUPER_ADMIN,
      status: "ACTIVE"
    }
  });

  console.log(`SUPER_ADMIN ready: ${email}`);
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
