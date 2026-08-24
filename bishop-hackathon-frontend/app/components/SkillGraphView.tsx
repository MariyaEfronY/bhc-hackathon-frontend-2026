'use client';

import React, { useState } from 'react';

export const SkillGraphView: React.FC = () => {
    const [selected, setSelected] = useState<string | null>(null);

    const skills = [
        { title: 'Data Structures', status: 'completed' },
        { title: 'Fullstack Next.js', status: 'completed' },
        { title: 'Groq & LLM Prompting', status: 'missing' },
        { title: 'Vector DB (Pinecone)', status: 'missing' },
    ];

    return (
        <section id="roadmap" className="my-12 space-y-4">
            <h3 className="text-xl font-black text-white text-center">Visual Career Skill Graph</h3>
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 flex flex-wrap justify-center gap-3">
                {skills.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(s.title)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border ${s.status === 'missing'
                            ? 'bg-red-950/40 border-red-800 text-red-300'
                            : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                            }`}
                    >
                        {s.title}
                    </button>
                ))}
            </div>
            {selected && (
                <p className="text-center text-xs text-slate-400">Selected Node: <span className="text-cyan-400 font-bold">{selected}</span></p>
            )}
        </section>
    );
};