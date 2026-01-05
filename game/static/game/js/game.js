// game.js - Endless Car Driving Game with Custom SVG Designs

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// তোর SVG as Data URLs
const roadSVG = "data:image/svg+xml;base64," + btoa(`<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 24.3.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 774.7 205.2" style="enable-background:new 0 0 774.7 205.2;" xml:space="preserve">
<style type="text/css">
	.st0{fill:#A0A0A0;}
</style>
<path class="st0" d="M397.5,0v13.2h-2.1V0H0v205.5h390.3l2-38.9H405l2.9,38.9h366.8V0H397.5z M395.4,15.5h2.1v9.8h-2.1V15.5z
	 M395.4,27.9h2.1v4.5h-2.1V27.9z M395.4,35.2h2.1v4.5h-2.1V35.2z M395,42.5h3.1v5.9H395V42.5z M395,50.8h3.1v5.9H395V50.8z
	 M395,59.1h3.1v7.2H395V59.1z M395,68.8h4.7l0.9,11.3H395V68.8z M395,84.5h5.2l1.9,19.2h-8.2L395,84.5z M393.5,110.9h9.1l1,20.6H392
	L393.5,110.9z M392,155.3v-17.5h12.7l0.7,17.5H392z"/>
</svg>
`);

const playerCarSVG = "data:image/svg+xml;base64," + btoa(`<?xml version="1.0" encoding="utf-8"?>
<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.9 46.6">
<style>.st0{fill:#000791;}.st1{fill:#ffffff;}</style>
<g><rect x="-189.9" y="-46.6" transform="matrix(-1 -1.224647e-16 1.224647e-16 -1 -377.7941 -91.2646)" class="st0" width="2" height="2"/><rect x="-207.6" y="-46.6" transform="matrix(-1 -1.224647e-16 1.224647e-16 -1 -413.2194 -91.2646)" class="st0" width="2" height="2"/></g>
<path class="st0" d="M-208.4-18.1l0.5,12.8l3,2.7l0.8,2.7h4.6h3.5h4.6l0.8-2.7l3-2.7l0.5-12.8h3.3v-2.5h-3.7V-43l-2.5-0.8l-1.3-2.8h-4.6h-3.5h-4.6l-1.3,2.8L-208-43v22.5h-3.7v2.5H-208.4z M-206.7-40.2h1.4l0.5-1.1h15v1.4l1,0.1v1.8l-1.1,0.1v1.1h-1.2v1.1h-13.2V-37h-1l0.1-1.2h-1.5V-40.2z M-206.6-16.9l2.1-2.8h5.7h2.1h5.7l2.1,2.8h1.1l-0.5,3l-0.7,0.3l-2.9,0.7l-0.7,1.5h-10.4l-0.7-1.5l-2.9-0.7l-0.7-0.3l-0.5-3H-206.6z"/>
<g><rect x="4.7" y="42.8" class="st1" width="1.9" height="1.9"/><rect x="21.2" y="42.8" class="st1" width="1.9" height="1.9"/></g>
<path class="st1" d="M23.8,18L23.4,6.1l-2.8-2.5l-0.7-2.5h-4.3h-3.3H8L7.3,3.7L4.5,6.1L4,18H1v2.4h3.5v20.9L6.8,42L8,44.6h4.3h3.3h4.3l1.2-2.6l2.4-0.7V20.4h3.5V18H23.8z M6.9,26.8l-0.3-1.4V12.3l2,4.6v6.5l-1,3.4H6.9z M16.7,37.8h-5.4l-1.2-0.9L7.8,34v-3.9l1.8-3.9h8.7l1.6,3.8l0.3,3.9L16.7,37.8z M21.2,25.4l-0.3,1.4h-0.7l-1-3.4V17l2-4.6V25.4z M18.8,16.1H9L6.5,9.8c0,0,6.7-4,14.8,0L18.8,16.1z"/>
</svg>`);

const enemyCar1SVG = "data:image/svg+xml;base64," + btoa(`<?xml version="1.0" encoding="utf-8"?>
<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.9 46.6">
<style>.st0{fill:#FF0000;}</style>
<g><rect x="21.8" transform="matrix(-1 -1.224647e-16 1.224647e-16 -1 45.5659 1.9927)" class="st0" width="2" height="2"/><rect x="4.1" transform="matrix(-1 -1.224647e-16 1.224647e-16 -1 10.1406 1.9927)" class="st0" width="2" height="2"/></g>
<path class="st0" d="M3.3,28.6l0.5,12.8l3,2.7l0.8,2.7h4.6h3.5h4.6l0.8-2.7l3-2.7l0.5-12.8h3.3V26h-3.7V3.6l-2.5-0.8L20.3,0h-4.6h-3.5H7.6L6.2,2.8L3.7,3.6V26H0v2.5h3.3V28.6z M5,6.4h1.4l0.5-1.1h15v1.4l1,0.1v1.8l-1.1,0.1v1.1h-1.2v1.1H7.4V9.7h-1l0.1-1.2H5V6.4z M5.1,29.8L7.2,27h5.7H15h5.7l2.1,2.8h1.1l-0.5,3l-0.7,0.3l-2.9,0.7l-0.7,1.5H8.8l-0.7-1.5l-2.9-0.7l-0.7-0.3l-0.5-3H5.1z"/>
</svg>`);

const enemyCar2SVG = "data:image/svg+xml;base64," + btoa(`<?xml version="1.0" encoding="utf-8"?>
<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27.9 46.6">
<style>.st0{fill:#2F00D0;}</style>
<g><rect x="21.8" y="0" class="st0" width="2" height="2"/><rect x="4" y="0" class="st0" width="2" height="2"/></g>
<path class="st0" d="M3.3,28.6l0.5,12.8l3,2.7l0.8,2.7h4.6h3.5h4.6l0.8-2.7l3-2.7l0.5-12.8h3.3V26h-3.7V3.6l-2.5-0.8L20.3,0h-4.6h-3.5H7.6L6.2,2.8L3.7,3.6V26H0v2.5h3.3V28.6z M5,6.4h1.4l0.5-1.1h15v1.4l1,0.1v1.8l-1.1,0.1v1.1h-1.2v1.1H7.4V9.7h-1l0.1-1.2H5V6.4z M5.1,29.8L7.2,27h5.7H15h5.7l2.1,2.8h1.1l-0.5,3l-0.7,0.3l-2.9,0.7l-0.7,1.5H8.8l-0.7-1.5l-2.9-0.7l-0.7-0.3l-0.5-3H5.1z"/>
</svg>`);

// ইমেজ অবজেক্ট
const roadImg = new Image();
roadImg.src = roadSVG;

const playerCarImg = new Image();
playerCarImg.src = playerCarSVG;

const enemySVGs = [enemyCar1SVG, enemyCar2SVG];

// গেম ভেরিয়েবল
let roadY = 0;
let speed = 0;
let playerX = CANVAS_WIDTH / 2 - 30;
const CAR_WIDTH = 30;
const CAR_HEIGHT = 50;

let enemies = [];
let score = 0;
let gameOver = false;

// কি প্রেস
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    e.preventDefault();
});
window.addEventListener('keyup', (e) => keys[e.key] = false);

// এনিমি স্পন
function spawnEnemy() {
    if (speed > 0 && !gameOver) {
        const lane = Math.floor(Math.random() * 3);
        const laneX = 100 + lane * 100;
        const svgSrc = enemySVGs[Math.floor(Math.random() * enemySVGs.length)];
        const enemyImg = new Image();
        enemyImg.src = svgSrc;
        enemies.push({
            x: laneX,
            y: -CAR_HEIGHT,
            img: enemyImg,
            passed: false
        });
    }
}

// কলিশন চেক
function checkCollision(px, py, ex, ey) {
    return px < ex + CAR_WIDTH - 10 &&
           px + CAR_WIDTH - 10 > ex &&
           py < ey + CAR_HEIGHT - 20 &&
           py + CAR_HEIGHT - 15 > ey;
}

// গেম লুপ
function gameLoop() {
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 60);
        ctx.font = '35px Arial';
        ctx.fillText(`Score: ${score}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
        ctx.font = '25px Arial';
        ctx.fillText('Click canvas to Restart', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 60);
        return;
    }

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (speed > 0) {
        roadY += speed;
        if (roadY >= CANVAS_HEIGHT) roadY = 0;

        // লেন চেঞ্জ
        if ((keys['ArrowLeft'] || keys['a'] || keys['A']) && playerX > 40) playerX -= 12;
        if ((keys['ArrowRight'] || keys['d'] || keys['D']) && playerX < CANVAS_WIDTH - CAR_WIDTH - 40) playerX += 12;

        // এনিমি স্পন
        if (Math.random() < 0.08) spawnEnemy();

        // UI আপডেট
        document.getElementById('distance').textContent = Math.floor(roadY / 5);
        document.getElementById('speed').textContent = speed * 15;
        document.getElementById('score').textContent = score;
    }

    // রোড ড্র
    ctx.drawImage(roadImg, 0, roadY, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(roadImg, 0, roadY - CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);

    // প্লেয়ার গাড়ি
    ctx.drawImage(playerCarImg, playerX, CANVAS_HEIGHT - CAR_HEIGHT - 30, CAR_WIDTH, CAR_HEIGHT);

    // এনিমি গাড়ি
    enemies = enemies.filter(enemy => enemy.y < CANVAS_HEIGHT + CAR_HEIGHT);
    enemies.forEach(enemy => {
        if (speed > 0) enemy.y += speed;

        ctx.drawImage(enemy.img, enemy.x - 30, enemy.y, CAR_WIDTH, CAR_HEIGHT);

        if (!enemy.passed && enemy.y + CAR_HEIGHT > CANVAS_HEIGHT - CAR_HEIGHT - 30) {
            enemy.passed = true;
            score += 10;
        }

        if (checkCollision(playerX, CANVAS_HEIGHT - CAR_HEIGHT - 30, enemy.x - 30, enemy.y)) {
            gameOver = true;
            speed = 0;
        }
    });

    requestAnimationFrame(gameLoop);
}

// বাটন
document.getElementById('startBtn').addEventListener('click', () => {
    speed = 8;
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'inline-block';
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    speed = 0;
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('pauseBtn').style.display = 'none';
});

// রিস্টার্ট
canvas.addEventListener('click', () => {
    if (gameOver) {
        gameOver = false;
        score = 0;
        enemies = [];
        roadY = 0;
        playerX = CANVAS_WIDTH / 2 - 30;
        document.getElementById('score').textContent = '0';
    }
});

// গেম শুরু
gameLoop();