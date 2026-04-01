# Agent-Ready Task Prompts

## F1 – FilmGrid Component
Task: Build FilmGrid component
Docs: 01_overview.md, 04_frontend.md
Input: 3–6 sample films
Output:
- Maps FilmCard in responsive grid
- Tailwind hints: desktop 3 cols, tablet 2 cols, mobile 1 col, gap-4, padding-6
- Gallery is public, no login required

## F2 – FilmCard Component
Task: Build FilmCard component
Docs: 01_overview.md, 04_frontend.md, 05_gdrive_handling.md
Input: Film object (title, teamName, members[], posterLink, videoLink)
Output:
- Poster image
- Film title
- Team Name
- List members with roles
- Video iframe
- Tailwind hints: rounded-xl, shadow-md, bg-white, p-4, space-y-2, image object-cover rounded-t-xl, iframe w-full h-48
- Visible to all users

## F3 – Google Drive Link Converter
Task: Implement GDrive link converter
Docs: 05_gdrive_handling.md
Input: GDrive link
Output: Proper embed (video) and direct (poster) URLs

## F4 – GET /films API
Task: Implement GET /films
Docs: 02_data_models.md, 03_api.md
Input: None
Output:
- Returns all films (public)
- Sorted by createdAt

## F5 – Registration + POST /register
Task: Registration system
Docs: 02_data_models.md, 06_auth.md
Input: teamName, email, password, members[] (name + role)
Output:
- React registration form capturing teamName, email, password, members list with roles
- Backend route storing hashed password and members
- Returns JWT on success

## F6 – Login + POST /login
Task: Login system
Docs: 06_auth.md
Input: email, password
Output:
- React login form
- Backend route returning JWT
- Only logged-in director can access submission page

## F7 – POST /submit Endpoint
Task: Film submission
Docs: 02_data_models.md, 05_gdrive_handling.md, 07_submission.md
Input: filmTitle, videoLink, posterLink, JWT
Output:
- Backend route saving film
- teamName and members auto-filled from JWT
- Convert GDrive links before storing
- Only accessible by registered director

## F8 – Protect Submission with JWT
Task: JWT middleware
Docs: 06_auth.md, 07_submission.md
Input: Authorization header with JWT
Output:
- Middleware verifying token and attaching user to request
- Prevent access to non-registered users from submitting

## F9 – Responsive Layout Improvements
Task: Improve responsiveness
Docs: 04_frontend.md
Input: Existing FilmGrid + FilmCard + Forms
Output: Updated responsive React components with Tailwind

## F10 – Admin / Moderation (Optional)
Task: Admin approval workflow
Docs: 03_api.md, 07_submission.md
Input: List of unapproved films, admin actions
Output: Backend + frontend routes for approving/rejecting films
