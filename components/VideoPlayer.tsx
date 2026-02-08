import React, { useState, useEffect } from 'react';
import { X, Play, Loader2, RefreshCw } from 'lucide-react';
import { getVideoUrl } from '@/lib/auth';

interface VideoPlayerProps {
    videoFilename: string;
    videoTitle: string;
    onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoFilename, videoTitle, onClose }) => {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchUrl = async () => {
            setLoading(true);
            setError(false);
            try {
                const url = await getVideoUrl(videoFilename);
                if (isMounted) {
                    if (url) {
                        setVideoUrl(url);
                    } else {
                        setError(true);
                    }
                }
            } catch (err) {
                console.error("Error fetching video URL", err);
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (videoFilename) {
            fetchUrl();
        }

        return () => {
            isMounted = false;
        };
    }, [videoFilename]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 bg-gradient-to-b from-black/80 to-transparent">
                    <h3 className="text-white font-medium drop-shadow-md text-lg px-2">{videoTitle}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-black/40 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Video Content */}
                <div className="aspect-video w-full bg-neutral-900 flex items-center justify-center relative">
                    {loading && (
                        <div className="flex flex-col items-center gap-3 text-white/50">
                            <Loader2 size={48} className="animate-spin text-accent" />
                            <p className="text-sm">Carregando vídeo...</p>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="flex flex-col items-center gap-4 text-white/50 p-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                <Play size={32} className="opacity-20" />
                            </div>
                            <div>
                                <p className="text-white font-medium mb-1">Vídeo indisponível</p>
                                <p className="text-sm max-w-xs">Não foi possível carregar o vídeo. Verifique sua conexão ou tente novamente mais tarde.</p>
                            </div>
                            <button
                                onClick={() => setVideoUrl(null)} // Trigger refetch if logic changed or just close
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors flex items-center gap-2"
                            >
                                <RefreshCw size={14} /> Tentar novamente
                            </button>
                        </div>
                    )}

                    {videoUrl && !loading && (
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
