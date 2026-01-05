// game.js - Endless Car Driving Game with Local Sound & Up Arrow Move

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// Track image loading
let imagesLoaded = 0;
const totalImagesToLoad = 4; // road, playerCar + 2 enemy cars
let allImagesLoaded = false;

// Create fallback images if real images don't load
function createFallbackImages() {
    // Create fallback road image
    const roadCanvas = document.createElement('canvas');
    roadCanvas.width = CANVAS_WIDTH;
    roadCanvas.height = CANVAS_HEIGHT;
    const roadCtx = roadCanvas.getContext('2d');
    
    // Draw road pattern
    roadCtx.fillStyle = '#333333';
    roadCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw road markings
    roadCtx.fillStyle = '#ffffff';
    for(let i = 0; i < CANVAS_HEIGHT; i += 40) {
        roadCtx.fillRect(CANVAS_WIDTH/2 - 5, i, 10, 20);
    }
    
    // Draw lanes
    roadCtx.strokeStyle = '#cccccc';
    roadCtx.lineWidth = 3;
    roadCtx.setLineDash([20, 20]);
    const laneWidth = CANVAS_WIDTH / 3;
    
    roadCtx.beginPath();
    roadCtx.moveTo(laneWidth, 0);
    roadCtx.lineTo(laneWidth, CANVAS_HEIGHT);
    roadCtx.stroke();
    
    roadCtx.beginPath();
    roadCtx.moveTo(laneWidth * 2, 0);
    roadCtx.lineTo(laneWidth * 2, CANVAS_HEIGHT);
    roadCtx.stroke();
    
    const fallbackRoadImg = new Image();
    fallbackRoadImg.src = roadCanvas.toDataURL();
    
    // Create fallback player car
    const playerCanvas = document.createElement('canvas');
    playerCanvas.width = 60;
    playerCanvas.height = 100;
    const playerCtx = playerCanvas.getContext('2d');
    
    playerCtx.fillStyle = '#0066ff';
    playerCtx.fillRect(0, 0, 60, 100);
    playerCtx.fillStyle = '#0033cc';
    playerCtx.fillRect(10, 10, 40, 30);
    playerCtx.fillRect(10, 60, 40, 30);
    playerCtx.fillStyle = '#ff0000';
    playerCtx.fillRect(5, 45, 50, 10);
    
    const fallbackPlayerCar = new Image();
    fallbackPlayerCar.src = playerCanvas.toDataURL();
    
    // Create fallback enemy cars
    const enemyCanvas1 = document.createElement('canvas');
    enemyCanvas1.width = 60;
    enemyCanvas1.height = 100;
    const enemyCtx1 = enemyCanvas1.getContext('2d');
    
    enemyCtx1.fillStyle = '#ff3300';
    enemyCtx1.fillRect(0, 0, 60, 100);
    enemyCtx1.fillStyle = '#cc0000';
    enemyCtx1.fillRect(10, 10, 40, 30);
    enemyCtx1.fillRect(10, 60, 40, 30);
    enemyCtx1.fillStyle = '#ffff00';
    enemyCtx1.fillRect(5, 45, 50, 10);
    
    const fallbackEnemyCar1 = new Image();
    fallbackEnemyCar1.src = enemyCanvas1.toDataURL();
    
    const enemyCanvas2 = document.createElement('canvas');
    enemyCanvas2.width = 60;
    enemyCanvas2.height = 100;
    const enemyCtx2 = enemyCanvas2.getContext('2d');
    
    enemyCtx2.fillStyle = '#00cc00';
    enemyCtx2.fillRect(0, 0, 60, 100);
    enemyCtx2.fillStyle = '#009900';
    enemyCtx2.fillRect(10, 10, 40, 30);
    enemyCtx2.fillRect(10, 60, 40, 30);
    enemyCtx2.fillStyle = '#ffff00';
    enemyCtx2.fillRect(5, 45, 50, 10);
    
    const fallbackEnemyCar2 = new Image();
    fallbackEnemyCar2.src = enemyCanvas2.toDataURL();
    
    return {
        road: fallbackRoadImg,
        player: fallbackPlayerCar,
        enemy1: fallbackEnemyCar1,
        enemy2: fallbackEnemyCar2
    };
}

const fallbackImages = createFallbackImages();

// ইমেজ লোডিং
const roadImg = new Image();
roadImg.src = '/static/game/images/road.png';
roadImg.onload = () => {
    imagesLoaded++;
    console.log('Road image loaded');
    if (imagesLoaded >= totalImagesToLoad) {
        allImagesLoaded = true;
        console.log('All images loaded successfully');
    }
};
roadImg.onerror = () => {
    console.warn('Road image failed to load, using fallback');
    roadImg.src = fallbackImages.road.src;
    imagesLoaded++;
};

const playerCar = new Image();
playerCar.src = '/static/game/images/player_car.png';
playerCar.onload = () => {
    imagesLoaded++;
    console.log('Player car loaded');
    if (imagesLoaded >= totalImagesToLoad) {
        allImagesLoaded = true;
        console.log('All images loaded successfully');
    }
};
playerCar.onerror = () => {
    console.warn('Player car failed to load, using fallback');
    playerCar.src = fallbackImages.player.src;
    imagesLoaded++;
};

const enemyCarImages = [];
const enemyCarPaths = [
    '/static/game/images/enemy_car1.png',
    '/static/game/images/enemy_car2.png'
];

// লোড এনিমি গাড়ি ইমেজ
enemyCarPaths.forEach((path, index) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
        imagesLoaded++;
        console.log(`Enemy car ${index + 1} loaded`);
        if (imagesLoaded >= totalImagesToLoad) {
            allImagesLoaded = true;
            console.log('All images loaded successfully');
        }
    };
    img.onerror = () => {
        console.warn(`Enemy car ${index + 1} failed to load, using fallback`);
        img.src = index === 0 ? fallbackImages.enemy1.src : fallbackImages.enemy2.src;
        imagesLoaded++;
    };
    enemyCarImages.push(img);
});

// পাওয়ার-আপ কালার
const powerUpTypes = [
    { color: 'gold', effect: 'fuel', label: 'FUEL' },
    { color: 'lime', effect: 'speed', label: 'BOOST' },
    { color: 'cyan', effect: 'shield', label: 'SHIELD' }
];

// লোকাল সাউন্ড ফাইল (with error handling)
const engineSound = new Audio('/static/game/sound/engine.mp3');
engineSound.loop = true;
engineSound.volume = 0.4;
engineSound.onerror = () => console.warn('Engine sound failed to load');

const crashSound = new Audio('/static/game/sound/crash.mp3');
crashSound.volume = 0.6;
crashSound.onerror = () => console.warn('Crash sound failed to load');

const powerUpSound = new Audio('/static/game/sound/powerUp.mp3');
powerUpSound.volume = 0.5;
powerUpSound.onerror = () => console.warn('Power-up sound failed to load');

// গেম ভেরিয়েবল
let roadY = 0;
let speed = 0;
let playerX = CANVAS_WIDTH / 2 - 30;
let playerY = CANVAS_HEIGHT - 150;
const CAR_WIDTH = 60;
const CAR_HEIGHT = 100;

let enemies = [];
let powerUps = [];
let score = 0;
let highScore = localStorage.getItem('carGameHighScore') || 0;
let gameOver = false;
let fuel = 100;
let shieldTime = 0;
let boostTime = 0;

// UI initialization
document.getElementById('fuel').textContent = fuel;
document.getElementById('score').textContent = score;
document.getElementById('highScore').textContent = highScore;

// কি প্রেস
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    e.preventDefault();
});
window.addEventListener('keyup', (e) => keys[e.key] = false);

// এনিমি স্পন
function spawnEnemy() {
    if (speed > 0 && !gameOver && allImagesLoaded) {
        const lane = Math.floor(Math.random() * 3);
        const laneX = 100 + lane * 100;
        const enemyImg = enemyCarImages[Math.floor(Math.random() * enemyCarImages.length)];
        
        enemies.push({
            x: laneX,
            y: -CAR_HEIGHT,
            img: enemyImg,
            passed: false
        });
    }
}

// পাওয়ার-আপ স্পন
function spawnPowerUp() {
    const lane = Math.floor(Math.random() * 3);
    const laneX = 100 + lane * 100;
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    powerUps.push({
        x: laneX,
        y: -40,
        type: type,
        collected: false
    });
}

// কলিশন চেক - FIXED VERSION
function checkCollision(px, py, ex, ey, width = CAR_WIDTH, height = CAR_HEIGHT) {
    return px < ex + width &&
           px + width > ex &&
           py < ey + height &&
           py + height > ey;
}

// গেম লুপ
function gameLoop() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Show loading message if images aren't loaded
    if (!allImagesLoaded) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Loading game assets...', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
        ctx.font = '20px Arial';
        ctx.fillText(`Loaded: ${imagesLoaded}/${totalImagesToLoad}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 40);
        requestAnimationFrame(gameLoop);
        return;
    }

    if (gameOver) {
        engineSound.pause();
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 80);
        ctx.font = '35px Arial';
        ctx.fillText(`Score: ${score}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 20);
        ctx.font = '25px Arial';
        ctx.fillText(`High Score: ${highScore}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 20);
        ctx.fillText('Click canvas to Restart', CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 60);
        requestAnimationFrame(gameLoop);
        return;
    }

    if (speed > 0) {
        // ইঞ্জিন সাউন্ড
        try {
            if (engineSound.paused) {
                engineSound.play().catch(e => console.log('Audio play prevented:', e));
            }
        } catch (e) {
            console.log('Sound error:', e);
        }

        roadY += speed;
        if (roadY >= CANVAS_HEIGHT) roadY = 0;

        // লেন চেঞ্জ
        if ((keys['ArrowLeft'] || keys['a'] || keys['A']) && playerX > 40) playerX -= 12;
        if ((keys['ArrowRight'] || keys['d'] || keys['D']) && playerX < CANVAS_WIDTH - CAR_WIDTH - 40) playerX += 12;

        // সামনে-পিছনে মুভ
        if (keys['ArrowUp'] && playerY > 50) playerY -= 15; // সামনে
        if (keys['ArrowDown'] && playerY < CANVAS_HEIGHT - CAR_HEIGHT - 50) playerY += 10; // পিছনে

        // ফুয়েল কমানো
        fuel -= 0.04 * speed;
        if (fuel <= 0) {
            fuel = 0;
            gameOver = true;
            speed = 0;
            try {
                crashSound.currentTime = 0;
                crashSound.play();
            } catch (e) {
                console.log('Crash sound error:', e);
            }
        }
        document.getElementById('fuel').textContent = Math.floor(fuel);

        // বুস্ট টাইমার
        if (boostTime > 0) {
            boostTime -= 1/60;
            speed = 16;
        } else {
            speed = 8;
        }
        
        if (shieldTime > 0) shieldTime -= 1/60;

        // এনিমি স্পন
        if (Math.random() < 0.015) spawnEnemy();

        // পাওয়ার-আপ স্পন
        if (Math.random() < 0.02) spawnPowerUp();

        score += 1;
        document.getElementById('score').textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem('carGameHighScore', highScore);
            document.getElementById('highScore').textContent = highScore;
        }
    } else {
        engineSound.pause();
    }

    // Draw road
    ctx.drawImage(roadImg, 0, roadY, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(roadImg, 0, roadY - CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw player car (with shield effect)
    if (shieldTime > 0) {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.shadowColor = 'cyan';
        ctx.shadowBlur = 20;
    }
    ctx.drawImage(playerCar, playerX, playerY, CAR_WIDTH, CAR_HEIGHT);
    if (shieldTime > 0) {
        ctx.restore();
    }

    // Draw enemy cars
    enemies = enemies.filter(enemy => enemy.y < CANVAS_HEIGHT + CAR_HEIGHT);
    enemies.forEach(enemy => {
        enemy.y += speed;

        ctx.drawImage(enemy.img, enemy.x - 30, enemy.y, CAR_WIDTH, CAR_HEIGHT);

        if (!enemy.passed && enemy.y + CAR_HEIGHT > playerY) {
            enemy.passed = true;
            score += 10;
        }

        if (checkCollision(playerX, playerY, enemy.x - 30, enemy.y)) {
            if (shieldTime <= 0) {
                gameOver = true;
                speed = 0;
                try {
                    crashSound.currentTime = 0;
                    crashSound.play();
                } catch (e) {
                    console.log('Crash sound error:', e);
                }
            }
        }
    });

    // Draw power-ups
    powerUps = powerUps.filter(p => p.y < CANVAS_HEIGHT + 40);
    powerUps.forEach(p => {
        p.y += speed;

        // Make power-ups pulse
        const pulseSize = Math.sin(Date.now() / 200) * 2;
        
        ctx.fillStyle = p.type.color;
        ctx.beginPath();
        ctx.roundRect(p.x - 20 + pulseSize, p.y + pulseSize, 40 - pulseSize*2, 40 - pulseSize*2, 8);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(p.type.label, p.x, p.y + 25);

        if (checkCollision(playerX, playerY, p.x - 20, p.y, 40, 40)) {
            p.collected = true;
            try {
                powerUpSound.currentTime = 0;
                powerUpSound.play();
            } catch (e) {
                console.log('Power-up sound error:', e);
            }

            if (p.type.effect === 'fuel') {
                fuel = Math.min(100, fuel + 30);
                document.getElementById('fuel').textContent = Math.floor(fuel);
            }
            if (p.type.effect === 'speed') boostTime = 5;
            if (p.type.effect === 'shield') shieldTime = 5;
        }
    });
    powerUps = powerUps.filter(p => !p.collected);

    // Draw active effects
    if (shieldTime > 0) {
        ctx.fillStyle = 'cyan';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`SHIELD: ${shieldTime.toFixed(1)}s`, 10, CANVAS_HEIGHT - 40);
    }
    
    if (boostTime > 0) {
        ctx.fillStyle = 'lime';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`BOOST: ${boostTime.toFixed(1)}s`, 10, CANVAS_HEIGHT - 20);
    }

    requestAnimationFrame(gameLoop);
}

// Start বাটন – সাউন্ড শুরু করবে
document.getElementById('startBtn').addEventListener('click', () => {
    if (!allImagesLoaded) {
        alert('Game assets are still loading. Please wait...');
        return;
    }
    
    speed = 8;
    try {
        engineSound.currentTime = 0;
        engineSound.play();
    } catch (e) {
        console.log('Could not play engine sound:', e);
    }
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('pauseBtn').style.display = 'inline-block';
});

// Pause বাটন
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
        fuel = 100;
        enemies = [];
        powerUps = [];
        roadY = 0;
        playerX = CANVAS_WIDTH / 2 - 30;
        playerY = CANVAS_HEIGHT - 150;
        shieldTime = 0;
        boostTime = 0;
        document.getElementById('score').textContent = '0';
        document.getElementById('fuel').textContent = '100';
    }
});

// Prevent scrolling with arrow keys
window.addEventListener('keydown', function(e) {
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Spacebar'].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

// Initialize game
console.log('Game initializing...');
gameLoop();