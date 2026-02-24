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
    SlidersHorizontal,
    Timer
} from 'lucide-react';
import HeroMarquee from './components/HeroMarquee';
import WallOfLove from './components/WallOfLove';

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
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                i++;
                setDisplayed(text.slice(0, i));
                if (i >= text.length) {
                    clearInterval(interval);
                    setDone(true);
                }
            }, speed);
            return () => clearInterval(interval);
        }, startDelay);
        return () => clearTimeout(timeout);
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
            name: "Texto", icon: AlignLeft, color: "text-green-400", bg: "bg-green-500",
            input: "então... tipo, o prazo era hoje né, mas a gente ainda não terminou, acho que precisamos de mais uns dois dias, sabe?",
            output: "O prazo era hoje, mas ainda não finalizamos. Precisamos de mais dois dias."
        },
        {
            name: "Chat", icon: MessageCircle, color: "text-teal-400", bg: "bg-teal-500",
            input: "cara esquece o que eu falei antes sobre sábado, pode sábado sim, que horas vc quer",
            output: "Esquece o que eu disse sobre sábado — pode sim! Que horas você quer?"
        },
        {
            name: "Código", icon: Code2, color: "text-blue-400", bg: "bg-blue-500",
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
            name: "Vibe Coder", icon: Wand2, color: "text-cyan-400", bg: "bg-cyan-500",
            input: "eu queria que, tipo, quando o usuário não tiver logado e tentar acessar aquela rota lá do dashboard, ele seja redirecionado pro login com uma mensagem dizendo que precisa fazer login antes",
            output: "Redirecionar usuário não autenticado que acessa /dashboard para /login com mensagem 'Faça login para continuar'.\n\n(-62% tokens. Zero perda de contexto técnico.)"
        },
        {
            name: "Email", icon: Mail, color: "text-orange-400", bg: "bg-orange-500",
            input: "fala pro fornecedor que o pagamento vai sair semana que vem, que teve um problema interno mas tá resolvido, pede pra ele confirmar se ainda tá de acordo",
            output: "Prezado, informamos que o pagamento será processado na próxima semana. Tivemos um contratempo interno que já foi solucionado. Por gentileza, confirme se o prazo ainda é conveniente. Atenciosamente,"
        },
        {
            name: "Formal", icon: Building2, color: "text-slate-400", bg: "bg-slate-600",
            input: "olha, a gente vai ter que adiar a reunião de amanhã, deu um problema aqui, tenta remarcar pra quinta ou sexta",
            output: "Prezados, em virtude de um imprevisto interno, precisamos reagendar a reunião prevista para amanhã. Sugerimos quinta ou sexta-feira como novas datas. Aguardamos confirmação. Atenciosamente,"
        },
        {
            name: "Social", icon: Megaphone, color: "text-pink-400", bg: "bg-pink-500",
            input: "trabalhei dois anos num produto que ninguém usou, e aprendi mais nesse fracasso do que em qualquer sucesso que tive",
            output: "Passei 2 anos construindo um produto que ninguém usou. 💀 E aprendi mais com esse fracasso do que com qualquer sucesso anterior. Às vezes o mercado é o melhor professor — mesmo quando a aula dói. 🧵"
        },
        {
            name: "X", icon: AtSign, color: "text-sky-400", bg: "bg-sky-500",
            input: "as pessoas acham que ser produtivo é fazer muita coisa, mas na verdade é fazer as coisas certas e ignorar o resto",
            output: "Produtividade não é fazer mais. É ter clareza suficiente para ignorar o que não importa. A maioria está ocupada. Poucos estão focados."
        },
        {
            name: "Resumo", icon: FileText, color: "text-indigo-400", bg: "bg-indigo-500",
            input: "então ficou combinado que o pedro termina a integração com pagamento até quarta, a ana cuida do design do checkout, e a gente apresenta pro cliente na sexta às três",
            output: "Resumo da Reunião\n• Pedro → Integração de pagamento (até quarta)\n• Ana → Design do checkout\n• Apresentação ao cliente: sexta, 15h"
        },
        {
            name: "Tópicos", icon: List, color: "text-teal-400", bg: "bg-teal-500",
            input: "preciso verificar os logs do servidor, atualizar a dependência do axios, falar com o time de QA sobre os testes e subir o PR antes do fim do dia",
            output: "• Verificar logs do servidor\n• Atualizar dependência (axios)\n• Alinhar com QA sobre testes\n• Subir PR até fim do dia"
        },
        {
            name: "Reunião", icon: Users, color: "text-slate-400", bg: "bg-slate-500",
            input: "certo, então ficou decidido que vamos migrar pra nuvem no Q3, o responsável vai ser o time do rafael, e a gente precisa de um plano de rollback antes de começar",
            output: "📋 Decisões\n• Migração para nuvem: Q3\n• Responsável: Time do Rafael\n• Pré-requisito: Plano de rollback aprovado antes do início"
        },
        {
            name: "UX Design", icon: PenTool, color: "text-purple-400", bg: "bg-purple-500",
            input: "o formulário de cadastro tá confuso, os campos tão muito juntos, a pessoa não sabe onde clicar, coloca mais espaço e deixa o botão de cadastrar mais óbvio",
            output: "Formulário de Cadastro — Melhorias\n• Aumentar espaçamento entre campos (mín. 16px)\n• Hierarquia visual: destaque o CTA principal\n• Botão 'Cadastrar': aumentar contraste e tamanho\n• Objetivo: reduzir fricção e abandono"
        },
        {
            name: "Tradução", icon: Languages, color: "text-rose-400", bg: "bg-rose-500",
            input: "fala que a proposta comercial tem validade de quinze dias e que qualquer dúvida é só responder esse email",
            output: "This commercial proposal is valid for 15 days. If you have any questions, feel free to reply to this email."
        },
        {
            name: "Criativo", icon: Palette, color: "text-orange-400", bg: "bg-orange-500",
            input: "escreve o começo de uma história de um programador que descobre que o bug que ele não consegue achar não existe no código, existe nele mesmo",
            output: "Eram 3h da manhã quando Lucas percebeu que havia revisado o mesmo trecho de código quarenta e sete vezes. O bug não estava ali. Talvez nunca estivesse. Ele fechou o laptop devagar, e pela primeira vez em anos, ficou com o silêncio."
        },
        {
            name: "Meu Modo", icon: SlidersHorizontal, color: "text-gray-400", bg: "bg-gray-500",
            input: "a gente tá com taxa de conversão baixa na página de preço",
            output: "Diagnóstico — Pricing Page\nCausa provável: proposta de valor não clara antes do preço. Teste: adicionar 3 bullets de benefício acima do CTA. Métrica: acompanhar conversão por 14 dias."
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

    const getGradient = (index: number) => {
        const colors = [
            "from-green-400 to-emerald-400",  // 0 Texto
            "from-teal-400 to-emerald-400",   // 1 Chat
            "from-blue-400 to-indigo-500",    // 2 Código
            "from-cyan-400 to-blue-500",      // 3 Vibe Coder
            "from-orange-400 to-amber-500",   // 4 Email
            "from-slate-500 to-gray-600",     // 5 Formal
            "from-pink-400 to-rose-500",      // 6 Social
            "from-sky-400 to-blue-400",       // 7 X
            "from-indigo-400 to-purple-500",  // 8 Resumo
            "from-teal-400 to-cyan-500",      // 9 Tópicos
            "from-slate-400 to-slate-500",    // 10 Reunião
            "from-purple-400 to-fuchsia-500", // 11 UX Design
            "from-rose-400 to-pink-500",      // 12 Tradução
            "from-orange-400 to-red-400",     // 13 Criativo
            "from-gray-400 to-gray-500"       // 14 Meu Modo
        ];
        return colors[index] || "from-gray-400 to-gray-600";
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
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-sm font-medium text-red-400 uppercase tracking-wider">O que você fala</span>
                        </div>
                        <div className="font-mono text-gray-400 text-base md:text-lg leading-relaxed italic transition-all duration-300">
                            "{tabs[activeTab].input}"
                        </div>
                        <div className="h-12 bg-white/5 rounded-lg flex items-center justify-center gap-1 opacity-50 mt-auto">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1 bg-red-500 rounded-full animate-audio-bar"
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
                    // VoxAIgo finished → show result phase
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
            < div className="flex items-center justify-between mb-6" >
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
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
            </div >

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

                {/* VoxAIgo Lane */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-green-400 uppercase flex items-center gap-2">
                            <Mic className="w-3 h-3" /> VoxAIgo (Voz)
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
        </div >
    );
};

export default function Home() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [billingPeriod, setBillingPeriod] = useState<"annual" | "monthly">("annual");

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
                        <a href="#demo" className="hover:text-white transition-colors">Demo</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Preços</a>
                        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">Entrar</a>
                        <a href="/login" className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                            Começar Agora
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
                                <span className="text-white">Fale, e a inteligência artificial digita.</span><br />
                                <span className="text-gray-400">
                                    Textos perfeitos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E8D48B] to-[#D4AF37] font-semibold">em qualquer app.</span>
                                </span>
                            </div>

                            <HeroMarquee />

                            {/* Badge 'Cinco vezes mais rápido' removida por redundância */}
                        </div>

                        {/* Use case cards */}
                        <motion.div variants={fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto">
                            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <Zap className="w-6 h-6 text-amber-400" />
                                <span className="text-sm font-semibold text-white">Produtividade</span>
                                <span className="text-xs text-gray-400 text-center">Falar é 5x mais rápido que digitar</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <Clock className="w-6 h-6 text-green-400" />
                                <span className="text-sm font-semibold text-white">Economize tempo</span>
                                <span className="text-xs text-gray-400 text-center">E-mails, mensagens e textos em segundos</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <Globe className="w-6 h-6 text-blue-400" />
                                <span className="text-sm font-semibold text-white">30 idiomas</span>
                                <span className="text-xs text-gray-400 text-center">Fale em português, inglês, espanhol e mais</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10">
                                <Code2 className="w-6 h-6 text-[#D4AF37]" />
                                <span className="text-sm font-semibold text-white">Coding por voz</span>
                                <span className="text-xs text-gray-400 text-center">Dite código, funções e comandos no VS Code</span>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                            <a href="/compra" className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]">
                                Começar Grátis
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md border border-white/10 flex items-center justify-center gap-2">
                                <Play className="w-5 h-5 fill-current" />
                                Ver como funciona
                            </a>
                        </motion.div>

                        <motion.div variants={fadeIn} className="pt-12 pb-8 flex justify-center w-full">
                            <ComparisonRace />
                        </motion.div>

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
            </section >

            {/* Video Section */}
            < section className="py-12 px-6 bg-black relative z-20 -mt-10" >
                <div className="max-w-5xl mx-auto">
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(168,85,247,0.2)] bg-[#0F0F0F] group">
                        {/* Placeholder for video content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300 cursor-pointer border border-white/20">
                                <Play className="w-8 h-8 fill-white text-white ml-1" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#E8D48B] to-[#D4AF37]"></div>

                        {/* Fake UI Overlay to make it look like app is running */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs text-white/70 border border-white/10">VoxAIgo Demo</div>
                        </div>
                    </div>
                </div>
            </section >


            {/* Transformation Section (Carousel) */}
            < section id="demo" className="py-20 px-6 bg-black relative" >


                <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none"></div>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">Fale naturalmente. <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Aparece instantaneamente.</span></h2>
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
                        <h2 className="text-3xl md:text-5xl font-bold">Mais tempo livre. <span className="text-[#D4AF37]">Menos stress.</span></h2>
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
                                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                                    <Mail className="text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">E-mails perfeitos, rápido</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Responda mensagens complexas enquanto caminha pela sala. O VoxAIgo transforma pensamentos soltos em e-mails profissionais bem estruturados.
                                </p>
                            </div>
                        </div>

                        {/* Universal Card */}
                        {/* Agente Vox Card */}
                        <div className="group bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <Mic className="text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">O Poder do Agente Vox</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Controle seu computador sem usar as mãos. Diga "Ei Vox, traduza isso para Inglês" ou "Ei Vox, modo programação" e deixe a mágica acontecer.
                                </p>
                            </div>
                        </div>

                        {/* Voice Commands / Code Card */}
                        {/* Voice Commands / Code Card */}
                        <div className="group bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                    <Zap className="text-amber-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Comandos e Correções</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Selecione um texto e diga "Deixe mais amigável" ou "Resuma isso". O VoxAIgo edita tudo instantaneamente, direto no app que você está usando.
                                </p>
                            </div>
                        </div>

                        {/* Translation Card */}
                        {/* Live Coding Context (Spans 2 columns) */}
                        <div className="group bg-[#0A0A0A] border border-cyan-500/20 rounded-3xl p-8 hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 md:col-span-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-blue-900/10 opacity-50"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-500/30">
                                        <Terminal className="text-cyan-400" />
                                    </div>
                                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">Modo Dev</span>
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
            {/* Wall of Love Testimonials */}
            < section className="py-24 bg-[#050505] border-y border-white/5 overflow-hidden" >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">Amado por quem mudou a forma de trabalhar</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Junte-se a milhares de profissionais que pararam de digitar e começaram a produzir na velocidade do pensamento.</p>
                    </div>
                </div>
                <WallOfLove />
            </section >

            {/* Pricing - Two Tiers */}
            < section id="pricing" className="py-24 px-6 bg-black relative overflow-hidden" >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/8 rounded-full blur-[120px] -z-10"></div>
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
                                -25%
                            </span>
                        </button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Free Plan */}
                    <div className="relative bg-[#0F0F0F] rounded-2xl p-8 border border-white/10 flex flex-col hover:border-white/20 transition-all duration-300">
                        <h3 className="text-2xl font-bold text-white mb-2">Grátis</h3>
                        <p className="text-gray-500 text-sm mb-6">Perfeito para experimentar o Agente Vox</p>
                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-5xl font-bold text-white">R$0</span>
                            <span className="text-gray-400 text-sm">/ para sempre</span>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            {[
                                "75 transcrições por mês",
                                "Modo Texto apenas (sem I.A.)",
                                "Português e Inglês",
                                "Seus dados nunca são armazenados",
                                "Sem Agente Vox",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-300 list-none">
                                    <CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </div>

                        <a href="/login" className="block w-full py-4 bg-white/5 text-white border border-white/10 rounded-xl font-bold text-lg hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-center">
                            Começar Grátis
                        </a>
                    </div>

                    {/* Pro Plan */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#D4AF37] to-[#E8D48B] rounded-2xl opacity-75 blur group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative bg-[#0F0F0F] rounded-2xl p-8 border border-white/10 h-full flex flex-col">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="bg-[#D4AF37]/20 text-[#E8D48B] text-xs font-bold px-3 py-1 rounded-full border border-[#D4AF37]/20">
                                    RECOMENDADO
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                            <p className="text-gray-500 text-sm mb-6">Para quem vive de produtividade</p>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-bold text-white">
                                    R${billingPeriod === "annual" ? "22,40" : "29,90"}
                                </span>
                                {billingPeriod === "annual" && (
                                    <span className="text-lg text-gray-500 line-through">R$29,90</span>
                                )}
                                <span className="text-gray-400 text-sm">/ mês</span>
                            </div>
                            {billingPeriod === "annual" && (
                                <p className="text-green-400 text-xs font-medium mb-6">Cobrado R$268,80/ano — economize R$90</p>
                            )}
                            {billingPeriod === "monthly" && (
                                <p className="text-gray-500 text-xs mb-6">Cobrado mensalmente</p>
                            )}

                            <div className="flex-1 space-y-4 mb-8">
                                {[
                                    "Transcrições ilimitadas",
                                    "15 modos com I.A. para cada situação",
                                    "Funciona com qualquer app (Windows & Mac)",
                                    "Agente Vox com comandos de voz (\"Hey Vox, email\")",
                                    "30 idiomas — fale em PT, receba em qualquer idioma",
                                    "Aprendizado do seu estilo pessoal",
                                    "Suporte prioritário + atualizações incluídas",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-gray-300 list-none">
                                        <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </div>

                            <a href="/login" className="block w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-white/10 text-center">
                                Começar Agora
                            </a>
                            <p className="text-xs text-center text-gray-500 mt-4">Cancele quando quiser. Sem multas.</p>
                        </div>
                    </div>
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
                                q: "Meus dados são privados?",
                                a: "Sim, 100%. O VoxAIgo processa sua fala de forma extremamente segura. A conexão é feita diretamente da sua máquina, sem armazenar seus áudios em nossos servidores. Seus dados são seus."
                            },
                            {
                                q: "Funciona sem internet?",
                                a: "O Plano Básico funciona 100% offline — sua voz é processada direto no seu Mac, sem sair da sua máquina. O Plano Pro usa a nuvem para os 15 modos de I.A., mas você escolhe quando usar."
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
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                    <p>© 2026 VibeFlow. Desenvolvido para agilizar o seu dia a dia.</p>
                </div>
            </footer >
        </div >
    );
}
