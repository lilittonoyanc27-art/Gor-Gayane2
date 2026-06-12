/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BASKETBALL_STEMS } from './SpanishData.ts';
import { audioSynth } from './AudioHelper.ts';
import { PlayerName } from './types.ts';
import { Trophy, RefreshCw, Star, Info, CircleAlert } from 'lucide-react';

interface BasketballGameProps {
  playerName: PlayerName;
  onFinish: (score: number) => void;
  onBack: () => void;
}

export default function BasketballGame({ playerName, onFinish, onBack }: BasketballGameProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedStem, setSelectedStem] = useState<string | null>(null);
  const [shotState, setShotState] = useState<'idle' | 'swish' | 'brick'>('idle');
  const [isGameOver, setIsGameOver] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const isGorTurn = currentIdx % 2 === 0;

  // For each question, get the correct item and 3 other random stems for distractors
  const currentItem = BASKETBALL_STEMS[currentIdx];

  // Generate options (the correct stem + 3 other incorrect ones)
  const getStemOptions = (): string[] => {
    const correct = currentItem.stem;
    const others = BASKETBALL_STEMS
      .filter((b) => b.stem !== correct)
      .map((b) => b.stem);
    
    // Shuffle and pick 3
    const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [correct, ...shuffledOthers];
    
    // Shuffle combined so correct isn't always first
    return combined.sort((a, b) => a.localeCompare(b));
  };

  const [options, setOptions] = useState<string[]>(() => getStemOptions());

  React.useEffect(() => {
    if (!isGameOver) {
      setOptions(getStemOptions());
    }
  }, [currentIdx, isGameOver]);

  const handleShoot = (stem: string) => {
    if (selectedStem !== null) return;
    setSelectedStem(stem);

    const isCorrect = stem === currentItem.stem;
    if (isCorrect) {
      setShotState('swish');
      setScore((prev) => prev + 1);
      audioSynth.playSuccess();
    } else {
      setShotState('brick');
      audioSynth.playFail();
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedStem(null);
    setShotState('idle');
    setShowExplanation(false);

    if (currentIdx < BASKETBALL_STEMS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedStem(null);
    setShotState('idle');
    setScore(0);
    setIsGameOver(false);
    setShowExplanation(false);
  };

  return (
    <div className="bg-slate-900 border border-amber-800/40 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden" id="basketball_game_container">
      {/* Background Court Outline Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-slate-900 to-slate-950 -z-10" />

      {/* Header */}
      <div className="flex justify-between items-center border-b border-amber-950 pb-4 mb-4">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-amber-400">Փուլ 2 • Բասկետբոլային Նետում</span>
          <h2 className="text-xl font-bold font-sans">Basketball Stem Matcher!</h2>
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
          {/* Basket Viz Area */}
          <div className="relative w-full h-44 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between p-4 shadow-inner">
            {/* Wooden Backboard and Basket Hoop */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-20 bg-amber-100 rounded border-2 border-amber-800/80 flex items-center justify-center shadow-lg">
              <div className="border border-red-500 w-16 h-10 flex items-end justify-center relative">
                {/* Net */}
                <div 
                  className={`absolute -bottom-8 w-10 h-8 border-x-2 border-b-2 border-white/60 rounded-b-xl flex justify-center items-center ${
                    shotState === 'swish' ? 'animate-[ping_0.5s_infinite] bg-amber-500/20' : ''
                  }`}
                >
                  🥅
                </div>
              </div>
            </div>

            {/* Shoot feedback text */}
            {shotState === 'swish' && (
              <div className="absolute inset-x-0 top-24 text-center text-3xl font-extrabold text-amber-400 uppercase tracking-widest animate-bounce drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                ՇՐԽԿԱՑԻՆՔ! 🏀✨
              </div>
            )}
            {shotState === 'brick' && (
              <div className="absolute inset-x-0 top-24 text-center text-2xl font-semibold text-rose-400 uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                ՕՂԱԿԻՆ ԿՊԱՎ 🧱
              </div>
            )}

            {/* Basketball in shooter's hands */}
            <div className="w-full flex justify-center mt-auto relative z-10 gap-3">
              {/* Shooter preview on the right or center */}
              <div className="absolute bottom-1 left-4 flex items-center gap-1.5 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-850">
                <span className="text-xl">🏀⛹️ {playerName === 'Team' ? (isGorTurn ? '👦' : '👧') : (playerName === 'Gor' ? '👦' : '👧')}</span>
                <span className="text-[10px] font-bold text-slate-300">{playerName === 'Team' ? (isGorTurn ? 'Գոռ' : 'Գայանե') : (playerName === 'Gor' ? 'Գոռ' : 'Գայանե')}</span>
              </div>

              <div
                className={`text-4xl transition-all duration-600 ease-out ${
                  shotState === 'swish'
                    ? 'transform -translate-y-28 scale-50 rotate-[720deg]'
                    : shotState === 'brick'
                    ? 'transform -translate-y-16 -translate-x-20 scale-75 rotate-[360deg] opacity-0'
                    : 'cursor-pointer hover:scale-110 active:scale-95 animate-pulse'
                }`}
              >
                🏀
              </div>
            </div>
          </div>

          {/* Verb Question Label */}
          <div className="bg-slate-950 p-4 border border-amber-950 rounded-xl space-y-1 text-left relative">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-amber-400 font-mono">Ինտերակտիվ Բայ {currentIdx + 1} / {BASKETBALL_STEMS.length}</span>
              <span className="text-[11px] px-2.5 py-0.5 bg-amber-950/85 text-yellow-400 border border-amber-850 rounded-full font-bold">
                🎯 {playerName === 'Team' ? (isGorTurn ? 'Գոռի հերթն է 👦' : 'Գայանեի հերթն է 👧') : (playerName === 'Gor' ? 'Գոռ 👦' : 'Գայանե 👧')}
              </span>
            </div>
            <p className="text-sm font-sans text-gray-300">Գրավիր զամբյուղը. ո՞րն է այս բայի անկանոն ապառնի արմատը.</p>
            <p className="text-2xl font-black text-white uppercase tracking-wide py-1 font-sans text-center">{currentItem.verbArm}</p>
          </div>

          {/* Stems to select */}
          <div className="grid grid-cols-2 gap-3">
            {options.map((stem) => {
              const isSelected = selectedStem === stem;
              const isCorrect = stem === currentItem.stem;
              let btnClass = "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100 hover:border-amber-500/50";

              if (selectedStem !== null) {
                if (isCorrect) {
                  btnClass = "bg-amber-600 border-yellow-400 text-white font-bold scale-102";
                } else if (isSelected) {
                  btnClass = "bg-rose-600 border-rose-400 text-white font-bold opacity-90";
                } else {
                  btnClass = "bg-slate-800/40 border-slate-800 text-slate-500 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={stem}
                  onClick={() => handleShoot(stem)}
                  disabled={selectedStem !== null}
                  className={`py-3.5 px-4 rounded-xl border-2 text-center text-lg font-mono font-bold transition-all duration-300 shadow-sm ${btnClass}`}
                >
                  🥅 {stem}
                </button>
              );
            })}
          </div>

          {/* Explanation helper banner */}
          {showExplanation && (
            <div className="bg-slate-950 border-l-4 border-amber-500 p-4 rounded-r-xl space-y-2">
              <div className="flex items-start gap-2.5">
                <CircleAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-200">Ճիշտ արմատը և խոնարհումը</p>
                  <p className="text-xs text-gray-300 leading-relaxed mt-1">
                    Իսպաներենում <b>{currentItem.verb}</b> բայի անկանոն ապառնի արմատն է <strong className="text-amber-400">{currentItem.stem}</strong>-ը: 
                    Օրինակ՝ {currentItem.verb === 'hacer' ? 'haré (կանեմ), haremos (կանենք)' : currentItem.verb === 'tener' ? 'tendré (կունենամ), tendrás (կունենաս)' : currentItem.verb === 'decir' ? 'diré (կասեմ), dirán (կասեն)' : 'կստանա համապատասխան ապառնիի վերջավորություններ'}:
                  </p>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                >
                  Հաջորդը <RefreshCw className="w-4 h-4 animate-spin-once" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 space-y-6">
          <div className="inline-block p-4 bg-amber-950 rounded-full border border-amber-500 shadow-lg shadow-amber-500/10">
            <Trophy className="w-16 h-16 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Բասկետբոլն Ավարտվեց:</h3>
            <p className="text-slate-400 text-sm mt-1">Դուք անցաք բոլոր անկանոն բայերի արմատների թեստերը</p>
          </div>

          {/* Scores breakdown */}
          <div className="bg-slate-950 border border-amber-900 rounded-2xl max-w-sm mx-auto p-4 flex justify-around items-center">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-mono">Գնդակներ</span>
              <span className="text-3xl font-black text-yellow-400">{score} / {BASKETBALL_STEMS.length}</span>
            </div>
            <div className="h-8 w-px bg-amber-950/10 border-r border-amber-900" />
            <div>
              <span className="text-xs text-slate-400 block uppercase font-mono">Մեդալ</span>
              <span className="text-lg font-bold text-amber-400">
                {score === BASKETBALL_STEMS.length ? '🥇 Օլիմպիական' : score >= 6 ? '🥈 Արծաթ' : '🥉 Բրոնզ'}
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
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all active:scale-95"
            >
              Ավարտել Խաղը <Trophy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
