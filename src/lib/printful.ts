import { env } from './env';

const PRINTFUL_BASE = 'https://api.printful.com';

async function printfulFetch(path: string, options?: RequestInit) {
  const printfulKey = process.env.PRINTFUL_API_KEY?.trim();
  if (!printfulKey) {
    throw new Error('PRINTFUL_API_KEY not configured');
  }

  const res = await fetch(`${PRINTFUL_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${printfulKey}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Printful API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function listProducts() {
  const data = await printfulFetch('/store/products');
  return data.result || [];
}

export async function getProduct(syncProductId: number) {
  const data = await printfulFetch(`/store/products/${syncProductId}`);
  return data.result;
}

export async function createOrder(order: {
  recipient: { name: string; address1: string; city: string; state_code: string; country_code: string; zip: string };
  items: { sync_variant_id: number; quantity: number }[];
}) {
  const data = await printfulFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
  return data.result;
}

export const hasPrintful = !!process.env.PRINTFUL_API_KEY?.trim();
