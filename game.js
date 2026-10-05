// ========================================
// PIXEL FIGHTER V2
// Menu -> Character Select -> Fight
// ========================================

const screens = {
    menu: document.getElementById("menuScreen"),
    howTo: document.getElementById("howToScreen"),
    select: document.getElementById("selectScreen"),
    fight: document.getElementById("fightScreen")
};

const startButton = document.getElementById("startButton");
const howToButton = document.getElementById("howToButton");
const backButton = document.getElementById("backButton");
const selectBackButton = document.getElementById("selectBackButton");
const confirmButton = document.getElementById("confirmButton");

const fighterChoices =
    document.querySelectorAll(".fighter-choice");

const selectedName =
    document.getElementById("selectedName");

const playerEl =
    document.getElementById("player");

const cpuEl =
    document.getElementById("cpu");

const playerBar =
    document.getElementById("playerBar");

const cpuBar =
    document.getElementById("cpuBar");

const message =
    document.getElementById("message");

const resultText =
    document.getElementById("resultText");

const restartButton =
    document.getElementById("restartButton");

const characterButton =
    document.getElementById("characterButton");

const menuButton =
    document.getElementById("menuButton");


let selectedColor = "blue";
let gameRunning = false;
let gameOver = false;

const keys = {};


let player;
let cpu;


// ========================================
// Screen switching
// ========================================

function showScreen(name) {

    Object.values(screens).forEach(screen => {
        screen.classList.remove("active");
    });

    screens[name].classList.add("active");
}


// ========================================
// Character select
// ========================================

fighterChoices.forEach(choice => {

    choice.addEventListener("click", () => {

        fighterChoices.forEach(item => {
            item.classList.remove("selected");
        });

        choice.classList.add("selected");

        selectedColor =
            choice.dataset.color;

        selectedName.innerText =
            selectedColor.toUpperCase();
    });

});


// ========================================
// Menu buttons
// ========================================

startButton.addEventListener("click", () => {
    showScreen("select");
});

howToButton.addEventListener("click", () => {
    showScreen("howTo");
});

backButton.addEventListener("click", () => {
    showScreen("menu");
});

selectBackButton.addEventListener("click", () => {
    showScreen("menu");
});

confirmButton.addEventListener("click", () => {
    startFight();
});


// ========================================
// Keyboard
// ========================================

document.addEventListener("keydown", event => {

    const key =
        event.key.toLowerCase();

    keys[key] = true;

    if (
        !gameRunning ||
        gameOver
    ) {
        return;
    }

    if (key === "j") {
        playerAttack("punch");
    }

    if (key === "k") {
        playerAttack("kick");
    }

    if (key === "w") {
        jump(player);
    }
});

document.addEventListener("keyup", event => {

    keys[event.key.toLowerCase()] = false;

});


// ========================================
// Start fight
// ========================================

function startFight() {

    player = {
        x: 180,
        y: 0,
        hp: 100,
        speed: 5,
        jumpSpeed: 13,
        velocityY: 0,
        attacking: false,
        cooldown: false,
        blocking: false
    };

    cpu = {
        x: 700,
        y: 0,
        hp: 100,
        speed: 2.2,
        jumpSpeed: 12,
        velocityY: 0,
        attacking: false,
        cooldown: false,
        blocking: false,
        jumpCooldown: false
    };

    gameOver = false;
    gameRunning = true;

    message.style.display = "none";

    playerEl.className =
        "fighter player " + selectedColor;

    cpuEl.className =
        "fighter cpu red";

    playerBar.style.width = "100%";
    cpuBar.style.width = "100%";

    showScreen("fight");

    requestAnimationFrame(gameLoop);
}


// ========================================
// Jump
// ========================================

function jump(fighter) {

    if (
        fighter.y === 0 &&
        !fighter.attacking
    ) {
        fighter.velocityY =
            fighter.jumpSpeed;
    }
}


// ========================================
// Gravity
// ========================================

function gravity(fighter) {

    fighter.y += fighter.velocityY;

    fighter.velocityY -= 0.7;

    if (fighter.y <= 0) {

        fighter.y = 0;
        fighter.velocityY = 0;
    }
}


// ========================================
// Player movement
// ========================================

function playerMovement() {

    if (keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["d"]) {
        player.x += player.speed;
    }

    player.blocking =
        !!keys["s"] &&
        !player.attacking;

    player.x =
        Math.max(
            0,
            Math.min(840, player.x)
        );
}


// ========================================
// Player attack
// ========================================

function playerAttack(type) {

    if (
        player.cooldown ||
        player.attacking
    ) {
        return;
    }

    player.attacking = true;
    player.cooldown = true;

    const distance =
        Math.abs(player.x - cpu.x);

    let damage;
    let range;

    if (type === "punch") {

        damage = 8;
        range = 90;

        playerEl.classList.add("punching");

    } else {

        damage = 12;
        range = 110;

        playerEl.classList.add("kicking");
    }

    if (distance <= range) {
        damageCPU(damage);
    }

    setTimeout(() => {

        player.attacking = false;

        playerEl.classList.remove("punching");
        playerEl.classList.remove("kicking");

    }, 180);

    setTimeout(() => {

        player.cooldown = false;

    }, 350);
}


// ========================================
// CPU AI
// ========================================

function cpuAI() {

    const distance =
        player.x - cpu.x;

    const absDistance =
        Math.abs(distance);


    if (absDistance > 115) {

        if (distance > 0) {
            cpu.x += cpu.speed;
        } else {
            cpu.x -= cpu.speed;
        }
    }


    // CPU sometimes jumps
    if (
        player.y > 40 &&
        cpu.y === 0 &&
        !cpu.jumpCooldown &&
        Math.random() < 0.04
    ) {
        cpuJump();
    }


    // CPU jumps when far away sometimes
    if (
        absDistance > 250 &&
        cpu.y === 0 &&
        !cpu.jumpCooldown &&
        Math.random() < 0.01
    ) {
        cpuJump();
    }


    // CPU attacks
    if (
        absDistance <= 115 &&
        !cpu.attacking &&
        !cpu.cooldown &&
        Math.random() < 0.035
    ) {
        cpuAttack();
    }


    // CPU occasionally blocks
    cpu.blocking =
        player.attacking &&
        absDistance < 130 &&
        Math.random() < 0.25;


    cpu.x =
        Math.max(
            0,
            Math.min(840, cpu.x)
        );
}


// ========================================
// CPU jump
// ========================================

function cpuJump() {

    if (
        cpu.y !== 0 ||
        cpu.jumpCooldown
    ) {
        return;
    }

    cpu.velocityY =
        cpu.jumpSpeed;

    cpu.jumpCooldown = true;

    setTimeout(() => {
        cpu.jumpCooldown = false;
    }, 1000);
}


// ========================================
// CPU attack
// ========================================

function cpuAttack() {

    cpu.attacking = true;
    cpu.cooldown = true;

    const distance =
        Math.abs(cpu.x - player.x);

    const kick =
        distance > 75;

    const damage =
        kick ? 10 : 7;

    const range =
        kick ? 110 : 90;

    if (distance <= range) {
        damagePlayer(damage);
    }

    cpuEl.classList.add(
        kick ? "kicking" : "punching"
    );

    setTimeout(() => {

        cpu.attacking = false;

        cpuEl.classList.remove("punching");
        cpuEl.classList.remove("kicking");

    }, 180);

    setTimeout(() => {

        cpu.cooldown = false;

    }, 650);
}


// ========================================
// Damage
// ========================================

function damagePlayer(amount) {

    if (player.blocking) {
        amount *= 0.3;
    }

    player.hp =
        Math.max(0, player.hp - amount);

    playerEl.classList.add("hit");

    setTimeout(() => {
        playerEl.classList.remove("hit");
    }, 100);
}


function damageCPU(amount) {

    if (cpu.blocking) {
        amount *= 0.3;
    }

    cpu.hp =
        Math.max(0, cpu.hp - amount);

    cpuEl.classList.add("hit");

    setTimeout(() => {
        cpuEl.classList.remove("hit");
    }, 100);
}


// ========================================
// Health
// ========================================

function updateHealth() {

    playerBar.style.width =
        player.hp + "%";

    cpuBar.style.width =
        cpu.hp + "%";
}


// ========================================
// Winner
// ========================================

function checkWinner() {

    if (player.hp <= 0) {

        endGame(`Oops...
You totally did that on purpose!

Don’t worry,
you’re still the best! ♡`);

        return true;
    }

    if (cpu.hp <= 0) {

        endGame(`Yeahhh! You are the winner!
Happy birthday to you! ♡`);

        return true;
    }

    return false;
}


function endGame(text) {

    gameOver = true;
    gameRunning = false;

    resultText.innerText = text;

    message.style.display = "block";
}


// ========================================
// Draw
// ========================================

function draw() {

    playerEl.style.left =
        player.x + "px";

    playerEl.style.bottom =
        (80 + player.y) + "px";

    cpuEl.style.left =
        cpu.x + "px";

    cpuEl.style.bottom =
        (80 + cpu.y) + "px";


    playerEl.classList.toggle(
        "blocking",
        player.blocking
    );

    cpuEl.classList.toggle(
        "blocking",
        cpu.blocking
    );
}


// ========================================
// Game loop
// ========================================

function gameLoop() {

    if (!gameRunning) {
        return;
    }

    if (checkWinner()) {
        return;
    }

    playerMovement();

    gravity(player);
    gravity(cpu);

    cpuAI();

    draw();
    updateHealth();

    requestAnimationFrame(gameLoop);
}


// ========================================
// End-game buttons
// ========================================

restartButton.addEventListener("click", () => {
    startFight();
});

characterButton.addEventListener("click", () => {

    gameRunning = false;
    gameOver = true;

    showScreen("select");
});

menuButton.addEventListener("click", () => {

    gameRunning = false;
    gameOver = true;

    showScreen("menu");
});
