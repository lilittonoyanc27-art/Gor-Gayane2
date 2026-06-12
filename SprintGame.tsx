/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SPRINT_TASKS, SPRINT_OPTIONS } from './SpanishData.ts';
import { audioSynth } from './AudioHelper.ts';
import { PlayerName } from './types.ts';
import { Trophy, ArrowRight, RefreshCw, Star, Info } from 'lucide-react';

interface SprintGameProps {
  playerName: PlayerName;
  onFinish: (score: number) => void;
  onBack: () => void;
}

export default function SprintGame({ playerName, onFinish, onBack }: SprintGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isWrong, setIsWrong] = useState(false);
  const [selectedEnding, setSelectedEnding] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const isGorTurn = currentIdx % 2 === 0;

  const currentTask = SPRINT_TASKS[currentIdx];

  const handleEndingClick = (ending: string) => {
    if (selectedEnding !== null) return;
    setSelectedEnding(ending);

    const isCorrect = ending === currentTask.correctEnding;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      audioSynth.playSuccess();
      setIsWrong(false);

      // Advance to next or finish immediately
      setTimeout(() => {
        setSelectedEnding(null);
        if (currentIdx < SPRINT_TASKS.length - 1) {
          setCurrentIdx((prev) => prev + 1);
        } else {
          setIsGameOver(true);
        }
      }, 400);
    } else {
      setIsWrong(true);
      audioSynth.playFail();

      // Clear lock after 600ms
      setTimeout(() => {
        setSelectedEnding(null);
        setIsWrong(false);
      }, 600);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedEnding(null);
    setIsWrong(false);
    setIsGameOver(false);
  };

  const progressPercentage = (currentIdx / SPRINT_TASKS.length) * 100;

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-rose-800/40 relative overflow-hidden" id="sprint_game_container">
      {/* Rose Sprint Accent Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/40 via-slate-900 to-slate-950 -z-10" />

      {/* Header */}
      <div className="flex justify-between items-center border-b border-rose-950 pb-4 mb-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-rose-400">Փուլ 4 • Միլիոնավազք</span>
          <h2 className="text-xl font-bold font-sans">100m Future Dash!</h2>
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
          {/* Running Track Visualization */}
          <div className="relative w-full h-36 bg-stone-800/90 rounded-2xl border-2 border-stone-600 overflow-hidden flex flex-col justify-end p-2 px-6 shadow-inner">
            {/* Lane Markings */}
            <div className="absolute inset-x-0 h-0.5 bg-orange-600/30 top-1/3" />
            <div className="absolute inset-x-0 h-0.5 bg-orange-600/30 top-2/3" />
            
            {/* Start & Finish Markings */}
            <div className="absolute left-10 inset-y-0 w-1 bg-white/20 border-r border-dashed border-white/10" />
            <div className="absolute right-12 inset-y-0 w-2 bg-rose-600 flex items-center justify-center text-[10px] font-black text-white px-0.5 writing-mode-vertical">
              FINISH
            </div>

            {/* Runner Avatar */}
            <div 
              className="absolute transition-all duration-300 ease-out flex flex-col items-center"
              style={{ 
                left: `calc(10% + (${progressPercentage}% * 0.72))`,
                bottom: '12%',
              }}
            >
              <span className="text-3xl animate-bounce">
                🏃 {playerName === 'Team' ? (isGorTurn ? '👦' : '👧') : (playerName === 'Gor' ? '👦' : '👧')}
              </span>
              <span className="text-[10px] font-sans font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-full mt-1">
                {playerName === 'Team' ? (isGorTurn ? 'Գոռ' : 'Գայանե') : (playerName === 'Gor' ? 'Գոռ' : 'Գայանե')}
              </span>
            </div>

            {/* Distance meters indicators */}
            <div className="absolute bottom-1 left-4 font-mono text-[10px] text-stone-500">
              0м
            </div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] text-stone-500">
              50м
            </div>
            <div className="absolute bottom-1 right-20 font-mono text-[10px] text-stone-500">
              100м
            </div>
          </div>

          {/* Prompt banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-rose-950 text-left">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-rose-400 font-mono">Փուլ {currentIdx + 1} / {SPRINT_TASKS.length}</span>
              <span className="text-[11px] px-2.5 py-0.5 bg-rose-950/80 text-yellow-400 border border-rose-850 rounded-full font-bold">
                🎯 {playerName === 'Team' ? (isGorTurn ? 'Գոռի հերթն է 👦' : 'Գայանեի հերթն է 👧') : (playerName === 'Gor' ? 'Գոռ 👦' : 'Գայանե 👧')}
              </span>
            </div>
            <p className="text-lg font-bold text-gray-200 mt-1 font-sans">
              Ո՞րն է <strong className="text-yellow-400 font-sans">{currentTask.pronoun}</strong> դեմքի ճիշտ վերջավորությունը ապառնիում.
            </p>
          </div>

          {/* Endings Select board Grid */}
          <div className="grid grid-cols-3 gap-2">
            {SPRINT_OPTIONS.map((ending) => {
              const isSelected = selectedEnding === ending;
              const isCorrectEnding = ending === currentTask.correctEnding;
              let itemClass = "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100 hover:border-rose-500/50";

              if (selectedEnding !== null) {
                if (isCorrectEnding) {
                  itemClass = "bg-rose-600 border-rose-400 text-white font-bold scale-102";
                } else if (isSelected) {
                  itemClass = "bg-rose-800 border-rose-600 text-white font-bold animate-[shake_0.2s_infinite]";
                } else {
                  itemClass = "bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={ending}
                  onClick={() => handleEndingClick(ending)}
                  disabled={selectedEnding !== null}
                  className={`py-4 px-2 rounded-xl border-2 text-center text-lg font-mono font-black transition-all duration-200 ${itemClass}`}
                >
                  {ending}
                </button>
              );
            })}
          </div>

          {/* Stumble warning label */}
          {isWrong && (
            <div className="text-center text-rose-400 font-semibold font-sans text-xs flex justify-center items-center gap-1.5 animate-pulse">
              ⚠️ Սայթաքում! Ընտրեք ճիշտ վերջավորությունը արագ վերականգնվելու համար:
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6">
          <div className="inline-block p-4 bg-rose-950 rounded-full border border-rose-500 shadow-lg shadow-rose-500/10">
            <Trophy className="w-16 h-16 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Վազքն Ավարտվեց! 🏆</h3>
            <p className="text-slate-400 text-sm mt-1">Դուք հատեցիք վազքուղու եզրագիծը հաջողությամբ</p>
          </div>

          {/* Score box */}
          <div className="bg-slate-950 border border-rose-900 rounded-2xl max-w-sm mx-auto p-4 flex justify-around items-center">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-mono">Հարվածներ</span>
              <span className="text-3xl font-black text-rose-400">{score} / {SPRINT_TASKS.length}</span>
            </div>
            <div className="h-8 w-px bg-rose-950/10 border-r border-rose-900" />
            <div>
              <span className="text-xs text-slate-400 block uppercase font-mono">Ոսկե վայրկյան</span>
              <span className="text-lg font-bold text-emerald-400">🥇 Չեմպիոն</span>
            </div>
          </div>

          {/* Restart/Next buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm rounded-xl font-semibold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> Կրկնել
            </button>
            <button
              onClick={() => onFinish(score)}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/25 transition-all active:scale-95"
            >
              Ավարտել Խաղը <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
