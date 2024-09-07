FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json, then the rest of the application code
COPY FrontEnd/PostPilot-frontEND/package*.json ./
COPY FrontEnd/PostPilot-frontEND/ ./

# Install dependencies and change ownership of the app directory
RUN npm install && chown -R node:node /app

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]