# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /voting_app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
