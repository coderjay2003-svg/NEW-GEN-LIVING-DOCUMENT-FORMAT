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
        name: 'Community',
        badge: 'OPEN FORMAT',
        priceMonthly: 0,
        priceYearly: 0,
        periodDisplay: 'forever free',
        tagline: 'Open-source core for developers, researchers, and document readers.',
        features: [
          'Full Open .ldocx SDK & CLI',
          'Web & Desktop Offline Viewer',
          'Live Studio Browser Sandbox',
          'Markdown & Text Converters',
          'Standard HTML & PDF Export'
        ],
        ctaText: 'Start Free',
        stripePriceId: null
      },
      pro: {
        id: 'pro',
        name: 'Studio Pro Workstation',
        badge: 'MOST POPULAR • LIFETIME ACCESS',
        priceOneTime: 19,
        periodDisplay: '$19 lifetime',
        tagline: 'Air-gapped desktop & mobile workstation for Windows, Linux, Android & macOS.',
        features: [
          'Everything in Community',
          '100% Air-Gapped Workstation (Win, Linux, Android, macOS)',
          'Discrete GPU Hardware Engine (Unbounded VRAM, 120Hz)',
          'Direct OS File I/O (Unlimited document size)',
          'Lossless Universal Converters (DOCX, PDF, 3D CAD)',
          'Vector-Crisp PDF Flattener & Print Engine',
          'Merkle SHA-256 & Ed25519 Cryptographic Signing',
          'Commercial Rights & Lifetime App Updates'
        ],
        ctaText: 'Buy License',
        stripePriceId: null
      },
      cloud: {
        id: 'cloud',
        name: 'LDOC Cloud Workspace',
        badge: 'CLOUD COLLABORATION • AI COPILOT',
        priceMonthly: 8,
        priceYearly: 79,
        periodDisplay: '$8 / month',
        yearlyDisplay: '$79 / year (save 20%)',
        tagline: 'Multi-device cloud sync, real-time team collaboration & AI Document Copilot.',
        features: [
          'Multi-Device Cloud Sync (Studio Desktop, Android & Web)',
          'Real-Time Multiplayer Co-Authoring (Live cursors & comments)',
          'AI Living Document Copilot (Smart text, 3D & data charts)',
          '100 GB Encrypted Cloud Vault (Zero-knowledge storage)',
          'Automated Cloud Backups & Infinite Revision Rollback',
          'Instant Interactive Web Sharing & Password Links',
          'Priority Cloud Rendering & Real-Time Sync Relay'
        ],
        ctaText: 'Start Cloud Pro',
        stripePriceId: 'price_cloud_pro_monthly_8'
      },
      enterprise: {
        id: 'enterprise',
        name: 'Enterprise Fleet',
        badge: 'FLEET & COMPLIANCE',
        priceMonthly: 49,
        priceYearly: 499,
        periodDisplay: '$499 / year',
        yearlyDisplay: '$499 / year',
        tagline: 'For engineering, defense, healthcare & institutions with strict compliance needs.',
        features: [
          'Everything in Studio Pro & Cloud (Unlimited Seats)',
          'Silent Fleet Deployment (Custom .msi, Intune & RPM/Debian)',
          'Custom Enterprise AST Schemas & CAD/3D Extensions',
          'HSM & Corporate Root Signing (Hardware cryptographic seal)',
          'Self-Hosted Sync Relay Option & Zero-Egress Auditing',
          'Headless CI/CD Batch CLI (Automated pipeline rendering)',
          'Dedicated Solutions Architect & 99.9% Uptime SLA'
        ],
        ctaText: 'Contact Enterprise',
        stripePriceId: 'price_enterprise_yearly_499'
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
