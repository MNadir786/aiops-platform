# ======================================
# Stage 1 — Build React app (Vite)
# ======================================
FROM node:18-alpine AS build
WORKDIR /app

# Copy dependency manifests and install
COPY package*.json ./
RUN npm ci || npm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# -------------------------------------------------
# Inject build-time API base URL (default fallback)
# -------------------------------------------------
ARG VITE_API_BASE
ENV VITE_API_BASE=${VITE_API_BASE:-http://backend:8000/api}

# Build optimized static assets
RUN npm run build

# ======================================
# Stage 2 — Runtime (Nginx)
# ======================================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean existing static assets
RUN rm -rf ./*

# Copy build output
COPY --from=build /app/dist .

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# -------------------------------------------------
# Inject runtime environment for dynamic backend URLs
# -------------------------------------------------
# This file is read by index.html before React loads
RUN echo "window._env_ = { VITE_API_BASE: '${VITE_API_BASE:-http://backend:8000/api}' };" \
    > /usr/share/nginx/html/env.js

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
