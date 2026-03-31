'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DesertCreatureMatch } from '@/components/kids/games/desert-creature-match';
import { FireSafetyQuiz } from '@/components/kids/games/fire-safety-quiz';
import { LaunchingSoon } from '@/components/shared/launching-soon';

const gameComponents: Record<string, React.ComponentType> = {
  'desert-creature-match': DesertCreatureMatch,
  'fire-safety': FireSafetyQuiz,
};

const gameTitles: Record<string, string> = {
  'desert-creature-match': 'Desert Creature Match',
  'fire-safety': 'Fire Safety Quiz',
  'desert-plants': 'Desert Plant Explorer',
  'trail-tracker': 'Trail Tracker',
  'weather-watcher': 'Weather Watcher',
  'community-helper': 'Community Helper',
  'word-search': "Rancheti's Word Search",
};

export default function GamePage() {
  const params = useParams();
  const gameId = params.gameId as string;
  const GameComponent = gameComponents[gameId];
  const title = gameTitles[gameId] || 'Game';

  return (
    <div className="min-h-screen bg-gold-50">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/kids/games" className="text-gold-400 hover:text-gold-500"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-2xl font-bold text-(--text-primary)">{title}</h1>
        </div>

        {GameComponent ? (
          <GameComponent />
        ) : (
          <div className="bg-white rounded-2xl p-8 border-2 border-gold-200">
            <LaunchingSoon feature={title} description="This game is being built by the Rancheti's team. Check back soon!" />
          </div>
        )}
      </div>
    </div>
  );
}
