FROM node:20-slim AS build

WORKDIR /app

COPY package*.json ./

ENV REACT_APP_API_URL=http://45.79.168.213:3000

RUN npm install

COPY . .
RUN npm run build

# Use the official Nginx image
FROM nginx:1.21-alpine

# Copy the build output to replace the default Nginx contents
COPY --from=build /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

