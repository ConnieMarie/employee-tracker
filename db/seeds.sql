USE employees;

INSERT INTO department (id, name)
VALUES
    (1, "Egineering"),
    (2, "Legal"),
    (3, "Finance"),
    (4, "Sales");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Lead Engineer", 150000, 1),
    ("Software Engineer", 120000, 1),
    ("Legal Team Lead", 250000, 2),
    ("Lawyer", 190000, 2),
    ("Account Manager", 160000, 3),
    ("Accountant", 125000, 3),
    ("Sales Lead", 100000, 4),
    ("Salesperson", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Michael", "Scott", 1, NULL),
    ("Dwight", "Schrute", 2, 1),
    ("Toby", "Flenderson", 3, NULL),
    ("Andy", "Bernard", 4, 3),
    ("Angela", "Martin", 5, NULL),
    ("Kevin", "Malone", 6, 5),
    ("Jim", "Halpert", 7, NULL),
    ("Pam", "Beesly", 8, 7);