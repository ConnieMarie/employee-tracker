const Employee = require('./db/Employee');
const db = require('./db/connection');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');
require('dotenv').config()

const PORT = process.env.PORT || 3006;

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    console.log(`Server running on port ${PORT}`);
  });

// figlet('Employee \n Manager', function(err, data) {
//     if (err) {
//         console.log('Something went wrong...');
//         console.dir(err);
//         return;
//     }
//     console.log(data)
// });

function init() {
  inquirer.prompt({
    type: "list",
    name: "task",
    message: "What would you like to do?",
    choices: ["View All Employees", "Add Employee", "Update Employee", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
  })
}

function viewAllEmp() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary
      FROM employee
      LEFT JOIN role
      ON employee.role_id = role.id
      LEFT JOIN department
      ON department.id = role.department_id;`             
  db.query(sql, function (err, res) {
    if (err) 
    return err;
    console.log("query received");
    console.table(res);
  })
}
viewAllEmp();
// init();