'use client';

import React, { useState } from 'react';
import {
    UploadCloud,
    FileText,
    CheckCircle2,
    XCircle,
    Lightbulb,
    Award,
    AlertCircle,
    RefreshCw,
    Sparkles,
    ArrowRight,
} from 'lucide-react';
import { ResumeAnalysisReport } from '@/types/career';

export default function ResumeAnalysisPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [report, setReport] = useState<ResumeAnalysisReport | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                setError('Please upload a valid PDF document.');
                return;
            }
            setError(null);
            setFile(selectedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type !== 'application/pdf') {
                setError('Please upload a valid PDF document.');
                return;
            }
            setError(null);
            setFile(droppedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a PDF file first.');
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const baseUrl = rawBaseUrl.replace(/\/+$/, '');

            const res = await fetch(`${baseUrl}/api/resume-analysis`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to analyze resume structure.');
            }

            const reportData: ResumeAnalysisReport = data.data ? data.data : data;
            setReport(reportData);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred during scanning.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setReport(null);
        setError(null);
    };

    const getScoreColor = (score: number = 0) => {
        if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
        if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
        return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
    };

    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <header className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Powered ATS Optimization Engine</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    Optimize Your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        Resume
                    </span>
                </h1>
            </header>

            {/* Upload Form View */}
            {!report && (
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer ${isDragging
                            ? 'border-indigo-500 bg-indigo-500/5 scale-[1.01]'
                            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900'
                            }`}
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 rounded-full bg-slate-800/80 text-indigo-400 border border-slate-700/50 shadow-inner">
                                {file ? (
                                    <FileText className="h-10 w-10 text-cyan-400" />
                                ) : (
                                    <UploadCloud className="h-10 w-10" />
                                )}
                            </div>

                            {file ? (
                                <div className="space-y-1">
                                    <p className="text-base font-semibold text-white">{file.name}</p>
                                    <p className="text-xs text-slate-400">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB PDF Document
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    <p className="text-base font-semibold text-white">
                                        Drag & drop your PDF here, or <span className="text-indigo-400 underline">browse</span>
                                    </p>
                                    <p className="text-xs text-slate-500">Supports standard PDF resumes up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center space-x-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!file || loading}
                        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 transition-all shadow-lg ${!file || loading
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                            : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20 active:scale-[0.99]'
                            }`}
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="h-5 w-5 animate-spin text-white" />
                                <span>Parsing & Scanning Document...</span>
                            </>
                        ) : (
                            <>
                                <span>Run ATS Scan</span>
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>
            )}

            {/* Results Dashboard View */}
            {report && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                        <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-indigo-400" />
                            <span className="text-sm font-medium text-slate-300 truncate max-w-[200px] sm:max-w-xs">
                                {file?.name || 'Uploaded Document'}
                            </span>
                        </div>
                        <button
                            onClick={resetForm}
                            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Analyze Another</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-3">
                            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                <Award className="h-4 w-4 text-indigo-400" />
                                <span>ATS Score</span>
                            </div>
                            <div
                                className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${getScoreColor(
                                    report.score
                                )}`}
                            >
                                <span className="text-3xl font-extrabold">{report.score ?? 0}</span>
                            </div>
                            <p className="text-[11px] text-slate-500">Benchmark Match Score</p>
                        </div>

                        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 flex flex-col justify-center">
                            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                                <Sparkles className="h-4 w-4 text-indigo-400" />
                                <span>Executive Summary</span>
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                {report.summary || 'No summary generated.'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                            <h4 className="font-bold text-xs uppercase text-slate-300 flex items-center space-x-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span>Detected Skills ({report.presentSkills?.length || 0})</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {report.presentSkills && report.presentSkills.length > 0 ? (
                                    report.presentSkills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500">No skills detected.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                            <h4 className="font-bold text-xs uppercase text-slate-300 flex items-center space-x-2">
                                <XCircle className="h-4 w-4 text-rose-500" />
                                <span>Suggested Additions ({report.missingSkills?.length || 0})</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {report.missingSkills && report.missingSkills.length > 0 ? (
                                    report.missingSkills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500">No missing skills detected.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                        <h4 className="font-bold text-xs uppercase text-slate-300 flex items-center space-x-2">
                            <Lightbulb className="h-4 w-4 text-amber-400" />
                            <span>Actionable Recommendations</span>
                        </h4>
                        <ul className="space-y-3">
                            {report.recommendations && report.recommendations.length > 0 ? (
                                report.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 text-indigo-400 font-bold text-xs flex items-center justify-center mt-0.5 border border-slate-700">
                                            {idx + 1}
                                        </span>
                                        <span className="leading-relaxed">{rec}</span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-xs text-slate-500">No recommendations available.</p>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}