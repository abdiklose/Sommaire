import Stripe from 'stripe';
import { getDbConnection } from './db';

type SqlQuery = {
  <T = unknown>(
    query: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]>;
};

// Helper pour typer explicitement Neon comme SqlQuery
async function getSql(): Promise<SqlQuery> {
  const neonSql = await getDbConnection();
  return neonSql as unknown as SqlQuery;
}

export async function handleSubscriptionDeleted({
  subscriptionId,
  stripe,
}: {
  subscriptionId: string;
  stripe: Stripe;
}) {
  console.log('Subscription deleted', subscriptionId);

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const sql = await getSql();

    await sql`UPDATE users SET status = 'cancelled' WHERE customer_id = ${subscription.customer}`;

    console.log('Subscription cancelled successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error handling subscription deleted:', error.message);
    } else {
      console.error('Error handling subscription deleted:', error);
    }
    throw error;
  }
}

export async function handleCheckoutSessionCompleted({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
}) {
  console.log('Checkout session completed', session);

  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session.line_items?.data[0]?.price?.id;

  if ('email' in customer && priceId) {
    const { email, name } = customer;
    const sql = await getSql();

    await createOrUpdateUser({
      sql,
      email: email as string,
      fullName: name as string,
      customerId,
      priceId: priceId as string,
      status: 'active',
    });

    await createPayment({
      sql,
      session,
      priceId: priceId as string,
      userEmail: email as string,
    });
  }
}

async function createOrUpdateUser({
  sql,
  email,
  fullName,
  customerId,
  priceId,
  status,
}: {
  sql: SqlQuery;
  email: string;
  fullName: string;
  customerId: string;
  priceId: string;
  status: string;
}) {
  try {
    const user = await sql<
      { id: string }[]
    >`SELECT * FROM users WHERE email = ${email}`;

    if (user.length === 0) {
      await sql`INSERT INTO users (email, full_name, customer_id, price_id, status)
                VALUES (${email}, ${fullName}, ${customerId}, ${priceId}, ${status})`;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating or updating user:', error.message);
    } else {
      console.error('Error creating or updating user:', error);
    }
  }
}

async function createPayment({
  sql,
  session,
  priceId,
  userEmail,
}: {
  sql: SqlQuery;
  session: Stripe.Checkout.Session;
  priceId: string;
  userEmail: string;
}) {
  try {
    const { amount_total, id, status } = session;

    await sql`INSERT INTO payments (amount, status, stripe_payment_id, price_id, user_email)
              VALUES (${amount_total}, ${status}, ${id}, ${priceId}, ${userEmail})`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error creating payment:', error.message);
    } else {
      console.log('Error creating payment:', error);
    }
  }
}
