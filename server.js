// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');

console.log(process.env);
// Database Client
const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();


// Application Setup
const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev'));
app.use(cors());

app.use('/assets', express.static('public'));

// API Routes

app.get('/api/data', async (req, res) => {
    try {
        const result = await client.query(`
        SELECT
        product_id,
        product_name,
        description,
        price,
        img_url,
        type,
        in_stock,
        quantity
        FROM glass_art;
        `);

        console.log(result.rows);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

// http method and path...


// Start the server
// (use PORT from .env!)
// const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log('server running on PORT', PORT);
});