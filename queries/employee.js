const pool = require('../db');
const inquirer = require('inquirer');

async function viewAllEmployees() {
    const result = await pool.query(`
        SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager_first, manager.last_name AS manager_last
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    `);
    console.table(result.rows);
}

async function addEmployee() {
    const roles = await pool.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

    const employees = await pool.query('SELECT * FROM employee');
    const managerChoices = employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the employee:'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the employee:'
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the role for the employee:',
            choices: roleChoices
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the manager for the employee (if any):',
            choices: [{ name: 'None', value: null }, ...managerChoices]
        }
    ]);

    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Added employee ${first_name} ${last_name}`);
}

async function updateEmployeeRole() {
    const employees = await pool.query('SELECT * FROM employee');
    const employeeChoices = employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));

    const roles = await pool.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(role => ({ name: role.title, value: role.id }));

    const { employee_id, role_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employeeChoices
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the new role for the employee:',
            choices: roleChoices
        }
    ]);

    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log(`Updated employee's role`);
}

module.exports = { viewAllEmployees, addEmployee, updateEmployeeRole };
