import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  //   const user = await prisma.user.create({
  //     data: {
  //       name: 'Alice',
  //       email: 'test@test.com',
  //       firebaseId: Date.now().toString(),
  //     },
  //   });
  //get all users
  //const users = await prisma.user.findMany();
  //create CBC and associate with user
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
