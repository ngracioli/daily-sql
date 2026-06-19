-- Create databases
SELECT 'CREATE DATABASE dailysql' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dailysql')\gexec
SELECT 'CREATE DATABASE dailysql_sandbox' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dailysql_sandbox')\gexec

-- Create restricted runner user
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'daily_sql_runner') THEN
        CREATE ROLE daily_sql_runner WITH LOGIN PASSWORD 'runnerpassword';
    END IF;
END
$$;

-- Grant connection privileges to the sandbox database
GRANT CONNECT ON DATABASE dailysql_sandbox TO daily_sql_runner;

-- Connect to sandbox database to restrict schema privileges
\c dailysql_sandbox;
REVOKE ALL ON SCHEMA public FROM public;
GRANT CREATE, USAGE ON SCHEMA public TO daily_sql_runner;
