var express = require('express');
var router = express.Router();
var connection = require('../db');

//GET benefits
router.get('/', (request, response) => {
    const sql = `
        SELECT * FROM benefits
    `;
    connection.query(sql, (error, result) => {
        if (error) {
            console.log('Database error:', error.message);
            return response.status(500).send(error);
        }
        response.json(result);
    });
});

//POST create new benefit
router.post('/', (request, response) => {
    const { name, description, cost, duration } = request.body;
    if (!name || !description || cost === undefined || !duration) {
        return response.status(400).json({ message: 'Missing required fields.' });
    }
    const sql = `
        INSERT INTO benefits (name, description, cost, duration)
        VALUES (?, ?, ?, ?)
    `;
    connection.query(sql, [name, description, cost, duration], (error, result) => {
        if (error) {
            console.error('Insert error:', error.message);
            return response.status(500).json({ message: 'Database insertion failed.', error });
        }

        response.status(201).json({
            message: 'Benefit added successfully.',
            benefitId: result.insertId
        });
    });
});

module.exports = router;
