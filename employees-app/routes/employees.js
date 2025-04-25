var express = require('express');
var router = express.Router();
var connection=require('../db')

// GET employees
router.get('/', (request, response)=>{
    const sql = `
    SELECT *
    FROM employees 
  `;
    connection.query(sql,(error, result)=>{
        if(error){
            console.log('dberror', error.message)
            return response.status(500).send(error)
        }
        response.json(result)
    })
})
// POST create new employees
router.post('/', (request, response)=>{
    const{first_name, last_name, email, salary,
         department_id, position_id, manager_id, 
         hired_at, status, birth_date}=request.body
         if (!first_name || !last_name || !email || !status || !salary ||
          !department_id || !position_id || !manager_id || !hired_at ||  !birth_date) {
            return response.status(400).json({ message: 'Missing required fields.' });
          }
          connection.query(
            `INSERT INTO employees (
              first_name, last_name, email, salary,
              department_id, position_id, manager_id,
              hired_at, status, birth_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              first_name,              // first_name
              last_name,               // last_name
              email,                   // email
              salary,                  // salary
              department_id,           // department_id
              position_id,             // position_id
              manager_id || null,      // manager_id, can be null if not provided
              hired_at,                // hired_at (date when the employee was hired)
              status,                  // status (active/inactive)
              birth_date               // birth_date
            ],
        (error, result) => {
              if (error) {
                console.error('Insert error:', error.message);
                return response.status(500).json({ message: 'Database insertion failed.', error });
              }
        
              // Success response with the new employee's ID
              response.status(201).json({
                message: 'Employee added successfully.',
                employeeId: result.insertId // this returns the ID of the newly created employee
              });
            }
          );

})
module.exports=router;