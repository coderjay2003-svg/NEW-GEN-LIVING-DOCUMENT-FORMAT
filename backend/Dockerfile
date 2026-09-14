FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
# In production: RUN npm install --omit=dev

COPY backend/ ./backend/
EXPOSE 8080

ENV PORT=8080
ENV NODE_ENV=production

CMD ["node", "backend/server.js"]
