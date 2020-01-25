// SELECT CVS
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

// GAME VARS AND CONSTS
let frames = 0;
const DEGREE = Math.PI/180;

// LOAD SPRITE IMAGE
const sprite = new Image();
sprite.src = "img/sprite.png";

// LOAD SOUNDS
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const COIN = new Audio();
COIN.src = "audio/coin.wav";
COIN.volume = .5;

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";


const icons = new Image();
icons.src = "img/html5-icon.png"

const icons_src = [
    HTML5 = "img/html5-icon.png",
    socketio = "img/socket-icon.png",
    CSS3 = "img/css3-icon.png",
    react = "img/react-icon.png",
    javascript = "img/javascript-icon.png",
    heroku = "img/heroku-icon.png",
    nodejs = "img/nodejs-icon.png",
    postgresql = "img/postgres-icon.png"
]

const pianos = new Image();
pianos.src = "public/piano1.png";

const pianos_src = [
    one = "public/piano1.png",
    two = "public/piano2.png",
    three = "public/piano3.png"
]

const devMtnLogo = new Image();
devMtnLogo.src = "img/devmountain-logo.png";

let audioPlayed = false;




// GAME STATE
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

// START BUTTON COORD
const startBtn = {
    x : 120,
    y : 263,
    w : 83,
    h : 29
}

// CONTROL THE GAME
cvs.addEventListener("click", function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            if(bird.y - bird.radius <= 0) return;
            bird.flap();
            FLAP.play();
            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
            
            // CHECK IF WE CLICK ON THE START BUTTON
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
            }
            break;
    }
});


// BACKGROUND
const bg = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height - 226,
    
    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
    
}

// FOREGROUND
const fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,
    
    dx : 4,
    
    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        
        ctx.drawImage(devMtnLogo, 0, 0, 1000, 200, 30, 405, cvs.width - 50, cvs.height * .13)
    },
    
    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}


// BIRD
const bird = {
    animation : [
        {sX: 405, sY : 113},
        {sX: 405, sY : 180},
        {sX: 405, sY : 248},
        {sX: 405, sY : 113}
    ],
    x : 50,
    y : 150,
    w : 90,
    h : 66,
    
    radius : 12,
    
    frame : 0,
    
    gravity : 0.1,
    jump : 2.0,
    speed : 0,
    rotation : 0,
    
    draw : function(){
        let bird = this.animation[this.frame];
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h,- this.w/2, - this.h/2, this.w, this.h);
        
        ctx.restore();
    },
    
    flap : function(){
        this.speed = - this.jump;
    },
    
    update: function(){
        // IF THE GAME STATE IS GET READY STATE, THE BIRD MUST FLAP SLOWLY
        this.period = state.current == state.getReady ? 10 : 5;
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames%this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame%this.animation.length;
        
        if(state.current == state.getReady){
            this.y = 150; // RESET POSITION OF THE BIRD AFTER GAME OVER
            this.rotation = 0 * DEGREE;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            
            if(this.y + this.h/2 >= cvs.height - fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                if(state.current == state.game){
                    state.current = state.over;
                    HIT.play();
                }
            }
            
            // IF THE SPEED IS GREATER THAN THE JUMP MEANS THE BIRD IS FALLING DOWN
            if(this.speed >= this.jump){
                this.rotation = 10 * DEGREE;
                this.frame = 1;
            }else{
                this.rotation = -20 * DEGREE;
            }
        }
        
    },
    speedReset : function(){
        this.speed = 0;
    }
}

// GET READY MESSAGE
const getReady = {
    sX : 0,
    sY : 228,
    w : 173,
    h : 152,
    x : cvs.width/2 - 173/2,
    y : 80,
    
    draw: function(){
        if(state.current == state.getReady){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
    
}

const crystalball = new Image();
crystalball.src = "public/crystalball.png"

const hired = new Image();
hired.src = "public/hired.png"

const theworst = new Image();
theworst.src = "public/theworst.png";

// GAME OVER MESSAGE
const gameOver = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : cvs.width/2 - 225/2,
    y : 90,
    
    draw: function(){
        if(state.current == state.over){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);  
            ctx.drawImage(sprite, 277, 170, 130, 50, this.x + 50, this.y - 80, 130, 60);  
            if(score.value > 100 && score.value < 300) {
                if (audioPlayed === false) {
                    audioPlayed = true;
                }
                
                ctx.drawImage(crystalball, 0, 0, 400, 400, this.x + 15, this.y + 45, 110, 110)
            } else if (score.value > 300) {
                if (audioPlayed === false) {
                    audioPlayed = true;
                }
                
                ctx.drawImage(hired, 0, 0, 400, 400, this.x + 15, this.y + 45, 110, 110)
            } else {
                if (audioPlayed === false) {
                    audioPlayed = true;
                }
                
                ctx.drawImage(theworst, 0, 0, 400, 400, this.x + 15, this.y + 40, 120, 120) 
            }
        }
    }
    
}

const drawPianos = {
    position : [],
    
    top : {
        sX : 553,
        sY : 0
    },
    bottom:{
        sX : 502,
        sY : 0
    },
    
    w : 53,
    h : 400,
    gap : 100,
    maxYPos : -150,
    dx : 4,

    draw: function() {
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];

            ctx.drawImage(pianos, 0, 0, 400, 400, p.x + 200, 200, 70, 70)
        }
    }, 

    update: function(){


        if(state.current !== state.game) return;
        
        if(frames%100 == 0){
            this.position.push({
                x : cvs.width,
                y : this.maxYPos * ( Math.random() + 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            

            p.x -= this.dx;
            
            // if the pianos go beyond canvas, we delete them from the array
            if((p.x + 50)+ this.w <= 0){
                this.position.shift();
                let randomNumber = Math.floor(Math.random() * 3 + 0)
                // console.log(pianos.src)
                pianos.src = pianos_src[randomNumber]
                // console.log(pianos.src)
                score.value += .1;
                COIN.play();
            }
        }
    },
}

// PIPES
const pipes = {
    position : [],
    
    top : {
        sX : 553,
        sY : 0
    },
    bottom:{
        sX : 502,
        sY : 0
    },
    
    w : 53,
    h : 400,
    gap : 100,
    maxYPos : -150,
    dx : 4,
    
    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            
            // top pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);  
            
            // bottom pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h); 
            
            // icon(s)
            
            ctx.drawImage(icons, 0, 0, 400, 400, p.x + 4, bottomYPos - 70, 50, 50);

        
        }
    },
    
    update: function(){
        if(state.current !== state.game) return;
        
        if(frames%100 == 0){
            this.position.push({
                x : cvs.width,
                y : this.maxYPos * ( Math.random() + 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let bottomPipeYPos = p.y + this.h + this.gap;
            
            // COLLISION DETECTION
            // TOP PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                state.current = state.over;
                HIT.play();
            }
            // BOTTOM PIPE
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                HIT.play();
            }
            
            // MOVE THE PIPES TO THE LEFT
            p.x -= this.dx;
            
            // if the pipes go beyond canvas, we delete them from the array
            if((p.x - 130) + this.w <= 0){
                icons.src = ""
                SCORE_S.play();
            }
            if(p.x + this.w <= 0){
                this.position.shift();
                let randomNumber = Math.floor(Math.random() * 7)
                icons.src = icons_src[randomNumber]
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
            if((p.x - 100) + this.w <= 0){
                score.value += 1;

            }
        }
    },
    
    reset : function(){
        this.position = [];
    }
    
}

// SCORE
const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    
    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value.toFixed(1), cvs.width/2, 50);
            ctx.strokeText(this.value.toFixed(1), cvs.width/2, 50);
            
        }else if(state.current == state.over){
            // SCORE VALUE
            ctx.font = "25px Teko";
            ctx.fillText(this.value.toFixed(1), 190, 186);
            ctx.strokeText(this.value.toFixed(1), 190, 186);
            // BEST SCORE
            ctx.fillText(this.best.toFixed(1), 190, 228);
            ctx.strokeText(this.best.toFixed(1), 190, 228);

            
        }
    },
    
    reset : function(){
        this.value = 0;
        audioPlayed = false;
    }
}

// DRAW
function draw(){
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    
    bg.draw();
    pipes.draw();
    drawPianos.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
}

// UPDATE
function update(){
    bird.update();
    fg.update();
    pipes.update();
    drawPianos.update();
}

// LOOP
function loop(){
    update();
    draw();
    frames++;
    
    requestAnimationFrame(loop);
}
loop();