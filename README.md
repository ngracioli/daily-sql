This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This is a [Next.js](https://nextjs.org) application for DailySQL.

---

## 🛠 Setup & Getting Started

### 1. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.local.example .env.local
```
Update the connection strings in `.env.local` if you are using a custom PostgreSQL installation.

### 2. Start the Database
The project includes a Docker Compose configuration that runs PostgreSQL and initializes the necessary databases (`dailysql`, `dailysql_sandbox`) and restricted runner roles (`daily_sql_runner`) automatically:
```bash
docker compose up -d
```

### 3. Run Development Server
Start the Next.js local development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.

### 4. Running Unit Tests
Execute the Jest suite to verify the sanitizers, validation engines, and configurations:
```bash
npm test
```

