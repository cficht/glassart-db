require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();
        await client.query(`
        CREATE TABLE glass_type (
            type_id SERIAL PRIMARY KEY NOT NULL,
            type_name VARCHAR(256) NOT NULL
        );

        CREATE TABLE glass_art (
            product_id SERIAL PRIMARY KEY NOT NULL,
            product_name VARCHAR(256) NOT NULL,
            description VARCHAR(256) NOT NULL,
            price INTEGER NOT NULL,
            img_url VARCHAR(256) NOT NULL,
            type_id INTEGER NOT NULL REFERENCES glass_type(type_id),
            in_stock BOOLEAN NOT NULL,
            quantity INTEGER NOT NULL
        );
        `);

        console.log('create tables complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}