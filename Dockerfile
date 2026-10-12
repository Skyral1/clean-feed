# Étape 1 : Construction statique avec Vite+ et pnpm
FROM node:20-alpine AS builder
WORKDIR /app

# Dépendance nécessaire pour le moteur natif de Vite+ sous Alpine
RUN apk add --no-cache libstdc++

# Activation de pnpm via Corepack intégré à Node.js
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copie des manifestes et du lockfile pnpm
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# Copie des sources et compilation Vite+
COPY . .
RUN pnpm run build

# Étape 2 : Serveur Nginx léger de production
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]