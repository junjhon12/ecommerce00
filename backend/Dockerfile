# feat: implement multi-stage build for backend application
# An Alpine Linux base image paired with a multi-stage build was chosen to significantly 
# reduce the final production image size and limit the security vulnerability surface area, 
# balancing deployment optimization with readable environment separation.

# Stage 1: Build Environment
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npx tsc

# Stage 2: Production Environment
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
# Only installing production dependencies avoids bloat from testing libraries
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]