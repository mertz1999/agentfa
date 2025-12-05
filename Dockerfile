# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Use Docker secrets for API key
RUN --mount=type=secret,id=GEMINI_API_KEY \
    if [ -f /run/secrets/GEMINI_API_KEY ]; then \
        echo "GEMINI_API_KEY=$(cat /run/secrets/GEMINI_API_KEY)" > .env; \
    fi

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

