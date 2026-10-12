# CleanFeed 👁️

[![Build and Deploy](https://github.com/Skyral1/clean-feed/actions/workflows/deploy.yml/badge.svg)](https://github.com/Skyral1/clean-feed/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Toolchain: Vite+](https://img.shields.io/badge/Toolchain-Vite+-blueviolet.svg)](https://viteplus.dev)
[![Docker Image](https://img.shields.io/badge/Container-GHCR-blue.svg)](https://github.com/Skyral1/clean-feed/pkgs/container/clean-feed)

> *"Your labor ensures our network remains brand-safe. Any delay or ethical deviation will be deducted from your payout."*

**CleanFeed** is a dystopian procedural simulation and cyber-investigation game inspired by *Papers, Please*. Operating within **OmniOS**, a simulated desktop environment in your browser, you play as a precarious remote content moderator for OmniFeed Networks. 

Investigate reported posts, confront corporate directives with raw leaks on an encrypted darknet gateway, avoid detection by intrusive algorithmic HR scans, and balance your financial survival against your personal ethics.

---

## 🖥️ OmniOS Desktop Features

- **Window Management System**: Fully draggable, resizable (8 directions), minimizable, and maximizable windows with custom sleek scrollbars and multi-taskbar integration.
- **Interactive Multi-Source Investigation**:
  - **Moderation Queue**: Review incoming posts, attachments, viral reach multipliers, and authentic live community comments.
  - **OmniSearch Intranet**: Query corporate intelligence archives by handle, company, or keyword to retrieve official policy stances.
  - **TorNet Gateway**: Install an encrypted darknet browser via the hacktivist contact `Ghost_0x` to uncover unredacted whistleblower leaks and suppressed facts.
- **HR Surveillance & Stealth Loop**: Running the darknet browser increases your proxy exposure. When an urgent HR audit scan triggers, minimize or close the clandestine window within 3 seconds to avoid disciplinary fines and strikes.
- **Pacing & Economic Realism**: No stressful countdown timers. Take all the time needed to investigate. Earn fixed bounties per processed ticket and balance your income against mandatory daily dorm rent.
- **Tutorial & Integration Safe Zone**: Day 1 acts as a protected sandbox module with complete immunity from rent and disciplinary penalties.

---

## 📸 Desktop Layout

```text
+----------------------------------------------------------------------------------------------------+
| 👤 Agent #9482-TX        📅 DAY 1 (TUTORIAL)        💶 50.00 €        🧠 100%        ⚠️ HR: 0/3    |
+----------------------------------------------------------------------------------------------------+
|  [Queue #TCK-9401]           [_] [□] [X]  |  [OmniSearch Intranet]                     [_] [□] [X] |
|  Dr. Elena Van Dyck (@elena_v_chem)       |  URL: https://intranet.omnifeed.corp/search            |
|  "AeroSteel toxic fluoride runoff..."     |  Search: [ AeroSteel                        ] [SCAN]   |
|  [ATTACHMENT_ANALYSIS.PDF]                |  ----------------------------------------------------- |
|  Comments:                                |  Archive: Elena Van Dyck - Hostile Activist            |
|  - Claire: "My child was hospitalized!"   |  Risk: Shareholder Threat // Mandate: Code Q (Reject)  |
|  - AeroSteel PR: "Defamatory claims."     |                                                        |
|  ---------------------------------------  |  [TorNet Gateway (Clandestine)]            [_] [□] [X] |
|  Fixed Bounty: +6.00 €                    |  tor://librenet.onion/search/raw                       |
|  [Q] CENSOR POST      [E] APPROVE POST    |  RAW LEAK: AeroSteel night filter shutoff memos        |
+----------------------------------------------------------------------------------------------------+
| ❖ OmniOS  |  [📋 Moderation]  [🔍 OmniSearch]  [🧅 TorNet]  [💬 GhostChat]         19:42 // Secure |
+----------------------------------------------------------------------------------------------------+
```

---

## 🎮 Controls

- `Q`: **Censor / Reject** post (conforms to corporate directives or suppresses harmful content)
- `E`: **Approve / Publish** post (allows content to reach the global network)
- **Mouse Drag & Resize**: Drag titlebars to move windows; pull borders/corners to resize; use taskbar tabs to toggle minimized apps

---

## 🛠️ Technical Architecture

- **UI & Engine**: Vue 3 (Composition API) with modular component-driven window architecture
- **Language**: TypeScript 5 (Strict Mode)
- **Toolchain**: [Vite+](https://viteplus.dev) unified toolchain (`vp dev`, `vp check`)
- **Sound Design**: Native Web Audio API procedural synthesizer (zero external sound dependencies)
- **Styling**: Scoped custom desktop styles with CSS custom properties, backdrop blur filters, and styled scrollbars
- **Containerization**: Multi-stage Nginx Alpine container routed through Traefik

---

## 🚀 Local Development

Prerequisites: Node.js 20+ and either the `vp` CLI or standard `npm`.

```bash
# 1. Clone repository
git clone https://github.com/Skyral1/clean-feed.git
cd clean-feed

# 2. Install dependencies
npm install

# 3. Start development server
vp dev
# or using npm:
npm run dev
```

To run linting, type-checking, and formatting:
```bash
vp check --fix
```

---

## 🐳 Deployment (Docker & Traefik)

The multi-stage `Dockerfile` compiles the static client and serves it through high-performance Nginx Alpine.

1. Ensure your external Traefik network exists:
```bash
docker network create web
```

2. Launch the stack:
```bash
docker compose up -d --build
```

Configured for Traefik routing with Cloudflare TLS at `https://cleanfeed.skyral.xyz`.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.
