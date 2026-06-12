/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ARCHERY_VERBS } from './SpanishData.ts';
import { audioSynth } from './AudioHelper.ts';
import { PlayerName } from './types.ts';
import { Trophy, ArrowRight, RefreshCw, Star, Info } from 'lucide-react';

interface ArcheryGameProps {
  playerName: PlayerName;
  onFinish: (score: number) => void;
  onBack: () => void;
}

export default function ArcheryGame({ playerName, onFinish, onBack }: ArcheryGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<'reg' | 'irg' | null>(null);
  const [arrowStatus, setArrowStatus] = useState<'idle' | 'flying' | 'bullseye' | 'miss'>('idle');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const isGorTurn = currentIdx % 2 === 0;

  const currentVerb = ARCHERY_VERBS[currentIdx];

  const handleShoot = (category: 'reg' | 'irg') => {
    if (selectedCategory !== null) return;
    setSelectedCategory(category);
    setArrowStatus('flying');
    audioSynth.playArrowRelease();

    const isCorrect = (category === 'irg' && currentVerb.isIrregular) || (category === 'reg' && !currentVerb.isIrregular);

    setTimeout(() => {
      if (isCorrect) {
        setArrowStatus('bullseye');
        setScore((prev) => prev + 1);
        audioSynth.playArrowBullseye();
      } else {
        setArrowStatus('miss');
        audioSynth.playFail();
      }
      setShowExplanation(true);
    }, 400);
  };

  const handleNext = () => {
    setSelectedCategory(null);
    setArrowStatus('idle');
    setShowExplanation(false);

    if (currentIdx < ARCHERY_VERBS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedCategory(null);
    setArrowStatus('idle');
    setScore(0);
    setIsGameOver(false);
    setShowExplanation(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-lime-800/40 relative overflow-hidden" id="archery_game_container">
      {/* Lime Accent Target Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-950/40 via-slate-900 to-slate-950 -z-10" />

      {/* Header */}
      <div className="flex justify-between items-center border-b border-lime-950 pb-4 mb-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-lime-400">Փուլ 5 • Նետաձգություն</span>
          <h2 className="text-xl font-bold font-sans">Archery Bullseye!</h2>
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
          {/* Target visualization */}
          <div className="relative w-full h-44 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-center items-center shadow-inner">
            {/* Shooter character label */}
            <div className="absolute top-2 right-4 flex items-center gap-1 bg-slate-900 border border-slate-800 py-0.5 px-2 rounded">
              <span className="text-sm">🏹 {playerName === 'Team' ? (isGorTurn ? '👦' : '👧') : (playerName === 'Gor' ? '👦' : '👧')}</span>
              <span className="text-[10px] font-mono font-bold text-slate-300">{playerName === 'Team' ? (isGorTurn ? 'Գոռ' : 'Գայանե') : (playerName === 'Gor' ? 'Գոռ' : 'Գայանե')}</span>
            </div>

            {/* Concentric rings of the Target */}
            <div className={`w-32 h-32 rounded-full border-4 border-white flex items-center justify-center relative transition-transform duration-300 ${
              arrowStatus === 'bullseye' ? 'scale-105 bg-amber-500/20' : ''
            }`}>
              <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center bg-red-600/10">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 border border-yellow-600 flex items-center justify-center">
                    {/* Arrow badge */}
                    {arrowStatus === 'bullseye' && (
                      <span className="text-xl animate-[ping_0.5s_infinite] shadow-lg">🎯</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Flying arrow animation */}
            {arrowStatus === 'flying' && (
              <div className="absolute bottom-4 text-3xl animate-[bounce_0.4s_infinite] transform -translate-y-12 transition-all">
                🏹 ➔
              </div>
            )}

            {arrowStatus === 'miss' && (
              <div className="absolute text-rose-500 font-bold font-sans text-xs bg-rose-950/60 py-1 px-3 rounded-full border border-rose-500/30">
                Շեղվեց նպատակակետից 💨
              </div>
            )}

            {/* General state message overlays */}
            {arrowStatus === 'bullseye' && (
              <div className="absolute top-2 left-4 text-xs font-mono text-lime-400 font-bold bg-lime-950/40 py-0.5 px-2 rounded">
                ՏԱՍՆՅԱԿ! 🎯🔥
              </div>
            )}
          </div>

          {/* Verb Display box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-lime-950 text-left">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-lime-400 font-mono">Բայ {currentIdx + 1} / {ARCHERY_VERBS.length}</span>
              <span className="text-[11px] px-2.5 py-0.5 bg-lime-950/80 text-yellow-400 border border-lime-850 rounded-full font-bold">
                🎯 {playerName === 'Team' ? (isGorTurn ? 'Գոռի հերթն է 👦' : 'Գայանեի հերթն է 👧') : (playerName === 'Gor' ? 'Գոռ 👦' : 'Գայանե 👧')}
              </span>
            </div>
            <p className="text-sm text-gray-300 mt-1">Ուղղեք ձեր նետը. այս բայը ապառնի ժամանակում Կանոնավո՞ր է, թե՞ Անկանոն.</p>
            <p className="text-2xl font-black text-lime-400 capitalize mt-2 font-sans tracking-wide text-center">{currentVerb.verb}</p>
          </div>

          {/* Regular or Irregular Choice targets */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleShoot('reg')}
              disabled={selectedCategory !== null}
              className={`py-4 px-4 rounded-xl border-2 font-bold transition-all duration-300 shadow-md ${
                selectedCategory === 'reg'
                  ? !currentVerb.isIrregular
                    ? "bg-emerald-600 border-lime-400 text-white font-black"
                    : "bg-rose-600 border-rose-400 text-white"
                  : selectedCategory !== null
                  ? "bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-slate-800 border-slate-700 hover:bg-slate-750 text-emerald-400 hover:border-emerald-500"
              }`}
            >
              🟢 Կանոնավոր (Regular)
            </button>
            <button
              onClick={() => handleShoot('irg')}
              disabled={selectedCategory !== null}
              className={`py-4 px-4 rounded-xl border-2 font-bold transition-all duration-300 shadow-md ${
                selectedCategory === 'irg'
                  ? currentVerb.isIrregular
                    ? "bg-emerald-600 border-lime-400 text-white font-black"
                    : "bg-rose-600 border-rose-400 text-white"
                  : selectedCategory !== null
                  ? "bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-slate-800 border-slate-700 hover:bg-slate-750 text-rose-400 hover:border-rose-500"
              }`}
            >
              🔴 Անկանոն (Irregular)
            </button>
          </div>

          {/* Explanation layout */}
          {showExplanation && (
            <div className="bg-slate-950 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-2 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-200">Ինչու՞ է սա այդպես</p>
                  <p className="text-xs text-gray-300 leading-relaxed mt-1">
                    <b>{currentVerb.verb}</b> բայը {currentVerb.isIrregular ? 'ունի Անկանոն ապառնի արմատ:' : 'կանոնավոր է, քանի որ պահում է անորոշ հիմքը և վրան ավելանում են վերջավորությունները:'} <br />
                    <i>{currentVerb.explanation}</i>
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 bg-lime-600 hover:bg-lime-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-lime-500/20 active:scale-95"
                >
                  Հաջորդ Նետը <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6">
          <div className="inline-block p-4 bg-lime-950 rounded-full border border-lime-500 shadow-lg shadow-lime-500/10">
            <Trophy className="w-16 h-16 text-yellow-400 animate-bounce" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Թիրախներն Ավարտվեցին!</h3>
            <p className="text-slate-400 text-sm mt-1">Դուք փայլուն նշանառու եք իսպաներենի կանոններում</p>
          </div>

          {/* Score chart */}
          <div className="bg-slate-950 border border-lime-900 rounded-2xl max-w-sm mx-auto p-4 flex justify-around items-center">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-mono">Բուլսայս (10-եր)</span>
              <span className="text-3xl font-black text-yellow-400">{score} / {ARCHERY_VERBS.length}</span>
            </div>
            <div className="h-8 w-px bg-lime-950/10 border-r border-lime-900" />
            <div>
              <span className="text-xs text-slate-400 block uppercase font-mono">Կոչում</span>
              <span className="text-lg font-bold text-lime-400">
                {score === ARCHERY_VERBS.length ? '🥇 Ռոբին Հուդ' : score >= 7 ? '🥈 Վարպետ' : '🥉 Սկսնակ'}
              </span>
            </div>
          </div>

          {/* Restart / Close buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm rounded-xl font-semibold flex items-center gap-1.5 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" /> Կրկնել
            </button>
            <button
              onClick={() => onFinish(score)}
              className="px-6 py-2.5 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-600 hover:to-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-lime-500/25 transition-all active:scale-95"
            >
              Ավարտել Խաղը <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
