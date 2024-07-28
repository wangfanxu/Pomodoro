# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory to the root of the project
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run the built application
CMD ["yarn", "run", "dev"]
