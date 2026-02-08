'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validatePassword, login } from '@/lib/auth';
import { Container, Title, Input, Button } from '@/components/UI';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const isValid = await validatePassword(password);

            if (isValid) {
                login(rememberMe);
                router.push('/');
                router.refresh();
            } else {
                setError('Senha incorreta. Tente novamente.');
                setPassword('');
            }
        } catch (err) {
            setError('Erro ao validar senha. Tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Container className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock size={40} className="text-accent" />
                    </div>
                    <Title className="!text-3xl !mb-2">Meus Treinos</Title>
                    <p className="text-textSec">Digite sua senha para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="pr-12"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-textSec hover:text-textMain transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-error/10 border border-error/20 rounded-lg p-3 text-sm text-error">
                            {error}
                        </div>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-5 h-5 rounded border-2 border-border bg-surface checked:bg-accent checked:border-accent transition-all cursor-pointer"
                        />
                        <span className="text-textMain text-sm">Lembrar de mim</span>
                    </label>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!password || loading}
                    >
                        {loading ? 'Validando...' : 'Entrar'}
                    </Button>
                </form>


            </Container>
        </div>
    );
}
