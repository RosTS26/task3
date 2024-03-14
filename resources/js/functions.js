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

// Показываем ошибку клиенту
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
        'text': userData.role
    });

    let statusCell = $('<td>', {
        'class': 'status item-center'
    }).append($('<div>', {
        'class': 'status-active active-' + Number(userData.status)
    }));

    let buttonsCell = $('<td>');
    let btnsGroup = $('<div>', {
        'class': 'input-group justify-content-center',
    });
    let editBtn = $('<button>', {
        'class': 'btn btn-outline-secondary edit-btn',
        'html': '<b>Edit</b>',
        'value': userData.id,
        'data-bs-toggle': 'modal',
        'data-bs-target': '#addUpdateModal'
    });
    let deleteBtn = $('<button>', {
        'class': 'btn btn-outline-secondary delete-btn',
        'html': '&#x1f5d1;',
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
    $(`[item-user-id="${id}"] .role`).html(newData.role);

    let oldStatus = (newData.status == 1) ? 0 : 1;
    $(`[item-user-id="${id}"] .status-active`)
        .removeClass("active-" + oldStatus)
        .addClass('active-' + newData.status);
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

                let oldState = (state == 1) ? 0 : 1;

                $(`[item-user-id="${id}"] .status-active`)
                    .removeClass("active-" + oldState)
                    .addClass('active-' + state);
            }
        } else {
            showModalError('Error code ' + res.error.code + ': ' + res.error.message);
        }
    });
}