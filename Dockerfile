FROM node:22.10.0

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

RUN npm i -g serve


COPY . .

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "dist"]