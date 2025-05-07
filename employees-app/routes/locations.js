var express = require('express');
var router = express.Router();
var connection = require('../db');

// GET locations
router.get('/', (request, response) => {
    const sql = `
    SELECT *
    FROM locations 
  `;
    connection.query(sql, (error, result) => {
        if (error) {
            console.log('dberror', error.message)
            return response.status(500).send(error)
        }
        response.json(result)
    })
})

// POST create new location
router.post('/', (request, response) => {
    const { city, country, address, postal_code, region } = request.body
    if (!city || !country || !address || !postal_code || !region) {
        return response.status(400).json({ message: 'Missing required fields.' });
    }

    connection.query(
        `INSERT INTO locations (
          city, country, address, postal_code, region
        ) VALUES (?, ?, ?, ?, ?)`,
        [
            city,         
            country,      
            address,      
            postal_code,  
            region        
        ],
        (error, result) => {
            if (error) {
                console.error('Insert error:', error.message);
                return response.status(500).json({ message: 'Database insertion failed.', error });
            }

            response.status(201).json({
                message: 'Location added successfully.',
                locationId: result.insertId 
            });
        }
    );
})

module.exports = router;
