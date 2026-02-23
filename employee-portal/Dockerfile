# ============================================================
# Multi-stage Dockerfile for Employee Portal (Angular)
# ============================================================

# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

LABEL maintainer="Employee Portal Team"
LABEL description="Angular Employee Portal Build Stage"

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci --prefer-offline

# Copy the rest of the source code
COPY . .

# Build the Angular app for production
RUN npm run build:prod

# ---- Stage 2: Production ----
FROM nginx:1.25-alpine AS production

LABEL description="Angular Employee Portal Production Image"

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from builder stage
COPY --from=builder /app/dist/employee-portal/browser /usr/share/nginx/html

# Create a non-root user for nginx
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup && \
    chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

# Switch to non-root user
USER appuser

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
