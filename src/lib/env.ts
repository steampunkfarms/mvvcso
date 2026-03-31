function getEnv(key: string, required = true): string {
  const value = process.env[key]?.trim();
  if (!value && required) {
    console.warn(`⚠️ Missing env var: ${key}`);
    return '';
  }
  return value ?? '';
}

export const env = {
  databaseUrl: getEnv('DATABASE_URL'),
  blobToken: getEnv('BLOB_READ_WRITE_TOKEN'),
  resendApiKey: getEnv('RESEND_API_KEY', false),
  stripeSecretKey: getEnv('STRIPE_SECRET_KEY', false),
  stripePublishableKey: getEnv('STRIPE_PUBLISHABLE_KEY', false),
  stripeWebhookSecret: getEnv('STRIPE_WEBHOOK_SECRET', false),
  siteUrl: getEnv('NEXT_PUBLIC_SITE_URL', false) || 'https://mvvcso.vercel.app',
  anthropicApiKey: getEnv('ANTHROPIC_API_KEY', false),
  authSecret: getEnv('AUTH_SECRET', false),

  get hasResend() { return !!this.resendApiKey; },
  get hasStripe() { return !!this.stripeSecretKey; },
  get hasAnthropic() { return !!this.anthropicApiKey; },
  get hasAuth() { return !!this.authSecret; },
};
