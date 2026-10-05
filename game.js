// ========================================
// PIXEL FIGHTER
// Kiryu / 小红 version
// Best of 3
// ========================================


// ========================================
// SCREENS
// ========================================

const screens = {

    menu:
        document.getElementById("menuScreen"),

    howTo:
        document.getElementById("howToScreen"),

    select:
        document.getElementById("selectScreen"),

    fight:
        document.getElementById("fightScreen")

};


// ========================================
// BUTTONS
// ========================================

const startButton =
    document.getElementById("startButton");

const howToButton =
    document.getElementById("howToButton");

const backButton =
    document.getElementById("backButton");

const selectBackButton =
    document.getElementById("selectBackButton");

const confirmButton =
    document.getElementById("confirmButton");

const fighterChoices =
    document.querySelectorAll(".fighter-choice");

const selectedName =
    document.getElementById("selectedName");


// ========================================
// PLAYER
// ========================================

const playerEl =
    document.getElementById("player");

const playerSprite =
    document.getElementById("playerSprite");


// ========================================
// CPU
// ========================================

const cpuEl =
    document.getElementById("cpu");


// ========================================
// HEALTH
// ========================================

const playerBar =
    document.getElementById("playerBar");

const cpuBar =
    document.getElementById("cpuBar");


// ========================================
// MESSAGE
// ========================================

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


// ========================================
// CHARACTER
// ========================================

const characterPath =
    "Character/Kiryu/";


// ========================================
// GAME STATE
// ========================================

let selectedColor = "red";

let gameRunning = false;

let gameOver = false;

let roundIntro = false;

let playerRounds = 0;

let cpuRounds = 0;

let currentRound = 1;

let player;

let cpu;

const keys = {};


// ========================================
// SCREEN
// ========================================

function showScreen(name) {

    Object.values(screens).forEach(screen => {

        screen.classList.remove("active");

    });

    screens[name].classList.add("active");
}


// ========================================
// PLAYER SPRITE
// ========================================

function setPlayerSprite(action) {

    playerSprite.src =
        characterPath + action + ".png";
}


// ========================================
// CHARACTER SELECT
// ========================================

fighterChoices.forEach(choice => {

    choice.addEventListener("click", () => {

        fighterChoices.forEach(item => {

            item.classList.remove("selected");

        });

        choice.classList.add("selected");

        selectedColor =
            choice.dataset.color;

        if (selectedColor === "red") {

            selectedName.innerText =
                "小红";

        } else {

            selectedName.innerText =
                selectedColor.toUpperCase();

        }

    });

});


// ========================================
// MENU
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

    playerRounds = 0;

    cpuRounds = 0;

    currentRound = 1;

    startRound();

});


// ========================================
// KEYBOARD
// ========================================

document.addEventListener("keydown", event => {

    const key =
        event.key.toLowerCase();

    keys[key] = true;


    if (
        !gameRunning ||
        gameOver ||
        roundIntro
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
// START ROUND
// ========================================

function startRound() {

    player = {

        x: 150,

        y: 0,

        hp: 100,

        speed: 4,

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


    gameRunning = false;

    gameOver = false;

    roundIntro = true;


    setPlayerSprite("idle_01");


    playerBar.style.width =
        "100%";

    cpuBar.style.width =
        "100%";


    message.style.display =
        "block";


    restartButton.style.display =
        "none";

    characterButton.style.display =
        "none";

    menuButton.style.display =
        "none";


    resultText.innerHTML =

        `ROUND ${currentRound}<br>
        <span style="font-family: monospace; font-size: 22px;">
        FIGHT!
        </span>`;


    showScreen("fight");


    setTimeout(() => {

        if (gameOver) {

            return;

        }


        message.style.display =
            "none";


        roundIntro = false;

        gameRunning = true;


        requestAnimationFrame(gameLoop);


    }, 1300);

}


// ========================================
// JUMP
// ========================================

function jump(fighter) {

    if (

        fighter.y === 0 &&

        !fighter.attacking

    ) {

        fighter.velocityY =
            fighter.jumpSpeed;


        if (fighter === player) {

            setPlayerSprite(
                "jump_01"
            );

        }

    }

}


// ========================================
// GRAVITY
// ========================================

function gravity(fighter) {

    fighter.y +=
        fighter.velocityY;


    fighter.velocityY -=
        0.7;


    if (fighter.y <= 0) {

        fighter.y = 0;

        fighter.velocityY = 0;

    }

}


// ========================================
// PLAYER MOVEMENT
// ========================================

function playerMovement() {


    // MOVE LEFT

    if (keys["a"]) {

        player.x -=
            player.speed;

    }


    // MOVE RIGHT

    if (keys["d"]) {

        player.x +=
            player.speed;

    }


    // BLOCK

    player.blocking =

        !!keys["s"] &&

        !player.attacking;


    if (player.blocking) {

        setPlayerSprite(
            "block_01"
        );

    }


    // IDLE

    else if (

        !player.attacking &&

        player.y === 0 &&

        !keys["a"] &&

        !keys["d"]

    ) {

        setPlayerSprite(
            "idle_01"
        );

    }


    // WALK

    else if (

        !player.attacking &&

        player.y === 0 &&

        (keys["a"] || keys["d"])

    ) {

        const walkingFrame =
            Math.floor(
                Date.now() / 180
            ) % 2;


        if (walkingFrame === 0) {

            setPlayerSprite(
                "walk_01"
            );

        } else {

            setPlayerSprite(
                "walk_02"
            );

        }

    }


    player.x =

        Math.max(

            0,

            Math.min(
                780,
                player.x
            )

        );

}


// ========================================
// PLAYER ATTACK
// ========================================

function playerAttack(type) {


    if (

        player.cooldown ||

        player.attacking ||

        player.blocking

    ) {

        return;

    }


    player.attacking = true;

    player.cooldown = true;


    const distance =

        Math.abs(
            player.x - cpu.x
        );


    let damage;

    let range;


    // PUNCH

    if (type === "punch") {

        damage = 8;

        range = 100;


        setPlayerSprite(
            "punch_01"
        );

    }


    // KICK

    else {

        damage = 12;

        range = 120;


        setPlayerSprite(
            "kick_01"
        );

    }


    if (distance <= range) {

        damageCPU(damage);

    }


    setTimeout(() => {

        player.attacking = false;

        setPlayerSprite(
            "idle_01"
        );

    }, 300);


    setTimeout(() => {

        player.cooldown = false;

    }, 450);

}


// ========================================
// CPU AI
// ========================================

function cpuAI() {


    const distance =
        player.x - cpu.x;


    const absDistance =
        Math.abs(distance);


    // MOVE

    if (absDistance > 110) {

        if (distance > 0) {

            cpu.x +=
                cpu.speed;

        } else {

            cpu.x -=
                cpu.speed;

        }

    }


    // JUMP

    if (

        player.y > 40 &&

        cpu.y === 0 &&

        !cpu.jumpCooldown &&

        Math.random() < 0.04

    ) {

        cpuJump();

    }


    // ATTACK

    if (

        absDistance <= 115 &&

        !cpu.attacking &&

        !cpu.cooldown &&

        Math.random() < 0.035

    ) {

        cpuAttack();

    }


    // BLOCK

    cpu.blocking =

        player.attacking &&

        absDistance < 130 &&

        Math.random() < 0.25;


    cpu.x =

        Math.max(

            0,

            Math.min(
                840,
                cpu.x
            )

        );

}


// ========================================
// CPU JUMP
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


    cpu.jumpCooldown =
        true;


    setTimeout(() => {

        cpu.jumpCooldown =
            false;

    }, 1000);

}


// ========================================
// CPU ATTACK
// ========================================

function cpuAttack() {

    cpu.attacking = true;

    cpu.cooldown = true;


    const distance =

        Math.abs(
            cpu.x - player.x
        );


    const kick =
        distance > 75;


    const damage =
        kick ? 10 : 7;


    const range =
        kick ? 115 : 90;


    if (distance <= range) {

        damagePlayer(damage);

    }


    setTimeout(() => {

        cpu.attacking = false;

    }, 250);


    setTimeout(() => {

        cpu.cooldown = false;

    }, 650);

}


// ========================================
// DAMAGE PLAYER
// ========================================

function damagePlayer(amount) {


    // BLOCK

    if (player.blocking) {

        amount *= 0.3;

        setPlayerSprite(
            "block_01"
        );

    }


    // HIT

    else {

        setPlayerSprite(
            "hit_01"
        );

    }


    player.hp =

        Math.max(
            0,
            player.hp - amount
        );


    setTimeout(() => {

        if (

            player.hp > 0 &&

            !player.blocking

        ) {

            setPlayerSprite(
                "idle_01"
            );

        }

    }, 350);

}


// ========================================
// DAMAGE CPU
// ========================================

function damageCPU(amount) {

    if (cpu.blocking) {

        amount *= 0.3;

    }


    cpu.hp =

        Math.max(
            0,
            cpu.hp - amount
        );

}


// ========================================
// HEALTH
// ========================================

function updateHealth() {

    playerBar.style.width =
        player.hp + "%";


    cpuBar.style.width =
        cpu.hp + "%";

}


// ========================================
// WINNER
// ========================================

function checkWinner() {


    if (player.hp <= 0) {

        finishRound("CPU");

        return true;

    }


    if (cpu.hp <= 0) {

        finishRound("PLAYER");

        return true;

    }


    return false;

}


// ========================================
// ROUND FINISH
// ========================================

function finishRound(winner) {


    gameRunning = false;

    roundIntro = true;


    // PLAYER LOST ROUND

    if (winner === "CPU") {

        setPlayerSprite(
            "ko"
        );


        cpuRounds++;


        // CPU WINS MATCH

        if (cpuRounds >= 2) {

            endGame(

                `Oops...<br>
                You totally did that on purpose!<br><br>
                Don't worry,<br>
                you're still the best! ♡`

            );

            return;

        }

    }


    // PLAYER WON ROUND

    else {

        playerRounds++;


        // CPU KO

        // CPU remains placeholder


        // PLAYER WINS MATCH

        if (playerRounds >= 2) {

            endGame(

                `Yeahhh! You are the winner!<br>
                Happy birthday to you! ♡`

            );

            return;

        }

    }


    // NEXT ROUND

    resultText.innerHTML =

        `${
            winner === "PLAYER"
                ? "PLAYER WINS!"
                : "CPU WINS!"
        }<br>

        <span style="font-family: monospace; font-size: 20px;">
        ${playerRounds} - ${cpuRounds}
        </span>`;


    message.style.display =
        "block";


    restartButton.style.display =
        "none";

    characterButton.style.display =
        "none";

    menuButton.style.display =
        "none";


    setTimeout(() => {

        currentRound++;

        startRound();

    }, 1200);

}


// ========================================
// FINAL GAME END
// ========================================

function endGame(text) {

    gameOver = true;

    gameRunning = false;

    roundIntro = false;


    resultText.innerHTML =
        text;


    message.style.display =
        "block";


    restartButton.style.display =
        "block";

    characterButton.style.display =
        "block";

    menuButton.style.display =
        "block";

}


// ========================================
// DRAW
// ========================================

function draw() {


    playerEl.style.left =
        player.x + "px";


    playerEl.style.bottom =

        (45 + player.y) +
        "px";


    cpuEl.style.left =
        cpu.x + "px";


    cpuEl.style.bottom =

        (45 + cpu.y) +
        "px";


    playerEl.classList.toggle(

        "blocking",

        player.blocking

    );

}


// ========================================
// GAME LOOP
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


    requestAnimationFrame(
        gameLoop
    );

}


// ========================================
// END BUTTONS
// ========================================

restartButton.addEventListener(
    "click",
    () => {

        playerRounds = 0;

        cpuRounds = 0;

        currentRound = 1;

        startRound();

    }
);


characterButton.addEventListener(
    "click",
    () => {

        gameRunning = false;

        gameOver = true;

        playerRounds = 0;

        cpuRounds = 0;

        currentRound = 1;

        showScreen("select");

    }
);


menuButton.addEventListener(
    "click",
    () => {

        gameRunning = false;

        gameOver = true;

        playerRounds = 0;

        cpuRounds = 0;

        currentRound = 1;

        showScreen("menu");

    }
);
