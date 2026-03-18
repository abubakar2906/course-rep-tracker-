## Security notes (important)

### Secrets (rotate if this repo was ever shared)
- **Google OAuth Client Secret**: rotate in Google Cloud Console and update the deployed environment variables.
- **JWT secret**: rotate `JWT_SECRET` in the backend environment variables (this will log out all users).
- **Database credentials**: rotate the DB password / connection string and use a least-privileged DB user.

### Local development
- Copy `.env.example` to `.env` and fill in values locally.
- Never commit `.env` (it is ignored by `.gitignore`).

