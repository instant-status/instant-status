# Instant Status

Instant Status is a high-performance server management, update, and monitoring application. Designed for multi-environment SaaS software, and fully cloud-agnostic.

Deploy application updates in under one minute, regardless of the number of servers or environments involved.

![instant-status-home](https://raw.githubusercontent.com/instant-status/deploy/master/img/instant-status-home.png)

## Production Install

The [production installation script can be found here](https://github.com/instant-status/deploy/tree/master#instant-status-install-script).

## Recommended Production Infrastructure

![instant-status-infrastructure-diagram](https://raw.githubusercontent.com/instant-status/deploy/master/img/instant-status-infrastructure-diagram.png)

For more information and Infrastructure as Code (IaC) for deploying Instant Status, see [the deploy repo](https://github.com/instant-status/deploy#readme).

## Development

### Dependencies

- Postgres 18
- Node 24
- HTTPS Server/Domain
- NGINX

### Setup

1. Prepare Database

   ```bash
   # Ubuntu
   sudo apt install postgresql
   # Log in as postgres user
   sudo su - postgres -c 'psql -U postgres -d postgres'
   ```

   ```sql
   -- Create database, role, user and grant
   CREATE DATABASE instant_status_db;
   CREATE ROLE instant_status_role;
   CREATE USER instant_status_user WITH PASSWORD 'randompassword';
   GRANT ALL PRIVILEGES ON DATABASE instant_status_db TO instant_status_role;
   GRANT ALL PRIVILEGES ON SCHEMA public TO instant_status_role;
   GRANT instant_status_role TO instant_status_user;
   ```

2. Prepare ENVs

   a. Copy ENVs

   ```bash
   cp ui/example.appConfig.ts ui/appConfig.ts && cp is-config/src/example.apiConfig.ts is-config/src/apiConfig.ts && cp is-config/.example.env is-config/.env
   ```

   b. Edit ENVs

   ```bash
   vim ui/appConfig.ts is-config/src/apiConfig.ts is-config/.env
   ```

3. Install App Dependencies

   ```bash
   npm run ci
   ```

4. Migrate and seed database

   ```bash
   # In is-prisma
   npm run db:migrate
   npm run db:dev-seed
   ```
