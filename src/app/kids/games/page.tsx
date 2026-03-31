import Link from 'next/link';
import { Gamepad2, Flame, TreePine, Mountain, Cloud, Users, Search } from 'lucide-react';

const games = [
  { id: 'desert-creature-match', title: 'Desert Creature Match', description: 'Memory card game with Ranchita animals!', icon: Gamepad2, age: '5-12', xp: 15 },
  { id: 'fire-safety', title: 'Fire Safety Quiz', description: 'Learn what to do during wildfire season.', icon: Flame, age: '5-12', xp: 20 },
  { id: 'desert-plants', title: 'Desert Plant Explorer', description: 'Identify chaparral plants — sage, yucca, cactus!', icon: TreePine, age: '5-12', xp: 15 },
  { id: 'trail-tracker', title: 'Trail Tracker', description: 'Follow the PCT through the mountains.', icon: Mountain, age: '9-12', xp: 20 },
  { id: 'weather-watcher', title: 'Weather Watcher', description: 'Match weather patterns in the desert.', icon: Cloud, age: '5-12', xp: 15 },
  { id: 'community-helper', title: 'Community Helper', description: 'Sort activities — firefighter, volunteer, neighbor!', icon: Users, age: '5-8', xp: 10 },
  { id: 'word-search', title: "Rancheti's Word Search", description: 'Find desert and community words! EN/ES.', icon: Search, age: '5-12', xp: 10 },
];

export default function GamesLibraryPage() {
  return (
    <div className="min-h-screen bg-gold-50">
      <div className="max-w-(--container-max) mx-auto px-(--container-padding) py-8">
        <h1 className="text-3xl font-bold text-(--text-primary) mb-2">Learning Games</h1>
        <p className="text-(--text-secondary) mb-8">Play, learn, and earn XP! 🌟</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => {
            const Icon = game.icon;
            return (
              <Link key={game.id} href={`/kids/games/${game.id}`}
                className="bg-white rounded-2xl p-6 border-2 border-gold-200 hover:border-gold-400 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 rounded-xl bg-gold-100 flex items-center justify-center mb-4 group-hover:bg-gold-200 transition-colors">
                  <Icon className="w-7 h-7 text-gold-600" />
                </div>
                <h3 className="text-lg font-bold text-(--text-primary) mb-1">{game.title}</h3>
                <p className="text-sm text-(--text-secondary) mb-3">{game.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-(--text-muted)">Ages {game.age}</span>
                  <span className="text-gold-600 font-bold">+{game.xp} XP</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
