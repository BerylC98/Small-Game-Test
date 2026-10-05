// ========================================
// PIXEL FIGHTER
// Four Character System
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
const fighterChoices = document.querySelectorAll(".fighter-choice");
const selectedName = document.getElementById("selectedName");

const playerEl = document.getElementById("player");
const playerSprite = document.getElementById("playerSprite");
const cpuEl = document.getElementById("cpu");
const cpuSprite = document.getElementById("cpuSprite");

const playerBar = document.getElementById("playerBar");
const cpuBar = document.getElementById("cpuBar");

const message = document.getElementById("message");
const resultText = document.getElementById("resultText");

const restartButton = document.getElementById("restartButton");
const characterButton = document.getElementById("characterButton");
const menuButton = document.getElementById("menuButton");


// ========================================
// CHARACTER DATABASE
// ========================================

const characters = {

    Kiryu: {
        name: "桐生",
        folder: "Kiryu"
    },

    Zhaoyun: {
        name: "赵云",
        folder: "Zhaoyun"
    },

    Kugga: {
        name: "空我",
        folder: "Kugga"
    },

    Cat: {
        name: "小猫",
        folder: "Cat"
    }

};


// ========================================
// CURRENT CHARACTERS
// ========================================

let selectedCharacter = "Kiryu";

let cpuCharacter = "Zhaoyun";


// ========================================
// GAME STATE
// ========================================

let gameRunning = false;
let gameOver = false;
let roundIntro = false;

let playerRounds = 0;
let cpuRounds = 0;
let currentRound = 1;

let player;
let cpu;

const keys = {};

let playerAction = "idle_01";
let cpuAction = "idle_01";

let playerActionTimer = null;
let cpuActionTimer = null;


// ========================================
// CHARACTER PATHS
// ========================================

function getPlayerPath() {

    return (
        "Character/" +
        characters[selectedCharacter].folder +
        "/"
    );

}


function getCPUPath() {

    return (
        "Character/" +
        characters[cpuCharacter].folder +
        "/"
    );

}


// ========================================
// RANDOM CPU CHARACTER
// ========================================

function chooseRandomCPU() {

    const availableCharacters =
        Object.keys(characters).filter(
            character =>
                character !== selectedCharacter
        );


    const randomIndex =
        Math.floor(
            Math.random() *
            availableCharacters.length
        );


    cpuCharacter =
        availableCharacters[randomIndex];

}


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

function setPlayerSprite(
    action,
    duration = 0
) {

    playerAction = action;

    playerSprite.src =
        getPlayerPath() +
        action +
        ".png";


    if (playerActionTimer) {

        clearTimeout(
            playerActionTimer
        );

    }


    if (duration > 0) {

        playerActionTimer =
            setTimeout(() => {

                if (
                    player &&
                    player.hp > 0
                ) {

                    setPlayerSprite(
                        "idle_01"
                    );

                }

            }, duration);

    }

}


// ========================================
// CPU SPRITE
// ========================================

function setCPUSprite(
    action,
    duration = 0
) {

    cpuAction = action;

    cpuSprite.src =
        getCPUPath() +
        action +
        ".png";


    if (cpuActionTimer) {

        clearTimeout(
            cpuActionTimer
        );

    }


    if (duration > 0) {

        cpuActionTimer =
            setTimeout(() => {

                if (
                    cpu &&
                    cpu.hp > 0
                ) {

                    setCPUSprite(
                        "idle_01"
                    );

                }

            }, duration);

    }

}


// ========================================
// CHARACTER SELECT
// ========================================

fighterChoices.forEach(choice => {

    choice.addEventListener(
        "click",
        () => {

            fighterChoices.forEach(item => {

                item.classList.remove(
                    "selected"
                );

            });


            choice.classList.add(
                "selected"
            );


            selectedCharacter =
                choice.dataset.character;


            selectedName.innerText =
                characters[
                    selectedCharacter
                ].name;

        }
    );

});


// ========================================
// MENU
// ========================================

startButton.addEventListener(
    "click",
    () => {

        showScreen("select");

    }
);


howToButton.addEventListener(
    "click",
    () => {

        showScreen("howTo");

    }
);


backButton.addEventListener(
    "click",
    () => {

        showScreen("menu");

    }
);


selectBackButton.addEventListener(
    "click",
    () => {

        showScreen("menu");

    }
);


// ========================================
// CONFIRM CHARACTER
// ========================================

confirmButton.addEventListener(
    "click",
    () => {

        playerRounds = 0;

        cpuRounds = 0;

        currentRound = 1;

        startRound();

    }
);


// ========================================
// KEYBOARD
// ========================================

document.addEventListener(
    "keydown",
    event => {

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

    }
);


document.addEventListener(
    "keyup",
    event => {

        keys[
            event.key.toLowerCase()
        ] = false;

    }
);


// ========================================
// START ROUND
// ========================================

function startRound() {

    // Random CPU character
    // Always different from player.

    chooseRandomCPU();


    player = {

        x: 150,

        y: 0,

        facing: 1,

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

        facing: -1,

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


    playerAction = "idle_01";

    cpuAction = "idle_01";


    setPlayerSprite("idle_01");

    setCPUSprite("idle_01");


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
        <span style="
            font-family: monospace;
            font-size: 22px;
        ">
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


        requestAnimationFrame(
            gameLoop
        );

    }, 1300);

}


// ========================================
// JUMP
// ========================================

function jump(fighter) {

    if (
        fighter.y === 0 &&
        !fighter.attacking &&
        !fighter.blocking
    ) {

        fighter.velocityY =
            fighter.jumpSpeed;


        if (fighter === player) {

            setPlayerSprite(
                "jump_01",
                600
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

    player.blocking =
        !!keys["s"] &&
        !player.attacking;


    if (player.blocking) {

        setPlayerSprite(
            "block_01"
        );

        return;

    }


    if (player.attacking) {

        return;

    }


    if (
        playerAction === "hit_01" ||
        playerAction === "hit_02" ||
        playerAction === "ko"
    ) {

        return;

    }


    let moving = false;


    // LEFT

    if (keys["a"]) {

        player.x -=
            player.speed;

        player.facing =
            -1;

        moving = true;

    }


    // RIGHT

    if (keys["d"]) {

        player.x +=
            player.speed;

        player.facing =
            1;

        moving = true;

    }


    // WALK

    if (
        moving &&
        player.y === 0
    ) {

        const frame =
            Math.floor(
                Date.now() / 180
            ) % 2;


        setPlayerSprite(
            frame === 0
                ? "walk_01"
                : "walk_02"
        );


        return;

    }


    // JUMP

    if (player.y > 0) {

        if (
            playerAction !==
            "jump_01"
        ) {

            setPlayerSprite(
                "jump_01"
            );

        }

        return;

    }


    // IDLE

    if (
        !moving &&
        player.y === 0
    ) {

        if (
            playerAction !==
            "idle_01"
        ) {

            setPlayerSprite(
                "idle_01"
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
            player.x -
            cpu.x
        );


    let damage;

    let range;

    let animation;


    if (type === "punch") {

        damage = 8;

        range = 100;

        animation =
            "punch_01";

    } else {

        damage = 12;

        range = 120;

        animation =
            "kick_01";

    }


    setPlayerSprite(
        animation
    );


    if (
        distance <= range
    ) {

        damageCPU(
            damage,
            type
        );

    }


    setTimeout(() => {

        player.attacking =
            false;


        if (
            player.hp > 0
        ) {

            setPlayerSprite(
                "idle_01"
            );

        }

    }, 300);


    setTimeout(() => {

        player.cooldown =
            false;

    }, 450);

}


// ========================================
// CPU AI
// ========================================

function cpuAI() {

    const distance =
        player.x -
        cpu.x;


    const absDistance =
        Math.abs(distance);


    // Face player

    if (
        distance > 0
    ) {

        cpu.facing =
            1;

    } else {

        cpu.facing =
            -1;

    }


    // Move toward player

    if (
        absDistance > 110 &&
        !cpu.attacking &&
        !cpu.blocking
    ) {

        if (
            distance > 0
        ) {

            cpu.x +=
                cpu.speed;

        } else {

            cpu.x -=
                cpu.speed;

        }


        if (
            cpu.y === 0
        ) {

            const frame =
                Math.floor(
                    Date.now() / 180
                ) % 2;


            setCPUSprite(
                frame === 0
                    ? "walk_01"
                    : "walk_02"
            );

        }

    }


    // CPU jump

    if (
        player.y > 40 &&
        cpu.y === 0 &&
        !cpu.jumpCooldown &&
        Math.random() < 0.04
    ) {

        cpuJump();

    }


    // CPU attack

    if (
        absDistance <= 115 &&
        !cpu.attacking &&
        !cpu.cooldown &&
        Math.random() < 0.035
    ) {

        cpuAttack();

    }


    // CPU block

    cpu.blocking =
        player.attacking &&
        absDistance < 130 &&
        Math.random() < 0.25;


    if (
        cpu.blocking &&
        !cpu.attacking
    ) {

        setCPUSprite(
            "block_01"
        );

    }


    cpu.x =
        Math.max(
            0,
            Math.min(
                775,
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


    setCPUSprite(
        "jump_01",
        600
    );


    setTimeout(() => {

        cpu.jumpCooldown =
            false;

    }, 1000);

}


// ========================================
// CPU ATTACK
// ========================================

function cpuAttack() {

    cpu.attacking =
        true;

    cpu.cooldown =
        true;


    const distance =
        Math.abs(
            cpu.x -
            player.x
        );


    const kick =
        distance > 75;


    const damage =
        kick
            ? 10
            : 7;


    const range =
        kick
            ? 115
            : 90;


    setCPUSprite(
        kick
            ? "kick_01"
            : "punch_01"
    );


    if (
        distance <= range
    ) {

        damagePlayer(
            damage,
            kick
                ? "kick"
                : "punch"
        );

    }


    setTimeout(() => {

        cpu.attacking =
            false;


        if (
            cpu.hp > 0
        ) {

            setCPUSprite(
                "idle_01"
            );

        }

    }, 300);


    setTimeout(() => {

        cpu.cooldown =
            false;

    }, 650);

}


// ========================================
// DAMAGE PLAYER
// ========================================

function damagePlayer(
    amount,
    type
) {

    if (
        player.hp <= 0
    ) {

        return;

    }


    if (
        player.blocking
    ) {

        amount *= 0.3;


        setPlayerSprite(
            "block_01"
        );

    } else {

        setPlayerSprite(
            type === "kick"
                ? "hit_02"
                : "hit_01"
        );

    }


    player.hp =
        Math.max(
            0,
            player.hp - amount
        );


    if (
        player.hp > 0
    ) {

        setTimeout(() => {

            if (
                !player.blocking &&
                player.hp > 0
            ) {

                setPlayerSprite(
                    "idle_01"
                );

            }

        }, 350);

    }

}


// ========================================
// DAMAGE CPU
// ========================================

function damageCPU(
    amount,
    type
) {

    if (
        cpu.hp <= 0
    ) {

        return;

    }


    if (
        cpu.blocking
    ) {

        amount *= 0.3;


        setCPUSprite(
            "block_01"
        );

    } else {

        setCPUSprite(
            type === "kick"
                ? "hit_02"
                : "hit_01"
        );

    }


    cpu.hp =
        Math.max(
            0,
            cpu.hp - amount
        );


    if (
        cpu.hp > 0
    ) {

        setTimeout(() => {

            if (
                !cpu.blocking &&
                cpu.hp > 0 &&
                !cpu.attacking
            ) {

                setCPUSprite(
                    "idle_01"
                );

            }

        }, 350);

    }

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
// CHECK WINNER
// ========================================

function checkWinner() {

    if (
        player.hp <= 0
    ) {

        finishRound("CPU");

        return true;

    }


    if (
        cpu.hp <= 0
    ) {

        finishRound("PLAYER");

        return true;

    }


    return false;

}


// ========================================
// FINISH ROUND
// ========================================

function finishRound(winner) {

    gameRunning = false;

    roundIntro = true;


    if (
        winner === "CPU"
    ) {

        setPlayerSprite(
            "ko"
        );

        setCPUSprite(
            "idle_01"
        );


        cpuRounds++;


        if (
            cpuRounds >= 2
        ) {

            endGame(
                `Oops...<br>
                You totally did that on purpose!<br><br>
                Don't worry,<br>
                you're still the best! ♡`
            );

            return;

        }

    } else {

        setCPUSprite(
            "ko"
        );


        playerRounds++;


        if (
            playerRounds >= 2
        ) {

            endGame(
                `Yeahhh! You are the winner!<br>
                Happy birthday to you! ♡`
            );

            return;

        }

    }


    resultText.innerHTML =
        `${
            winner === "PLAYER"
                ? "PLAYER WINS!"
                : "CPU WINS!"
        }<br>
        <span style="
            font-family: monospace;
            font-size: 20px;
        ">
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
// END GAME
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
        (8 + player.y) + "px";


    cpuEl.style.left =
        cpu.x + "px";


    cpuEl.style.bottom =
        (8 + cpu.y) + "px";


    // Player mirror

    playerSprite.style.transform =
        player.facing === -1
            ? "scaleX(-1)"
            : "scaleX(1)";


    // CPU mirror

    cpuSprite.style.transform =
        cpu.facing === -1
            ? "scaleX(-1)"
            : "scaleX(1)";


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
// GAME LOOP
// ========================================

function gameLoop() {

    if (
        !gameRunning
    ) {

        return;

    }


    if (
        checkWinner()
    ) {

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
// RESTART
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


// ========================================
// CHANGE CHARACTER
// ========================================

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


// ========================================
// MAIN MENU
// ========================================

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
