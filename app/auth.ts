'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const password = formData.get('password') as string;

    // Simple password check (Env var or Hardcoded)
    const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD || 'sushi2025';

    if (password === CORRECT_PASSWORD) {
        // Set cookie manually
        (await cookies()).set('admin_session', 'authenticated', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });
        redirect('/admin');
    } else {
        return { error: 'Senha incorreta' };
    }
}

export async function logout() {
    (await cookies()).delete('admin_session');
    redirect('/login');
}
