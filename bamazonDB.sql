-- DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
item_ID INT(10) NOT NULL AUTO_INCREMENT,
product_name VARCHAR(255) NOT NULL,
department_name VARCHAR(255),
price INT(10) NOT NULL,
stock_quantity INT(10) NOT NULL,
PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_ID INT(10) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(255),
    overhead_costs INT(15),
    PRIMARY KEY (department_ID)
);