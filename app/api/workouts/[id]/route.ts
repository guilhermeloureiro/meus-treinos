import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const body = await request.json();
        const { title, description, exercises } = body;
        const workoutId = params.id;

        // Update workout
        const { error: workoutError } = await supabase
            .from('workouts')
            .update({ title, description })
            .eq('id', workoutId);

        if (workoutError) throw workoutError;

        // Delete existing exercises
        const { error: deleteError } = await supabase
            .from('exercises')
            .delete()
            .eq('workout_id', workoutId);

        if (deleteError) throw deleteError;

        // Insert new exercises
        if (exercises && exercises.length > 0) {
            const exercisesToInsert = exercises.map((ex: any, index: number) => ({
                workout_id: workoutId,
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

        // Fetch updated workout
        const { data: updatedWorkout } = await supabase
            .from('workouts')
            .select('*, exercises(*)')
            .eq('id', workoutId)
            .single();

        return NextResponse.json(updatedWorkout);
    } catch (error) {
        console.error('Error updating workout:', error);
        return NextResponse.json({ error: 'Failed to update workout' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const workoutId = params.id;

        // Delete workout (exercises will be deleted automatically via CASCADE)
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', workoutId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting workout:', error);
        return NextResponse.json({ error: 'Failed to delete workout' }, { status: 500 });
    }
}
