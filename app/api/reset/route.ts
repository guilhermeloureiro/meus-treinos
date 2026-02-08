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

        return NextResponse.json({ success: true, message: 'Data reset successfully' });
    } catch (error) {
        console.error('Error resetting data:', error);
        return NextResponse.json({ error: 'Failed to reset data' }, { status: 500 });
    }
}
