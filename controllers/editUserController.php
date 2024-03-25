<?php

require_once("../vendor/connect.php");

header('Content-Type: application/json');

$responseData = [
    "status" => false,
    "error" => null,
];

if (!isset($_POST['data']['name']) &&
    !isset($_POST['data']['surname']) &&
    !isset($_POST['data']['status']) &&
    !isset($_POST['data']['role']) &&
    !isset($_POST['id'])) {

    $responseData["error"] = [
        "code" => 100,
        "message" => "Error when updating user data",
    ];
} else {
    $userID = htmlspecialchars($_POST['id']);
    $userName = trim(htmlspecialchars($_POST['data']['name']));
    $userSurname = trim(htmlspecialchars($_POST['data']['surname']));
    $userStatus = htmlspecialchars($_POST['data']['status']);
    $userRole = (int)$_POST['data']['role'];
    
    if (!empty($userName) && !empty($userSurname) && !empty($userRole)) {
        $sql = "UPDATE users SET `name` = ?, `surname` = ?, `role` = ?, `status` = ? WHERE id = ?";
        $sth = $dbh->prepare($sql);
        $sth->execute(array(
            $userName,
            $userSurname,
            $userRole,
            $userStatus,
            $userID
        ));
    
        if ($sth->rowCount() > 0) {
            $responseData["status"] = true;
            $responseData["id"] = $userID;
        } else {
            $responseData["error"] = [
                "code" => 100,
                "message" => "Error updating user settings",
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