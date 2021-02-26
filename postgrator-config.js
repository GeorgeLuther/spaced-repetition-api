require('dotenv').config();
const pg = require('pg');
pg.defaults.ssl = process.env.NODE_ENV === "production";

module.exports = {
  "migrationDirectory": "migrations",
  "driver": "pg",
  "connectionString":process.env.DATABASE_URL
}
