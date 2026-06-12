/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VerbConjugation, QuizQuestion, IrgStemMatch, PronounSentence } from './types.ts';

// Detailed Armenian explanations of rules
export const FUTURE_TENSE_LESSON = {
  titleArm: "Ապառնի Ժամանակ (El Futuro Simple)",
  introArm: "Իսպաներենում ապառնի ժամանակը (Futuro Simple) օգտագործվում է ապագայում տեղի ունեցող գործողությունները նկարագրելու համար: Այն ամենահեշտ խոնարհվող ժամանակներից մեկն է, քանի որ վերջավորությունները նույնն են -ar, -er և -ir խմբերի բոլոր կանոնավոր բայերի համար:",
  
  regularRules: [
    {
      title: "Կանոնավոր բայերի կանոնը (Verbos Regulares)",
      desc: "Վերցնում ենք բայի անորոշ ձևը (Infinitive) և ավելացնում հատուկ վերջավորություններ բոլոր դեմքերի համար:",
      endings: [
        { pronoun: "Yo (Ես)", ending: "-é", example: "hablaré (կխոսեմ)" },
        { pronoun: "Tú (Դու)", ending: "-ás", example: "hablarás (կխոսես)" },
        { pronoun: "Él / Ella / Usted (Նա / Դուք)", ending: "-á", example: "hablará (նա կխոսի)" },
        { pronoun: "Nosotros (Մենք)", ending: "-emos", example: "hablaremos (կխոսենք) — *Ուշադրություն. սա միակն է առանց շեշտի (á/é)*" },
        { pronoun: "Vosotros (Դուք)", ending: "-éis", example: "hablaréis (կխոսեք)" },
        { pronoun: "Ellos / Ellas / Ustedes (Նրանք)", ending: "-án", example: "hablarán (կխոսեն)" }
      ]
    }
  ],

  irregularRules: {
    title: "Անկանոն բայեր (Verbos Irregulares)",
    desc: "Անկանոն բայերի դեպքում վերջավորությունները մնում են ՆՈՒՅՆԸ, սակայն փոխվում է բայի արմատը (Stem): Ահա հիմնական անկանոն արմատները.",
    verbs: [
      { verb: "hacer (անել)", stem: "har-", example: "haré (կանեմ), haremos (կանենք)" },
      { verb: "decir (ասել)", stem: "dir-", example: "diré (կասեմ), dirán (կասեն)" },
      { verb: "tener (ունենալ)", stem: "tend-", example: "tendré (կունենամ), tendrás (կունենաս)" },
      { verb: "poner (դնել)", stem: "pond-", example: "pondré (կդնեմ), pondrá (կդնի)" },
      { verb: "salir (դուրս գալ)", stem: "sald-", example: "saldré (դուրս կգամ)" },
      { verb: "venir (գալ)", stem: "vend-", example: "vendré (կգամ), vendrán (կգան)" },
      { verb: "poder (կարողանալ)", stem: "pod-", example: "podré (կկարողանամ)" },
      { verb: "saber (իմանալ)", stem: "sabr-", example: "sabré (կիմանամ), sabremos (կիմանանք)" },
      { verb: "querer (ցանկանալ / սիրել)", stem: "querr-", example: "querré (կցանկանամ), querrán (կցանկանան)" }
    ]
  }
};

export const PRONOUNS_LESSON = {
  titleArm: "Ուղղակի և Անուղղակի դերանուններ (OD & OI)",
  introArm: "Իսպաներենում նախադասությունը կարճ և գեղեցիկ դարձնելու համար օգտագործում ենք ուղղակի և անուղղակի խնդիր դերանունները միասին:",
  
  directSection: {
    title: "1. Ուղղակի դերանուններ (Objeto Directo - OD)",
    desc: "Պատասխանում են «ու՞մ» կամ «ի՞նչը» հարցերին: Օրինակ՝ Ես տեսնում եմ նամակը -> Ես տեսնում եմ այն (այն = la, քանի որ carta-ն իգական է):",
    table: [
      { es: "me", arm: "ինձ" },
      { es: "te", arm: "քեզ" },
      { es: "lo / la", arm: "նրան / այն (արական) / այն (իգական)" },
      { es: "nos", arm: "մեզ" },
      { es: "os", arm: "ձեզ" },
      { es: "los / las", arm: "նրանց / դրանք (արական) / դրանք (իգական)" }
    ]
  },

  indirectSection: {
    title: "2. Անուղղակի դերանուններ (Objeto Indirecto - OI)",
    desc: "Պատասխանում են «ու՞մ համար» կամ «ու՞մ» (տրական հոլովով) հարցերին: Օրինակ՝ Ես նվեր եմ տալիս Գայանեին -> Ես նվեր եմ տալիս նրան (նրան = le):",
    table: [
      { es: "me", arm: "ինձ համար / ինձ" },
      { es: "te", arm: "քեզ համար / քեզ" },
      { es: "le", arm: "նրան (արական և իգական)" },
      { es: "nos", arm: "մեզ համար / մեզ" },
      { es: "os", arm: "ձեզ համար / ձեզ" },
      { es: "les", arm: "նրանց համար / նրանց" }
    ]
  },

  goldenRules: [
    {
      title: "Հերթականության կանոնը (Անուղղակի + Ուղղակի)",
      desc: "Երբ նախադասության մեջ երկու դերանունն էլ կան, ԱՆՈՒՂՂԱԿԻՆ (OI) ՄԻՇՏ ԳԱԼԻՍ Է ՈՒՂՂԱԿԻԻՑ (OD) ԱՌԱՋ: (Հիշեք «OI + OD» բանաձևը, կամ 'Ինձ այն' - me lo):",
      example: "Él me da un libro. (Նա ինձ գիրք է տալիս) -> Él me lo da. (Նա ինձ այն տալիս է: me = OI, lo = OD)"
    },
    {
      title: "«No Le-Lo!» Կանոնը (Le/Les-ը դառնում է Se)",
      desc: "Եթե թե՛ անուղղակի, թե՛ ուղղակի դերանունները սկսվում են L տառով (դեմքեր le/les + lo/la/los/las), ապա բարեհնչյունության համար LE-ն կամ LES-ը վերածվում է SE-ի:",
      example: "Yo le doy una flor a Gayane. (Ես ծաղիկ եմ տալիս Գայանեին) -> Yo le la doy (Սխալ!) -> Yo se la doy. (Ճիշտ! Ծաղիկը = la, Գայանեին = le -> se)"
    },
    {
      title: "Դիրքը նախադասության մեջ",
      desc: "Դերանունները դրվում են խոնարհված բայից ԱՌԱՋ (առանձին) կամ բայի անորոշ ձևի (Infinitive) ՎԵՐՋՈՒՄ (կպած):",
      example: "Te lo voy a decir (Քեզ այն պատրաստվում եմ ասել) կամ Voy a decírtelo (Պատրաստվում եմ ասել քեզ այն):"
    }
  ]
};

// GAME 1: Football Penalty (Regular Verbs Endings)
export const SOCCER_QUESTIONS: QuizQuestion[] = [
  {
    id: 's_1',
    questionArm: "Նրանք կխոսեն (hablar) վաղը Կառլոսի հետ:",
    sentenceTemplate: "Ellos ____ con Carlos mañana.",
    options: ["hablará", "hablarán", "hablaremos", "hablarás"],
    correctIndex: 1,
    explanation: "Ellos (նրանք) դեմքի համար hablar-ի վրա ավելանում է -án վերջավորությունը -> hablarán:"
  },
  {
    id: 's_2',
    questionArm: "Ես կապրեմ (vivir) Մադրիդում հաջորդ տարի:",
    sentenceTemplate: "Yo ____ en Madrid el próximo año.",
    options: ["viviré", "vivirás", "vivirá", "viviremos"],
    correctIndex: 0,
    explanation: "Yo (ես) դեմքի համար vivir բայի վրա ավելանում է -é վերջավորությունը -> viviré:"
  },
  {
    id: 's_3',
    questionArm: "Մենք կուտենք (comer) համեղ տապակա:",
    sentenceTemplate: "Nosotros ____ una comida deliciosa.",
    options: ["comeremos", "comerán", "comeré", "comerán"],
    correctIndex: 0,
    explanation: "Nosotros (մենք) դեմքի համար comer բայի վրա ավելանում է -emos (առանց շեշտի) -> comeremos:"
  },
  {
    id: 's_4',
    questionArm: "Դու կճամփորդես (viajar) իսպաներենի սպորտային աշխարհում:",
    sentenceTemplate: "Tú ____ por el mundo del español.",
    options: ["viajaré", "viajarán", "viajarás", "viajará"],
    correctIndex: 2,
    explanation: "Tú-ի դեպքում ավելանում է -ás վերջավորությունը -> viajarás:"
  },
  {
    id: 's_5',
    questionArm: "Գայանեն կգրի (escribir) նոր նամակ:",
    sentenceTemplate: "Gayane ____ una nueva carta.",
    options: ["escribirá", "escribirán", "escribiré", "escribirás"],
    correctIndex: 0,
    explanation: "Gayane-ն երրորդ դեմք է (Ella), ուստի ավելանում է -á վերջավորությունը -> escribirá:"
  },
  {
    id: 's_6',
    questionArm: "Դուք (Vosotros) կերգեք (cantar) գեղեցիկ երգեր:",
    sentenceTemplate: "Vosotros ____ hermosas canciones.",
    options: ["cantaréis", "cantaré", "cantará", "cantaremos"],
    correctIndex: 0,
    explanation: "Vosotros (դուք) դեմքի համար cantar-ի վրա ավելանում է -éis վերջավորությունը -> cantaréis:"
  },
  {
    id: 's_7',
    questionArm: "Կառլոսը կխմի (beber) թարմ հյութ:",
    sentenceTemplate: "Carlos ____ jugo fresco.",
    options: ["beberá", "beberán", "beberé", "beberemos"],
    correctIndex: 0,
    explanation: "Carlos-ը երրորդ դեմք է (Él), ուստի beber-ի վրա ավելանում է -á վերջավորությունը -> beberá:"
  },
  {
    id: 's_8',
    questionArm: "Ես կսովորեմ (aprender) իսպաներեն հաջորդ շաբաթ:",
    sentenceTemplate: "Yo ____ español la próxima semana.",
    options: ["aprenderé", "aprenderá", "aprenderás", "aprenderán"],
    correctIndex: 0,
    explanation: "Yo (ես) դեմքի համար aprender բայի վրա ավելանում է -é վերջավորությունը -> aprenderé:"
  },
  {
    id: 's_9',
    questionArm: "Մենք կբացենք (abrir) նոր խաղը:",
    sentenceTemplate: "Nosotros ____ el nuevo juego.",
    options: ["abriremos", "abrirán", "abrirá", "abriré"],
    correctIndex: 0,
    explanation: "Nosotros (մենք) դեմքի համար abrir բայի վրա ավելանում է -emos -> abriremos:"
  },
  {
    id: 's_10',
    questionArm: "Նրանք կվազեն (correr) արագ:",
    sentenceTemplate: "Ellos ____ rápido.",
    options: ["correrán", "correré", "correrá", "correremos"],
    correctIndex: 0,
    explanation: "Ellos (նրանք) դեմքի համար correr բայի վրա ավելանում է -án վերջավորությունը -> correrán:"
  }
];

// GAME 2: Basketball (Irregular Stems Match)
export const BASKETBALL_STEMS: IrgStemMatch[] = [
  { verb: "hacer", verbArm: "hacer (անել)", stem: "har-" },
  { verb: "tener", verbArm: "tener (ունենալ)", stem: "tend-" },
  { verb: "decir", verbArm: "decir (ասել)", stem: "dir-" },
  { verb: "poner", verbArm: "poner (դնել)", stem: "pond-" },
  { verb: "venir", verbArm: "venir (գալ)", stem: "vend-" },
  { verb: "poder", verbArm: "poder (կարողանալ)", stem: "pod-" },
  { verb: "saber", verbArm: "saber (իմանալ)", stem: "sabr-" },
  { verb: "querer", verbArm: "querer (կամենալ)", stem: "querr-" }
];

// GAME 3: Tennis Rally (Fill in future sentence in actual rally context)
export const TENNIS_QUESTIONS: QuizQuestion[] = [
  {
    id: 't_1',
    questionArm: "Կառլոս, դու կունենա՞ս (tener) ժամանակ վաղը խաղալու համար:",
    sentenceTemplate: "Carlos, ¿____ tiempo para jugar mañana?",
    options: ["tendrás", "tendré", "tendrá", "tenerás"],
    correctIndex: 0,
    explanation: "Tener բայը անկանոն է, ունի tend- արմատը, իսկ Tú (դու) դեմքի վերջավորությունը -ás է -> tendrás:"
  },
  {
    id: 't_2',
    questionArm: "Ես կանեմ (hacer) տնային աշխատանքը հիմա:",
    sentenceTemplate: "Yo ____ los deberes ahora mismo.",
    options: ["haceré", "haré", "hará", "tendré"],
    correctIndex: 1,
    explanation: "Hacer բայի անկանոն արմատն է har-, իսկ Yo-ի դեպքում ավելանում է -é -> haré:"
  },
  {
    id: 't_3',
    questionArm: "Նրանք կգան (venir) մարզադաշտ երեկոյան:",
    sentenceTemplate: "Ellos ____ al estadio por la tarde.",
    options: ["vendrán", "venirán", "vendrán", "vendrá"],
    correctIndex: 0, // Options index is correct for "vendrán" at 0 or 2, let's make sure they are unique
    explanation: "Venir-ի արմատն է vend-, իսկ Ellos դեմքի վերջավորությունը -án է -> vendrán:"
  },
  {
    id: 't_4',
    questionArm: "Մենք կասենք (decir) ճշմարտությունը:",
    sentenceTemplate: "Nosotros ____ la verdad.",
    options: ["deciremos", "diremos", "dirán", "diré"],
    correctIndex: 1,
    explanation: "Decir-ի արմատն է dir-, Nosotros դեպքում ավելանում է -emos -> diremos:"
  },
  {
    id: 't_5',
    questionArm: "Նա կկարողանա՞ (poder) բարձրացնել այս քաշը:",
    sentenceTemplate: "¿Él ____ levantar este peso?",
    options: ["podrá", "poderá", "podré", "podrán"],
    correctIndex: 0,
    explanation: "Poder բայի արմատն է pod-, él դեմքի դեպքում ավելանում է -á -> podrá:"
  }
];

// GAME 4: 100m Sprint (Matching pronoun to correct ending badge speed-run)
export const SPRINT_TASKS = [
  { pronoun: "Yo (Ես)", correctEnding: "-é" },
  { pronoun: "Tú (Դու)", correctEnding: "-ás" },
  { pronoun: "Él / Ella (Նա)", correctEnding: "-á" },
  { pronoun: "Nosotros (Մենք)", correctEnding: "-emos" },
  { pronoun: "Vosotros (Դուք)", correctEnding: "-éis" },
  { pronoun: "Ellos / Ellas (Նրանք)", correctEnding: "-án" }
];

export const SPRINT_OPTIONS = ["-é", "-ás", "-á", "-emos", "-éis", "-án"];

// GAME 5: Archery (Categorize Regular vs Irregular)
export const ARCHERY_VERBS = [
  { verb: "hablar (խոսել)", isIrregular: false, explanation: "hablaré, hablarás... արմատը չի փոխվում" },
  { verb: "hacer (անել)", isIrregular: true, explanation: "haré, harás... արմատը փոխվում է har-" },
  { verb: "comer (ուտել)", isIrregular: false, explanation: "comeré, comerás... արմատը չի փոխվում" },
  { verb: "tener (ունենալ)", isIrregular: true, explanation: "tendré, tendrás... արմատը փոխվում է tend-" },
  { verb: "vivir (ապրել)", isIrregular: false, explanation: "viviré, vivirás... արմատը չի փոխվում" },
  { verb: "decir (ասել)", isIrregular: true, explanation: "diré, dirás... արմատը փոխվում է dir-" },
  { verb: "querer (սիրել/ցանկանալ)", isIrregular: true, explanation: "querré, querrás... արմատը փոխվում է querr-" },
  { verb: "viajar (ճամփորդել)", isIrregular: false, explanation: "viajaré, viajarás... արմատը չի փոխվում" },
  { verb: "saber (իմանալ)", isIrregular: true, explanation: "sabré, sabrás... արմատը փոխվում է sabr-" },
  { verb: "cantar (երգել)", isIrregular: false, explanation: "cantaré, cantarás... արմատը չի փոխվում" }
];

// GAME 6: Weightlifting (Armenian Future sentence to Spanish Future sentence - heavier and heavier)
export const WEIGHTLIFTING_QUESTIONS: {
  weight: number; // 50kg, 80kg, 110kg, 140kg, 170kg
  questionArm: string;
  sentenceSpanish: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}[] = [
  {
    weight: 50,
    questionArm: "Հաջորդ երկուշաբթի Կառլոսը և Լուսիան կգնան Իսպանիա:",
    sentenceSpanish: "El próximo lunes Carlos y Lucía ____ a España.",
    options: ["viajarán", "viajarán (viajar)", "viajarás", "viajaré"],
    correctIndex: 0,
    explanation: "Carlos y Lucía = Ellos (Նրանք), ուստի viajar բայը դառնում է viajarán:"
  },
  {
    weight: 80,
    questionArm: "Դուք (Nosotros) կիմանաք պատասխանը վաղը:",
    sentenceSpanish: "Nosotros ____ la respuesta mañana.",
    options: ["saberemos", "sabremos", "sabré", "sabrán"],
    correctIndex: 1,
    explanation: "Saber բայը անկանոն է, նրա արմատն է sabr-, իսկ Nosotros վերջավորությունն է -emos -> sabremos:"
  },
  {
    weight: 110,
    questionArm: "Ես քեզ կասեմ իմ գաղտնիքը շուտով:",
    sentenceSpanish: "Yo te ____ mi secreto pronto.",
    options: ["deciré", "diré", "dirá", "decirá"],
    correctIndex: 1,
    explanation: "Decir-ի անկանոն արմատն է dir-, Yo դեմքի վերջավորությունն է -é -> diré (Yo te diré):"
  },
  {
    weight: 140,
    questionArm: "Նրանք կդնեն գավաթը սեղանին:",
    sentenceSpanish: "Ellos ____ la copa sobre la mesa.",
    options: ["pondrán", "ponerán", "pondrá", "pondré"],
    correctIndex: 0,
    explanation: "Poner բայը ունի pond- արմատը, Ellos դեմքի վերջավորությունն է -án -> pondrán:"
  },
  {
    weight: 170,
    questionArm: "Կառլոս, դու կցանկանա՞ս ավելի շատ պարապել:",
    sentenceSpanish: "Carlos, ¿____ entrenar más?",
    options: ["quererás", "querrás", "querrá", "querremos"],
    correctIndex: 1,
    explanation: "Querer բայի արմատն է querr-, Tú (դու) դեմքի վերջավորությունն է -ás -> querrás:"
  }
];

