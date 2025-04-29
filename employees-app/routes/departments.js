var express = require('express');
var router = express.Router();
var connection = require('../db');

// GET all departments
router.get('/', (request, response) => {
    const sql = `SELECT * FROM departments`;
    connection.query(sql, (error, result) => {
        if (error) {
            console.error('Database error:', error.message);
            return response.status(500).send(error);
        }
        response.json(result);
    });
});

// POST create new department
router.post('/', (request, response) => {
    const { name, location_id, budget, created_at, manager_id } = request.body;
  
    // Validare câmpuri obligatorii
    if (!name || !location_id || !budget || !created_at || manager_id === undefined) {
      return response.status(400).json({ message: 'Missing required fields.' });
    }
  
    connection.query(
      `INSERT INTO departments (
        name, location_id, budget, created_at, manager_id
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        name,               // name
        location_id,        // location_id
        budget,             // budget
        created_at,         // created_at
        manager_id || null  // manager_id poate fi null
      ],
      (error, result) => {
        if (error) {
          console.error('Insert error:', error.message);
          return response.status(500).json({ message: 'Database insertion failed.', error });
        }
  
        // Success response with the new employee's ID
        response.status(201).json({
          message: 'Department added successfully.',
          departmentId: result.insertId
        });
      }
    );
  });
  
  module.exports = router;