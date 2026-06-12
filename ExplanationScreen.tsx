/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FUTURE_TENSE_LESSON } from './SpanishData.ts';
import { BookOpen, Award, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface ExplanationScreenProps {
  onBack: () => void;
}

export default function ExplanationScreen({ onBack }: ExplanationScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const futureSlides = [
    {
      title: "Ներածություն: Ապառնի ժամանակ",
      content: (
        <div className="space-y-4 text-gray-800">
          <p className="leading-relaxed text-lg">
            {FUTURE_TENSE_LESSON.introArm}
          </p>
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg mt-4 shadow-sm">
            <h4 className="font-bold text-emerald-950 flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-emerald-600 animate-bounce" />
              Հիմնական Առավելությունը
            </h4>
            <p className="text-emerald-900 text-sm">
              Ի տարբերություն ներկա ժամանակի, ապառնիում բայի վերջավորության պատառիկները (<b>-ar, -er, -ir</b>) չեն ջնջվում: Վերջավորությունները կպչում են անմիջապես ամբողջական բային:
            </p>
          </div>
        </div>
      )
    },
    ...FUTURE_TENSE_LESSON.regularRules.map((rule) => ({
      title: rule.title,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed text-md mb-2">{rule.desc}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {rule.endings.map((ending, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200">
                <span className="font-semibold text-gray-700 font-sans">{ending.pronoun}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-amber-100 text-amber-800 px-2 py-1 rounded-sm text-sm font-bold">{ending.ending}</span>
                  <span className="font-sans text-emerald-700 text-sm font-medium">{ending.example}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    })),
    {
      title: FUTURE_TENSE_LESSON.irregularRules.title,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed text-sm mb-2">
            {FUTURE_TENSE_LESSON.irregularRules.desc}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
            {FUTURE_TENSE_LESSON.irregularRules.verbs.map((v, idx) => (
              <div key={idx} className="p-3 bg-amber-50/50 border border-amber-100 rounded-lg flex flex-col justify-between text-left shadow-xs transition-hover hover:border-amber-300">
                <span className="font-bold text-gray-800 font-sans text-sm">{v.verb}</span>
                <span className="font-mono text-emerald-800 font-bold text-sm">➔ {v.stem}</span>
                <span className="text-gray-500 font-sans text-xs mt-1">{v.example}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const currentSlides = futureSlides;
  const slideCount = currentSlides.length;

  const handleNext = () => {
    if (currentSlide < slideCount - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100" id="explanation_screen_container">
      {/* Target Audience Welcome */}
      <div className="bg-slate-900 text-white p-6 relative">
        <button
          onClick={onBack}
          id="btn_back_to_dashboard"
          className="absolute left-6 top-6 text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Դեպի Խաղեր
        </button>

        <div className="text-center pt-4">
          <h2 className="text-2xl font-bold font-sans tracking-tight text-emerald-400 flex items-center justify-center gap-2">
            <BookOpen className="w-6 h-6 animate-pulse" />
            Տեսական Բաժին • Գոռ և Գայանե
          </h2>
          <p className="text-xs text-slate-300 mt-2 font-medium max-w-md mx-auto">
            Սովորեք Իսպաներենի Ապառնի ժամանակը (El Futuro Simple)՝ սպորտային մրցումներում հաղթելու համար
          </p>
        </div>
      </div>

      {/* Slide body with responsive sizing */}
      <div className="p-8 bg-slate-50 min-h-[380px] flex flex-col justify-between">
        <div className="animate-fadeIn transition-all duration-300">
          {/* Header of slide */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 font-sans">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              {currentSlides[currentSlide].title}
            </h3>
            <span className="text-xs font-mono bg-slate-200 text-slate-700 px-2 py-1 rounded-sm font-medium">
              {currentSlide + 1} / {slideCount}
            </span>
          </div>

          {/* Core Content */}
          <div className="pt-2">
            {currentSlides[currentSlide].content}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 transition-all ${
              currentSlide === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-slate-700 hover:bg-slate-200 active:scale-95"
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Նախորդը
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-1.5">
            {currentSlides.map((_, idx) => (
              <span
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  currentSlide === idx ? "w-5 bg-emerald-500" : "bg-slate-300 hover:bg-slate-400"
                }`}
              ></span>
            ))}
          </div>

          {currentSlide < slideCount - 1 ? (
            <button
               onClick={handleNext}
               className="px-4 py-2 rounded-xl text-sm font-medium text-emerald-700 hover:bg-emerald-100 flex items-center gap-1 active:scale-95 transition-all"
            >
              Հաջորդ սլայդը <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onBack}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
            >
              Մարտահրավերն է Սպասում <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

