
var can,ctx, circs = [], wid = 5, canw, canh, lastInput,
backgroundColor = "black",
snakeColor = "green";
window.onload = function()
{
  //---Initialize Global Variables---
  can = document.getElementById("thing"),
  ctx = can.getContext("2d");
  can.width = 800;
  can.height = 800;
  canw = can.width;
  canh = can.height;
  ctx.lineWidth = 1;

  //---Event listeners---
  document.addEventListener("keydown",function(e){
    switch(e.keyCode)
    {
      case 32://space
       lastInput = 's';
       break;
      case 37://left
        lastInput = 'l';
        break;
      case 38://up
        lastInput = 'u';
        break;
      case 39://right
        lastInput = 'r';
        break;
      case 40://down
        lastInput = 'd';
        break;
      default:
    }
  });

  let game = new SnakeGame(50);
  game.init();
  game.start();
}

function clear()
{
  ctx.globalAlpha = 1;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0,0,canw,canh);
}

function randomColor()
{
  return `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
}

var Snake = function(x,y)
{
  this.len = 2;
  this.bod = [{x:x,y:y},{x:x,y:y-1}];
  this.vel = {x:0,y:1};

  this.move = function()
  {
    let head = this.getHead();
    this.bod.unshift({x:head.x+this.vel.x,y:head.y+this.vel.y});
    this.bod.pop();
  }

  this.getHead = function()
  {
    return this.bod[0];
  }

  this.grow = function()
  {
    let len = this.bod.length;
    this.bod.push({x:this.bod[len-1].x,y:this.bod[len-1].y})
  }

  this.getTail = function()
  {
    return this.bod[this.bod.length-1]
  }

  this.getBody = function()
  {
    var copy = this.bod.slice(0,this.bod.length);
    return copy;
  }

  this.turn = function(dir)
  {
    if(dir == 'u' && this.vel.x != 0 && this.vel.y != -1)
      dir = {x:0,y:-1};
    else if(dir == 'r' && this.vel.x != 1 && this.vel.y != 0)
      dir = {x:1,y:0};
    else if(dir == 'l' && this.vel.x != -1 && this.vel.y != 0)
      dir = {x:-1,y:0};
    else if(dir == 'd' && this.vel.x != 0 && this.vel.y != 1)
      dir = {x:0,y:1};
    else
      dir = this.vel
    this.vel = dir;
  }
}

var SnakeGame = function(dim)
{
  var gameDim = dim;
  var squareWid = canw/gameDim;
  var board;
  var snek;
  var fruit;
  var intr;
  var playing;
  var dead;

  this.init = function()
  {
    playing = true;
    dead = false;

    board = [];
    snek = new Snake(Math.floor(gameDim/2),Math.floor(gameDim/2),gameDim);
    fruit;
    clear();
    this.setFruit();
  }

  this.setFruit = function()
  {
    this.clearBoard();
    var moves = [];
    for (let c of snek.getBody())
    {
      board[c.x][c.y] = 1;
    }
    for(var i = 0; i < dim;  i++)
      for(var k = 0; k < dim;  k++)
        if(!board[i][k])
          moves.push([i,k]);

    var t = Math.floor(Math.random()*moves.length);
    fruit = {x:moves[t][0],y:moves[t][1]};
  }

  this.drawCell = function(x,y,color)
  {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(x*squareWid,y*squareWid,squareWid,squareWid);
    ctx.fill();
  }
  this.colidesWithSelf = function(mv)
  {
    for(let c of snek.bod)
    {
      if(c.x == mv.x && c.y == mv.y)
        return true;
    }
    return false;
  }

  this.move = function()
  {
    let head = snek.getHead();
    snek.move();
    if(head.x == fruit.x && head.y == fruit.y)
    {
      this.drawCell(fruit.x,fruit.y, backgroundColor);
      snek.grow();
      this.setFruit();
    }
  }

  this.moveIsValid = function()
  {
    let head = snek.getHead();
    var mv = {
      x:head.x + snek.vel.x,
      y:head.y + snek.vel.y
    };

    return !(mv.x > gameDim-1 ||
          mv.x < 0 ||
          mv.y > gameDim-1 ||
          mv.y < 0 ||
          this.colidesWithSelf(mv));
  }

  this.tick = function()
  {
    if (lastInput == 's')
    {
      lastInput = 0;
      if (dead)
      {
        this.init();
        return
      }
      playing = playing ? false:true;
    }
    if (!playing) return;

    let tail = snek.getTail();
    if(lastInput)
    {
      snek.turn(lastInput);
      lastInput = 0;
    }

    if(this.moveIsValid())
    {
      this.move();

      for(let cell of snek.getBody())
      {
          this.drawCell(cell.x,cell.y, snakeColor);
      }

      this.drawCell(tail.x,tail.y, backgroundColor);
      this.drawCell(fruit.x,fruit.y,randomColor());
    }
    else
    {
      this.die();
    }
  }

  this.clearBoard = function()
  {
    board = [];
    for(var i = 0; i < gameDim; i++){
      var row = []
      for(var k = 0; k < gameDim; k++)
        row.push(0);
      board.push(row);
    }
  }

  this.die = function()
  {
    playing = false;
    dead = true;
  }

  this.start = function()
  {
    intr = setInterval(()=>this.tick(),1000/18);
  }
}
