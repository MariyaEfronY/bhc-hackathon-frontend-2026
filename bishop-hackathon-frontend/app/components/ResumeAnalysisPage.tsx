'use client';

import React, { useState } from 'react';
import {
    UploadCloud,
    FileText,
    CheckCircle2,
    XCircle,
    Award,
    AlertCircle,
    RefreshCw,
    Sparkles,
    ArrowRight,
    Briefcase,
    Target,
    Users,
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
        if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 shadow-emerald-500/10';
        if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-amber-500/10';
        return 'text-rose-400 border-rose-500/40 bg-rose-500/10 shadow-rose-500/10';
    };

    return (
        <div className="w-full min-h-screen text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <header className="text-center space-y-4 pt-4">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium uppercase tracking-wider backdrop-blur-sm animate-pulse">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Career Intelligence & ATS Audit</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                    Optimize Your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        Career Resume
                    </span>
                </h1>
                <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Comprehensive deep-scan analysis for Core Technical Skills, Strategic Alignment, and Soft Skills.
                </p>
            </header>

            {/* Upload Form View */}
            {!report && (
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 transition-all duration-300">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center transition-all duration-300 cursor-pointer ${isDragging
                            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02] shadow-xl shadow-indigo-500/10'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 shadow-md'
                            }`}
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 rounded-2xl bg-indigo-950/60 text-indigo-400 border border-indigo-500/20 shadow-inner">
                                {file ? (
                                    <FileText className="h-10 w-10 text-cyan-400 animate-bounce" />
                                ) : (
                                    <UploadCloud className="h-10 w-10 text-indigo-400" />
                                )}
                            </div>

                            {file ? (
                                <div className="space-y-1">
                                    <p className="text-base font-semibold text-white break-all">{file.name}</p>
                                    <p className="text-xs text-slate-400">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    <p className="text-base font-semibold text-white">
                                        Drag & drop your PDF here, or <span className="text-indigo-400 underline">browse</span>
                                    </p>
                                    <p className="text-xs text-slate-500">Supports multi-page PDF resumes up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center space-x-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs sm:text-sm">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!file || loading}
                        className={`w-full py-4 px-6 rounded-2xl font-semibold text-white flex items-center justify-center space-x-2 transition-all shadow-lg ${!file || loading
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/20 active:scale-[0.99]'
                            }`}
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="h-5 w-5 animate-spin text-white" />
                                <span>Scanning Resume...</span>
                            </>
                        ) : (
                            <>
                                <span>Run Resume Audit</span>
                                <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </form>
            )}

            {/* Results Dashboard View */}
            {report && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    {/* Top Control Bar */}
                    <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-md">
                        <div className="flex items-center space-x-3 min-w-0">
                            <FileText className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                            <span className="text-sm font-medium text-slate-300 truncate max-w-xs sm:max-w-md">
                                {file?.name || 'Uploaded Document'}
                            </span>
                            {report.domain && (
                                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                    <Briefcase className="w-3 h-3 mr-1" />
                                    {report.domain}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={resetForm}
                            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl transition border border-slate-700/60"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Analyze Another Resume</span>
                        </button>
                    </div>

                    {/* Overall Score & Executive Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-center items-center text-center space-y-3 shadow-md">
                            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                <Award className="h-4 w-4 text-indigo-400" />
                                <span>Overall Match Index</span>
                            </div>
                            <div
                                className={`w-28 h-28 rounded-full border-4 flex items-center justify-center shadow-xl transition-transform hover:scale-105 ${getScoreColor(
                                    report.score
                                )}`}
                            >
                                <span className="text-4xl font-black">{report.score ?? 0}</span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">Industry Benchmark Rating</p>
                        </div>

                        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3 flex flex-col justify-center shadow-md">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                                <Sparkles className="h-4 w-4 text-indigo-400" />
                                <span>Executive Evaluation Summary</span>
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                                {report.summary || 'No evaluation summary generated.'}
                            </p>
                        </div>
                    </div>

                    {/* Domain Strategic Alignment */}
                    {report.domainAlignment && (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
                            <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider flex items-center space-x-2">
                                <Target className="h-4 w-4 text-indigo-400" />
                                <span>Domain Strategic Alignment ({report.domain || 'Target Role'})</span>
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                {report.domainAlignment.evaluation}
                            </p>

                            {report.domainAlignment.keyGaps && report.domainAlignment.keyGaps.length > 0 && (
                                <div className="pt-2 space-y-2">
                                    <span className="text-xs font-semibold text-rose-400 block uppercase tracking-wider">
                                        Identified Capability Gaps:
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {report.domainAlignment.keyGaps.map((gap, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20"
                                            >
                                                {gap}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Technical & Suggested Additions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-md">
                            <h4 className="font-bold text-xs uppercase text-slate-300 flex items-center space-x-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span>Detected Technical Skills ({report.presentSkills?.length || 0})</span>
                            </h4>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                                {report.presentSkills && report.presentSkills.length > 0 ? (
                                    report.presentSkills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500">No core technical skills identified.</p>
                                )}
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-md">
                            <h4 className="font-bold text-xs uppercase text-slate-300 flex items-center space-x-2">
                                <XCircle className="h-4 w-4 text-rose-500" />
                                <span>Suggested Skill Additions ({report.missingSkills?.length || 0})</span>
                            </h4>
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                                {report.missingSkills && report.missingSkills.length > 0 ? (
                                    report.missingSkills.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 rounded-lg text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500">No missing skills highlighted.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Soft Skills Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-md">
                        <h4 className="font-bold text-xs uppercase text-slate-300 flex items-center space-x-2">
                            <Users className="h-4 w-4 text-purple-400" />
                            <span>Leadership & Executive Soft Skills</span>
                        </h4>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {report.softSkills && report.softSkills.length > 0 ? (
                                report.softSkills.map((ss, idx) => (
                                    <span key={idx} className="px-3 py-1 rounded-lg text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                        {ss}
                                    </span>
                                ))
                            ) : (
                                <p className="text-xs text-slate-500">No leadership traits specified.</p>
                            )}
                        </div>
                    </div>

                    {/* Actionable Tree-Structured Recommendations */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-md">
                        <div className="flex items-center space-x-3 border-b border-slate-800 pb-5">
                            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-base sm:text-lg text-white">
                                    Priority Improvement Tree
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-400">
                                    Step-by-step priority adjustments to increase your ATS scanning visibility.
                                </p>
                            </div>
                        </div>

                        {report.recommendations && report.recommendations.length > 0 ? (
                            <div className="relative pl-4 sm:pl-8 space-y-8">
                                <div className="absolute left-[15px] sm:left-[31px] top-4 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-amber-500 opacity-40 rounded-full" />

                                {report.recommendations.map((rec, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="absolute -left-4 sm:-left-8 top-6 w-4 sm:w-8 h-0.5 bg-slate-800 group-hover:bg-indigo-500/50 transition-colors" />
                                        <div className="absolute -left-[23px] sm:-left-[39px] top-3.5 w-4 h-4 rounded-full border-2 border-slate-900 bg-indigo-400 group-hover:scale-125 transition-transform shadow-md z-10" />

                                        <div className="bg-slate-950/80 border border-slate-800/80 group-hover:border-slate-700 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-sm hover:shadow-indigo-500/5">
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-900 text-indigo-400 font-bold text-xs sm:text-sm flex items-center justify-center border border-slate-800 shadow-inner">
                                                    #{idx + 1}
                                                </div>
                                                <div className="space-y-1.5 pt-0.5 flex-1 min-w-0">
                                                    <span className="text-[10px] sm:text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
                                                        Priority Action Step {idx + 1}
                                                    </span>
                                                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                                                        {rec}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                                No recommendations generated.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}