const figlet = require("figlet");
const chalk = require("chalk");

const mysql = require("mysql2");
var inquirer = require("inquirer");

const db = require("./db/connection");
const cTable = require("console.table");

// generates terminal graphics
console.log(
  chalk.blue(figlet.textSync("Employee Manager", { horizontalLayout: "full" }))
);

// Start server after DB connection
db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  choice();
});

// inquirer main menu
function choice() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do??",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then(function (answers) {
      if (answers.choice === "View all departments") {
        viewDepartments();
      } else if (answers.choice === "View all roles") {
        viewRoles();
      } else if (answers.choice === "View all employees") {
        viewEmployees();
      } else if (answers.choice === "Add a department") {
        addDepartment();
      } else if (answers.choice === "Add a role") {
        addRole();
      } else if (answers.choice === "Add an employee") {
        addEmployee();
      } else if (answers.choice === "Update an employee role") {
        updateEmployeeRole();
      } else {
        exit();
      }
    });
}

// view all departments
function viewDepartments() {
  var query = "SELECT * FROM department";
  db.query(query, function (err, res) {
    if (err) throw err;
    console.log(res.length + " departments found!");
    console.table("All Departments:", res);
    choice();
  });
}

// view all employees in the database
function viewEmployees() {
  var query = "SELECT * FROM employee";
  db.query(query, function (err, res) {
    if (err) throw err;
    console.log(res.length + " employees found!");
    console.table("All Employees:", res);
    choice();
  });
}

// view roles
function viewRoles() {
  var query = "SELECT * FROM role";
  db.query(query, function (err, res) {
    if (err) throw err;
    console.log(res.length + " roles found!");
    console.table("All Roles:", res);
    choice();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "deptName",
      message: "What is the name of the department?",
    })
    .then(function (answer) {
      db.query(
        "INSERT INTO department (name) VALUES (?)",
        [answer.deptName],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          choice();
        }
      );
    });
}

// add a role
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "What's the name of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary for this role?",
      },
      {
        type: "input",
        name: "deptId",
        message: "What is the department id number?",
      },
    ])
    .then(function (answer) {
      db.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [answer.roleName, answer.salary, answer.deptId],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          choice();
        }
      );
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What's the first name of the employee?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What's the last name of the employee?",
      },
      {
        type: "input",
        name: "roleId",
        message: "What is the employee's role id number?",
      },
      {
        type: "input",
        name: "managerId",
        message: "What is the manager id number?",
      },
    ])
    .then(function (answer) {
      db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [answer.firstName, answer.lastName, answer.roleId, answer.managerId],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          choice();
        }
      );
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "chooseEmp",
        message: "What is the name of the employee whose role you would like to update?",
      },

      {
        type: "input",
        name: "updateRole",
        message: "What do you want to update the role to?",
      },
    ])
    .then(function (answer) {
      db.query(
        "UPDATE employee SET role_id=? WHERE first_name= ?",
        [answer.updateRole, answer.chooseEmp],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          choice();
        }
      );
    });
}

// exit app
function exit() {
  db.end();
}
