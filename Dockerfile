# Étape 1 : Construction statique avec Vite+ et pnpm
FROM node:20-alpine AS builder
WORKDIR /app

# Dépendance nécessaire pour le moteur natif de Vite+ sous Alpine
RUN apk add --no-cache libstdc++

# Activation de pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Installation des dépendances
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Compilation des assets Vite
COPY . .
RUN pnpm run build

# Étape 2 : Serveur Nginx de production (calqué sur skyral.xyz)
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Nettoyage et copie des fichiers construits
RUN rm -rf ./*
COPY --from=builder /app/dist .

# Injection de la configuration racine Nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]