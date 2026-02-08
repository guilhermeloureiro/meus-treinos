import React, { useState } from 'react';
import { Check, Dumbbell, Repeat, PlayCircle } from 'lucide-react';
import { Exercise } from '@/lib/types';
import { Card } from './UI';
import { VideoPlayer } from './VideoPlayer';

interface ExerciseCardProps {
  exercise: Exercise;
  onToggle: (id: string) => void;
  onWeightChange?: (id: string, newWeight: string) => void;
  isEditing?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onToggle, onWeightChange, isEditing = false }) => {
  const isCompleted = exercise.completed;
  const [showVideo, setShowVideo] = useState(false);

  // Handler to stop propagation when clicking the input so it doesn't toggle completion
  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowVideo(true);
  };

  return (
    <>
      <Card
        onClick={() => onToggle(exercise.id)}
        className={`
          relative group cursor-pointer transition-all duration-300
          ${isCompleted ? 'border-accent/20 bg-surface/40' : 'hover:border-border/80'}
          ${showVideo ? 'z-40' : ''}
        `}
      >
        <div className="flex items-start justify-between gap-4">

          {/* Left: Info */}
          <div className={`flex-1 transition-opacity duration-300 ${isCompleted ? 'opacity-40' : 'opacity-100'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${isCompleted ? 'line-through decoration-textSec/50' : 'text-textMain'}`}>
              {exercise.name}
            </h3>

            <div className="flex items-center gap-4 text-sm text-textSec flex-wrap">
              <div className="flex items-center gap-1.5 bg-surfaceHighlight/50 px-2 py-1 rounded-md">
                <Repeat size={14} className="text-accent" />
                <span className="font-medium text-textMain">{exercise.sets}</span>
                <span>×</span>
                <span className="font-medium text-textMain">{exercise.reps}</span>
              </div>

              <div className="flex items-center gap-1.5 z-10">
                <Dumbbell size={14} className="text-textSec" />
                {onWeightChange ? (
                  <input
                    type="text"
                    value={exercise.weight_hint}
                    onClick={handleInputClick}
                    onChange={(e) => onWeightChange(exercise.id, e.target.value)}
                    className="bg-transparent border-b border-textSec/30 text-textMain w-20 text-sm focus:outline-none focus:border-accent p-0"
                  />
                ) : (
                  <span>{exercise.weight_hint}</span>
                )}
              </div>

              {exercise.video_filename && !isEditing && (
                <button
                  onClick={handleVideoClick}
                  className="flex items-center gap-1.5 text-accent hover:text-accentHover transition-colors ml-auto sm:ml-0 bg-accent/10 px-2 py-1 rounded-md"
                >
                  <PlayCircle size={14} />
                  <span className="text-xs font-medium">Ver execução</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Checkbox (Hidden if in strict edit mode, but shown in active workout) */}
          {!isEditing && (
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shrink-0
              ${isCompleted
                ? 'bg-accent border-accent text-background scale-100'
                : 'border-textSec/30 text-transparent scale-95 group-hover:border-accent/50'}
            `}>
              <Check size={18} strokeWidth={3} />
            </div>
          )}

        </div>

        {/* Subtle completion indicator bar */}
        <div className={`
          absolute bottom-0 left-0 h-1 bg-accent rounded-b-xl transition-all duration-500
          ${isCompleted ? 'w-full opacity-100' : 'w-0 opacity-0'}
        `} />
      </Card>

      {showVideo && exercise.video_filename && (
        <VideoPlayer
          videoFilename={exercise.video_filename}
          videoTitle={exercise.name}
          onClose={() => setShowVideo(false)}
        />
      )}
    </>
  );
};