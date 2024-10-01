FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --vebose
COPY . .
CMD ["npm", "run", "start"]
