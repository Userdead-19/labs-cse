# Stage 1: Build 
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install Python and build dependencies before npm install
# Adding krb5-dev for Kerberos dependencies
RUN apk add --no-cache python3 make g++ krb5-dev

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including dev dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Set memory limit for build process
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN rm -rf .next

# Build the application
RUN npm run build

# Stage 2: Production Environment
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only the built files from the builder stage
COPY --from=builder /app ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]