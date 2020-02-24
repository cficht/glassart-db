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
app.use('/assets', express.static('public')); //allows us to host images folder
app.use(express.json()); // enable reading incoming json data
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// API Routes

app.get('/api/data', async (req, res) => {
    try {
        const result = await client.query(`
            SELECT
                glass_art.*
            FROM glass_art
            JOIN glass_type
            ON glass_art.type_id = glass_type.type_id
            ORDER BY glass_art.product_id;
        `);

        console.log(result.rows);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.post('/api/data', async (req, res) => {
    try {
        console.log(req.body);
        const result = await client.query(`
        INSERT INTO glass_art (product_name, description, price, img_url, type_id, in_stock, quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `,

        [req.body.product_name, req.body.description, req.body.price, req.body.img_url, req.body.type_id, req.body.in_stock, req.body.quantity]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.get('/api/data/:myGlassId/', async (req, res) => {
    try {
        const result = await client.query(`
            SELECT *
            FROM glass_art
            WHERE glass_art.product_id=$1`,
        [req.params.myGlassId]);

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.get('/api/types', async (req, res) => {
    try {
        const result = await client.query(`
            SELECT *
            FROM glass_type
            ORDER BY type_id;
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