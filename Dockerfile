# Construction statique avec Vite+
FROM node:20-alpine AS builder
WORKDIR /app

# Dépendance nécessaire pour le moteur natif de Vite+ sous Alpine
RUN apk add --no-cache libstdc++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Image légère Nginx de production
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]