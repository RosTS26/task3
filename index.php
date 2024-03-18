<?php
require_once("vendor/connect.php"); // connect DB
require_once("resources/views/head.php"); // connect header

$sql = "SELECT * FROM users";
$res = $dbh->query($sql)->fetchAll(PDO::FETCH_ASSOC);
?>

<body>
    <?php require_once("resources/views/modalWindow.php") ?>
    <main class="content py-4 mx-4">
        <h6>Users</h6>
        <?php require("resources/views/headerControl.php") ?>
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
                        <th scope="col">Options</th>
                    </tr>
                </thead>
                <tbody class="body-table">
                <script>
                    const usersData = new Map();        
                </script>
                <?php foreach ($res as $item) {?>
                    <tr item-user-id="<?= $item['id'] ?>">
                        <td>
                            <input class="form-check-input item-checkbox" type="checkbox" value="<?= $item['id'] ?>">
                        </td>
                        <td>
                            <span class="name"><?= $item['name'] ?></span> 
                            <span class="surname"><?= $item['surname'] ?></span>
                        </td>
                        <td class="role"><?= $item['role'] == 2 ? 'Admin' : 'User' ?></td>
                        <td class="status item-center">
                            <div class="status-active active-<?= $item['status'] ?>"></div>
                        </td>
                        <td>
                            <div class="input-group justify-content-center">
                                <button class="btn btn-outline-secondary edit-btn" type="button" value="<?= $item['id'] ?>" data-bs-toggle="modal" data-bs-target="#addUpdateModal">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button class="btn btn-outline-secondary delete-btn" type="button" value="<?= $item['id'] ?>" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                    <i class="bi bi-trash"></i>
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
                <?php } ?>
                </tbody>
            </table>
        </div>
        <?php require("resources/views/footerControl.php") ?>
    </main>
</body>
</html>