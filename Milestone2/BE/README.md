# Backend (Docker)

This backend runs three services via Docker Compose:
- auth-service (3001)
- profile-service (3002)
- search-profile-service (3009)

## Prerequisites
- Docker Desktop

## Setup
1) Create env files from the examples:
- `services/auth-service/.env` from `services/auth-service/.env.example`
- `services/profile-service/.env` from `services/profile-service/.env.example`
- `services/search-profile-service/.env` from `services/search-profile-service/.env.example`

2) Build and start:
```sh
cd Milestone2/BE
docker compose up --build
```

3) Check containers:
```sh
docker compose ps
```

4) Stop services:
```sh
docker compose down
```
