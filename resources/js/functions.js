// Роли юзеров
let roles = {
    1: "User",
    2: "Admin", 
}

// Кастомная валидация данных
export function dataValidation(user) {
    let errors = {
        name: 'Please fill "First name"!',
        surname: 'Please fill "Last name"!',
        role: "Please choose a role!",
    }

    for (let key in user) {
        if (user[key] === '' || user[key] === null) {
            $('.error-message').html(errors[key]).css('display', 'flex');
            return 0;
        }
    }

    return 1;
}

// Изменение модального окна
export function changeModalWin(operation, data) {
    let { name, surname, status, role } = data;

    $('.update-or-create').attr('id', operation);
    $('#addUpdateModalLabel').html(operation + ' User');
    $('#submit-btn').html(operation);
    $("#first-name-text").val(name);
    $("#last-name-text").val(surname);
    $('#status-check').prop('checked', Boolean(status));
    $('#select-status').val(role); 
}

// Модальное окно ошибки
export function showModalError(textError) {
    $('.modal-info-error').html(textError);
    new bootstrap.Modal($('#errorModal')).show();
}

// Показываем нового юзера
export function viewNewUser(userData) {
    // Создание элемента checkbox и добавление его в первый столбец
    let checkbox = $('<input>', {
        'class': 'form-check-input item-checkbox',
        'type': 'checkbox',
        'value': userData.id
    });

    let checkCell = $('<td>').append(checkbox);

    let nameTxt = $('<span>', {
        'class': 'name',
        'text': userData.name
    });
    let surnameTxt = $('<span>', {
        'class': 'surname',
        'text': userData.surname
    });

    let nameCell = $('<td>').append(nameTxt).append(' ').append(surnameTxt);

    let roleCell = $('<td>', {
        'class': 'role',
        'text': roles[userData.role]
    });

    let statusActive = Number(userData.status) ? " active" : "";
    let statusCell = $('<td>')
        .append($('<div>', {
            'class': 'status'
        }).append($('<span>', {
        'class': 'status-indicator' + statusActive
    })));

    let buttonsCell = $('<td>');
    let btnsGroup = $('<div>', {
        'class': 'input-group justify-content-center',
    });
    let editBtn = $('<button>', {
        'class': 'btn btn-outline-secondary edit-btn',
        'html': '<i class="bi bi-pencil-square"></i>',
        'value': userData.id,
        'data-bs-toggle': 'modal',
        'data-bs-target': '#addUpdateModal'
    });
    let deleteBtn = $('<button>', {
        'class': 'btn btn-outline-secondary delete-btn',
        'html': '<i class="bi bi-trash"></i>',
        'value': userData.id,
        'data-bs-toggle': 'modal',
        'data-bs-target': '#deleteModal'
    });
    btnsGroup.append(editBtn).append(deleteBtn)
    buttonsCell.append(btnsGroup);

    // Генерируем строку в таблице с данными
    let newRow = $('<tr>').attr('item-user-id', userData.id)
        .append(checkCell)
        .append(nameCell)
        .append(roleCell)
        .append(statusCell)
        .append(buttonsCell);

    $('.body-table').append(newRow);
}

// Меняйем пользовательские данные на стороне клиента
export function changeUserData(id, newData) {
    usersData.set(id, newData);
    
    $(`[item-user-id="${id}"] .name`).html(newData.name);
    $(`[item-user-id="${id}"] .surname`).html(newData.surname);
    $(`[item-user-id="${id}"] .role`).html(roles[newData.role]);

    if (Number(newData.status)) {
        $(`[item-user-id="${id}"] .status-indicator`)
            .addClass("active");
    } else {
        $(`[item-user-id="${id}"] .status-indicator`)
            .removeClass("active");
    }
}

// Отправляем ID юзеров для удаления
export function deleteUsers(usersId) {
    $.post('controllers/deleteUsersController.php', { usersId }, res => {
        $('.btn-close').click();

        res = JSON.parse(res);

        if (res.status) {
            // Удаляем юзеров у клиента (из массива и таблицы)
            usersId.forEach(id => {
                usersData.delete(id);
                $(`[item-user-id="${id}"]`).remove();
            });
        } else {
            showModalError('Error code ' + res.error.code + ': ' + res.error.message);
        }
    });
}

// Отправляем ID юзеров для изменения статуса
export function editStatusUsers(usersId, state) {
    $.post('controllers/editStatusController.php', { usersId, state }, res => {
        $('.btn-close').click();

        res = JSON.parse(res);

        if (res.status) {
            // Меняем цвет иконок статуса и переписываем массив юзеров
            for (let id of usersId) {
                let thisData = usersData.get(id);

                if (thisData.status == state) continue;

                thisData.status = state;
                usersData.set(id, thisData);

                if (Number(thisData.status)) {
                    $(`[item-user-id="${id}"] .status-indicator`)
                        .addClass("active");
                } else {
                    $(`[item-user-id="${id}"] .status-indicator`)
                        .removeClass("active");
                }
            }
        } else {
            showModalError('Error code ' + res.error.code + ': ' + res.error.message);
        }
    });
}