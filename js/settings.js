var  settings_validate = null;
var balls;
var ghosts;
var time;
var up;
var right;
var left;
var down;
var temp_txt = "";



const input_key = document.getElementById('change_key_input');
input_key.addEventListener('keydown', change_key);

var color_p5 = "#ffffff";
var color_p15 = "#1900ff";
var color_p25 = "#e52929";
var BOARD_CANVAS_CONTEXT = null;


function change_key(e) {
    var x = e.code;
    var txt;
    var flag = confirm("Are you sure you want to change the " + temp_txt + " key to the "+ x +" ?");
    if (flag) {
        txt = "The key has been changed!";
        if (temp_txt === "Up")
            up = x;
        else if (temp_txt === "Down")
            down = x;
        else if (temp_txt === "Left")
            left = x;
        else if (temp_txt === "Right")
            right = x;
    } else {
        txt = "The key has not been replaced";
    }
    alert(txt);
    $('#change_key_div').hide();
}


$(function() {
    $.validator.addMethod( "notEqualTo", function( value, element, param ) {
        return this.optional( element ) || !$.validator.methods.equalTo.call( this, value, element, param );
    }, "The color of each ball should be different. Please try again" );

    settings_validate = $("#settings_form").validate({
        rules: {
            num_balls: {
                required: true,
                digits: true,
                range: [50, 90]
            },
            num_ghost: {
                required: true,
                digits: true,
                range: [1, 4]
            },
            time: {
                required: true,
                digits: true,
                min: 60
            },
            point_color_15: {
                notEqualTo: '#point_color_5'
            },
            point_color_25: {
                notEqualTo: '#point_color_5',
                notEqualTo: '#point_color_15'
            }
        },
        submitHandler: function(form) {
            stop_all()
            setTimeout(startPlay(),3000);
            set_values();
            setKeys(up,down,right,left);
            Start();

            reset();
        }
    });
});

function set_values(){
    balls = document.getElementById('num_balls').value;
    ghosts = document.getElementById('num_ghost').value;
    time =  document.getElementById('time').value;
    color_p5 = document.getElementById('point_color_5').value;
    color_p15 = document.getElementById('point_color_15').value;
    color_p25 = document.getElementById('point_color_25').value;
    saveSettings(color_p5,color_p15,color_p25,balls,ghosts,time);


}

// function initBoard() {
//     var canvas = document.getElementById('canvas-board');
//     canvas.setAttribute('width', '550');
//     canvas.setAttribute('height', '550');
//     canvas_width = 550;
//     canvas_height = 550;
//     if (canvas.getContext) {
//         BOARD_CANVAS_CONTEXT = canvas.getContext('2d');
//     }
// }

function reset() {
    document.getElementById('num_balls').value = '';
    document.getElementById('num_ghost').value = '';
    document.getElementById('time').value = '';
    document.getElementById('point_color_5').value = "#ffffff";
    document.getElementById('point_color_15').value = "#1900ff";
    document.getElementById('point_color_25').value = "#e52929";
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

$("#random").click(function() {
    $('#gameBoard').hide();
    $('#gameOver').hide();
    document.getElementById('num_balls').value = Math.ceil(Math.random() * 41) + 49;
    document.getElementById('num_ghost').value = Math.ceil(Math.random() * 4);
    document.getElementById('time').value = Math.ceil(Math.random() * 121) + 59;
    document.getElementById('point_color_5').value = getRandomColor();
    document.getElementById('point_color_15').value = getRandomColor();
    document.getElementById('point_color_25').value = getRandomColor();
});
function startPlay(){
    $('#gameOver').hide();
    $('#settings').hide();
    $('#game').show();
    $('#gameBoard').show();
    $('#gameCanvas').show();
    $('#def').show();

}
// document.getElementById("startGame").click(function () {
//     hidefunc();
//     $("#gameBoard").show();
// });

$("#pre_up").click(function() {
    $('#change_key_div').show();
    temp_txt = "Up";
});

$("#pre_down").click(function() {
    $('#change_key_div').show();
    temp_txt = "Down";
});

$("#pre_right").click(function() {
    $('#change_key_div').show();
    temp_txt = "Right";
});

$("#pre_left").click(function() {
    $('#change_key_div').show();
    temp_txt = "Left";
});

