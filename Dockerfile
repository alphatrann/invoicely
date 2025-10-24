FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.9.1 --activate

COPY . .

RUN yarn install --immutable
RUN chmod +x env-links.sh
RUN sed -i 's/\r$//' /app/env-links.sh
RUN /app/env-links.sh
RUN yarn build


FROM node:22-alpine AS runner
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.9.1 --activate

ENV NODE_ENV=production

COPY --from=builder /app ./

RUN rm -rf .yarn/cache .next/cache **/.next/cache **/node_modules/.cache

EXPOSE 3000
