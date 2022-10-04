const db = require("./db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const figlet = require("figlet");
require("dotenv").config();

const PORT = process.env.PORT || 3006;

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
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
  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View Employees by Manager",
        "View Employee by Department",
        "Add Employee",
        "Update Employee Manager",
        "Update Employee Role",
        "Delete Employee",
        "View All Roles",
        "Add Role",
        "Delete Role",
        "View All Departments",
        "Add Department",
        "Delete Department",
        "Exit",
      ],
    })
    .then((answer) => {
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
    });
}
init();

// function viewAllEmp() {
//   const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
//       FROM employee
//       LEFT JOIN role
//       ON employee.role_id = role.id
//       LEFT JOIN department
//       ON department.id = role.department_id
//       LEFT JOIN employee mgr
//       ON mgr.id = employee.manager_id;`;
//   db.query(sql, function (err, res) {
//     if (err) throw err;
//     console.table(res);
//   });
//   init();
// }

function viewEmpByMgr() {
  inquirer.prompt({
    type: "list",
    name: "manager",
    message: "Which manager would you like to view?",
    choices: ["mgr1", "mgr2"],
  });
}

function viewEmpByDept() {
  inquirer.prompt({
    type: "list",
    name: "dept",
    message: "Which department would you like to view?",
    choices: ["dept1", "dept2"],
  });
}

// Add a New Employee
function addEmp() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fist_name",
        message: "What is the employee's first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
      },
    ])
    .then((answer) => {
      const empObj = [answer.fist_name, answer.last_name];
      const roleSql = `SELECT role.id, role.title FROM role`;
      db.query(roleSql, (err, data) => {
        if (err) throw err;
        const rolesArr = data.map(({ id, title }) => ({
          name: title,
          value: id,
        }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: rolesArr,
            },
          ])
          .then((roleAnswer) => {
            const role = roleAnswer.role;
            empObj.push(role);
            const mgrSql = `SELECT * FROM employee`;
            db.query(mgrSql, (err, data) => {
              if (err) throw err;
              const mgrsArr = data.map(({ id, first_name, last_name }) => ({
                name: first_name,
                last_name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: mgrsArr,
                  },
                ])
                .then((mgrAnswer) => {
                  const mgr = mgrAnswer.manager;
                  empObj.push(mgr);
                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                  db.query(sql, empObj, (err) => {
                    if (err) throw err;
                  });
                  viewAllEmp();
                });
            });
          });
      });
    });
}

function updateEmpMgr() {
  inquirer.prompt(
    {
      type: "list",
      name: "emp",
      message: "Which employee would you like to update?",
      choices: ["emp1", "emp2"],
    },
    {
      type: "list",
      name: "mgr",
      message: "Which manager would you like to assign to this employee?",
    }
  );
}

function updateEmpRole() {
  inquirer.prompt({
    type: "list",
    name: "emp",
    message: "Which employee would you like to update?",
    choices: ["emp1", "emp2"],
  });
}

function delEmp() {
  inquirer.prompt({
    type: "list",
    name: "emp",
    message: "Which employee would you like to delete?",
    choices: ["emp1", "emp2"],
  });
}

function viewAllRoles() {
  const sql = `SELECT role.id, role.title, department.name AS department, role.salary
      FROM role
      LEFT JOIN department
      ON department.id = role.department_id;`;
  db.query(sql, function (err, res) {
    if (err) throw err;
    console.table(res);
  });
  init();
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What role would you like to add?",
      },
      {
        type: "input",
        name: "salary",
        message: "What salary would you like to have?",
      },
    ])
    .then((answer) => {
      const roleObj = [answer.role, answer.salary];
      const deptSql = `SELECT * FROM department`;
      db.query(deptSql, (err, data) => {
        if (err) throw err;
        const deptArr = data.map(({ id, name }) => ({
          name: name,
          value: id,
        }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "dept",
              message: "What department id does this role belong to?",
              choices: deptArr,
            },
          ])
          .then((deptAnswer) => {
            const dept = deptAnswer.dept;
            roleObj.push(dept);
            const sql = `INSERT INTO role (title, salary, department_id)
                  VALUES (?, ?, ?)`;
            db.query(sql, roleObj, (err) => {
              if (err) throw err;
            });
            viewAllRoles();
          });
      });
    });
}

function delRole() {
  const roleSql = `SELECT * FROM role`;
  db.query(roleSql, (err, data) => {
    if (err) throw err;
    const roleArr = data.map(({ id, title }) => ({
      name: title,
      value: id,
    }));
    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "Which role would you like to delete?",
          choices: roleArr,
        },
      ])
      .then((roleAnswer) => {
        const role = roleAnswer.role;
        const sql = `DELETE FROM role WHERE id = ?`;
        db.query(sql, role, (err) => {
          if (err) throw err;
        });
        viewAllRoles();
      });
  });
}

function viewAllDept() {
  const sql = `SELECT * FROM department;`;
  db.query(sql, function (err, res) {
    if (err) throw err;
    console.table(res);
  });
  init();
}

function addDept() {
  inquirer
    .prompt({
      type: "input",
      name: "dept",
      message: "What department would you like to add?",
    })
    .then((answer) => {
      const dept = answer.dept;
      const sql = `INSERT INTO department (name) 
      VALUES (?)`;
      db.query(sql, dept, (err) => {
        if (err) throw err;
      });
      viewAllDept();
    });
}

function delDept() {
  const deptSql = `SELECT * FROM department`;
  db.query(deptSql, (err, data) => {
    if (err) throw err;
    const deptArr = data.map(({ id, name }) => ({
      name: name,
      value: id,
    }));
    inquirer
      .prompt({
        type: "list",
        name: "dept",
        message: "Which department would you like to delete?",
        choices: deptArr,
      })
      .then((answer) => {
        const dept = answer.dept;
        const sql = `DELETE FROM department WHERE id = ?`;
        db.query(sql, dept, (err) => {
          if (err) throw err;
        });
        viewAllDept();
      });
  });
}

function exit() {
  db.end();
}
