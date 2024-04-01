"use strict"

import * as Fun from './functions.js';

const addUpdateModal = new bootstrap.Modal($('#addUpdateModal'));
const deleteModal = new bootstrap.Modal($('#deleteModal'));

// Close modal window
$('#addUpdateModal').on('hidden.bs.modal', function (e) {
    $('.error-message').removeClass('err-active');
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

// === Show modal window add/update ===
$(document).on('click', '.btn-show-modal', function() {
    let titel = 'Add';
    const user = {
        id: null,
        name: null,
        surname: null,
        role: null,
        status: null
    };

    // Update operation
    if ($(this).attr('data-id')) {
        titel = 'Update';
        user.id = Number($(this).attr('data-id'));
        user.name = $(`[item-user-id="${user.id}"] .name`).html();
        user.surname = $(`[item-user-id="${user.id}"] .surname`).html();
        user.role = $(`[item-user-id="${user.id}"] .role`).attr('role-id');
        user.status = $(`[item-user-id="${user.id}"] .status-indicator`).hasClass('active');
    }

    $('#update-user-id').val(user.id);
    $('#addUpdateModalLabel').html(titel + ' User');
    $('#submit-btn').text(titel);
    $("#first-name-text").val(user.name);
    $("#last-name-text").val(user.surname);
    $('#select-status').val(user.role); 
    $('#status-check').prop('checked', Boolean(user.status));
    
    addUpdateModal.show();
});

// === Delete modal window === 
$(document).on('click', '.delete-btn', function() {
    const userId = Number($(this).attr('data-id'));
    const name = $(`[item-user-id="${userId}"] .name`).html();
    const surname = $(`[item-user-id="${userId}"] .surname`).html();

    $('#delete-user-id').val(userId);
    $('.delete-info').html(`Are you sure you want to delete ${name} ${surname}`);

    deleteModal.show()  
});

// === Usage select on click OK ===
$('.ok-btn').on('click', function() {
    let checksTrue = $('.item-checkbox').filter(':checked');
    let selectElement = $(this).closest('.control-panel').find('.select-options');

    if (checksTrue.length < 1) {
        Fun.showModalError('Error: User(s) not selected!');
        return 0;
    }

    let arrIdSelectedUsers = checksTrue.map(function() {
        return Number($(this).attr('data-id'));
    }).get();
    
    const selectValue = selectElement.val();

    if (selectValue === "0" || selectValue === "1") {
        Fun.editStatusUsers(arrIdSelectedUsers, selectValue);
    } else if (selectValue === "2") {
        $('#delete-user-id').val(null);
        $('.delete-info').html('Are you sure you want to delete these users?');

        deleteModal.show();
    } else {
        Fun.showModalError('Error: Option not selected!');
    }
});

// Add new user or edit item user
$('#submit-btn').on('click', function() {
    const userId = $('#update-user-id').val();
    const userData = {
        name: $('#first-name-text').val(),
        surname: $('#last-name-text').val(),
        status: Number($('#status-check').is(':checked')),
        role: $('#select-status').val()
    }

    // Check validation
    if (!Fun.dataValidation(userData)) return 0; 

    if (userId) {
        // Update this user
        $.post('controllers/editUserController.php', {
            id: userId,
            data: userData
        }, res => {

            if (res.status) {
                addUpdateModal.hide();

                userData.roleName = $(`#select-status option[value="${userData.role}"]`).html();
                Fun.changeUserData(userId, userData);
            } else {
                $('.error-message').html(res.error.message).addClass('err-active');
                // Fun.showModalError('Error code ' + res.error.code + ': ' + res.error.message);
            }
        }, 'json');
    } else {
        // Add new user
        $.post('controllers/addUserController.php', userData, res => {

            if (res.status) {
                addUpdateModal.hide();
                $('#main-checkbox').prop('checked', false);
                
                userData.id = Number(res.id);
                userData.roleName = $(`#select-status option[value="${userData.role}"]`).html();
                
                Fun.viewNewUser(userData);
            } else {
                $('.error-message').html(res.error.message).addClass('err-active');
            }
        }, 'json');
    }
});

// Delete some users
$('#sent-delete').on('click', function() {
    let deleteId = $('#delete-user-id').val();
    let usersId = [deleteId];

    // Several users are selected
    if (!deleteId) {
        let checksTrue = $('.item-checkbox').filter(':checked');
        usersId = checksTrue.map(function() {
            return Number($(this).attr('data-id'));
        }).get();
    }

    $.post('controllers/deleteUsersController.php', { usersId }, res => {
        deleteModal.hide()

        if (res.status) {
            usersId.forEach(id => $(`[item-user-id="${id}"]`).remove());
        } else {
            showModalError('Error code ' + res.error.code + ': ' + res.error.message);
        }
    }, 'json');
});