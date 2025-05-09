var express = require('express');
var router = express.Router();
var connection=require('../db')

//GET
router.get('/:id', (request, response) => {
    const employeeID=request.params.id
    const sql = `
      SELECT *
      FROM performance_reviews 
      WHERE employee_id = ?
    `;
    connection.query(sql, [employeeID], (error, result) => {
      if (error) {
        console.log('dberror', error.message);
        return response.status(500).send(error);
      }
      response.json(result);
    });
  });

  //POST CREATE REVIEW BASED ON reviewer_id and employee_id
  router.post('/', (request, response) => { 
    const { employee_id, review_date, score, comments, next_review_date } = request.body;
    const reviewer_id = 1;
    if (!score || score < 5 || score > 10 || !Number.isInteger(Number(score))) {
        return response.status(400).json({
            error: 'Score must be an integer between 5 and 10'
        });
    }
    const checkEmployeeSQL = `
    SELECT id FROM employees 
    WHERE id = ? AND id != ?
`;
connection.query(checkEmployeeSQL, [employee_id, reviewer_id], (error, employeeResult) => {
    if (error) {
        console.log('Employee check error:', error.message);
        return response.status(500).send(error);
    }
    if (employeeResult.length === 0) {
        return response.status(400).json({
            error: 'Invalid employee_id or employee cannot review themselves'
        });
    }
    // Insert the review
    const insertSQL = `
        INSERT INTO performance_reviews 
        (employee_id, reviewer_id, review_date, score, comments, next_review_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        employee_id,
        reviewer_id,
        review_date || new Date(), // If not provided, use current date
        score,
        comments || null,
        next_review_date || null
    ];
    connection.query(insertSQL, values, (error, result) => {
        if (error) {
            console.log('Insert error:', error.message);
            return response.status(500).send(error);
        }
        // Fetch the newly created review
        const selectSQL = `
            SELECT pr.*, 
                   e.first_name as employee_first_name, 
                   e.last_name as employee_last_name,
                   r.first_name as reviewer_first_name, 
                   r.last_name as reviewer_last_name
            FROM performance_reviews pr
            JOIN employees e ON pr.employee_id = e.id
            JOIN employees r ON pr.reviewer_id = r.id
            WHERE pr.id = ?
        `;
        connection.query(selectSQL, [result.insertId], (error, finalResult) => {
            if (error) {
                console.log('Select error:', error.message);
                return response.status(500).send(error);
            }
            response.status(201).json(finalResult[0]);
        });
    });
});
  })

  //Delete
  router.delete('/:id', (request, response) => {
    const reviewID = request.params.id;

    const sql = `
        DELETE FROM performance_reviews 
        WHERE id = ?
    `;

    connection.query(sql, [reviewID], (error, result) => {
        if (error) {
            console.log('Delete error:', error.message);
            return response.status(500).send(error);
        }

        if (result.affectedRows === 0) {
            return response.status(404).json({
                error: 'Review not found or already deleted'
            });
        }

        response.status(200).json({
            message: `Review with ID ${reviewID} has been deleted successfully`
        });
    });
});
  module.exports=router;