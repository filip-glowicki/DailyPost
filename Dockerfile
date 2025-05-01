FROM node:23.11-alpine AS builder
WORKDIR /app

# Install specific pnpm version
RUN corepack enable && corepack prepare pnpm@10.5.2 --activate

# Copy package files first
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all other files
COPY . .

# Build the project with standalone output
RUN pnpm run build

# Production stage
FROM node:23.11-alpine AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production
ENV PORT=3000

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build and necessary files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Give necessary permissions
RUN chown -R nextjs:nodejs .

# Switch to non-root user
USER nextjs

# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]