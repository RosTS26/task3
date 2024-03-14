<?php

require_once("../vendor/connect.php");

$responseData = [
    "status" => false,
    "error" => null,
];

$userName = trim(htmlspecialchars($_POST['name']));
$userSurname = trim(htmlspecialchars($_POST['surname']));
$userStatus = htmlspecialchars($_POST['status']);
$userRole = htmlspecialchars($_POST['role']);

if (!empty($userName) && !empty($userSurname)) {
    $sql = "INSERT INTO users (`name`, `surname`, `role`, `status`) VALUES (?, ?, ?, ?)";
    $sth = $dbh->prepare($sql);
    $sth->execute(array($userName, $userSurname, $userRole, $userStatus));

    $responseData["status"] = true;
    $responseData["id"] = $dbh->lastInsertId();
} else {
    $responseData["error"] = [
        "code" => 100,
        "message" => "Name or surname not specified",
    ];
}

echo json_encode($responseData);