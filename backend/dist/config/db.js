"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
// You can specify any property from the postgres-js connection options
const db = (0, node_postgres_1.drizzle)({
    connection: {
        url: process.env.DATABASE_URL,
        ssl: true
    }
});
const result = await db.execute('select 1');
