FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Cambiar esta línea para usar npm start
CMD ["npm", "start"]