import { Award, Star, Flame, TreePine, Users, Calendar } from 'lucide-react';

const badgeCategories = [
  { name: 'Explorer', color: 'bg-sage-50 text-sage-600', icon: Star },
  { name: 'Creator', color: 'bg-gold-50 text-gold-600', icon: Award },
  { name: 'Learner', color: 'bg-dusk-50 text-dusk-600', icon: Flame },
  { name: 'Helper', color: 'bg-terra-50 text-terra-400', icon: Users },
  { name: 'Streak', color: 'bg-stone-100 text-(--text-secondary)', icon: Calendar },
];

export default function BadgesPage() {
  return (
    <div className="min-h-screen bg-gold-50">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-8">
        <h1 className="text-3xl font-bold text-(--text-primary) mb-2">My Badges</h1>
        <p className="text-(--text-secondary) mb-8">Collect badges by completing games and activities!</p>

        {/* XP Level */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gold-200 mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-gold-400 flex items-center justify-center text-white text-xl font-bold">1</div>
            <div>
              <h3 className="font-bold text-(--text-primary)">Desert Seed</h3>
              <p className="text-sm text-(--text-muted)">0 / 50 XP to next level</p>
            </div>
          </div>
          <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-gold-400 rounded-full" style={{ width: '0%' }} />
          </div>
        </div>

        {/* Badge Categories */}
        <div className="space-y-6">
          {badgeCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.name}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-gold-400" />
                  <h2 className="text-xl font-bold text-(--text-primary)">{cat.name} Badges</h2>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-stone-200">
                  <p className="text-sm text-(--text-muted)">Complete activities to earn {cat.name.toLowerCase()} badges!</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
