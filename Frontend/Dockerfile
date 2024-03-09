FROM node:16-alpine AS build
WORKDIR /Frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
