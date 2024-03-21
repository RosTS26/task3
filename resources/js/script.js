"use strict"

import * as Fun from './functions.js';

let arrIdSelectedUsers; // Массив id выбранных пользователей
let thisUserId; // id пользователя для изменения

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

// Add modal window
$('.add-btn').on('click', function() {
    Fun.changeModalWin('Add', {});
});

// Edit modal window
$(document).on('click', '.edit-btn', function() {
    const userId = Number($(this).val());
    const userData = usersData.get(userId);
    thisUserId = userId;

    Fun.changeModalWin('Update', userData);   
});

// Delete modal window
$(document).on('click', '.delete-btn', function() {
    const userId = Number($(this).val());
    const userData = usersData.get(userId);
    arrIdSelectedUsers = [userId];

    $('.delete-info').html(
        `Are you sure you want to delete 
        ${userData.name}  
        ${userData.surname}`
    );
});

// Usage select on click OK
$('.ok-btn').on('click', function() {
    let checksTrue = $('.item-checkbox').filter(':checked');
    let position = $(this).attr('position');

    if (checksTrue.length < 1) {
        Fun.showModalError('Error: User(s) not selected!');
        return 0;
    }

    arrIdSelectedUsers = checksTrue.map(function() {
        return Number($(this).val());
    }).get();
    
    const selectValue = $('.select-options-' + position).val();
    
    switch(selectValue) {  
        case "active":
            Fun.editStatusUsers(arrIdSelectedUsers, 1);
            break;
        case "not-active":
            Fun.editStatusUsers(arrIdSelectedUsers, 0);
            break;
        case "delete":
            $('.delete-info').html('Are you sure you want to delete these users?');
            new bootstrap.Modal($('#deleteModal')).show();
            break;
        default:
            Fun.showModalError('Error: Option not selected!');
            return 0;
    }
});

// Delete some users
$('#sent-delete').on('click', function() {
    Fun.deleteUsers(arrIdSelectedUsers);
});

// Add new user or edit item user
$('#submit-btn').on('click', function() {
    let operation = $('.update-or-create').attr('id');

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
                id: thisUserId,
                data: userData
            }, res => {    
                res = JSON.parse(res);
                
                if (res.status) {
                    $('.btn-close').click();
                    Fun.changeUserData(thisUserId, userData);
                } else {
                    $('.error-message').html(res.error.message).css('display', 'flex');
                    // Fun.showModalError('Error code ' + res.error.code + ': ' + res.error.message);
                }
            });
            break;

        case "Add":
            $.post('controllers/addUserController.php', userData, res => {
                $('.btn-close').click();
        
                res = JSON.parse(res);
                
                if (res.status) {
                    userData.id = Number(res.id);
        
                    usersData.set(userData.id, {
                        name: userData.name,
                        surname: userData.surname,
                        role: userData.role,
                        status: userData.status,
                    });
        
                    Fun.viewNewUser(userData);

                    $('#main-checkbox').prop('checked', false);
                } else {
                    Fun.showModalError('Error code ' + res.error.code + ': ' + res.error.message);
                }
            });
            break;
    }
});