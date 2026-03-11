import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Roteirizar meus roteiros falando solto e ver a estrutura ficar pronta na tela quase que lendo meus pensamentos me deu um superpoder. Economizei umas 10h essa semana.",
    author: "Felipe A.",
    role: "Video Creator",
  },
  {
    quote: "Achei que seria só um ditado de texto, mas mudei toda a minha rotina. Eu solto minhas análises teóricas complexas andando pelo quarto e o texto sai organizado e formal.",
    author: "Elena K.",
    role: "Pesquisadora Acadêmica",
  },
  {
    quote: "A precisão técnica é de outro mundo. Dito meus comandos num fluxo livre e o código sai formatado perfeitamente na primeira tentativa. Minha eficiência triplicou.",
    author: "Marcus J.",
    role: "Engenheiro de Software",
  },
  {
    quote: "Mudou o jeito que eu trabalho pra sempre. Minha tendinite atacava todo mês de tanto digitar. Hoje deito no sofá e dito os artigos da semana inteira como se tivesse conversando.",
    author: "Lucas M.",
    role: "Redator Freelancer",
  },
  {
    quote: "Achei que a máquina ia engasgar nos meus jargões e estratégias de marketing, mas ela entende tudo. Responder clientes e criar briefings ficou rápido demais.",
    author: "Sarah W.",
    role: "Head de Aceleração",
  },
  {
    quote: "Criaram um monstro kkkkk. Meu fluxo pra planejar conteúdo é outro agora. Eu apenas falo o que quero transmitir no vídeo e a descrição sai pronta.",
    author: "Bruno C.",
    role: "Editor de Shorts/Reels",
  },
  {
    quote: "Mágico. Ele corrige a pontuação e tira os meus 'ééé...' e 'hmmm...' da fala automaticamente no meio da aula. Terminar material didático nunca foi tão indolor.",
    author: "Hiroshi T.",
    role: "Professor EAD",
  },
  {
    quote: "Construo jogos sozinho e costumava travar muito codando a UI. Poder ditar os menus em voz alta e ver o componente brotar na tela na mesma hora é bizarro de bom.",
    author: "Rafael S.",
    role: "Game Developer Indie",
  },
  {
    quote: "Eu digitava devagar pra caramba e demorava nas mensagens com a equipe. Hoje todo mundo se assusta achando que eu fiz curso de datilografia. Muito fluido.",
    author: "Chloe D.",
    role: "Community Manager",
  },
  {
    quote: "Falo tudo rápido, misturando inglês com português, termos de relatórios... E o resultado no final sempre sai impecável, polido e profissional. Gênio.",
    author: "Pedro H.",
    role: "Analista de Dados",
  },
  {
    quote: "A precisão jurídica e a fluidez do sistema são altíssimas. Parei de brigar com o teclado e agora gasto meu tempo onde realmente importa: pensando na estratégia.",
    author: "Alessandro G.",
    role: "Advogado Tributário",
  },
  {
    quote: "Descobri o ouro. Organizo minhas planilhas financeiras lendo as coisas em voz alta enquanto tomo café. Sinto que destravei uma habilidade que eu não sabia que precisava.",
    author: "Juliana F.",
    role: "Contadora Autônoma",
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
