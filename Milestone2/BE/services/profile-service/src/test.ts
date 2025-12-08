import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const profiles = await prisma.profile.findMany();
  console.log("Profiles:", profiles);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
