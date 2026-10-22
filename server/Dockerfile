FROM node:22-alpine

# Time zone data, so "today" and weekends are worked out in local time.
RUN apk add --no-cache tzdata

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY . .
RUN chmod +x docker-entrypoint.sh

USER node
EXPOSE 8100
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "src/index.js"]
