'use client';

import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
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
    Keyboard,
    AlignLeft,
    MessageCircle,
    Wand2,
    Building2,
    Megaphone,
    AtSign,
    List,
    Users,
    Palette,
    Sparkles,
    SlidersHorizontal,
    Timer,
    Apple
} from 'lucide-react';
import HeroMarquee from './components/HeroMarquee';
import WallOfLove from './components/WallOfLove';
import WaitlistOverlay from './components/WaitlistOverlay';
import VoxHUDMockup from './components/VoxHUDMockup';

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

const strikethrough = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeInOut", delay: 1.5 }
    }
};

const highlightFadeIn = {
    hidden: { opacity: 0, y: 10, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.5, ease: "easeOut", delay: 0.3 }
    }
};

// Typewriter hook — types text character by character
function useTypewriter(text: string, speed: number, startDelay = 0, enabled = true) {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!enabled) return;
        setDisplayed('');
        setDone(false);
        let i = 0;
        let interval: NodeJS.Timeout;
        const timeout = setTimeout(() => {
            interval = setInterval(() => {
                i++;
                setDisplayed(text.slice(0, i));
                if (i >= text.length) {
                    clearInterval(interval);
                    setDone(true);
                }
            }, speed);
        }, startDelay);
        return () => {
            clearTimeout(timeout);
            if (interval) clearInterval(interval);
        };
    }, [text, speed, startDelay, enabled]);

    return { displayed, done };
}


const Tabs = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Auto-scroll the active tab into view to keep it visible
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const activeElement = container.children[activeTab] as HTMLElement;

            if (activeElement) {
                const containerWidth = container.offsetWidth;
                const elementOffset = activeElement.offsetLeft;
                const elementWidth = activeElement.offsetWidth;

                container.scrollTo({
                    left: elementOffset - (containerWidth / 2) + (elementWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
    }, [activeTab]);

    const tabs = [
        {
            name: "Texto", icon: AlignLeft, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "então... tipo, o prazo era hoje né, mas a gente ainda não terminou, acho que precisamos de mais uns dois dias, sabe?",
            output: "O prazo era hoje, mas ainda não finalizamos. Precisamos de mais dois dias."
        },
        {
            name: "Chat", icon: MessageCircle, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "cara esquece o que eu falei antes sobre sábado, pode sábado sim, que horas vc quer",
            output: "Esquece o que eu disse sobre sábado — pode sim! Que horas você quer?"
        },
        {
            name: "Código", icon: Code2, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "cria um hook em react que faz debounce de um valor, o delay padrão pode ser trezentos milissegundos",
            output: `function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}`
        },
        {
            name: "Vibe Coder", icon: Wand2, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "eu queria que, tipo, quando o usuário não tiver logado e tentar acessar aquela rota lá do dashboard, ele seja redirecionado pro login com uma mensagem dizendo que precisa fazer login antes",
            output: "Redirecionar usuário não autenticado que acessa /dashboard para /login com mensagem 'Faça login para continuar'.\n\n(-62% tokens. Zero perda de contexto técnico.)"
        },
        {
            name: "Email", icon: Mail, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "fala pro fornecedor que o pagamento vai sair semana que vem, que teve um problema interno mas tá resolvido, pede pra ele confirmar se ainda tá de acordo",
            output: "Prezado, informamos que o pagamento será processado na próxima semana. Tivemos um contratempo interno que já foi solucionado. Por gentileza, confirme se o prazo ainda é conveniente. Atenciosamente,"
        },
        {
            name: "Formal", icon: Building2, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "olha, a gente vai ter que adiar a reunião de amanhã, deu um problema aqui, tenta remarcar pra quinta ou sexta",
            output: "Prezados, em virtude de um imprevisto interno, precisamos reagendar a reunião prevista para amanhã. Sugerimos quinta ou sexta-feira como novas datas. Aguardamos confirmação. Atenciosamente,"
        },
        {
            name: "Social", icon: Megaphone, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "trabalhei dois anos num produto que ninguém usou, e aprendi mais nesse fracasso do que em qualquer sucesso que tive",
            output: "Passei 2 anos construindo um produto que ninguém usou. 💀 E aprendi mais com esse fracasso do que com qualquer sucesso anterior. Às vezes o mercado é o melhor professor — mesmo quando a aula dói. 🧵"
        },
        {
            name: "X", icon: AtSign, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "as pessoas acham que ser produtivo é fazer muita coisa, mas na verdade é fazer as coisas certas e ignorar o resto",
            output: "Produtividade não é fazer mais. É ter clareza suficiente para ignorar o que não importa. A maioria está ocupada. Poucos estão focados."
        },
        {
            name: "Resumo", icon: FileText, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "então ficou combinado que o pedro termina a integração com pagamento até quarta, a ana cuida do design do checkout, e a gente apresenta pro cliente na sexta às três",
            output: "Resumo da Reunião\n• Pedro → Integração de pagamento (até quarta)\n• Ana → Design do checkout\n• Apresentação ao cliente: sexta, 15h"
        },
        {
            name: "Tópicos", icon: List, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "preciso verificar os logs do servidor, atualizar a dependência do axios, falar com o time de QA sobre os testes e subir o PR antes do fim do dia",
            output: "• Verificar logs do servidor\n• Atualizar dependência (axios)\n• Alinhar com QA sobre testes\n• Subir PR até fim do dia"
        },
        {
            name: "Reunião", icon: Users, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "certo, então ficou decidido que vamos migrar pra nuvem no Q3, o responsável vai ser o time do rafael, e a gente precisa de um plano de rollback antes de começar",
            output: "📋 Decisões\n• Migração para nuvem: Q3\n• Responsável: Time do Rafael\n• Pré-requisito: Plano de rollback aprovado antes do início"
        },
        {
            name: "UX Design", icon: PenTool, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "o formulário de cadastro tá confuso, os campos tão muito juntos, a pessoa não sabe onde clicar, coloca mais espaço e deixa o botão de cadastrar mais óbvio",
            output: "Formulário de Cadastro — Melhorias\n• Aumentar espaçamento entre campos (mín. 16px)\n• Hierarquia visual: destaque o CTA principal\n• Botão 'Cadastrar': aumentar contraste e tamanho\n• Objetivo: reduzir fricção e abandono"
        },
        {
            name: "Tradução", icon: Languages, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "fala que a proposta comercial tem validade de quinze dias e que qualquer dúvida é só responder esse email",
            output: "This commercial proposal is valid for 15 days. If you have any questions, feel free to reply to this email."
        },
        {
            name: "Criativo", icon: Palette, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "escreve o começo de uma história de um programador que descobre que o bug que ele não consegue achar não existe no código, existe nele mesmo",
            output: "Eram 3h da manhã quando Lucas percebeu que havia revisado o mesmo trecho de código quarenta e sete vezes. O bug não estava ali. Talvez nunca estivesse. Ele fechou o laptop devagar, e pela primeira vez em anos, ficou com o silêncio."
        },
        {
            name: "Meu Modo", icon: Sparkles, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/20",
            input: "transforma isso aqui no meu estilo clássico bem direto ao ponto, curto, com bullet points sobre as prioridades técnicas",
            output: "🎯 Prioridades Técnicas:\n• Refatorar auth service\n• Implementar cache no Redis\n• Cobrir \`/checkout\` com testes (min 80%)\nPrazo inflexível: Sexta-feira."
        }
    ];

    // Auto-play functionality
    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % tabs.length);
        }, 3500); // Change tab every 3.5 seconds

        return () => clearInterval(interval);
    }, [isHovered, tabs.length]);

    // Array de gradientes para os diferentes modos
    const bg_gradients = [
        "from-[#D4AF37] to-[#E8D48B]",        // 0 Texto
        "from-[#E8D48B] to-[#D4AF37]",        // 1 Chat
        "from-[#D4AF37]/80 to-[#D4AF37]",     // 2 Código
        "from-amber-400 to-[#D4AF37]",        // 3 Vibe Coder
        "from-[#D4AF37] to-amber-500",        // 4 Email
        "from-[#D4AF37]/90 to-[#E8D48B]",     // 5 Formal
        "from-[#E8D48B]/90 to-[#D4AF37]",     // 6 Social
        "from-[#D4AF37] to-amber-400",        // 7 X
        "from-amber-500 to-[#D4AF37]",        // 8 Resumo
        "from-[#D4AF37] to-[#D4AF37]/80",     // 9 Tópicos
        "from-[#E8D48B] to-amber-500",        // 10 Reunião
        "from-[#D4AF37] to-[#E8D48B]/80",     // 11 UX Design
        "from-amber-400 to-[#D4AF37]/90",     // 12 Tradução
        "from-[#D4AF37] to-[#D4AF37]",        // 13 Criativo
        "from-[#E8D48B] to-[#E8D48B]",        // 14 Meu Modo
    ];
    const getGradient = (index: number) => {
        return bg_gradients[index] || "from-gray-400 to-gray-600";
    };

    return (
        <div
            className="w-full max-w-5xl mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* The Invisible Scroll Marquee Container */}
            <div className="relative mb-8 w-full">
                {/* Left Fade */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />

                {/* Scrollable Area */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-3 py-4 px-16 md:px-24 scrollbar-hide snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`whitespace-nowrap flex-none snap-center px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 border ${activeTab === index
                                ? `bg-white/10 ${tab.color} border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105`
                                : "bg-black/50 text-gray-400 border-white/5 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === index ? tab.color : ""}`} />
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Right Fade */}
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
            </div>

            <div className="relative max-w-3xl mx-auto bg-[#0F0F0F] rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 min-h-[400px]">
                <div className={`absolute top-0 w-full h-1 bg-gradient-to-r ${getGradient(activeTab)} transition-all duration-500`}></div>
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 h-full">
                    {/* Input - Audio/Raw */}
                    <div className="p-6 md:p-10 space-y-6 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
                            <span className="text-sm font-medium text-[#D4AF37] uppercase tracking-wider">O que você fala</span>
                        </div>
                        <div className="font-mono text-gray-400 text-base md:text-lg leading-relaxed italic transition-all duration-300">
                            "{tabs[activeTab].input}"
                        </div>
                        <div className="h-12 bg-white/5 rounded-lg flex items-center justify-center gap-1 opacity-50 mt-auto">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-[#D4AF37] rounded-full animate-audio-bar shadow-[0_0_4px_rgba(212,175,55,0.4)]"
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Output - Processed */}
                    <div className="p-6 md:p-10 space-y-6 bg-white/[0.02] h-full flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-3 h-3 rounded-full ${tabs[activeTab].bg} shadow-[0_0_10px_rgba(255,255,255,0.5)]`}></div>
                            <span className={`text-sm font-medium ${tabs[activeTab].color} uppercase tracking-wider`}>O que o VoxAIgo digita</span>
                        </div>
                        <div className={`font-mono ${tabs[activeTab].color} text-sm leading-relaxed bg-black/50 p-6 rounded-xl border border-white/5 shadow-inner whitespace-pre-wrap`}>
                            {tabs[activeTab].output}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const persuasivePhrases = [
    "O VoxAIgo digita muito mais rápido que você.",
    "A IA digita, pontua e formata suas ideias.",
    "Uma hora por dia. É isso que você economiza.",
    "Fale de forma natural, sem pensar no teclado.",
    "E-mails e relatórios prontos antes mesmo de você sentar.",
    "Troque de idioma e dê comandos apenas com a voz."
];

interface ComparisonRaceProps {
    onPhaseChange?: (phase: 'idle' | 'listening' | 'processing') => void;
}

const ComparisonRace = ({ onPhaseChange }: ComparisonRaceProps = {}) => {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [typingText, setTypingText] = useState("");
    const [voiceText, setVoiceText] = useState("");
    const [typingTime, setTypingTime] = useState(0);
    const [voiceTime, setVoiceTime] = useState(0);
    const [racePhase, setRacePhase] = useState<"racing" | "result">("racing");

    const targetText = persuasivePhrases[phraseIndex];
    const typingSpeedPerChar = 150; // ms per char — slow hunt-and-peck
    const voiceSpeedPerChar = 30;   // ms per char — fast burst

    const containerRef = React.useRef(null);
    const isInView = useInView(containerRef, { once: false, margin: "0px" });

    useEffect(() => {
        if (!isInView) return;

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
        onPhaseChange?.('idle');

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
        onPhaseChange?.('listening');
        const voiceStartTimeout = setTimeout(() => {
            if (cancelled) return;
            onPhaseChange?.('processing');
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
                    // VoxAIgo finished → show result phase
                    onPhaseChange?.('idle');
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
    }, [phraseIndex, isInView]);

    // Calculate voice finish time for display
    const voiceFinishTime = ((targetText.length / 3) * voiceSpeedPerChar + 400) / 1000;
    const typingFinishTime = (targetText.length * typingSpeedPerChar) / 1000;

    return (
        <div
            ref={containerRef}
            className="relative bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-2xl hover:border-[#D4AF37]/30 transition-all duration-500 group shadow-2xl cursor-default"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_5px_rgba(212,175,55,0.6)]"></div>
                    <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Live Race</span>
                </div>
                <div className="flex items-center gap-1.5">
                    {persuasivePhrases.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === phraseIndex ? "bg-[#D4AF37] scale-125" : "bg-white/10"}`}
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
                                className="w-0.5 h-5 bg-[#D4AF37] ml-1 flex-shrink-0"
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
                        <motion.div
                            className="absolute top-1/2 drop-shadow-lg z-10 w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full border border-gray-600 shadow-md"
                            style={{ transform: 'translateX(-50%) translateY(-50%)' }}
                            initial={{ left: "0%" }}
                            animate={{ left: `${(typingText.length / targetText.length) * 100}%` }}
                            transition={{ duration: 0.05 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-4 h-4 text-gray-400 fill-current animate-[spin_4s_linear_infinite]">
                                <path d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64V75c0 42.4 16.9 83.1 46.9 113.1L146.7 256l-67.9 67.9C48.9 353.9 32 394.6 32 437v11c-17.7 0-32 14.3-32 32s14.3 32 32 32H352c17.7 0 32-14.3 32-32s-14.3-32-32-32V437c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H32zM96 75V64H288V75c0 25.5-10.1 49.9-28.1 67.9L192 210.7l-67.9-67.9C106.1 124.9 96 100.4 96 75z" />
                            </svg>
                        </motion.div>
                    </div>
                </div>

                {/* VoxAIgo Lane */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-[#D4AF37] uppercase flex items-center gap-2">
                            <Mic className="w-3 h-3" /> VoxAIgo (Voz)
                        </span>
                        <span className="font-mono text-sm text-[#D4AF37]">
                            {voiceText.length >= targetText.length
                                ? voiceFinishTime.toFixed(1) + "s ✓"
                                : voiceTime > 0
                                    ? voiceTime.toFixed(1) + "s"
                                    : "0.0s"}
                        </span>
                    </div>
                    <div className="h-12 bg-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/20 flex items-center px-4 relative overflow-hidden">
                        {racePhase === "racing" && (
                            <div className="absolute inset-0 bg-[#D4AF37]/5 animate-pulse"></div>
                        )}
                        <span className="text-amber-100 font-medium text-sm z-10 truncate">{voiceText}</span>
                        {voiceText.length >= targetText.length && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="ml-auto flex-shrink-0 text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/20"
                            >
                                {Math.round(typingFinishTime / voiceFinishTime)}x mais rápido
                            </motion.span>
                        )}
                    </div>
                    <div className="w-full bg-white/5 h-4 rounded-full relative mt-2 mb-1">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E8D48B] rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(voiceText.length / targetText.length) * 100}%` }}
                            transition={{ duration: 0.05 }}
                        />
                        <motion.div
                            className="absolute top-1/2 drop-shadow-lg z-10 w-8 h-8 flex items-center justify-center bg-[#1A1A1A] rounded-full border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                            style={{ transform: 'translateX(-50%) translateY(-50%)' }}
                            initial={{ left: "0%" }}
                            animate={{ left: `${(voiceText.length / targetText.length) * 100}%` }}
                            transition={{ duration: 0.05 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-4 h-4 text-[#D4AF37] fill-current">
                                <path d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-.9 273.7 9 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z" />
                            </svg>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SyncedHeroSection = ({ onJoinWaitlist }: { onJoinWaitlist: () => void }) => {
    const [hudPhase, setHudPhase] = useState<'idle' | 'listening' | 'processing'>('listening');

    return (
        <div className="flex flex-col items-center w-full">
            <motion.div variants={fadeIn} className="flex justify-center w-full z-0 relative mb-6">
                <ComparisonRace onPhaseChange={setHudPhase} />
            </motion.div>

            <motion.div variants={fadeIn} className="mt-2 z-10 relative">
                <VoxHUDMockup forcedState={hudPhase} />
            </motion.div>

            {/* Use case cards */}
            <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-12 max-w-3xl mx-auto w-full">
                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Zap className="w-6 h-6 text-[#D4AF37]" />
                    <span className="text-sm font-semibold text-white">Produtividade</span>
                    <span className="text-xs text-gray-400 text-center">Falar é 5x mais rápido que digitar</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Clock className="w-6 h-6 text-[#D4AF37]" />
                    <span className="text-sm font-semibold text-white">Economize tempo</span>
                    <span className="text-xs text-gray-400 text-center">E-mails, mensagens e textos em segundos</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Globe className="w-6 h-6 text-[#D4AF37]" />
                    <span className="text-sm font-semibold text-white">30 idiomas</span>
                    <span className="text-xs text-gray-400 text-center">Fale em português, inglês, espanhol e mais</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <Code2 className="w-6 h-6 text-[#D4AF37]" />
                    <span className="text-sm font-semibold text-white">Coding por voz</span>
                    <span className="text-xs text-gray-400 text-center">Dite código, funções e comandos no VS Code</span>
                </div>
            </motion.div>


        </div>
    );
};

export default function Home() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [billingPeriod, setBillingPeriod] = useState<"annual" | "monthly">("annual");
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

    // Typewriter: "Não digite." slow, then "Apenas fale." 5x faster
    const { displayed: typed1, done: done1 } = useTypewriter("Não digite.", 70, 400);
    const { displayed: typed2, done: done2 } = useTypewriter("Apenas fale.", 14, 0, done1);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37]/30 font-sans">

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 relative">
                            <img src="/logo.png" alt="VoxAIgo Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">VoxAIgo</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a href="#features" className="hover:text-white transition-colors">Recursos</a>
                        <a href="#video" className="hover:text-white transition-colors">Demo</a>
                        {/* <a href="#pricing" className="hover:text-white transition-colors">Preços</a> */}
                        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="#video" className="inline-block bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                            Garantir Acesso Antecipado
                        </a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#D4AF37]/8 rounded-full blur-[80px] -z-10" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-8"
                    >
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm font-medium text-gray-300 mb-8 md:mb-12">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                            </span>
                            Comece grátis — sem cartão ✨
                        </motion.div>

                        <div className="relative mb-8 min-h-[160px] md:min-h-[200px] flex flex-col items-center justify-center">
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] flex flex-col items-center justify-center gap-2">
                                <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-6">
                                    <span className="relative inline-block text-white/50">
                                        {typed1}
                                        {!done1 && <span className="animate-pulse ml-0.5 text-white/40">|</span>}
                                    </span>
                                    <span
                                        className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-[#E8D48B] to-amber-200 transition-opacity duration-150"
                                        style={{ opacity: done1 ? 1 : 0 }}
                                    >
                                        {typed2}
                                        {done1 && typed2.length < "Apenas fale.".length && (
                                            <span className="animate-pulse ml-0.5 text-amber-300">|</span>
                                        )}
                                    </span>
                                </div>
                                <span
                                    className="bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-[#E8D48B] to-amber-200 mt-2 transition-opacity duration-150"
                                    style={{ opacity: done1 ? 1 : 0 }}
                                >
                                    É 5x mais rápido.
                                </span>
                            </h1>

                            <div
                                className="text-xl md:text-2xl font-medium tracking-tight leading-snug mt-6 md:mt-8 max-w-3xl mx-auto transition-opacity duration-500"
                                style={{ opacity: done2 ? 1 : 0 }}
                            >
                                <span className="text-white block mb-1">Fale naturalmente.</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E8D48B] to-[#D4AF37] font-semibold block">Aparece instantaneamente.</span>
                            </div>

                            {/* Synced Hero Section (HUD + Race + Use Cases + FOMO CTA) */}
                            <div className="relative pt-8 sm:pt-10 z-10 font-sans mt-8 sm:mt-10">
                                <SyncedHeroSection onJoinWaitlist={() => setIsWaitlistOpen(true)} />
                            </div>
                        </div>

                        <motion.div variants={fadeIn} className="flex items-center justify-center gap-6 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                <span className="text-base">🍎</span> Verificado pela Apple
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                <Mic className="w-4 h-4" /> Comando de voz "Hey Vox"
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                <Shield className="w-4 h-4" /> Totalmente anônimo
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                <Unlock className="w-4 h-4" /> Funciona em qualquer app
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            < section id="video" className="py-24 px-6 bg-black relative z-20 md:-mt-10" >
                <div className="max-w-5xl lg:max-w-6xl mx-auto text-center mb-10">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 md:whitespace-nowrap">
                        Veja como o VoxAIgo pode fazer você <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E8D48B]">ganhar tempo.</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Dê o play e veja a mágica acontecer na prática.
                    </p>
                </div>
                <div className="max-w-5xl mx-auto">
                    <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(212,175,55,0.2)] bg-[#0F0F0F]">
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                src="https://www.tella.tv/video/vid_cmmm0pioh01sj04lbg4el0v0i/embed?b=0&title=0&a=1&loop=0&autoPlay=true&t=0&muted=1&wt=0&o=1"
                                allowFullScreen
                                allowTransparency
                            />
                        </div>
                    </div>
                </div>

                {/* Primary CTA moved under Video */}
                <div className="max-w-5xl mx-auto text-center mt-12 mb-8">
                    <button
                        onClick={() => setIsWaitlistOpen(true)}
                        className="group relative inline-flex items-center gap-2 px-8 py-4 md:px-10 md:py-5 rounded-full bg-white text-black border border-transparent hover:bg-black hover:text-white hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <span className="text-base md:text-lg font-bold transition-colors">
                            Garantir Acesso Antecipado <span className="font-light">→</span>
                        </span>
                    </button>
                    <p className="mt-4 text-xs text-gray-500 font-medium tracking-wide">Acesso antecipado 100% gratuito garantido para os primeiros.</p>
                </div>
            </section >


            {/* Transformation Section (Carousel) */}
            < section id="demo" className="py-24 px-6 bg-black relative" >


                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none"></div>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">
                            <span className="block mb-2 text-white">Fale naturalmente.</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E8D48B]">Aparece instantaneamente.</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            O VoxAIgo entende o contexto e se adapta ao que você precisa.
                        </p>
                    </div>

                    <Tabs />

                </div>
            </section >

            {/* Features Grid (Specific Use Cases) */}
            < section id="features" className="py-24 px-6 bg-black" >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">Mais tempo livre. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E8D48B]">Menos stress.</span></h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Pare de lutar com o teclado. O VoxAIgo se adapta ao seu estilo e faz o trabalho pesado para você.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Email Card */}
                        {/* Email Card */}
                        <div className="group bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                                    <Mail className="text-[#D4AF37]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">E-mails perfeitos, rápido</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Responda mensagens complexas enquanto caminha pela sala. O VoxAIgo transforma pensamentos soltos em e-mails profissionais bem estruturados.
                                </p>
                            </div>
                        </div>

                        {/* Universal Card */}
                        {/* Agente Vox Card */}
                        <div className="group bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                                    <Mic className="text-[#D4AF37]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">O Poder do Agente Vox</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Controle seu computador sem usar as mãos. Diga "Ei Vox, traduza isso para Inglês" ou "Ei Vox, modo programação" e deixe a mágica acontecer.
                                </p>
                            </div>
                        </div>

                        {/* Voice Commands / Code Card */}
                        {/* Voice Commands / Code Card */}
                        <div className="group bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                                    <Zap className="text-[#D4AF37]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Seus Próprios Templates</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Adicione seus próprios templates. Apenas jogue as informações em voz alta, e o VoxAIgo organiza tudo perfeitamente para você no formato configurado.
                                </p>
                            </div>
                        </div>

                        {/* Translation Card */}
                        {/* Live Coding Context (Spans 2 columns) */}
                        <div className="group bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 md:col-span-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-transparent opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.3)] border border-[#D4AF37]/30">
                                        <Terminal className="text-[#D4AF37]" />
                                    </div>
                                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/20">Modo Dev</span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white">Live Coding Sem Gastar Tokens</h3>
                                <p className="text-gray-300 leading-relaxed max-w-lg text-lg">
                                    Desenvolvedores: Poupem os tokens preciosos das suas IDEs (Cursor, Copilot). Dite a lógica complexa em linguagem natural e o Agente Vox cospe o bloco de código perfeitamente formatado, sem consumir sua franquia mensal do LLM.
                                </p>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="group bg-gradient-to-br from-[#D4AF37]/10 to-black border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center hover:border-[#D4AF37]/30 transition-all">
                            <div className="text-5xl font-bold text-white mb-2">20h+</div>
                            <p className="text-[#E8D48B] font-medium">Economizadas por mês</p>
                            <p className="text-gray-500 text-sm mt-4">Média baseada em usuários ativos</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* FOMO Button under Carousel */}
            < section className="pb-32 pt-8 bg-black" >
                <motion.div variants={fadeIn} className="text-center w-full">
                    <button
                        onClick={() => setIsWaitlistOpen(true)}
                        className="group relative inline-flex items-center gap-2 px-8 py-4 md:px-10 md:py-5 rounded-full bg-white text-black border border-transparent hover:bg-black hover:text-white hover:border-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <span className="text-base md:text-lg font-bold transition-colors">
                            Garantir Acesso Antecipado <span className="font-light">→</span>
                        </span>
                    </button>
                    <p className="mt-4 text-xs text-gray-500 font-medium tracking-wide">Acesso antecipado 100% gratuito garantido para os primeiros.</p>
                </motion.div>
            </section >

            {/* Wall of Love Testimonials */}
            < section className="py-24 bg-[#050505] border-y border-white/5 overflow-hidden" >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">O que dizem os primeiros <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E8D48B]">Beta Testers</span></h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Um seleto grupo de profissionais de 3 países está testando o VoxAIgo. Veja o que eles estão achando de produzir na velocidade do pensamento.</p>
                    </div>
                </div>
                <WallOfLove />
            </section >

            {/* Scarcity CTA (Waitlist Focus) */}
            < section className="py-24 px-6 bg-black relative overflow-hidden border-b border-white/5" >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[120px] -z-10" />
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-[#D4AF37]/30 text-xs font-bold text-[#E8D48B] mb-8 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
                        </span>
                        Vagas Limitadas para o Beta Fechado
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight leading-tight whitespace-nowrap">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#E8D48B]">Seja um dos primeiros</span> <span className="text-white">a parar de digitar.</span>
                    </h2>

                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Estamos liberando acessos graduais ao longo das próximas semanas. Entre na lista de espera VIP e garanta a sua ferramenta 5x mais rápida antes do lançamento público.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setIsWaitlistOpen(true)}
                            className="bg-white text-black px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] flex items-center gap-3 w-full sm:w-auto justify-center"
                        >
                            Garantir Acesso Antecipado
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="mt-4 text-xs text-gray-500 font-medium tracking-wide">Acesso antecipado 100% gratuito garantido para os primeiros.</p>
                </div>
            </section >

            {/* FAQ */}
            < section id="faq" className="py-24 px-6 bg-black" >
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: "Quanto tempo eu vou realmente economizar?",
                                a: "A pessoa média digita 40 palavras por minuto, mas fala 150. Usando o VoxAIgo para e-mails, documentos e código, nossos usuários economizam em média 20 horas por mês."
                            },
                            {
                                q: "Funciona com meus apps?",
                                a: "Sim. O VoxAIgo funciona como uma camada em cima do seu sistema (Windows ou Mac). Se você pode clicar e digitar, o Agente Vox funciona lá. VS Code, Slack, Word, Google Docs, etc."
                            },
                            {
                                q: "Como o VoxAIgo me ajuda a escrever código?",
                                a: "O 'Code Mode' é otimizado para entender terminologia técnica e sintaxe. Você diz 'função map array user', ele digita 'users.map((user) => ...)' corretamente."
                            },
                            {
                                q: "Posso ditar na minha própria língua?",
                                a: "Sim! Você fala em português e o VoxAIgo escreve em inglês, espanhol ou qualquer um dos 30 idiomas disponíveis. Sem precisar traduzir nada depois."
                            },
                            {
                                q: "O que é um agente inteligente?",
                                a: "É um assistente de inteligência artificial que trabalha para você. Diferente de ferramentas comuns que apenas respondem texto, o VoxAIgo capta o que você fala e interage onde você precisar, de forma automatizada e com contexto."
                            },
                            {
                                q: "Os meus dados são privados?",
                                a: "Sim. Todo o áudio é processado diretamente no seu computador, não saindo dali. Nenhuma informação deixa o seu computador para processamento, o que garante total segurança dos seus dados."
                            },
                            {
                                q: "Funciona sem internet?",
                                a: "Sim. O VoxAIgo também funciona offline quando necessário."
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
            </section >

            {/* Footer */}
            < footer className="py-12 border-t border-white/10 bg-black text-gray-400 text-sm" >
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 relative">
                            <img src="/logo.png" alt="VoxAIgo Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-white">VibeFlow | Agente Vox</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Termos</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                    </div>
                    <p>© 2026 VibeFlow. Desenvolvido para agilizar o seu dia a dia.</p>
                </div>
            </footer >
            <WaitlistOverlay isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
        </div >
    );
}
