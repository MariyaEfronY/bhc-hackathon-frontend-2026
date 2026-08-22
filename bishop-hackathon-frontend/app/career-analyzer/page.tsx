'use client'

import React, { useState } from 'react'
import { CareerRequest, CareerAnalysisData, ApiResponse } from '@/types/career'

export default function CareerAnalyzerPage() {
    const [formData, setFormData] = useState({
        name: '',
        course: '',
        skillsInput: '',
        interestsInput: '',
    })

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<CareerAnalysisData | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setResult(null)

        // Convert comma-separated string inputs into arrays
        const payload: CareerRequest = {
            name: formData.name.trim() || 'Student',
            course: formData.course.trim() || 'MCA',
            skills: formData.skillsInput
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            interests: formData.interestsInput
                .split(',')
                .map((i) => i.trim())
                .filter(Boolean),
        }

        if (payload.skills.length === 0 || payload.interests.length === 0) {
            setError('Please provide at least one skill and one interest.')
            setLoading(false)
            return
        }

        try {
            const response = await fetch('http://localhost:8000/api/skill-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const json: ApiResponse = await response.json()

            if (!response.ok || !json.success || !json.data) {
                throw new Error(json.error || 'Failed to fetch analysis.')
            }

            setResult(json.data)
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <header className="text-center space-y-2">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400">
                        AI Skill & Career Analyzer
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Analyze your technical profile to discover ideal role matches and skill gaps.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Input Form */}
                    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
                        <h2 className="text-xl font-bold text-slate-200 border-b border-slate-800 pb-3">
                            Your Profile
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Efron"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                    Course / Degree
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. MCA, B.Tech CS"
                                    value={formData.course}
                                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                    Skills (comma separated)
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="JavaScript, React, Next.js, MongoDB"
                                    value={formData.skillsInput}
                                    onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                    Interests (comma separated)
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Web Development, AI, Cloud"
                                    value={formData.interestsInput}
                                    onChange={(e) => setFormData({ ...formData, interestsInput: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-950/50 border border-red-800 text-red-300 p-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Analyzing Profile...</span>
                                    </>
                                ) : (
                                    'Generate AI Analysis'
                                )}
                            </button>
                        </form>
                    </section>

                    {/* Results Output */}
                    <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl min-h-[420px] flex flex-col justify-center">
                        {!loading && !result && (
                            <div className="text-center space-y-3 text-slate-500 py-12">
                                <svg className="w-12 h-12 mx-auto stroke-current" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <p>Fill in your technical profile and click Analyze to view career recommendations.</p>
                            </div>
                        )}

                        {result && (
                            <div className="space-y-6 animate-fadeIn">
                                {/* Match Percentage & Best Career */}
                                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                                    <div>
                                        <span className="text-xs uppercase tracking-wider text-slate-400">Best Career Match</span>
                                        <h3 className="text-2xl font-bold text-teal-400">{result.bestCareer}</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs uppercase tracking-wider text-slate-400">Match Rate</span>
                                        <div className="text-3xl font-extrabold text-blue-400">{result.matchPercentage}%</div>
                                    </div>
                                </div>

                                {/* Missing Skills */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Missing Skills to Learn</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingSkills.map((skill, index) => (
                                            <span key={index} className="bg-red-950/60 border border-red-800/80 text-red-300 text-xs px-3 py-1 rounded-full font-medium">
                                                + {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Recommended Learning Path */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Recommended Learning Roadmap</h4>
                                    <ul className="space-y-2">
                                        {result.recommendedLearning.map((step, index) => (
                                            <li key={index} className="flex items-start gap-2.5 text-xs text-slate-300">
                                                <span className="flex-shrink-0 w-5 h-5 bg-blue-900/50 text-blue-300 rounded-full flex items-center justify-center font-bold text-[10px]">
                                                    {index + 1}
                                                </span>
                                                <span>{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Suitable Opportunities */}
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-300 mb-2">Suitable Roles</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.suitableOpportunities.map((role, index) => (
                                            <span key={index} className="bg-slate-800 border border-slate-700 text-slate-200 text-xs px-3 py-1 rounded-md">
                                                {role}
                                            </span>
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