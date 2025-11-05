# # # # Use official Node.js LTS image
# # FROM node:18-alpine

# # # Set working directory
# # WORKDIR /usr/src/app

# # # Copy package files
# # COPY package*.json ./

# # # Install dependencies (including bcrypt for Linux)
# # RUN npm install --build-from-source bcrypt

# # # Copy the rest of the app
# # COPY . .

# # # Expose app port
# # EXPOSE 3000

# # # Start the app
# # CMD ["npm", "start"]
# # Use official Node.js LTS image
# # Use official Node.js image
# # Use official Node.js image
# FROM node:18-alpine

# # Set working directory
# WORKDIR /usr/src/app

# # Copy package files first
# COPY package*.json ./

# # Clear npm cache and install dependencies
# RUN npm cache clean --force
# RUN npm install bcrypt --build-from-source
# RUN npm install

# # Copy rest of the source code
# COPY . .

# # Expose app port
# EXPOSE 3000

FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files first
COPY package*.json ./

# Install dependencies safely
RUN npm install

# Copy all app files
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
