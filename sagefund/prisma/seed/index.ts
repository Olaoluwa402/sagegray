import { Prisma, PrismaClient, UserType } from "@prisma/client";
const prisma = new PrismaClient();
import logger from "moment-logger";

import { roles } from "./role";

async function main() {
   
}

main()
    .then(() => {
        logger.info("Database seeding successful");
    })
    .catch((err) => {
        logger.error(`Database seeding failed ${err}`);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
