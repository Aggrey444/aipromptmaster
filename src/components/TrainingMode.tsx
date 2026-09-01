import React, { useState } from 'react';
import { FrameworkType } from '../types';
import { FRAMEWORKS_DATA } from '../data/frameworksData';
import { BookOpen, CheckCircle2, XCircle, ArrowRight, Sparkles, HelpCircle, FileText, Image as ImageIcon, Video } from 'lucide-react';

export const TrainingMode: React.FC = () => {
  const [selectedFramework, setSelectedFramework] = useState<FrameworkType>('CLEAR');
  const framework = FRAMEWORKS_DATA[selectedFramework];

  const examplesData = {
    CLEAR: {
      weak: "Write an email about our new travel offer.",
      weakProblems: [
        "Missing target audience (executives vs general travelers?)",
        "No tone specified (formal or friendly?)",
        "No length limit or key details provided",
        "No call to action or formatting rules"
      ],
      improved: "Create a concise, friendly email newsletter for travel enthusiast customers. Introduce our new 2026 Summer Beach Package. Include 3 bulleted highlights, offer a 15% early-bird discount code 'SUMMER15', and conclude with a clear call-to-action button linking to our booking page. Keep length under 250 words and use plain, active English.",
      improvedReasons: [
        "Context: Specifies audience (travel enthusiasts)",
        "Length: Constrained under 250 words",
        "Examples/Tone: Friendly tone with bullet highlights",
        "Action: Clear CTA button + discount code",
        "Restrictions: Plain, active English rule"
      ]
    },
    SAEALD: {
      weak: "A flyer for a tech company.",
      weakProblems: [
        "Unclear subject (person, logo, or hardware?)",
        "No orientation or aspect ratio specified",
        "No lighting, art style, or brand color palette",
        "Missing exact contact details or call to action"
      ],
      improved: "Create a portrait-format (9:16) Instagram flyer for Dennel Technologies. Feature a confident female business professional using a slim laptop in a modern high-tech office. Use a photorealistic corporate style with emerald green, yellow, and white brand colours. Apply bright studio lighting. Include headline 'TECH INNOVATION 2026', phone +1-800-123-4567, email info@dennel.com, and a prominent 'Register Now' button. Render in 4K resolution.",
      improvedReasons: [
        "Subject & Details: Confident female professional + laptop",
        "Action & Environment: Modern office setting + 9:16 portrait",
        "Art Style & Color: Photorealistic + emerald green/yellow palette",
        "Lighting: Bright studio lighting",
        "Details: Exact headline, phone, email, and 4K quality"
      ]
    },
    SCENE: {
      weak: "Make a video for our product.",
      weakProblems: [
        "No duration or video type specified",
        "No narrative problem/solution story arc",
        "No character description or voiceover accent",
        "No visual effects or closing call to action"
      ],
      improved: "Create a 30-second promotional commercial reel introducing a SaaS productivity tool. Narrative Arc: Starts with a stressed entrepreneur overwhelmed by messy spreadsheets, transitions into discovering our clean dashboard, ends with high team productivity. Feature a relatable cast in a bright open-plan office. Use warm professional narration with an African English accent. Include dynamic on-screen subtitles, upbeat background music, logo animation, and close with 'Visit www.productivity.com'.",
      improvedReasons: [
        "Story: 30-second commercial with clear problem-solution arc",
        "Characters: Relatable cast with stressed to happy emotions",
        "Environment: Bright open-plan office setting",
        "Narration: Warm African English accent + script",
        "Effects: Subtitles, upbeat music, logo animation, URL CTA"
      ]
    }
  };

  const currentExample = examplesData[selectedFramework];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span>Interactive Training & Prompt Masterclass</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How Frameworks Transform Weak Prompts
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Learn why unguided AI prompts produce generic results, and see how structured frameworks produce precision outputs.
        </p>
      </div>

      {/* Framework Tabs */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => setSelectedFramework('CLEAR')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            selectedFramework === 'CLEAR'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>CLEAR (Text)</span>
        </button>

        <button
          onClick={() => setSelectedFramework('SAEALD')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            selectedFramework === 'SAEALD'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>SAEALD (Image)</span>
        </button>

        <button
          onClick={() => setSelectedFramework('SCENE')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            selectedFramework === 'SCENE'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>SCENE (Video)</span>
        </button>
      </div>

      {/* Letter Breakdown Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900">
          Understanding the {framework.name} ({framework.acronym})
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {framework.sections.map((sec, i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm">
                {sec.letter}
              </div>
              <h4 className="font-bold text-sm text-slate-900">{sec.name}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{sec.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weak vs Improved Comparison */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Weak Prompt Card */}
        <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <XCircle className="w-5 h-5 text-rose-600" />
            <span>Weak Unguided Prompt</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-rose-200 text-xs font-mono text-slate-800">
            "{currentExample.weak}"
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-rose-900">Why this fails in AI models:</p>
            <ul className="space-y-1.5 text-xs text-rose-800">
              {currentExample.weakProblems.map((prob, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{prob}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Improved Framework Prompt Card */}
        <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Improved {selectedFramework} Framework Prompt</span>
          </div>

          <div className="bg-white rounded-xl p-4 border border-emerald-200 text-xs font-mono text-slate-800 leading-relaxed">
            "{currentExample.improved}"
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-emerald-900">How the framework fixed it:</p>
            <ul className="space-y-1.5 text-xs text-emerald-800">
              {currentExample.improvedReasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
