# Insurance frontend

React (Vite) app for the insurance system: customer portal, admin portal, and Google SSO.

## Run locally

1. **Install and start the frontend**

   ```bash
   cd insurance-frontend
   npm install
   npm run dev
   ```

2. **Open the app**

   In the browser go to **http://localhost:5173** (or the URL Vite prints).

3. **Backend**

   The API must be running at **http://localhost:3000** (or set `VITE_API_BASE`). Start your backend server before using login, signup, or SSO.

## Environment

| Variable          | Description                                      | Default                    |
|-------------------|--------------------------------------------------|----------------------------|
| `VITE_API_BASE`   | Backend API base URL (e.g. `http://localhost:3000/api/v1`) | `http://localhost:3000/api/v1` |

Create a `.env` file in `insurance-frontend` if you need to override:

```env
VITE_API_BASE=http://localhost:3000/api/v1
```

## Routes

- `/` → redirects to `/login`
- `/login` – Customer sign in (email/password or **Sign in with Google**)
- `/signup` – Customer registration
- `/auth/callback` – Handles redirect after Google SSO (do not open manually)
- `/app` – Customer dashboard (protected)
- `/admin/login` – Admin sign in
- `/admin` – Admin dashboard (protected)

## Build

```bash
npm run build
npm run preview   # preview production build
```
