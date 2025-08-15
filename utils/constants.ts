import { isDev } from "./helpers";

export const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 10,
    description: 'Perfect for occasional use',
    items: [
      '10 PDF summaries per month',
      'Standard processing speed',
      'Email support',
    ],
    priceId: isDev ? 'price_1Rv2K2BeIatiqjmKCjU7ttfk' : '',
    paymentLink: isDev ? 'https://buy.stripe.com/test_4gM14m4WK6XyegQfD7gUM00' : '',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 20,
    description: 'For professionals and teams',
    items: [
      'Unlimited PDF summaries',
      'Priority processing',
      '24/7 Priority support',
      'Markdown Export',
    ],
    priceId: isDev ? 'price_1Rv2K2BeIatiqjmK3Pwskmin' : '',
    paymentLink: isDev ? 'https://buy.stripe.com/test_14AdR8ah4a9K4Gg9eJgUM01' : '',
  },
];

export const containerVariants = {
  hidden: {opacity:0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    transition: {
      type: 'spring' as const,
      damping: 15,
      stiffness: 50,
      duration: 0.8,
    },
  },
};