const Employee = require('./db/Employee');
const db = require('./db/connection');
const mysql = require('mysql2/promise');
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
    choices: ["View All Employees", "View Employees by Manager", "View Employee by Department", "Add Employee", "Update Employee Manager", "Update Employee Role", "Delete Employee", "View All Roles", "Add Role", "Delete Role", "View All Departments", "Add Department", "Delete Department", "Exit"]
  }).then((answer) => {
    switch (answer.task) {
      case "View All Employees":
        viewAllEmp();
        break;
      case "View Employees by Manager":
        viewEmpByMgr();
        break;
      case "View Employee by Department":
        viewEmpByDept();
        break;
      case "Add Employee":
        addEmp();
        break;
      case "Update Employee Manager":
        updateEmpMgr();
        break;
      case "Update Employee Role":
        updateEmpRole();
        break;   
      case "Delete Employee":
        delEmp();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "Add Role":
        addRole();
        break;
      case "Delete Role":
        delRole();
        break;  
      case "View All Departments":
        viewAllDept();
        break;
      case "Add Department":
        addDept();
        break;
      case "Delete Department":
        delDept();
        break;
      case "Exit":
        exit();
    }
  })
}
init();

  

function viewAllEmp() {
  let emp = new Employee()
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
      FROM employee
      LEFT JOIN role
      ON employee.role_id = role.id
      LEFT JOIN department
      ON department.id = role.department_id
      LEFT JOIN employee mgr
      ON mgr.id = employee.manager_id;`             
  db.query(sql, function (err, res) {
    if (err) 
    return err;
    console.table(res);

    init();
  })
}

function viewEmpByMgr() {
  
    inquirer.prompt(
      {
        type: "list",
        name: "manager",
        message: "Which manager would you like to view?",
        choices: ["mgr1","mgr2"]
      }
    )    
  
}

function viewEmpByDept() {
  inquirer.prompt(
    {
      type: "list",
      name: "dept",
      message: "Which department would you like to view?",
      choices: ["dept1", "dept2"]
    }
  )
}

function addEmp() {
  inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      type: "input",
      name: "last_name",
      message: "What is the employee's last name?"
    },
    {
      type: "list",
      name: "role",
      message: "What is the employee's role?",
      choices: ["Lead Engineer", "Software Engineer", "Legal Team Lead", "Lawyer", "Account Manager", "Accountant", "Sales Lead","Salesperson"]
    }
  ]).then((answer) => {
  
  })
}


function updateEmpMgr() {
  inquirer.prompt(
    {
      type: "list",
      name: "emp",
      message: "Which employee would you like to update?",
      choices: ["emp1","emp2"]
    }
  )
}

function updateEmpRole() {
  inquirer.prompt(
  {
    type: "list",
    name: "emp",
    message: "Which employee would you like to update?",
    choices: ["emp1", "emp2"]
  }
)

}

function delEmp() {
  inquirer.prompt(
    {
      type: "list",
      name: "emp",
      message: "Which employee would you like to delete?",
      choices: ["emp1", "emp2"]
    }
  )
}



function viewAllRoles() {
  const sql = `SELECT role.id, role.title, department.name AS department, role.salary
      FROM role
      LEFT JOIN department
      ON department.id = role.department_id;`
    db.query(sql, function (err, res) {
        if (err) 
        return err;
        console.table(res);
})
}

function addRole() {
  inquirer.prompt(
    {
      type: "input",
      name: "role",
      message: "What role would like to add?"
    }
  )
}

function delRole() {
  inquirer.prompt(
    {
      type: "list",
      name: "role",
      message: "Which role would you like to delete?",
      choices: ["role1","role2"]
    }
  )
}

function viewAllDept() {
  const sql = `SELECT * FROM department;`
  db.query(sql, function (err, res) {
    if (err) 
    return err;
    console.table(res);
})
}

function addDept() {
  inquirer.prompt(
    {
      type: "input",
      name: "department",
      message: "What department would you like to add?"
    }
  )
}

function delDept() {
  inquirer.prompt(
    {
      type: "list",
      name: "dept",
      message: "Which department would you like to delete?",
      choices: ["dept1", "dept2"]
    }
  )
}

function exit() {
  db.end();
}

