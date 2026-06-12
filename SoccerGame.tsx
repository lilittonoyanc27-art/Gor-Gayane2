/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SOCCER_QUESTIONS } from './SpanishData.ts';
import { audioSynth } from './AudioHelper.ts';
import { PlayerName } from './types.ts';
import { Trophy, ArrowRight, RefreshCw, Star, Info } from 'lucide-react';

interface SoccerGameProps {
  playerName: PlayerName;
  onFinish: (score: number) => void;
  onBack: () => void;
}

export default function SoccerGame({ playerName, onFinish, onBack }: SoccerGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [ballState, setBallState] = useState<'idle' | 'goal' | 'saved'>('idle');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const isGorTurn = currentIdx % 2 === 0;

  const currentQuestion = SOCCER_QUESTIONS[currentIdx];

  const handleOptionClick = (optionIdx: number) => {
    if (selectedOption !== null) return; // Prevent double clicking
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === currentQuestion.correctIndex;
    if (isCorrect) {
      setBallState('goal');
      setScore((prev) => prev + 1);
      audioSynth.playScoreGoal();
    } else {
      setBallState('saved');
      audioSynth.playFail();
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setBallState('idle');
    setShowExplanation(false);

    if (currentIdx < SOCCER_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setBallState('idle');
    setScore(0);
    setIsGameOver(false);
    setShowExplanation(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-800/40 relative overflow-hidden" id="soccer_game_container">
      {/* Turf Green Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-950/40 via-slate-900 to-slate-950 -z-10" />

      {/* Header */}
      <div className="flex justify-between items-center border-b border-emerald-950 pb-4 mb-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-emerald-400">Փուլ 1 • Ֆուտբոլային 11-Մետրանոց</span>
          <h2 className="text-xl font-bold font-sans">Penalty Master!</h2>
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
          {/* Pitch Visualization Area */}
          <div className="relative w-full h-48 bg-emerald-800 rounded-2xl border-2 border-emerald-600/50 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
            {/* Net outline */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-20 border-b-4 border-x-4 border-white/40 bg-gradient-to-b from-white/10 to-transparent flex items-center justify-center">
              {/* Goalkeeper indicator */}
              <div 
                className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold font-sans transition-all duration-700 shadow-lg ${
                  ballState === 'goal' 
                    ? 'bg-rose-500 translate-x-12' 
                    : ballState === 'saved' 
                    ? 'bg-emerald-400 scale-110 -translate-y-2' 
                    : 'bg-amber-400 animate-pulse'
                }`}
              >
                🧤
              </div>
            </div>

            {/* Goal feedback text */}
            {ballState === 'goal' && (
              <div className="absolute inset-x-0 top-8 text-center text-3xl font-extrabold text-yellow-400 uppercase tracking-widest animate-[bounce_1s_infinite] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                ԳՈ՜Ո՜Ո՜Լ ⚽️🔥
              </div>
            )}
            {ballState === 'saved' && (
              <div className="absolute inset-x-0 top-8 text-center text-2xl font-extrabold text-rose-300 uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                ԴԱՐՊԱՍԱՊԱՀԸ ՓՐԿԵՑ 🧤
              </div>
            )}

            {/* Penalty Mark and Ball */}
            <div className="w-full flex justify-center mt-auto pb-4 relative">
              {/* Kicker player preview */}
              <div className="absolute bottom-5 left-1/3 -translate-x-4 flex flex-col items-center">
                <span className="text-2xl animate-pulse">🏃{playerName === 'Team' ? (isGorTurn ? '👦' : '👧') : (playerName === 'Gor' ? '👦' : '👧')}</span>
                <span className="text-[10px] font-bold text-slate-300">{playerName === 'Team' ? (isGorTurn ? 'Գոռ' : 'Գայանե') : (playerName === 'Gor' ? 'Գոռ' : 'Գայանե')}</span>
              </div>

              <div className="w-2.5 h-2.5 rounded-full bg-white/60 mb-1" /> {/* Penalty Spot */}
              {/* Animated Soccer Ball */}
              <div
                className={`absolute bottom-4 text-3xl transition-all duration-500 ease-out ${
                  ballState === 'goal'
                    ? 'transform -translate-y-32 -translate-x-16 scale-50 rotate-[360deg]'
                    : ballState === 'saved'
                    ? 'transform -translate-y-24 scale-75 rotate-180'
                    : 'cursor-pointer hover:scale-115 active:scale-95 text-3xl animate-bounce'
                }`}
              >
                ⚽️
              </div>
            </div>

            {/* Soccer Pitch Markings */}
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white/20" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-10 border-t border-x border-white/20 rounded-t-full" />
          </div>

          {/* Question Text */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900 mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-emerald-400 font-mono">Հարց {currentIdx + 1} / {SOCCER_QUESTIONS.length}</span>
              <span className="text-[11px] px-2.5 py-0.5 bg-emerald-950/80 text-yellow-400 border border-emerald-850 rounded-full font-bold">
                🎯 {playerName === 'Team' ? (isGorTurn ? 'Գոռի հերթն է 👦' : 'Գայանեի հերթն է 👧') : (playerName === 'Gor' ? 'Գոռ 👦' : 'Գայանե 👧')}
              </span>
            </div>
            <p className="text-lg font-medium mt-1 text-slate-100">{currentQuestion.questionArm}</p>
            <p className="mt-2 text-md text-emerald-300 font-mono italic bg-emerald-950/50 py-1.5 px-3 rounded border border-emerald-900/30">
              {currentQuestion.sentenceTemplate?.replace('____', '______')}
            </p>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === currentQuestion.correctIndex;
              let btnClass = "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100";

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnClass = "bg-emerald-600 border-emerald-400 text-white font-bold scale-102";
                } else if (isSelected) {
                  btnClass = "bg-rose-600 border-rose-400 text-white font-bold opacity-90";
                } else {
                  btnClass = "bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={i}
                  onClick={() => handleOptionClick(i)}
                  disabled={selectedOption !== null}
                  className={`py-3.5 px-4 rounded-xl border-2 text-center font-medium transition-all duration-300 shadow-sm ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {showExplanation && (
            <div className="bg-slate-950 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-2">
              <div className="flex items-start gap-2.5">
                <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-200">Բացատրություն</p>
                  <p className="text-xs text-gray-300 leading-relaxed mt-1">{currentQuestion.explanation}</p>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/25 active:scale-95"
                >
                  Հաջորդը <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6">
          <div className="inline-block p-4 bg-emerald-950 rounded-full border border-emerald-500 shadow-lg shadow-emerald-500/10">
            <Trophy className="w-16 h-16 text-yellow-400 animate-[bounce_2s_infinite]" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Խաղն Ավարտվեց:</h3>
            <p className="text-slate-400 text-sm mt-1">Դուք հաջողությամբ կատարեցիք 11-մետրանոցների հարվածաշարը</p>
          </div>

          {/* Score Counter */}
          <div className="bg-slate-950 border border-emerald-900 rounded-2xl max-w-sm mx-auto p-4 flex justify-around items-center">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-mono">Գոլեր</span>
              <span className="text-3xl font-black text-yellow-400">{score}</span>
            </div>
            <div className="h-8 w-px bg-emerald-950/10 border-r border-emerald-900" />
            <div>
              <span className="text-xs text-slate-400 block uppercase font-mono">Արդյունք</span>
              <span className="text-lg font-bold text-emerald-400">
                {score === SOCCER_QUESTIONS.length ? '🥇 Անթերի' : score >= 3 ? '🥈 Հրաշալի' : '🥉 Լավ'}
              </span>
            </div>
          </div>

          {/* Finish Buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm rounded-xl font-semibold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> Կրկնել
            </button>
            <button
              onClick={() => onFinish(score)}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              Ավարտել Խաղը <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
