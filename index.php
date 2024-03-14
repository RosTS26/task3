<?php
require_once("vendor/connect.php"); // connect DB
require_once("resources/views/head.php"); // connect header

$sql = "SELECT * FROM users";
$res = $dbh->query($sql)->fetchAll(PDO::FETCH_ASSOC);
?>

<body>
    <? require_once("resources/views/modalWindow.php") ?>
    <main class="content py-4 mx-4">
        <h6>Users</h6>
        <? require("resources/views/controlPanel.php") ?>
        <div class="table-block">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col" style="width: 10%">
                            <input class="form-check-input main-check" type="checkbox" id="main-checkbox">
                        </th>
                        <th scope="col" style="width: 35%">Name</th>
                        <th scope="col">Role</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody class="body-table">
                <script>
                    const usersData = new Map();        
                </script>
                <? foreach ($res as $item) {?>
                    <tr item-user-id="<?= $item['id'] ?>">
                        <td>
                            <input class="form-check-input item-checkbox" type="checkbox" value="<?= $item['id'] ?>">
                        </td>
                        <td>
                            <span class="name"><?= $item['name'] ?></span> 
                            <span class="surname"><?= $item['surname'] ?></span>
                        </td>
                        <td class="role"><?= $item['role'] ?></td>
                        <td class="status item-center">
                            <div class="status-active active-<?= $item['status'] ?>"></div>
                        </td>
                        <td>
                            <div class="input-group justify-content-center">
                                <button class="btn btn-outline-secondary edit-btn" type="button" value="<?= $item['id'] ?>" data-bs-toggle="modal" data-bs-target="#addUpdateModal">
                                    <b>Edit</b>
                                </button>
                                <button class="btn btn-outline-secondary delete-btn" type="button" value="<?= $item['id'] ?>" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                    &#x1f5d1;
                                </button>
                            </div>
                        </td>
                    </tr>
                    <script>
                        usersData.set(<?= $item['id'] ?>, {
                            name: "<?= $item['name'] ?>",
                            surname: "<?= $item['surname'] ?>",
                            role: "<?= $item['role'] ?>",
                            status: <?= $item['status'] ?>,
                        });
                    </script>
                <? } ?>
                </tbody>
            </table>
        </div>
        <? require("resources/views/controlPanel.php") ?>
    </main>
</body>
</html>