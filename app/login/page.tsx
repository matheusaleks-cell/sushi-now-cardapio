'use client';

import { useState } from 'react';
import { login } from '@/app/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');

        const result = await login(formData); // Server Action

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // Redirect happens on server if success
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold mb-2">
                        SN
                    </div>
                    <CardTitle className="text-xl">Área Administrativa</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Senha de Acesso</label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                className="text-center tracking-widest"
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 font-medium text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                            {loading ? 'Entrando...' : 'Acessar Admin'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t pt-4">
                    <Button variant="link" size="sm" asChild className="text-gray-500">
                        <Link href="/">Voltar para a Loja</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
