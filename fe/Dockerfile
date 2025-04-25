# Base stage
FROM node:23-alpine AS base
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./

# Development stage
FROM base AS development
RUN pnpm install
COPY . .
EXPOSE 80 
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "80"]

# Builder stage (used for production)
FROM base AS builder
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
