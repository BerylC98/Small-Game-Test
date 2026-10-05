// ========================================
// PIXEL STREET FIGHTER
// Player VS CPU
// ========================================


// ---------- 玩家 ----------

let player = {
    x: 180,
    y: 0,

    hp: 100,

    speed: 5,

    attacking: false,
    guarding: false,

    attackCooldown: false,

    facing: 1
};


// ---------- CPU ----------

let cpu = {
    x: 700,
    y: 0,

    hp: 100,

    speed: 2.2,

    attacking: false,
    guarding: false,

    attackCooldown: false,

    facing: -1
};


// ---------- 获取 HTML 元素 ----------

const playerBox =
    document.querySelector(".player");

const cpuBox =
    document.querySelector(".cpu");

const game =
    document.querySelector("#game");


// ---------- 键盘 ----------

let keys = {};

document.addEventListener("keydown", function(e){

    keys[e.key.toLowerCase()] = true;

});


document.addEventListener("keyup", function(e){

    keys[e.key.toLowerCase()] = false;

});


// ========================================
// 玩家移动
// ========================================

function playerMovement(){

    // 左
    if(keys["a"]){

        player.x -= player.speed;

        player.facing = -1;

    }


    // 右
    if(keys["d"]){

        player.x += player.speed;

        player.facing = 1;

    }


    // 防御
    player.guarding = keys["s"];


    // 限制玩家范围

    if(player.x < 0){
        player.x = 0;
    }

    if(player.x > 840){
        player.x = 840;
    }

}


// ========================================
// 玩家攻击
// ========================================

function playerAttack(){

    if(player.attackCooldown){
        return;
    }


    player.attacking = true;

    player.attackCooldown = true;


    console.log("PLAYER ATTACK!");



    // 判断距离

    let distance =
        Math.abs(player.x - cpu.x);


    // 攻击距离

    if(distance < 100){

        damageCPU(10);

    }


    // 攻击动画

    playerBox.style.transform =
        "scaleX(1.2)";


    setTimeout(function(){

        playerBox.style.transform =
            "scaleX(1)";

    },120);


    // 攻击结束

    setTimeout(function(){

        player.attacking = false;

    },180);


    // cooldown

    setTimeout(function(){

        player.attackCooldown = false;

    },350);

}


// ========================================
// CPU AI
// ========================================

function cpuAI(){

    let distance =
        player.x - cpu.x;


    let absDistance =
        Math.abs(distance);


    // CPU 面向玩家

    if(distance < 0){

        cpu.facing = -1;

    }
    else{

        cpu.facing = 1;

    }



    // 玩家距离比较远
    // CPU 靠近

    if(absDistance > 110){

        if(distance > 0){

            cpu.x += cpu.speed;

        }
        else{

            cpu.x -= cpu.speed;

        }

    }


    // 靠近以后随机攻击

    else{

        if(!cpu.attackCooldown){

            let random =
                Math.random();


            if(random < 0.035){

                cpuAttack();

            }

        }

    }


    // CPU 不跑出场地

    if(cpu.x < 0){
        cpu.x = 0;
    }

    if(cpu.x > 840){
        cpu.x = 840;
    }

}


// ========================================
// CPU 攻击
// ========================================

function cpuAttack(){

    cpu.attacking = true;

    cpu.attackCooldown = true;


    console.log("CPU ATTACK!");


    let distance =
        Math.abs(cpu.x - player.x);


    if(distance < 100){

        damagePlayer(8);

    }


    cpuBox.style.transform =
        "scaleX(1.2)";


    setTimeout(function(){

        cpuBox.style.transform =
            "scaleX(1)";

    },120);


    setTimeout(function(){

        cpu.attacking = false;

    },180);


    setTimeout(function(){

        cpu.attackCooldown = false;

    },700);

}


// ========================================
// 玩家受伤
// ========================================

function damagePlayer(amount){

    if(player.guarding){

        amount *= 0.3;

        console.log("BLOCK!");

    }


    player.hp -= amount;


    if(player.hp < 0){

        player.hp = 0;

    }


    playerBox.style.filter =
        "brightness(3)";


    setTimeout(function(){

        playerBox.style.filter =
            "brightness(1)";

    },100);


    console.log(
        "PLAYER HP:",
        player.hp
    );

}


// ========================================
// CPU 受伤
// ========================================

function damageCPU(amount){

    cpu.hp -= amount;


    if(cpu.hp < 0){

        cpu.hp = 0;

    }


    cpuBox.style.filter =
        "brightness(3)";


    setTimeout(function(){

        cpuBox.style.filter =
            "brightness(1)";

    },100);


    console.log(
        "CPU HP:",
        cpu.hp
    );

}


// ========================================
// 血条
// ========================================

function drawHealth(){

    // 如果你的 HTML 以后加入血条
    // 这里可以直接控制


    let playerBar =
        document.querySelector("#playerBar");


    let cpuBar =
        document.querySelector("#cpuBar");


    if(playerBar){

        playerBar.style.width =
            player.hp + "%";

    }


    if(cpuBar){

        cpuBar.style.width =
            cpu.hp + "%";

    }

}


// ========================================
// 胜负
// ========================================

function checkWinner(){

    if(player.hp <= 0){

        console.log(
            "CPU WINS!"
        );

        document.body.style.background =
            "#400";

    }


    if(cpu.hp <= 0){

        console.log(
            "PLAYER WINS!"
        );

        document.body.style.background =
            "#004";

    }

}


// ========================================
// 更新画面
// ========================================

function draw(){

    playerBox.style.left =
        player.x + "px";


    playerBox.style.bottom =
        (80 + player.y) + "px";


    cpuBox.style.left =
        cpu.x + "px";


    cpuBox.style.bottom =
        (80 + cpu.y) + "px";

}


// ========================================
// 主游戏循环
// ========================================

function gameLoop(){

    playerMovement();

    cpuAI();

    draw();

    drawHealth();

    checkWinner();

    requestAnimationFrame(gameLoop);

}


// ========================================
// J = 拳头
// ========================================

document.addEventListener(
    "keydown",
    function(e){

        if(e.key.toLowerCase() === "j"){

            playerAttack();

        }

    }
);


// 开始游戏

gameLoop();
