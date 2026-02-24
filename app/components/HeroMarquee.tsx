'use client';

import React from 'react';

/**
 * HeroMarquee
 *
 * Uses cdn.simpleicons.org for 100% correct brand logos.
 * CSS grayscale(1) → grayscale(0) on hover for elegant dark-mode aesthetic.
 * Fixed width/height prevents async layout shifts (no jitter).
 * Seamless loop: two identical strips, GPU translateX(-50%) animation.
 */

const apps = [
    { name: 'WhatsApp', slug: 'whatsapp' },
    { name: 'ChatGPT', slug: 'openai' },
    { name: 'Gmail', slug: 'gmail' },
    { name: 'Slack', slug: 'slack' },
    { name: 'GitHub', slug: 'github' },
    { name: 'Notion', slug: 'notion' },
    { name: 'Figma', slug: 'figma' },
    { name: 'Canva', slug: 'canva' },
    { name: 'Trello', slug: 'trello' },
    { name: 'Asana', slug: 'asana' },
    { name: 'Discord', slug: 'discord' },
    { name: 'Google Docs', slug: 'googledocs' },
    { name: 'Telegram', slug: 'telegram' },
    { name: 'Instagram', slug: 'instagram' },
    { name: 'Google Drive', slug: 'googledrive' },
    { name: 'Google Sheets', slug: 'googlesheets' },
];

const css = `
@keyframes hero-ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.hero-ticker {
  display: inline-flex;
  flex-wrap: nowrap;
  animation: hero-ticker 35s linear infinite;
  will-change: transform;
}
.hero-ticker-item img, .hero-ticker-item svg {
  filter: grayscale(1) opacity(0.45);
  transition: filter 0.5s ease;
  display: block;
}
.hero-ticker-item:hover img, .hero-ticker-item:hover svg {
  filter: grayscale(0) opacity(1);
}
`;

const SlackIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" fill="#E01E5A" />
        <path d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" fill="#36C5F0" />
        <path d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" fill="#2EB67D" />
        <path d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" fill="#ECB22E" />
    </svg>
);

const Strip = () => (
    <>
        {apps.map((app) => (
            <div
                key={app.name}
                className="hero-ticker-item inline-flex items-center gap-3 mx-6 shrink-0"
            >
                {app.slug === 'slack' ? (
                    <SlackIcon />
                ) : (
                    <img
                        src={`https://cdn.simpleicons.org/${app.slug}`}
                        alt={app.name}
                        width={26}
                        height={26}
                        loading="eager"
                    />
                )}
                <span className="text-[15px] font-semibold text-gray-400 whitespace-nowrap">
                    {app.name}
                </span>
            </div>
        ))}
    </>
);

export default function HeroMarquee() {
    return (
        <div className="mt-8 w-full max-w-5xl mx-auto overflow-hidden relative">
            {/* Edge fades */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <style dangerouslySetInnerHTML={{ __html: css }} />

            <div className="hero-ticker py-4">
                <Strip />
                <Strip />
            </div>
        </div>
    );
}
