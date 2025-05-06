var express = require('express');
var router = express.Router();
var connection = require('../db');

//GET 
router.get('/', (request, response) => {
  const sql = `
    SELECT * 
    FROM positions
  `;
  connection.query(sql, (error, result) => {
    if (error) {
      console.log('dberror', error.message);
      return response.status(500).send(error);
    }
    response.json(result);
  });
});

//POST 
router.post('/', (request, response) => {
  const { title, min_salary, max_salary, level, department_id } = request.body;
  if (!title || !min_salary || !max_salary || !level || !department_id) {
    return response.status(400).json({ message: 'Missing required fields.' });
  }

  connection.query(
    `INSERT INTO positions (
      title, min_salary, max_salary, level, department_id
    ) VALUES (?, ?, ?, ?, ?)`,
    [
      title,            
      min_salary,       
      max_salary,       
      level,            
      department_id     
    ],
    (error, result) => {
      if (error) {
        console.error('Insert error:', error.message);
        return response.status(500).json({ message: 'Database insertion failed.', error });
      }

      //Response
      response.status(201).json({
        message: 'Position added successfully.',
        positionId: result.insertId
      });
    }
  );
});

module.exports = router;
