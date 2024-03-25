"use strict"

import * as Fun from './functions.js';

// Close modal window
let myModal = new bootstrap.Modal($('#addUpdateModal'));
myModal._element.addEventListener('hidden.bs.modal', function (e) {
    $('.error-message').css('display', 'none');
});

// Check-boxs
$('#main-checkbox').change(function() {
    let check = $(this).prop('checked');
    $('.item-checkbox').prop('checked', check);
});

$(document).on('change', '.item-checkbox', function() {
    let checksTrue = $('.item-checkbox').filter(':checked');

    if (!$(this).is(':checked')) {
        $('#main-checkbox').prop('checked', false);
    }
    else if ($('.item-checkbox').length == checksTrue.length) {
        $('#main-checkbox').prop('checked', true);
    }
});

// Show modal window add/update
$(document).on('click', '.btn-show-modal', function() {
    let titel = 'Add';
    let userId = null;
    const userData = {
        name: null,
        surname: null,
        role: null,
        status: null
    };

    // Update operation
    if ($(this).hasClass('update-btn')) {
        titel = 'Update';
        userId = Number($(this).val());
        userData.name = $(`[item-user-id="${userId}"] .name`).html();
        userData.surname = $(`[item-user-id="${userId}"] .surname`).html();
        userData.role = $(`[item-user-id="${userId}"] .role`).attr('role-id');
        userData.status = $(`[item-user-id="${userId}"] .status-indicator`).hasClass('active');
    }

    Fun.changeModalWin(titel, userId, userData);   
});

// Delete modal window
$(document).on('click', '.delete-btn', function() {
    const userId = Number($(this).val());
    const name = $(`[item-user-id="${userId}"] .name`).html();
    const surname = $(`[item-user-id="${userId}"] .surname`).html();

    $('.delete-info')
        .attr('user-id', userId)
        .html(`Are you sure you want to delete ${name} ${surname}`);
});

// Usage select on click OK
$('.ok-btn').on('click', function() {
    let checksTrue = $('.item-checkbox').filter(':checked');
    let selectElement = $(this).closest('.control-panel').find('.select-options');

    if (checksTrue.length < 1) {
        Fun.showModalError('Error: User(s) not selected!');
        return 0;
    }

    let arrIdSelectedUsers = checksTrue.map(function() {
        return Number($(this).val());
    }).get();
    
    const selectValue = selectElement.val();

    if (selectValue === "0" || selectValue === "1") {
        Fun.editStatusUsers(arrIdSelectedUsers, selectValue);
    } else if (selectValue === "2") {
        $('.delete-info')
                .attr('user-id', 0)
                .html('Are you sure you want to delete these users?');

            new bootstrap.Modal($('#deleteModal')).show();
    } else {
        Fun.showModalError('Error: Option not selected!');
    }
});

// Delete some users
$('#sent-delete').on('click', function() {
    let deleteIdAttr = Number($('.delete-info').attr('user-id'));
    let usersId = [deleteIdAttr];

    if (deleteIdAttr <= 0) {
        let checksTrue = $('.item-checkbox').filter(':checked');
        usersId = checksTrue.map(function() {
            return Number($(this).val());
        }).get();
    }

    Fun.deleteUsers(usersId);
});

// Add new user or edit item user
$('#submit-btn').on('click', function() {
    const operation = $('.update-or-create').attr('operation');
    const userId = $('.update-or-create').attr('user-id');
    const userData = {
        name: $('#first-name-text').val(),
        surname: $('#last-name-text').val(),
        status: Number($('#status-check').is(':checked')),
        role: $('#select-status').val()
    }

    // Check validation
    if (!Fun.dataValidation(userData)) return 0; 

    switch(operation) {
        case "Update":
            $.post('controllers/editUserController.php', {
                id: userId,
                data: userData
            }, res => {

                if (res.status) {
                    $('.btn-close').click();

                    userData.roleName = $(`#select-status option[value="${userData.role}"]`).html();
                    Fun.changeUserData(userId, userData);
                } else {
                    $('.error-message').html(res.error.message).css('display', 'flex');
                    // Fun.showModalError('Error code ' + res.error.code + ': ' + res.error.message);
                }
            });
            break;

        case "Add":
            $.post('controllers/addUserController.php', userData, res => {
                $('.btn-close').click();

                if (res.status) {
                    $('#main-checkbox').prop('checked', false);

                    userData.id = Number(res.id);
                    userData.roleName = $(`#select-status option[value="${userData.role}"]`).html();

                    Fun.viewNewUser(userData);
                } else {
                    Fun.showModalError('Error code ' + res.error.code + ': ' + res.error.message);
                }
            });
            break;
    }
});