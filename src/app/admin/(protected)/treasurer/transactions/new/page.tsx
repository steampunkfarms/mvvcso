import { requireAuth } from '@/lib/auth';
import { TransactionForm } from '@/components/treasurer/transaction-form';

export default async function NewTransactionPage() {
  await requireAuth(['president', 'treasurer']);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">Add Transaction</h1>
      <TransactionForm />
    </div>
  );
}
