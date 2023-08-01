var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

w = ctx.canvas.width = 800;
h = ctx.canvas.height = 230;

eyes = [];
tomoeArr = [];
config = {
  radius: 100,
  irisStep: 0.19,
  tomoeRings: 5,
  eyeDistance: 200,
  tomoeRotationSpeed: 1
}

anim1Start = 0;
anim1Finish = 75;
anim2Start = 0;
anim2Finish = 30;

// Top Lid
anim1 = {
  on: true,
  time: 0,
  duration: 5,
  start: anim1Start,
  finish: anim1Finish,
  distance: anim1Finish - anim1Start,
  position: anim1Start,
  position2: anim1Start,
  flag: false
}

// Bottom Lid
anim2 = {
  on: false,
  time: 0,
  duration: 5,
  start: anim2Start,
  finish: anim2Finish,
  distance: anim2Finish - anim2Start,
  position: anim2Start,
  position2: anim2Start,
  flag: false
}

tomoePosC1 = {
  spx: -3,
  spy: 17,
  cp1x: -43,
  cp1y: 13,
  cp2x: -3,
  cp2y: -66,
  epx: 50,
  epy: -20
}

tomoePosC2 = {
  cp1x: 40,
  cp1y: -30,
  cp2x: 15,
  cp2y: -30,
  epx: 20,
  epy: 4
}

lidPosC1 = { // Top L
  cp1x: 150,
  cp1y: -47,
  cp2x: 24,
  cp2y: -14,
  epx: 150,
  epy: 150
}

lidPosC2 = { // Bottom L
  cp1x: 60,
  cp1y: 37,
  cp2x: -63,
  cp2y: 150,
  epx: -149,
  epy: -102
}

lidPosC3 = { // Top R
  cp1x: 150 * -1,
  cp1y: -47,
  cp2x: 24 * -1,
  cp2y: -14,
  epx: 150 * -1,
  epy: 150
}

lidPosC4 = { // Bottom R
  cp1x: 60 * -1,
  cp1y: 37,
  cp2x: -63 * -1,
  cp2y: 150,
  epx: -149 * -1,
  epy: -102
}

function render() {
  ctx.clearRect(0,0,w,h);

  eyes.forEach(eye => {
    eye.drawEye();
    eye.tomoeArr.forEach(tomoe =>{
      eye.drawTomoe(tomoe);
    });
    eye.drawEyeGlow();
    eye.drawEyeOverlay();
  });

  ctx.globalCompositeOperation = "lighten";
  calcField();
  noiseZ += noiseSpeed;
  drawParticles();
  ctx.globalCompositeOperation = "source-over";

  animEyeLids();

  requestAnimationFrame(render);
}



// ====== A N I M A T I O N

function animEyeLids(){
  anim1.time += 1 / 60;
  anim2.time += 1 / 60;
  
  if(!anim1.flag){
    animF();
  }else{
    animB();
  }
  
  if(!anim2.flag){
    //anim2F();
  }else{
    //anim2B();
  }
}

function animF(){
  anim1.position = easeInOutQuad(anim1.time * 100 / anim1.duration, anim1.time, anim1.start, anim1.finish, anim1.duration);

  if(anim1.position >= anim1.finish){
    anim1.time = 0;
    anim1.flag = true;
  }
}

function animB(){
  anim1.position2 = easeInOutQuad(anim1.time * 100 / anim1.duration, anim1.time, anim1.start, anim1.finish, anim1.duration);

  if(anim1.position2 >= anim1.finish){
    anim1.position = 0;
    anim1.position2 = 0;
    anim1.time = 0;
    anim1.flag = false;
  }
}

function anim2F(){
  anim2.position = easeInOutQuad(anim2.time * 100 / anim2.duration, anim2.time, anim2.start, anim2.finish, anim2.duration);

  if(anim2.position >= anim2.finish){
    anim2.time = 0;
    anim2.flag = true;
  }
}

function anim2B(){
  anim2.position2 = easeInOutQuad(anim2.time * 100 / anim2.duration, anim2.time, anim2.start, anim2.finish, anim2.duration);

  if(anim2.position2 >= anim2.finish){
    anim2.position = 0;
    anim2.position2 = 0;
    anim2.time = 0;
    anim2.flag = false;
  }
}

function init() {
  var eyeL = new Rinnegan("left");
  var eyeR = new Rinnegan("right");
  eyes.push(eyeL, eyeR);

  eyes.forEach(eye => {
    eye.createTomoe();
  });
}

function easeInOutQuad(x, t, b, c, d) {
  if ((t /= d / 2) < 1) {
    return c / 2 * t * t + b;
  } else {
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  }
}



// ====== R I N N E G A N

class Rinnegan {
  constructor(side) {
    this.side = side;
    if (side == "left") {
      this.centerX = (w / 2) - config.eyeDistance;
    } else if (side == "right") {
      this.centerX = (w / 2) + config.eyeDistance;
    }
    this.centerY = h / 2;
    this.tomoeArr = this.createTomoe();
  }

  createTomoe() {
    var tomoeTempArr = [];

    // Inner
    var t1 = new Tomoe(this.side, 0, 60, 1 * config.irisStep, 1);
    var t2 = new Tomoe(this.side, 120, 180, 1 * config.irisStep, 1);
    var t3 = new Tomoe(this.side, 240, 300, 1 * config.irisStep, 1);

    // Outer
    var t4 = new Tomoe(this.side, 60, 120, 2 * config.irisStep, 1);
    var t5 = new Tomoe(this.side, 180, 240, 2 * config.irisStep, 1);
    var t6 = new Tomoe(this.side, 300, 0, 2 * config.irisStep, 1);
    tomoeTempArr.push(t1, t2, t3, t4, t5, t6);

    return tomoeTempArr;
  }

  drawEye() {
    // Inner Purple
    var eyeInnerGrd = ctx.createRadialGradient(this.centerX, this.centerY, 0, this.centerX, this.centerY, config.radius);
    eyeInnerGrd.addColorStop(0, "#eab6ff");
    eyeInnerGrd.addColorStop(0.2, "#eab6ff");
    eyeInnerGrd.addColorStop(1, "#8a49a7");

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, config.radius, 0, Math.PI * 2);
    ctx.fillStyle = eyeInnerGrd;
    ctx.fill();
    ctx.closePath();

    // Iris
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, config.radius * (1 - (config.irisStep * (config.tomoeRings - 1))), 0, Math.PI * 2);
    ctx.fillStyle = "#b962dd";
    ctx.fill();
    ctx.closePath();

    // Pupil
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, config.radius * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();

    // Draw the inner Lines
    for (var i = 0; i < config.tomoeRings; i++) {
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.arc(this.centerX, this.centerY, config.radius * (1 - (i * config.irisStep)), 0, Math.PI * 2);
      ctx.strokeStyle = "#000";
      ctx.stroke();
      ctx.closePath();
    }
  }

  drawTomoe(tomoe) {
    tomoe.pos.x = tomoe.radius * Math.cos(tomoe.angle * (Math.PI / 180));
    tomoe.pos.y = tomoe.radius * Math.sin(tomoe.angle * (Math.PI / 180));
    var tpx = this.centerX + tomoe.pos.x;
    var tpy = this.centerY + tomoe.pos.y;

    ctx.save();
    ctx.translate(tpx, tpy);
    ctx.rotate(tomoe.angle2 * (Math.PI / 180));
    ctx.scale(0.28, 0.28);

    // Center
    ctx.beginPath();
    ctx.arc(0, 0, tomoe.size, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.closePath();

    // Curve
    ctx.beginPath();
    ctx.moveTo(0 + tomoePosC1.spx, 0 + tomoePosC1.spy);
    ctx.bezierCurveTo(
      0 + tomoePosC1.cp1x,
      0 + tomoePosC1.cp1y,
      0 + tomoePosC1.cp2x,
      0 + tomoePosC1.cp2y,
      0 + tomoePosC1.epx,
      0 + tomoePosC1.epy,
    );
    ctx.bezierCurveTo(
      0 + tomoePosC2.cp1x,
      0 + tomoePosC2.cp1y,
      0 + tomoePosC2.cp2x,
      0 + tomoePosC2.cp2y,
      0 + tomoePosC2.epx,
      0 + tomoePosC2.epy,
    );
    ctx.closePath();
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();

    if(this.side == "left"){ 
      tomoe.angle2 += tomoe.speed;
      tomoe.angle += tomoe.speed;
    }else if(this.side == "right"){ 
      tomoe.angle2 -= tomoe.speed;
      tomoe.angle -= tomoe.speed;
    }
  }

  drawEyeGlow() {
    var egr = 25;
    var egx = this.centerX - 50;
    var egy = this.centerY - 20;
    var eyeGlow = ctx.createRadialGradient(egx, egy, 0, egx, egy, egr);
    eyeGlow.addColorStop(0, "rgba(255,255,255,0.8)");
    eyeGlow.addColorStop(0.4, "rgba(255,255,255,0.8)");
    eyeGlow.addColorStop(1, "rgba(255,255,255,0)");

    ctx.beginPath();
    ctx.arc(egx, egy, egr, 0, Math.PI * 2);
    ctx.fillStyle = eyeGlow;
    ctx.fill();
    ctx.closePath();
  }

  drawEyeOverlay() {
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 10;

    if (this.side == "left") {
      var lidPosTop = lidPosC1;
      var lidPosBot = lidPosC2;
      var topTL = this.centerX - (config.radius - (config.radius * 0));
      var tr = this.centerY - (config.radius - (config.radius * 0.5));
      var tl2 = this.centerX + (config.radius * 1.5);
      var tr2 = this.centerY + (config.radius * 0.35);
      var offsetX = 50;
      var anim1Val = lidPosTop.cp1x - (anim1.position - anim1.position2);
      var anim2Val = lidPosBot.cp2x + (anim2.position - anim2.position2);
    } else if (this.side == "right") {
      var lidPosTop = lidPosC3;
      var lidPosBot = lidPosC4;
      var topTL = this.centerX + config.radius;
      var tr = this.centerY - (config.radius - (config.radius * 0.5));
      var tl2 = this.centerX - (config.radius * 1.5);
      var tr2 = this.centerY + (config.radius * 0.35);
      var offsetX = -50;
      var anim1Val = lidPosTop.cp1x + (anim1.position - anim1.position2);
      var anim2Val = lidPosBot.cp2x - (anim2.position - anim2.position2);
    }

    // Top Part
    ctx.beginPath();
    ctx.moveTo(topTL, tr);
    ctx.bezierCurveTo(
      this.centerX + anim1Val,
      this.centerY + lidPosTop.cp1y,
      this.centerX + lidPosTop.cp2x,
      this.centerY + lidPosTop.cp2y,
      this.centerX + lidPosTop.epx,
      this.centerY + lidPosTop.epy,
    );
    ctx.lineTo(this.centerX + lidPosTop.epx + offsetX, 0); // top right
    ctx.lineTo(topTL, 0); // top left
    ctx.closePath();

    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#000";
    ctx.fill();
    //ctx.stroke();

    // Bottom Part
    ctx.beginPath();
    ctx.moveTo(tl2, tr2);
    ctx.bezierCurveTo(
      this.centerX + lidPosBot.cp1x,
      this.centerY + lidPosBot.cp1y,
      this.centerX + lidPosBot.cp2x,
      this.centerY + lidPosBot.cp2y,
      this.centerX + lidPosBot.epx + offsetX,
      this.centerY + lidPosBot.epy,
    );
    ctx.lineTo(this.centerX + lidPosBot.epx, h); // bot left
    ctx.lineTo(tl2, h); // top left
    ctx.closePath();

    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#000";
    ctx.fill();
    //ctx.stroke();

    ctx.shadowBlur = 0;
  }
}



// ====== T O M O E

class Tomoe {
  constructor(side, ang, ang2, rad, dir) {
    this.pos = {
      x: 0,
      y: 0
    };
    this.radius = (config.radius * rad) * 1.15;
    this.angle = ang;
    this.angle2 = ang2;
    this.speed = dir * config.tomoeRotationSpeed;
    this.size = 20;
    this.side = side;
  }
}









// ===== P A R T I C L E S
let field, fieldSize, columns, rows, noiseZ, particles, hue;
(noiseZ = 0);
emitRate = 30;
emitCount = 5;
particleSize = 2;
fieldSize = 30;
fieldForce = 0.1;
noiseSpeed = 0.0005;
sORp = true;
trailLength = 0.5;
hueBase = 10;
hueRange = 10;
maxSpeed = 1;
glow = true;
lifetime = 750;

class Particle {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(Math.random() - 0.5, Math.random() - 0.5);
    this.acc = new Vector(0, 0);
    this.hue = Math.random() * (285 - 265) + 265;
    this.lif = Date.now()
    this.dur = Math.random() * ((lifetime + (lifetime/2)) - (lifetime/2)) + (lifetime/2);
  }

  move(acc) {
    if (acc) {
      this.acc.addTo(acc);
    }
    this.vel.addTo(this.acc);
    this.pos.addTo(this.vel);
    if (this.vel.getLength() > maxSpeed) {
      this.vel.setLength(maxSpeed);
    }
    this.acc.setLength(0);
  }

  wrap() {
    if (this.pos.x > w) {
      this.pos.x = 0;
    } else if (this.pos.x < -this.fieldSize) {
      this.pos.x = w - 1;
    }
    if (this.pos.y > h) {
      this.pos.y = 0;
    } else if (this.pos.y < -this.fieldSize) {
      this.pos.y = h - 1;
    }
  }
}

function initParticles() {
  particles = [];
  let numberOfParticles = 1;
  for (let i = 0; i < numberOfParticles; i++) {
    var side = Math.random() < 0.5;
    let particle;
    if(side){
      particle = new Particle((w/2) + config.eyeDistance, h/2);
    }else{
      particle = new Particle((w/2) - config.eyeDistance, h/2);
    }
    particles.push(particle);
  }
}

function pushParticles() {
  for(var i=1; i<emitCount; i++){
    var angle = Math.random()*Math.PI*2;
    var dist = Math.random()*config.radius;
    var cx = Math.cos(angle)*dist;
    var cy = Math.sin(angle)*dist;

    var side = Math.random() < 0.5;
    let particle;
    if(side){
      particle = new Particle((w/2) + config.eyeDistance + cx, h/2 + cy);
    }else{
      particle = new Particle((w/2) - config.eyeDistance + cx, h/2 + cy);
    }
    particles.push(particle);
  }
}

function initField() {
  field = new Array(columns);
  for (let x = 0; x < columns; x++) {
    field[x] = new Array(rows);
    for (let y = 0; y < rows; y++) {
      let v = new Vector(0, 0);
      field[x][y] = v;
    }
  }
}

function calcField() {
  if (sORp) {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        let angle = noise.simplex3(x / 2, y / 2, noiseZ) * Math.PI * 2;
        let length = noise.simplex3(x / 40 + 40000, y / 40 + 40000, noiseZ) * fieldForce;
        field[x][y].setLength(length);
        field[x][y].setAngle(angle);
      }
    }
  } else {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        let angle = noise.perlin3(x / 2, y / 2, noiseZ) * Math.PI * 2;
        let length = noise.perlin3(x / 40 + 40000, y / 40 + 40000, noiseZ) * fieldForce;
        field[x][y].setLength(length);
        field[x][y].setAngle(angle);
      }
    }
  }
}

function reset() {  
  //ctx.strokeStyle = fieldColor;
  noise.seed(Math.random());
  columns = Math.round(w / fieldSize) + 1;
  rows = Math.round(h / fieldSize) + 1;
  initParticles();
  initField();
}

function drawParticles() {
  particles.forEach(p => {
    if(p.lif + p.dur < Date.now()){
      particles.splice(particles.indexOf(p), 1);
    }
    //var ps = p.fieldSize = Math.abs(p.vel.x + p.vel.y)*particleSize + 0.3;
    ctx.beginPath();
    var pcol = "hsl("+(hueBase + p.hue + ((p.vel.x + p.vel.y)*hueRange))+", 100%, 60%)";
    ctx.fillStyle = pcol;
    ctx.fillRect(p.pos.x, p.pos.y, particleSize, particleSize);
    ctx.closePath();
    let pos = p.pos.div(fieldSize);
    let v;
    if (pos.x >= 0 && pos.x < columns && pos.y >= 0 && pos.y < rows) {
      v = field[Math.floor(pos.x)][Math.floor(pos.y)];
    }
    p.move(v);
    //p.wrap();
  });
}

var emitter = setInterval(pushParticles, emitRate);

init();
reset();
render();