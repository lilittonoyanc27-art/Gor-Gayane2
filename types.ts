/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlayerName = 'Gor' | 'Gayane' | 'Team';

export interface PlayerStats {
  name: PlayerName;
  cups: number; // Overall cups earned
  highscores: { [gameId: string]: number }; // High score per game
  completedTutorials: string[]; // List of completed tutorial ids
}

export interface VerbConjugation {
  verb: string;
  translation: string; // Armenian translation of infinitive
  type: 'regular' | 'irregular';
  stem?: string; // for irregulars
  category: 'ar' | 'er' | 'ir';
}

export interface QuizQuestion {
  id: string;
  questionArm: string; // Question or prompt in Armenian
  sentenceTemplate?: string; // e.g., "Yo _____ (viajar) a España mañana."
  options: string[];
  correctIndex: number;
  explanation: string; // Armenian and Spanish explanation
}

export interface IrgStemMatch {
  verb: string;
  verbArm: string;
  stem: string;
}

export interface PronounSentence {
  id: string;
  sentenceArm: string; // "Գոռը նամակ է գրում Գայանեին և այն ուղարկում է նրան" -> "Գոռը ուղարկում է այն նրան"
  clue: string; // "Այն (նամակը - lo) + Նրան (Գայանեին - le -> se)"
  blocks: string[]; // ['se', 'lo', 'manda']
  correctOrder: number[]; // indices of blocks in correct order
  explanation: string;
}
