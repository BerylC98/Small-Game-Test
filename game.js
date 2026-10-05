// ========================================
// PIXEL STREET FIGHTER
// Simple Boxing Game
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

    velocityY:0,

    attacking:false,

    attackType:null,

    cooldown:false,

    blocking:false

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



// ========================================
// 键盘
// ========================================

const keys = {};



document.addEventListener(
    "keydown",
    function(e){

        keys[e.key.toLowerCase()] = true;


        // J = 拳
        if(e.key.toLowerCase() === "j"){

            playerAttack("punch");

        }


        // K = 踢
        if(e.key.toLowerCase() === "k"){

            playerAttack("kick");

        }


        // W = 跳
        if(e.key.toLowerCase() === "w"){

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

    if(fighter.y === 0){

        fighter.velocityY =
            fighter.jumpSpeed;

    }

}



// ========================================
// 重力
// ========================================

function gravity(fighter){

    fighter.y += fighter.velocityY;

    fighter.velocityY -= 0.7;


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

        player.x -= player.speed;

    }


    if(keys["d"]){

        player.x += player.speed;

    }


    // 防御

    player.blocking =
        keys["s"] && !player.attacking;


    // 限制范围

    player.x =
        Math.max(
            0,
            Math.min(840, player.x)
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



    // 攻击距离

    const distance =
        Math.abs(player.x - cpu.x);



    let damage = 0;

    let range = 0;


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



    // 命中

    if(distance <= range){

        damageCPU(damage);

    }



    // 攻击结束

    setTimeout(function(){

        player.attacking = false;

        playerEl.classList.remove(
            "punching"
        );

        playerEl.classList.remove(
            "kicking"
        );

    },180);



    // 冷却

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



    // CPU 靠近玩家

    if(absDistance > 100){

        if(distance > 0){

            cpu.x += cpu.speed;

        }
        else{

            cpu.x -= cpu.speed;

        }

    }


    // 靠近后攻击

    else{

        if(
            !cpu.attacking &&
            !cpu.cooldown
        ){

            const random =
                Math.random();


            if(random < 0.025){

                cpuAttack();

            }

        }

    }


    // 偶尔防御

    cpu.blocking =
        Math.random() < 0.01 &&
        !cpu.attacking;


    cpu.x =
        Math.max(
            0,
            Math.min(840,cpu.x)
        );

}



// ========================================
// CPU 攻击
// ========================================

function cpuAttack(){

    cpu.attacking = true;

    cpu.cooldown = true;



    const distance =
        Math.abs(cpu.x - player.x);


    const kick =
        Math.random() < 0.4;


    const damage =
        kick ? 10 : 7;


    const range =
        kick ? 110 : 90;



    if(distance <= range){

        damagePlayer(damage);

    }



    if(kick){

        cpuEl.classList.add(
            "kicking"
        );

    }
    else{

        cpuEl.classList.add(
            "punching"
        );

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

    },700);

}



// ========================================
// 玩家受到伤害
// ========================================

function damagePlayer(amount){

    if(player.blocking){

        amount *= 0.3;

    }


    player.hp -= amount;


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
// CPU 受到伤害
// ========================================

function damageCPU(amount){

    if(cpu.blocking){

        amount *= 0.3;

    }


    cpu.hp -= amount;


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
// 更新血条
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

function checkWinner(){

    if(player.hp <= 0){

        message.innerText =
            "CPU WINS!";

        message.style.display =
            "block";

        return true;

    }


    if(cpu.hp <= 0){

        message.innerText =
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
// 开始
// ========================================

gameLoop();
