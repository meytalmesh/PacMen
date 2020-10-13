var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;
var interval1;
var checkInterval;

var pac_movement=6;
var life=5;
var upKey;
var rightKey;
var leftKey;
var downKey;
var pacman_remain = 1;
var ghost1=new Object();
var g1_lastMove=new Object();
var ghost2=null;
var g2_lastMove=null;
var ghost3=null;
var g3_lastMove=null;
var ghost4=null;
var g4_lastMove=null;


var movingGift = new Object();
var movingGift_lastMove=new Object();
var interval_gift= null;

var clock=new Object();
var poisonCandy=new Object();
var interval_clock;
//setting from user
var color_p5 = "#ffffff";
var color_p15 = "#1900ff";
var color_p25 = "#e52929";
var balls;
var ghosts;
var time;
var numOfEatenFood=0;




$(document).ready(function() {
	context = canvas.getContext("2d");

	Start();
});

function Start() {
	board = new Array();
	life=5;
	score = 0;
	pac_color = "yellow";
	start_time = new Date();
	numOfEatenFood=0;
	initBoard();
	initGhost();//the ghost need to start from the corner.
	initGift();
	pacmanStartPosition();
	defineBalls();
	initClock();
	initPoisonCandy();
	keysDown = {};
	initDef();
	
	// addEventListener(
	// 	"keydown",
	// 	function(e) {
	// 		keysDown[e.keyCode] = true;
	// 	},
	// 	false
	// );
	addEventListener(
		"keydown", function(e) {
			if(e.code==upKey && shape.j > 0 && board[shape.i][shape.j-1]!=4){
				keysDown[1]=true;
				keysDown[2]=false;
				keysDown[3]=false;
				keysDown[4]=false;
			}
			if(e.code==downKey && shape.j < 19 && board[shape.i][shape.j+1]!=4){
				keysDown[1]=false;
				keysDown[2]=true;
				keysDown[3]=false;
				keysDown[4]=false;
			}
			if(e.code==leftKey && shape.i > 0 && board[shape.i-1][shape.j]!=4){
				keysDown[1]=false;
				keysDown[2]=false;
				keysDown[3]=true;
				keysDown[4]=false;
			}
			if(e.code==rightKey && shape.i < 19 && board[shape.i+1][shape.j]!=4){
				keysDown[1]=false;
				keysDown[2]=false;
				keysDown[3]=false;
				keysDown[4]=true;
			}
		}, false);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);

	interval = setInterval(UpdatePosition, 200);
	interval1=setInterval(updateGhostPosition,600);
	checkInterval=setInterval(checkCondition,50);
	interval_gift = setInterval(UpdateGift, 400);
	interval_clock = setInterval(clockRandomPosition, 10000);

	stop_all();
	play_game_music();
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {//left
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {//right
		if (shape.j < 19 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {//up
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {//down
		if (shape.i < 19 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 5) {
		score+=5;
		numOfEatenFood++;
	}
	if (board[shape.i][shape.j] == 15) {
		score+=15;
		numOfEatenFood++;
	}
	if (board[shape.i][shape.j] == 25) {
		score+=25;
		numOfEatenFood++;
	}
	if (board[shape.i][shape.j] == 50 || board[shape.i][shape.j] == 55||board[shape.i][shape.j] == 65||board[shape.i][shape.j] == 75) {
		score+=50;
		removeGift();
	}
	if (board[shape.i][shape.j] == 80 || board[shape.i][shape.j] == 85 || board[shape.i][shape.j] == 95 || board[shape.i][shape.j] == 105) {
		start_time.setSeconds(start_time.getSeconds() + 20);
		clock.i=90;
		clock.j=90;
		board[shape.i][shape.j] = 0;
	}
	if (board[shape.i][shape.j] == 20 ) {
		score-=20;
		poisonCandy.i=90;
		poisonCandy.j=90;
		board[shape.i][shape.j] = 0;
	}
	board[shape.i][shape.j] = 2;


	let currentTime = new Date();
	let currTime=(currentTime - start_time) ;
	time_elapsed = Math.floor(Number(time)-currTime/1000);

	if(Number(time_elapsed)<=0){
		window.clearInterval(interval);
		window.clearInterval(interval1);
		window.clearInterval(checkInterval);
		window.clearInterval(interval_gift);
		window.clearInterval(interval_clock);

		gameOver();

	}


	else if (numOfEatenFood==balls ) {
		clearInterval(interval);
		clearInterval(interval1);
		clearInterval(checkInterval);
		clearInterval(interval_gift);
		clearInterval(interval_clock);
		stop_all();
		play_win();
		gameOver();
	} else {
		Draw();
	}


}

function pacmanStartPosition(){
	let c=findRandomEmptyCell(board);
	shape.i = c[0];
	shape.j = c[1];
	board[c[0]][c[1]] = 2;
	pacman_remain--;
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 19 + 1);
	var j = Math.floor(Math.random() * 19 + 1);
	while (board[i][j] != 0  ) {
		i = Math.floor(Math.random() * 19 + 1);
		j = Math.floor(Math.random() * 19 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[1]) {
		pac_movement=1;
		return 1;
	}
	if (keysDown[2]) {
		pac_movement=2;
		return 2;
	}
	if (keysDown[3]) {
		pac_movement=3;
		return 3;
	}
	if (keysDown[4]) {
		pac_movement=4;
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board

	document.getElementById('p5_ball').style.color=color_p5;
	document.getElementById("p15_ball").style.color=color_p15;
	document.getElementById("p25_ball").style.color=color_p25;

	// updateHearts();

	lblScore.value = score;
	lblTime.value = time_elapsed;
	lblWelcome.value = cur_user;

	for (var i = 0; i < 20; i++) {
		for (var j = 0; j < 20; j++) {
			var center = new Object();
			center.x = i * 30 + 15;
			center.y = j * 30 + 15;
			if (board[i][j] == 2) {
				DrawPacman(context,center.x,center.y);
			} else if (board[i][j] == 5) {
				context.beginPath();
				context.arc(center.x, center.y, 7, 0, 2 * Math.PI); // circle
				context.fillStyle =color_p5; //color
				context.fill();
			} else if (board[i][j] == 15) {
				context.beginPath();
				context.arc(center.x, center.y, 7, 0, 2 * Math.PI); // circle
				context.fillStyle =color_p15; //color
				context.fill();
			}else if (board[i][j] == 25) {
				context.beginPath();
				context.arc(center.x, center.y, 7, 0, 2 * Math.PI); // circle
				context.fillStyle =color_p25; //color
				context.fill();
			}else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 15, center.y - 15, 30, 30);
				context.fillStyle = "#000080"; //color
				context.fill();
			}
			else if(board[i][j]==6 || board[i][j]==11|| board[i][j]==21 || board[i][j]==31 ||board[i][j]==86 ||board[i][j]==26){
				drawGhost(6);
			}
			else if(board[i][j]==7 || board[i][j]==12|| board[i][j]==22 || board[i][j]==32 ||board[i][j]==87 ||board[i][j]==27){
				drawGhost(7);
			}
			else if(board[i][j]==8 || board[i][j]==13|| board[i][j]==23 || board[i][j]==33 ||board[i][j]==88 ||board[i][j]==28){
				drawGhost(8);
			}
			else if(board[i][j]==9 || board[i][j]==14|| board[i][j]==24 || board[i][j]==34 ||board[i][j]==89 ||board[i][j]==29){
				drawGhost(9);
			}
			else if(board[i][j] == 50 || board[i][j] == 55||board[i][j] == 65||board[i][j] == 75 || board[i][j]==130 ||board[i][j]==70){
				drawGift();
			}
			else if(board[i][j] == 80 || board[i][j] == 85 || board[i][j] == 95 || board[i][j] == 105) {
				drawClock();
			}
			else if(board[i][j] == 20 ){
				drawPoisonCandy();
			}
		}
	}
}

function DrawPacman(ctx, x, y) {
	ctx.beginPath();
	if (pac_movement==1) {
		ctx.arc(x, y, 14, 1.65 * Math.PI, 1.35 * Math.PI);
		ctx.lineTo(x, y);
		ctx.fillStyle = pac_color; //color
		ctx.fill();
		ctx.beginPath();
		ctx.arc(x - 13, y - 0, 2, 0, 2 * Math.PI);
		ctx.fillStyle = "black"; //color
		ctx.fill();
	}
	else if (pac_movement==2) {
		ctx.arc(x, y, 14, 0.65 * Math.PI, 0.35 * Math.PI);
		ctx.lineTo(x, y);
		ctx.fillStyle = pac_color; //color
		ctx.fill();
		ctx.beginPath();
		ctx.arc(x + 13, y - 0, 2, 0, 2 * Math.PI);
		ctx.fillStyle = "black"; //color
		ctx.fill();
	}
	else if (pac_movement==4) {
		ctx.arc(x, y, 14, 0.15 * Math.PI, 1.85 * Math.PI);
		ctx.lineTo(x, y);
		ctx.fillStyle = pac_color; //color
		ctx.fill();
		ctx.beginPath();
		ctx.arc(x + 5, y - 10, 2, 0, 2 * Math.PI);
		ctx.fillStyle = "black"; //color
		ctx.fill();
	}
	else if (pac_movement==3) {
		ctx.arc(x, y, 14, 1.15 * Math.PI, 0.85 * Math.PI);
		ctx.lineTo(x, y);
		ctx.fillStyle = pac_color; //color
		ctx.fill();
		ctx.beginPath();
		ctx.arc(x - 5, y - 10, 2, 0, 2 * Math.PI);
		ctx.fillStyle = "black"; //color
		ctx.fill();
	}
	else{
		ctx.arc(x, y, 14, 0.15 * Math.PI, 1.85 * Math.PI);
		ctx.lineTo(x, y);
		ctx.fillStyle = pac_color; //color
		ctx.fill();
		ctx.beginPath();
		ctx.arc(x + 5, y - 10, 2, 0, 2 * Math.PI);
		ctx.fillStyle = "black"; //color
		ctx.fill();
	}
	ctx.closePath();

}

function updateHearts() {
	var canvas = document.getElementById('lblHeart');
	var img = document.getElementById("heart");
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if(life==1){
		ctx.drawImage(img, 0, 20, 40, 112);
	}
	else if(life==2){
		ctx.drawImage(img, 0, 20, 40, 112);
		ctx.drawImage(img, 60, 20, 40, 112);
	}
	else if(life==3){
		ctx.drawImage(img, 0, 20, 40, 112);
		ctx.drawImage(img, 60, 20, 40, 112);
		ctx.drawImage(img, 120, 20, 40, 112);
	}
	else if(life==4){
		ctx.drawImage(img, 0, 20, 40, 112);
		ctx.drawImage(img, 60, 20, 40, 112);
		ctx.drawImage(img, 120, 20, 40, 112);
		ctx.drawImage(img, 180, 20, 40, 112);
	}
	else if(life==5){
		ctx.drawImage(img, 0, 20, 40, 112);
		ctx.drawImage(img, 60, 20, 40, 112);
		ctx.drawImage(img, 120, 20, 40, 112);
		ctx.drawImage(img, 180, 20, 40, 112);
		ctx.drawImage(img, 240, 20, 40, 112);
	}
}

function initBoard() {
	board[0]= [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];
	board[1]= [4,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,4];
	board[2]= [4,0,0,4,0,0,0,0,0,0,4,0,0,0,0,4,0,0,0,4];
	board[3]= [4,0,0,4,0,0,0,0,0,0,4,0,0,0,0,4,0,0,0,4];
	board[4]= [4,0,0,4,4,4,0,0,0,0,0,0,0,0,4,4,4,0,0,4];
	board[5]= [4,0,0,4,4,4,0,0,0,0,0,0,0,0,0,4,0,0,0,4];
	board[6]= [4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,4];
	board[7]= [4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4];
	board[8]= [4,0,0,0,0,0,0,4,4,4,4,4,4,0,0,0,0,0,0,4];
	board[9]= [4,0,0,0,0,0,0,4,4,4,4,4,4,0,0,0,0,0,0,4];
	board[10]=[4,0,0,0,0,0,0,4,4,4,4,4,4,0,0,0,0,0,0,4];
	board[11]= [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4];
	board[12]= [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4];
	board[13]= [4,0,0,4,4,0,0,0,0,0,0,0,0,0,4,4,4,0,0,4];
	board[14]= [4,0,0,4,4,0,0,0,0,0,0,0,0,0,4,4,4,0,0,4];
	board[15]= [4,0,0,4,0,0,0,0,0,4,4,0,0,0,4,4,4,0,0,4];
	board[16]= [4,0,0,4,0,0,0,0,0,4,4,0,0,0,4,4,4,0,0,4];
	board[17]= [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,4];
	board[18]= [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4];
	board[19]= [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];
	//defineBalls();
}

function saveSettings(colorP5,colorP15, colorP25,ball,ghost,timer){
	color_p5=colorP5;
	color_p15=colorP15;
	color_p25=colorP25;
	balls=ball;
	ghosts=ghost;
	time=timer;
}

function setKeys(up,down,right,left) {
	upKey = up;
	downKey = down;
	rightKey = right;
	leftKey = left;
}

function defineBalls() {
	counter = 0;
	var b25 = Math.floor(balls * 0.1);
	var b15 = Math.floor(balls * 0.3);
	var b5 = Math.floor(balls * 0.6);
	var cell;
	for (var i = 0; i < b5; i++) {
		cell = findRandomEmptyCell(board);
		board[cell[0]][cell[1]] = 5;
		counter++;
	}
	for (var i = 0; i < b15; i++) {
		cell = findRandomEmptyCell(board);
		board[cell[0]][cell[1]] = 15;
		counter++;
	}
	for (var i = 0; i < b25; i++) {
		cell = findRandomEmptyCell(board);
		board[cell[0]][cell[1]] = 25;
		counter++;
	}
	while (counter <= balls) {
		cell = findRandomEmptyCell(board);
		board[cell[0]][cell[1]] = 5;
		counter++;
	}

}


function gameOver() {
	window.clearInterval(interval);
	window.clearInterval(interval1);
	window.clearInterval(checkInterval);
	window.clearInterval(interval_gift);
	window.clearInterval(interval_clock);
	$('#def').hide();
	$('#gameCanvas').hide();
	lbl_Score.value = score;
	lbl_Score1.value = score;
	lbl_Score2.value = score;
	if(life == 0){
		$('#gameOver').show();
	}

	else if(score<100){
		$('#gameOverTime').show();
		//alert("You are better than " + score + " points!");
	}

	else if(score>=100 || numOfEatenFood==balls){
		play_win();
		$('#winner').show();
	}
	stopGame();
}


function initGhost() {
	ghost1.i=1;
	ghost1.j=1;
	board[1][1]=6;
	g1_lastMove.i=1;
	g1_lastMove.j=1;
	 if(ghosts>1){
	 	ghost2=new Object();
	 	g2_lastMove=new Object();
		 ghost2.i=1;
		 ghost2.j=18;
		 board[1][18]=7;
		 g2_lastMove.i=1;
		 g2_lastMove.j=18;
	 }
	if(ghosts>2){
		ghost3=new Object();
		g3_lastMove=new Object();
		ghost3.i=18;
		ghost3.j=1;
		board[18][1]=8;
		g3_lastMove.i=18;
		g3_lastMove.j=1;
	}
	if(ghosts>3){
		ghost4=new Object();
		g4_lastMove=new Object();
		ghost4.i=18;
		ghost4.j=18;
		board[18][18]=9;
		g4_lastMove.i=18;
		g4_lastMove.j=18;
	}

}

function drawGhost(x) {
	if(x==6) {
		var g = document.getElementById("gh1");
		context.drawImage(g, ghost1.i * 30, ghost1.j * 30 - 2, 35, 35);
	}
	if(x==7){
		g=document.getElementById("gh2");
		context.drawImage(g,ghost2.i* 30 ,ghost2.j* 30-2 ,35,35);
	}
	if(x==8){
		g=document.getElementById("gh3");
		context.drawImage(g,ghost3.i* 30 ,ghost3.j* 30-2 ,35,35);
	}
	if(x==9){
		g=document.getElementById("gh4");
		context.drawImage(g,ghost4.i* 30 ,ghost4.j* 30-2 ,35,35);
	}

}

function checkPacmanAndGhost() {
	if(shape.i==ghost1.i && shape.j==ghost1.j){
		return true;
	}
	else if(ghosts>1 && shape.i==ghost2.i && shape.j==ghost2.j){
		return true;
	}else if(ghosts>2 && shape.i==ghost3.i && shape.j==ghost3.j){
		return true;
	}else if(ghosts>3 && shape.i==ghost4.i && shape.j==ghost4.j){
		return true;
	}
	return false;
}

function updateGhostPosition(){
	updateHearts();
	//ghost1
	let move=optimalMove(ghost1.i,ghost1.j,g1_lastMove.i,g1_lastMove.j);
	board[ghost1.i][ghost1.j]=board[ghost1.i][ghost1.j]-6;
	board[move[0]][move[1]]=board[move[0]][move[1]]+6;
	g1_lastMove.i=ghost1.i;
	g1_lastMove.j=ghost1.j;
	ghost1.i=move[0];
	ghost1.j=move[1];
	if(ghosts>1){
		//ghost2
		move=optimalMove(ghost2.i,ghost2.j,g2_lastMove.i,g2_lastMove.j);
		board[ghost2.i][ghost2.j]=board[ghost2.i][ghost2.j]-7;
		board[move[0]][move[1]]=board[move[0]][move[1]]+7;
		g2_lastMove.i=ghost2.i;
		g2_lastMove.j=ghost2.j;
		ghost2.i=move[0];
		ghost2.j=move[1];
	}
	if(ghosts>2){
		//ghost3
		move=optimalMove(ghost3.i,ghost3.j,g3_lastMove.i,g3_lastMove.j);
		board[ghost3.i][ghost3.j]=board[ghost3.i][ghost3.j]-8;
		board[move[0]][move[1]]=board[move[0]][move[1]]+8;
		g3_lastMove.i=ghost3.i;
		g3_lastMove.j=ghost3.j;
		ghost3.i=move[0];
		ghost3.j=move[1];
	}
	if(ghosts>3){
		//ghost4
		move=optimalMove(ghost4.i,ghost4.j,g4_lastMove.i,g4_lastMove.j);
		board[ghost4.i][ghost4.j]=board[ghost4.i][ghost4.j]-9;
		board[move[0]][move[1]]=board[move[0]][move[1]]+9;
		g4_lastMove.i=ghost4.i;
		g4_lastMove.j=ghost4.j;
		ghost4.i=move[0];
		ghost4.j=move[1];
	}



	// if(checkPacmanAndGhost()){
	// 	restart();
	// }
	// else{
	// 	drawGhosts();
	// }

}

function optimalMove(x,y,lastX,lastY){
	let minDist=100000;
	let move_i=x;
	let move_j=y;
	if(x+1<19 && board[x+1][y]!=4 && (x+1!=lastX || y!=lastY && !checkGhost(x+1,y) )){
		if(distance(x+1,y,shape.i,shape.j)<minDist){
			minDist=distance(x+1,y,shape.i,shape.j);
			move_i=x+1;
			move_j=y;
		}
	}
	if(x-1>0 && board[x-1][y]!=4 && (x-1!=lastX || y!=lastY ) && !checkGhost(x-1,y)) {
		if(distance(x-1,y,shape.i,shape.j)<minDist){
			minDist=distance(x-1,y,shape.i,shape.j);
			move_i=x-1;
			move_j=y;
		}
	}
	if(y+1<19 && board[x][y+1]!=4 && (x!=lastX || y+1!=lastY ) && !checkGhost(x,y+1) ){
		if(distance(x,y+1,shape.i,shape.j)<minDist){
			minDist=distance(x,y+1,shape.i,shape.j);
			move_i=x;
			move_j=y+1;
		}
	}
	if(y-1>0 && board[x][y-1]!= 4 && (x!=lastX || y-1!=lastY ) && !checkGhost(x,y-1)){
		if(distance(x,y-1,shape.i,shape.j)<minDist){
			minDist=distance(x,y-1,shape.i,shape.j);
			move_i=x;
			move_j=y-1;
		}
	}
	return[move_i,move_j];
}

function distance(x1,y1,x2,y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function restart() {

	board[ghost1.i][ghost1.j]=board[ghost1.i][ghost1.j]-6;
	if(ghosts>1){
		board[ghost2.i][ghost2.j]=board[ghost2.i][ghost2.j]-7;
	}
	if(ghosts>2){
		board[ghost3.i][ghost3.j]=board[ghost3.i][ghost3.j]-8;
	}
	if(ghosts>3){
		board[ghost3.i][ghost3.j]=board[ghost3.i][ghost3.j]-9;
	}
	initGhost();
	board[shape.i][shape.j]=board[shape.i][shape.j]-2;
	pacmanStartPosition();
	score-=10;
	life-=1;
}

function checkGhost(i,j){
	if(board[i][j]==6 || board[i][j]==11|| board[i][j]==21 || board[i][j]==31){
		return true;
	}
	else if(board[i][j]==7 || board[i][j]==12|| board[i][j]==22 || board[i][j]==32){
		return true;
	}
	else if(board[i][j]==8 || board[i][j]==13|| board[i][j]==23 || board[i][j]==33){
		return true;
	}
	else if(board[i][j]==9 || board[i][j]==14|| board[i][j]==24 || board[i][j]==34){
		return true;
	}
	return false;
}

function checkCondition() {
	// let currentTime = new Date();
	// let currTime=(currentTime - start_time) ;
	// time_elapsed = Math.floor(Number(time)-currTime/1000);

	if(checkPacmanAndGhost()){
		//play_hit();
		restart();
	}
	else if((time_elapsed<=0 && time_elapsed>-0.4) ){
		window.clearInterval(interval);
		window.clearInterval(interval1);
		window.clearInterval(checkInterval);
		window.clearInterval(interval_gift);
		window.clearInterval(interval_clock);
		gameOver();
	}
	else if(life==0){
		window.clearInterval(interval);
		window.clearInterval(interval1);
		window.clearInterval(checkInterval);
		window.clearInterval(interval_gift);
		window.clearInterval(interval_clock);
		gameOver();

	}
	// else if((time_elapsed<=0 && time_elapsed>-0.4)){
	// 	window.clearInterval(interval);
	// 	window.clearInterval(interval1);
	// 	window.clearInterval(checkInterval);
	// 	window.clearInterval(interval_gift);
	//
	// 	alert("Time is up!");
	// 	gameOver();
	// 	stop_game_music();
	// }
 	// else if (numOfEatenFood==balls || score>600) {
		//  	window.clearInterval(interval);
		// 	window.alert("Game completed");
		// 	score=0;
		// 	numOfEatenFood=0;
		// 	$('#gameBoard').hide();
		// 	$('#settings').show();
 	// }

}

$("#newGame, #startAgain, #startOver, #new_Game").click(function () {
	stop_all();
	$("#gameOver").hide();
	$("#winner").hide();
	$("#gameOverTime").hide();
	$("#gameBoard").show();
	$("#def").show();
	$("#gameCanvas").show();
	clearInterval(interval);
	clearInterval(interval1);
	clearInterval(checkInterval);
	clearInterval(interval_gift);
	clearInterval(interval_clock);

	window.alert("Start new Game!!!");
	setTimeout(1000);
	Start();

});

$("#newSetting").click(function () {

	//$('#gameBoard').hide();
	stop_all();
	clearInterval(interval);
	clearInterval(interval1);
	clearInterval(checkInterval);
	clearInterval(interval_gift);
	clearInterval(interval_clock);

	hidefunc();
	$('#gameBoard').hide();

	$("#game").show();
	$("#settings").show();
	$("#settings_form").show();
});

/*$("#new_Game").click(function () {
	stop_all();
	$("#gameOver").hide();
	$("#gameOverTime").hide();
	$("#winner").hide();
	$("#gameBoard").show();
	$("#def").show();
	$("#gameCanvas").show();


	clearInterval(interval);
	clearInterval(interval1);
	clearInterval(checkInterval);
	clearInterval(interval_gift);

	window.alert("Start new Game!!!");
	Start();
});*/

$("#set_settings").click(function () {
	//$('#gameBoard').hide();
	stop_all();
	clearInterval(interval);
	clearInterval(interval1);
	clearInterval(checkInterval);
	clearInterval(interval_gift);
	clearInterval(interval_clock);
	hidefunc();
	$('#gameBoard').hide();

	$("#game").show();
	$("#settings").show();
	$("#settings_form").show();
});

function initGift() {
	movingGift.i=2;
	movingGift.j=2;
	board[2][2]=50;
	movingGift_lastMove.i=2;
	movingGift_lastMove.j=2;
}

function drawGift() {
	var gift = document.getElementById("gift");
	context.drawImage(gift, movingGift.i * 30, movingGift.j * 30 - 2, 35, 35);
}

function UpdateGift() {

	let emptyCell = randomMove(movingGift.i,movingGift.j,movingGift_lastMove.i,movingGift_lastMove.j);
	board[movingGift.i][movingGift.j]=board[movingGift.i][movingGift.j]-50;
	board[emptyCell[0]][emptyCell[1]]=board[emptyCell[0]][emptyCell[1]]+50;
	movingGift_lastMove.i=movingGift.i;
	movingGift_lastMove.j=movingGift.j;
	movingGift.i=emptyCell[0];
	movingGift.j=emptyCell[1];
}

function randomMove(x,y,lastX,lastY){
	let move_i=movingGift.i;
	let move_j=movingGift.j;
	let dir = Math.random();

	//down
	if(y+1<19 && board[x][y+1]!=4 && (x!=lastX || y+1!=lastY ) && !checkGhost(x,y+1)&& dir < 0.25 ){
		move_i=x;
		move_j=y+1;
	}

	//up
	else if(y-1>0 && board[x][y-1]!= 4 && (x!=lastX || y-1!=lastY ) && !checkGhost(x,y-1)&& dir < 0.5){
		move_i=x;
		move_j=y-1;
	}

	//right
	else if(x+1<19 && board[x+1][y]!=4 && (x+1!=lastX || y!=lastY && !checkGhost(x+1,y) &&dir < 0.75 )){
		move_i=x+1;
		move_j=y;
	}

	//left
	else if(x-1>0 && board[x-1][y]!=4 && (x-1!=lastX || y!=lastY ) && !checkGhost(x-1,y)&& dir < 1) {
			move_i=x-1;
			move_j=y;
	}

	return[move_i,move_j];
}

// function findOptimalMoveGift(x,y,lastX,lastY) {
// 	let maxDist=0;
// 	let move_i=x;
// 	let move_j=y;
// 	if(x+1<19 && board[x+1][y]!=4 && (x+1!=lastX || y!=lastY && !checkGhost(x+1,y) )){
// 		if(distance(x+1,y,shape.i,shape.j)>maxDist){
// 			maxDist=distance(x+1,y,shape.i,shape.j);
// 			move_i=x+1;
// 			move_j=y;
// 		}
// 	}
// 	if(x-1>0 && board[x-1][y]!=4 && (x-1!=lastX || y!=lastY ) && !checkGhost(x-1,y)) {
// 		if(distance(x-1,y,shape.i,shape.j)>maxDist){
// 			maxDist=distance(x-1,y,shape.i,shape.j);
// 			move_i=x-1;
// 			move_j=y;
// 		}
// 	}
// 	if(y+1<19 && board[x][y+1]!=4 && (x!=lastX || y+1!=lastY ) && !checkGhost(x,y+1) ){
// 		if(distance(x,y+1,shape.i,shape.j)>maxDist){
// 			maxDist=distance(x,y+1,shape.i,shape.j);
// 			move_i=x;
// 			move_j=y+1;
// 		}
// 	}
// 	if(y-1>0 && board[x][y-1]!= 4 && (x!=lastX || y-1!=lastY ) && !checkGhost(x,y-1)){
// 		if(distance(x,y-1,shape.i,shape.j)>maxDist){
// 			maxDist=distance(x,y-1,shape.i,shape.j);
// 			move_i=x;
// 			move_j=y-1;
// 		}
// 	}
// 	return[move_i,move_j];
// }

function removeGift() {
	board[shape.i][shape.j]=board[shape.i][shape.j]-50;
	movingGift.i=100;
	movingGift.j=100;
	document.getElementById("gift").style.display="none";

}

function drawClock() {
	let c = document.getElementById("clock");
	context.drawImage(c, clock.i * 30, clock.j * 30 - 2, 35, 35);
}
function initClock() {
	let cell=findRandomEmptyCell(board);
	clock.i=cell[0];
	clock.j=cell[1];
	board[cell[0]][cell[1]]=80;
}

function drawPoisonCandy() {
	let c = document.getElementById("poisonCandy");
	context.drawImage(c, poisonCandy.i * 30, poisonCandy.j * 30 - 2, 35, 35);
}
function initPoisonCandy() {
	let cell=findRandomEmptyCell(board);
	poisonCandy.i=cell[0];
	poisonCandy.j=cell[1];
	board[cell[0]][cell[1]]=20;
}


function rest_bord() {
	clearInterval(interval);
	clearInterval(interval1);
	clearInterval(interval_gift);
	clearInterval(checkInterval);
	clearInterval(interval_clock);
	if (settings_validate !== null){
		settings_validate.resetForm();
	}
};

function stopGame() {
	stop_all();
	shape = new Object();
	board;
	start_time;
	time_elapsed;
	interval;
	interval1;
	checkInterval;
	upKey;
	ghost1=new Object();
	ghost2=null;
	ghost3=null;
	 ghost4=null;
	 movingGift = new Object();
	 interval_gift= null;
	interval_clock=null;
	 poisonCandy=new Object();

};

function clockRandomPosition(){
		var emptyCell = findRandomEmptyCell(board);
		board[clock.i][clock.j]=board[clock.i][clock.j]-80;
		board[emptyCell[0]][emptyCell[1]]=board[emptyCell[0]][emptyCell[1]]+80;
		clock.i=emptyCell[0];
		clock.j=emptyCell[1];

}

function initDef(){
	document.getElementById("numBa").innerText=" "+balls;
	document.getElementById("upButt").innerText=" "+upKey;
	document.getElementById("downButt").innerText=" "+downKey;
	document.getElementById("rightButt").innerText=" "+rightKey;
	document.getElementById("leftButt").innerText=" "+leftKey;
}