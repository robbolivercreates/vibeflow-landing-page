'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowLeft } from 'lucide-react';
import { createClient } from '../../lib/supabase';

// ── Disposable / throwaway email domains blocklist ──
const DISPOSABLE_DOMAINS = new Set([
    'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com',
    'grr.la', 'guerrillamailblock.com', 'tempmail.com', 'throwaway.email',
    'temp-mail.org', 'dispostable.com', 'yopmail.com', 'fakeinbox.com',
    'trashmail.com', 'trashmail.me', 'trashmail.net', 'maildrop.cc',
    'harakirimail.com', 'getnada.com', 'mailnesia.com', 'tempr.email',
    'mohmal.com', '10minutemail.com', 'minutemail.com', 'tempail.com',
    'mailcatch.com', 'meltmail.com', 'spamgourmet.com', 'mytrashmail.com',
    'mailexpire.com', 'jetable.org', 'einrot.com', 'short.io',
    'discard.email', 'mailnull.com', 'spamfree24.org', 'binkmail.com',
    'safetymail.info', 'filzmail.com', 'lackmail.net', 'devnullmail.com',
    'rmqkr.net', 'emailondeck.com', 'tempomail.fr', 'burnermail.io',
]);

// ── Trusted email domain suggestions ──
const EMAIL_DOMAINS = [
    'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com',
    'live.com', 'protonmail.com', 'zoho.com', 'aol.com', 'mail.com',
];

interface WaitlistOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WaitlistOverlay({ isOpen, onClose }: WaitlistOverlayProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [osPreference, setOsPreference] = useState<'mac' | 'windows' | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState(-1);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setOsPreference(null);
            setName('');
            setEmail('');
            setStatus('idle');
            setErrorMessage('');
            setNameError('');
            setEmailError('');
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [isOpen]);

    // ── Name validation ──
    const validateName = (value: string): boolean => {
        const trimmed = value.trim();
        if (trimmed.length < 2) {
            setNameError('O nome precisa ter pelo menos 2 caracteres.');
            return false;
        }
        if (/\d/.test(trimmed)) {
            setNameError('O nome não pode conter números.');
            return false;
        }
        if (/[^a-zA-ZÀ-ÿ\s'-]/.test(trimmed)) {
            setNameError('O nome não pode conter caracteres especiais.');
            return false;
        }
        setNameError('');
        return true;
    };

    // ── Email domain suggestion engine ──
    const handleEmailChange = (value: string) => {
        setEmail(value);
        setEmailError('');
        setActiveSuggestion(-1);

        if (value.includes('@')) {
            const [localPart, domainPart] = value.split('@');
            if (localPart && domainPart !== undefined) {
                if (domainPart === '') {
                    // User just typed '@', show all suggestions
                    setSuggestions(EMAIL_DOMAINS.map(d => `${localPart}@${d}`));
                    setShowSuggestions(true);
                } else {
                    // User is typing the domain, filter suggestions
                    const filtered = EMAIL_DOMAINS
                        .filter(d => d.startsWith(domainPart.toLowerCase()))
                        .map(d => `${localPart}@${d}`);
                    setSuggestions(filtered);
                    setShowSuggestions(filtered.length > 0 && !EMAIL_DOMAINS.includes(domainPart.toLowerCase()));
                }
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (suggestion: string) => {
        setEmail(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleEmailKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestion(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestion(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
        } else if (e.key === 'Enter' && activeSuggestion >= 0) {
            e.preventDefault();
            selectSuggestion(suggestions[activeSuggestion]);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        } else if (e.key === 'Tab' && suggestions.length > 0) {
            e.preventDefault();
            selectSuggestion(suggestions[activeSuggestion >= 0 ? activeSuggestion : 0]);
        }
    };

    // ── Email validation ──
    const validateEmail = (value: string): boolean => {
        const trimmed = value.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmed)) {
            setEmailError('Digite um e-mail válido.');
            return false;
        }

        const domain = trimmed.split('@')[1];

        if (DISPOSABLE_DOMAINS.has(domain)) {
            setEmailError('E-mails temporários não são aceitos. Use seu e-mail principal.');
            return false;
        }

        // Must have valid TLD (at least 2 chars)
        const tld = domain.split('.').pop();
        if (!tld || tld.length < 2) {
            setEmailError('O domínio do e-mail parece inválido.');
            return false;
        }

        setEmailError('');
        return true;
    };

    const handleOSSelect = (os: 'mac' | 'windows') => {
        setOsPreference(os);
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!osPreference) return;

        const isNameValid = validateName(name);
        const isEmailValid = validateEmail(email);

        if (!isNameValid || !isEmailValid) return;

        setStatus('loading');
        setErrorMessage('');

        const supabase = createClient();

        const { error } = await supabase
            .from('waitlist')
            .insert([{ name: name.trim(), email: email.trim().toLowerCase(), os_preference: osPreference }]);

        if (error) {
            if (error.code === '23505') {
                setStatus('success');
                return;
            }
            setStatus('error');
            setErrorMessage(error.message || 'Ocorreu um erro. Tente novamente.');
        } else {
            setStatus('success');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-[#0A0A0A]/90 border border-white/10 rounded-3xl p-8 overflow-hidden shadow-2xl"
                    >
                        {/* Apple style close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {step === 2 && status !== 'success' && (
                            <button
                                onClick={() => setStep(1)}
                                className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-10"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                        )}

                        <div className="text-center space-y-6">
                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="py-4 flex flex-col items-center justify-center space-y-5"
                                >
                                    <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-full flex items-center justify-center border border-[#D4AF37]/30 text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                                        <Check className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-2xl font-semibold tracking-tight text-white">Tudo certo, {name.trim().split(' ')[0]}!</h3>
                                    <p className="text-gray-400 text-sm max-w-[290px] mx-auto leading-relaxed">
                                        Você já faz parte dos primeiros que receberão acesso assim que o lançamento ocorrer. E o melhor: <span className="text-[#D4AF37] font-semibold">você poderá usar de graça.</span>
                                    </p>

                                    {/* Próximos Passos */}
                                    <div className="w-full pt-2 border-t border-white/5">
                                        <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-3 mt-4">Próximos passos</p>
                                        <p className="text-gray-400 text-sm max-w-[290px] mx-auto leading-relaxed mb-4">
                                            Siga o Rob nas redes sociais — ele vai anunciar o lançamento por lá. Você também receberá um e-mail quando seu acesso estiver pronto.
                                        </p>

                                        {/* Social Links - Primary CTA */}
                                        <div className="flex items-center justify-center gap-3">
                                            <a
                                                href="https://www.instagram.com/rob.boliver/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all transform hover:scale-105"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5 fill-current">
                                                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                                                </svg>
                                                <span className="text-sm font-semibold">Instagram</span>
                                            </a>
                                            <a
                                                href="https://www.youtube.com/@rob.boliver"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all transform hover:scale-105"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-5 h-5 fill-current">
                                                    <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" />
                                                </svg>
                                                <span className="text-sm font-semibold">YouTube</span>
                                            </a>
                                        </div>
                                    </div>

                                    <button
                                        onClick={onClose}
                                        className="mt-1 text-gray-500 hover:text-gray-300 text-xs font-medium transition-colors underline underline-offset-2"
                                    >
                                        Fechar
                                    </button>
                                </motion.div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    {step === 1 ? (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6 pt-4"
                                        >
                                            <div className="space-y-2">
                                                <div className="mx-auto w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                                    <img src="/logo.png" alt="VoxAIgo Logo" className="w-6 h-6 object-contain" />
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Onde você vai usar?</h3>
                                                <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] mx-auto">
                                                    Escolha seu computador principal para prepararmos o seu acesso.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <button
                                                    onClick={() => handleOSSelect('mac')}
                                                    className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all group flex flex-col items-center gap-4 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transform hover:-translate-y-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-12 h-12 fill-current group-hover:scale-110 transition-transform duration-300">
                                                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                                    </svg>
                                                    <span className="font-semibold text-gray-300 group-hover:text-white text-sm">Mac OS</span>
                                                </button>
                                                <button
                                                    onClick={() => handleOSSelect('windows')}
                                                    className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all group flex flex-col items-center gap-4 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transform hover:-translate-y-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-12 h-12 fill-current group-hover:scale-110 transition-transform duration-300">
                                                        <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
                                                    </svg>
                                                    <span className="font-semibold text-gray-300 group-hover:text-white text-sm">Windows PC</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="space-y-4 pt-4"
                                        >
                                            <div className="space-y-2 mb-6">
                                                <div className="mx-auto flex justify-center items-center mb-4 text-[#D4AF37]">
                                                    {osPreference === 'mac' ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-10 h-10 fill-current">
                                                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-10 h-10 fill-current">
                                                            <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <h3 className="text-2xl font-semibold tracking-tight text-white">Quase lá!</h3>
                                                <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] mx-auto">
                                                    Preencha seus dados para receber seu acesso antecipado gratuito.
                                                </p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                                <div className="space-y-3">
                                                    {/* ── Name Field ── */}
                                                    <div>
                                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 mb-1.5 block">Seu Nome</label>
                                                        <input
                                                            type="text"
                                                            value={name}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                // Allow only letters, spaces, hyphens, apostrophes
                                                                if (/^[a-zA-ZÀ-ÿ\s'-]*$/.test(val) || val === '') {
                                                                    setName(val);
                                                                    if (nameError) validateName(val);
                                                                }
                                                            }}
                                                            onBlur={() => { if (name) validateName(name); }}
                                                            placeholder="Seu nome completo"
                                                            required
                                                            disabled={status === 'loading'}
                                                            className={`w-full bg-black/50 border rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all text-sm disabled:opacity-50 font-medium ${nameError
                                                                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50'
                                                                : 'border-white/10 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/30'
                                                                }`}
                                                        />
                                                        <AnimatePresence>
                                                            {nameError && (
                                                                <motion.p
                                                                    initial={{ opacity: 0, y: -5, height: 0 }}
                                                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                                    exit={{ opacity: 0, y: -5, height: 0 }}
                                                                    className="text-red-400 text-xs mt-1.5 ml-1 font-medium"
                                                                >
                                                                    {nameError}
                                                                </motion.p>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    {/* ── Email Field with Autocomplete ── */}
                                                    <div className="relative">
                                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 ml-1 mb-1.5 block">Seu E-mail</label>
                                                        <input
                                                            type="email"
                                                            value={email}
                                                            onChange={(e) => handleEmailChange(e.target.value)}
                                                            onKeyDown={handleEmailKeyDown}
                                                            onBlur={() => {
                                                                // Small delay to allow click on suggestion
                                                                setTimeout(() => {
                                                                    setShowSuggestions(false);
                                                                    if (email) validateEmail(email);
                                                                }, 150);
                                                            }}
                                                            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                                                            placeholder="Onde enviaremos o acesso"
                                                            required
                                                            autoComplete="off"
                                                            disabled={status === 'loading'}
                                                            className={`w-full bg-black/50 border rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 transition-all text-sm disabled:opacity-50 font-medium ${emailError
                                                                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/50'
                                                                : 'border-white/10 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/30'
                                                                }`}
                                                        />

                                                        {/* Email Autocomplete Dropdown */}
                                                        <AnimatePresence>
                                                            {showSuggestions && suggestions.length > 0 && (
                                                                <motion.div
                                                                    ref={suggestionsRef}
                                                                    initial={{ opacity: 0, y: -5 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -5 }}
                                                                    className="absolute z-50 w-full mt-1 bg-[#1A1A1A] border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                                                                >
                                                                    {suggestions.slice(0, 5).map((suggestion, idx) => (
                                                                        <button
                                                                            key={suggestion}
                                                                            type="button"
                                                                            onMouseDown={(e) => e.preventDefault()}
                                                                            onClick={() => selectSuggestion(suggestion)}
                                                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${idx === activeSuggestion
                                                                                ? 'bg-[#D4AF37]/20 text-white'
                                                                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                                                }`}
                                                                        >
                                                                            {suggestion}
                                                                        </button>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        <AnimatePresence>
                                                            {emailError && (
                                                                <motion.p
                                                                    initial={{ opacity: 0, y: -5, height: 0 }}
                                                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                                    exit={{ opacity: 0, y: -5, height: 0 }}
                                                                    className="text-red-400 text-xs mt-1.5 ml-1 font-medium"
                                                                >
                                                                    {emailError}
                                                                </motion.p>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </div>

                                                {status === 'error' && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-400 text-xs px-1 font-medium bg-red-900/20 border border-red-500/20 rounded p-2 text-center"
                                                    >
                                                        {errorMessage}
                                                    </motion.p>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={status === 'loading'}
                                                    className="w-full mt-4 bg-gradient-to-r from-[#D4AF37] to-[#E8D48B] text-black rounded-xl py-4 font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                                                >
                                                    {status === 'loading' ? (
                                                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                                    ) : (
                                                        "Garantir meu lugar"
                                                    )}
                                                </button>
                                            </form>
                                            <p className="text-[11px] text-gray-400 text-center pt-2 font-medium">
                                                Acesso gratuito garantido para os primeiros.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
