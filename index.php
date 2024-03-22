<?php
require_once("vendor/connect.php"); // connect DB
require_once("resources/views/head.php"); // connect header

$arrRole = [
    1 => 'User',
    2 => 'Admin'
];
$sql = "SELECT * FROM users";
$res = $dbh->query($sql)->fetchAll(PDO::FETCH_ASSOC);
?>

<body>
    <?php require_once("resources/views/modalWindow.php") ?>
    <main class="content p-4">
        <h6>Users</h6>
        <?php require("resources/views/controlBlock.php") ?>
        <div class="table-block">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">
                            <input class="form-check-input main-check" type="checkbox" id="main-checkbox">
                        </th>
                        <th scope="col">Name</th>
                        <th scope="col">Role</th>
                        <th scope="col">Status</th>
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody class="body-table">
                <?php foreach ($res as $item) {?>
                    <tr item-user-id="<?= $item['id'] ?>">
                        <td>
                            <input class="form-check-input item-checkbox" type="checkbox" value="<?= $item['id'] ?>">
                        </td>
                        <td>
                            <span class="name"><?= $item['name'] ?></span> 
                            <span class="surname"><?= $item['surname'] ?></span>
                        </td>
                        <td class="role" role-id="<?= $item['role'] ?>"><?= $arrRole[$item['role']] ?></td>
                        <td>
                            <div class="status">
                                <span class="status-indicator<?= $item['status'] ? " active" : "" ?>"></span>
                            </div>
                        </td>
                        <td>
                            <div class="input-group justify-content-center">
                                <button class="btn btn-outline-secondary btn-show-modal" type="button" value="<?= $item['id'] ?>" data-bs-toggle="modal" data-bs-target="#addUpdateModal">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button class="btn btn-outline-secondary delete-btn" type="button" value="<?= $item['id'] ?>" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                <?php } ?>
                </tbody>
            </table>
        </div>
        <?php require("resources/views/controlBlock.php") ?>
    </main>
</body>
</html>