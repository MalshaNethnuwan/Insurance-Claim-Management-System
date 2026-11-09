

# Stage 1: Build Application Artifacts
FROM node:20-alpine AS builder
WORKDIR /app

# Cache dependency installations
COPY package.json package-lock.json ./
RUN npm ci || npm install

# Copy source code and build production Vite distribution
COPY . .
RUN npm run build

# Stage 2: Minimal Production Web Server
FROM nginx:1.27-alpine AS runner
WORKDIR /usr/share/nginx/html

# Install wget for container healthcheck
RUN apk add --no-cache wget

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA routing & reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Container Healthcheck targeting Nginx healthz probe
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:80/healthz || exit 1

ENTRYPOINT ["nginx", "-g", "daemon off;"]
