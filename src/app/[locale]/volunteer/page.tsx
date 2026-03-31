import { Link } from '@/i18n/navigation';
import { HandHelping, Heart, Shield, Users, Clock, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Volunteer with MVVCSO',
  description: 'Join over 50 years of neighbors helping neighbors in Ranchita. Volunteer with MVVCSO in food security, CERT, senior support, events, and more.',
};

const OPPORTUNITIES = [
  {
    title: 'Food Pantry Distribution',
    description: 'Help sort and distribute food at the Ranchita Mobile Pantry, held every 2nd and 4th Tuesday. Setup, distribution, and cleanup — about 2 hours per session.',
    icon: Heart,
    commitment: '2 hours, twice monthly',
  },
  {
    title: 'CERT Emergency Response',
    description: 'Train with San Diego County\'s Community Emergency Response Team program. Once certified, you\'ll be part of our disaster preparedness network.',
    icon: Shield,
    commitment: 'Training + on-call',
  },
  {
    title: 'Senior Check-In Program',
    description: 'Regular visits or calls to elderly residents who may be isolated. A simple conversation can make a world of difference for someone living alone in the backcountry.',
    icon: Users,
    commitment: '1–2 hours weekly',
  },
  {
    title: 'Event Support',
    description: 'Help plan and run community events — board meetings, holiday gatherings, fundraisers, and community forums. Every event needs setup, coordination, and cleanup volunteers.',
    icon: Clock,
    commitment: 'As needed',
  },
  {
    title: 'Board & Committee Service',
    description: 'Serve on the MVVCSO Board of Directors or one of our standing committees: Finance, Grant, Community Engagement, Ethics, or Election Committee.',
    icon: CheckCircle,
    commitment: 'Monthly meetings + project work',
  },
];

export default function VolunteerPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-(--section-padding) bg-stone-200/20">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding) text-center">
          <div className="w-16 h-16 rounded-full bg-gold-100/30 flex items-center justify-center mx-auto mb-6">
            <HandHelping className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-(--text-primary)">
            Volunteer with MVVCSO
          </h1>
          <p className="text-lg text-(--text-secondary) max-w-2xl mx-auto">
            For over 50 years, MVVCSO has been 100% volunteer-run. Every program, every event, every meal served — it all happens because neighbors step up for neighbors. Join us.
          </p>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-(--section-padding) bg-stone-50">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-6 text-center">Why Volunteer?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-stone-200 text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold text-(--text-primary) mb-2">Build Community</h3>
              <p className="text-sm text-(--text-secondary)">Connect with your neighbors and strengthen the bonds that make Ranchita special.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-stone-200 text-center">
              <div className="text-3xl mb-3">🌄</div>
              <h3 className="font-semibold text-(--text-primary) mb-2">Make a Real Impact</h3>
              <p className="text-sm text-(--text-secondary)">In a community of 300, every volunteer hour directly improves someone&apos;s life.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-stone-200 text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold text-(--text-primary) mb-2">Learn New Skills</h3>
              <p className="text-sm text-(--text-secondary)">From CERT training to event planning, gain skills that serve you and your community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-(--section-padding) bg-white">
        <div className="max-w-(--container-max) mx-auto px-(--container-padding)">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-8 text-center">Volunteer Opportunities</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {OPPORTUNITIES.map(opp => (
              <div key={opp.title} className="bg-stone-50 rounded-xl p-6 border border-stone-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-100/20 flex items-center justify-center shrink-0">
                    <opp.icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-(--text-primary) mb-1">{opp.title}</h3>
                    <p className="text-sm text-(--text-secondary) leading-relaxed">{opp.description}</p>
                    <p className="text-xs text-(--text-muted) mt-2">Time commitment: {opp.commitment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-(--section-padding) bg-gold-100/40">
        <div className="max-w-2xl mx-auto px-(--container-padding) text-center">
          <h2 className="text-3xl font-bold mb-4 text-(--text-primary)">
            Ready to Help?
          </h2>
          <p className="text-(--text-secondary) mb-8">
            Get in touch and we&apos;ll find the right fit for you. No experience needed — just a willingness to help your neighbors.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gold-400 text-white font-semibold hover:bg-gold-500 transition-colors"
          >
            Contact Us to Volunteer
          </Link>
        </div>
      </section>
    </div>
  );
}
