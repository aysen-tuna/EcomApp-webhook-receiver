import Stripe from 'stripe';
import '../common/env';

export const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
export const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
