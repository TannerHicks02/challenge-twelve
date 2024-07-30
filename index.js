const inquirer = require('inquirer');
const pool = require('./db');
const departmentQueries = require('./queries/department');
const roleQueries = require('./queries/role');
const employeeQueries = require('./queries/employee');

async function mainMenu() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
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
        }
    ]);

    switch (action) {
        case 'View All Departments':
            await departmentQueries.viewAllDepartments();
            break;
        case 'View All Roles':
            await roleQueries.viewAllRoles();
            break;
        case 'View All Employees':
            await employeeQueries.viewAllEmployees();
            break;
        case 'Add a Department':
            await departmentQueries.addDepartment();
            break;
        case 'Add a Role':
            await roleQueries.addRole();
            break;
        case 'Add an Employee':
            await employeeQueries.addEmployee();
            break;
        case 'Update an Employee Role':
            await employeeQueries.updateEmployeeRole();
            break;
        case 'Exit':
            pool.end();
            return;
    }

    mainMenu();
}

mainMenu();
