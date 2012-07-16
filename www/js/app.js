// Setup requestAnimationFrame
requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 768;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "img/background.png";

// Border
var borderReady = false;
var borderImage = new Image();
borderImage.onload = function () {
	borderReady = true;
};
borderImage.src = "img/border.png";

// Ball 1
var ball1Ready = false;
var ball1Image = new Image();
ball1Image.onload = function () {
	ball1Ready = true;
};
ball1Image.src = "img/ball.png";

// Ball 2
var holeReady = false;
var holeImage = new Image();
holeImage.onload = function () {
	holeReady = true;
};
holeImage.src = "img/hole.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "img/ball2.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {
	speed: 128
};
var hole = {
};
var score = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
	
	hole.x = 32 + (Math.random() * (canvas.width - 64));
	hole.y = 32 + (Math.random() * (canvas.height - 64));
};

var Point = {x:0, y:0};
var monsterDestination;
var generateRandomDestination = function() {
       p = Point;

       p.x = Math.random() * canvas.width;
       p.y = Math.random() * canvas.height;
       return p;
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}
	
	if(monsterDestination == null || (monster.x == monsterDestination.x && monster.y == monsterDestination.y) )
       {
               monsterDestination = generateRandomDestination();
       }
       
       if(monster.x > monsterDestination.x)
               monster.x = Math.max(monster.x - monster.speed * modifier, monsterDestination.x);
       else
               monster.x = Math.min(monster.x + monster.speed * modifier, monsterDestination.x);
               
       if(monster.y > monsterDestination.y)
               monster.y = Math.max(monster.y - monster.speed * modifier, monsterDestination.y);
       else
               monster.y = Math.min(monster.y + monster.speed * modifier, monsterDestination.y);

	// Are they touching?
	if (hero.x <= (monster.x + 32) && 
	    monster.x <= (hero.x + 32) && 
	    hero.y <= (monster.y + 32) && 
	    monster.y <= (hero.y + 32))
	{
		--score;
		reset();
	} 
	else if (
		hero.x <= (hole.x + 32)
		&& hole.x <= (hero.x + 32)
		&& hero.y <= (hole.y + 32)
		&& hole.y <= (hero.y + 32)) 
	{
		++score;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	
	if (borderReady) {
		ctx.drawImage(borderImage, 0, 0);
	}
	
	if (holeReady) {
		ctx.drawImage(holeImage, hole.x, hole.y);
	}
	
	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	if (ball1Ready) {
		ctx.drawImage(ball1Image, hero.x, hero.y);
	}
	
	

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + score, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
	requestAnimationFrame(main);
};

// Let's play this game!
reset();
var then = Date.now();
main();
