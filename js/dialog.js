var aboutDialog = document.getElementById("about");
var aboutBtn = document.getElementById("menuAbout");
var closeBtn = document.getElementsByClassName("close")[0];

var contactDialog = document.getElementById("contact");
var contactBtn = document.getElementById("menuContact");
var closeBtnC = document.getElementById("closeContact");

aboutBtn.onclick = function () {
    rest_bord();
    aboutDialog.style.display = "block";
}

closeBtn.onclick = function () {
    aboutDialog.style.display = "none";
    //$('#welcome').show();
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


contactBtn.onclick = function () {
    reset();
    //hidefunc();
    contactDialog.style.display = "block";
}

closeBtnC.onclick = function () {
    contactDialog.style.display = "none";
  //  $('#welcome').show();
}

// ESCAPE key pressed
$(document).keydown(function (event) {
    var code = event.keyCode || event.which;
    if (code == 27){
        aboutDialog.style.display = "none";
        contactDialog.style.display = "none";
    }
})

// clicks outside of the modal
window.onclick = function (event) {
    if (event.target == aboutDialog ||event.target == contactDialog) {
        aboutDialog.style.display = "none";
        contactDialog.style.display= "none";
    }
}


