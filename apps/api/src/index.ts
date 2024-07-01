import App from './app.js';
export type * as PrismaClient from "@prisma/client";
export { Prisma } from "@prisma/client";
export type { IUserProfile } from "@/types/user.type.js"
const main = () => {
  // init db here

  const app = new App();
  app.start();
};

main();
