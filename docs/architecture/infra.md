# Infrastructure

Notes about deployment, CI/CD, hosting and infra decisions.

Recommendations
- Use Vercel for Next.js deployments for simplicity and built-in support.
- Infrastructure as code: keep minimal configs under `infra/` if you manage custom cloud resources.
- CI: GitHub Actions is recommended; keep workflows in `.github/workflows/`.
