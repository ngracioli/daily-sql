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

-- Connect to dailysql database to create metadata tables
\c dailysql;

CREATE TABLE IF NOT EXISTS challenges (
  id INT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  database VARCHAR(50) NOT NULL,
  schema_table_name VARCHAR(100) NOT NULL,
  schema_columns JSONB NOT NULL,
  initial_data JSONB NOT NULL,
  schema_sql TEXT NOT NULL,
  seed_sql TEXT NOT NULL,
  solution_sql TEXT NOT NULL,
  check_order BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO challenges (id, title, description, category, difficulty, database, schema_table_name, schema_columns, initial_data, schema_sql, seed_sql, solution_sql, check_order)
VALUES
(42, 'Filter active user accounts.', 'Select the id, username, and email of all users who have logged in within the last 30 days.', 'Filtering', 'Easy', 'PostgreSQL', 'users',
 '[{"name": "id", "type": "integer"}, {"name": "username", "type": "varchar(100)"}, {"name": "email", "type": "varchar(255)"}, {"name": "last_login", "type": "timestamp"}]'::jsonb,
 '[{"id": 1, "username": "alice_jones", "email": "alice@example.com", "last_login": "2026-05-20T10:23:00.000Z"}, {"id": 2, "username": "bob_smith", "email": "bob@example.com", "last_login": "2025-11-01T14:45:00.000Z"}, {"id": 3, "username": "charlie_brown", "email": "charlie@example.com", "last_login": "2026-06-02T09:12:00.000Z"}]'::jsonb,
 'CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, last_login TIMESTAMP NOT NULL);',
 'INSERT INTO users (id, username, email, last_login) VALUES (1, ''alice_jones'', ''alice@example.com'', ''2026-05-20 10:23:00''), (2, ''bob_smith'', ''bob@example.com'', ''2025-11-01 14:45:00''), (3, ''charlie_brown'', ''charlie@example.com'', ''2026-06-02 09:12:00'');',
 'SELECT id, username, email FROM users WHERE last_login > ''2026-06-18 22:53:59''::timestamp - INTERVAL ''30 days'';',
 false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  database = EXCLUDED.database,
  schema_table_name = EXCLUDED.schema_table_name,
  schema_columns = EXCLUDED.schema_columns,
  initial_data = EXCLUDED.initial_data,
  schema_sql = EXCLUDED.schema_sql,
  seed_sql = EXCLUDED.seed_sql,
  solution_sql = EXCLUDED.solution_sql,
  check_order = EXCLUDED.check_order;

INSERT INTO challenges (id, title, description, category, difficulty, database, schema_table_name, schema_columns, initial_data, schema_sql, seed_sql, solution_sql, check_order)
VALUES
(101, 'Identify premium orders.', 'Select the id, customer_id, and total_amount of all orders where the total_amount is greater than 150.00, ordered by total_amount in descending order.', 'Filtering', 'Easy', 'PostgreSQL', 'orders',
 '[{"name": "id", "type": "integer"}, {"name": "customer_id", "type": "integer"}, {"name": "total_amount", "type": "numeric(10,2)"}, {"name": "order_date", "type": "date"}]'::jsonb,
 '[{"id": 1, "customer_id": 10, "total_amount": 250.50, "order_date": "2026-06-01"}, {"id": 2, "customer_id": 11, "total_amount": 99.99, "order_date": "2026-06-02"}, {"id": 3, "customer_id": 10, "total_amount": 180.00, "order_date": "2026-06-03"}, {"id": 4, "customer_id": 12, "total_amount": 45.00, "order_date": "2026-06-04"}]'::jsonb,
 'CREATE TABLE orders (id SERIAL PRIMARY KEY, customer_id INTEGER NOT NULL, total_amount NUMERIC(10,2) NOT NULL, order_date DATE NOT NULL);',
 'INSERT INTO orders (id, customer_id, total_amount, order_date) VALUES (1, 10, 250.50, ''2026-06-01''), (2, 11, 99.99, ''2026-06-02''), (3, 10, 180.00, ''2026-06-03''), (4, 12, 45.00, ''2026-06-04'');',
 'SELECT id, customer_id, total_amount FROM orders WHERE total_amount > 150.00 ORDER BY total_amount DESC;',
 true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  database = EXCLUDED.database,
  schema_table_name = EXCLUDED.schema_table_name,
  schema_columns = EXCLUDED.schema_columns,
  initial_data = EXCLUDED.initial_data,
  schema_sql = EXCLUDED.schema_sql,
  seed_sql = EXCLUDED.seed_sql,
  solution_sql = EXCLUDED.solution_sql,
  check_order = EXCLUDED.check_order;

INSERT INTO challenges (id, title, description, category, difficulty, database, schema_table_name, schema_columns, initial_data, schema_sql, seed_sql, solution_sql, check_order)
VALUES
(102, 'Find inactive customers.', 'Select the id and name of customers who have never placed any orders. Order the results by customer id in ascending order.', 'Joins & Subqueries', 'Medium', 'PostgreSQL', 'customers',
 '[{"name": "id", "type": "integer"}, {"name": "name", "type": "varchar(100)"}, {"name": "country", "type": "varchar(50)"}]'::jsonb,
 '[{"id": 1, "name": "Alice", "country": "USA"}, {"id": 2, "name": "Bob", "country": "Canada"}, {"id": 3, "name": "Charlie", "country": "UK"}]'::jsonb,
 'CREATE TABLE customers (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, country VARCHAR(50) NOT NULL); CREATE TABLE orders (id SERIAL PRIMARY KEY, customer_id INTEGER NOT NULL, total_amount NUMERIC(10,2) NOT NULL);',
 'INSERT INTO customers (id, name, country) VALUES (1, ''Alice'', ''USA''), (2, ''Bob'', ''Canada''), (3, ''Charlie'', ''UK''); INSERT INTO orders (id, customer_id, total_amount) VALUES (1, 1, 50.00), (2, 3, 120.00);',
 'SELECT c.id, c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.customer_id IS NULL ORDER BY c.id ASC;',
 true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  difficulty = EXCLUDED.difficulty,
  database = EXCLUDED.database,
  schema_table_name = EXCLUDED.schema_table_name,
  schema_columns = EXCLUDED.schema_columns,
  initial_data = EXCLUDED.initial_data,
  schema_sql = EXCLUDED.schema_sql,
  seed_sql = EXCLUDED.seed_sql,
  solution_sql = EXCLUDED.solution_sql,
  check_order = EXCLUDED.check_order;
