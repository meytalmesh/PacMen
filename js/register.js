var register_validate = null
var login_validate = null
var users = {'a':'a'};
var cur_user= null;

users["p"]="p";



$().ready(function() {

    $.validator.addMethod('strongPassword', function(value, element) {
        return this.optional(element)
            || value.length >= 6 && /\d/.test(value) && /[A-Z]/i.test(value) || /[a-z]/i.test(value);
    }, 'Must contain at least one number and one letter, and at least 6 characters.')

    $.validator.addMethod('no_number', function(value, element) {
            return this.optional(element) && /[A-Z]/i.test(value) || /[a-z]/i.test(value);
        },

    $.validator.addMethod('userExist', function(value, element) {
            return this.optional(element) || !(value in users);
        }, 'User name exist, please choose a different name.'),

    // validate signup form on keyup and submit
    register_validate = $("#register_form").validate({
        rules: {
            first_name: {
                required : true,
                no_number : true
            },
            last_name: {
                required : true,
                no_number : true
            },
            user_name: {
                required: true,
                minlength: 2,
                userExist: true
            },
            password: {
                required: true,
                minlength: 6,
                strongPassword: true
            },
            confirm_password: {
                required: true,
                minlength: 6,
                equalTo: "#password",
                strongPassword: true

            },
            email: {
                required: true,
                email: true
            },
        },
        messages: {
            first_name: "Please enter your firstname",
            last_name: "Please enter your lastname",
            user_name: {
                required: "Please enter a username",
                minlength: "Your username must consist of at least 2 characters"
            },
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 6 characters long"
            },
            confirm_password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 6 characters long",
                equalTo: "Please enter the same password as above"
            },
            email: {
                required: 'Please enter an email address.',
                email: 'Please enter a <em>valid</em> email address.'
            }
        },
        submitHandler: function(form) {
            submit();
        }
    }))
});

// propose username by combining first- and lastname
 $("#user_name").focus(function() {
     var firstname = $("#first_name").val();
     var lastname = $("#last_name").val();
     if (firstname && lastname && !this.value) {
         this.value = firstname + "." + lastname;
     }
 });

function submit(){
    alert("submitted!");
    $('#register').hide();
    add_user();
    $('#login').show();
}

function startGame() {
    $('#settings').hide();
    $('#gameBoard').show();
}

function add_user(){
    users[document.getElementById('user_name').value]=document.getElementById('password').value;
}


function confirm_password() {
    var user_name = document.getElementById('login_user_name').value;
    if (user_name in users){
        var password = document.getElementById('login_password').value;
        if (password == users[user_name]){
            return true;
        }
    }
    return false;
}


$(function() {
    login_validate = $("#login_form").validate({
        rules: {
            login_user_name: {
                required: true,
                nowhitespace: true
            },
            login_password: {
                required: true
            }
        },
        submitHandler: function(form) {
            if (confirm_password()){
///////////////////////enter game///////////////////////////////
                cur_user = document.getElementById('login_user_name').value;
                document.getElementById('lblWelcome').value = cur_user;

                $('#login').hide();
                $('#game').show();
                $('#load_gif').show();
                setTimeout(game_settings,3000);
            }
            else{
                alert('Username or password is incorrecte.');
                document.getElementById('login_user_name').value = '';
                document.getElementById('login_password').value = '';
            }
        }
    });
});

function game_settings(){
    $('#load_gif').hide();
    document.getElementById('num_balls').value = '';
    document.getElementById('num_ghost').value = '';
    document.getElementById('time').value = '';
    up = 'ArrowUp';
    right = 'ArrowRight';
    left = 'ArrowLeft';
    down = 'ArrowDown';
    document.getElementById('point_color_5').value = "#ffffff";
    document.getElementById('point_color_15').value = "#1900ff";
    document.getElementById('point_color_25').value = "#e52929";
    $('#settings').show();
}