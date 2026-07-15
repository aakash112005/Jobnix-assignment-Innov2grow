FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN mkdir -p uploads/resumes uploads/avatars

EXPOSE 5000

CMD ["node", "server.js"]
