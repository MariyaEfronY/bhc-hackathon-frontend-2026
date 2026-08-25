'use client';

import React, { useState, useEffect, JSX } from 'react';

interface TaskItem {
    taskId: string;
    title: string;
    description: string;
    category: 'Learn' | 'Project' | 'Practice' | 'Assessment';
    estimatedHours: number;
    status: 'Pending' | 'In Progress' | 'Completed';
}

interface TaskSet {
    _id: string;
    title: string;
    overallSkillLevel: string;
    aiAnalysisSummary: string;
    recommendedTips: string[];
    tasks: TaskItem[];
    progressPercentage: number;
}

export default function AIRoadmapWidget(): JSX.Element {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    const [taskSet, setTaskSet] = useState<TaskSet | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [generating, setGenerating] = useState<boolean>(false);

    // Form state for generating a new roadmap
    const [careerGoal, setCareerGoal] = useState<string>('');
    const [courses, setCourses] = useState<string>('');
    const [skills, setSkills] = useState<string>('');
    const [interests, setInterests] = useState<string>('');

    // Fetch existing task set on mount
    useEffect(() => {
        fetch(`${backendUrl}/api/student/my-taskset`, { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.taskSet) {
                    setTaskSet(data.taskSet);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [backendUrl]);

    // Submit profile details to generate AI Roadmap
    const handleGenerateRoadmap = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);

        try {
            const res = await fetch(`${backendUrl}/api/student/generate-roadmap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    careerGoal,
                    courses: courses.split(',').map((s) => s.trim()).filter(Boolean),
                    skills: skills.split(',').map((s) => ({ skillName: s.trim(), level: 'Beginner' })),
                    interests: interests.split(',').map((s) => s.trim()).filter(Boolean),
                }),
            });

            const data = await res.json();
            if (data.success && data.taskSet) {
                setTaskSet(data.taskSet);
            }
        } catch (err) {
            console.error('Failed to generate AI Roadmap:', err);
        } finally {
            setGenerating(false);
        }
    };

    // Toggle task status and update via backend API
    const handleTaskToggle = async (taskId: string, currentStatus: string) => {
        if (!taskSet) return;

        const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';

        // Optimistic UI update
        const updatedTasks = taskSet.tasks.map((t) =>
            t.taskId === taskId ? { ...t, status: newStatus as TaskItem['status'] } : t
        );
        const completedCount = updatedTasks.filter((t) => t.status === 'Completed').length;
        const newProgress = Math.round((completedCount / updatedTasks.length) * 100);

        setTaskSet({
            ...taskSet,
            tasks: updatedTasks,
            progressPercentage: newProgress,
        });

        try {
            await fetch(`${backendUrl}/api/student/task-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    taskSetId: taskSet._id,
                    taskId,
                    status: newStatus,
                }),
            });
        } catch (err) {
            console.error('Failed to update task status:', err);
        }
    };

    if (loading) return <div style={styles.loading}>Loading AI Roadmap...</div>;

    // View 1: Profile Input Setup (if no task-set exists yet)
    if (!taskSet) {
        return (
            <div style={styles.container}>
                <div style={styles.headerBox}>
                    <h2 style={styles.title}>🚀 Generate Your AI Learning Roadmap</h2>
                    <p style={styles.subtitle}>
                        Enter your background and target goal to build a personalized task-set.
                    </p>
                </div>

                <form onSubmit={handleGenerateRoadmap} style={styles.form}>
                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Target Career Goal</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Full-Stack Web Developer, Data Scientist"
                            value={careerGoal}
                            onChange={(e) => setCareerGoal(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Enrolled / Completed Courses (comma separated)</label>
                        <input
                            type="text"
                            placeholder="e.g. Web Bootcamp, Data Structures 101"
                            value={courses}
                            onChange={(e) => setCourses(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Current Skills (comma separated)</label>
                        <input
                            type="text"
                            placeholder="e.g. HTML, CSS, JavaScript, Basic Python"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.fieldGroup}>
                        <label style={styles.label}>Interests & Focus Areas (comma separated)</label>
                        <input
                            type="text"
                            placeholder="e.g. React, UI/UX Design, Cloud Architecture"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" disabled={generating} style={styles.submitBtn}>
                        {generating ? 'Analyzing & Building Tasks...' : 'Build My AI Task-Set'}
                    </button>
                </form>
            </div>
        );
    }

    // View 2: Interactive Task-Set Roadmap
    return (
        <div style={styles.container}>
            {/* Overview Card */}
            <div style={styles.headerCard}>
                <div>
                    <span style={styles.badge}>{taskSet.overallSkillLevel} Level</span>
                    <h2 style={styles.title}>{taskSet.title}</h2>
                    <p style={styles.summary}>{taskSet.aiAnalysisSummary}</p>
                </div>

                {/* Progress Circle / Indicator */}
                <div style={styles.progressBox}>
                    <div style={styles.progressPercent}>{taskSet.progressPercentage}%</div>
                    <span style={styles.progressLabel}>Completed</span>
                </div>
            </div>

            {/* Recommended AI Tips */}
            {taskSet.recommendedTips?.length > 0 && (
                <div style={styles.tipsCard}>
                    <h3 style={styles.sectionHeading}>💡 AI Strategic Recommendations</h3>
                    <ul style={styles.tipsList}>
                        {taskSet.recommendedTips.map((tip, idx) => (
                            <li key={idx} style={styles.tipItem}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Task Checklist */}
            <div style={styles.tasksCard}>
                <div style={styles.tasksHeader}>
                    <h3 style={styles.sectionHeading}>📋 Roadmap Tasks</h3>
                    <button onClick={() => setTaskSet(null)} style={styles.rebuildBtn}>
                        Rebuild Roadmap
                    </button>
                </div>

                <div style={styles.taskList}>
                    {taskSet.tasks.map((task) => {
                        const isDone = task.status === 'Completed';
                        return (
                            <div
                                key={task.taskId}
                                style={{
                                    ...styles.taskRow,
                                    ...(isDone ? styles.taskRowDone : {}),
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isDone}
                                    onChange={() => handleTaskToggle(task.taskId, task.status)}
                                    style={styles.checkbox}
                                />
                                <div style={styles.taskDetails}>
                                    <div style={styles.taskMeta}>
                                        <span style={styles.categoryBadge}>{task.category}</span>
                                        <span style={styles.hoursText}>{task.estimatedHours} hrs</span>
                                    </div>
                                    <h4 style={{ ...styles.taskTitle, ...(isDone ? styles.strikethrough : {}) }}>
                                        {task.title}
                                    </h4>
                                    <p style={styles.taskDesc}>{task.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: { display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' },
    loading: { color: '#94a3b8', padding: '2rem', textAlign: 'center' },
    headerBox: { marginBottom: '0.5rem' },
    title: { fontSize: '1.4rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#f8fafc' },
    subtitle: { color: '#94a3b8', fontSize: '0.9rem', margin: 0 },
    form: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1.25rem' },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
    label: { fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 },
    input: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '0.9rem' },
    submitBtn: { padding: '0.85rem', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' },
    headerCard: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    badge: { backgroundColor: '#3b82f620', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.6rem', borderRadius: '12px', textTransform: 'uppercase' },
    summary: { color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem', maxWidth: '600px' },
    progressBox: { textAlign: 'center', backgroundColor: '#0f172a', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #334155' },
    progressPercent: { fontSize: '1.8rem', fontWeight: 'bold', color: '#60a5fa' },
    progressLabel: { fontSize: '0.75rem', color: '#94a3b8' },
    tipsCard: { backgroundColor: '#1e293b', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #334155' },
    sectionHeading: { fontSize: '1.1rem', margin: '0 0 0.75rem 0', color: '#f8fafc' },
    tipsList: { margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1', fontSize: '0.9rem' },
    tipItem: { marginBottom: '0.4rem' },
    tasksCard: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' },
    tasksHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    rebuildBtn: { backgroundColor: 'transparent', border: '1px solid #475569', color: '#cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' },
    taskList: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    taskRow: { display: 'flex', alignItems: 'flex-start', gap: '1rem', backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' },
    taskRowDone: { opacity: 0.65, borderStyle: 'dashed' },
    checkbox: { marginTop: '0.25rem', width: '18px', height: '18px', cursor: 'pointer' },
    taskDetails: { flex: 1 },
    taskMeta: { display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' },
    categoryBadge: { fontSize: '0.7rem', backgroundColor: '#334155', color: '#94a3b8', padding: '0.15rem 0.4rem', borderRadius: '4px' },
    hoursText: { fontSize: '0.75rem', color: '#64748b' },
    taskTitle: { margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#f8fafc' },
    strikethrough: { textDecoration: 'line-through', color: '#94a3b8' },
    taskDesc: { margin: 0, fontSize: '0.85rem', color: '#94a3b8' },
};