# API Endpoints

## Public
GET /films → returns all films (public)

## Auth
POST /register → creates user and returns JWT
POST /login → returns JWT

## Protected (JWT required)
POST /submit → add new film (director only)
