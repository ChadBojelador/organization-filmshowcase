# API Endpoints

## Public
GET /films → returns approved films only (public)

## Auth
POST /register → creates user and returns JWT
POST /login → returns JWT

## Protected (JWT required)
POST /submit → add new film (director only)

## Admin Moderation
GET /films/pending → list unapproved films
PATCH /films/:id/approve → approve pending film
PATCH /films/:id/reject → reject pending film
