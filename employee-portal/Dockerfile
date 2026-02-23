# =============================================================================
# Employee Portal — Multi-stage Dockerfile
# Stage 1: Build the Angular app
# Stage 2: Serve via Nginx
# =============================================================================

# ---- Stage 1: Builder ----
FROM node:20-alpine AS builder

LABEL stage=builder

WORKDIR /app

# Copy dependency manifests first (leverage Docker layer cache)
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Build for production
RUN npm run build:prod

# ---- Stage 2: Production server ----
FROM nginx:1.25-alpine AS production

LABEL maintainer="Employee Portal Team"
LABEL version="1.0.0"

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app
COPY --from=builder /app/dist/employee-portal /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
