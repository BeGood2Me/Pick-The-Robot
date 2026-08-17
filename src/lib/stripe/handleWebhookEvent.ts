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
  subscriptionProduct,
  subscriptionShouldRevokeKeys,
  tierFromSubscription,
} from '@/lib/stripe/subscription';
import { isVendorTier } from '@/lib/vendor/tiers';
import {
  provisionVendorSubscription,
  updateVendorSubscriptionStatus,
} from '@/lib/vendor/vendorStore';

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

      if (session.metadata?.product === 'vendor') {
        const tierValue = session.metadata.tier;
        const vendorSlug = session.metadata.vendor_slug;
        if (!isVendorTier(tierValue) || !vendorSlug || !subscriptionId) return;

        await provisionVendorSubscription({
          email,
          vendorSlug,
          customerId,
          checkoutSessionId: session.id,
          subscriptionId,
          tier: tierValue,
        });
        return;
      }

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

      const product = subscriptionProduct(subscription);

      if (product === 'vendor') {
        if (
          event.type === 'customer.subscription.deleted' ||
          subscriptionShouldRevokeKeys(subscription.status)
        ) {
          await updateVendorSubscriptionStatus(subscription.id, 'canceled');
          return;
        }

        if (subscriptionIsActiveStatus(subscription.status)) {
          await updateVendorSubscriptionStatus(subscription.id, 'active');
        } else {
          await updateVendorSubscriptionStatus(subscription.id, 'past_due');
        }
        return;
      }

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
