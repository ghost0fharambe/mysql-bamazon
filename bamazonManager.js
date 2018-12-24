require('dotenv').config();
var inquirer = require('inquirer');
var mysql = require('mysql');

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
    manageDB();
});

function manageDB() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Hello Manager, what would you like to do?",
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ]
        })
        .then(function (answer) {

            switch (answer.action) {
                case 'View Products for Sale':
                    viewProducts();
                    break;

                case 'View Low Inventory':
                    lowInventory();
                    break;

                case 'Add to Inventory':
                    addToInventory();
                    break;

                case 'Add New Product':
                    newProduct();
                    break;

                default:
                    viewProducts();
            };
        });
};

function viewProducts() {
    console.log('---Showing all Products---\n');
    connection.query('SELECT * FROM products', function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(`ID: ${res[i].item_ID} | Product: ${res[i].product_name} | Price: $${res[i].price} | Quantity: ${res[i].stock_quantity}\n`)
        };
        connection.end();
    });
};

function lowInventory() {
    console.log('---Showing Low Inventory Products---\n')
    connection.query('SELECT * FROM products WHERE stock_quantity < ? ORDER BY stock_quantity', [10000], function (err, res) {
        if (err) throw err;

        if (res[0]) {
            for (var i = 0; i < res.length; i++) {
                console.log(`ID: ${res[i].item_ID} | Product: ${res[i].product_name} | Price: $${res[i].price} | Quantity: ${res[i].stock_quantity}\n`)
            }
        } else {
            console.log('--No low inventory--\n');
        };
        connection.end();
    })
};

function addToInventory() {
    inquirer
        .prompt([{
                name: 'id',
                type: 'input',
                message: 'Enter Product ID: ',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'amount',
                type: 'input',
                message: 'Enter Amount: ',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            connection.query('UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_ID = ?', [answer.amount, answer.id], function (err, res) {
                if (err) throw err;
                console.log(`
                ---UPDATING INVENTORY---\n
                Adding ${answer.amount} units to stock of Product ID ${answer.id}
                `)
                connection.end();
            })
        })
};

function newProduct() {
    inquirer
        .prompt([{
                name: 'name',
                type: 'input',
                message: 'Enter Product Name: '
            },
            {
                name: 'dept',
                type: 'input',
                message: 'Enter Product Department: '
            },
            {
                name: 'price',
                type: 'input',
                message: 'Enter Product Price',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: 'quantity',
                type: 'input',
                message: 'Enter Product Quantity',
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            console.log(
                `
                ---ADDING NEW PRODUCT---\n
                Name: ${answer.name}\n
                Department: ${answer.dept}\n
                Price: ${answer.price}\n
                Quantity: ${answer.quantity}\n
                `
            )
            connection.query("INSERT INTO products SET ?", {
                product_name: answer.name,
                department_name: answer.dept,
                price: answer.price,
                stock_quantity: answer.quantity
            }, function (err, res) {
                if (err) throw err;
                console.log('---Product Added---')
                updateDepartments();
                connection.end();
            });
        });
}

function updateDepartments() {
    connection.query('INSERT INTO departments (department_name) SELECT DISTINCT department_name FROM products', function(err, res){
        if (err) throw err;
        console.log("\n---Departments Updated---")
    })
}