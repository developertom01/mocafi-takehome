FROM node:20-slim AS build

# Set the working directory
WORKDIR /opt/app

# Required for prisma to run
RUN apt-get update && apt-get install -y openssl libssl1.1


# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./package-lock.json
RUN npm i

COPY ./prisma ./prisma
RUN npm run prisma:gen

# Copy the rest of the application code
COPY ./bin ./bin
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json


RUN npm run build

FROM node:20-slim

WORKDIR /opt/app

# Create a new user
RUN adduser --disabled-password --gecos "" myuser


COPY package.json ./
COPY package.lock.json ./



# Install only production dependencies
RUN npm i --only=production

COPY --from=build /opt/app/build/* ./

USER myuser

CMD [ "node" , "bin/index.js"]
