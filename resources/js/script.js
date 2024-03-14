"use strict"

import * as Fun from './functions.js';

let arrIdSelectedUsers; // Массив id выбранных пользователей
let thisUserId; // id пользователя для изменения

// Check-boxs
$('#main-checkbox').change(function() {
    let check = $(this).prop('checked');
    $('.item-checkbox').prop('checked', check);
});

$('.item-checkbox').change(function() {
    if (!$(this).is(':checked')) $('#main-checkbox').prop('checked', false);
})

// Select-boxs
$('.select-options').change(function() {
    const value = $(this).val();
    $('.select-options').val(value);
});

// Add modal window
$('.add-btn').on('click', function() {
    Fun.changeModalWin('Add', {});
});

// Edit modal window
$('body').on('click', '.edit-btn', function() {
    const userId = Number($(this).val());
    const userData = usersData.get(userId);
    thisUserId = userId;

    Fun.changeModalWin('Update', userData);   
});

// Delete modal window
$('.delete-btn').on('click', function() {
    const userId = Number($(this).val());
    const userData = usersData.get(userId);
    arrIdSelectedUsers = [userId];

    $('.delete-info').html(
        `Are you sure you want to delete 
        ${userData.name}  
        ${userData.surname}`
    );
});

// Delete some users
$('#sent-delete').on('click', function() {
    Fun.deleteUsers(arrIdSelectedUsers);
});

// Usage select on click OK
$('.ok-btn').on('click', function() {
    let checksTrue = $('.item-checkbox').filter(':checked');

    if (!checksTrue.length > 0) {
        Fun.showModalError('Error: User(s) not selected!');
        return 0;
    }

    arrIdSelectedUsers = checksTrue.map(function() {
        return Number($(this).val());
    }).get();
    
    const selectValue = $('.select-options').val();
    
    switch(selectValue) {  
        case "active":
            Fun.editStatusUsers(arrIdSelectedUsers, 1);
            break;
        case "not-active":
            Fun.editStatusUsers(arrIdSelectedUsers, 0);
            break;
        case "delete":
            $('.delete-info').html('Are you sure you want to delete this users?');
            new bootstrap.Modal($('#deleteModal')).show();
            break;
        default:
            Fun.showModalError('Error: Option not selected!');
            return 0;
    }
});

// Add new user or edit item user
$('.update-or-create').submit(function(event) {
    event.preventDefault();
    
    let operation = $(this).attr('id');

    const userData = {
        name: $('#first-name-text').val(),
        surname: $('#last-name-text').val(),
        status: Number($('#status-check').is(':checked')),
        role: $('#select-status').val()
    }

    switch(operation) {
        case "Update":
            
            $.post('controllers/editUserController.php', {
                id: thisUserId,
                data: userData
            }, res => {
                $('.btn-close').click();
            
                res = JSON.parse(res);
                
                if (res.status) {
                    Fun.changeUserData(thisUserId, userData);
                } else {
                    Fun.showModalError('Error code ' + res.error.code + ': ' + res.error.message);
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
                } else {
                    Fun.showModalError('Error code ' + res.error.code + ': ' + res.error.message);
                }
            });
            break;
    }
});