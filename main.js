var AM = new AssetManager();
function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};
Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};
Background.prototype.update = function () {
};

//-------------------------Batman-------------------------//
var batmanSize = 3;
function Batman(game){    
    //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    // this.runAnim = new Animation(AM.getAsset("./img/spiderman.png"), 0, 50, 50, 35, 0.05, 11, true, false);
    this.runAnim = new Animation(AM.getAsset("./img/batman.png"), 128, 5, 32, 30, 0.1, 3, true, false);
    this.glideAnim = new Animation(AM.getAsset("./img/batman.png"), 155, 35, 70, 40, 0.1, 1, true, false);

    this.glide = true;
    this.run = false;
    this.speed = 250;
    this.ground = 590;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, -100, this.ground);
}
Batman.prototype = new Entity();
Batman.prototype.constructor = Batman;
Batman.prototype.update = function () {
    // if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
    if (this.x > this.ground){
        this.glide = false;
        this.run = true;  
    }
    this.x += this.game.clockTick * this.speed;
    if (this.x > 1200) {
        this.x = -230;
        this.glide = true;
        this.run = false;
    }
    Entity.prototype.update.call(this);
}
Batman.prototype.draw = function () {
    //glide make both this.x
    if (this.glide){
        this.glideAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.x, batmanSize);
    } else if (this.run){
        this.runAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, batmanSize);
    }
    Entity.prototype.draw.call(this);
}

//-------------------------Flash-------------------------//
var flashSize = 3;
var count = 0;
function Flash(game){    
    //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.runRightAnim = new Animation(AM.getAsset("./img/flash.png"), 0, 48, 30, 30, 0.02, 14, true, false);
    this.runLeftAnim = new Animation(AM.getAsset("./img/flash_left.png"), 0, 48, 30, 30, 0.02, 14, true, true);
    
    // this.stopAnim = new Animation(AM.getAsset("./img/flash.png"), 2, 484, 22, 32, 0.05, 7, true, false);
    this.stopAnim = new Animation(AM.getAsset("./img/flash.png"), 5, 278, 75, 65, 0.045, 5, true, false);

    this.run = false;
    this.runRight = false;
    this.stop = true;
    this.maxSpeed = 2900;
    this.speed = 1500;
    this.ground = 590;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 750, 510);
}
Flash.prototype = new Entity();
Flash.prototype.constructor = Flash;
var runCount=0;
Flash.prototype.update = function () { 

    if (count < 250) {  
        count++;
    } else {
        this.y = this.ground;
        this.run = true;
        this.stop = false;
    }

    if (this.run){
        if (this.runRight){
            this.x += this.game.clockTick * this.speed;
        } else {
            this.x -= this.game.clockTick * this.speed;
        }
    }    
    
    if (this.x > 1300) {        
        if (this.speed < this.maxSpeed){
            this.speed += 50;
            this.runRight = false;
        }  else {
            this.x = -200;
            this.speed = 3000;
        }      
    } else if (this.x < -200) {        
        if (this.speed < this.maxSpeed){
            this.speed += 50;
            this.runRight = true;
        } else {
            this.x = 1300;
            this.speed = 3000;
        } 
    }

    Entity.prototype.update.call(this);
}
Flash.prototype.draw = function () {
    if (this.stop){
        this.stopAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, flashSize);
    } else if (this.run){
        if (this.runRight){
            this.runRightAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, flashSize);
        } else {
            this.runLeftAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, flashSize);
        }
    } 
    Entity.prototype.draw.call(this);
}

//-------------------------Superman-------------------------//
var supermanSize = 2.4;
function Superman(game){    
    //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.flyInAnim = new Animation(AM.getAsset("./img/superman.png"), 125, 141, 85, 30, 1, 1, true, false);

    this.speed = 500;
    this.flyUp=true;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, -100, -100);
}
Superman.prototype = new Entity();
Superman.prototype.constructor = Batman;
var count2=0;
Superman.prototype.update = function () {
    if (this.x > 550){
        this.flyUp=false;
    }
    this.x += this.game.clockTick * this.speed;
    if (this.x > 1200) {
        this.x = -230;
        this.flyUp=true;
    }
    Entity.prototype.update.call(this);
}
Superman.prototype.draw = function () {
    if (this.flyUp){
        this.flyInAnim.drawFrame(this.game.clockTick, this.ctx, this.x, -this.x/2+200, supermanSize);
    } else{
        this.flyInAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.x-600, supermanSize);
    }    
    Entity.prototype.draw.call(this);
}

//-------------------------Superman-------------------------//
var harleySize = 2.2;
function Harley(game){    
    //spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse
    this.danceAnim = new Animation(AM.getAsset("./img/harley_quinn.png"), 528, 60, 45, 70, 0.3, 4, true, false);

    this.speed = 400;
    this.game = game;
    this.ctx = game.ctx;
    Entity.call(this, game, 370, 180);
}
Harley.prototype = new Entity();
Harley.prototype.constructor = Batman;
var count2=0;
Harley.prototype.update = function () {
    // this.x += this.game.clockTick * this.speed;
    // if (this.x > 1200) {
    //     this.x = -230;
    //     this.flyUp=true;
    // }
    Entity.prototype.update.call(this);
}
Harley.prototype.draw = function () {
    this.danceAnim.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, harleySize);

    Entity.prototype.draw.call(this);
}


AM.queueDownload("./img/RampageBackground.jpg");

AM.queueDownload("./img/spiderman.png");
AM.queueDownload("./img/batman.png");
AM.queueDownload("./img/flash.png");
AM.queueDownload("./img/flash_left.png");
AM.queueDownload("./img/superman.png");
AM.queueDownload("./img/harley_quinn.png");


AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/RampageBackground.jpg")));
        
    gameEngine.addEntity(new Superman(gameEngine));
    gameEngine.addEntity(new Harley(gameEngine));
    gameEngine.addEntity(new Batman(gameEngine));
    gameEngine.addEntity(new Flash(gameEngine));

    // gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    // gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/runningcat.png")));
    // gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/guy.jpg")));

    console.log("All Done!");
});