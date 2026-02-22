import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { endpointSecret, stripe } from '../../../services/stripe';
import { db } from '../../../services/firebase';
import type Stripe from 'stripe';

type CartItem = { productId: string; qty: number };

const receiveUpdates = async (req: Request, res: Response) => {
  const sigHeader = req.headers['stripe-signature'];
  const signature = Array.isArray(sigHeader) ? sigHeader[0] : sigHeader;

  let event: Stripe.Event;

  try {
    if (!endpointSecret) {
      console.log('Missing STRIPE_WEBHOOK_SIGNING_SECRET');
      return res.sendStatus(500);
    }

    event = stripe.webhooks.constructEvent(req.body, signature as string, endpointSecret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log('Webhook signature verification failed:', msg);
    return res.sendStatus(400);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session?.metadata?.userId ?? 'guest';
      const cartRaw = session?.metadata?.cart ?? '[]';

      let cart: CartItem[] = [];
      try {
        cart = JSON.parse(cartRaw);
      } catch (e) {
        console.log('Cart parse failed');
        cart = [];
      }

      console.log('checkout.session.completed', {
        sessionId: session.id,
        userId,
        items: cart.length,
        amountTotal: session.amount_total,
      });

      if (userId === 'guest') {
        return res.status(200).send('ok');
      }

      const orderRef = db.collection('users').doc(userId).collection('orders').doc(session.id);

      const existing = await orderRef.get();
      if (existing.exists) {
        console.log('Order already exists, skip.');
        return res.status(200).send('ok');
      }

      await orderRef.set({
        status: 'complete',
        amountTotal: session.amount_total ?? 0,
        currency: session.currency ?? 'eur',
        stripeSessionId: session.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      for (const item of cart) {
        const productId = item?.productId;
        const qty = Number(item?.qty) || 0;
        if (!productId || qty <= 0) continue;

        await db
          .collection('products')
          .doc(productId)
          .set({ stock: admin.firestore.FieldValue.increment(-qty) }, { merge: true });
      }
    }

    return res.status(200).send('ok');
  } catch (err) {
    console.log('Webhook handler error:', err);
    return res.sendStatus(500);
  }
};

export default { receiveUpdates };
