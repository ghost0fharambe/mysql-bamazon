-- DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products
(
    item_ID INT(10) NOT NULL
    AUTO_INCREMENT,
product_name VARCHAR
    (255) NOT NULL,
department_name VARCHAR
    (255),
price DECIMAL
    (10,2) NOT NULL,
stock_quantity INT
    (10) NOT NULL,
PRIMARY KEY
    (item_id)
);