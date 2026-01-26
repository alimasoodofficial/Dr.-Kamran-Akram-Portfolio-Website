"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Configuration ---
const TIME_LIMIT = 20;
const TARGET_GOOD = 5;
const MAX_STRIKES = 2;
// Mobile: 6 chips (3x2), Desktop: 8 chips (4x2)
const GET_CHIP_COUNT = () => (typeof window !== 'undefined' && window.innerWidth < 640 ? 6 : 8);

const GOOD_MOVES = [
  "Clean data", "Define goal", "Check units", "Log changes", 
  "Verify source", "Handle nulls", "Test logic", "Peer review"
];
const BAD_MOVES = [
  "Cherry-pick", "Skip QA", "Ignore bias", "Hardcode", 
  "Hide errors", "No backup", "Guess stats"
];

export default function ResearchGamePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [chips, setChips] = useState<{ label: string; type: 'good' | 'bad' }[]>([]);
  const [toast, setToast] = useState("");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Logic to ensure NO duplicates on the current board
  const generateChips = useCallback(() => {
    const count = GET_CHIP_COUNT();
    const badTarget = Math.floor(count * 0.4); // ~40% bad moves
    const goodTarget = count - badTarget;

    const shuffledGood = [...GOOD_MOVES].sort(() => Math.random() - 0.5).slice(0, goodTarget);
    const shuffledBad = [...BAD_MOVES].sort(() => Math.random() - 0.5).slice(0, badTarget);

    const combined = [
      ...shuffledGood.map(label => ({ label, type: 'good' as const })),
      ...shuffledBad.map(label => ({ label, type: 'bad' as const }))
    ];

    setChips(combined.sort(() => Math.random() - 0.5));
  }, []);

  const stopGame = useCallback((status: 'won' | 'lost', message: string) => {
    setGameState(status);
    setToast(message);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleChipClick = (type: 'good' | 'bad') => {
    if (gameState !== 'playing') return;

    if (type === 'good') {
      const newScore = score + 1;
      setScore(newScore);
      setToast("✔ Solid Move!");
      if (newScore >= TARGET_GOOD) return stopGame('won', "Research-ready!");
    } else {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      setToast("✖ Data Risk!");
      if (newStrikes >= MAX_STRIKES) return stopGame('lost', "Accuracy > Speed.");
    }
    generateChips(); // Refresh board with a new non-repeating set
  };

  const startGame = () => {
    setScore(0); setStrikes(0); setTimeLeft(TIME_LIMIT);
    setGameState('playing'); setToast("Go!"); generateChips();
    timerRef.current = setInterval(() => {
      setTimeLeft((p) => (p <= 1 ? (stopGame('lost', "Time's up!"), 0) : p - 1));
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start font-sans">
      {/* Game Window */}
      {isOpen && (
        <div className="mb-4 w-[280px] xs:w-[320px] sm:w-[380px] bg-slate-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden transition-all animate-in slide-in-from-bottom-2">
          <div className="p-3 sm:p-4 bg-white/5 border-b  border-white/10 flex justify-between items-center">
            <span className="text-xs sm:text-lg font-bold text-white font-inter  tracking-wider">Research Sprint</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">✕</button>
          </div>


          <div className="p-4 sm:p-5">
            {gameState === 'idle' ? (
              <div className="text-center py-4">
                <p className="text-slate-300 text-xs sm:text-lg mb-4 leading-relaxed">
                  Spot 5 valid research moves. <br/>Avoid the shortcuts!
                </p>
                <button onClick={startGame} className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-900/20 cursor-pointer">
                  Start Game
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between mb-4 px-2">
                  <Stat val={`${timeLeft}s`} label="Time" />
                  <Stat val={`${score}/${TARGET_GOOD}`} label="Score" />
                  <Stat val={`${strikes}`} label="Strikes" color={strikes > 0 ? "text-orange-400" : "text-white"} />
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {chips.map((c, i) => (
                    <button 
                      key={`${c.label}-${i}`} 
                      onClick={() => handleChipClick(c.type)}
                      className="p-2 sm:p-3 text-[10px] sm:text-xs bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 text-slate-200 transition-all active:scale-95 text-center leading-tight min-h-[44px] flex items-center justify-center"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                
                <div className="text-[10px] sm:text-xs text-center font-bold text-emerald-400 h-4 uppercase tracking-widest">{toast}</div>
                
                {(gameState === 'won' || gameState === 'lost') && (
                  <button onClick={startGame} className="mt-4 w-full text-[10px] text-slate-500 hover:text-white underline uppercase">
                    Play Again
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-600 transform active:scale-90 ${
          isOpen ? 'bg-red-500 !px-6 !py-5  text-white' : 'bg-blue-900 hover:scale-105 animate-bounce'
        }`}
      >
        <span className="text-sm ">{isOpen ? '✕' : '🔬'}</span>
        {!isOpen && (
          <span className="pr-2 text-white font-bold text-xs sm:text-sm whitespace-nowrap hidden xs:block">
            Research Challenge
          </span>
        )}
      </button>
    </div>
  );
}

function Stat({ val, label, color }: { val: string; label: string; color?: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-sm sm:text-lg font-mono font-black ${color || 'text-white'}`}>{val}</span>
      <span className="text-[8px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-tighter">{label}</span>
    </div>
  );
}