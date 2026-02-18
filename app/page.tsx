'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Mic,
    Terminal,
    Mail,
    Globe,
    Zap,
    Command,
    Code2,
    CheckCircle2,
    ArrowRight,
    Shield,
    Layout,
    Play,
    Languages,
    MessageSquare,
    Clock,
    Unlock,
    ChevronDown,
    ChevronUp,
    Send,
    FileText,
    Table,
    PenTool,
    Briefcase,
    Keyboard
} from 'lucide-react';

// Animation variants
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const Tabs = () => {
    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
        {
            name: "Texto & E-mail",
            icon: Mail,
            input: "Oi, queria ver se a gente pode marcar aquela reunião pra amanhã às 10, tipo, pra falar sobre o projeto novo, sabe?",
            output: "Olá, gostaria de confirmar se podemos agendar nossa reunião sobre o novo projeto para amanhã às 10h?",
            color: "text-blue-400",
            bg: "bg-blue-500"
        },
        {
            name: "Código & Lógica",
            icon: Code2,
            input: "Quero uma função em python que leia um arquivo csv e me retorne, tipo, a média da coluna de idades.",
            output: `import pandas as pd

def calculate_average_age(file_path):
    df = pd.read_csv(file_path)
    return df['age'].mean()`,
            color: "text-purple-400",
            bg: "bg-purple-500"
        },
        {
            name: "Tradução (EN)",
            icon: Languages,
            input: "Avisa o time que o deploy foi um sucesso e que já está tudo online, por favor.",
            output: "Please let the team know that the deployment was successful and everything is online now.",
            color: "text-orange-400",
            bg: "bg-orange-500"
        },
        {
            name: "Comandos de IA",
            icon: Zap,
            input: "Resuma este texto em tópicos curtos e objetivos.",
            output: "• O VibeFlow elimina a necessidade de digitação manual.\n• Funciona nativamente em qualquer aplicativo do macOS.\n• Garante privacidade com processamento direto via Google.",
            color: "text-amber-400",
            bg: "bg-amber-500"
        },
        {
            name: "UX Design",
            icon: PenTool,
            input: "Eu quero um card com sombra suave, bordas arredondadas e que tenha um efeito de hover que levanta ele um pouquinho.",
            output: `div {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  transition: transform 0.2s;
}

div:hover {
  transform: translateY(-4px);
}`,
            color: "text-pink-400",
            bg: "bg-pink-500"
        }
    ];

    const getGradient = (index: number) => {
        switch (index) {
            case 0: return "from-blue-400 to-cyan-400"; // Texto
            case 1: return "from-purple-400 to-indigo-400"; // Código
            case 2: return "from-orange-400 to-amber-400"; // Tradução
            case 3: return "from-amber-400 to-yellow-400"; // Comandos
            case 4: return "from-pink-400 to-rose-400"; // UX
            default: return "from-gray-400 to-gray-600";
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`px-6 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === index
                            ? "bg-white text-black shadow-lg scale-105"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === index ? "text-black" : ""}`} />
                        {tab.name}
                    </button>
                ))}
            </div>

            <div className="relative bg-[#0F0F0F] rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 min-h-[400px]">
                <div className={`absolute top-0 w-full h-1 bg-gradient-to-r ${getGradient(activeTab)}`}></div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 h-full">
                    {/* Input - Audio/Raw */}
                    <div className="p-8 space-y-6 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-sm font-medium text-red-400 uppercase tracking-wider">O que você fala</span>
                        </div>
                        <div className="font-mono text-gray-500 text-lg leading-relaxed italic">
                            "{tabs[activeTab].input}"
                        </div>
                        <div className="h-12 bg-white/5 rounded-lg flex items-center justify-center gap-1 opacity-50 mt-auto">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-1 bg-red-500 rounded-full"
                                    animate={{ height: ["20%", "80%", "20%"] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                                ></motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Output - Processed */}
                    <div className="p-8 space-y-6 bg-white/[0.02] h-full flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-3 h-3 rounded-full ${tabs[activeTab].bg} shadow-[0_0_10px_rgba(255,255,255,0.5)]`}></div>
                            <span className={`text-sm font-medium ${tabs[activeTab].color} uppercase tracking-wider`}>O que o VibeFlow digita</span>
                        </div>
                        <div className={`font-mono ${tabs[activeTab].color} text-lg leading-relaxed bg-black/50 p-6 rounded-xl border border-white/5 shadow-inner whitespace-pre-wrap`}>
                            {tabs[activeTab].output}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const persuasivePhrases = [
    "O VibeFlow digita 5x mais rápido que você.",
    "Enquanto você digita, seu concorrente já respondeu.",
    "Uma hora por dia. É isso que você perde digitando.",
    "Sua voz produz 200 palavras por minuto. Seus dedos, 40.",
    "Tempo é dinheiro. Pare de desperdiçar os dois.",
    "E-mails, relatórios, código. Tudo 5x mais rápido.",
];

const ComparisonRace = () => {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [typingText, setTypingText] = useState("");
    const [voiceText, setVoiceText] = useState("");
    const [typingTime, setTypingTime] = useState(0);
    const [voiceTime, setVoiceTime] = useState(0);
    const [racePhase, setRacePhase] = useState<"racing" | "result">("racing");

    const targetText = persuasivePhrases[phraseIndex];
    const typingSpeedPerChar = 150; // ms per char — slow hunt-and-peck
    const voiceSpeedPerChar = 30;   // ms per char — fast burst

    useEffect(() => {
        let typingInterval: NodeJS.Timeout;
        let voiceInterval: NodeJS.Timeout;
        let nextPhraseTimeout: NodeJS.Timeout;
        let cancelled = false;

        // Reset for new phrase
        setTypingText("");
        setVoiceText("");
        setTypingTime(0);
        setVoiceTime(0);
        setRacePhase("racing");

        const startTime = Date.now();

        // Typing Animation (Slow — staccato)
        let charIndex = 0;
        typingInterval = setInterval(() => {
            if (cancelled) return;
            if (charIndex <= targetText.length) {
                setTypingText(targetText.slice(0, charIndex));
                charIndex++;
                setTypingTime((Date.now() - startTime) / 1000);
            } else {
                clearInterval(typingInterval);
            }
        }, typingSpeedPerChar);

        // Voice Animation (Fast — smooth burst)
        const voiceDelay = 400;
        const voiceStartTimeout = setTimeout(() => {
            if (cancelled) return;
            let voiceCharIndex = 0;
            const voiceStartTime = Date.now();
            voiceInterval = setInterval(() => {
                if (cancelled) return;
                if (voiceCharIndex <= targetText.length) {
                    setVoiceText(targetText.slice(0, voiceCharIndex));
                    voiceCharIndex += 3;
                    setVoiceTime((Date.now() - voiceStartTime) / 1000);
                } else {
                    setVoiceText(targetText);
                    clearInterval(voiceInterval);
                    // VibeFlow finished → show result phase
                    if (!cancelled) setRacePhase("result");
                }
            }, voiceSpeedPerChar);
        }, voiceDelay);

        // After the typing race finishes, pause briefly then smoothly advance to next phrase
        const totalTypingDuration = targetText.length * typingSpeedPerChar + 1500;
        nextPhraseTimeout = setTimeout(() => {
            if (cancelled) return;
            setPhraseIndex((prev) => (prev + 1) % persuasivePhrases.length);
        }, totalTypingDuration);

        return () => {
            cancelled = true;
            clearInterval(typingInterval);
            clearInterval(voiceInterval);
            clearTimeout(voiceStartTimeout);
            clearTimeout(nextPhraseTimeout);
        };
    }, [phraseIndex]);

    // Calculate voice finish time for display
    const voiceFinishTime = ((targetText.length / 3) * voiceSpeedPerChar + 400) / 1000;
    const typingFinishTime = (targetText.length * typingSpeedPerChar) / 1000;

    return (
        <div
            className="relative bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl hover:border-purple-500/30 transition-all duration-500 group shadow-2xl cursor-default"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Live Race</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {persuasivePhrases.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === phraseIndex ? "bg-purple-500 scale-125" : "bg-white/10"
                                }`}
                        />
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                {/* Manual Typing Lane */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                            <Keyboard className="w-3 h-3" /> Digitação (40 PPM)
                        </span>
                        <span className="font-mono text-sm text-gray-400">
                            {typingText.length >= targetText.length
                                ? typingFinishTime.toFixed(1) + "s"
                                : typingTime.toFixed(1) + "s"}
                        </span>
                    </div>
                    <div className="h-12 bg-black/40 rounded-xl border border-white/5 flex items-center px-4 relative overflow-hidden">
                        <span className="text-gray-400 font-mono text-sm truncate">{typingText}</span>
                        {typingText.length < targetText.length && (
                            <motion.div
                                className="w-0.5 h-5 bg-purple-500 ml-1 flex-shrink-0"
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.5 }}
                            />
                        )}
                    </div>
                    <div className="w-full bg-white/5 h-4 rounded-full relative mt-2 mb-1">
                        <motion.div
                            className="h-full bg-gray-600 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(typingText.length / targetText.length) * 100}%` }}
                            transition={{ duration: 0.05 }}
                        />
                        <motion.span
                            className="absolute top-1/2 text-3xl leading-none drop-shadow-lg z-10"
                            style={{ transform: 'translateX(-50%) translateY(-50%) scaleX(-1)' }}
                            initial={{ left: "0%" }}
                            animate={{ left: `${(typingText.length / targetText.length) * 100}%` }}
                            transition={{ duration: 0.05 }}
                        >
                            🐢
                        </motion.span>
                    </div>
                </div>

                {/* VibeFlow Lane */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-green-400 uppercase flex items-center gap-2">
                            <Mic className="w-3 h-3" /> VibeFlow (Voz)
                        </span>
                        <span className="font-mono text-sm text-green-400">
                            {voiceText.length >= targetText.length
                                ? voiceFinishTime.toFixed(1) + "s ✓"
                                : voiceTime > 0
                                    ? voiceTime.toFixed(1) + "s"
                                    : "0.0s"}
                        </span>
                    </div>
                    <div className="h-12 bg-green-500/5 rounded-xl border border-green-500/20 flex items-center px-4 relative overflow-hidden">
                        {racePhase === "racing" && (
                            <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
                        )}
                        <span className="text-green-100 font-medium text-sm z-10 truncate">{voiceText}</span>
                        {voiceText.length >= targetText.length && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="ml-auto flex-shrink-0 text-xs font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20"
                            >
                                {Math.round(typingFinishTime / voiceFinishTime)}x mais rápido
                            </motion.span>
                        )}
                    </div>
                    <div className="w-full bg-white/5 h-4 rounded-full relative mt-2 mb-1">
                        <motion.div
                            className="h-full bg-green-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(voiceText.length / targetText.length) * 100}%` }}
                            transition={{ duration: 0.05 }}
                        />
                        <motion.span
                            className="absolute top-1/2 text-3xl leading-none drop-shadow-lg z-10"
                            style={{ transform: 'translateX(-50%) translateY(-50%)' }}
                            initial={{ left: "0%" }}
                            animate={{ left: `${(voiceText.length / targetText.length) * 100}%` }}
                            transition={{ duration: 0.05 }}
                        >
                            🚀
                        </motion.span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Home() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [billingPeriod, setBillingPeriod] = useState<"annual" | "monthly">("annual");

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 relative">
                            <img src="/logo.png" alt="VibeFlow Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">VibeFlow</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a href="#features" className="hover:text-white transition-colors">Recursos</a>
                        <a href="#demo" className="hover:text-white transition-colors">Demo</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Preços</a>
                        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">Entrar</button>
                        <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                            Começar Agora
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-8"
                    >
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-6 hover:bg-white/10 transition-colors cursor-pointer">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            VibeFlow 2.0 chegou. Veja as novidades &rarr;
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-400">
                            Tempo é dinheiro. <br className="hidden md:block" />
                            <span className="text-white relative">
                                Pare de digitar.
                                <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 md:h-6 text-purple-600/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
                                </svg>
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                            O VibeFlow transforma sua fala em e-mails perfeitos, relatórios no Word e conversas no WhatsApp.
                            Economize <span className="text-white font-medium">20+ horas por mês</span> e foque no que realmente importa.
                        </motion.p>

                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]">
                                Baixar para Mac
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md border border-white/10 flex items-center justify-center gap-2">
                                <Play className="w-5 h-5 fill-current" />
                                Ver como funciona
                            </button>
                        </motion.div>

                        <motion.div variants={fadeIn} className="pt-12 pb-8 flex justify-center w-full">
                            <ComparisonRace />
                        </motion.div>

                        <motion.div variants={fadeIn} className="flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                <Clock className="w-4 h-4" /> Economize 1h/dia
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                <Shield className="w-4 h-4" /> Processamento Google Seguro
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                <Unlock className="w-4 h-4" /> Pague uma vez
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Video Section */}
            <section className="py-12 px-6 bg-black relative z-20 -mt-10">
                <div className="max-w-5xl mx-auto">
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(168,85,247,0.2)] bg-[#0F0F0F] group">
                        {/* Placeholder for video content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300 cursor-pointer border border-white/20">
                                <Play className="w-8 h-8 fill-white text-white ml-1" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500"></div>

                        {/* Fake UI Overlay to make it look like app is running */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs text-white/70 border border-white/10">VibeFlow Demo</div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Works Everywhere Section - Smooth CSS Marquee */}
            <section className="py-10 border-y border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative">
                    <p className="text-center text-sm font-medium text-gray-500 mb-8 uppercase tracking-widest">Funciona onde você trabalha</p>

                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes marquee-scroll {
                            0% { transform: translate3d(0, 0, 0); }
                            100% { transform: translate3d(-50%, 0, 0); }
                        }
                        .marquee-track {
                            animation: marquee-scroll 50s linear infinite;
                            will-change: transform;
                        }
                        .marquee-track:hover {
                            animation-play-state: paused;
                        }
                    `}} />

                    <div className="flex overflow-hidden relative w-full [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                        <div className="marquee-track flex gap-14 min-w-max items-center">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex gap-14 items-center">
                                    {/* WhatsApp */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                        <span className="text-lg font-bold text-gray-300">WhatsApp</span>
                                    </div>
                                    {/* ChatGPT */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#10A37F"><path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0017.75.5a6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.26 1.036a5.998 5.998 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 006.26 20.1a6.046 6.046 0 006.515 2.9 5.986 5.986 0 004.26-1.036 5.998 5.998 0 003.997-2.9 6.046 6.046 0 00-.75-7.243zm-9.036 12.03a4.488 4.488 0 01-2.887-1.04l.144-.083 4.8-2.772a.78.78 0 00.394-.678v-6.764l2.028 1.17a.073.073 0 01.04.057v5.602a4.508 4.508 0 01-4.519 4.508zm-9.69-4.137a4.486 4.486 0 01-.537-3.022l.144.086 4.8 2.772a.78.78 0 00.786 0l5.862-3.384v2.342a.073.073 0 01-.029.062l-4.856 2.804a4.508 4.508 0 01-6.17-1.66zm-1.262-10.45A4.488 4.488 0 014.66 5.14v.171l-.001 5.544a.78.78 0 00.394.678l5.861 3.384-2.028 1.17a.073.073 0 01-.068.005L3.961 13.29a4.508 4.508 0 01-1.667-6.126zM19.646 12.6l-5.862-3.384 2.028-1.17a.073.073 0 01.068-.005l4.857 2.803a4.506 4.506 0 01-.68 8.105v-5.671a.78.78 0 00-.411-.678zm2.018-3.04l-.144-.085-4.8-2.772a.78.78 0 00-.786 0l-5.862 3.384V7.745a.073.073 0 01.029-.062l4.856-2.804a4.508 4.508 0 016.707 4.681zm-12.7 4.17l-2.028-1.17a.073.073 0 01-.04-.057V6.9a4.508 4.508 0 017.406-3.467l-.144.083-4.8 2.772a.78.78 0 00-.394.678zm1.1-2.378l2.612-1.508 2.612 1.508v3.016l-2.612 1.508-2.612-1.508z" /></svg>
                                        <span className="text-lg font-bold text-gray-300">ChatGPT</span>
                                    </div>
                                    {/* Gmail */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#EA4335"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" /></svg>
                                        <span className="text-lg font-bold text-gray-300">Gmail</span>
                                    </div>
                                    {/* Slack */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24"><path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313z" fill="#E01E5A" /><path d="M8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 012.521 2.521 2.527 2.527 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312z" fill="#36C5F0" /><path d="M18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.271 0a2.527 2.527 0 01-2.521 2.521 2.528 2.528 0 01-2.522-2.521V2.522A2.528 2.528 0 0115.164 0a2.528 2.528 0 012.521 2.522v6.312z" fill="#2EB67D" /><path d="M15.164 18.956a2.528 2.528 0 012.521 2.522A2.528 2.528 0 0115.164 24a2.527 2.527 0 01-2.522-2.522v-2.522h2.522zm0-1.271a2.527 2.527 0 01-2.522-2.521 2.528 2.528 0 012.522-2.522h6.314A2.528 2.528 0 0124 15.164a2.528 2.528 0 01-2.522 2.521h-6.314z" fill="#ECB22E" /></svg>
                                        <span className="text-lg font-bold text-gray-300">Slack</span>
                                    </div>
                                    {/* VS Code */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#007ACC"><path d="M23.15 2.587L18.21.21a1.494 1.494 0 00-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 00-1.276.057L.327 7.261A1 1 0 00.326 8.74L3.899 12 .326 15.26a1 1 0 00.001 1.479L1.65 17.94a.999.999 0 001.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 001.704.29l4.942-2.377A1.5 1.5 0 0024 20.06V3.939a1.5 1.5 0 00-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" /></svg>
                                        <span className="text-lg font-bold text-gray-300">VS Code</span>
                                    </div>
                                    {/* Notion */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="white"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.11 2.16c-.42-.326-.98-.7-2.055-.607L3.01 2.86c-.466.046-.56.28-.373.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.84-.046.933-.56.933-1.167V6.354c0-.606-.233-.933-.746-.886l-15.177.887c-.56.046-.747.326-.747.933zm14.337.746c.093.42 0 .84-.42.886l-.7.14v10.264c-.607.327-1.167.514-1.634.514-.747 0-.933-.234-1.494-.933l-4.577-7.186v6.953l1.447.327s0 .84-1.167.84l-3.22.187c-.093-.187 0-.653.327-.733l.84-.233V9.854L7.47 9.76c-.094-.42.14-1.026.793-1.073l3.454-.233 4.764 7.279v-6.44l-1.214-.14c-.093-.513.28-.886.746-.933zM2.718 1.321l13.728-1.014c1.68-.14 2.1.094 2.8.607l3.867 2.706c.466.373.606.467.606 1.4v14.64c0 1.027-.373 1.634-1.68 1.727l-15.457.933c-.98.047-1.447-.093-1.96-.747L1.348 17.86c-.56-.747-.793-1.307-.793-1.96V3.187c0-.84.373-1.587 1.494-1.773l.67-.093z" opacity=".8" /></svg>
                                        <span className="text-lg font-bold text-gray-300">Notion</span>
                                    </div>
                                    {/* Figma */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491z" fill="#1ABCFE" /><path d="M6.56 24c2.476 0 4.49-2.014 4.49-4.49v-4.49H6.56C4.084 15.02 2.07 17.034 2.07 19.51S4.084 24 6.56 24z" fill="#0ACF83" /><path d="M6.56 15.02h4.49V6.04H6.56C4.084 6.04 2.07 8.054 2.07 10.53s2.014 4.49 4.49 4.49z" fill="#A259FF" /><path d="M6.56 6.04h4.49V0H6.56C4.084 0 2.07 2.014 2.07 4.49s2.014 1.55 4.49 1.55z" fill="#F24E1E" /><path d="M15.852 6.04h-4.588v8.98h4.588c2.476 0 4.49-2.014 4.49-4.49s-2.014-4.49-4.49-4.49z" fill="#FF7262" /></svg>
                                        <span className="text-lg font-bold text-gray-300">Figma</span>
                                    </div>
                                    {/* Excel */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#217346"><path d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3z" /></svg>
                                        <span className="text-lg font-bold text-gray-300">Excel</span>
                                    </div>
                                    {/* Word */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#2B579A"><path d="M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 16.33l.6-3.57.03-.15.03-.16h.05l.6 3.83h1.7l1.4-6.6H8.78l-.56 3.73-.03.15-.03.13h-.05l-.63-3.99H5.88l-.66 4.01h-.05l-.56-3.99H2.93l1.44 6.61zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3z" /></svg>
                                        <span className="text-lg font-bold text-gray-300">Word</span>
                                    </div>
                                    {/* Discord */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                                        <span className="text-lg font-bold text-gray-300">Discord</span>
                                    </div>
                                    {/* Google Docs */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#4285F4"><path d="M14.727 6.727H14V0H4.91c-.905 0-1.637.732-1.637 1.636v20.728c0 .904.732 1.636 1.636 1.636h14.182c.904 0 1.636-.732 1.636-1.636V6.727h-6zM6.545 6h4.364v1.455H6.545V6zm10.91 13.09H6.544v-1.454h10.91v1.455zm0-2.908H6.544v-1.455h10.91v1.455zm0-2.91H6.544v-1.454h10.91v1.455zM14.727 6V.545L20.182 6h-5.455z" /></svg>
                                        <span className="text-lg font-bold text-gray-300">Google Docs</span>
                                    </div>
                                    {/* Telegram */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#26A5E4"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0 12 12 0 0011.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
                                        <span className="text-lg font-bold text-gray-300">Telegram</span>
                                    </div>
                                    {/* Canva */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#00C4CC"><path d="M2.6 6.16a11.7 11.7 0 003.47 8.35 11.62 11.62 0 008.3 3.47 11.71 11.71 0 008.36-3.47A11.71 11.71 0 0024 6.16 6.2 6.2 0 0017.83 0a6.12 6.12 0 00-4.49 1.86l-.18.19a1.6 1.6 0 01-2.32 0l-.18-.19A6.12 6.12 0 006.17 0 6.2 6.2 0 000 6.16h2.6zM12 15.98a5.7 5.7 0 01-4.04-1.68A5.68 5.68 0 016.28 10.26a5.7 5.7 0 011.68-4.04A5.7 5.7 0 0112 4.54a5.7 5.7 0 014.04 1.68 5.7 5.7 0 011.68 4.04 5.68 5.68 0 01-1.68 4.04A5.7 5.7 0 0112 15.98z" /></svg>
                                        <span className="text-lg font-bold text-gray-300">Canva</span>
                                    </div>
                                    {/* Claude AI */}
                                    <div className="flex items-center gap-3 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
                                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#D97757"><path d="M4.709 15.955l4.72-2.756.08-.046 2.91-1.7c.164-.096.164-.334 0-.43L9.51 9.322l-.08-.047-4.72-2.757c-.164-.096-.369.023-.369.215v2.803c0 .132.07.253.185.319l2.474 1.395v2.572L4.526 15.22a.369.369 0 00-.186.32v2.803c0 .191.205.311.369.215v-.001zm14.582 0l-4.72-2.756-.08-.046-2.91-1.7a.247.247 0 010-.43l2.91-1.701.08-.047 4.72-2.757c.164-.096.369.023.369.215v2.803a.369.369 0 01-.185.319l-2.474 1.395v2.572l2.474 1.398a.369.369 0 01.186.32v2.803c0 .191-.205.311-.369.215v-.001zM12 21.469l-4.72-2.756-.08-.047-2.91-1.7a.247.247 0 010-.43l2.91-1.7.08-.047L12 12.03l4.72 2.757.08.046 2.91 1.7c.164.097.164.335 0 .431l-2.91 1.7-.08.047L12 21.469zM12 2.531l4.72 2.757.08.046 2.91 1.7c.164.097.164.335 0 .431l-2.91 1.7-.08.047L12 11.97 7.28 9.212l-.08-.046-2.91-1.7a.247.247 0 010-.43l2.91-1.7.08-.048L12 2.531z" /></svg>
                                        <span className="text-lg font-bold text-gray-300">Claude AI</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Transformation Section (Carousel) */}
            <section id="demo" className="py-20 px-6 bg-black relative">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none"></div>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">Fale naturalmente. <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Aparece instantaneamente.</span></h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            O VibeFlow entende o contexto e se adapta ao que você precisa.
                        </p>
                    </div>

                    <Tabs />

                </div>
            </section>

            {/* Features Grid (Specific Use Cases) */}
            <section id="features" className="py-24 px-6 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">Produtividade real. <span className="text-purple-500">Dinheiro no bolso.</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Seu tempo vale muito. Pare de desperdiçá-lo com digitação lenta e formatação manual.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Email Card */}
                        <div className="group bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Mail className="text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">E-mails em segundos</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Aquele e-mail longo? Dite em 30 segundos. O VibeFlow corrige, formata e deixa profissional. Recupere sua caixa de entrada.
                            </p>
                        </div>

                        {/* Universal Card */}
                        <div className="group bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Clock className="text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Reuniões mais curtas</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Em vez de uma reunião de 30 mins, envie uma mensagem detalhada no Slack ou Teams ditada em 1 minuto. Clareza total, zero esforço.
                            </p>
                        </div>

                        {/* Voice Commands / Code Card */}
                        <div className="group bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Comandos Mágicos</h3>
                            <p className="text-gray-400 leading-relaxed">
                                "Resuma isso", "Melhore o tom", "Traduza para Inglês". Use comandos de voz para editar textos instantaneamente em qualquer lugar.
                            </p>
                        </div>

                        {/* Translation Card */}
                        <div className="group bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 md:col-span-2">
                            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Languages className="text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Poliglota Instantâneo</h3>
                            <p className="text-gray-400 leading-relaxed max-w-lg">
                                Fale em sua língua nativa, e o VibeFlow digita em Inglês, Espanhol, Francês ou Japonês.
                                Comunique-se globalmente sem pausar para traduzir mentalmente.
                            </p>
                        </div>

                        {/* Stats Card */}
                        <div className="group bg-gradient-to-br from-purple-900/20 to-black border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center hover:border-purple-500/30 transition-all">
                            <div className="text-5xl font-bold text-white mb-2">20h+</div>
                            <p className="text-purple-300 font-medium">Economizadas por mês</p>
                            <p className="text-gray-500 text-sm mt-4">Média baseada em usuários ativos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 bg-[#050505] border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-16">Como as pessoas recuperaram seu tempo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                quote: "Eu respondo e-mails enquanto passeio com meu cachorro agora. Parece ridículo, mas mudou genuinamente como eu trabalho.",
                                author: "Carlos Mendes",
                                role: "Product Manager"
                            },
                            {
                                quote: "Gerenciar comunidades de dev significava digitar o dia todo. A velocidade do VibeFlow me devolveu horas toda semana.",
                                author: "Ana Silva",
                                role: "DevRel"
                            },
                            {
                                quote: "Input de voz consistente em todos os apps ao invés de depender de funções nativas ruins era exatamente o que eu precisava.",
                                author: "Roberto Junior",
                                role: "Tech Lead"
                            }
                        ].map((t, i) => (
                            <div key={i} className="bg-black/50 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                <div className="text-purple-500 mb-4">
                                    <MessageSquare className="fill-current w-8 h-8 opacity-50" />
                                </div>
                                <p className="text-gray-300 mb-6 text-lg leading-relaxed">"{t.quote}"</p>
                                <div>
                                    <p className="font-bold text-white">{t.author}</p>
                                    <p className="text-sm text-gray-500">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing - Two Tiers */}
            <section id="pricing" className="py-24 px-6 bg-black relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] -z-10"></div>
                <div className="max-w-4xl mx-auto text-center mb-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Comece grátis. Evolua quando quiser.</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">Sem compromisso. Sem cartão de crédito. Comece a economizar tempo agora.</p>
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-2 mb-12">
                    <div className="bg-white/5 border border-white/10 rounded-full p-1 flex items-center">
                        <button
                            onClick={() => setBillingPeriod("monthly")}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${billingPeriod === "monthly" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
                        >
                            Mensal
                        </button>
                        <button
                            onClick={() => setBillingPeriod("annual")}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${billingPeriod === "annual" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
                        >
                            Anual
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-300 ${billingPeriod === "annual" ? "bg-green-500 text-white" : "bg-green-500/20 text-green-400"}`}>
                                -20%
                            </span>
                        </button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Free Plan */}
                    <div className="relative bg-[#0F0F0F] rounded-2xl p-8 border border-white/10 flex flex-col hover:border-white/20 transition-all duration-300">
                        <h3 className="text-2xl font-bold text-white mb-2">Grátis</h3>
                        <p className="text-gray-500 text-sm mb-6">Perfeito para experimentar o VibeFlow</p>
                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-5xl font-bold text-white">R$0</span>
                            <span className="text-gray-400 text-sm">/ para sempre</span>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            {[
                                "100 transcrições por mês",
                                "Todos os modos (Texto, Código, Tradução)",
                                "Funciona em qualquer app",
                                "Processamento seguro via Google",
                                "Comandos de IA básicos",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-300 list-none">
                                    <CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </div>

                        <button className="w-full py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-lg hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Começar Grátis
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl opacity-75 blur group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative bg-[#0F0F0F] rounded-2xl p-8 border border-white/10 h-full flex flex-col">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/20">
                                    RECOMENDADO
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                            <p className="text-gray-500 text-sm mb-6">Para quem vive de produtividade</p>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-bold text-white">
                                    R${billingPeriod === "annual" ? "15,99" : "19,99"}
                                </span>
                                {billingPeriod === "annual" && (
                                    <span className="text-lg text-gray-500 line-through">R$19,99</span>
                                )}
                                <span className="text-gray-400 text-sm">/ mês</span>
                            </div>
                            {billingPeriod === "annual" && (
                                <p className="text-green-400 text-xs font-medium mb-6">Cobrado R$191,88/ano — economize R$48</p>
                            )}
                            {billingPeriod === "monthly" && (
                                <p className="text-gray-500 text-xs mb-6">Cobrado mensalmente</p>
                            )}

                            <div className="flex-1 space-y-4 mb-8">
                                {[
                                    "Transcrições ilimitadas",
                                    "Todos os modos (Texto, Código, Tradução)",
                                    "Funciona em qualquer app",
                                    "Processamento seguro via Google",
                                    "Comandos de IA avançados (Resumir, Corrigir, Formatar)",
                                    "Modo Tradução Instantânea",
                                    "Suporte prioritário",
                                    "Atualizações incluídas",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-300 list-none">
                                        <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </div>

                            <button className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-white/10">
                                Assinar Pro
                            </button>
                            <p className="text-xs text-center text-gray-500 mt-4">Cancele quando quiser. Sem multas.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-24 px-6 bg-black">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: "Quanto tempo eu vou realmente economizar?",
                                a: "A pessoa média digita 40 palavras por minuto, mas fala 150. Usando o VibeFlow para e-mails, documentos e código, nossos usuários economizam em média 20 horas por mês."
                            },
                            {
                                q: "Funciona com meus apps?",
                                a: "Sim. O VibeFlow funciona como uma camada em cima do sistema. Se você pode clicar e digitar, o VibeFlow funciona lá. Slack, Discord, WhatsApp, Xcode, Word, Google Docs, etc."
                            },
                            {
                                q: "Como o VibeFlow me ajuda a escrever código?",
                                a: "O 'Code Mode' é otimizado para entender terminologia técnica e sintaxe. Você diz 'função map array user', ele digita 'users.map((user) => ...)' corretamente."
                            },
                            {
                                q: "Posso ditar na minha própria língua?",
                                a: "Sim suporte a 100+ línguas. E o melhor: você pode ditar em Português e pedir para ele escrever em Inglês instantaneamente."
                            },
                            {
                                q: "Meus dados são privados?",
                                a: "Sim, 100%. O VibeFlow processa sua fala usando tecnologia Google segura. A conexão é feita diretamente do seu Mac para o Google, sem passar por nossos servidores. Seus dados são seus."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="border border-white/10 rounded-lg overflow-hidden bg-white/5">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-medium text-gray-200">{faq.q}</span>
                                    {openFaq === i ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 py-4 text-gray-400 border-t border-white/10 bg-black/20 text-sm leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-black text-gray-400 text-sm">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 relative">
                            <img src="/logo.png" alt="VibeFlow Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-white">VibeFlow</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Termos</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                    <p>© 2026 VibeFlow. Feito com ❤️ por Robson Oliveira.</p>
                </div>
            </footer>
        </div>
    );
}
