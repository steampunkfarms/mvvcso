'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const incomeCategories = ['donation', 'grant', 'fundraiser', 'interest', 'other'];
const expenseCategories = ['program', 'admin', 'fundraising', 'rent', 'utilities', 'insurance', 'supplies', 'equipment', 'other'];

export function TransactionForm() {
  const router = useRouter();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const form = e.currentTarget;
    const data = {
      date: (form.elements.namedItem('date') as HTMLInputElement).value,
      type,
      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
      description: (form.elements.namedItem('description') as HTMLInputElement).value,
      amount: Math.round(parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value) * 100),
      fund: (form.elements.namedItem('fund') as HTMLSelectElement).value,
      vendor: (form.elements.namedItem('vendor') as HTMLInputElement).value || undefined,
      checkNumber: (form.elements.namedItem('checkNumber') as HTMLInputElement).value || undefined,
    };

    try {
      const res = await fetch('/api/admin/treasurer/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push('/admin/treasurer/transactions');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-stone-200 space-y-5 max-w-xl">
      {/* Type toggle */}
      <div className="flex gap-3">
        {(['income', 'expense'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors capitalize ${
              type === t
                ? t === 'income' ? 'bg-green-600 text-white border-green-600' : 'bg-red-600 text-white border-red-600'
                : 'bg-stone-100 text-(--text-primary) border-stone-200 hover:border-gold-400'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-(--text-primary) mb-1">Date</label>
          <input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) focus:outline-none focus:border-gold-400" />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-(--text-primary) mb-1">Amount ($)</label>
          <input id="amount" name="amount" type="number" step="0.01" min="0.01" required
            className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) focus:outline-none focus:border-gold-400" />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-(--text-primary) mb-1">Description</label>
        <input id="description" name="description" type="text" required
          className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) focus:outline-none focus:border-gold-400" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-(--text-primary) mb-1">Category</label>
          <select id="category" name="category" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) focus:outline-none focus:border-gold-400 capitalize">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fund" className="block text-sm font-medium text-(--text-primary) mb-1">Fund</label>
          <select id="fund" name="fund" className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) focus:outline-none focus:border-gold-400">
            <option value="general">General Fund</option>
            <option value="ranchita_roots">Ranchita Roots</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="vendor" className="block text-sm font-medium text-(--text-primary) mb-1">Vendor / Payee</label>
          <input id="vendor" name="vendor" type="text" placeholder="Optional"
            className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400" />
        </div>
        <div>
          <label htmlFor="checkNumber" className="block text-sm font-medium text-(--text-primary) mb-1">Check #</label>
          <input id="checkNumber" name="checkNumber" type="text" placeholder="Optional"
            className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-gold-400" />
        </div>
      </div>

      {status === 'error' && <p className="text-red-600 text-sm">Failed to add transaction.</p>}

      <button type="submit" disabled={status === 'loading'}
        className="w-full px-6 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors disabled:opacity-60">
        {status === 'loading' ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  );
}
