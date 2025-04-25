# ---------- Base Stage (Install Only Once) ----------
FROM rust:1.86-slim AS base

WORKDIR /app

# Install build dependencies first (before copying anything else)
RUN apt-get update && \
  apt-get install -y libssl-dev pkg-config ca-certificates && \
  rm -rf /var/lib/apt/lists/*

# ---------- Dependency Caching Stage ----------
FROM base AS cache-deps

# Pre-copy manifest files to cache dependencies
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release && rm -r src

# ---------- Builder Stage ----------
FROM base AS builder

COPY . .
RUN cargo build --release

# ---------- Development Stage ----------
FROM base AS development

# Install hot-reload tool
RUN cargo install cargo-watch

COPY . .
EXPOSE 8080
ENV RUST_LOG=debug
CMD ["cargo", "watch", "-w", "src", "-x", "run"]

# ---------- Production Stage ----------
FROM ubuntu:25.04 AS production

RUN apt-get update && \
  apt-get install -y libssl-dev pkg-config ca-certificates && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Replace this with your binary name
COPY --from=builder /app/target/release/app /usr/local/bin/app

EXPOSE 8080
ENV RUST_LOG=info
CMD ["app"]
