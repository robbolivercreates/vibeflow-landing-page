import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Além de rápido, ele corrige meus erros de português automaticamente. Eu falo do meu jeito e o texto sai impecável. Parece que eu contratei um editor pessoal.",
    author: "Felipe A.",
    role: "UX/UI Designer",
  },
  {
    quote: "Aquele relatório semanal que me tomava 1 hora? Agora eu falo tudo em 8 minutos e o VoxAIgo formata certinho, com tópicos e tudo. Sexta-feira virou outro dia.",
    author: "Mariana C.",
    role: "Product Manager",
  },
  {
    quote: "Eu gastava 500 requests do Cursor por dia. Com o VibeCoder, meus prompts ficam 62% menores e eu rendo o dobro com a mesma franquia. Pagou o Pro no primeiro dia.",
    author: "Thiago S.",
    role: "Engenheiro Front-end",
  },
  {
    quote: "Eu escrevo errado, troco letra, como acento... e o VoxAIgo entende tudo e já entrega o texto certinho. É a ferramenta mais útil que eu tenho no Mac, disparado.",
    author: "Lucas M.",
    role: "Freelancer",
  },
  {
    quote: "Antes eu demorava 5 minutos pra montar uma mensagem pro cliente. Agora falo e em 10 segundos tá lá, sem erro, formatado e profissional. Os clientes até elogiam.",
    author: "Camila R.",
    role: "Sales Executive",
  },
  {
    quote: "Eu digitava devagar e errava muito. Com o VoxAIgo eu falo na velocidade que penso e o texto sai pronto, corrigido e bonito. Mudou completamente meu dia a dia.",
    author: "Bruno C.",
    role: "Creator",
  },
  {
    quote: "Não é só rapidez — ele deixa tudo prontinho. Pontuação, parágrafo, formatação. Eu falo bagunçado e o resultado parece que eu passei meia hora revisando.",
    author: "Amanda O.",
    role: "Head of Marketing",
  },
  {
    quote: "Minha tendinite tava ficando séria de tanto digitar. Desde que comecei a ditar, a dor sumiu e minha produtividade triplicou. Melhor investimento do ano.",
    author: "Rafael S.",
    role: "Desenvolvedor Backend",
  },
  {
    quote: "Testei o trial de 7 dias e no segundo dia já assinei. De todas as ferramentas que uso, essa é a que mais faz diferença no meu dia. Sem exagero.",
    author: "Letícia R.",
    role: "Redatora Pleno",
  },
  {
    quote: "Respondo 50 emails por dia. Antes eu levava a manhã inteira, agora em 1 hora tá tudo feito. E o melhor: sem aquele erro de digitação que dá vergonha.",
    author: "Pedro H.",
    role: "Analista de QA",
  },
  {
    quote: "É a primeira ferramenta que eu abro quando ligo o Mac. Uso pra tudo: email, Slack, Notion, código. Não consigo mais imaginar trabalhar sem.",
    author: "Rodrigo L.",
    role: "Advogado",
  },
  {
    quote: "Falo em português e ele traduz pra inglês na hora, direto no Slack. E não é tradução robótica — sai natural, como se eu soubesse inglês fluente.",
    author: "Juliana F.",
    role: "Consultora de Gestão",
  }
];

const css = `
@keyframes wall-scroll-up {
  0% { transform: translateY(0); }
  100% { transform: translateY(-33.333%); }
}
@keyframes wall-scroll-down {
  0% { transform: translateY(-33.333%); }
  100% { transform: translateY(0); }
}
.wall-col-up {
  animation: wall-scroll-up 60s linear infinite;
}
.wall-col-down {
  animation: wall-scroll-down 60s linear infinite;
}
`;

export default function WallOfLove() {
  const col1 = [...testimonials.slice(0, 4)];
  const col2 = [...testimonials.slice(4, 8)];
  const col3 = [...testimonials.slice(8, 12)];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        className="relative overflow-hidden w-full h-[600px] select-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <div className="flex gap-6 justify-center max-w-7xl mx-auto px-6 h-full absolute inset-0">

          {/* Column 1 - Scrolling UP */}
          <div className="wall-col-up flex flex-col gap-6 w-full max-w-[350px]">
            {[...col1, ...col1, ...col1].map((t, i) => (
              <Card key={`c1-${i}`} {...t} />
            ))}
          </div>

          {/* Column 2 - Scrolling DOWN */}
          <div className="wall-col-down hidden md:flex flex-col gap-6 w-full max-w-[350px]">
            {[...col2, ...col2, ...col2].map((t, i) => (
              <Card key={`c2-${i}`} {...t} />
            ))}
          </div>

          {/* Column 3 - Scrolling UP */}
          <div className="wall-col-up hidden lg:flex flex-col gap-6 w-full max-w-[350px]" style={{ animationDelay: '-15s' }}>
            {[...col3, ...col3, ...col3].map((t, i) => (
              <Card key={`c3-${i}`} {...t} />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

function Card({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-[#D4AF37]/30 hover:bg-white/5 shadow-lg group flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-semibold text-white text-sm">{author}</span>
          <span className="text-gray-600 mx-1.5">·</span>
          <span className="text-xs text-gray-500">{role}</span>
        </div>
        <div className="flex text-[#D4AF37] gap-0.5">
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
        </div>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">
        "{quote}"
      </p>
    </div>
  );
}
