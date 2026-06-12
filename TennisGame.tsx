/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TENNIS_QUESTIONS } from './SpanishData.ts';
import { audioSynth } from './AudioHelper.ts';
import { PlayerName } from './types.ts';
import { Trophy, ArrowRight, RefreshCw, Star, Info } from 'lucide-react';

interface TennisGameProps {
  playerName: PlayerName;
  onFinish: (score: number) => void;
  onBack: () => void;
}

export default function TennisGame({ playerName, onFinish, onBack }: TennisGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [ballState, setBallState] = useState<'opponent' | 'mid' | 'player' | 'return'>('opponent');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const isGorTurn = currentIdx % 2 === 0;

  const currentQuestion = TENNIS_QUESTIONS[currentIdx];

  const handleOptionClick = (optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === currentQuestion.correctIndex;
    if (isCorrect) {
      setBallState('return');
      setScore((prev) => prev + 1);
      audioSynth.playHitTennis();
    } else {
      setBallState('mid');
      audioSynth.playFail();
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setBallState('opponent');
    setShowExplanation(false);

    if (currentIdx < TENNIS_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setBallState('opponent');
    setScore(0);
    setIsGameOver(false);
    setShowExplanation(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-sky-800/40 relative overflow-hidden" id="tennis_game_container">
      {/* Sky Blue Court Accent Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/40 via-slate-900 to-slate-950 -z-10" />

      {/* Header */}
      <div className="flex justify-between items-center border-b border-sky-950 pb-4 mb-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-sky-400">Փուլ 3 • Թենիսի Մրցախաղ</span>
          <h2 className="text-xl font-bold font-sans">Tennis Grand Slam!</h2>
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
          {/* Tennis Court Arena */}
          <div className="relative w-full h-48 bg-teal-900/95 rounded-2xl border-2 border-white/30 overflow-hidden flex flex-col justify-between p-4 shadow-lg">
            {/* Court Markings */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/40" /> {/* Net */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-white/20" /> {/* Half court line */}
            <div className="absolute inset-x-4 top-8 h-px bg-white/25" /> {/* Single lines */}
            <div className="absolute inset-x-4 bottom-8 h-px bg-white/25" />

            {/* Opponent Racquet */}
            <div className="w-full flex justify-center text-2xl z-10">
              <span className={`transition-transform duration-300 ${ballState === 'opponent' ? 'scale-125' : ''}`}>
                🤖
              </span>
            </div>

            {/* Interactive Yellow Tennis Ball */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 ease-out text-2xl ${
                ballState === 'opponent'
                  ? 'top-10 scale-50'
                  : ballState === 'mid'
                  ? 'top-20 scale-100 opacity-50'
                  : ballState === 'player'
                  ? 'bottom-10 scale-125'
                  : 'bottom-10 -translate-y-28 scale-50 opacity-90'
              }`}
            >
              🎾
            </div>

            {/* Play Score Overlay */}
            <div className="absolute top-2 right-4 text-xs font-mono bg-black/40 px-2 py-1 rounded">
              Հաշիվ՝ {score}
            </div>

            {/* Player Racquet */}
            <div className="w-full flex justify-center text-3xl z-10 mt-auto">
              <span 
                className={`transition-all duration-300 ${
                  ballState === 'return' ? 'scale-125 rotate-[30deg] text-yellow-400' : 'hover:scale-115'
                }`}
              >
                🎾 {playerName === 'Team' ? (isGorTurn ? '👦 Գոռ' : '👧 Գայանե') : (playerName === 'Gor' ? '👦 Գոռ' : '👧 Գայանե')} 
              </span>
            </div>
          </div>

          {/* Prompt */}
          <div className="bg-slate-950 p-4 rounded-xl border border-sky-950">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-sky-400 font-mono">Մրցափուլ {currentIdx + 1} / {TENNIS_QUESTIONS.length}</span>
              <span className="text-[11px] px-2.5 py-0.5 bg-sky-950/80 text-yellow-400 border border-sky-850 rounded-full font-bold">
                🎯 {playerName === 'Team' ? (isGorTurn ? 'Գոռի հերթն է 👦' : 'Գայանեի հերթն է 👧') : (playerName === 'Gor' ? 'Գոռ 👦' : 'Գայանե 👧')}
              </span>
            </div>
            <p className="text-md font-medium text-slate-100 mt-1">{currentQuestion.questionArm}</p>
            <p className="text-lg font-mono text-cyan-300 mt-2 font-bold bg-cyan-950/20 py-1 px-3 rounded border border-cyan-950/10">
              {currentQuestion.sentenceTemplate}
            </p>
          </div>

          {/* Swing racquets (Choices) */}
          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === currentQuestion.correctIndex;
              let btnClass = "bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-100";

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnClass = "bg-sky-600 border-sky-400 text-white font-bold scale-102";
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
                  className={`py-3 px-4 rounded-xl border-2 text-center text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm ${btnClass}`}
                >
                  🏸 {opt}
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
                  <p className="text-sm font-semibold text-gray-200">Մարզչի Բացատրությունը</p>
                  <p className="text-xs text-gray-300 leading-relaxed mt-1">{currentQuestion.explanation}</p>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/25 active:scale-95"
                >
                  Հաջորդ հարվածը <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6">
          <div className="inline-block p-4 bg-sky-950 rounded-full border border-sky-500 shadow-lg shadow-sky-500/10">
            <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Մրցախաղն Ավարտվեց:</h3>
            <p className="text-slate-400 text-sm mt-1">Դուք փայլուն հետ մղեցիք թենիսի գնդակները</p>
          </div>

          {/* Scores breakdown */}
          <div className="bg-slate-950 border border-sky-900 rounded-2xl max-w-sm mx-auto p-4 flex justify-around items-center">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-mono">Հարվածներ</span>
              <span className="text-3xl font-black text-yellow-400">{score}</span>
            </div>
            <div className="h-8 w-px bg-sky-950/10 border-r border-sky-900" />
            <div>
              <span className="text-xs text-slate-400 block uppercase font-mono">Որակավորում</span>
              <span className="text-lg font-bold text-sky-400">
                {score === TENNIS_QUESTIONS.length ? '🥇 Աշխարհի Գավաթ' : score >= 3 ? '🥈 Ակումբի Չեմպիոն' : '🥉 Լավ'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm rounded-xl font-semibold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> Կրկնել
            </button>
            <button
              onClick={() => onFinish(score)}
              className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/25 transition-all active:scale-95"
            >
              Ավարտել Խաղը <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
