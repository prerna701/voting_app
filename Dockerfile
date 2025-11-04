# Use Node LTS version
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json first (to leverage caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose the app port (matches .env)
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
