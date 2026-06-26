This is a [Next.js](https://nextjs.org) application for **DailySQL** — a platform to solve daily SQL challenges inside a secure, sandboxed database environment with built-in rate-limiting and query autocomplete.

---

## 🚀 Quick Start Guide

Follow these steps sequentially to set up and run the entire development environment (databases, cache/rate-limiter, frontend, and backend):

### 1. Install Dependencies
Install the required Node.js package dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the template configuration file:
```bash
cp .env.local.example .env.local
```
Make sure `.env.local` contains the correct connection strings. If you are using the default Docker services, the default URLs will work out-of-the-box:
- **Application Database (`DATABASE_URL`)**: `postgresql://postgres:postgres@localhost:5432/dailysql`
- **Sandbox Database (`SANDBOX_DATABASE_URL`)**: `postgresql://daily_sql_runner:runnerpassword@localhost:5432/dailysql_sandbox`
- **Redis Service (`REDIS_URL`)**: `redis://localhost:6379`

### 3. Start Database and Redis Containers
The project uses Docker Compose to run PostgreSQL (primary database + low-privilege sandbox runner database) and Redis:
```bash
docker compose up -d
```
This command starts:
- **PostgreSQL (`dailysql-postgres`)**: Runs on port `5432`.
- **Redis (`dailysql-redis`)**: Runs on port `6379` (used for sliding window rate-limiting).

To verify the containers are active:
```bash
docker compose ps
```

### 4. Database Initialization & Seeding
During the first docker container boot, Docker automatically runs `docker/init-db.sql` to initialize databases, configure the sandboxed `daily_sql_runner` user, and seed the `challenges` table.

If the containers were already created or you need to manually apply schema/challenges updates, execute the seed script:
```bash
docker exec -i dailysql-postgres psql -U postgres -f /docker-entrypoint-initdb.d/init-db.sql
```

### 5. Run the Development Server
Start the Next.js local development environment:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.

---

## 🛠 Useful Commands

### Running Unit Tests
Execute the Jest suite to verify sanitizers, rate-limiting, and database queries:
```bash
npm test
```

### Complete Database Reset
If you need to wipe out the database data and start from a completely fresh state:
```bash
# Stop containers and delete associated volumes
docker compose down -v

# Start services and trigger fresh initialization
docker compose up -d
```

