'use client'

import React, { useState, useRef, useEffect } from 'react'
import { CareerAnalysisData, ApiResponse } from '@/types/career'

type SearchMode = 'text' | 'voice'

export default function DualModeJobSearch() {
    const [searchMode, setSearchMode] = useState<SearchMode>('text')

    // Structured form inputs (Text Mode)
    const [formData, setFormData] = useState({
        name: 'Efron',
        course: 'MCA',
        skills: 'JavaScript, TypeScript, React, Next.js, MongoDB',
        interests: 'Web Development, AI',
        location: 'Remote',
        responseLimit: 5,
    })

    // Natural language description (Voice Mode / Quick Search)
    const [naturalDescription, setNaturalDescription] = useState<string>('')

    // Voice Recording state
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef<any>(null)

    // Request & Response state
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<CareerAnalysisData | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Initialize Speech Recognition once
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition =
                (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = true
                recognition.interimResults = true
                recognition.lang = 'en-US'

                recognition.onresult = (event: any) => {
                    let currentTranscript = ''
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        currentTranscript += event.results[i][0].transcript
                    }
                    if (currentTranscript) {
                        setNaturalDescription(currentTranscript)
                    }
                }

                recognition.onerror = (event: any) => {
                    console.error('Speech Recognition Error:', event.error)
                    setIsListening(false)
                }

                recognition.onend = () => {
                    setIsListening(false)
                }

                recognitionRef.current = recognition
            }
        }
    }, [])

    // Start / Stop Microphone Handler
    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert('Speech Recognition is not supported in this browser. Try Chrome or Edge.')
            return
        }

        if (isListening) {
            recognitionRef.current.stop()
            setIsListening(false)
        } else {
            setSearchMode('voice')
            setNaturalDescription('')
            recognitionRef.current.start()
            setIsListening(true)
        }
    }

    // Text-To-Speech Synthesis
    const speakOut = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.rate = 1.0
            window.speechSynthesis.speak(utterance)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Stop listening if active
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop()
            setIsListening(false)
        }

        // Build payload based on current mode
        const payload =
            searchMode === 'voice'
                ? {
                    name: formData.name,
                    course: formData.course,
                    skills: [naturalDescription], // Passes raw instruction string directly
                    interests: ['Voice Search'],
                    location: formData.location,
                    responseLimit: Number(formData.responseLimit),
                }
                : {
                    name: formData.name,
                    course: formData.course,
                    skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
                    interests: formData.interests.split(',').map((i) => i.trim()).filter(Boolean),
                    location: formData.location,
                    responseLimit: Number(formData.responseLimit),
                }

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL

            const res = await fetch(`${baseUrl}/api/skill-analysis`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const json: ApiResponse = await res.json()
            if (!res.ok || !json.success || !json.data) {
                throw new Error(json.error || 'Failed to analyze request.')
            }

            setResult(json.data)

            if (searchMode === 'voice') {
                speakOut(`Top match found: ${json.data.bestCareer} with ${json.data.matchPercentage} percent match rate.`)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Safe Fallback Arrays
    const jobListings = result?.jobListings || []
    const missingSkills = result?.missingSkills || []
    const recommendedLearning = result?.recommendedLearning || []

    // Dynamic Theme Colors based on active Search Mode
    const isVoiceTheme = searchMode === 'voice'
    const bgGradient = isVoiceTheme
        ? 'from-purple-950 via-slate-950 to-indigo-950'
        : 'from-slate-950 via-slate-900 to-slate-950'
    const accentBorder = isVoiceTheme ? 'border-purple-500/50' : 'border-slate-800'
    const accentText = isVoiceTheme ? 'text-purple-400' : 'text-cyan-400'
    const buttonColor = isVoiceTheme
        ? 'bg-purple-600 hover:bg-purple-500'
        : 'bg-blue-600 hover:bg-blue-500'

    return (
        <main className={`min-h-screen bg-gradient-to-br ${bgGradient} text-slate-100 p-6 md:p-12 font-sans transition-colors duration-500`}>
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header & Mode Switcher */}
                <header className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                    <div>
                        <h1 className={`text-3xl md:text-4xl font-extrabold ${accentText} transition-colors`}>
                            {isVoiceTheme ? '🎙️ Voice AI Career Search' : '💻 Textual Career Search'}
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            {isVoiceTheme
                                ? 'Speak your career background naturally in real-time.'
                                : 'Enter structured skills and search parameters manually.'}
                        </p>
                    </div>

                    {/* Mode Switch Toggle */}
                    <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <button
                            type="button"
                            onClick={() => {
                                if (isListening) toggleListening()
                                setSearchMode('text')
                            }}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${!isVoiceTheme ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Text Mode
                        </button>
                        <button
                            type="button"
                            onClick={() => setSearchMode('voice')}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${isVoiceTheme ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Voice Mode
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Controls Panel */}
                    <section className={`lg:col-span-5 bg-slate-900/90 backdrop-blur border ${accentBorder} p-6 rounded-2xl shadow-xl space-y-6 transition-colors`}>

                        {/* VOICE MODE INTERFACE */}
                        {isVoiceTheme ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-wider text-purple-300 font-semibold">
                                        Voice Description Input
                                    </span>
                                    <button
                                        type="button"
                                        onClick={toggleListening}
                                        className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${isListening
                                            ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-900/50'
                                            : 'bg-purple-600 hover:bg-purple-500 text-white'
                                            }`}
                                    >
                                        <span>{isListening ? '🛑 Stop Recording' : '🎙️ Start Recording'}</span>
                                    </button>
                                </div>

                                {/* Live Speech Description Text Area */}
                                <div>
                                    <textarea
                                        rows={6}
                                        value={naturalDescription}
                                        onChange={(e) => setNaturalDescription(e.target.value)}
                                        placeholder={
                                            isListening
                                                ? 'Listening to your speech... Speak clearly into your mic.'
                                                : 'Click "Start Recording" or type your complete career background here...'
                                        }
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <p className="text-[11px] text-slate-500 mt-1">
                                        Speech gets captured live into this description box and sent directly to Groq AI.
                                    </p>
                                </div>
                            </div>
                        ) : (

                            /* TEXT MODE INTERFACE */
                            <div className="space-y-4">
                                <span className="text-xs uppercase tracking-wider text-cyan-300 font-semibold">
                                    Structured Fields
                                </span>

                                <div>
                                    <label className="block text-xs uppercase text-slate-400 mb-1">Skills (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-slate-400 mb-1">Interests</label>
                                    <input
                                        type="text"
                                        value={formData.interests}
                                        onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Shared Parameters */}
                        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs uppercase text-slate-400 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase text-slate-400 mb-1">Job Count</label>
                                    <select
                                        value={formData.responseLimit}
                                        onChange={(e) => setFormData({ ...formData, responseLimit: Number(e.target.value) })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200"
                                    >
                                        <option value={3}>3 Roles</option>
                                        <option value={5}>5 Roles</option>
                                        <option value={10}>10 Roles</option>
                                    </select>
                                </div>
                            </div>

                            {error && <div className="text-red-400 text-xs bg-red-950/50 p-2.5 rounded-lg">{error}</div>}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full ${buttonColor} font-semibold py-3 rounded-xl transition-all text-white text-sm shadow-lg`}
                            >
                                {loading ? 'AI Processing Request...' : 'Analyze & Find Roles ↗'}
                            </button>
                        </form>
                    </section>

                    {/* Results Display */}
                    <section className={`lg:col-span-7 bg-slate-900/90 backdrop-blur border ${accentBorder} p-6 rounded-2xl shadow-xl space-y-6 transition-colors`}>
                        {!result && !loading && (
                            <div className="text-center text-slate-500 py-24">
                                {isVoiceTheme
                                    ? 'Click "Start Recording", describe your career skills, and click Analyze.'
                                    : 'Fill in your technical profile and click Analyze.'}
                            </div>
                        )}

                        {result && (
                            <div className="space-y-6">
                                {/* Role & Match Banner */}
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <div>
                                        <h3 className={`text-2xl font-bold ${accentText}`}>{result.bestCareer}</h3>
                                        <p className="text-xs text-slate-400">AI Recommendation Result</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-extrabold text-blue-400">{result.matchPercentage}%</span>
                                        <p className="text-[10px] text-slate-400 uppercase">Match Score</p>
                                    </div>
                                </div>

                                {/* Missing Skills */}
                                {missingSkills.length > 0 && (
                                    <div>
                                        <h4 className="text-xs uppercase text-slate-400 mb-2 font-semibold">Missing Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {missingSkills.map((skill, idx) => (
                                                <span key={idx} className="bg-red-950/60 border border-red-800 text-red-300 text-xs px-2.5 py-1 rounded-full">
                                                    + {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Learning Path */}
                                {recommendedLearning.length > 0 && (
                                    <div>
                                        <h4 className="text-xs uppercase text-slate-400 mb-2 font-semibold">Learning Roadmap</h4>
                                        <ul className="space-y-1.5 text-xs text-slate-300">
                                            {recommendedLearning.map((step, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-blue-400 font-bold">•</span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Live Job Hyperlink Cards */}
                                <div>
                                    <h4 className="text-xs uppercase text-slate-400 mb-3 font-semibold">
                                        Matching Open Opportunities ({jobListings.length})
                                    </h4>
                                    <div className="space-y-3">
                                        {jobListings.map((job, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all"
                                            >
                                                <div className="space-y-1">
                                                    <h5 className="font-semibold text-slate-100 text-sm">{job.title}</h5>
                                                    <p className="text-xs text-slate-400">
                                                        {job.company} • {job.location}
                                                    </p>
                                                    <span className="inline-block text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                                                        {job.estimatedSalary}
                                                    </span>
                                                </div>
                                                <a
                                                    href={job.applyLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`${buttonColor} text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all`}
                                                >
                                                    Apply ↗
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    )
}