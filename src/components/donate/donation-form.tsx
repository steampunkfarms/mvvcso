'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const presetAmounts = [25, 50, 100, 250];

export function DonationForm() {
  const t = useTranslations('donate');
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [campaign, setCampaign] = useState('general');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const displayAmount = isCustom ? Number(customAmount) || 0 : amount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (displayAmount < 1) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/donate/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: displayAmount,
          frequency,
          campaign,
        }),
      });

      if (res.ok) {
        const { url } = await res.json();
        if (url) {
          window.location.href = url;
        } else {
          setStatus('error');
        }
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm border border-stone-200 space-y-6">
      {/* Amount selection */}
      <div>
        <label className="block text-sm font-medium text-(--text-primary) mb-3">
          {t('amount_label')}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setAmount(preset);
                setIsCustom(false);
              }}
              className={`px-4 py-3 rounded-lg border text-sm font-semibold transition-colors ${
                !isCustom && amount === preset
                  ? 'bg-gold-400 text-white border-gold-400'
                  : 'bg-stone-100 text-(--text-primary) border-stone-200 hover:border-gold-400'
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCustom(true)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              isCustom
                ? 'bg-gold-400 text-white border-gold-400'
                : 'bg-stone-100 text-(--text-primary) border-stone-200 hover:border-gold-400'
            }`}
          >
            {t('custom_amount')}
          </button>
          {isCustom && (
            <div className="flex items-center gap-1">
              <span className="text-(--text-primary) font-medium">$</span>
              <input
                type="number"
                min="1"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-24 px-3 py-2 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) focus:outline-none focus:border-gold-400"
                placeholder="0"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-(--text-primary) mb-3">
          {t('frequency_label')}
        </label>
        <div className="flex gap-3">
          {(['one-time', 'monthly'] as const).map((freq) => (
            <button
              key={freq}
              type="button"
              onClick={() => setFrequency(freq)}
              className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                frequency === freq
                  ? 'bg-gold-400 text-white border-gold-400'
                  : 'bg-stone-100 text-(--text-primary) border-stone-200 hover:border-gold-400'
              }`}
            >
              {t(freq === 'one-time' ? 'one_time' : 'monthly')}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign */}
      <div>
        <label className="block text-sm font-medium text-(--text-primary) mb-2">
          {t('campaign_label')}
        </label>
        <select
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-(--text-primary) focus:outline-none focus:border-gold-400"
        >
          <option value="general">{t('general_fund')}</option>
          <option value="ranchita-roots">{t('ranchita_roots')}</option>
        </select>
      </div>

      {status === 'error' && (
        <div className="bg-gold-100/20 rounded-lg p-4">
          <p className="text-sm text-(--text-primary)">
            {t('coming_soon')}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading' || displayAmount < 1}
        className="w-full px-6 py-3.5 rounded-lg bg-gold-400 text-white font-semibold text-lg hover:bg-gold-500 transition-colors disabled:opacity-60"
      >
        {status === 'loading'
          ? t('processing')
          : t('donate_button', { amount: `$${displayAmount}` })}
      </button>
    </form>
  );
}
