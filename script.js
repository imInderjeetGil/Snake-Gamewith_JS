const opposite = {
  up: "down",
  down: "up",
  left: "right",
  right: "left"
};

const board = document.querySelector('.board');
const startButton = document.querySelector(".btn-start")
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game")
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const currentScoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockHeight = 30;
const blockWidth = 30;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0
let time = '00-00';

highScoreElement.innerText = highScore;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId=null;
let timerIntervalId = null;

let food = {x:Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols) }

function getFood(){
    let newFood;
    do{
        newFood={
            x: Math.floor(Math.random()*rows),
            y: Math.floor(Math.random()*cols)
        };
    } while (snake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    food = newFood;
}


const blocks = [];
let snake = [{x:1,y:3},{x:1,y:4}]
let direction = "down";

//Board Print Logic
for(let row = 0; row<rows; row++){
    for(let col = 0; col < cols; col++){
    const block = document.createElement('div');
    block.classList.add('block');
    board.appendChild(block);
  //  blocks.innerText(`${row}-${col}`);
    blocks[`${row}-${col}`] = block;
    }
}

function render(){
    let head = null;
    
    blocks[`${food.x}-${food.y}`].classList.add("food");
    if(direction==='left'){
        head = {x: snake[0].x, y: snake[0].y-1}
    }else if(direction ==='right'){
        head = {x: snake[0].x, y: snake[0].y+1}
    }else if(direction==='down'){
        head = {x: snake[0].x+1, y: snake[0].y}
    }else if(direction==="up"){
        head = {x: snake[0].x-1, y: snake[0].y}
    }

    //wall collision logic
    if(head.x <0 || head.x >=rows || head.y <0 || head.y >= cols){
        clearInterval(intervalId);
        modal.style.display = "flex";
        startGameModal.style.display="none";
        gameOverModal.style.display="flex";
        return
    }
    // 🚨 Self collision
if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  modal.style.display = "flex";
  startGameModal.style.display = "none";
  gameOverModal.style.display = "flex";
  return;
}
    //food consume logic
    if(head.x==food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {x:Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols) }
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);
        score += 10;
        currentScoreElement.innerText = score;

        if(score>highScore){
            highScore = score;
            localStorage.setItem("highScore",highScore.toString());
        }
    }

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })
    snake.unshift(head);
    snake.pop();

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
}
//Game start logic
startButton.addEventListener("click",()=>{
    modal.style.display = "none";
    intervalId = setInterval(()=>{
        render()
    },300)
    //Time-Watch Logic
timerIntervalId = setInterval(()=>{
    let [min,sec]=time.split("-").map(Number);
    if(sec==59){
        min+=1;
        sec=0
    }else{
        sec+=1
    }
    time = `${min}-${sec}`
    timeElement.innerText = time;
},1000)
})

restartButton.addEventListener("click", restartGame)

function restartGame(){
    blocks[`${food.x}-${food.y}`].classList.remove("food")
    snake.forEach(segment=>{
        blocks[ `${segment.x}-${segment.y}`].classList.remove("fill");
    });
    direction = "down";
    score = 0;
    time = '00-00';

    currentScoreElement.innerText = score;
    timeElement.innerText = time;
    highScoreElement.innerText = highScore;

    modal.style.display="none";
    snake = [{x: 1, y: 3},{x: 1, y:4}];
    food = {x:Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols) }
     intervalId = setInterval(()=>{
        render()
    },300)
}

addEventListener("keydown", (event) => {
  const newDir = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right"
  }[event.key];

  if (!newDir) return;

  if (opposite[direction] !== newDir) {
    direction = newDir;
  }
});let touchStartX = 0;
let touchStartY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  let newDir;

  if (Math.abs(dx) > Math.abs(dy)) {
    newDir = dx > 0 ? "right" : "left";
  } else {
    newDir = dy > 0 ? "down" : "up";
  }

  // 🚨 SAME opposite-direction protection
  if (opposite[direction] !== newDir) {
    direction = newDir;
  }
});



