const pool = require('../db');
const inquirer = require('inquirer');

async function viewAllRoles() {
    const result = await pool.query(`
        SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        JOIN department ON role.department_id = department.id
    `);
    console.table(result.rows);
}

async function addRole() {
    const departments = await pool.query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(dept => ({ name: dept.name, value: dept.id }));

    const { title, salary, department_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for the role:',
            choices: departmentChoices
        }
    ]);

    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Added role ${title}`);
}

module.exports = { viewAllRoles, addRole };
