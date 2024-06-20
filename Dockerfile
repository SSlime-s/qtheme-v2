# for neoshowcase
FROM node:20.14.0-bookworm-slim

COPY . /app

WORKDIR /app/apps/web

ARG DATABASE_URL
ARG NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
ARG NEXT_PUBLIC_BASE_URL
ARG WEBHOOK_ID
ARG WEBHOOK_SECRET

RUN apt-get update
RUN apt-get install -y openssl

RUN corepack enable pnpm
RUN pnpm install
RUN pnpm run build --no-lint

EXPOSE 3000
CMD ["pnpm", "run", "start"]
