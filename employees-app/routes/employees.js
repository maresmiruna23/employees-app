var express = require('express');
var router = express.Router();
var connection=require('../db')

//GET employees
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
module.exports=router;