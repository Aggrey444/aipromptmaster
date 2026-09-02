FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public
COPY netlify ./netlify

RUN npm install

COPY server.ts ./

RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
