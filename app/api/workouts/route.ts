import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Get all workouts with their exercises, ordered by position
        const { data: workouts, error: workoutsError } = await supabase
            .from('workouts')
            .select('*')
            .order('position', { ascending: true });

        if (workoutsError) throw workoutsError;

        // Get exercises for each workout
        const workoutsWithExercises = await Promise.all(
            (workouts || []).map(async (workout) => {
                const { data: exercises, error: exercisesError } = await supabase
                    .from('exercises')
                    .select('*')
                    .eq('workout_id', workout.id)
                    .order('position', { ascending: true });

                if (exercisesError) throw exercisesError;

                return {
                    ...workout,
                    exercises: exercises || [],
                };
            })
        );

        return NextResponse.json(workoutsWithExercises);
    } catch (error) {
        console.error('Error fetching workouts:', error);
        return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, day_of_week, exercises } = body;

        // Get the highest position to add new workout at the end
        const { data: maxPositionData } = await supabase
            .from('workouts')
            .select('position')
            .order('position', { ascending: false })
            .limit(1);

        const newPosition = maxPositionData && maxPositionData.length > 0
            ? maxPositionData[0].position + 1
            : 1;

        // Insert workout
        const { data: workout, error: workoutError } = await supabase
            .from('workouts')
            .insert({
                title,
                description,
                day_of_week: day_of_week || 0,
                position: newPosition,
            })
            .select()
            .single();

        if (workoutError) throw workoutError;

        // Insert exercises
        if (exercises && exercises.length > 0) {
            const exercisesToInsert = exercises.map((ex: any, index: number) => ({
                workout_id: workout.id,
                name: ex.name,
                sets: ex.sets,
                reps: ex.reps,
                weight_hint: ex.weight_hint || ex.weightHint || 'Livre',
                notes: ex.notes || '',
                position: index,
            }));

            const { error: exercisesError } = await supabase
                .from('exercises')
                .insert(exercisesToInsert);

            if (exercisesError) throw exercisesError;
        }

        // Fetch the complete workout with exercises
        const { data: completeWorkout } = await supabase
            .from('workouts')
            .select('*, exercises(*)')
            .eq('id', workout.id)
            .single();

        return NextResponse.json(completeWorkout);
    } catch (error) {
        console.error('Error creating workout:', error);
        return NextResponse.json({ error: 'Failed to create workout' }, { status: 500 });
    }
}
