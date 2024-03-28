// Кастомная валидация данных
export function dataValidation(data) {
    let valid = true;
    const elements = {
        name: 'first-name-text',
        surname: 'last-name-text',
        role: 'select-status',
    }

    for (let key in data) {
        if (data[key] === '' || data[key] === null) {
            valid = false;
            $('#' + elements[key]).addClass('valid-error');
            setTimeout(() => {
                $('#' + elements[key]).removeClass('valid-error');
            }, 1500);
        }
    }

    return valid;
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
        'data-id': userData.id
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
        'role-id': userData.role,
        'text': userData.roleName
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
        'class': 'btn btn-outline-secondary btn-show-modal update-btn',
        'html': '<i class="bi bi-pencil-square"></i>',
        'data-id': userData.id,
    });
    let deleteBtn = $('<button>', {
        'class': 'btn btn-outline-secondary delete-btn',
        'html': '<i class="bi bi-trash"></i>',
        'data-id': userData.id,
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
    $(`[item-user-id="${id}"] .name`).html(newData.name);
    $(`[item-user-id="${id}"] .surname`).html(newData.surname);
    $(`[item-user-id="${id}"] .role`)
        .attr('role-id', newData.role)
        .html(newData.roleName);

    if (Number(newData.status)) {
        $(`[item-user-id="${id}"] .status-indicator`).addClass("active");
    } else {
        $(`[item-user-id="${id}"] .status-indicator`).removeClass("active");
    }
}

// Отправляем ID юзеров для изменения статуса
export function editStatusUsers(usersId, state) {
    $.post('controllers/editStatusController.php', { usersId, state }, res => {

        if (res.status) {
            // Меняем цвет иконок статуса и переписываем массив юзеров
            for (let id of usersId) {
                if (Number(state)) {
                    $(`[item-user-id="${id}"] .status-indicator`).addClass("active");
                } else {
                    $(`[item-user-id="${id}"] .status-indicator`).removeClass("active");
                }
            }
        } else {
            showModalError('Error code ' + res.error.code + ': ' + res.error.message);
        }
    });
}