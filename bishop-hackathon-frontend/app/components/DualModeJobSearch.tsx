'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    Mic,
    MicOff,
    Search,
    Sliders,
    Briefcase,
    BookOpen,
    XCircle,
    AlertCircle,
    RefreshCw,
    ArrowRight,
} from 'lucide-react';
import { CareerAnalysisData } from '@/types/career';

type SearchMode = 'text' | 'voice';

export default function DualModeJobSearch() {
    const [searchMode, setSearchMode] = useState<SearchMode>('text');

    const [formData, setFormData] = useState({
        name: '',
        targetRole: '',
        skills: '',
        interests: '',
        location: '',
        responseLimit: 5,
    });

    const [naturalDescription, setNaturalDescription] = useState<string>('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CareerAnalysisData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Initialize Web Speech API
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition =
                (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onresult = (event: any) => {
                    let fullTranscript = '';
                    for (let i = 0; i < event.results.length; ++i) {
                        fullTranscript += event.results[i][0].transcript + ' ';
                    }
                    setNaturalDescription(fullTranscript.trim());
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech Recognition Error:', event.error);
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setSearchMode('voice');
            setNaturalDescription('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const speakOut = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }

        const payload =
            searchMode === 'voice'
                ? {
                    name: formData.name || 'User',
                    targetRole: formData.targetRole,
                    skills: [naturalDescription],
                    interests: ['Voice Search'],
                    location: formData.location || 'Remote',
                    responseLimit: Number(formData.responseLimit),
                }
                : {
                    name: formData.name || 'User',
                    targetRole: formData.targetRole,
                    skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
                    interests: formData.interests.split(',').map((i) => i.trim()).filter(Boolean),
                    location: formData.location || 'Remote',
                    responseLimit: Number(formData.responseLimit),
                };

        try {
            const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const baseUrl = rawBaseUrl.replace(/\/+$/, '');

            const res = await fetch(`${baseUrl}/api/skill-analysis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const json = await res.json();
            if (!res.ok || !json.success || !json.data) {
                throw new Error(json.error || 'Failed to analyze career skills.');
            }

            setResult(json.data);

            if (searchMode === 'voice' && json.data.bestCareer) {
                speakOut(
                    `Top match found: ${json.data.bestCareer} with ${json.data.matchPercentage} percent match rate.`
                );
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const isVoiceTheme = searchMode === 'voice';

    return (
        <div className="w-full space-y-6">
            {/* Header & Mode Switcher */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                        {isVoiceTheme ? (
                            <span className="text-purple-400">🎙️ Voice AI Career Search</span>
                        ) : (
                            <span className="text-cyan-400">💻 Career Skill Analysis</span>
                        )}
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        {isVoiceTheme
                            ? 'Speak your professional targets or background naturally into your microphone.'
                            : 'Enter your skills and target industry for personalized career insights.'}
                    </p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                        type="button"
                        onClick={() => {
                            if (isListening) toggleListening();
                            setSearchMode('text');
                        }}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${!isVoiceTheme
                            ? 'bg-cyan-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Text Mode
                    </button>
                    <button
                        type="button"
                        onClick={() => setSearchMode('voice')}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${isVoiceTheme
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Voice Mode
                    </button>
                </div>
            </header>

            {/* Main Form & Results Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Controls Panel Form */}
                <form
                    onSubmit={handleSubmit}
                    className={`lg:col-span-5 bg-slate-900/90 backdrop-blur border ${isVoiceTheme ? 'border-purple-500/40' : 'border-slate-800'
                        } p-6 rounded-2xl shadow-xl space-y-5 transition-colors`}
                >
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs uppercase text-slate-400 mb-1 font-semibold">
                                Your Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Alex Smith"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-slate-400 mb-1 font-semibold">
                                Target Role
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Lead Architect"
                                value={formData.targetRole}
                                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                        </div>
                    </div>

                    {isVoiceTheme ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs uppercase tracking-wider text-purple-300 font-semibold">
                                    Voice Transcribe Input
                                </span>
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${isListening
                                        ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-900/50'
                                        : 'bg-purple-600 hover:bg-purple-500 text-white'
                                        }`}
                                >
                                    {isListening ? (
                                        <>
                                            <MicOff className="h-3.5 w-3.5" /> Stop Listening
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="h-3.5 w-3.5" /> Start Recording
                                        </>
                                    )}
                                </button>
                            </div>
                            <textarea
                                rows={5}
                                value={naturalDescription}
                                onChange={(e) => setNaturalDescription(e.target.value)}
                                placeholder={
                                    isListening
                                        ? 'Listening live... speak your skills into your mic.'
                                        : 'Click Start Recording or type your speech description here...'
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs uppercase text-slate-400 mb-1 font-semibold">
                                    Skills (Comma Separated)
                                </label>
                                <input
                                    type="text"
                                    placeholder="React, TypeScript, Node.js, Next.js"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-slate-400 mb-1 font-semibold">
                                    Interests / Specializations
                                </label>
                                <input
                                    type="text"
                                    placeholder="Distributed Systems, Cloud Native, AI Apps"
                                    value={formData.interests}
                                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                        <div>
                            <label className="block text-xs uppercase text-slate-400 mb-1 font-semibold">
                                Location
                            </label>
                            <input
                                type="text"
                                placeholder="Remote / Hybrid"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-slate-400 mb-1 font-semibold">
                                Results Limit
                            </label>
                            <select
                                value={formData.responseLimit}
                                onChange={(e) =>
                                    setFormData({ ...formData, responseLimit: Number(e.target.value) })
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                            >
                                <option value={3}>3 Roles</option>
                                <option value={5}>5 Roles</option>
                                <option value={10}>10 Roles</option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="text-rose-400 text-xs bg-rose-950/50 p-3 rounded-lg border border-rose-800/50 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-semibold py-3 rounded-xl transition-all text-white text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 ${isVoiceTheme
                            ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/30'
                            : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/30'
                            }`}
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="h-4 w-4 animate-spin" /> Processing Analysis...
                            </>
                        ) : (
                            <>
                                <span>Analyze Skill Profile</span> <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Results Panel */}
                <section className="lg:col-span-7 bg-slate-900/90 backdrop-blur border border-slate-800 p-6 rounded-2xl shadow-xl">
                    {!result && !loading && (
                        <div className="flex flex-col items-center justify-center text-center py-20 text-slate-500 space-y-3">
                            <Sliders className="h-10 w-10 text-slate-700" />
                            <p className="text-sm">
                                Fill in your skills or record voice inputs and submit to run AI analysis.
                            </p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-cyan-400">{result.bestCareer}</h3>
                                    <p className="text-xs text-slate-400">Primary Career Recommendation Target</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-extrabold text-emerald-400">
                                        {result.matchPercentage}%
                                    </span>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                                        Match Score
                                    </p>
                                </div>
                            </div>

                            {result.missingSkills && result.missingSkills.length > 0 && (
                                <div>
                                    <h4 className="text-xs uppercase text-slate-400 mb-2 font-semibold flex items-center gap-1.5">
                                        <XCircle className="h-3.5 w-3.5 text-rose-400" /> Missing Competencies
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingSkills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs px-2.5 py-1 rounded-full"
                                            >
                                                + {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {result.recommendedLearning && result.recommendedLearning.length > 0 && (
                                <div>
                                    <h4 className="text-xs uppercase text-slate-400 mb-2 font-semibold flex items-center gap-1.5">
                                        <BookOpen className="h-3.5 w-3.5 text-cyan-400" /> Learning Path
                                    </h4>
                                    <ul className="space-y-1.5 text-xs text-slate-300">
                                        {result.recommendedLearning.map((step, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-cyan-400 font-bold">•</span>
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {result.jobListings && result.jobListings.length > 0 && (
                                <div>
                                    <h4 className="text-xs uppercase text-slate-400 mb-3 font-semibold flex items-center gap-1.5">
                                        <Briefcase className="h-3.5 w-3.5 text-emerald-400" /> Open Opportunities (
                                        {result.jobListings.length})
                                    </h4>
                                    <div className="space-y-3">
                                        {result.jobListings.map((job, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all"
                                            >
                                                <div>
                                                    <h5 className="font-semibold text-slate-100 text-sm">{job.title}</h5>
                                                    <p className="text-xs text-slate-400">
                                                        {job.company} • {job.location}
                                                    </p>
                                                    <span className="inline-block text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded mt-1">
                                                        {job.estimatedSalary}
                                                    </span>
                                                </div>
                                                <a
                                                    href={job.applyLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                                >
                                                    Apply ↗
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}