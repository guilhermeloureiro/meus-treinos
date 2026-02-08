'use client';

import React from 'react';
import { ExerciseCard } from './ExerciseCard';
import { Button } from './UI';
import { Exercise } from '@/lib/types';

interface WorkoutActiveViewProps {
    workoutTitle: string;
    exercises: Exercise[];
    onToggle: (id: string) => void;
    onWeightChange: (id: string, weight: string) => void;
    onFinish: () => void;
}

export function WorkoutActiveView({
    workoutTitle,
    exercises,
    onToggle,
    onWeightChange,
    onFinish
}: WorkoutActiveViewProps) {
    const completedCount = exercises.filter(e => e.completed).length;
    const progress = (completedCount / exercises.length) * 100;

    return (
        <div className="bg-background min-h-screen pb-24 relative animate-fade-in">
            {/* Header - Sticky */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border px-6 py-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h2 className="text-xl font-bold text-textMain">{workoutTitle}</h2>
                        <p className="text-textSec text-xs">Toque na carga para editar</p>
                    </div>
                    <div className="text-accent font-mono text-sm font-semibold">
                        {Math.round(progress)}%
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="h-1 w-full bg-surfaceHighlight rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* List */}
            <div className="p-4 space-y-3">
                {exercises.map((ex) => (
                    <ExerciseCard
                        key={ex.id}
                        exercise={ex}
                        onToggle={onToggle}
                        onWeightChange={onWeightChange}
                    />
                ))}
            </div>

            {/* Footer Action - Sticky */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-20">
                <Button onClick={onFinish} variant="primary">
                    Finalizar Treino
                </Button>
            </div>
        </div>
    );
}
