<?php

$db_driver = "mysql";
$host = "localhost";
$database = "db_task3"; // Название БД
$dsn = "$db_driver:host=$host; dbname=$database";

$username = "root"; // Логин
$password = "";	// Пароль

try {
	$dbh = new PDO ($dsn, $username, $password);
	// echo "Connect to database:". $database;
} catch (PDOException $e) {
	echo "Error". $e->getMessage();
	die(); 
}