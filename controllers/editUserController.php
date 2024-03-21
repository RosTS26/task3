<?php

require_once("../vendor/connect.php");

$responseData = [
    "status" => false,
    "error" => null,
];

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

echo json_encode($responseData);