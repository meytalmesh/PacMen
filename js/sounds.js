var gameSong = new Audio("sounds/game.mp3");
var win = new Audio("sounds/win_sound.mp3");
var hit = new Audio("sounds/hit_sound.mp3");

function play_game_music() {
    gameSong.loop = true;
    gameSong.play();
}

function stop_game_music() {
    gameSong.pause();
    gameSong.currentTime = 0;
}

function play_hit() {
    hit.play();
}

function stop_hit() {
    hit.pause();
    hit.currentTime = 0;
}

function play_win() {
    win.play();
}

function stop_win() {
    win.pause();
    win.currentTime = 0;
}

function stop_all() {
    stop_game_music();
    stop_hit();
    stop_win();
}
