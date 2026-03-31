'use client';

import { useState } from 'react';

const questions = [
  {
    question: 'You see smoke coming from the hills near your house. What do you do first?',
    answers: ['Go closer to check it out', 'Tell an adult right away', 'Ignore it', 'Take a photo'],
    correct: 1,
    explanation: 'Always tell a grown-up immediately! They can call 911 or check if it\'s safe.',
  },
  {
    question: 'What should your family have ready in case of a wildfire evacuation?',
    answers: ['A go-bag with important things', 'Nothing — fires don\'t happen here', 'Just car keys', 'Extra firewood'],
    correct: 0,
    explanation: 'A go-bag should have water, documents, medicines, phone chargers, and clothes!',
  },
  {
    question: 'How much space should be cleared around your home to protect it from fire?',
    answers: ['5 feet', '20 feet', '100 feet', '1 mile'],
    correct: 2,
    explanation: '100 feet of defensible space! That means clearing dead brush and plants away from your home.',
  },
  {
    question: 'What road do most Ranchita families use to evacuate?',
    answers: ['A secret tunnel', 'Highway 78 or S22', 'The PCT trail', 'Flying helicopter'],
    correct: 1,
    explanation: 'Highway 78 and S22 are the main roads out. Know your routes before you need them!',
  },
  {
    question: 'Who are the firefighters that protect Ranchita?',
    answers: ['Batman', 'CAL FIRE at Station 58', 'The Rancheti Yeti', 'Nobody'],
    correct: 1,
    explanation: 'CAL FIRE crews at Station 58 in Ranchita protect our community. MVVCSO started as volunteer firefighters in 1973!',
  },
];

export function FireSafetyQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  function handleSelect(answerIndex: number) {
    if (showResult) return;
    setSelected(answerIndex);
    setShowResult(true);
    if (answerIndex === questions[currentQ].correct) {
      setScore(s => s + 1);
    }
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
    }
  }

  function restart() {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white rounded-2xl p-8 border-2 border-gold-200 text-center">
        <div className="text-5xl mb-4">{pct >= 80 ? '🔥🛡️' : pct >= 60 ? '👍' : '📚'}</div>
        <h2 className="text-2xl font-bold text-(--text-primary) mb-2">
          {pct >= 80 ? 'Fire Safety Expert!' : pct >= 60 ? 'Good job!' : 'Keep learning!'}
        </h2>
        <p className="text-(--text-secondary) mb-2">Score: {score}/{questions.length} ({pct}%)</p>
        <p className="text-sm text-gold-600 mb-6">+{Math.round(pct / 5)} XP earned!</p>
        <button onClick={restart} className="px-6 py-3 rounded-xl bg-gold-400 text-white font-bold hover:bg-gold-500 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gold-200">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-(--text-muted)">Question {currentQ + 1} of {questions.length}</span>
        <span className="text-sm font-bold text-gold-600">Score: {score}</span>
      </div>

      <h2 className="text-lg font-bold text-(--text-primary) mb-6">{q.question}</h2>

      <div className="space-y-3 mb-6">
        {q.answers.map((answer, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            disabled={showResult}
            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              showResult
                ? i === q.correct
                  ? 'bg-sage-50 border-sage-400 text-sage-800'
                  : i === selected
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'bg-stone-50 border-stone-200 text-(--text-muted)'
                : 'bg-stone-50 border-stone-200 text-(--text-primary) hover:border-gold-300 cursor-pointer'
            }`}
          >
            {answer}
          </button>
        ))}
      </div>

      {showResult && (
        <div className="bg-gold-50 rounded-xl p-4 mb-4">
          <p className="text-sm text-(--text-primary)">
            {selected === q.correct ? '✅ Correct! ' : '❌ Not quite. '}
            {q.explanation}
          </p>
        </div>
      )}

      {showResult && (
        <button onClick={handleNext}
          className="px-6 py-3 rounded-xl bg-gold-400 text-white font-bold hover:bg-gold-500 transition-colors">
          {currentQ < questions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      )}
    </div>
  );
}
