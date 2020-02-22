require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import seed data:
const data = require('./data.json');
const dataType = require('./productType.json');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();

        const savedTypes = await Promise.all(
            dataType.map(async type => {
                const result = await client.query(`
                    INSERT INTO glass_type (type)
                    VALUES ($1)
                    RETURNING *;
                `,
                [type]);

                return result.rows[0];
            })
        );
    
        // "Promise all" does a parallel execution of async tasks
        await Promise.all(
            // map every item in the array data
            data.map(item => {
                const type = savedTypes.find(type => {
                    // console.log(type.type);
                    console.log(item.type);
                    return type.type === item.type;
                });

                return client.query(`
                INSERT INTO glass_art (product_name, description, price, img_url, type_id, in_stock, quantity)
                VALUES ($1, $2, $3, $4, $5, $6, $7);
                
                `,
                
                [item.product_name, item.description, item.price, item.img_url, type.type_id, item.in_stock, item.quantity]);
            })
        );

        // console.log(type)

        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}