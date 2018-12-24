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
    //if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    readProducts();
    //buyItem();
    //connection.end();
});

//readProducts();
//buyItem();

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log(`connected as id ${connection.threadId}\n`);
//     buyItem();
//     connection.end();
// })


function readProducts() {
    console.log('---Showing all Products---\n');
    connection.query('SELECT * FROM products', function (err, res) {
        //if (err) throw err;
        //console.log(res);
        for (var i = 0; i < res.length; i++) {
            console.log(`${res[i].item_ID} | ${res[i].product_name} | $${res[i].price}\n`)
        }
        //connection.end();
        buyItem();
    })
};

function buyItem() {
    console.log("---Item Purchase Interface---\n")
    inquirer
        .prompt([{
                name: "id",
                type: "input",
                message: "Enter Product ID: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "amount",
                type: "input",
                message: "Enter amount of product: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            // console.log(answer + "\n");
            // var query = "SELECT item_ID, product_name, price FROM products WHERE item_ID = 1"
            connection.query("SELECT item_ID, product_name, price, stock_quantity FROM products WHERE item_ID = ?", [answer.id], function (err, response) {
                console.log("\n ID: " + response[0].item_ID + ' | ' + "Product: " + response[0].product_name + ' | ' + 'Price: $' + response[0].price + '\n');
                //console.log(query.sql)
                if (response[0].stock_quantity < answer.amount) {
                    console.log("Sorry, we do not have enough inventory to meet your request.")
                } else {
                    var unitAmount = parseInt(response[0].stock_quantity - answer.amount);
                    var totalCost = parseInt(response[0].price * answer.amount);
                    //console.log(unitAmount);
                    updateStock(unitAmount, response[0].product_name, totalCost, answer);
                }
                connection.end();
            })
        })
}

function updateStock(unitAmount, resp, totalCost, answer) {
    connection.query('UPDATE products SET stock_quantity = ? WHERE item_ID = ?', [unitAmount, answer.id], function (err, response) {
        console.log(`You have purchased ${answer.amount} unit(s) of ${resp}\n`);
        console.log(`Total Cost: ${totalCost}`);
    })
};