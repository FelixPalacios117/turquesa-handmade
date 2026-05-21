FROM node:20-alpine
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY api/package.json api/package-lock.json* ./
RUN npm install
COPY api/ .
RUN mkdir -p uploads
EXPOSE 4000
CMD ["node", "server.js"]
