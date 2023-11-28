// Import the required modules from deno-postgres
import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';

// Define the configuration for the PostgreSQL client
const client = new Client({
  user: 'read_only',
  database: 'v3-docs-sample-app',
  hostname: '35.236.11.122',
  password: 'kd4555jkfjfkdj39f8f8d9d',
  port: 5432,
});

/**
 * Retrieves the five most-recent orders for the given user and, if more than one is a t-shirt, categorizes the user as a "t-shirt lover".
 *
 * @param userId - The user ID for which to retrieve orders.
 * @returns Whether the user is a "t-shirt lover".
 * @pure This function should only query data without making modifications
 */
export async function isTShirtLover(userId: any) {
  // Connect to the database
  await client.connect();

  // Keep track of the number of t-shirts ordered
  let tShirtCount = 0;

  // Query the database for the five most-recent orders for the given user
  const orders = await client.queryObject(
    'SELECT product_id FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
    [userId]
  );

  // Let's get the product IDs for the orders
  const productIds = orders.rows.flat().map((order: any) => order.product_id);

  // Then, use each of those to get the category_id of the product
  const categories = await client.queryObject('SELECT category_id FROM products WHERE id = ANY($1::uuid[])', [
    productIds,
  ]);

  // With the category_id, we can get the name of the category for each product
  const categoryNames = await client.queryObject('SELECT name FROM categories WHERE id = ANY($1::uuid[])', [
    categories.rows.flat().map((category: any) => category.category_id),
  ]);

  // For each category check if it's a t-shirt — if it is, increment tShirtCount
  categoryNames.rows.flat().forEach((category: any) => {
    if (category.name == 'T-Shirts') {
      tShirtCount++;
    }
  });

  // Determine whether the user is a "t-shirt lover"
  const lovesShirts = tShirtCount >= 1;
  if (lovesShirts) {
    return `User ${userId} is a T-Shirt lover!`;
  } else {
    return `User ${userId} is not a T-Shirt lover!`;
  }
}

// For testing, calling the function directly
// async function main() {
//   console.log(await isTShirtLover('82001336-65b7-11ed-b905-7fa26a16d198'));
// }

// main();
