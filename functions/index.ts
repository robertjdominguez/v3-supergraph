import Stripe from 'npm:stripe@^11.16';

const apiKey: any = Deno.env.get('STRIPE_SECRET_KEY');

// Initialize the Stripe client
const stripe = new Stripe(apiKey, {
  apiVersion: '2022-11-15',
});

/**
 * Returns a user's information
 * @param {string} userId - The user's id
 * @returns {any} customer - The customer object from Stripe
 * @pure This function should only query data without making modifications
 */
export async function getUserInfo(userId: string) {
  try {
    // Retrieve all customers from Stripe because we can't search by metadata 👎
    const customers = await stripe.customers.list();

    // Filter customers by user_id metadata property
    const customer = customers.data.find((customer: any) => customer.metadata && customer.metadata.user_id === userId);

    // Handle the possibility
    if (!customer) {
      console.error('No customer found with the provided user_id');
      return null;
    }

    return customer;
  } catch (error) {
    console.error('Error retrieving user information:', error);
    return null;
  }
}

/**
 * Returns a checkout session url for a user
 * @param {string} userId - The user's id
 * @returns {Promise<string | null>} url - The checkout session url
 * @pure This function should only query data without making modifications
 */
export async function getCheckoutSessionUrl(userId: string, priceId: string) {
  try {
    const line_items = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    // Create a new checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      metadata: {
        userId: userId,
      },
      success_url: 'http://localhost/success',
      cancel_url: 'http://localhost/cancel',
    });

    // Return the checkout session URL
    return session.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return null;
  }
}

/**
 * Returns all of a user's payments from Stripe
 * @param {string} userId - The user's id
 * @returns {any} payments - The user's payments
 * @pure This function should only query data without making modifications
 */
export async function getCompleteCheckoutSessions(userId: string) {
  try {
    // Retrieve all sessions from Stripe because we can't search by metadata 👎
    const checkoutSessions = await stripe.checkout.sessions.list();

    // Filter sessions by user_id metadata property
    const userSessions = checkoutSessions.data.filter(
      (session: any) => session.metadata && session.metadata.userId === userId && session.payment_status === 'paid'
    );

    // For each of those sessions, let's grab the payment intent and its charges
    const payments = await Promise.all(
      userSessions.map(async (session: any) => {
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
        const charges = await stripe.charges.list({ payment_intent: session.payment_intent });

        return {
          paymentIntent,
          charges,
        };
      })
    );

    // Handle the possibility
    if (!userSessions) {
      console.error('No sessions found with the provided user_id');
      return null;
    }

    return payments;
  } catch (error) {
    console.error('Error retrieving payments:', error);
    return null;
  }
}
