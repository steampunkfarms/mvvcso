import Link from 'next/link';
import { Gamepad2, Palette, Award, Compass } from 'lucide-react';

export default function KidsHomePage() {
  return (
    <div className="min-h-screen bg-gold-50">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-8">
        {/* Welcome */}
        <div className="bg-white rounded-2xl p-8 border-2 border-gold-200 mb-8 text-center">
          <div className="text-5xl mb-4">🏔️</div>
          <h1 className="text-3xl font-bold text-(--text-primary) mb-2">Welcome, Explorer!</h1>
          <p className="text-(--text-secondary)">Ready to explore Ranchita today?</p>

          {/* XP Bar */}
          <div className="max-w-sm mx-auto mt-6">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-bold text-gold-600">Level 1: Desert Seed</span>
              <span className="text-(--text-muted)">0 / 50 XP</span>
            </div>
            <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full bg-gold-400 rounded-full transition-all" style={{ width: '0%' }} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/kids/games" className="bg-white rounded-2xl p-6 border-2 border-gold-200 hover:border-gold-400 transition-colors text-center group">
            <Gamepad2 className="w-10 h-10 text-gold-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-(--text-primary)">Games</h3>
            <p className="text-xs text-(--text-muted) mt-1">Learn & play</p>
          </Link>

          <Link href="/kids/create" className="bg-white rounded-2xl p-6 border-2 border-gold-200 hover:border-gold-400 transition-colors text-center group">
            <Palette className="w-10 h-10 text-terra-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-(--text-primary)">Create</h3>
            <p className="text-xs text-(--text-muted) mt-1">Build cartoons</p>
          </Link>

          <Link href="/kids/badges" className="bg-white rounded-2xl p-6 border-2 border-gold-200 hover:border-gold-400 transition-colors text-center group">
            <Award className="w-10 h-10 text-sage-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-(--text-primary)">Badges</h3>
            <p className="text-xs text-(--text-muted) mt-1">My collection</p>
          </Link>

          <Link href="/kids/explore" className="bg-white rounded-2xl p-6 border-2 border-gold-200 hover:border-gold-400 transition-colors text-center group">
            <Compass className="w-10 h-10 text-stone-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-(--text-primary)">Explore</h3>
            <p className="text-xs text-(--text-muted) mt-1">Virtual Ranchita</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
