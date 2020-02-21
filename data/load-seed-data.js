require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import seed data:
const data = require('./data.json');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();
    
        // "Promise all" does a parallel execution of async tasks
        await Promise.all(
            // map every item in the array data
            data.map(item => {
                return client.query(`
                INSERT INTO glass_art (product_id, product_name, description, price, img_url, type, in_stock, quantity)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
                
                `,
                
                [item.product_id, item.product_name, item.description, item.price, item.img_url, item.type, item.in_stock, item.quantity]);
            })
        );

        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}