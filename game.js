// ========================================
// YEYMAR FIGHTER
// Character System
// ========================================


// ========================================
// SCREEN ELEMENTS
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


const playerName =
    document.getElementById("playerName");


const cpuName =
    document.getElementById("cpuName");


const playerEl =
    document.getElementById("player");


const playerSprite =
    document.getElementById("playerSprite");


const cpuEl =
    document.getElementById("cpu");


const cpuSprite =
    document.getElementById("cpuSprite");


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


// ========================================
// BACKGROUND MUSIC
// ========================================

const bgm =
    document.getElementById("bgm");



// ========================================
// CHARACTER DATABASE
// ========================================

const characters = {

    Cat: {
        name: "小猫",
        folder: "Cat"
    },

    Kiryu: {
        name: "桐生",
        folder: "Kiryu"
    },

    Kugga: {
        name: "空我",
        folder: "Kugga"
    },

    Zhaoyun: {
        name: "赵云",
        folder: "Zhaoyun"
    }

};



// ========================================
// CURRENT CHARACTER
// ========================================

let selectedCharacter =
    "Cat";


let playerCharacter =
    characters.Cat;


let cpuCharacter =
    characters.Kiryu;



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


let playerAction =
    "idle_01";


let cpuAction =
    "idle_01";


let playerActionTimer =
    null;


let cpuActionTimer =
    null;



// ========================================
// CHARACTER PATH
// ========================================

function getCharacterPath(character) {

    return (
        "Character/" +
        character.folder +
        "/"
    );

}



// ========================================
// SHOW SCREEN
// ========================================

function showScreen(name) {

    Object.values(screens).forEach(
        screen => {

            screen.classList.remove(
                "active"
            );

        }
    );


    screens[name].classList.add(
        "active"
    );

}



// ========================================
// PLAYER SPRITE
// ========================================

function setPlayerSprite(
    action,
    duration = 0
) {

    playerAction = action;


    const newSrc =
        getCharacterPath(
            playerCharacter
        ) +
        action +
        ".png";


    if (
        playerSprite.src.indexOf(
            newSrc
        ) === -1
    ) {

        playerSprite.src =
            newSrc;

    }


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


    const newSrc =
        getCharacterPath(
            cpuCharacter
        ) +
        action +
        ".png";


    if (
        cpuSprite.src.indexOf(
            newSrc
        ) === -1
    ) {

        cpuSprite.src =
            newSrc;

    }


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

fighterChoices.forEach(
    choice => {

        choice.addEventListener(
            "click",
            () => {

                fighterChoices.forEach(
                    item => {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


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

    }
);



// ========================================
// START BUTTON
// ========================================

startButton.addEventListener(
    "click",
    () => {

        // ====================================
        // START BACKGROUND MUSIC
        // ====================================

        if (bgm) {

            bgm.volume = 0.5;

            bgm.play().catch(
                () => {}
            );

        }


        showScreen("select");

    }
);



// ========================================
// HOW TO PLAY
// ========================================

howToButton.addEventListener(
    "click",
    () => {

        showScreen("howTo");

    }
);



// ========================================
// BACK
// ========================================

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

        playerCharacter =
            characters[
                selectedCharacter
            ];


        // ====================================
        // CPU RANDOM CHARACTER
        // ====================================

        const availableCharacters =
            Object.keys(characters)
                .filter(
                    key =>
                        key !==
                        selectedCharacter
                );


        const randomIndex =
            Math.floor(
                Math.random() *
                availableCharacters.length
            );


        const cpuKey =
            availableCharacters[
                randomIndex
            ];


        cpuCharacter =
            characters[
                cpuKey
            ];


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

            playerAttack(
                "punch"
            );

        }


        if (key === "k") {

            playerAttack(
                "kick"
            );

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



    // ====================================
    // UPDATE NAMES
    // ====================================

    playerName.innerText =
        playerCharacter.name;


    cpuName.innerText =
        cpuCharacter.name;



    // ====================================
    // LOAD INITIAL SPRITES
    // ====================================

    setPlayerSprite(
        "idle_01"
    );


    setCPUSprite(
        "idle_01"
    );


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


    setTimeout(
        () => {

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

        },
        1300
    );

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
                "jump_01"
            );

        } else {

            setCPUSprite(
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

    player.blocking =
        !!keys["s"] &&
        !player.attacking;



    // ====================================
    // BLOCK
    // ====================================

    if (player.blocking) {

        setPlayerSprite(
            "block_01"
        );

        return;

    }



    // ====================================
    // ATTACK
    // ====================================

    if (player.attacking) {

        return;

    }



    // ====================================
    // HIT
    // ====================================

    if (
        playerAction === "hit_01" ||
        playerAction === "hit_02"
    ) {

        return;

    }



    // ====================================
    // KO
    // ====================================

    if (
        playerAction === "ko"
    ) {

        return;

    }



    let moving = false;



    // ====================================
    // LEFT
    // ====================================

    if (keys["a"]) {

        player.x -=
            player.speed;


        player.facing = -1;


        moving = true;

    }



    // ====================================
    // RIGHT
    // ====================================

    if (keys["d"]) {

        player.x +=
            player.speed;


        player.facing = 1;


        moving = true;

    }



    // ====================================
    // WALK
    // ====================================

    if (
        moving &&
        player.y === 0
    ) {

        const frame =
            Math.floor(
                Date.now() / 180
            ) % 2;


        if (frame === 0) {

            setPlayerSprite(
                "walk_01"
            );

        } else {

            setPlayerSprite(
                "walk_02"
            );

        }


        return;

    }



    // ====================================
    // JUMP
    // ====================================

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



    // ====================================
    // IDLE
    // ====================================

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



    // ====================================
    // LIMIT
    // ====================================

    player.x =
        Math.max(
            0,
            Math.min(
                775,
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
            damage
        );

    }


    setTimeout(
        () => {

            player.attacking =
                false;


            if (
                player.hp > 0
            ) {

                setPlayerSprite(
                    "idle_01"
                );

            }

        },
        300
    );


    setTimeout(
        () => {

            player.cooldown =
                false;

        },
        450
    );

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



    // ====================================
    // FACE PLAYER
    // ====================================

    if (
        distance > 0
    ) {

        cpu.facing = 1;

    } else {

        cpu.facing = -1;

    }



    // ====================================
    // APPROACH
    // ====================================

    if (
        absDistance > 110 &&
        !cpu.attacking
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

    }



    // ====================================
    // JUMP
    // ====================================

    if (
        player.y > 40 &&
        cpu.y === 0 &&
        !cpu.jumpCooldown &&
        Math.random() < 0.04
    ) {

        cpuJump();

    }



    // ====================================
    // ATTACK
    // ====================================

    if (
        absDistance <= 115 &&
        !cpu.attacking &&
        !cpu.cooldown &&
        Math.random() < 0.035
    ) {

        cpuAttack();

    }



    // ====================================
    // BLOCK
    // ====================================

    cpu.blocking =
        player.attacking &&
        absDistance < 130 &&
        Math.random() < 0.25;


    if (cpu.blocking) {

        setCPUSprite(
            "block_01"
        );

    }



    // ====================================
    // LIMIT
    // ====================================

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
        "jump_01"
    );


    setTimeout(
        () => {

            cpu.jumpCooldown =
                false;

        },
        1000
    );

}



// ========================================
// CPU ATTACK
// ========================================

function cpuAttack() {

    cpu.attacking = true;

    cpu.cooldown = true;


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


    setTimeout(
        () => {

            cpu.attacking =
                false;


            if (
                cpu.hp > 0 &&
                !cpu.blocking
            ) {

                setCPUSprite(
                    "idle_01"
                );

            }

        },
        250
    );


    setTimeout(
        () => {

            cpu.cooldown =
                false;

        },
        650
    );

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

        if (
            type === "kick"
        ) {

            setPlayerSprite(
                "hit_02"
            );

        } else {

            setPlayerSprite(
                "hit_01"
            );

        }

    }


    player.hp =
        Math.max(
            0,
            player.hp -
            amount
        );


    if (
        player.hp > 0
    ) {

        setTimeout(
            () => {

                if (
                    !player.blocking &&
                    player.hp > 0
                ) {

                    setPlayerSprite(
                        "idle_01"
                    );

                }

            },
            350
        );

    }

}



// ========================================
// DAMAGE CPU
// ========================================

function damageCPU(
    amount
) {

    if (
        cpu.blocking
    ) {

        amount *= 0.3;


        setCPUSprite(
            "block_01"
        );

    } else {

        // CPU receives hit

        setCPUSprite(
            amount >= 10
                ? "hit_02"
                : "hit_01"
        );


        setTimeout(
            () => {

                if (
                    cpu.hp > 0 &&
                    !cpu.blocking
                ) {

                    setCPUSprite(
                        "idle_01"
                    );

                }

            },
            350
        );

    }


    cpu.hp =
        Math.max(
            0,
            cpu.hp -
            amount
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
// WINNER CHECK
// ========================================

function checkWinner() {

    if (
        player.hp <= 0
    ) {

        finishRound(
            "CPU"
        );


        return true;

    }


    if (
        cpu.hp <= 0
    ) {

        finishRound(
            "PLAYER"
        );


        return true;

    }


    return false;

}



// ========================================
// ROUND END
// ========================================

function finishRound(
    winner
) {

    gameRunning = false;

    roundIntro = true;



    if (
        winner === "CPU"
    ) {

        setPlayerSprite(
            "ko"
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


    setTimeout(
        () => {

            currentRound++;

            startRound();

        },
        1200
    );

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

    // ====================================
    // PLAYER POSITION
    // ====================================

    playerEl.style.left =
        player.x + "px";


    playerEl.style.bottom =
        (8 + player.y) + "px";



    // ====================================
    // CPU POSITION
    // ====================================

    cpuEl.style.left =
        cpu.x + "px";


    cpuEl.style.bottom =
        (8 + cpu.y) + "px";



    // ====================================
    // PLAYER MIRROR
    // ====================================

    if (
        player.facing === -1
    ) {

        playerSprite.style.transform =
            "scaleX(-1)";

    } else {

        playerSprite.style.transform =
            "scaleX(1)";

    }



    // ====================================
    // CPU MIRROR
    // ====================================

    if (
        cpu.facing === -1
    ) {

        cpuSprite.style.transform =
            "scaleX(-1)";

    } else {

        cpuSprite.style.transform =
            "scaleX(1)";

    }



    // ====================================
    // BLOCKING VISUAL
    // ====================================

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


        showScreen(
            "select"
        );

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


        showScreen(
            "menu"
        );

    }
);
