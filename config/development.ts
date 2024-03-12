import type { Config } from './default';

export default {
  mode: 'development',
  name: 'Cella DEVELOPMENT',
  debug: false,

  senderIsReceiver: true,

  frontendUrl: 'http://localhost:3000',
  backendUrl: 'http://localhost:4000',
  tusUrl: 'http://localhost:1080',

  // Webhooks with n8n
  newsletterWebhookUrl: 'https://cella.app.n8n.cloud/webhook-test/subscription?',
  contactWebhookUrl: 'https://cella.app.n8n.cloud/webhook-test/contact?',

  // AppSignal
  appsignalFrontendKey: 'a253516a-39a9-47e1-a3b7-fa011785f675',

  // Payment with Paddle
  paddleToken: 'test_85052d6574ab68d36b341e0afc8',
  paddlePriceIds: {
    donate: 'pri_01hq8da4mn9s0z0da7chh0ntb9',
  },
} satisfies Config;
