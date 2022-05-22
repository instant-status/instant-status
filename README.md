# Instant Status

[![Total alerts](https://img.shields.io/lgtm/alerts/g/instant-status/instant-status.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/instant-status/instant-status/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/instant-status/instant-status.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/instant-status/instant-status/context:javascript)

Performant, robust, and clean monitoring application

## Production Install

The [production installation script can be found here](https://github.com/instant-status/deploy/tree/master#install-script).

## Recommended Production Infrastructure

[![instant-status-infrastructure-diagram-thumb](https://raw.githubusercontent.com/instant-status/deploy/master/img/instant-status-infrastructure-diagram-thumb.png)](https://raw.githubusercontent.com/instant-status/deploy/master/img/instant-status-infrastructure-diagram.png)
_click for full resolution zoomable image_

For more information and code for deploying Instant Status, see [the deploy repo](https://github.com/instant-status/deploy#readme).

## Development

### Dependencies

- Postgres 14 (but 13 should work fine)
- Node 16
- HTTPS Server/Domain
- NGINX

### Setup

1. Prepare Database

   ```bash
   # Ubuntu
   sudo apt install postgresql
   # Log in as posgres user
   sudo su - postgres -c 'psql -U postgres -d postgres'

   # Create user, database and grant
   CREATE USER instant_status_user WITH PASSWORD 'randompassword';
   CREATE DATABASE instant_status_db;
   GRANT ALL PRIVILEGES ON DATABASE instant_status_db TO instant_status_user;
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
