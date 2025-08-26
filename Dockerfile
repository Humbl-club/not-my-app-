# Use Node.js official image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend files
COPY backend/package*.json ./
COPY backend/ ./

# Install dependencies
RUN npm ci --only=production

# Create secure storage directory with proper permissions
RUN mkdir -p secure-storage && chmod 700 secure-storage

# Expose port (Railway will override this)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + process.env.PORT + '/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"

# Start the application
CMD ["npm", "start"]