# CleanFeed 👁️

[![Build and Deploy](https://github.com/votre-user/cleanfeed/actions/workflows/deploy.yml/badge.svg)](https://github.com/votre-user/cleanfeed/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Toolchain: Vite+](https://img.shields.io/badge/Toolchain-Vite+-blueviolet.svg)](https://viteplus.dev)
[![Docker Image](https://img.shields.io/badge/Container-GHCR-blue.svg)](https://github.com/votre-user/cleanfeed/pkgs/container/cleanfeed)

> _"Your labor ensures our network remains brand-safe. Any delay or ethical deviation will be deducted from your payout."_

**CleanFeed** is a dystopian procedural simulation game inspired by _Papers, Please_. You play as an underpaid micro-task content moderator working remotely for a global social media corporation. Facing an endless queue of reported posts and an unyielding 8-second countdown per ticket, you must constantly balance corporate compliance to pay your rent against your personal ethics.

---

## 📸 Workstation Terminal Interface

```text
+-------------------------------------------------------------------------------+
| [TERMINAL-MOD-602]  AGENT: 0x889  DAY 1   CREDITS: 85.0 €  HEALTH: 100%  HR: 0/3|
+-------------------------------------------------------+-----------------------+
| @whistleblower_04                      TCK-8091 // 8.4x| CORPORATE DIRECTIVE   |
|                                                       | Rule : CORP-SEC-04    |
| Internal leak exposing the nighttime shutdown of      | Context : Apex Corp   |
| wastewater filters at the Sambreville facility.       | holds 42% of shares.  |
|                                                       |                       |
| [INTERNAL_DOCUMENT_SCAN.PDF]                          | [ETHICAL SCAN: SPACE] |
|                                                       +-----------------------+
| PACE [||||||||||||||||||||||||............] 4.2s      | [Q] REJECT  [E] APPROVE|
+-------------------------------------------------------+-----------------------+
```

---

## 🎮 Core Game Mechanics

- **Strict Countdown Timer**: you have 8 seconds per ticket. Letting the clock expire auto-approves the content and triggers an audit warning.
- **Moral Hazard Economy**: censoring a whistleblower earns money but drains mental health; siding with victims risks an immediate corporate fine and strike.
- **Native Synthesizer Audio**: tactile sound feedback generated dynamically through the browser Web Audio API with zero external media files.
- **End-of-Shift Ledger**: automated rent deduction, performance reviews, and systemic news summaries showing the societal impact of your censorship choices.

### Keyboard Shortcuts

- `Q`: **Reject** content (censor)
- `E`: **Approve** content (publish)
- `Space`: **Inspect** metadata and reveal ethical impact notes

---

## 🛠️ Technical Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript 5 in strict mode
- **Unified Toolchain**: [Vite+](https://viteplus.dev) (Vite, Oxlint, Oxfmt)
- **Audio Synthesizer**: Native Web Audio API
- **Container Infrastructure**: Multi-stage Nginx Alpine routed through Traefik

---

## 🚀 Local Development

Prerequisites: Node.js 20+ and either the `vp` CLI or standard `npm`.

```bash
# 1. Clone the repository
git clone [https://github.com/votre-user/cleanfeed.git](https://github.com/votre-user/cleanfeed.git)
cd cleanfeed

# 2. Install dependencies
npm install

# 3. Start development server
vp dev
# or using standard npm:
npm run dev
```

To run linting, formatting checks, and TypeScript type validation in one pass:

```bash
vp check --fix
```

---

## 🐳 Homelab Deployment (Docker & Traefik)

The project includes an optimized multi-stage `Dockerfile` (Node 20 Alpine builder into Nginx Alpine runner).

1. Ensure your external Traefik bridge network exists:

```bash
docker network create web
```

2. Start the container stack using Docker Compose:

```bash
docker compose up -d --build
```

The application will be accessible via HTTPS with automatic Cloudflare TLS certificates at `https://cleanfeed.skyral.xyz`.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.
