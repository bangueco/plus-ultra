# Use the LTS version of Node because this is what i use
FROM node:lts

# Set working directory from the container
WORKDIR /usr/src/app

# Copy dependencies
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the code
COPY . .

# Build prisma client
RUN npx prisma generate

# Build src
RUN pnpm run tsc

# Expose the app port
EXPOSE 3000

# Start production build
CMD [ "pnpm", "start" ]