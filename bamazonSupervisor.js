require('dotenv').config();
var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');

var table = new Table({
    head: ['Department ID', 'Department', 'Overhead Costs', 'Product Sales', 'Total Profit']
    //colWidths: [100, 200]
});




var connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: process.env.PASSWORD,
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    superviseDB();
});

function superviseDB() {
    inquirer
        .prompt([{
            name: 'action',
            type: 'list',
            message: 'Hello Supervisor, what would you like to do?',
            choices: [
                'View Product Sales by Department',
                'Create New Department'
            ]
        }]).then(function (answer) {
            switch (answer.action) {
                case 'View Product Sales by Department':
                    viewSales();
                    break;

                case 'Create New Department':
                    newDepartment();
                    break;

                default:
                    viewSales();
            };
        });
};

function viewSales() {
    console.log('---Pulling Sales Information---');


    table.push(
        ['First value', 'Second value'], ['First value', 'Second value']
    );

    console.log(table.toString());
}