# Authentication & Registration Rules

- JWT-based auth for submission only
- Only the director registers a team
- Registration fields:
  - teamName: string
  - email: string
  - password: string (hashed)
  - members: list of objects {name, role}
- Login fields:
  - email
  - password
- Only authenticated director can access submission form
