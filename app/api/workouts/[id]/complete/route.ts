import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const body = await request.json();
        const {
            workout_title,
            duration_seconds,
            exercises_completed,
            total_sets,
            exercise_data
        } = body;
        const workoutId = params.id;

        // Save to history
        const { error: historyError } = await supabase
            .from('workout_history')
            .insert({
                workout_id: workoutId,
                workout_title,
                duration_seconds,
                exercises_completed,
                total_sets,
                exercise_data,
            });

        if (historyError) throw historyError;

        // Get current stats
        const { data: stats, error: statsError } = await supabase
            .from('user_stats')
            .select('*')
            .limit(1)
            .single();

        if (statsError) throw statsError;

        // Get total number of workouts to calculate cycle
        const { data: workouts } = await supabase
            .from('workouts')
            .select('id');

        const totalWorkouts = workouts?.length || 5;
        const nextProgress = (stats.cycle_progress + 1) % totalWorkouts;
        const newCycleCount = nextProgress === 0 ? stats.cycle_count + 1 : stats.cycle_count;

        // Update stats
        const { error: updateStatsError } = await supabase
            .from('user_stats')
            .update({
                cycle_count: newCycleCount,
                cycle_progress: nextProgress,
                updated_at: new Date().toISOString(),
            })
            .eq('id', stats.id);

        if (updateStatsError) throw updateStatsError;

        // Rotate workouts - move first to last
        const { data: allWorkouts } = await supabase
            .from('workouts')
            .select('id, position')
            .order('position', { ascending: true });

        if (allWorkouts && allWorkouts.length > 0) {
            const firstWorkout = allWorkouts[0];

            // Only rotate if the completed workout is the first one
            if (firstWorkout.id === workoutId) {
                // Update positions
                for (let i = 0; i < allWorkouts.length; i++) {
                    const newPosition = i === 0 ? allWorkouts.length - 1 : i - 1;
                    await supabase
                        .from('workouts')
                        .update({ position: newPosition })
                        .eq('id', allWorkouts[i].id);
                }
            }
        }

        return NextResponse.json({
            success: true,
            cycle_count: newCycleCount,
            cycle_progress: nextProgress
        });
    } catch (error) {
        console.error('Error completing workout:', error);
        return NextResponse.json({ error: 'Failed to complete workout' }, { status: 500 });
    }
}
