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
          "Exit"
        ],
      },
    ])
    .then(function (answers) {
      if (answers.choice === "View all departments") {
        viewDepartments();
      }
      else if (answers.choice === "View all roles") {
        viewRoles();
      }
      else if (answers.choice === "View all employees") {
        viewEmployees();
      }
      else if (answers.choice === "Add a role") {
        addRole();
      }
      else if (answers.choice === "Add an employee") {
        addEmployee();
      }
      else if (answers.choice === "Update an employee role") {
        updateRole();
      }
      else {
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
    })
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

  // add a role
  function addRole() {
    db.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;

      inquirer
      .prompt([
        {
          type: "input",
          name: "newRole",
          message: "What role would you like to add?"
        },
        {
         type: "input",
         name: "salary",
         message: "What is the salary for this role?" 
        },
        {
          name: 'Department',
          type: 'list',
          choices: function() {
              var deptArry = [];
              for (let i = 0; i < res.length; i++) {
              deptArry.push(res[i].name);
              }
              return deptArry;
          },
      }
  ]).then(function (answers) {
      let department_id;
      for (let i = 0; i < res.length; i++) {
          if (res[i].name == answers.Department) {
              department_id = res[i].id;
          }
      }

      db.query(
          'INSERT INTO role SET ?',
          {
              title: answers.newRole,
              salary: answers.salary,
              department_id: department_id
          },
          function (err, res) {
              if(err)throw err;
              console.log('Your new role has been added!');
              console.table('All Roles:', res);
              options();
          })
  })
})
};

  // exit app
  function exit() {
    db.end();
  };

  
