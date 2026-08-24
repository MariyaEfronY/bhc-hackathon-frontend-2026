'use client';

import React, { useState, useRef, useEffect } from 'react';

interface InteractiveAnalyzerProps {
    onAnalyze: (data: any) => void;
    loading: boolean;
    setLoading: (val: boolean) => void;
}

export const InteractiveAnalyzer: React.FC<InteractiveAnalyzerProps> = ({
    onAnalyze,
    loading,
    setLoading,
}) => {
    const [mode, setMode] = useState<'form' | 'voice' | 'resume'>('form');

    // Form state
    const [name, setName] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [skills, setSkills] = useState('');

    // Voice state
    const [naturalDescription, setNaturalDescription] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Resume state
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition =
                (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.onresult = (e: any) => {
                    let text = '';
                    for (let i = e.resultIndex; i < e.results.length; ++i) {
                        text += e.results[i][0].transcript;
                    }
                    if (text) setNaturalDescription(text);
                };
                recognition.onend = () => setIsListening(false);
                recognitionRef.current = recognition;
            }
        }
    }, []);

    const toggleMic = () => {
        if (!recognitionRef.current) return alert('Speech recognition not supported in browser.');
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setNaturalDescription('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/+$/, '') : 'http://localhost:8000';

        try {
            let endpoint = `${baseUrl}/api/skill-analysis`;
            let body: any;

            if (mode === 'resume') {
                if (!file) throw new Error('Please select a PDF file first.');
                endpoint = `${baseUrl}/api/resume-analysis`;
                const formData = new FormData();
                formData.append('resume', file);
                body = formData;
            } else {
                body = JSON.stringify({
                    name: name || 'User',
                    targetRole,
                    skills: mode === 'voice' ? [naturalDescription] : skills.split(',').map((s) => s.trim()),
                });
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: mode === 'resume' ? {} : { 'Content-Type': 'application/json' },
                body: mode === 'resume' ? body : body,
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Analysis failed.');
            onAnalyze(json.data || json);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6">
            {/* Mode Switcher */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                {[
                    { id: 'form', label: 'Structured' },
                    { id: 'voice', label: 'Voice AI' },
                    { id: 'resume', label: 'Resume PDF' },
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setMode(t.id as any)}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${mode === t.id ? 'bg-slate-800 text-cyan-400 shadow-md' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'form' && (
                    <>
                        <div>
                            <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Full Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Rahul Verma"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Target Role</label>
                            <input
                                type="text"
                                placeholder="e.g. CA / Operations Manager"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1">Skills (Comma Separated)</label>
                            <textarea
                                rows={3}
                                placeholder="e.g. Tax Compliance, Auditing, Financial Modeling"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                    </>
                )}

                {mode === 'voice' && (
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={toggleMic}
                            className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 ${isListening ? 'bg-red-600 animate-pulse text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'
                                }`}
                        >
                            <span>{isListening ? '🛑 Stop Recording' : '🎙️ Start Mic Recording'}</span>
                        </button>
                        <textarea
                            rows={4}
                            value={naturalDescription}
                            onChange={(e) => setNaturalDescription(e.target.value)}
                            placeholder="Speech transcript will appear here..."
                            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                        />
                    </div>
                )}

                {mode === 'resume' && (
                    <div className="p-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 text-center space-y-2">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-800 file:text-cyan-400"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
                >
                    {loading ? 'Evaluating Profile...' : 'Run Skill Analysis ↗'}
                </button>
            </form>
        </section>
    );
};