# Use Node.js 20.x base image (alpine variant for smaller images)
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Start the application
CMD node index.js
