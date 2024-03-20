require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');


// Setup the connection to the database using environment variables
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to the database
connection.connect(err => {
    if (err) throw err;
    console.log(`Connected to the ${process.env.DB_NAME} database.`);
    init();
});

// Initialize the application
function init() {
    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.action) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                break;
            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    });
}

function viewAllDepartments() {
    const query = `SELECT * FROM department`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
}

function viewAllRoles() {
    const query = `SELECT * FROM role`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
}

function viewAllEmployees() {
    const query = `SELECT * FROM employee`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
}

function addDepartment() {
    inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: 'What is the name of the department?'
    }).then(answer => {
        const query = `INSERT INTO department (name) VALUES (?)`;
        connection.query(query, answer.departmentName, (err, res) => {
            if (err) throw err;
            console.log(`Department added: ${answer.departmentName}`);
            init();
        });
    });
}

function addDepartment() {
    inquirer.prompt({
        name: 'departmentName',
        type: 'input',
        message: 'What is the name of the department?'
    }).then(answer => {
        const query = `INSERT INTO department (name) VALUES (?)`;
        connection.query(query, answer.departmentName, (err, res) => {
            if (err) throw err;
            console.log(`Department added: ${answer.departmentName}`);
            viewAllDepartments(); // O init() para volver al menú
        });
    });
}

function addRole() {
    // Obtener departamentos para la elección del departamento
    connection.query('SELECT * FROM department', (err, departments) => {
        if (err) throw err;
        const departmentChoices = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of the role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary for the role?',
                validate: input => !isNaN(input) || "Please enter a valid number."
            },
            {
                name: 'departmentId',
                type: 'list',
                message: 'Which department does the role belong to?',
                choices: departmentChoices
            }
        ]).then(answers => {
            const query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            connection.query(query, [answers.title, answers.salary, answers.departmentId], (err, res) => {
                if (err) throw err;
                console.log(`Role added: ${answers.title}`);
                viewAllRoles(); // O init() para volver al menú
            });
        });
    });
}


function addEmployee() {
    // Obtenemos roles para poder asignar al empleado
    connection.query('SELECT * FROM role', (err, roles) => {
        if (err) throw err;

        const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
        }));

        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the employee\'s first name?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the employee\'s last name?'
            },
            {
                name: 'roleId',
                type: 'list',
                message: 'What is the employee\'s role?',
                choices: roleChoices
            }
            // Aquí podrías agregar más preguntas para cosas como el manager del empleado
        ]).then(answers => {
            const query = 'INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)';
            connection.query(query, [answers.firstName, answers.lastName, answers.roleId], (err, res) => {
                if (err) throw err;
                console.log(`Employee added: ${answers.firstName} ${answers.lastName}`);
                init();
            });
        });
    });
}

function updateEmployeeRole() {
    // Obtenemos empleados y roles para poder hacer la actualización
    connection.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw err;

        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        inquirer.prompt([
            {
                name: 'employeeId',
                type: 'list',
                message: 'Which employee\'s role do you want to update?',
                choices: employeeChoices
            }
            // Continúa con preguntas sobre el nuevo rol
        ]).then(answer => {
            let chosenEmployee = answer.employeeId;
            connection.query('SELECT * FROM role', (err, roles) => {
                if (err) throw err;

                const roleChoices = roles.map(({ id, title }) => ({
                    name: title,
                    value: id
                }));

                inquirer.prompt([
                    {
                        name: 'roleId',
                        type: 'list',
                        message: 'Which is the new role of the employee?',
                        choices: roleChoices
                    }
                ]).then(answer => {
                    connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [answer.roleId, chosenEmployee], (err, res) => {
                        if (err) throw err;
                        console.log(`Employee's role updated`);
                        init();
                    });
                });
            });
        });
    });
}


// To exit the application
function exitApp() {
    console.log('Goodbye!');
    connection.end();
    process.exit();
}

function viewAllEmployees() {
    const query = `
      SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title, 
        d.name AS department, 
        r.salary, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      LEFT JOIN role r ON e.role_id = r.id
      LEFT JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON m.id = e.manager_id
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
}
