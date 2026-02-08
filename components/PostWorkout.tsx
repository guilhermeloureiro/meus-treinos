import React from 'react';
import { Trophy, Clock, Target, CheckCircle2, Home, Calendar, ChevronDown } from 'lucide-react';
import { WorkoutStats, WorkoutHistory } from '@/lib/types';
import { Button, Container, Title, Subtitle, Card } from './UI';

interface PostWorkoutProps {
  stats: WorkoutStats;
  history?: WorkoutHistory[];
  onHome: () => void;
}

export const PostWorkout: React.FC<PostWorkoutProps> = ({ stats, history, onHome }) => {
  return (
    <Container className="justify-start items-center text-center animate-fade-in pt-10">
      
      {/* Hero Section */}
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
        <Trophy size={64} className="text-accent relative z-10 mx-auto" strokeWidth={1.5} />
      </div>

      <Title className="mb-2 !text-2xl">Treino Concluído</Title>
      <Subtitle className="mb-8 max-w-xs mx-auto">
        "A constância constrói resultados."
      </Subtitle>

      {/* Stats Grid */}
      <div className="w-full grid grid-cols-2 gap-3 mb-8">
        <StatCard 
          icon={<CheckCircle2 size={18} className="text-accent" />}
          label="Exercícios"
          value={`${stats.completedExercises}/${stats.totalExercises}`}
        />
        <StatCard 
          icon={<Target size={18} className="text-blue-400" />}
          label="Séries"
          value={stats.totalSets.toString()}
        />
        <StatCard 
          icon={<Clock size={18} className="text-orange-400" />}
          label="Duração"
          value={stats.duration}
          fullWidth
        />
      </div>

      {/* History Section */}
      {history && history.length > 0 && (
        <div className="w-full text-left mb-24 animate-slide-up">
           <div className="flex items-center gap-2 mb-4 mt-6 border-t border-border pt-6">
              <Calendar size={16} className="text-textSec" />
              <h3 className="text-sm font-bold text-textSec uppercase tracking-wider">Histórico Recente</h3>
           </div>
           
           <div className="space-y-3">
             {history.map((workout, idx) => (
               <HistoryCard key={idx} workout={workout} />
             ))}
           </div>
        </div>
      )}

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-20">
        <Button onClick={onHome} variant="secondary">
          <Home size={20} />
          Voltar ao Início
        </Button>
      </div>

    </Container>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; fullWidth?: boolean }> = ({ icon, label, value, fullWidth }) => (
  <Card className={`flex flex-col items-center justify-center py-3 bg-surfaceHighlight/30 border-transparent ${fullWidth ? 'col-span-2' : ''}`}>
    <div className="mb-1 opacity-80">{icon}</div>
    <span className="text-xl font-bold text-textMain mb-0.5">{value}</span>
    <span className="text-[10px] text-textSec uppercase tracking-wider font-medium">{label}</span>
  </Card>
);

const HistoryCard: React.FC<{ workout: WorkoutHistory }> = ({ workout }) => {
  const [expanded, setExpanded] = React.useState(false);
  
  const dateStr = workout.completed_at 
    ? new Date(workout.completed_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    : 'Data desconhecida';

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden transition-all duration-200">
      <div 
        onClick={() => setExpanded(!expanded)}
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-surfaceHighlight/20"
      >
        <div>
          <div className="text-xs text-textSec mb-1">{dateStr}</div>
          <div className="font-semibold text-textMain">{workout.workout_title}</div>
        </div>
        <ChevronDown size={18} className={`text-textSec transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border/50 bg-surfaceHighlight/10">
          <div className="mt-3 space-y-2">
            {workout.exercise_data.map((ex, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className={`${ex.completed ? 'text-textMain' : 'text-textSec'} truncate pr-4`}>
                  {ex.name}
                </span>
                <span className="text-textSec font-mono shrink-0">
                  {ex.sets}x{ex.reps} • {ex.weight_hint}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};