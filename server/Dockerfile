FROM node:20-slim

# Set the working directory
WORKDIR /opt/app

# Required for prisma to run
RUN apt-get update && apt-get install -y curl libmongocrypt-dev openssl && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY ./bin ./bin
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

RUN npm run build

FROM node:20-slim

WORKDIR /opt/app


COPY package.json ./
COPY package.lock.json ./


# Install only production dependencies
RUN npm i --only=production

COPY --from=build /opt/app/build/* ./


CMD [ "node" , "bin/index.js"]
