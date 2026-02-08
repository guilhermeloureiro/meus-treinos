'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Dumbbell, Plus, Trash2, ArrowLeft, Save, List, Edit2, GripVertical, ChevronUp, ChevronDown, Settings, LogOut } from 'lucide-react';
import { AppView, Workout, Exercise, WorkoutStats, WorkoutHistory, UserStats } from '@/lib/types';
import { Container, Title, Subtitle, Button, Input, Card } from '@/components/UI';
import { ExerciseCard } from '@/components/ExerciseCard';
import { PostWorkout } from '@/components/PostWorkout';
import { isAuthenticated, logout } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [loading, setLoading] = useState(true);

  // Data State
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [history, setHistory] = useState<WorkoutHistory[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);

  // Active Workout State
  const [currentPlan, setCurrentPlan] = useState<Workout | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);

  // Manual Creation/Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [manualTitle, setManualTitle] = useState('');
  const [manualExercises, setManualExercises] = useState<Exercise[]>([]);
  const [newExercise, setNewExercise] = useState({ name: '', sets: '', reps: '', weight: '' });

  // Drag and Drop State
  const [draggedIndexState, setDraggedIndexState] = useState<number | null>(null);
  const dragSourceIndex = useRef<number | null>(null);

  // Input ref for file upload


  // --- Load Data ---
  // Check authentication and load data on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load workouts
      const workoutsRes = await fetch('/api/workouts');
      if (workoutsRes.ok) {
        const workoutsData = await workoutsRes.json();
        setSavedWorkouts(workoutsData);
      }

      // Load history
      const historyRes = await fetch('/api/history');
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setHistory(historyData);
      }

      // Load stats
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Check for active workout in localStorage (session recovery)
      const savedActivePlan = localStorage.getItem('ironTrackActivePlan');
      const savedStartTime = localStorage.getItem('ironTrackStartTime');

      if (savedActivePlan && savedStartTime) {
        setCurrentPlan(JSON.parse(savedActivePlan));
        setStartTime(parseInt(savedStartTime));
        setView(AppView.WORKOUT_ACTIVE);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Erro ao carregar dados. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  // Save Active Workout State to localStorage (for session recovery)
  useEffect(() => {
    if (currentPlan && view === AppView.WORKOUT_ACTIVE) {
      localStorage.setItem('ironTrackActivePlan', JSON.stringify(currentPlan));
      localStorage.setItem('ironTrackStartTime', startTime.toString());
    } else if (view !== AppView.WORKOUT_ACTIVE) {
      localStorage.removeItem('ironTrackActivePlan');
      localStorage.removeItem('ironTrackStartTime');
    }
  }, [currentPlan, startTime, view]);

  /* 
   * RESET LOGIC 
   */
  const handleResetData = async () => {
    if (confirm("ATENÇÃO: Isso apagará APENAS o histórico de treinos e zerará a contagem de ciclos. Seus treinos cadastrados serão MANTIDOS.\n\nDeseja continuar?")) {
      try {
        setLoading(true);
        const res = await fetch('/api/reset', { method: 'POST' });

        if (!res.ok) throw new Error('Failed to reset');

        alert('Histórico e ciclos resetados com sucesso!');
        await loadData();
      } catch (error) {
        console.error('Error resetting:', error);
        alert('Erro ao resetar dados.');
      } finally {
        setLoading(false);
      }
    }
  };

  // --- Manual Actions (Create & Edit) ---
  const handleAddManualExercise = () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps) return;

    const exercise: Exercise = {
      id: `manual-${Date.now()}`,
      name: newExercise.name,
      sets: parseInt(newExercise.sets) || 3,
      reps: newExercise.reps,
      weight_hint: newExercise.weight || 'Livre',
      position: manualExercises.length,
      completed: false
    };

    setManualExercises([...manualExercises, exercise]);
    setNewExercise({ name: '', sets: '', reps: '', weight: '' });
  };

  const handleRemoveManualExercise = (id: string) => {
    setManualExercises(manualExercises.filter(e => e.id !== id));
  };

  const saveManualWorkout = async () => {
    if (!manualTitle || manualExercises.length === 0) return;

    try {
      if (editingId) {
        // Update Existing
        const res = await fetch(`/api/workouts/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: manualTitle,
            description: `${manualExercises.length} exercícios`,
            exercises: manualExercises
          })
        });

        if (!res.ok) throw new Error('Failed to update workout');
      } else {
        // Create New
        const res = await fetch('/api/workouts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: manualTitle,
            description: `${manualExercises.length} exercícios`,
            day_of_week: 0,
            exercises: manualExercises
          })
        });

        if (!res.ok) throw new Error('Failed to create workout');
      }

      // Reload data
      await loadData();

      // Reset and go home
      setEditingId(null);
      setManualTitle('');
      setManualExercises([]);
      setView(AppView.HOME);
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Erro ao salvar treino. Tente novamente.');
    }
  };

  const startEditing = (workout: Workout, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(workout.id);
    setManualTitle(workout.title);
    setManualExercises(workout.exercises || []);
    setView(AppView.MANUAL_CREATION);
  };

  const deleteWorkout = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Tem certeza que deseja excluir este treino?")) {
      try {
        const res = await fetch(`/api/workouts/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete workout');
        await loadData();
      } catch (error) {
        console.error('Error deleting workout:', error);
        alert('Erro ao excluir treino. Tente novamente.');
      }
    }
  };

  // --- REORDERING LOGIC ---
  const moveExercise = (index: number, direction: 'up' | 'down') => {
    const newExercises = [...manualExercises];
    if (direction === 'up') {
      if (index === 0) return;
      [newExercises[index - 1], newExercises[index]] = [newExercises[index], newExercises[index - 1]];
    } else {
      if (index === newExercises.length - 1) return;
      [newExercises[index + 1], newExercises[index]] = [newExercises[index], newExercises[index + 1]];
    }
    setManualExercises(newExercises);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndexState(index);
    dragSourceIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();

    const dragIndexStr = e.dataTransfer.getData("text/plain");
    let dragIndex = parseInt(dragIndexStr);

    if (isNaN(dragIndex) && dragSourceIndex.current !== null) {
      dragIndex = dragSourceIndex.current;
    }

    if (dragIndex === undefined || isNaN(dragIndex) || dragIndex === dropIndex) {
      setDraggedIndexState(null);
      dragSourceIndex.current = null;
      return;
    }

    const newExercises = [...manualExercises];
    const itemToMove = newExercises[dragIndex];

    newExercises.splice(dragIndex, 1);
    newExercises.splice(dropIndex, 0, itemToMove);

    setManualExercises(newExercises);
    setDraggedIndexState(null);
    dragSourceIndex.current = null;
  };

  const handleDragEnd = () => {
    setDraggedIndexState(null);
    dragSourceIndex.current = null;
  };

  // --- Workout Flow ---
  const startWorkout = (plan: Workout) => {
    const freshPlan = {
      ...plan,
      exercises: (plan.exercises || []).map(ex => ({ ...ex, completed: false }))
    };
    setCurrentPlan(freshPlan);
    setStartTime(Date.now());
    setView(AppView.WORKOUT_ACTIVE);
  };

  const toggleExercise = (id: string) => {
    if (!currentPlan) return;
    const updatedExercises = (currentPlan.exercises || []).map(ex =>
      ex.id === id ? { ...ex, completed: !ex.completed } : ex
    );
    setCurrentPlan({ ...currentPlan, exercises: updatedExercises });
  };

  const updateActiveExerciseWeight = (id: string, newWeight: string) => {
    if (!currentPlan) return;
    const updatedExercises = (currentPlan.exercises || []).map(ex =>
      ex.id === id ? { ...ex, weight_hint: newWeight } : ex
    );
    setCurrentPlan({ ...currentPlan, exercises: updatedExercises });
  };

  const finishWorkout = async () => {
    if (!currentPlan) return;

    const endTime = Date.now();
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);

    const completedCount = (currentPlan.exercises || []).filter(ex => ex.completed).length;
    const totalSets = (currentPlan.exercises || []).reduce((acc, curr) => acc + (curr.completed ? curr.sets : 0), 0);

    setWorkoutStats({
      totalExercises: currentPlan.exercises?.length || 0,
      completedExercises: completedCount,
      totalSets: totalSets,
      duration: `${minutes}m ${parseInt(seconds) < 10 ? '0' : ''}${seconds}s`
    });

    try {
      // Save to history and update stats
      const res = await fetch(`/api/workouts/${currentPlan.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout_title: currentPlan.title,
          duration_seconds: Math.floor(durationMs / 1000),
          exercises_completed: completedCount,
          total_sets: totalSets,
          exercise_data: currentPlan.exercises
        })
      });

      if (!res.ok) throw new Error('Failed to complete workout');

      const data = await res.json();

      // Update local stats
      if (stats) {
        setStats({
          ...stats,
          cycle_count: data.cycle_count,
          cycle_progress: data.cycle_progress
        });
      }

      // Reload workouts (they might have been rotated)
      await loadData();

      // Clear active workout state
      localStorage.removeItem('ironTrackActivePlan');
      localStorage.removeItem('ironTrackStartTime');

      setView(AppView.SUMMARY);
    } catch (error) {
      console.error('Error completing workout:', error);
      alert('Erro ao finalizar treino. Tente novamente.');
    }
  };

  const goHome = () => {
    setCurrentPlan(null);
    setWorkoutStats(null);
    setView(AppView.HOME);
  };

  // Loading state
  if (loading) {
    return (
      <Container className="justify-center items-center">
        <div className="text-center">
          <Dumbbell className="w-16 h-16 text-accent animate-pulse mx-auto mb-4" />
          <p className="text-textSec">Carregando treinos...</p>
        </div>
      </Container>
    );
  }

  // SUMMARY VIEW
  if (view === AppView.SUMMARY && workoutStats) {
    return <PostWorkout stats={workoutStats} history={history} onHome={goHome} />;
  }

  // HISTORY VIEW
  if (view === AppView.HISTORY) {
    return (
      <Container className="animate-fade-in pt-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView(AppView.HOME)} className="p-2 -ml-2 text-textSec hover:text-textMain">
            <ArrowLeft size={24} />
          </button>
          <Title className="!text-2xl !mb-0">Histórico de Treinos</Title>
        </div>

        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80 mt-20">
            <div className="w-20 h-20 bg-surfaceHighlight rounded-full flex items-center justify-center mb-4">
              <List size={32} className="text-textSec" />
            </div>
            <p className="text-textSec text-lg">Nenhum treino completado ainda</p>
            <p className="text-textSec/60 text-sm mt-2">Complete seu primeiro treino para ver o histórico</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Card className="bg-accent/10 border-accent/20 text-center">
                <div className="text-2xl font-bold text-accent">{history.length}</div>
                <div className="text-xs text-textSec mt-1">Treinos</div>
              </Card>
              <Card className="bg-accent/10 border-accent/20 text-center">
                <div className="text-2xl font-bold text-accent">{stats?.cycle_count || 0}</div>
                <div className="text-xs text-textSec mt-1">Ciclos</div>
              </Card>
              <Card className="bg-accent/10 border-accent/20 text-center">
                <div className="text-2xl font-bold text-accent">
                  {Math.round(history.reduce((acc, h) => acc + h.duration_seconds, 0) / 60)}
                </div>
                <div className="text-xs text-textSec mt-1">Min Total</div>
              </Card>
            </div>

            {/* History List */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-textSec uppercase tracking-wider">
                Últimos Treinos
              </label>
              {history.slice().reverse().map((item) => {
                const date = new Date(item.completed_at);
                const duration = Math.floor(item.duration_seconds / 60);

                return (
                  <Card key={item.id} className="bg-surfaceHighlight/20">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-textMain">{item.workout_title}</h3>
                        <p className="text-xs text-textSec mt-1">
                          {date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })} às {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-semibold text-accent">{duration} min</div>
                        <div className="text-xs text-textSec mt-1">
                          {item.exercises_completed} exercícios
                        </div>
                      </div>
                    </div>

                    {/* Exercise Details */}
                    <div className="mt-3 pt-3 border-t border-border/50 space-y-1">
                      {item.exercise_data.slice(0, 3).map((ex, idx) => (
                        <div key={idx} className="text-xs text-textSec flex justify-between">
                          <span className="truncate">{ex.name}</span>
                          <span className="ml-2 text-textSec/60">{ex.sets} × {ex.reps}</span>
                        </div>
                      ))}
                      {item.exercise_data.length > 3 && (
                        <div className="text-xs text-textSec/60 italic">
                          +{item.exercise_data.length - 3} mais...
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    );
  }

  // SETTINGS VIEW
  if (view === AppView.SETTINGS) {
    return (
      <Container className="animate-fade-in pt-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setView(AppView.HOME)} className="p-2 -ml-2 text-textSec hover:text-textMain">
            <ArrowLeft size={24} />
          </button>
          <Title className="!text-2xl !mb-0">Gerenciar Dados</Title>
        </div>

        <div className="space-y-6">
          <Card className="bg-surfaceHighlight/10 border-accent/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-accent/10 text-accent">
                <Settings size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-textMain">Recomeçar Ciclos</h3>
                <p className="text-textSec text-sm mt-1">
                  Isso irá zerar seu histórico de treinos e contagem de ciclos.
                  <strong className="block mt-1 text-accent">Seus exercícios e treinos montados SERÃO MANTIDOS.</strong>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="mt-6 text-textMain hover:bg-accent/10 hover:text-accent w-full border border-border"
              onClick={handleResetData}
            >
              <Trash2 size={18} /> Resetar Histórico e Ciclos
            </Button>
          </Card>
        </div>

        <div className="mt-auto py-8 text-center">
          <p className="text-textSec text-xs">Meus Treinos v2.1</p>
          <p className="text-textSec text-[10px] mt-1 opacity-50">Supabase + Next.js</p>
        </div>
      </Container>
    );
  }

  // MANUAL CREATION / EDIT VIEW
  if (view === AppView.MANUAL_CREATION) {
    return (
      <Container className="animate-fade-in pb-24">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => {
            setView(AppView.HOME);
            setEditingId(null);
            setManualExercises([]);
            setManualTitle('');
          }} className="p-2 -ml-2 text-textSec hover:text-textMain">
            <ArrowLeft size={24} />
          </button>
          <Title className="!text-2xl !mb-0">{editingId ? 'Editar Treino' : 'Novo Treino'}</Title>
        </div>

        <div className="space-y-6">
          <Input
            label="Nome do Treino"
            placeholder="Ex: Treino A - Peito"
            value={manualTitle}
            onChange={(e) => setManualTitle(e.target.value)}
          />

          {/* Add New Exercise Form */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-medium text-textMain flex items-center gap-2">
              <Plus size={18} className="text-accent" /> {editingId ? 'Adicionar/Editar Itens' : 'Adicionar Exercício'}
            </h3>
            <Input
              placeholder="Nome (ex: Supino)"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
            />
            <div className="grid grid-cols-3 gap-3">
              <Input
                placeholder="Séries"
                type="number"
                value={newExercise.sets}
                onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
              />
              <Input
                placeholder="Reps"
                value={newExercise.reps}
                onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
              />
              <Input
                placeholder="Kg/Obs"
                value={newExercise.weight}
                onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
              />
            </div>
            <Button variant="secondary" onClick={handleAddManualExercise} disabled={!newExercise.name}>
              Inserir
            </Button>
          </div>

          {/* List of added exercises */}
          {manualExercises.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-textSec uppercase tracking-wider">
                Resumo ({manualExercises.length})
              </label>
              {manualExercises.map((ex, index) => (
                <div
                  key={ex.id}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`transition-all duration-200 ${draggedIndexState === index ? 'opacity-40 scale-[0.98]' : 'opacity-100'}`}
                >
                  <Card className={`
                    flex justify-between items-center py-3 px-4 bg-surfaceHighlight/20 
                    border-l-4 border-l-transparent cursor-move
                    ${draggedIndexState === null ? 'hover:border-l-accent' : ''}
                    ${draggedIndexState === index ? 'border border-dashed border-textSec' : ''}
                  `}>
                    <div className="flex items-center gap-3 overflow-hidden pointer-events-none">
                      <GripVertical size={20} className="text-textSec/20 flex-shrink-0 hidden sm:block hover:text-accent" />

                      <div className="flex flex-col gap-1 sm:hidden pointer-events-auto">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveExercise(index, 'up'); }}
                          disabled={index === 0}
                          className="text-textSec disabled:opacity-20 hover:text-accent p-1"
                        >
                          <ChevronUp size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveExercise(index, 'down'); }}
                          disabled={index === manualExercises.length - 1}
                          className="text-textSec disabled:opacity-20 hover:text-accent p-1"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>

                      <div className="min-w-0">
                        <div className="font-semibold text-textMain truncate">{ex.name}</div>
                        <div className="text-xs text-textSec truncate">{ex.sets} x {ex.reps} • {ex.weight_hint}</div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveManualExercise(ex.id);
                      }}
                      className="text-textSec hover:text-error transition-colors p-2 shrink-0 ml-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Card>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Action */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-20">
          <Button onClick={saveManualWorkout} disabled={!manualTitle || manualExercises.length === 0}>
            <Save size={18} /> {editingId ? 'Atualizar Treino' : 'Salvar Treino'}
          </Button>
        </div>
      </Container>
    );
  }

  // ACTIVE WORKOUT VIEW
  if (view === AppView.WORKOUT_ACTIVE && currentPlan) {
    const completedCount = (currentPlan.exercises || []).filter(e => e.completed).length;
    const progress = currentPlan.exercises && currentPlan.exercises.length > 0
      ? (completedCount / currentPlan.exercises.length) * 100
      : 0;

    return (
      <div className="bg-background min-h-screen pb-24 relative animate-fade-in">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border px-6 py-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <button onClick={() => setView(AppView.HOME)} className="p-2 -ml-2 text-textSec hover:text-textMain">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-textMain">{currentPlan.title}</h2>
                <p className="text-textSec text-xs">Toque na carga para editar</p>
              </div>
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
          {(currentPlan.exercises || []).map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onToggle={toggleExercise}
              onWeightChange={updateActiveExerciseWeight}
            />
          ))}
        </div>

        {/* Footer Action - Sticky */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-20">
          <Button
            onClick={finishWorkout}
            variant="primary"
            disabled={completedCount !== (currentPlan.exercises || []).length}
          >
            Finalizar Treino {completedCount === (currentPlan.exercises || []).length ? '✓' : `(${completedCount}/${(currentPlan.exercises || []).length})`}
          </Button>
        </div>
      </div>
    );
  }

  // HOME View
  return (
    <Container className="justify-start pt-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title className="!text-2xl">Meus Treinos</Title>
          <Subtitle>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</Subtitle>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setView(AppView.HISTORY)}
            className="flex flex-col items-end mr-1 hover:opacity-80 transition-opacity cursor-pointer"
            title="Ver Histórico"
          >
            <span className="text-[10px] text-textSec font-bold uppercase tracking-widest">Ciclos</span>
            <span className="text-xl font-bold text-accent leading-none">{stats?.cycle_count || 0}</span>
          </button>
          <button
            onClick={() => setView(AppView.SETTINGS)}
            className="w-10 h-10 rounded-full bg-surfaceHighlight flex items-center justify-center text-textSec hover:text-textMain hover:bg-surfaceHighlight/80 transition-all shadow-sm"
            title="Configurações e Backup"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-10 h-10 rounded-full bg-surfaceHighlight flex items-center justify-center text-textSec hover:text-error hover:bg-error/10 transition-all shadow-sm"
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {savedWorkouts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80 mt-10">
          <div className="w-20 h-20 bg-surfaceHighlight rounded-full flex items-center justify-center mb-4">
            <List size={32} className="text-textSec" />
          </div>
          <h3 className="text-xl font-semibold text-textMain mb-2">Nenhum treino salvo</h3>
          <p className="text-textSec text-sm max-w-[200px] mb-8">Crie sua rotina personalizada para começar a monitorar.</p>
          <Button onClick={() => setView(AppView.MANUAL_CREATION)}>
            Criar Primeiro Treino
          </Button>
        </div>
      ) : (
        <div className="space-y-8 animate-slide-up">
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <h3 className="text-xs font-bold text-textSec uppercase tracking-wider">TREINO DE HOJE</h3>
              </div>
              <button
                onClick={(e) => startEditing(savedWorkouts[0], e)}
                className="text-textSec hover:text-textMain transition-colors"
                title="Editar Treino"
              >
                <Edit2 size={16} />
              </button>
            </div>

            <Card className="border-accent/30 bg-gradient-to-br from-surface to-surfaceHighlight relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-textMain mb-1">{savedWorkouts[0].title}</h2>
                <p className="text-textSec text-sm mb-6">{savedWorkouts[0].description}</p>

                <Button onClick={() => startWorkout(savedWorkouts[0])}>
                  Iniciar Treino <Play size={16} className="ml-1" fill="currentColor" />
                </Button>
              </div>
              <Dumbbell className="absolute -bottom-4 -right-4 text-white/5 w-32 h-32 rotate-[-15deg]" />
            </Card>
          </section>

          {savedWorkouts.length > 1 && (
            <section>
              <h3 className="text-xs font-bold text-textSec uppercase tracking-wider mb-3">Próximos Treinos</h3>
              <div className="space-y-3">
                {savedWorkouts.slice(1).map((workout) => (
                  <Card key={workout.id} className="flex justify-between items-center py-4 hover:border-textSec/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-surfaceHighlight flex items-center justify-center text-textSec font-semibold text-sm">
                        {workout.title.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-textMain">{workout.title}</h4>
                        <p className="text-xs text-textSec">{workout.exercises?.length || 0} exercícios</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => startEditing(workout, e)}
                        className="text-textSec hover:text-textMain p-2"
                        title="Editar Treino"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => deleteWorkout(workout.id, e)}
                        className="text-textSec hover:text-error p-2"
                        title="Excluir Treino"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <div className="pt-4">
            <Button variant="outline" onClick={() => setView(AppView.MANUAL_CREATION)}>
              <Plus size={18} /> Criar Novo Treino
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
