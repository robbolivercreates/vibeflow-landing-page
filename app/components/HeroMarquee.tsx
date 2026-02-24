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
.hero-ticker-item img {
  filter: grayscale(1) opacity(0.45);
  transition: filter 0.5s ease;
  display: block;
}
.hero-ticker-item:hover img {
  filter: grayscale(0) opacity(1);
}
`;

const Strip = () => (
    <>
        {apps.map((app) => (
            <div
                key={app.name}
                className="hero-ticker-item inline-flex items-center gap-3 mx-6 shrink-0"
            >
                <img
                    src={app.slug === 'slack' ? '/slack.svg' : `https://cdn.simpleicons.org/${app.slug}`}
                    alt={app.name}
                    width={26}
                    height={26}
                    loading="eager"
                />
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
