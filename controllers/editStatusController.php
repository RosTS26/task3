<?php

require_once("../vendor/connect.php");

$responseData = [
    "status" => false,
    "error" => null,
];

$usersId = $_POST['usersId'];
$statusToChange = (int)!empty($_POST['state']);

if (is_array($usersId) && isset($usersId[0])) {
    $placeholders = rtrim(str_repeat('?,', count($usersId)), ',');;

    $sql = "UPDATE users SET `status` = $statusToChange WHERE id IN ($placeholders)";
    $sth = $dbh->prepare($sql);
    $sth->execute($usersId);

    $responseData["status"] = true;
} else {
    $responseData["error"] = [
        "code" => 100,
        "message" => "User(s) not found",
    ];
}

echo json_encode($responseData);