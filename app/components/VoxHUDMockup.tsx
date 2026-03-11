'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Zap, MessageCircle, Code2 } from 'lucide-react';

const MODES = [
    { text: 'Texto', icon: Zap },
    { text: 'Chat', icon: MessageCircle },
    { text: 'Code', icon: Code2 },
];

interface VoxHUDMockupProps {
    forcedState?: 'idle' | 'listening' | 'processing';
    forcedModeIndex?: number;
}

export default function VoxHUDMockup({ forcedState, forcedModeIndex }: VoxHUDMockupProps = {}) {
    const [normalizedVolume, setNormalizedVolume] = useState<number>(0);
    const [internalHudState, setInternalHudState] = useState<'idle' | 'listening' | 'processing'>('listening');
    const [internalModeIndex, setInternalModeIndex] = useState(0);
    const [dotCount, setDotCount] = useState(0);

    const hudState = forcedState ?? internalHudState;
    const modeIndex = forcedModeIndex ?? internalModeIndex;

    const multipliers = [0.4, 0.8, 0.3, 1.0, 0.6, 0.9, 0.5];

    // Internal State Machine (only used if not externally controlled)
    useEffect(() => {
        if (forcedState) return;
        let timeout: NodeJS.Timeout;
        if (internalHudState === 'listening') {
            timeout = setTimeout(() => {
                setInternalHudState('processing');
                setNormalizedVolume(0);
            }, 3000);
        } else if (internalHudState === 'processing') {
            timeout = setTimeout(() => {
                setInternalHudState('idle');
            }, 2000);
        } else {
            timeout = setTimeout(() => {
                setInternalModeIndex((prev) => (prev + 1) % MODES.length);
                setInternalHudState('listening');
            }, 2000);
        }
        return () => clearTimeout(timeout);
    }, [internalHudState, forcedState]);

    // Animate Volume Waves (only when listening)
    useEffect(() => {
        if (hudState !== 'listening') {
            setNormalizedVolume(0); // flatline outside of listening
            return;
        }

        let animationFrame: number;
        let lastTime = 0;

        const animateWaves = (time: number) => {
            if (time - lastTime > 150) {
                setNormalizedVolume(Math.random());
                lastTime = time;
            }
            animationFrame = requestAnimationFrame(animateWaves);
        };

        animationFrame = requestAnimationFrame(animateWaves);
        return () => cancelAnimationFrame(animationFrame);
    }, [hudState]);

    // Processing dots animation
    useEffect(() => {
        if (hudState !== 'processing') return;
        const interval = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4);
        }, 500);
        return () => clearInterval(interval);
    }, [hudState]);

    const CurrentIcon = MODES[modeIndex].icon;

    return (
        <div className="inline-flex items-center gap-[12px] bg-black rounded-full border border-[#D4AF37]/30 p-[8px] shadow-[0_4px_15px_rgba(212,175,55,0.08)]">
            {/* Esquerda: Mic/Spinner + Ondas */}
            <div className="flex items-center gap-[8px]">
                {hudState === 'processing' ? (
                    <div className="flex items-center justify-center w-[28px] h-[28px] shrink-0">
                        <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-[14px] h-[14px] flex items-center justify-center"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="7" cy="7" r="6" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="7" />
                            </svg>
                        </motion.div>
                    </div>
                ) : (
                    <div className="flex items-center gap-[8px]">
                        <div className="w-[28px] h-[28px] rounded-full bg-black flex items-center justify-center shrink-0 border border-[#D4AF37]/40 relative">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2h2v2a5 5 0 0 0 10 0v-2h2z" />
                                <path d="M11 20v2h2v-2h-2z" />
                                <path d="M8 22h8v2H8v-2z" />
                            </svg>
                        </div>

                        <div className="flex items-center gap-[2.5px] h-[20px]">
                            {multipliers.map((mult, i) => {
                                const targetHeight = 4 + (normalizedVolume * mult * 16);
                                return (
                                    <motion.div
                                        key={i}
                                        className="w-[3px] rounded-full bg-gradient-to-b from-[#FFF9E6] to-[#D4AF37]"
                                        animate={{ height: hudState === 'listening' ? targetHeight : 4 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <div className="w-[1px] h-[20px] bg-[#D4AF37]/20 shrink-0" />

            {/* Centro: Texto */}
            <div className={`flex items-center justify-start overflow-hidden transition-all duration-300 ${hudState === 'processing' ? 'w-auto' : 'w-[55px]'}`}>
                <AnimatePresence mode="wait">
                    {hudState === 'processing' ? (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-baseline gap-1.5 whitespace-nowrap"
                        >
                            <span className="text-[#D4AF37] text-[13px] font-medium leading-none">VoxAigo</span>
                            <span className="text-gray-400 italic text-[12px] font-normal leading-none" style={{ position: 'relative', top: '0.5px' }}>
                                processando{'.'.repeat(dotCount)}
                            </span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle_listen"
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-1.5 whitespace-nowrap"
                        >
                            <span className="text-[#D4AF37] font-medium text-[13px] leading-none">
                                VoxAigo
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Direita: Botões */}
            {hudState !== 'processing' && (
                <div className="flex items-center gap-[6px] shrink-0">
                    <div className="bg-[#14120B] border border-[#D4AF37]/20 rounded-full px-[10px] py-[6px] flex items-center justify-center">
                        <span className="text-[10px] font-semibold text-[#D4AF37] leading-[1]">PT</span>
                    </div>

                    <div className="bg-[#14120B] border border-[#D4AF37]/20 rounded-full px-[10px] py-[6px] flex items-center justify-center overflow-hidden relative min-w-[65px]">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={modeIndex}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="flex items-center justify-center gap-[4px] absolute inset-0"
                            >
                                <CurrentIcon
                                    className="w-[10px] h-[10px] text-[#D4AF37]"
                                    fill={MODES[modeIndex].text === 'Texto' || MODES[modeIndex].text === 'Chat' ? "currentColor" : "none"}
                                    strokeWidth={MODES[modeIndex].text === 'Texto' || MODES[modeIndex].text === 'Chat' ? 0 : 2}
                                />
                                <span className="text-[10px] font-semibold text-[#D4AF37] leading-[1]">{MODES[modeIndex].text}</span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
