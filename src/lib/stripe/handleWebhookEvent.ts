import type Stripe from 'stripe';
import {
  provisionApiKey,
  revokeKeysForSubscription,
  updateTierForSubscription,
} from '@/lib/api/keyStore';
import { isApiTier } from '@/lib/api/tiers';
import {
  checkoutSessionIsPaid,
  subscriptionIdFromSession,
  subscriptionIsActiveStatus,
  subscriptionShouldRevokeKeys,
  tierFromSubscription,
} from '@/lib/stripe/subscription';

export async function handleStripeWebhookEvent(
  stripe: Stripe,
  event: Stripe.Event,
): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== 'subscription') return;
      if (!checkoutSessionIsPaid(session)) return;

      const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
      if (!customerId || !session.id) return;

      const subscriptionId = subscriptionIdFromSession(session);
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        if (!subscriptionIsActiveStatus(subscription.status)) return;
      }

      const email =
        session.customer_details?.email ??
        session.customer_email ??
        'unknown@picktherobot.com';

      const tierValue = session.metadata?.tier;
      if (!tierValue || !isApiTier(tierValue)) return;

      await provisionApiKey({
        tier: tierValue,
        customerId,
        email,
        checkoutSessionId: session.id,
        subscriptionId: subscriptionId ?? undefined,
      });
      return;
    }
    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      if (!subscription.id) return;

      if (
        event.type === 'customer.subscription.deleted' ||
        subscriptionShouldRevokeKeys(subscription.status)
      ) {
        await revokeKeysForSubscription(subscription.id);
        return;
      }

      if (subscriptionIsActiveStatus(subscription.status)) {
        const tier = tierFromSubscription(subscription);
        if (tier) {
          await updateTierForSubscription(subscription.id, tier);
        }
      }
      return;
    }
    default:
      return;
  }
}
