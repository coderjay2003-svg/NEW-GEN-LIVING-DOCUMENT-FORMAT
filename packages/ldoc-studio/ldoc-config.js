/**
 * LDOC Studio & Living Document Architecture — Global Configuration & Pricing Single-Source-of-Truth
 * Canonical pricing, features, API endpoints, and Stripe price definitions.
 */
(function (global) {
  'use strict';

  const LDocPricingConfig = {
    version: '2.5.0',
    currency: 'USD',
    plans: {
      starter: {
        id: 'starter',
        name: 'Starter / Community',
        badge: 'OPEN FORMAT',
        priceMonthly: 0,
        priceYearly: 0,
        periodDisplay: 'forever free',
        tagline: 'Full living document reader, browser creator, and offline player.',
        features: [
          'Full interactive .ldocx presentation viewer',
          'Client-side visual slide builder & code sandbox',
          'Unlimited local .ldocx downloads',
          'WebGL 3D model & particle preview',
          'Standard living templates'
        ],
        ctaText: 'Start Free',
        stripePriceId: null
      },
      pro: {
        id: 'pro',
        name: 'Pro Creator',
        badge: 'POPULAR',
        priceMonthly: 29,
        priceYearly: 290,
        periodDisplay: '$29 / month',
        yearlyDisplay: '$290 / year (save 16%)',
        tagline: 'Advanced AI generation, custom shaders, and unlimited export capabilities.',
        features: [
          'Everything in Starter, plus:',
          'Living FX Wizard & ambient volumetric shaders',
          'Interactive physics sandboxes (Python, Three.js, Charts)',
          'AI Living Copilot & instant document forging',
          'Custom typography & 60fps presentation themes',
          'Lossless offline document compression'
        ],
        ctaText: 'Upgrade to Pro',
        stripePriceId: 'price_pro_monthly_29'
      },
      enterprise: {
        id: 'enterprise',
        name: 'Enterprise Team',
        badge: 'TEAM & ENTERPRISE',
        priceMonthly: 99,
        priceYearly: 999,
        periodDisplay: '$99 / month',
        yearlyDisplay: '$999 / year (save 16%)',
        tagline: 'Complete enterprise document infrastructure with team collaboration & signing.',
        features: [
          'Everything in Pro Creator, plus:',
          '25 Team Member seats included',
          'Hardware-key package cryptographic signing',
          'High-fidelity vector PDF flattening engine',
          'Real-time webhook telemetry & lead capture',
          'Custom vanity domains & SAML SSO / Okta',
          'Dedicated enterprise support SLA'
        ],
        ctaText: 'Get Enterprise Team',
        stripePriceId: 'price_enterprise_yearly_999'
      },
      founder: {
        id: 'founder',
        name: 'Founder VIP Lifetime Pass',
        badge: 'EARLY SUPPORTER',
        priceOneTime: 99,
        periodDisplay: '$99 one-time',
        tagline: 'Exclusive founding member lifetime license with all future Pro features.',
        features: [
          'Lifetime access to Pro Creator & Studio',
          'Exclusive Founder holographic skin & badge',
          'Priority feature requests & early beta access',
          'Zero recurring monthly fees forever'
        ],
        ctaText: 'Claim Founder Pass ($99)',
        stripePriceId: 'price_founder_lifetime_99'
      }
    },
    api: {
      baseUrl: (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '',
      documentsEndpoint: '/api/documents',
      aiChatEndpoint: '/api/ai/chat',
      stripeCheckoutEndpoint: '/api/stripe/create-checkout-session'
    }
  };

  // Attach globally
  global.LDocPricingConfig = LDocPricingConfig;
})(typeof window !== 'undefined' ? window : this);
