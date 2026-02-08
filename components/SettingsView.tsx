'use client';

import React from 'react';
import { ArrowLeft, Download, Upload, FileJson, AlertTriangle, Trash2 } from 'lucide-react';
import { Container, Title, Button, Card } from '@/components/UI';

interface SettingsViewProps {
    onBack: () => void;
    onExport: () => void;
    onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onReset: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

export function SettingsView({ onBack, onExport, onImport, onReset, fileInputRef }: SettingsViewProps) {
    return (
        <Container className="animate-fade-in pt-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 -ml-2 text-textSec hover:text-textMain">
                    <ArrowLeft size={24} />
                </button>
                <Title className="!text-2xl !mb-0">Gerenciar Dados</Title>
            </div>

            <div className="space-y-6">
                <Card className="bg-surfaceHighlight/10 border-accent/20">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-accent/10 text-accent">
                            <FileJson size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-textMain">Backup Local</h3>
                            <p className="text-textSec text-sm mt-1">
                                Baixe um arquivo com todos os seus treinos e histórico para não perder nada.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <Button variant="secondary" onClick={onExport}>
                            <Download size={18} /> Exportar
                        </Button>
                        <div className="relative">
                            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                                <Upload size={18} /> Importar
                            </Button>
                            <input
                                type="file"
                                accept=".json"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={onImport}
                            />
                        </div>
                    </div>
                </Card>

                <Card className="bg-error/5 border-error/20 mt-8">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full bg-error/10 text-error">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-textMain">Zona de Perigo</h3>
                            <p className="text-textSec text-sm mt-1">
                                Apagar todos os dados do aplicativo. Esta ação não pode ser desfeita.
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" className="mt-4 text-error hover:bg-error/10 hover:text-error w-full" onClick={onReset}>
                        <Trash2 size={18} /> Resetar Aplicativo
                    </Button>
                </Card>
            </div>

            <div className="mt-auto py-8 text-center">
                <p className="text-textSec text-xs">Meus Treinos v2.0</p>
                <p className="text-textSec text-[10px] mt-1 opacity-50">Supabase + Next.js</p>
            </div>
        </Container>
    );
}
