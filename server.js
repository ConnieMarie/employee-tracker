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

figlet("Employee \n Manager", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
  init();
});

// initialize the application with a menu of tasks to choose from
function init() {
  console.log(`\n
  ***********
   Main Menu
  ***********`);
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
        "View Budget by Department",
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
        case "View Budget by Department":
          viewBgtDept();
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

// view all employees in the database
function viewAllEmp() {
  const sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title AS title, department.name AS department, role.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
      FROM employee
      LEFT JOIN role
      ON employee.role_id = role.id
      LEFT JOIN department
      ON department.id = role.department_id
      LEFT JOIN employee mgr
      ON mgr.id = employee.manager_id;`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.log(`\n
    *********************
    Viewing All Employees
    *********************`);
    console.table(res);
    init();
  });
}

// view all employees under a selected manager
function viewEmpByMgr() {
  const sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.name AS department, role.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
  FROM employee
  LEFT JOIN role
  ON employee.role_id = role.id
  LEFT JOIN department
  ON department.id = role.department_id
  LEFT JOIN employee mgr
  ON mgr.id = employee.manager_id
  WHERE mgr.id is not null;`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.log(`\n
    ********************************
    Viewing All Employees by Manager
    ********************************`);
    console.table(res);
    init();
  });
}

// view all employees in a selected department
function viewEmpByDept() {
  const sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.name AS department, role.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
  FROM employee
  LEFT JOIN role
  ON employee.role_id = role.id
  LEFT JOIN department
  ON department.id = role.department_id
  LEFT JOIN employee mgr
  ON mgr.id = employee.manager_id
  ORDER BY department.id;`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.log(`\n
    ***********************************
    Viewing All Employees by Department
    ***********************************`);
    console.table(res);
    init();
  });
}

// add a new employee
function addEmp() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fist_name",
        message: "What is the employee's first name?",
        validate: (firstNameInput) => {
          if (firstNameInput) {
            return true;
          } else {
            console.log("Please enter employee's first name!");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee's last name?",
        validate: (lastNameInput) => {
          if (lastNameInput) {
            return true;
          } else {
            console.log("Please enter employee's last name!");
            return false;
          }
        },
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
            const mgrSql = `SELECT * FROM employee
                          WHERE manager_id IS NULL`;
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
                    type: "confirm",
                    name: "hasMgr",
                    message: "Does this role have a manager above it?",
                  },
                ])
                .then((answer) => {
                  if (answer.hasMgr) {
                    inquirer
                      .prompt([
                        {
                          type: "list",
                          name: "mgr",
                          message: "Who is the employee's manager?",
                          choices: mgrsArr,
                        },
                      ])
                      .then((mgrAnswer) => {
                        const mgr = mgrAnswer.mgr;
                        empObj.push(mgr);
                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                        db.query(sql, empObj, (err) => {
                          if (err) throw err;
                          console.log("Employee Added Successfully");
                          viewAllEmp();
                        });
                      });
                  } else {
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?, ?, ?, NULL)`;
                    db.query(sql, empObj, (err) => {
                      if (err) throw err;
                      console.log("Employee Added Successfully");
                      viewAllEmp();
                    });
                  }
                });
            });
          });
      });
    });
}

// update employee's manager
function updateEmpMgr() {
  const empSql = `SELECT * FROM employee
              WHERE manager_id IS NOT NULL`;
  db.query(empSql, (err, data) => {
    if (err) throw err;
    const empArr = data.map(({ id, first_name, last_name }) => ({
      name: first_name,
      last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "emp",
          message: "Which employee would you like to update?",
          choices: empArr,
        },
      ])
      .then((empAnswer) => {
        const emp = empAnswer.emp;
        const mgrSql = `SELECT * FROM employee
                      WHERE manager_id IS NULL`;
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
                name: "mgr",
                message: "What is the employee's new manager?",
                choices: mgrsArr,
              },
            ])
            .then((mgrAnswer) => {
              const mgr = mgrAnswer.mgr;
              const sql = `UPDATE employee SET manager_id = ?
                WHERE id = ?`;
              db.query(sql, [mgr, emp], (err) => {
                if (err) throw err;
                console.log("Employee Manager Updated Successfully");
                viewAllEmp();
              });
            });
        });
      });
  });
}

// update employee's role
function updateEmpRole() {
  const empSql = `SELECT * FROM employee`;
  db.query(empSql, (err, data) => {
    if (err) throw err;
    const empArr = data.map(({ id, first_name, last_name }) => ({
      name: first_name,
      last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "emp",
          message: "Which employee would you like to update?",
          choices: empArr,
        },
      ])
      .then((empAnswer) => {
        const emp = empAnswer.emp;
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
                message: "What is the employee's new role?",
                choices: rolesArr,
              },
            ])
            .then((roleAnswer) => {
              const role = roleAnswer.role;
              const sql = `UPDATE employee SET role_id = ?
                WHERE id = ?`;
              db.query(sql, [role, emp], (err) => {
                if (err) throw err;
                console.log("Employee Role Updated Successfully");
                viewAllEmp();
              });
            });
        });
      });
  });
}

// delete an employee
function delEmp() {
  const empSql = `SELECT * FROM employee`;
  db.query(empSql, (err, data) => {
    if (err) throw err;
    const empArr = data.map(({ id, first_name, last_name }) => ({
      name: first_name,
      last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "emp",
          message: "Which employee would you like to delete?",
          choices: empArr,
        },
      ])
      .then((empAnswer) => {
        const emp = empAnswer.emp;
        const sql = `DELETE FROM employee WHERE id = ?`;
        db.query(sql, emp, (err) => {
          if (err) throw err;
          console.log("Employee Successfully Deleted");
          viewAllEmp();
        });
      });
  });
}

// view all roles
function viewAllRoles() {
  const sql = `SELECT role.id, role.title, department.name AS department, role.salary
      FROM role
      LEFT JOIN department
      ON department.id = role.department_id`;
  db.query(sql, function (err, res) {
    if (err) throw err;
    console.log(`\n
    ******************
    Viewing All Roles
    ******************`);
    console.table(res);
    init();
  });
}

// add a role
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What is the title of this new role?",
        validate: (roleInput) => {
          if (roleInput) {
            return true;
          } else {
            console.log("Please enter this new role title!");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What salary would you like to have?",
        validate: (salaryInput) => {
          if (isNaN(salaryInput) || salaryInput === "") {
            return "Please enter this new role's salary!";
          } else {
            return true;
          }
        },
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
              console.log("Role Successfully Added");
              viewAllRoles();
            });
          });
      });
    });
}

// delete a role
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
          console.log("Role Successfully Deleted");
          viewAllRoles();
        });
      });
  });
}

// view all departments
function viewAllDept() {
  const sql = `SELECT * FROM department;`;
  db.query(sql, function (err, res) {
    if (err) throw err;
    console.log(`\n
    ***********************
    Viewing All Departments
    ***********************`);
    console.table(res);
    init();
  });
}

// view budget by department
function viewBgtDept() {
  const sql = `SELECT department_id AS id,
              department.name AS department,
              SUM(salary) AS budget
              FROM role
              LEFT JOIN Department ON role.department_id = department.id
              GROUP BY department_id`;
  db.query(sql, (err, res) => {
    if (err) throw err;
    console.log(`\n
    *****************************
    Viewing Budgets by Department
    *****************************`);
    console.table(res);
    init();
  });
}

// add a department
function addDept() {
  inquirer
    .prompt({
      type: "input",
      name: "dept",
      message: "What department would you like to add?",
      validate: (deptInput) => {
        if (deptInput) {
          return true;
        } else {
          console.log("Please enter the name of this new department!");
          return false;
        }
      },
    })
    .then((answer) => {
      const dept = answer.dept;
      const sql = `INSERT INTO department (name) 
      VALUES (?)`;
      db.query(sql, dept, (err) => {
        if (err) throw err;
      });
      console.log("Department Successfully Added");
      viewAllDept();
    });
}

// delete a department
function delDept() {
  const deptSql = `SELECT department.name AS department
              FROM department`;
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
          console.log("Department Successfully Deleted");
          viewAllDept();
        });
      });
  });
}

// exit the application
function exit() {
  db.end();
}
