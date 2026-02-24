import React, { useState, useEffect } from 'react';
import { MessageSquare, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Achei que ia ser frescura, mas cara... eu ditei o escopo inteiro de um projeto no Notion passeando com o cachorro de manhã. Voltei pra casa e tava lá certinho, formatado.",
    author: "Felipe Almeida",
    role: "UX/UI Designer",
    twitter: "@falmeida_ux",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    quote: "No começo você estranha falar sozinho com o computador, mas no dia seguinte você já não quer digitar um email longo nunca mais na vida.",
    author: "Mariana Costa",
    role: "Product Manager",
    twitter: "@maricosta_pm",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d"
  },
  {
    quote: "O Modo Código é absurdo. Eu expliquei a lógica de um componente React complexo enquanto bebia café e o VoxAIgo cuspiu tudo na IDE.",
    author: "Thiago Silva",
    role: "Engenheiro Front-end",
    twitter: "@thiagodev",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d"
  },
  {
    quote: "Economizei fácil umas 5 horas na semana passada só parando de lutar com o teclado pra responder e-mail de cliente chato.",
    author: "Lucas Mendes",
    role: "Freelancer",
    twitter: "@lucasmendes_freela",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
  },
  {
    quote: "A tradução instantânea salvou minha vida nas calls com a gringa. Falo em português e o texto sai em inglês britânico perfeito no Slack.",
    author: "Camila Rocha",
    role: "Sales Executive",
    twitter: "@camilasales",
    avatar: "https://i.pravatar.cc/150?u=33"
  },
  {
    quote: "Finalmente um app que entende o português do dia a dia, com gíria e sotaque. Não precisa falar igual um robô.",
    author: "Bruno Carvalho",
    role: "Creator",
    twitter: "@brunocarvalho",
    avatar: "https://i.pravatar.cc/150?u=12"
  },
  {
    quote: "Eu mando áudio no WhatsApp pra mim mesmo pra não esquecer as coisas. Agora eu aperto um botão e o texto já sai formatado no meu To-Do. Muito melhor.",
    author: "Amanda Oliveira",
    role: "Head of Marketing",
    twitter: "@manda_mkt",
    avatar: "https://i.pravatar.cc/150?u=5"
  },
  {
    quote: "Eu achava que digitar era rápido até ver a velocidade que minha voz vira texto nessa parada. Mágico.",
    author: "Rafael Souza",
    role: "Desenvolvedor Backend",
    twitter: "@rafabackend",
    avatar: "https://i.pravatar.cc/150?u=42"
  },
  {
    quote: "Minha tendinite agradece demais. Sério, menos cliques, menos teclado, mais produtividade.",
    author: "Letícia Ribeiro",
    role: "Redatora Pleno",
    twitter: "@lele_copy",
    avatar: "https://i.pravatar.cc/150?u=21"
  }
];

export default function WallOfLove() {
  const [isHovered, setIsHovered] = useState(false);

  // Split into 3 columns
  const col1 = [...testimonials.slice(0, 3)];
  const col2 = [...testimonials.slice(3, 6)];
  const col3 = [...testimonials.slice(6, 9)];

  return (
    <div 
      className="relative overflow-hidden w-full h-[600px] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
      }}
    >
      <div className="flex gap-6 justify-center max-w-7xl mx-auto px-6 h-full absolute inset-0">
        
        {/* Column 1 - Scrolling UP */}
        <div className={`flex flex-col gap-6 w-full max-w-[350px] transition-transform duration-1000 ease-linear ${isHovered ? 'animate-none' : 'animate-scroll-up-slow'}`}>
          {/* We repeat the content twice to create an infinite loop effect */}
          {[...col1, ...col1, ...col1].map((t, i) => (
            <div key={`c1-${i}`} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white/5 shadow-lg group flex-shrink-0">
               <TestimonialHeader {...t} />
               <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">"{t.quote}"</p>
            </div>
          ))}
        </div>

        {/* Column 2 - Scrolling DOWN */}
        <div className={`hidden md:flex flex-col gap-6 w-full max-w-[350px] transition-transform duration-1000 ease-linear ${isHovered ? 'animate-none' : 'animate-scroll-down-slow'} -translate-y-1/2`}>
          {[...col2, ...col2, ...col2].map((t, i) => (
             <div key={`c2-${i}`} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white/5 shadow-lg group flex-shrink-0">
               <TestimonialHeader {...t} />
               <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">"{t.quote}"</p>
            </div>
          ))}
        </div>

        {/* Column 3 - Scrolling UP */}
        <div className={`hidden lg:flex flex-col gap-6 w-full max-w-[350px] transition-transform duration-1000 ease-linear ${isHovered ? 'animate-none' : 'animate-scroll-up-slow'} translate-y-24`}>
          {[...col3, ...col3, ...col3].map((t, i) => (
             <div key={`c3-${i}`} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white/5 shadow-lg group flex-shrink-0">
               <TestimonialHeader {...t} />
               <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">"{t.quote}"</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

function TestimonialHeader({ author, role, twitter, avatar }: { author: string, role: string, twitter: string, avatar: string }) {
  return (
    <div className="flex items-start gap-4 mb-4">
      <img src={avatar} alt={author} className="w-10 h-10 rounded-full border border-white/10" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm truncate">{author}</p>
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-xs text-gray-400">
          <span className="truncate">{twitter}</span>
          <span className="hidden md:block w-1 h-1 bg-gray-700 rounded-full"></span>
          <span className="truncate">{role}</span>
        </div>
      </div>
      <div className="flex text-[#D4AF37] gap-0.5 mt-1">
         <Star className="w-3 h-3 fill-current" />
         <Star className="w-3 h-3 fill-current" />
         <Star className="w-3 h-3 fill-current" />
         <Star className="w-3 h-3 fill-current" />
         <Star className="w-3 h-3 fill-current" />
      </div>
    </div>
  );
}
