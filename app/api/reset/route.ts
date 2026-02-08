import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
    try {
        // 1. Delete all history
        const { error: historyError } = await supabase
            .from('workout_history')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows (hacky way to delete all without WHERE clause restrictions if any)

        if (historyError) throw historyError;

        // 2. Reset user stats (cycles)
        // We update the existing row(s) to 0
        const { error: statsError } = await supabase
            .from('user_stats')
            .update({ cycle_count: 0, cycle_progress: 0 })
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (statsError) throw statsError;

        // 3. Reset workout order (by title)
        const { data: workouts, error: workoutsError } = await supabase
            .from('workouts')
            .select('id, title')
            .order('title', { ascending: true }); // Get them in "correct" order: A, B, C or 1, 2, 3

        if (workoutsError) throw workoutsError;

        if (workouts && workouts.length > 0) {
            // Update positions to match the alphabetical/numerical order
            for (let i = 0; i < workouts.length; i++) {
                await supabase
                    .from('workouts')
                    .update({ position: i }) // Reset position: 0, 1, 2...
                    .eq('id', workouts[i].id);
            }
        }

        return NextResponse.json({ success: true, message: 'Data reset successfully' });
    } catch (error) {
        console.error('Error resetting data:', error);
        return NextResponse.json({ error: 'Failed to reset data' }, { status: 500 });
    }
}
