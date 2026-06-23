import { db } from "../src/server/db";
import { PreorderType } from "../generated/prisma/client";
import { faker } from "@faker-js/faker";

async function main() {
  console.log("Cleaning up existing preorders...");
  const deleteResult = await db.preorder.deleteMany({});
  console.log(`Deleted ${deleteResult.count} existing preorders.`);

  console.log("Generating 100 preorders...");
  const preordersData = [];

  for (let i = 0; i < 100; i++) {
    // Generate different combinations of preorders
    const name = `${faker.commerce.productAdjective()} ${faker.commerce.product()} Preorder`;
    const type = faker.helpers.arrayElement([
      PreorderType.REGARDLESS_OF_STOCK,
      PreorderType.OUT_OF_STOCK,
    ]);
    const products = faker.number.int({ min: 1, max: 100 });
    
    // Starts at some time from 30 days ago to 30 days in the future
    const startsAt = faker.date.between({
      from: faker.date.recent({ days: 30 }),
      to: faker.date.soon({ days: 30 }),
    });

    // Ends at startsAt + random duration, or null (ongoing preorder)
    const endsAt = faker.helpers.maybe(
      () => {
        return faker.date.between({
          from: startsAt,
          to: new Date(startsAt.getTime() + 1000 * 60 * 60 * 24 * faker.number.int({ min: 2, max: 60 })),
        });
      },
      { probability: 0.7 } // 70% chance of having an end date
    );

    // Active status: randomly determined
    const isActive = faker.datatype.boolean({ probability: 0.85 });

    preordersData.push({
      name,
      type,
      products,
      startsAt,
      endsAt,
      isActive,
    });
  }

  console.log("Inserting 100 preorders into the database...");
  const createResult = await db.preorder.createMany({
    data: preordersData,
  });

  console.log(`Successfully seeded ${createResult.count} preorders!`);
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Check if we need to close database connections or cleanup
    console.log("Seeding process completed.");
  });
