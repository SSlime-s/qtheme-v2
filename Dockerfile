# for neoshowcase
FROM node:20.14.0-bookworm-slim

WORKDIR /app

COPY . /app

RUN apt-get update
RUN apt-get install -y openssl

RUN corepack enable pnpm
RUN pnpm install
RUN pnpm run build --no-lint

EXPOSE 3000
CMD ["pnpm", "run", "start"]
