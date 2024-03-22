<?php

require_once("../vendor/connect.php");

header('Content-Type: application/json');

$responseData = [
    "status" => false,
    "error" => null,
];

$usersId = $_POST['usersId'];
$countUserIds = count($usersId); // Длина массива входящих id юзеров
$statusToChange = (int)!empty($_POST['state']);

if (is_array($usersId) && $countUserIds != 0) {
    $placeholders = rtrim(str_repeat('?,', $countUserIds), ',');

    // Проверяем, существует ли каждый пользователь
    $sql = "SELECT COUNT(*) FROM users WHERE id IN ($placeholders)";
    $sth = $dbh->prepare($sql);
    $sth->execute($usersId);
    $count = $sth->fetchColumn(); // Кол-во найденых юзеров

    if ($count != $countUserIds) {
        $responseData["error"] = [
            "code" => 100,
            "message" => "Status update error",
        ];
        echo json_encode($responseData);
        exit;
    }

    // Обновляем статус
    $sql = "UPDATE users SET `status` = $statusToChange WHERE id IN ($placeholders)";
    $sth = $dbh->prepare($sql);
    $sth->execute($usersId);

    $responseData["status"] = true;
    $responseData["ids"] = $usersId;
} else {
    $responseData["error"] = [
        "code" => 100,
        "message" => "User(s) not found",
    ];
}

echo json_encode($responseData);