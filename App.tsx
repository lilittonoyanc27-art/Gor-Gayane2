/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import SoccerGame from './SoccerGame.tsx';
import BasketballGame from './BasketballGame.tsx';
import TennisGame from './TennisGame.tsx';
import SprintGame from './SprintGame.tsx';
import ArcheryGame from './ArcheryGame.tsx';
import WeightliftingGame from './WeightliftingGame.tsx';
import ExplanationScreen from './ExplanationScreen.tsx';

import { 
  Trophy, 
  BookOpen, 
  User, 
  Flame, 
  GraduationCap, 
  Award, 
  RefreshCw, 
  Zap, 
  Medal, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Target, 
  Gamepad2,
  BookmarkCheck,
  RotateCcw
} from 'lucide-react';

import { PlayerName, PlayerStats } from './types.ts';
import { audioSynth } from './AudioHelper.ts';

const GAME_METADATA = [
  {
    id: 'soccer',
    title: 'Ֆուտբոլային 11-մետրանոց',
    subtitle: 'Regular Future Endings',
    icon: '⚽️',
    cardStyle: 'bg-blue-600 border-b-8 border-blue-800 text-white',
    subtitleColor: 'text-blue-100',
    description: 'Խոնարհիր կանոնավոր բայերը և հարվածիր դարպասին:',
    lessons: 'yo -é, tú -ás, él -á, nosotros -emos, vosotros -éis, ellos -án'
  },
  {
    id: 'basketball',
    title: 'Բասկետբոլային Նետումներ',
    subtitle: 'Irregular Verb Stems',
    icon: '🏀',
    cardStyle: 'bg-orange-500 border-b-8 border-orange-700 text-white',
    subtitleColor: 'text-orange-100',
    description: 'Գտիր անկանոն բայերի ապառնիի արմատները և նետիր օղակի մեջ:',
    lessons: 'hacer ➔ har-, decir ➔ dir-, tener ➔ tend-'
  },
  {
    id: 'tennis',
    title: 'Թենիսի Մրցախաղ',
    subtitle: 'Future Conjugation Rally',
    icon: '🎾',
    cardStyle: 'bg-lime-500 border-b-8 border-lime-700 text-indigo-950',
    subtitleColor: 'text-lime-900/70',
    description: 'Ճիշտ լրացրու նախադասությունները թենիսի գնդակը հետ մղելու համար:',
    lessons: 'Yo escribiré, él podrá, nosotros diremos'
  },
  {
    id: 'sprint',
    title: 'Միլիոնավազք (Sprint)',
    subtitle: 'Subject Ending Speed Match',
    icon: '🏃',
    cardStyle: 'bg-cyan-500 border-b-8 border-cyan-700 text-indigo-950',
    subtitleColor: 'text-cyan-950/70',
    description: 'Արագ համապատասխանեցրու դեմքերը և վերջավորությունները վազքուղում:',
    lessons: 'Yo (-é), Tú (-ás), Él/Ella (-á), Nosotros (-emos)'
  },
  {
    id: 'archery',
    title: 'Նետաձգություն',
    subtitle: 'Regular vs Irregular Target',
    icon: '🎯',
    cardStyle: 'bg-red-500 border-b-8 border-red-700 text-white',
    subtitleColor: 'text-red-100',
    description: 'Ուղղիր նետը դեպի կանոնավոր կամ անկանոն թիրախային օղակները:',
    lessons: 'viajar (Regular) vs querer (Irregular)'
  },
  {
    id: 'weightlifting',
    title: 'Ծանրամարտի Առաջնություն',
    subtitle: 'Sentence Level translations',
    icon: '🏋️‍♂️',
    cardStyle: 'bg-emerald-500 border-b-8 border-emerald-700 text-white lg:col-span-3 lg:py-8',
    subtitleColor: 'text-emerald-100',
    description: 'Թարգմանիր ամբողջական նախադասություններ ռեկորդային քաշեր բարձրացնելու համար:',
    lessons: 'El lunes viajarán, nosotros sabremos la verdad'
  }
];

export default function App() {
  const [activePlayer, setActivePlayer] = useState<PlayerName | null>('Team');
  const [activeScene, setActiveScene] = useState<'welcome' | 'dashboard' | 'lesson' | 'game'>('welcome');
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);

  // Initialize stats for Gor, Gayane, and Team
  const [playerStats, setPlayerStats] = useState<{ [key in PlayerName]: PlayerStats }>({
    Gor: {
      name: 'Gor',
      cups: 0,
      highscores: { soccer: 0, basketball: 0, tennis: 0, sprint: 0, archery: 0, weightlifting: 0 },
      completedTutorials: []
    },
    Gayane: {
      name: 'Gayane',
      cups: 0,
      highscores: { soccer: 0, basketball: 0, tennis: 0, sprint: 0, archery: 0, weightlifting: 0 },
      completedTutorials: []
    },
    Team: {
      name: 'Team',
      cups: 0,
      highscores: { soccer: 0, basketball: 0, tennis: 0, sprint: 0, archery: 0, weightlifting: 0 },
      completedTutorials: []
    }
  });

  // Load from localStorage on mount & auto-migrate past scores into Team
  useEffect(() => {
    const cachedStats = localStorage.getItem('gor_gayane_spanish_stats');
    if (cachedStats) {
      try {
        const parsed = JSON.parse(cachedStats);
        
        // Ensure Team is present
        if (!parsed.Team) {
          parsed.Team = {
            name: 'Team',
            cups: 0,
            highscores: { soccer: 0, basketball: 0, tennis: 0, sprint: 0, archery: 0, weightlifting: 0 },
            completedTutorials: []
          };
        }

        // Migrate historical best scores into Team so Gor & Gayane don't lose any progress!
        const soccer = Math.max(parsed.Team.highscores.soccer || 0, parsed.Gor?.highscores?.soccer || 0, parsed.Gayane?.highscores?.soccer || 0);
        const basketball = Math.max(parsed.Team.highscores.basketball || 0, parsed.Gor?.highscores?.basketball || 0, parsed.Gayane?.highscores?.basketball || 0);
        const tennis = Math.max(parsed.Team.highscores.tennis || 0, parsed.Gor?.highscores?.tennis || 0, parsed.Gayane?.highscores?.tennis || 0);
        const sprint = Math.max(parsed.Team.highscores.sprint || 0, parsed.Gor?.highscores?.sprint || 0, parsed.Gayane?.highscores?.sprint || 0);
        const archery = Math.max(parsed.Team.highscores.archery || 0, parsed.Gor?.highscores?.archery || 0, parsed.Gayane?.highscores?.archery || 0);
        const weightlifting = Math.max(parsed.Team.highscores.weightlifting || 0, parsed.Gor?.highscores?.weightlifting || 0, parsed.Gayane?.highscores?.weightlifting || 0);

        parsed.Team.highscores = { soccer, basketball, tennis, sprint, archery, weightlifting };
        
        setPlayerStats(parsed);
      } catch {
        // Fallback
      }
    }
  }, []);

  // Save to localStorage whenever playerStats changes
  const saveStats = (newStats: { [key in PlayerName]: PlayerStats }) => {
    setPlayerStats(newStats);
    localStorage.setItem('gor_gayane_spanish_stats', JSON.stringify(newStats));
  };

  const handleSelectPlayer = (name: PlayerName) => {
    setActivePlayer(name);
    audioSynth.playSuccess();
    setActiveScene('dashboard');
  };

  const handleFinishGame = (score: number) => {
    if (!activePlayer || !currentGameId) return;

    const currentStats = { ...playerStats };
    const currentPlayer = { ...currentStats[activePlayer] };

    // Update highscore
    const previousHighscore = currentPlayer.highscores[currentGameId] || 0;
    if (score > previousHighscore) {
      currentPlayer.highscores[currentGameId] = score;

      // Earn a golden cup if score is outstanding
      if (score >= 4 && previousHighscore < 4) {
        currentPlayer.cups += 1;
      }
    }

    currentStats[activePlayer] = currentPlayer;
    saveStats(currentStats);
    setActiveScene('dashboard');
    setCurrentGameId(null);
  };

  const resetAllProgress = () => {
    if (!window.confirm('Համոզվա՞ծ եք, որ ցանկանում եք ջնջել բոլոր արդյունքները և սկսել նորից:')) return;
    const initial = {
      Gor: {
        name: 'Gor' as PlayerName,
        cups: 0,
        highscores: { soccer: 0, basketball: 0, tennis: 0, sprint: 0, archery: 0, weightlifting: 0 },
        completedTutorials: []
      },
      Gayane: {
        name: 'Gayane' as PlayerName,
        cups: 0,
        highscores: { soccer: 0, basketball: 0, tennis: 0, sprint: 0, archery: 0, weightlifting: 0 },
        completedTutorials: []
      },
      Team: {
        name: 'Team' as PlayerName,
        cups: 0,
        highscores: { soccer: 0, basketball: 0, tennis: 0, sprint: 0, archery: 0, weightlifting: 0 },
        completedTutorials: []
      }
    };
    saveStats(initial);
    setActiveScene('welcome');
    setActivePlayer('Team');
  };

  const totalCupsEarned = (name: PlayerName) => {
    const scores = playerStats[name].highscores;
    let cups = 0;
    if (scores.soccer >= 4) cups++;
    if (scores.basketball >= 6) cups++;
    if (scores.tennis >= 4) cups++;
    if (scores.sprint >= 5) cups++;
    if (scores.archery >= 7) cups++;
    if (scores.weightlifting >= 4) cups++;
    return cups;
  };

  const getPlayerPoints = (name: PlayerName) => {
    const scores = playerStats[name].highscores;
    const points = (scores.soccer * 200) + 
                   (scores.basketball * 125) + 
                   (scores.tennis * 200) + 
                   (scores.sprint * 150) + 
                   (scores.archery * 100) + 
                   (scores.weightlifting * 250);
    return points || 0;
  };

  // Check if player completed everything flawlessly representing Olympic Champion!
  const isOlympicGoldChampion = (name: PlayerName) => {
    return totalCupsEarned(name) === 6;
  };

  return (
    <div className="min-h-screen bg-indigo-950 text-white font-sans flex flex-col justify-between select-none" id="app_root_wrapper">
      
      {/* Decorative top header belt */}
      <header className="flex flex-col sm:flex-row justify-between items-center px-8 py-6 bg-gradient-to-r from-indigo-800 to-fuchsia-800 border-b-4 border-fuchsia-500 sticky top-0 z-50 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase text-white leading-none">
            Futuro Deportivo
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm font-bold mt-1">
            Competición para <span className="text-yellow-400">Gor 👦</span> y <span className="text-pink-400">Gayane 👧</span>
          </p>
        </div>
        
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {activeScene !== 'welcome' && (
            <div className="bg-fuchsia-950/70 border border-fuchsia-300 text-fuchsia-100 text-xs font-black uppercase px-3 py-1.5 rounded-full">
              ⚡ GOR & GAYANE COPA
            </div>
          )}

          <div className="flex gap-4">
            <div className="bg-indigo-900/50 px-5 py-1.5 rounded-xl border border-indigo-400 text-center shadow-inner">
              <span className="block text-[10px] uppercase opacity-75 font-mono text-indigo-100">Թիմային Միավորներ (Team Points)</span>
              <span className="text-xl font-mono font-bold text-yellow-400">{getPlayerPoints('Team').toLocaleString()}</span>
            </div>
          </div>

          {activeScene !== 'welcome' && (
            <button 
              onClick={() => { setActiveScene('dashboard'); setCurrentGameId(null); }}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 hover:scale-[1.05] active:scale-95 text-indigo-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 shadow-md border-b-4 border-yellow-600"
            >
              🏸 ՄԵՆՅՈՒ
            </button>
          )}
        </div>
      </header>

      {/* Main Body Stage */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 flex items-center justify-center">

        {/* SECTION 1: Welcome Screen (Unified Team Entrance) */}
        {activeScene === 'welcome' && (
          <div className="w-full max-w-2xl bg-gradient-to-b from-indigo-900 to-indigo-950 border-4 border-indigo-500 p-8 rounded-3xl shadow-2xl text-center space-y-8 animate-fadeIn" id="welcome_screen">
            <div className="space-y-3">
              <div className="inline-block p-4 bg-fuchsia-900/30 border border-fuchsia-500 rounded-full animate-pulse shadow-inner">
                <Medal className="w-16 h-16 text-yellow-400" />
              </div>
              <h2 className="text-3xl font-black font-sans tracking-tight text-white uppercase italic">Բարև Գոռ և Գայանե 👋</h2>
              <p className="text-sm text-indigo-200 max-w-md mx-auto font-sans leading-relaxed">
                Դուք այսօր խաղում եք միասին որպես մեկ միասնական թիմ՝ նվաճելու իսպաներենի բոլոր 6 ոսկե գավաթները:
              </p>
            </div>

            {/* Combined Team entry card */}
            <div 
              onClick={() => handleSelectPlayer('Team')}
              className="group relative cursor-pointer overflow-hidden p-8 bg-gradient-to-br from-indigo-950 via-indigo-900 to-fuchsia-950 border-4 border-indigo-500 hover:border-yellow-400 rounded-3xl shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-98 flex flex-col items-center gap-6 text-center"
            >
              <div className="absolute right-4 top-4 bg-yellow-500/15 border border-yellow-400/50 text-yellow-300 text-xs font-black px-3.5 py-1 rounded-full uppercase font-mono tracking-widest">
                ԹԻՄԱՅԻՆ ՄՐՑԱՇԱՐ
              </div>
              <div className="flex gap-4 items-center justify-center">
                <div className="w-20 h-20 bg-indigo-950 rounded-full border-4 border-blue-500 flex items-center justify-center text-5xl shadow-md">
                  👦
                </div>
                <span className="text-4xl text-amber-400 font-extrabold italic font-mono animate-bounce">&amp;</span>
                <div className="w-20 h-20 bg-indigo-950 rounded-full border-4 border-fuchsia-500 flex items-center justify-center text-5xl shadow-md">
                  👧
                </div>
              </div>
              <div>
                <h3 className="font-sans font-black text-2xl text-white uppercase tracking-tight">Գոռ և Գայանե (Team Gor &amp; Gayane)</h3>
                <p className="text-sm text-indigo-200 mt-2 font-sans font-medium">
                  Նվաճված գավաթներ՝ <strong className="text-yellow-400 font-mono text-base">{totalCupsEarned('Team')} / 6</strong>
                </p>
              </div>
              
              <button 
                className="w-full max-w-xs py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-indigo-950 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-lg border-b-4 border-amber-700 active:translate-y-0.5"
              >
                🎮 ՄՈՒՏՔ ԱՍՊԱՐԵԶ (START GAME)
              </button>
            </div>

            {/* General welcome help box */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
              <BookmarkCheck className="w-10 h-10 text-emerald-400 flex-shrink-0" />
              <div className="text-left space-y-0.5">
                <p className="text-xs font-bold text-white">🏆 Համատեղ Օլիմպիական Կանոններ</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed text-left">
                  Դուք սովորում և կատարում եք առաջադրանքները միասին: Յուրաքանչյուր խաղում {`>= 80%`} արդյունք ապահովելիս դուք թիմով նվաճում եք համապատասխան սպորտային ոսկե գավաթը: Նվաճեք բոլոր 6 գավաթները միասնաբար!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: General Dashboard (Games list & Leaderboard stats) */}
        {activeScene === 'dashboard' && activePlayer && (
          <div className="w-full space-y-6 animate-fadeIn" id="dashboard_screen">
            
            {/* Realtime Dual Tournament Leaderboard */}
            <div className="bg-gradient-to-r from-indigo-950 via-fuchsia-950 to-indigo-950 border-4 border-indigo-500 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute right-4 top-4 hidden md:block">
                <span className="text-[10px] font-mono bg-indigo-500/15 border border-indigo-300 text-cyan-300 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                  Live Arena Scorecard
                </span>
              </div>

              <div className="text-center space-y-4">
                <span className="text-3xl">🏆💪🏆</span>
                <h3 className="text-2xl font-black uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-350 to-pink-400">
                  ԳՈՌ ԵՎ ԳԱՅԱՆԵ • ԹԻՄԱՅԻՆ ԱՌԱՋՆՈՒԹՅՈՒՆ
                </h3>

                {/* Unified Team Card Panel */}
                <div className="flex items-center justify-center max-w-xl mx-auto pt-2">
                  <div className="flex items-center gap-4 bg-gradient-to-r from-blue-900/40 to-fuchsia-900/40 p-5 rounded-2xl border-2 border-indigo-500 w-full justify-around flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-4">
                        <span className="text-4xl filter drop-shadow">👦</span>
                        <span className="text-4xl filter drop-shadow">👧</span>
                      </div>
                      <div className="text-left">
                        <span className="text-xs text-indigo-200 block font-bold font-sans uppercase">Մեր Թիմը</span>
                        <span className="text-base font-black text-white">Գոռ և Գայանե</span>
                      </div>
                    </div>

                    <div className="h-8 w-px bg-indigo-700/60 hidden sm:block" />

                    <div className="text-center">
                      <span className="text-xs text-indigo-200 block font-sans uppercase">Կուտակած Գավաթներ</span>
                      <span className="text-xl font-black text-yellow-400 flex items-center justify-center gap-1 font-mono">
                        <Trophy className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        {totalCupsEarned('Team')} / 6
                      </span>
                    </div>

                    <div className="h-8 w-px bg-indigo-700/60 hidden sm:block" />

                    <div className="text-center">
                      <span className="text-xs text-indigo-200 block font-sans uppercase">Թիմային Միավորներ</span>
                      <span className="text-xl font-black text-rose-400 font-mono">
                        {getPlayerPoints('Team').toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Switch profile or reset buttons */}
                <div className="flex justify-center flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setActiveScene('lesson')}
                    className="px-5 py-2.5 bg-lime-500 hover:bg-lime-400 text-indigo-950 hover:scale-105 active:scale-95 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition duration-150 shadow-md border-b-4 border-lime-700"
                  >
                    <BookOpen className="w-4 h-4" /> Կարդալ Տեսությունը (Բացատրություններ)
                  </button>
                  <button 
                    onClick={() => setActiveScene('welcome')}
                    className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-550 text-white hover:scale-105 active:scale-95 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition duration-150 shadow-md border-b-4 border-fuchsia-800"
                  >
                    👋 Մեկնարկային էջ
                  </button>
                  <button
                    onClick={resetAllProgress}
                    className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg border border-transparent hover:border-rose-900 transition text-xs flex items-center gap-1"
                    title="Ջնջել ամբողջ պրոգրեսը"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Զրոյացնել
                  </button>
                </div>
              </div>
            </div>

            {/* Check outstanding certificate ceremony */}
            {isOlympicGoldChampion('Team') && (
              <div className="bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 border-4 border-yellow-300 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-bounce relative">
                <span className="absolute right-3 top-3 text-2xl">🥇✨</span>
                <h3 className="text-2xl font-extrabold uppercase font-sans tracking-wide">🏆 ՕԼԻՄՊԻԱԿԱՆ ԻՍՊԱՆԵՐԵՆԻ ՊԱՏՎՈԳԻՐ 🏆</h3>
                <p className="text-sm font-semibold max-w-lg mx-auto">
                  Սույնով հաստատվում է, որ <strong className="text-lg underline underline-offset-4">Գոռն ու Գայանեն</strong> համատեղ հաջողությամբ նվաճեցին բոլոր 6 ոսկե գավաթները և հռչակվեցին Իսպաներենի Ապառնի ժամանակի Օլիմպիական Ազգային Չեմպիոններ: ¡Felicitaciones! 🎉🔥
                </p>
                <div className="flex justify-center gap-2">
                  <span className="text-xs bg-slate-950 text-white px-4 py-1 rounded-full font-bold">GOR &amp; GAYANE COPA 2026</span>
                </div>
              </div>
            )}

            {/* Games Grid Title */}
            <div className="border-l-4 border-amber-500 pl-3">
              <h2 className="text-xl font-bold font-sans text-white">Ընտրեք Մրցումը</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Յուրաքանչյուր սպորտային խաղ ունի խոնարհման կամ դերանունների իր կանոնները</p>
            </div>

            {/* 6 Games Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GAME_METADATA.map((game) => {
                const highscore = playerStats[activePlayer].highscores[game.id] || 0;
                // Check if cup earned
                const isCupEarned = (game.id === 'soccer' && highscore >= 4) ||
                                  (game.id === 'basketball' && highscore >= 6) ||
                                  (game.id === 'tennis' && highscore >= 4) ||
                                  (game.id === 'sprint' && highscore >= 5) ||
                                  (game.id === 'archery' && highscore >= 7) ||
                                  (game.id === 'weightlifting' && highscore >= 4);

                return (
                  <div
                    key={game.id}
                    onClick={() => {
                      setCurrentGameId(game.id);
                      audioSynth.playSuccess();
                      setActiveScene('game');
                    }}
                    className={`group cursor-pointer ${game.cardStyle} p-6 rounded-3xl flex flex-col justify-between hover:scale-95 transition-transform duration-150 relative overflow-hidden shadow-xl`}
                  >
                    {/* Corner Cup Badge */}
                    {isCupEarned && (
                      <div className="absolute right-3 top-3 bg-yellow-400 text-slate-950 p-1.5 rounded-full shadow-lg border border-yellow-350 z-10 animate-pulse">
                        <Trophy className="w-4 h-4 fill-slate-950" />
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Top identity banner */}
                      <div className="flex items-center justify-between">
                        <span className="text-4xl bg-white/10 p-2.5 rounded-2xl">{game.icon}</span>
                        <div className="text-right">
                          <span className="text-[10px] font-mono opacity-80 block uppercase tracking-wider">Record</span>
                          <span className="text-base font-black font-mono">
                            {game.id === 'basketball' ? `${highscore}/8` : game.id === 'archery' ? `${highscore}/10` : game.id === 'sprint' ? `${highscore}/6` : `${highscore}/5`}
                          </span>
                        </div>
                      </div>

                      {/* Info blocks */}
                      <div>
                        <h3 className="font-sans font-black text-xl leading-snug uppercase tracking-tight italic">{game.title}</h3>
                        <span className={`text-[10px] uppercase font-mono tracking-widest font-bold ${game.subtitleColor}`}>{game.subtitle}</span>
                        <p className="text-xs opacity-90 font-sans mt-2 leading-relaxed">{game.description}</p>
                      </div>
                    </div>

                    {/* Footer badge with tips */}
                    <div className="mt-4 pt-3 border-t border-white/15 text-[10px] font-mono flex justify-between items-center bg-black/15 p-2 rounded-xl">
                      <span className="truncate max-w-[180px]">💡 {game.lessons}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 3: Active Game Screen */}
        {activeScene === 'game' && activePlayer && currentGameId && (
          <div className="w-full max-w-3xl">
            {currentGameId === 'soccer' && (
              <SoccerGame
                playerName={activePlayer}
                onFinish={handleFinishGame}
                onBack={() => setActiveScene('dashboard')}
              />
            )}
            {currentGameId === 'basketball' && (
              <BasketballGame
                playerName={activePlayer}
                onFinish={handleFinishGame}
                onBack={() => setActiveScene('dashboard')}
              />
            )}
            {currentGameId === 'tennis' && (
              <TennisGame
                playerName={activePlayer}
                onFinish={handleFinishGame}
                onBack={() => setActiveScene('dashboard')}
              />
            )}
            {currentGameId === 'sprint' && (
              <SprintGame
                playerName={activePlayer}
                onFinish={handleFinishGame}
                onBack={() => setActiveScene('dashboard')}
              />
            )}
            {currentGameId === 'archery' && (
              <ArcheryGame
                playerName={activePlayer}
                onFinish={handleFinishGame}
                onBack={() => setActiveScene('dashboard')}
              />
            )}
            {currentGameId === 'weightlifting' && (
              <WeightliftingGame
                playerName={activePlayer}
                onFinish={handleFinishGame}
                onBack={() => setActiveScene('dashboard')}
              />
            )}
          </div>
        )}

        {/* SECTION 4: Explanation Book Screen */}
        {activeScene === 'lesson' && (
          <div className="w-full">
            <ExplanationScreen onBack={() => setActiveScene('dashboard')} />
          </div>
        )}

      </main>

      {/* Decorative footer credit */}
      <footer className="min-h-16 bg-indigo-900 flex flex-col md:flex-row items-center justify-between px-8 py-4 gap-4 border-t border-indigo-700/50">
        <div className="flex gap-4 flex-wrap justify-center">
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest flex items-center text-indigo-100">
            🚀 MODO: COOPERATIVO
          </span>
          <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest flex items-center text-indigo-100">
            🏆 META: CHAMPION OLYMPIC
          </span>
        </div>
        <div className="text-indigo-300 text-xs font-semibold text-center">
          CONSEJO: En el futuro, los verbos terminan en <span className="text-white">-é, -ás, -á, -emos, -éis, -án</span>
        </div>
        <p className="text-[10px] text-indigo-400 font-mono">© {new Date().getFullYear()} Futuro Deportivo</p>
      </footer>

    </div>
  );
}
