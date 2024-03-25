<?php

require_once("../vendor/connect.php");

header('Content-Type: application/json');

$responseData = [
    "status" => false,
    "error" => null,
];

if (!isset($_POST['name']) &&
    !isset($_POST['surname']) &&
    !isset($_POST['status']) &&
    !isset($_POST['role'])) {

    $responseData["error"] = [
        "code" => 100,
        "message" => "Error when adding user",
    ];
} else {
    $userName = trim(htmlspecialchars($_POST['name']));
    $userSurname = trim(htmlspecialchars($_POST['surname']));
    $userStatus = htmlspecialchars($_POST['status']);
    $userRole = (int)$_POST['role'];
    
    if (!empty($userName) && !empty($userSurname) && !empty($userRole)) {
        $sql = "INSERT INTO users (`name`, `surname`, `role`, `status`) VALUES (?, ?, ?, ?)";
        $sth = $dbh->prepare($sql);
        $res = $sth->execute(array($userName, $userSurname, $userRole, $userStatus));
    
        if ($res) {
            $responseData["status"] = true;
            $responseData["id"] = $dbh->lastInsertId();
        } else {
            $responseData["error"] = [
                "code" => 100,
                "message" => "Error when adding user",
            ];
        }
    } else {
        $responseData["error"] = [
            "code" => 100,
            "message" => "Username or role not specified",
        ];
    }
}

echo json_encode($responseData);