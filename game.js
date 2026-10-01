let player={
x:200,
speed:5
};


let cpu={
x:650
};


const playerEl=document.querySelector(".player");
const cpuEl=document.querySelector(".cpu");


let keys={};


document.addEventListener(
"keydown",
e=>{
keys[e.key]=true;
});


document.addEventListener(
"keyup",
e=>{
keys[e.key]=false;
});



function update(){

// 玩家移动

if(keys["a"]){

player.x-=player.speed;

}


if(keys["d"]){

player.x+=player.speed;

}



playerEl.style.left=
player.x+"px";



cpuEl.style.left=
cpu.x+"px";



requestAnimationFrame(update);

}


update();
