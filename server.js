const db = require('./db/connection');
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
    throw err;
    console.table(res);
  })
  init();
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
    }
  ])
  // .then(answer => {
  //   empObj = [answer.first_name, answer.last_name]
  //   roleSql = `SELECT id AS value, name AS title FROM role`;
  //   db.promise().query(roleSql, (err, data) => {
  //     if (err)
  //     throw err;
  //     const rolesArr = data.map({ id, title })
  //     inquirer.prompt(
  //       {
  //         type: "list",
  //         name: "role",
  //         message: "What is the employee's role?",
  //         choices: rolesArr
  //       }
  //     )
  //   })
  // }).then(roleAnswer => {
  //   const role = roleAnswer.role;
  //   empObj.push(role);
  //   const mgrSql = `SELECT id AS value, CONCAT(mgr.first_name, ' ', mgr.last_name) AS name
  //   FROM employee`;
  //   db.promise().query(mgrSql, (err, data) => {
  //     if (err)
  //     throw err;
  //     const mgrsArr = data.map({ id, name })
  //     inquirer.prompt(
  //       {
  //         type: "list",
  //         name: "mgr",
  //         message: "Who is the employee's manager?",
  //         choices: mgrsArr
  //       }
  //     )
  //   })
  // }).then(mgrAnswer => {
  //   const manager = mgrAnswer.manager;
  //   empObj.push(manager);
  //   const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
  //           VALUES (?, ?, ?, ?)`;
  //     db.query(sql, empObj, (err) => {
  //       if (err)
  //       throw err;
        
  //     })
  //     viewAllEmp();
  // })
    
}



function updateEmpMgr() {
  inquirer.prompt(
    {
      type: "list",
      name: "emp",
      message: "Which employee would you like to update?",
      choices: ["emp1","emp2"]
    },
    {
      type: "list",
      name: "mgr",
      message: "Which manager would you like to assign to this employee?"
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
        throw err;
        console.table(res);
})
init()
}

function addRole() {
  inquirer.prompt([
    {
      type: "input",
      name: "role",
      message: "What role would you like to add?"
    },
    {
      type: "input",
      name: "salary",
      message: "What salary would you like to have?"
    },
    {
      type: "input",
      name: "department_id",
      message: "What department id does this role belong to?"
    }
  ]
  ).then(data => {
    db.query(`INSERT INTO role (title, salary, department_id) 
          VALUES ('${data.role}', ${data.salary}, ${data.department_id})`, (err) => {
            if (err) {
              throw err;
            }                        
          })
          viewAllRoles()
        })  
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
    throw err;
    console.table(res);
})
init();
}

function addDept() {
  inquirer.prompt(
    {
      type: "input",
      name: "department",
      message: "What department would you like to add?"
    }
  ).then(data => {
    db.query(`INSERT INTO department (name) 
          VALUES ('${data.department}')`, (err) => {
            if (err) {
              throw err;
            }                        
          })
          viewAllDept();
        })  
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

