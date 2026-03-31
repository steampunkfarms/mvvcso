'use client';

import { useState, useEffect } from 'react';

const creatures = [
  { name: 'Rattlesnake', emoji: '🐍', nameEs: 'Serpiente' },
  { name: 'Roadrunner', emoji: '🐦', nameEs: 'Correcaminos' },
  { name: 'Bobcat', emoji: '🐱', nameEs: 'Lince' },
  { name: 'Coyote', emoji: '🐺', nameEs: 'Coyote' },
  { name: 'Jackrabbit', emoji: '🐰', nameEs: 'Liebre' },
  { name: 'Hawk', emoji: '🦅', nameEs: 'Halcón' },
  { name: 'Tarantula', emoji: '🕷️', nameEs: 'Tarántula' },
  { name: 'Mountain Lion', emoji: '🦁', nameEs: 'Puma' },
];

interface Card {
  id: number;
  creatureIndex: number;
  flipped: boolean;
  matched: boolean;
}

export function DesertCreatureMatch() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    startGame();
  }, []);

  function startGame() {
    const pairs = creatures.slice(0, 6); // 6 pairs = 12 cards
    const deck = [...pairs, ...pairs].map((creature, i) => ({
      id: i,
      creatureIndex: creatures.indexOf(creature),
      flipped: false,
      matched: false,
    }));
    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    setCards(deck);
    setFlippedIds([]);
    setMatches(0);
    setMoves(0);
    setGameComplete(false);
  }

  function handleCardClick(id: number) {
    if (flippedIds.length >= 2) return;
    const card = cards[id];
    if (card.flipped || card.matched) return;

    const newCards = [...cards];
    newCards[id] = { ...newCards[id], flipped: true };
    setCards(newCards);

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (newCards[first].creatureIndex === newCards[second].creatureIndex) {
        // Match!
        setTimeout(() => {
          const matched = [...newCards];
          matched[first] = { ...matched[first], matched: true };
          matched[second] = { ...matched[second], matched: true };
          setCards(matched);
          setFlippedIds([]);
          const newMatches = matches + 1;
          setMatches(newMatches);
          if (newMatches === 6) setGameComplete(true);
        }, 500);
      } else {
        // No match — flip back
        setTimeout(() => {
          const reset = [...newCards];
          reset[first] = { ...reset[first], flipped: false };
          reset[second] = { ...reset[second], flipped: false };
          setCards(reset);
          setFlippedIds([]);
        }, 1000);
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gold-200">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-(--text-secondary)">
          Matches: <strong>{matches}/6</strong> · Moves: <strong>{moves}</strong>
        </div>
        <button onClick={startGame} className="text-sm text-gold-400 hover:text-gold-500 font-medium">New Game</button>
      </div>

      {gameComplete ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-(--text-primary) mb-2">You did it!</h2>
          <p className="text-(--text-secondary) mb-4">Completed in {moves} moves. +15 XP earned!</p>
          <button onClick={startGame} className="px-6 py-3 rounded-xl bg-gold-400 text-white font-bold hover:bg-gold-500 transition-colors">
            Play Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => handleCardClick(i)}
              className={`aspect-square rounded-xl text-3xl flex flex-col items-center justify-center transition-all duration-300 ${
                card.matched ? 'bg-sage-50 border-2 border-sage-200 scale-95' :
                card.flipped ? 'bg-gold-50 border-2 border-gold-400' :
                'bg-stone-100 border-2 border-stone-200 hover:border-gold-300 cursor-pointer'
              }`}
              disabled={card.matched}
            >
              {card.flipped || card.matched ? (
                <>
                  <span>{creatures[card.creatureIndex].emoji}</span>
                  <span className="text-xs font-medium text-(--text-primary) mt-1">{creatures[card.creatureIndex].name}</span>
                </>
              ) : (
                <span className="text-2xl">❓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
