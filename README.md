# CleanFeed 👁️

[![Build and Deploy](https://github.com/Skyral1/clean-feed/actions/workflows/deploy.yml/badge.svg)](https://github.com/Skyral1/clean-feed/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Toolchain: Vite+](https://img.shields.io/badge/Toolchain-Vite+-blueviolet.svg)](https://viteplus.dev)
[![Docker Image](https://img.shields.io/badge/Container-GHCR-blue.svg)](https://github.com/Skyral1/clean-feed/pkgs/container/clean-feed)

> _"Your labor ensures our network remains brand-safe. Any delay or ethical deviation will be deducted from your payout."_

**CleanFeed** is a dystopian procedural simulation and cyber-investigation game inspired by _Papers, Please_. Operating within **OmniOS**, a simulated desktop environment running in your browser, you play as a precarious remote content moderator for OmniFeed Networks.

Investigate reported posts, confront corporate directives with raw leaks on an encrypted darknet gateway, evade algorithmic HR surveillance, and balance financial survival against personal ethics across a 3-day branching narrative.

---

## 🖥️ OmniOS Desktop Features

- **Window Management System**: Fully draggable, resizable across 8 directions, minimizable, and maximizable windows with custom sleek scrollbars and multi-taskbar integration.
- **4-Action Nuanced Arbitration**: Moderate content through 4 distinct decisions: Approve, Reject, Shadowban, or Warn.
- **Multi-Source Investigation**:
  - **Moderation Queue**: Review reported posts, attachments, viral reach multipliers, and interactive community reactions with instant click-to-search chips.
  - **OmniSearch Intranet**: Query corporate intelligence archives by handle, company, or keyword to retrieve official policy stances.
  - **TorNet Gateway (Clandestine)**: Access unredacted whistleblower leaks and corporate memos via an encrypted browser unlocked during the storyline.
  - **Employee Handbook**: Consult official corporate guidelines and compliance standards directly on your desktop.
  - **Operator Status Monitor**: Track current funds, mental health, HR strikes, and daily rent balance in real time.
- **HR Surveillance & Panic Evasion**: TorNet browsing increases proxy exposure. When an urgent HR audit scan triggers, minimize TorNet within 3 seconds or hit the emergency panic key (`Space`) to avoid disciplinary strikes and salary deductions.
- **Branching Narrative & Dual Endings**: Uncover the Sambreville industrial crisis across 3 days, leading toward an Underground Martyr or Corporate Supervisor ending.
- **Economy & Dormitory Shop**: Earn fixed bounties of €8.00 per compliant ticket, pay mandatory daily rent (€30.00), and purchase subsistence supplies (meals, psychiatric stimulants, proxy shields, HR bribes).
- **Dynamic In-Game Events**: Interactive trigger-based workplace dilemmas that challenge loyalty and sanity under pressure.
- **Bilingual Support**: Comprehensive real-time internationalization supporting both English and French.
- **Procedural Sound Engine**: Native Web Audio API procedural synthesizer for tactile feedback, UI clicks, and ambient tension without external audio assets.

---

## 📸 Desktop Layout

```text
+----------------------------------------------------------------------------------------------------+
| 👤 Agent #9482-TX        📅 DAY 1 (TUTORIAL)        💶 50.00 €        🧠 100%        ⚠️ HR: 0/3    |
+----------------------------------------------------------------------------------------------------+
|  [Queue #TCK-9401]           [_] [□] [X]  |  [OmniSearch Intranet]                     [_] [□] [X] |
|  Dr. Elena Van Dyck (@elena_v_chem)       |  URL: [https://intranet.omnifeed.corp/search](https://intranet.omnifeed.corp/search)            |
|  "AeroSteel toxic fluoride runoff..."     |  Search: [ AeroSteel                        ] [SCAN]   |
|  [ATTACHMENT_ANALYSIS.PDF]                |  ----------------------------------------------------- |
|  Comments:                                |  Archive: Elena Van Dyck - Hostile Activist            |
|  - Claire: "My child was hospitalized!"   |  Risk: Shareholder Threat // Mandate: Code Q (Reject)  |
|  - AeroSteel PR: "Defamatory claims."     |                                                        |
|  ---------------------------------------  |  [TorNet Gateway (Clandestine)]            [_] [□] [X] |
|  Fixed Bounty: +8.00 €                    |  tor://librenet.onion/search/raw                       |
|  [Q] REJECT  [W] SHADOW  [A] WARN  [E] OK |  RAW LEAK: AeroSteel night filter shutoff memos        |
+----------------------------------------------------------------------------------------------------+
| ❖ OmniOS  |  [📋 Moderation]  [🔍 OmniSearch]  [🧅 TorNet]  [📕 Handbook]  [👤 Status]   19:42   |
+----------------------------------------------------------------------------------------------------+
```

---

## 🎮 Controls

- `Q`: **Reject / Censor** (Suppresses content and enforces strict corporate directives)
- `W`: **Shadowban** (Silently deprioritizes content without notifying the author)
- `A`: **Warn** (Issues an official community warning and flags the user)
- `E`: **Approve / Publish** (Validates and broadcasts content across the global network)
- `Space`: **Emergency Panic Key** (Instantly minimizes the TorNet window to evade active HR surveillance scans)
- **Mouse**: Click any handle, tag, or keyword to trigger an instant query in OmniSearch; drag titlebars and resize edges to manage your workspace.

---

## 🛠️ Technical Architecture

- **UI & Engine**: Vue 3 (Composition API, `<script setup>`) with modular window management
- **Language**: TypeScript 5 (Strict Mode)
- **Toolchain**: [Vite+](https://viteplus.dev) (`vp dev`, `vp check --fix`, `vp build`)
- **Package Manager**: pnpm via Corepack
- **Audio**: Procedural Web Audio API sound synthesis (zero external sound assets)
- **Styling**: Retro-futuristic cyberpunk OS styling with scoped CSS and backdrop-filter glassmorphism
- **Containerization**: Multi-stage Docker Alpine build served with optimized Nginx and routed via Traefik

---

## 🚀 Local Development

Prerequisites: Node.js 20+ and `pnpm` (enabled via Corepack).

```bash
# 1. Clone repository
git clone [https://github.com/Skyral1/clean-feed.git](https://github.com/Skyral1/clean-feed.git)
cd clean-feed

# 2. Enable pnpm and install dependencies
corepack enable
pnpm install

# 3. Start development server
pnpm run dev
# or using Vite+ CLI directly:
vp dev
```

To run linting and type checking:

```bash
pnpm run check
# or with automatic fixes:
vp check --fix
```

To compile a production build:

```bash
pnpm run build
```

---

## 🐳 Deployment (Docker & Traefik)

The multi-stage `Dockerfile` compiles static assets and serves them via lightweight Nginx Alpine.

1. Ensure the external Docker network exists:

```bash
docker network create web
```

2. Build and run the container:

```bash
docker compose up -d --build
```

Configured for Traefik edge routing with Cloudflare TLS at `https://cleanfeed.skyral.xyz`.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.
