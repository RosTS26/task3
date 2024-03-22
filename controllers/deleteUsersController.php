<?php

require_once("../vendor/connect.php");

header('Content-Type: application/json');

$responseData = [
    "status" => false,
    "error" => null,
];

$usersId = $_POST['usersId'];

if (is_array($usersId) && isset($usersId[0])) {
    $placeholders = rtrim(str_repeat('?,', count($usersId)), ',');

    $sql = "DELETE FROM users WHERE id IN ($placeholders)";
    $sth = $dbh->prepare($sql);
    $sth->execute($usersId);

    if ($sth->rowCount() == 0) {
        $responseData["error"] = [
            "code" => 100,
            "message" => "User(s) not found",
        ];
    } else {
        $responseData["status"] = true;
    }
} else {
    $responseData["error"] = [
        "code" => 100,
        "message" => "No users specified",
    ];
}

echo json_encode($responseData);