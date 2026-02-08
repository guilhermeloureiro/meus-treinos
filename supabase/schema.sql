-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workouts table
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  day_of_week INTEGER NOT NULL, -- 1=Segunda, 2=Terça, etc
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES workouts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL,
  weight_hint TEXT NOT NULL,
  notes TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workout history table
CREATE TABLE workout_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID REFERENCES workouts(id),
  workout_title TEXT NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  duration_seconds INTEGER NOT NULL,
  exercises_completed INTEGER NOT NULL,
  total_sets INTEGER NOT NULL,
  exercise_data JSONB NOT NULL
);

-- User stats table (single row for now, no auth)
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle_count INTEGER DEFAULT 0,
  cycle_progress INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert initial stats row
INSERT INTO user_stats (cycle_count, cycle_progress) VALUES (0, 0);

-- Create indexes for better performance
CREATE INDEX idx_exercises_workout_id ON exercises(workout_id);
CREATE INDEX idx_exercises_position ON exercises(position);
CREATE INDEX idx_workouts_position ON workouts(position);
CREATE INDEX idx_workout_history_completed_at ON workout_history(completed_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies (public access for now, no auth)
CREATE POLICY "Enable read access for all users" ON workouts FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON workouts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON workouts FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON workouts FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON exercises FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON exercises FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON exercises FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON exercises FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON workout_history FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON workout_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON workout_history FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON workout_history FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON user_stats FOR SELECT USING (true);
CREATE POLICY "Enable update access for all users" ON user_stats FOR UPDATE USING (true);
