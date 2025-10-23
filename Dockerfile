# Stage 1: Build the Next.js app
FROM node:22-alpine AS builder

WORKDIR /app

# Enable Yarn 4 (Berry)
RUN corepack enable && corepack prepare yarn@4.9.1 --activate


# Copy the whole monorepo (so Yarn sees workspaces)
COPY . .
RUN apk add --no-cache bash
RUN yarn install --immutable

RUN yarn build
ENV NODE_ENV=production
EXPOSE 3000

CMD [ "sh", "-c", "yarn sys-link && yarn db:generate && yarn db:migrate && yarn start" ]