# 🚀 Registro de Refatoração: VibeFlow 2.0 Landing Page
_Data: Março de 2026_

Este documento registra as principais remoções e simplificações feitas na Landing Page durante a migração para o modelo de **Exclusividade e Lista de Espera (Waitlist)**, focado em alta conversão e padrão de design Apple (foco, ritmo e respiro).

## 🗑️ Elementos Removidos & Justificativas (UX/CRO)

### 1. Seção de Preços (Pricing Tiers) Completa
- **Removida:** A tabela inteira que dividia os planos (Free vs Pro).
- **Removido:** O link âncora "Preços" do Header de navegação principal.
- **Por quê:** O foco do funil mudou para captar `early adopters` para a Lista de Espera Alpha. Apresentar preços agora cria "fricção de venda" antes mesmo do usuário testar o MVP. O objetivo atual é gerar desejo e escassez, não comparar custos.

### 2. Botões de "Entrar" (Login)
- **Removido:** Botão/Link "Entrar" que ficava na barra de navegação principal.
- **Por quê:** Novos visitantes se confundiam tentando fazer login ou buscar um dashboard web aberto. Como o acesso atual é fechado/controlado (Waitlist), remover essa rota falsa elimina a evasão do funil de onboarding principal.

### 3. Chamadas de Topo Agressivas ("Download Mac")
- **Removido:** O CTA imediato de "Download Mac" ou "Acesso Direto" sem qualificação que existia logo na entrada.
- **Substituído por:** CTAs focados no conceito de `Garantir Acesso Antecipado` que abrem um Modal progressivo de captura de e-mails, com os botões reposicionados *abaixo* das demonstrações de valor (Live Race e Vídeo).

### 4. Textos Sub-CTA Genéricos / CAIXA ALTA
- **Removido:** O micro-texto "Nenhum cartão de crédito necessário hoje" e chamadas gritantes em dourado MAIÚSCULO abaixo dos rótulos dos botões (ex: "SEJA UM DOS PRIMEIROS").
- **Substituído por:** Frases de suporte neutras e corporativas (`text-gray-500`, tamanho `text-xs`). O foco de clique deve ser 100% no botão principal e não no texto secundário.

### 5. Links de Distração (Redes Sociais Não Estratégicas)
- **Removido:** Link solto para o Twitter (`X`) no rodapé (Footer) e links fantasmas não operacionais.
- **Por quê:** Na filosofia de "One Page, One Action", cada link de saída é um vazamento potencial do funil principal. O usuário deve ser mantido na página o máximo possível.

## ✅ Saldo da Ação
Com essas partes "pesadas" e dispersas removidas, a página passa de ser uma "vitrine genérica de SaaS" para ser uma **Página Estilo Keynote/Release da Apple**, blindada para direcionar exatamente o usuário ao único objetivo que importa: O desejo ardente de clicar em **"Garantir Acesso Antecipado"**.
