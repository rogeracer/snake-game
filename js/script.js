const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const audio = new Audio('../assets/audio.mp3');

const score = document.querySelector('.score--value');
const finalScore = document.querySelector('.final-score > span');
const menu = document.querySelector('.menu-screen');
const buttonPlay = document.querySelector('.btn-play')


const size = 30;
const initialPosition = {x:180,y:240};

const snake = [initialPosition];

const incrementScore = () =>{
    score.innerText = +score.innerText + 10
}

const randomNumber = (min,max) =>{
    return Math.floor(Math.random() * (max + min) - min)
}

const randomPosition = () =>{
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number/size) * size 
}

const randomColor = () =>{
    return `rgb(
        ${randomNumber(0,255)},
        ${randomNumber(0,255)},
        ${randomNumber(0,255)}
    )`
}

const food = {
    x:randomPosition(),
    y:randomPosition(),
    color:randomColor()
}

let direction, loopId;

const drawSnake = () =>{
    
    ctx.fillStyle = '#ddd';

   snake.forEach((position,index) =>{
    if(index == snake.length - 1){
        ctx.fillStyle = 'white';
    }
    ctx.fillRect(position.x,position.y,size,size)
   })

};

const drawFood = () =>{
    const { x, y, color} = food
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = color;
    ctx.fillRect(x,y,size,size);
    ctx.shadowBlur = 0;
}

const moveSnake = () =>{
    
    if(!direction) return

    const head = snake[snake.length - 1];
    
    if(direction == 'right'){
        snake.push({x: head.x + size, y: head.y})
    };

    if(direction == 'left'){
        snake.push({x: head.x - size, y: head.y})
    };

    if(direction == 'up'){
        snake.push({x: head.x, y: head.y - size})
    };

    if(direction == 'down'){
        snake.push({x: head.x, y: head.y + size})
    };

    snake.shift();
}

const gameLoop = () =>{
    
    clearTimeout(loopId);

    ctx.clearRect(0,0,600,600);
    
    gameGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout( () =>{
        gameLoop()
    },300)
};

const gameGrid = () =>{
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for(let i = size; i < canvas.width; i+=size){
        ctx.beginPath();
        ctx.lineTo(i,0);
        ctx.lineTo(i,600);

        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0,i);
        ctx.lineTo(600,i);

        ctx.stroke();
    }
   
};

const checkEat = () =>{
    const head = snake[snake.length - 1];
    if(head.x == food.x && head.y == food.y){
        snake.push(head);
        incrementScore();
        audio.play();

        let x = randomPosition();
        let y = randomPosition();

        while(snake.find(position => position.x == x && position.y == y )){
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
};

const checkCollision = () =>{

    const head = snake[snake.length - 1];
    const canvaLimits = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision = head.x < 0 || head.x > canvaLimits || head.y < 0 || head.y > canvaLimits;
    const selfCollision = snake.find((position,i)=> {
        return i < neckIndex && position.x == head.x && position.y == head.y
    });

    if(wallCollision || selfCollision){
        gameOver();
    };
};

const gameOver = () =>{
    direction = undefined;
    
    finalScore.innerText = score.innerText;
    menu.style.display = 'flex';
    canvas.style.filter = 'blur(2px)'
} 

gameLoop();

document.addEventListener("keydown", ({key})=>{
    
    if(key == 'ArrowUp' && direction !== 'down'){
        direction = 'up'
    }
    if(key == 'ArrowDown' && direction !== 'up'){
        direction = 'down'
    }
    if(key == 'ArrowRight' && direction !== 'left'){
        direction = 'right'
    }
    if(key == 'ArrowLeft' && direction !== 'right'){
        direction = 'left'
    }
});

buttonPlay.addEventListener('click', () =>{
    score.innerText = '00';
    menu.style.display = 'none';
    canvas.style.filter = 'none';
    snake.length = 0;
    snake.push(initialPosition)
})

