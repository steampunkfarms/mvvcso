import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth';
import { db, schema } from '@/lib/db';

const transactionSchema = z.object({
  date: z.string().min(1),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1),
  description: z.string().min(1),
  amount: z.number().int().min(1),
  fund: z.string().default('general'),
  vendor: z.string().optional(),
  checkNumber: z.string().optional(),
});

export async function POST(request: Request) {
  const user = await requireAuth(['president', 'treasurer']);

  try {
    const body = await request.json();
    const data = transactionSchema.parse(body);

    await db.insert(schema.financialTransactions).values({
      date: new Date(data.date),
      type: data.type,
      category: data.category,
      description: data.description,
      amount: data.amount,
      fund: data.fund,
      vendor: data.vendor || null,
      checkNumber: data.checkNumber || null,
      enteredBy: user.id,
    });

    await db.insert(schema.activityLog).values({
      type: `transaction_${data.type}`,
      title: `${data.type === 'income' ? 'Income' : 'Expense'}: ${data.description}`,
      description: `$${(data.amount / 100).toFixed(2)} — ${data.category} — ${data.fund}`,
      entityType: 'transaction',
      userId: user.id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.issues }, { status: 400 });
    }
    console.error('Create transaction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
