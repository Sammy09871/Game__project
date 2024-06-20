document.addEventListener("DOMContentLoaded", function() {
    let canvas = document.getElementById('gameCanvas');
    let ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 1000;

    // Load sound files
    let rescueSound = new Audio("sounds/rescue.mp3");
    let hitSound = new Audio("sounds/hit.mp3");

    // Load images
    let shipImage = new Image();
    let astroImage = new Image();
    let enemyImage = new Image();

    let shipReady = false;
    let astroReady = false;
    let enemyReady = false;

    shipImage.onload = () => { shipReady = true; };
    astroImage.onload = () => { astroReady = true; };
    enemyImage.onload = () => { enemyReady = true; };

    shipImage.src = 'images/space_ship.png';
    astroImage.src = 'images/astro.png';
    enemyImage.src = 'images/enemy_ship.png';

    let ship = { speed: 200, x: canvas.width / 120, y: canvas.height - 100 }; // Increased speed to 10
    let astro = { x: Math.random() * (canvas.width - 32), y: 100 };
    let enemies = [];
    let numEnemies = 5;
    let score = 0;

    for (let i = 0; i < numEnemies; i++) {
        enemies.push({
            x: Math.random() * (canvas.width - 32),
            y: Math.random() * (canvas.height / 2),
            dx: 2 * (Math.random() < 0.5 ? 1 : -1)
        });
    }

    let keysDown = {};
    addEventListener("keydown", function(e) {
        keysDown[e.key] = true;
    }, false);
    addEventListener("keyup", function(e) {
        delete keysDown[e.key];
    }, false);

    function update(delta) {
        if (keysDown['a'] && ship.x > 0) { // 'A' key for moving left
            ship.x -= ship.speed * delta;
        }
        if (keysDown['d'] && ship.x < canvas.width - shipImage.width) { // 'D' key for moving right
            ship.x += ship.speed * delta;
        }
        if (keysDown['w'] && ship.y > 0) { // 'W' key for moving up
            ship.y -= ship.speed * delta;
        }
        if (keysDown['s'] && ship.y < canvas.height - shipImage.height) { // 'S' key for moving down
            ship.y += ship.speed * delta;
        }

        enemies.forEach(enemy => {
            enemy.x += enemy.dx;
            if (enemy.x <= 0 || enemy.x >= canvas.width - enemyImage.width) enemy.dx = -enemy.dx;
        });

        if (Math.abs(ship.x - astro.x) < 32 && Math.abs(ship.y - astro.y) < 32) {
            rescueSound.play();
            resetAstro();
            score++;
        }

        enemies.forEach(enemy => {
            if (Math.abs(ship.x - enemy.x) < 32 && Math.abs(ship.y - enemy.y) < 32) {
                hitSound.play();
                resetGame();
                score = 0;
            }
        });
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (shipReady) ctx.drawImage(shipImage, ship.x, ship.y);
        if (astroReady) ctx.drawImage(astroImage, astro.x, astro.y);
        if (enemyReady) enemies.forEach(enemy => ctx.drawImage(enemyImage, enemy.x, enemy.y));

        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 30);
    }

    function resetAstro() {
        astro.x = Math.random() * (canvas.width - 32);
        astro.y = 100;
    }

    function resetGame() {
        ship.x = canvas.width / 2;
        ship.y = canvas.height - 100;
        resetAstro();
        enemies.forEach(enemy => {
            enemy.x = Math.random() * (canvas.width - 32);
            enemy.y = Math.random() * (canvas.height / 2);
            enemy.dx = 2 * (Math.random() < 0.5 ? 1 : -1);
        });
    }

    let then = Date.now();
    function main() {
        let now = Date.now();
        let delta = (now - then) / 1000; // convert to seconds
        update(delta);
        render();
        then = now;
        requestAnimationFrame(main);
    }

    main();
});
