// ========================================
// PIXEL STREET FIGHTER
// Player VS CPU
// ========================================


// ========================================
// 玩家
// ========================================

const player = {

    x:180,
    y:0,

    hp:100,

    speed:5,

    jumpSpeed:13,

    velocityY:0,

    attacking:false,

    attackType:null,

    cooldown:false,

    blocking:false

};



// ========================================
// CPU
// ========================================

const cpu = {

    x:700,
    y:0,

    hp:100,

    speed:2.2,

    jumpSpeed:12,

    velocityY:0,

    attacking:false,

    attackType:null,

    cooldown:false,

    blocking:false,

    jumpCooldown:false

};



// ========================================
// HTML
// ========================================

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



// ========================================
// 键盘
// ========================================

const keys = {};



document.addEventListener(
    "keydown",
    function(e){

        keys[e.key.toLowerCase()] = true;


        // J = 拳

        if(
            e.key.toLowerCase() === "j"
        ){

            playerAttack("punch");

        }


        // K = 踢

        if(
            e.key.toLowerCase() === "k"
        ){

            playerAttack("kick");

        }


        // W = 跳

        if(
            e.key.toLowerCase() === "w"
        ){

            jump(player);

        }

    }
);



document.addEventListener(
    "keyup",
    function(e){

        keys[e.key.toLowerCase()] = false;

    }
);



// ========================================
// 跳跃
// ========================================

function jump(fighter){

    if(
        fighter.y === 0 &&
        !fighter.attacking
    ){

        fighter.velocityY =
            fighter.jumpSpeed;

    }

}



// ========================================
// 重力
// ========================================

function gravity(fighter){

    fighter.y +=
        fighter.velocityY;

    fighter.velocityY -=
        0.7;


    if(fighter.y <= 0){

        fighter.y = 0;

        fighter.velocityY = 0;

    }

}



// ========================================
// 玩家移动
// ========================================

function playerMovement(){

    if(keys["a"]){

        player.x -=
            player.speed;

    }


    if(keys["d"]){

        player.x +=
            player.speed;

    }


    player.blocking =
        keys["s"] &&
        !player.attacking;



    player.x =
        Math.max(
            0,
            Math.min(
                840,
                player.x
            )
        );

}



// ========================================
// 玩家攻击
// ========================================

function playerAttack(type){

    if(
        player.cooldown ||
        player.attacking
    ){

        return;

    }


    player.attacking = true;

    player.attackType = type;

    player.cooldown = true;



    let distance =
        Math.abs(
            player.x - cpu.x
        );


    let damage;

    let range;



    if(type === "punch"){

        damage = 8;

        range = 90;

        playerEl.classList.add(
            "punching"
        );

    }


    if(type === "kick"){

        damage = 12;

        range = 110;

        playerEl.classList.add(
            "kicking"
        );

    }



    if(distance <= range){

        damageCPU(damage);

    }



    setTimeout(function(){

        player.attacking = false;

        playerEl.classList.remove(
            "punching"
        );

        playerEl.classList.remove(
            "kicking"
        );

    },180);



    setTimeout(function(){

        player.cooldown = false;

    },350);

}



// ========================================
// CPU AI
// ========================================

function cpuAI(){

    const distance =
        player.x - cpu.x;


    const absDistance =
        Math.abs(distance);



    // ==================================
    // CPU 面向玩家并靠近
    // ==================================

    if(absDistance > 115){

        if(distance > 0){

            cpu.x +=
                cpu.speed;

        }
        else{

            cpu.x -=
                cpu.speed;

        }

    }



    // ==================================
    // CPU 跳跃逻辑
    // ==================================

    // 如果玩家在空中
    // CPU 有概率跳起来

    if(
        player.y > 40 &&
        cpu.y === 0 &&
        !cpu.jumpCooldown
    ){

        if(Math.random() < 0.04){

            cpuJump();

        }

    }



    // ==================================
    // 距离太远时偶尔跳跃追击
    // ==================================

    if(
        absDistance > 250 &&
        cpu.y === 0 &&
        !cpu.jumpCooldown
    ){

        if(Math.random() < 0.01){

            cpuJump();

        }

    }



    // ==================================
    // 攻击
    // ==================================

    if(
        absDistance <= 115 &&
        !cpu.attacking &&
        !cpu.cooldown
    ){

        if(
            Math.random() < 0.035
        ){

            cpuAttack();

        }

    }



    // ==================================
    // CPU 防御
    // ==================================

    cpu.blocking = false;


    // 玩家正在攻击的时候
    // CPU 偶尔防御

    if(
        player.attacking &&
        absDistance < 130
    ){

        if(
            Math.random() < 0.25
        ){

            cpu.blocking = true;

        }

    }



    // ==================================
    // 限制边界
    // ==================================

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
// CPU 跳跃
// ========================================

function cpuJump(){

    if(
        cpu.y !== 0 ||
        cpu.jumpCooldown
    ){

        return;

    }


    cpu.velocityY =
        cpu.jumpSpeed;


    cpu.jumpCooldown =
        true;


    // 跳跃冷却

    setTimeout(function(){

        cpu.jumpCooldown =
            false;

    },1000);

}



// ========================================
// CPU 攻击
// ========================================

function cpuAttack(){

    cpu.attacking = true;

    cpu.cooldown = true;


    const distance =
        Math.abs(
            cpu.x - player.x
        );


    // CPU 根据距离选择攻击

    let kick =
        distance > 75;


    let damage;

    let range;


    if(kick){

        damage = 10;

        range = 110;

        cpuEl.classList.add(
            "kicking"
        );

    }
    else{

        damage = 7;

        range = 90;

        cpuEl.classList.add(
            "punching"
        );

    }



    if(distance <= range){

        damagePlayer(damage);

    }



    setTimeout(function(){

        cpu.attacking = false;

        cpuEl.classList.remove(
            "punching"
        );

        cpuEl.classList.remove(
            "kicking"
        );

    },180);



    setTimeout(function(){

        cpu.cooldown = false;

    },650);

}



// ========================================
// 玩家受伤
// ========================================

function damagePlayer(amount){

    if(player.blocking){

        amount *= 0.3;

    }


    player.hp -=
        amount;


    player.hp =
        Math.max(
            0,
            player.hp
        );


    playerEl.classList.add(
        "hit"
    );


    setTimeout(function(){

        playerEl.classList.remove(
            "hit"
        );

    },100);

}



// ========================================
// CPU 受伤
// ========================================

function damageCPU(amount){

    if(cpu.blocking){

        amount *= 0.3;

    }


    cpu.hp -=
        amount;


    cpu.hp =
        Math.max(
            0,
            cpu.hp
        );


    cpuEl.classList.add(
        "hit"
    );


    setTimeout(function(){

        cpuEl.classList.remove(
            "hit"
        );

    },100);

}



// ========================================
// 血条
// ========================================

function updateHealth(){

    playerBar.style.width =
        player.hp + "%";


    cpuBar.style.width =
        cpu.hp + "%";

}



// ========================================
// 游戏结束
// ========================================

let gameOver = false;



function checkWinner(){

    if(gameOver){

        return true;

    }



    if(player.hp <= 0){

        gameOver = true;


        resultText.innerText =
            "CPU WINS!";


        message.style.display =
            "block";


        return true;

    }



    if(cpu.hp <= 0){

        gameOver = true;


        resultText.innerText =
            "PLAYER WINS!";


        message.style.display =
            "block";


        return true;

    }


    return false;

}



// ========================================
// 画面
// ========================================

function draw(){

    playerEl.style.left =
        player.x + "px";


    playerEl.style.bottom =
        (80 + player.y) + "px";


    cpuEl.style.left =
        cpu.x + "px";


    cpuEl.style.bottom =
        (80 + cpu.y) + "px";



    // 玩家防御

    if(player.blocking){

        playerEl.classList.add(
            "blocking"
        );

    }
    else{

        playerEl.classList.remove(
            "blocking"
        );

    }



    // CPU 防御

    if(cpu.blocking){

        cpuEl.classList.add(
            "blocking"
        );

    }
    else{

        cpuEl.classList.remove(
            "blocking"
        );

    }

}



// ========================================
// 游戏循环
// ========================================

function gameLoop(){

    if(!checkWinner()){

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

}



// ========================================
// Restart
// ========================================

restartButton.addEventListener(
    "click",
    function(){

        location.reload();

    }
);



// ========================================
// 开始
// ========================================

gameLoop();
