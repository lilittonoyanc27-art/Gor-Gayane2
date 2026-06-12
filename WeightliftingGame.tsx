/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WEIGHTLIFTING_QUESTIONS } from './SpanishData.ts';
import { audioSynth } from './AudioHelper.ts';
import { PlayerName } from './types.ts';
import { Trophy, RefreshCw, Star, Info, ChevronRight } from 'lucide-react';

interface WeightliftingGameProps {
  playerName: PlayerName;
  onFinish: (score: number) => void;
  onBack: () => void;
}

export default function WeightliftingGame({ playerName, onFinish, onBack }: WeightliftingGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [liftState, setLiftState] = useState<'idle' | 'lifting' | 'success' | 'drop'>('idle');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const isGorTurn = currentIdx % 2 === 0;

  const currentTask = WEIGHTLIFTING_QUESTIONS[currentIdx];

  const handleLift = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    setLiftState('lifting');
    audioSynth.playHeavyLift();

    const isCorrect = optionIdx === currentTask.correctIndex;

    setTimeout(() => {
      if (isCorrect) {
        setLiftState('success');
        setScore((prev) => prev + 1);
        audioSynth.playSuccess();
      } else {
        setLiftState('drop');
        audioSynth.playFail();
      }
      setShowExplanation(true);
    }, 600);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setLiftState('idle');
    setShowExplanation(false);

    if (currentIdx < WEIGHTLIFTING_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setLiftState('idle');
    setScore(0);
    setIsGameOver(false);
    setShowExplanation(false);
  };

  // Barbell weight plate visuals helper
  const renderWeightPlates = (weight: number) => {
    const platesCount = Math.floor(weight / 30);
    return (
      <div className="flex gap-1 items-center">
        {Array.from({ length: Math.min(platesCount, 4) }).map((_, i) => (
          <div
            key={i}
            className={`w-3.5 rounded-sm shadow-md ${
              i === 0 ? 'h-16 bg-red-600' : i === 1 ? 'h-14 bg-blue-600' : i === 2 ? 'h-12 bg-yellow-500' : 'h-10 bg-green-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-yellow-800/40 relative overflow-hidden" id="weightlifting_game_container">
      {/* Background Chalk Glow Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-950/30 via-slate-900 to-slate-950 -z-10" />

      {/* Header */}
      <div className="flex justify-between items-center border-b border-yellow-950 pb-4 mb-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-yellow-400">Փուլ 6 • Ծանրամարտի Առաջնություն</span>
          <h2 className="text-xl font-bold font-sans">Barbell Weightlifter!</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-800 px-3 py-1 rounded-full font-medium text-slate-300">
            {playerName === 'Team' ? (
              <span>Հերթը՝ <strong className="text-yellow-400">{isGorTurn ? 'Գոռ 👦' : 'Գայանե 👧'}</strong></span>
            ) : (
              <span>Խաղացող՝ <strong className="text-yellow-400">{playerName === 'Gor' ? 'Գոռ' : 'Գայանե'}</strong></span>
            )}
          </span>
          <button onClick={onBack} className="text-xs text-slate-400 hover:text-white transition-colors">
            Ելք
          </button>
        </div>
      </div>

      {!isGameOver ? (
        <div className="space-y-6">
          {/* Barbell & Athlete Visual Arena */}
          <div className="relative w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-end p-4 shadow-inner">
            
            {/* Massive Weight Plate Counter Badge */}
            <div className="absolute top-4 left-4 bg-yellow-500/15 border border-yellow-500 rounded-xl px-4 py-1 flex items-center justify-center">
              <span className="text-xl font-black text-yellow-400 font-mono tracking-tight">
                {currentTask.weight} <small className="text-xs text-yellow-500 font-bold uppercase">կգ</small>
              </span>
            </div>

            {/* Stadium chalk bowl overlay */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-900 border border-slate-850 py-0.5 px-2 rounded text-xs font-mono">
              <span className="text-sm">🏋️ {playerName === 'Team' ? (isGorTurn ? '👦' : '👧') : (playerName === 'Gor' ? '👦' : '👧')}</span>
              <span className="text-[10px] font-mono font-bold text-slate-300">{playerName === 'Team' ? (isGorTurn ? 'Գոռ' : 'Գայանե') : (playerName === 'Gor' ? 'Գոռ' : 'Գայանե')}</span>
            </div>

            {/* Lift feedback labels */}
            {liftState === 'success' && (
              <div className="absolute inset-x-0 top-16 text-center text-3xl font-extrabold text-lime-400 uppercase tracking-wider animate-bounce drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                ՀԱՋՈՂ ԲԱՐԺՐԱՑՈՒՄ! 🏋️‍♀️✨
              </div>
            )}
            {liftState === 'drop' && (
              <div className="absolute inset-x-0 top-16 text-center text-2xl font-extrabold text-rose-500 uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                ԾԱՆՐԱՁՈՂԸ ԸՆԿԱՎ 💥
              </div>
            )}

            {/* Simulated Lift Animation Barbell */}
            <div className="w-full flex items-center justify-between px-10 relative pb-4">
              
              {/* Left Plates */}
              {renderWeightPlates(currentTask.weight)}

              {/* Bar and Athlete */}
              <div className="flex-1 h-1.5 bg-zinc-400 mx-1 relative flex justify-center">
                {/* Visual Athlete Lift positions */}
                <div 
                  className={`absolute transition-all duration-500 text-4xl leading-none ${
                    liftState === 'success'
                      ? '-translate-y-24 scale-110 text-yellow-400'
                      : liftState === 'lifting'
                      ? '-translate-y-10 scale-95 duration-100'
                      : liftState === 'drop'
                      ? 'translate-y-2 text-rose-600 rotate-90 opacity-60'
                      : '-translate-y-6'
                  }`}
                >
                  🏋️ {playerName === 'Team' ? (isGorTurn ? '👦' : '👧') : (playerName === 'Gor' ? '👦' : '👧')} 
                </div>
              </div>

              {/* Right Plates */}
              {renderWeightPlates(currentTask.weight)}
            </div>

            {/* Wooden Lift Platform */}
            <div className="w-full h-2 bg-amber-800 rounded-b" />
          </div>

          {/* Question Sentence */}
          <div className="bg-slate-950 p-4 rounded-xl border border-yellow-950 text-left">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-yellow-400 font-mono">Փորձ {currentIdx + 1} / {WEIGHTLIFTING_QUESTIONS.length}</span>
              <span className="text-[11px] px-2.5 py-0.5 bg-yellow-950/80 text-yellow-400 border border-yellow-850 rounded-full font-bold">
                🎯 {playerName === 'Team' ? (isGorTurn ? 'Գոռի հերթն է 👦' : 'Գայանեի հերթն է 👧') : (playerName === 'Gor' ? 'Գոռ 👦' : 'Գայանե 👧')}
              </span>
            </div>
            <p className="text-[15px] font-sans text-gray-200 mt-1">{currentTask.questionArm}</p>
            <p className="text-lg font-mono font-bold text-yellow-300 mt-2 bg-yellow-950/10 py-1 px-3 rounded border border-yellow-950/10">
              {currentTask.sentenceSpanish}
            </p>
          </div>

          {/* Multi-choice options */}
          <div className="grid grid-cols-2 gap-3">
            {currentTask.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === currentTask.correctIndex;
              let btnClass = "bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-100";

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnClass = "bg-yellow-600 border-yellow-400 text-white font-bold scale-102";
                } else if (isSelected) {
                  btnClass = "bg-rose-600 border-rose-400 text-white font-bold opacity-90";
                } else {
                  btnClass = "bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleLift(i)}
                  disabled={selectedOption !== null}
                  className={`py-3 px-4 rounded-xl border-2 text-sm text-center font-semibold transition-all duration-300 shadow-sm ${btnClass}`}
                >
                  💪 {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation bar */}
          {showExplanation && (
            <div className="bg-slate-950 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-2 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-200">Մարզչական Խորհուրդներ</p>
                  <p className="text-xs text-gray-300 leading-relaxed mt-1">{currentTask.explanation}</p>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-md active:scale-95"
                >
                  Հաջորդ քաշը <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6">
          <div className="inline-block p-4 bg-yellow-950 rounded-full border border-yellow-500 shadow-lg shadow-yellow-500/10">
            <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Մարզումն Ավարտվեց! 🏋️‍♂️</h3>
            <p className="text-slate-400 text-sm mt-1">Դուք բարձրացրիք ծանրության ռեկորդային սահմանները</p>
          </div>

          {/* Score cards */}
          <div className="bg-slate-950 border border-yellow-900 rounded-2xl max-w-sm mx-auto p-4 flex justify-around items-center">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-mono">Հաջող բարձրացումներ</span>
              <span className="text-3xl font-black text-yellow-400">{score}</span>
            </div>
            <div className="h-8 w-px bg-yellow-950/10 border-r border-yellow-900" />
            <div>
              <span className="text-xs text-slate-400 block uppercase font-mono">Որակ</span>
              <span className="text-lg font-bold text-yellow-400">
                {score === WEIGHTLIFTING_QUESTIONS.length ? '🥇 Աշխարհի Ռեկորդ' : score >= 3 ? '🥈 Մարզական վարպետ' : '🥉 Սկսնակ'}
              </span>
            </div>
          </div>

          {/* Action blocks */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm rounded-xl font-semibold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> Կրկնել
            </button>
            <button
              onClick={() => onFinish(score)}
              className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-yellow-500/25 transition-all active:scale-95"
            >
              Ավարտել Խաղը <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
