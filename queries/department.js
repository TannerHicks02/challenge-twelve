const pool = require('../db');
const inquirer = require('inquirer');

async function viewAllDepartments() {
    const result = await pool.query('SELECT * FROM department');
    console.table(result.rows);
}

async function addDepartment() {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:'
        }
    ]);

    await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added department ${name}`);
}

module.exports = { viewAllDepartments, addDepartment };
