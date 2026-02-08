export interface Exercise {
  id: string;
  workout_id?: string;
  name: string;
  sets: number;
  reps: string; // "8-12", "até falha", etc
  weight_hint: string; // "30% carga", "100% carga", etc
  notes?: string; // Drop set, cluster set, etc
  position: number;
  completed?: boolean; // Client-side only
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  day_of_week: number; // 1=Segunda, 2=Terça, etc
  position: number;
  exercises?: Exercise[];
  created_at?: string;
}

export interface WorkoutHistory {
  id: string;
  workout_id: string;
  workout_title: string;
  completed_at: string;
  duration_seconds: number;
  exercises_completed: number;
  total_sets: number;
  exercise_data: Exercise[];
}

export interface UserStats {
  id: string;
  cycle_count: number;
  cycle_progress: number;
  updated_at: string;
}

export interface WorkoutStats {
  totalExercises: number;
  completedExercises: number;
  totalSets: number;
  duration: string;
}

export enum AppView {
  HOME = 'HOME',
  MANUAL_CREATION = 'MANUAL_CREATION',
  WORKOUT_ACTIVE = 'WORKOUT_ACTIVE',
  SUMMARY = 'SUMMARY',
  SETTINGS = 'SETTINGS',
  HISTORY = 'HISTORY',
}
