# syntax=docker/dockerfile:1.6
FROM node:22-alpine
WORKDIR /app/services/profile-service

# Install dependencies
COPY services/profile-service/package*.json ./
RUN apk add --no-cache openssl libc6-compat
RUN npm install

# Install shared dependencies
COPY shared/package*.json /app/shared/
RUN cd /app/shared && npm install

# Copy service source and shared library
COPY services/profile-service ./
COPY shared /app/shared

# Generate Prisma client (required at runtime)
RUN npx prisma generate

ENV NODE_ENV=development
ENV PORT=3002
EXPOSE 3002

# Start TypeScript directly without compiling
CMD ["npx", "ts-node", "--transpile-only", "src/index.ts"]
