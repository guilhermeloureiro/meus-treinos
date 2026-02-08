// Authentication utilities
import { supabase } from './supabase';

const AUTH_TOKEN_KEY = 'meus_treinos_auth';
const REMEMBER_ME_KEY = 'meus_treinos_remember';

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY);

    // If remember me is enabled, keep session
    if (rememberMe === 'true' && token) {
        return true;
    }

    // Otherwise, check session storage
    return sessionStorage.getItem(AUTH_TOKEN_KEY) === 'true';
}

/**
 * Validate password against stored hash
 */
export async function validatePassword(password: string): Promise<boolean> {
    try {
        // Simple comparison (replace with db check in production)
        const isValid = password === 'vivinte9'; // Default password

        return isValid;
    } catch (error) {
        console.error('Error validating password:', error);
        return false;
    }
}

/**
 * Login user
 */
export function login(rememberMe: boolean = false): void {
    if (typeof window === 'undefined') return;

    if (rememberMe) {
        localStorage.setItem(AUTH_TOKEN_KEY, 'true');
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
    } else {
        sessionStorage.setItem(AUTH_TOKEN_KEY, 'true');
        localStorage.removeItem(REMEMBER_ME_KEY);
    }
}

/**
 * Logout user
 */
export function logout(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Get signed URL for video
 */
export async function getVideoUrl(filename: string): Promise<string | null> {
    try {
        const { data, error } = await supabase
            .storage
            .from('exercise-videos')
            .createSignedUrl(filename, 3600); // Valid for 1 hour

        if (error) {
            console.error('Error getting video URL:', error);
            return null;
        }

        return data.signedUrl;
    } catch (error) {
        console.error('Error getting video URL:', error);
        return null;
    }
}
