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
$userRole = htmlspecialchars($_POST['data']['role']);

if (!empty($userName) && !empty($userSurname)) {
    $sql = "UPDATE users SET `name` = ?, `surname` = ?, `role` = ?, `status` = ? WHERE id = ?";
    $sth = $dbh->prepare($sql);
    $sth->execute(array(
        $userName,
        $userSurname,
        $userRole,
        $userStatus,
        $userID
    ));

    $responseData["status"] = true;
    $responseData["id"] = $userID;
} else {
    $responseData["error"] = [
        "code" => 100,
        "message" => "Name or surname not specified",
    ];
}

echo json_encode($responseData);