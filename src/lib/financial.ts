import { db, schema } from './db';
import { eq, desc, and, gte, lte, sql, sum } from 'drizzle-orm';

const { financialTransactions, budgets, grants, donations } = schema;

export async function getFinancialSummary() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Total income & expenses
  const [totals] = await db
    .select({
      totalIncome: sql<number>`COALESCE(SUM(CASE WHEN ${financialTransactions.type} = 'income' THEN ${financialTransactions.amount} ELSE 0 END), 0)`,
      totalExpenses: sql<number>`COALESCE(SUM(CASE WHEN ${financialTransactions.type} = 'expense' THEN ${financialTransactions.amount} ELSE 0 END), 0)`,
    })
    .from(financialTransactions);

  // This month
  const [monthTotals] = await db
    .select({
      monthIncome: sql<number>`COALESCE(SUM(CASE WHEN ${financialTransactions.type} = 'income' THEN ${financialTransactions.amount} ELSE 0 END), 0)`,
      monthExpenses: sql<number>`COALESCE(SUM(CASE WHEN ${financialTransactions.type} = 'expense' THEN ${financialTransactions.amount} ELSE 0 END), 0)`,
    })
    .from(financialTransactions)
    .where(gte(financialTransactions.date, startOfMonth));

  // Fund balances
  const fundBalances = await db
    .select({
      fund: financialTransactions.fund,
      income: sql<number>`COALESCE(SUM(CASE WHEN ${financialTransactions.type} = 'income' THEN ${financialTransactions.amount} ELSE 0 END), 0)`,
      expenses: sql<number>`COALESCE(SUM(CASE WHEN ${financialTransactions.type} = 'expense' THEN ${financialTransactions.amount} ELSE 0 END), 0)`,
    })
    .from(financialTransactions)
    .groupBy(financialTransactions.fund);

  return {
    cashOnHand: (totals?.totalIncome || 0) - (totals?.totalExpenses || 0),
    monthIncome: monthTotals?.monthIncome || 0,
    monthExpenses: monthTotals?.monthExpenses || 0,
    totalIncome: totals?.totalIncome || 0,
    totalExpenses: totals?.totalExpenses || 0,
    fundBalances: fundBalances.map(f => ({
      fund: f.fund,
      balance: (f.income || 0) - (f.expenses || 0),
    })),
  };
}

export async function getTransactions(options?: {
  type?: string;
  fund?: string;
  limit?: number;
}) {
  let query = db.select().from(financialTransactions).orderBy(desc(financialTransactions.date));

  // Note: Drizzle doesn't support chained where easily, so we build conditions
  const conditions = [];
  if (options?.type) conditions.push(eq(financialTransactions.type, options.type));
  if (options?.fund) conditions.push(eq(financialTransactions.fund, options.fund));

  if (conditions.length === 1) {
    query = query.where(conditions[0]) as typeof query;
  } else if (conditions.length > 1) {
    query = query.where(and(...conditions)) as typeof query;
  }

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }

  return query;
}

export async function getBudgets(fiscalYear: number) {
  return db
    .select()
    .from(budgets)
    .where(eq(budgets.fiscalYear, fiscalYear))
    .orderBy(budgets.category);
}

export async function getGrants() {
  return db
    .select()
    .from(grants)
    .orderBy(desc(grants.createdAt));
}

export async function getGrant(id: string) {
  const [grant] = await db.select().from(grants).where(eq(grants.id, id));
  return grant ?? null;
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}
