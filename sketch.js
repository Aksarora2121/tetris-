// making the canvas 


const canvas = document.getElementById('tetris');

const context = canvas.getContext('2d');

// setting the scale, x cord. 20 and y cord. 20

context.scale(20,20);


// making the ground for the game 

function groundSweep(){
    let rowCount = 1;
    outer: for (let y = ground.length -1; y>0; --y){
        for (let x= 0; x< ground[y].length; ++x){
            if (ground[y][x] ===0){
                continue outer;
            }
        }

        // shifting the blocx

        const raw = ground.splice(y,1)[0].fill(0);

        ground.unshift(row);
        ++y; // incrementation of y 
// makin the ground better for the blocx with dimensional changes
        player.score += rowCount * 10;
        rowCount *= 2 ;

    }
}


// defining the function collide 


function collide(ground,player){
    const m = player.matrix;
    const o = player.pos;
    for (let y= 0; y < m.length; ++y){
        for (let x=0; x<m[y].length; ++x){
            if (m[y] [x] !==0 &&
                (ground[y + o.y] && 
                    ground[y +o.y] [x + o.x]) !==0){
                        return true;
                    }

        }
    }


    return false;
}


// defining the matrix which controls the blocx 


function createMatrix(w,h){
    const matrix = [];

    while (h--){
        matrix.push(new Array(w).fill(0));

    }
    return matrix;
}


// makin the tetris blocx 

function createPiece(type)
{
    if (type === 'I'){
        return [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
        ];
    }else if (type === 'L'){
        return [
            [0,2,0],
            [0,2,0],
            [0,2,0],
        ];
    }else if (type === 'J'){
        return [
            [0,3,0],
            [0,3,0],
            [0,3,0],
            
        ];
    }else if (type === 'Z'){
        return [
            [4,4],
            [4,4],

        ];

    }else if (type === 'O'){
        return [
            [5,5,0],
            [0,5,5],
            [0,0,0],
        ];
    }else if (type === 'T'){
        return [
            [0,6,6],
            [6,6,0],
            [0,0,0],

        ];
    }else if (type === 'S'){
        return [
            [0,7,0],
            [7,7,7],
            [0,0,0],
        ];
    }
}



// drawing the matrix 


function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
            }
        });
    });
}

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(ground, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function merge(ground, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ground[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function rotate(matrix, direction) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (direction > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerFall() {
    player.pos.y++;
    if (collide(ground, player)) {
        player.pos.y--;
        merge(ground, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(offset) {
    player.pos.x += offset;
    if (collide(ground, player)) {
        player.pos.x -= offset;
    }
}

function playerReset() {
    const blocx = 'TJLOSZI';
    player.matrix = createPiece(blocx[blocx.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (ground[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    if (collide(ground, player)) {
        ground.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRoatation(direction) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, direction);
    while (collide(ground, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -direction);
            player.pos.x = pos;
            return;
        }
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerFall();
    }

    lastTime = time;

    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}



// giving commands to the tetris blocx


document.addEventListener('keydown', event => {
    if (event.keyCode === 52) {
        playerMove(-1);
    
    } else if (event.keyCode === 53) {
        playerMove(1);
    } else if (event.keyCode === 54) {
        playerFall();
    } else if (event.keyCode === 55) {
        playerRoatation(-1);
    } else if (event.keyCode === 56) {
        playerRoatation(1);
    }
});


// roatations 

// 4  
        // 5
        // 6 
        // 7
        // 8

const colors = [
    null,
    '#8E4545',
    '#FF0000',
    '#AA4747',
    '#1B1568',
    '#937E44',
    '#9F34C9',
    '#7E2291',
];

const ground = createMatrix(12, 20);

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
};

playerReset();
updateScore();
update();