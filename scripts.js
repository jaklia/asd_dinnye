const WIDTH = 300;
const HEIGHT = 400;
const Y_ZERO = 60;
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
var rs = nums.map((e) => e ** 1.234 * 3.2 * Math.SQRT2);
var count = nums.map((e) => 0);
var p = nums.map((e) => (1 + e) * e / 2);


// colors by the AI in Edge
var colors = [
    '#FA8811',
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50'];



class Pos {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Pos(this.x, this.y);
    }
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    diff(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    multiply(a) {
        this.x *= a;
        this.y *= a;
        return this;
    }
    newMultiply(a) {
        return new Pos(this.x * a, this.y * a);
    }
    newAdd(other) {
        return new Pos(this.x + other.x, this.y + other.y);
    }
    newDiff(other) {
        return new Pos(this.x - other.x, this.y - other.y);
    }
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    distance(other) {
        return this.newDiff(other).length();
    }
}
class Fruit {
    constructor(pos, r, m) {
        this.pos = pos;
        this.lastPos = pos; // new Pos(pos.x, pos.y - 2) 
        this.r = rs[r];
        this.ri = r;
        this.m = m;
        this.rotation = 0;
    }
    step() {
        //console.log(`fruit step: ${this.r}`)
        let diff = this.pos.newDiff(this.lastPos);
        // console.log(`asd  diff before:  ${diff.x} ${diff.y} `)
        // diff.diff(this.lastPos)
        // console.log(`asd  diff after:  ${diff.x} ${diff.y} `)
        this.lastPos = this.pos;
        diff.multiply(0.6);
        this.pos = new Pos(this.pos.x + diff.x, this.pos.y + diff.y + 6);
    }
    collide(other) {
        let dist = this.pos.distance(other.pos);
        let rsum = this.r + other.r;

        if (dist <= rsum) {
            if (this.ri === other.ri) {
                let point = p[this.ri];
                ++count[this.ri];

                this.pos.add(other.pos.newDiff(this.pos).multiply(0.5));
                this.lastPos = this.pos.copy();
                this.ri = (this.ri + 1) % rs.length;
                this.r = rs[this.ri];
                return point;
            } else {
                let diff = rsum - dist;
                let a1 = 2 * diff * other.r / rsum ** 2;
                let a2 = 2 * diff * this.r / rsum ** 2;
                // let a1 = diff / rsum
                // let a2 = diff / rsum
                //console.log(`diff: ${diff}, a1: ${a1}, a2: ${a2}`)

                //  TODO:  not used now, maybe needed later (was trying to consider the velocity of the balls)
                /* let v1 = this.pos.newDiff(this.lastPos)
                 let v2 = other.pos.newDiff(other.lastPos)
 
                 let u1 = v1.newMultiply((this.r - other.r) / (this.r + other.r)).add(
                     v2.newMultiply((2 * other.r) / (this.r + other.r))
                 )
                 let u2 = v2.newMultiply((other.r - this.r) / (this.r + other.r)).add(
                     v1.newMultiply((2 * this.r) / (this.r + other.r))
                 )
                 u1.multiply(0.05)
                 u2.multiply(0.05)*/

                // TODO:  swap `a1` and `a2` below, to make it look like bubbles
                //  (the smaller bubbles will "fall" to the bottom, even between the bigger ones)
                let d1 = this.pos.newDiff(other.pos).multiply(a1);//.add(u1).multiply(0.2)
                let d2 = other.pos.newDiff(this.pos).multiply(a2);//.add(u2).multiply(0.2)
                // console.log(`d1(${d1.x},${d1.y}) `)
                // console.log(`d2(${d2.x},${d2.y}) `)

                // this.lastPos = this.pos.copy().diff(d1);
                this.pos.add(d1);

                //  other.lastPos = other.pos.copy().diff(d2);
                other.pos.add(d2);
            }
        }
        return 0;
    }
    keepInside(maxX, maxY) {
        if (this.pos.x < this.r) {
            // this.lastPos = this.pos.copy()
            let d_x = this.pos.x - this.lastPos.x;
            this.pos.x = this.r;
            this.lastPos.x = this.pos.x + d_x;
        }
        if (this.pos.x > maxX - this.r) {
            //this.lastPos = this.pos.copy()
            let d_x = this.pos.x - this.lastPos.x;
            this.pos.x = maxX - this.r;
            this.lastPos.x = this.pos.x + d_x;
        }
        if (this.pos.y > maxY - this.r) {
            let d_y = this.pos.y - this.lastPos.y;
            this.pos.y = maxY - this.r;
            this.lastPos.y = this.pos.y + d_y;
        }
    }
    rotate() {
        let dx = this.pos.x - this.lastPos.x;
        let dr = dx / this.r;
        this.rotation += dr;
        let pi2 = Math.PI * 2;
        if (this.rotation > pi2) {
            this.rotation -= pi2;
        } else if (this.rotation < 0) {
            this.rotation += pi2;
        }
    }
}

class Scene {
    constructor() {
        this.dropPoint = WIDTH / 2;
        this.nextItem = Math.floor(Math.random() * 5);
        this.points = 0;

        // generate random fruits, 
        // need less from the bigger ones, and more from the smaller ones
        //  well, turns out, the +1  at the end is really important...  
        this.fruits = null;
        this.fruits = Array(3).fill().map((_) => {
            let r = Math.floor(5 - Math.log2(Math.random() * (2 ** 5) + 1));
            // console.log(r)
            return new Fruit(
                new Pos(
                    Math.random() * (WIDTH - 2 * rs[4]) + rs[4],
                    Math.random() * (HEIGHT - 100 - 2 * rs[4]) + rs[4] + Y_ZERO
                ),
                r,
                1
            );
        },);
    }
    step() {
        // console.log('scene step')
        for (let f of this.fruits) {
            f.step();
        }

        for (let it = 1; it <= 32; ++it) {
            for (let i = 0; i < this.fruits.length - 1; ++i) {
                for (let j = i + 1; j < this.fruits.length; ++j) {
                    if (i === j) continue;

                    let point = this.fruits[i].collide(this.fruits[j]);
                    if (point > 0) {
                        this.fruits.splice(j, 1);
                        --j;
                        this.points += point;
                        console.log(this.points);
                    }
                }
            }

            for (let f of this.fruits) {
                f.keepInside(WIDTH, HEIGHT);
            }
        }
        for (let f of this.fruits) {
            f.rotate();
        }
    }
    setDropPoint(x) {
        this.dropPoint = x;
    }
    randomizeNext() {
        this.nextItem = Math.floor(Math.random() * 5);
        console.log(`next item will be: ${this.nextItem}`);
    }
    dropNextFruit() {
        console.log('item dropped');
        this.fruits.push(new Fruit(
            new Pos(this.dropPoint, Y_ZERO / 2),
            this.nextItem,
            1
        ));
        this.randomizeNext();
    }
}

var scene;
var canvas = document.getElementById('cv');
var px = document.getElementById('points');
var ctx; //= canvas.getContext('2d');
var timer;

function onCanvasClick(e) {
    if (!timer) {
        start();
    }
    scene && scene.dropNextFruit();
    drawNext(scene.nextItem);
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    var relativeY = e.clientY - canvas.offsetTop;
    if (relativeX > 0 && relativeX < canvas.width &&
        relativeY > 0 && relativeY < canvas.height) {
        scene && scene.setDropPoint(relativeX);
        reDrawTopPart(relativeX, scene.nextItem);
    }
}

function onLoad() {
    px = document.getElementById('points');
    canvas = document.getElementById('cv');
    ctx = canvas.getContext('2d');
    reset();
    document.addEventListener("mousemove", mouseMoveHandler, false);
}
function start() {
    clearInterval(timer);
    timer = setInterval(() => {
        scene.step();
        requestAnimationFrame(reDrawScene);
        px.value = scene.points;
    }, 40);
}
function reset() {
    console.log('-- RESET ----------');
    clearInterval(timer);
    timer = null;
    canvas = document.getElementById('cv');
    ctx = canvas.getContext('2d');
    scene = new Scene();
    px.value = 0;
    reDrawScene();
}

function reDrawScene() {
    clear();
    reDrawTopPart(scene.dropPoint);
    for (let f of scene.fruits) {
        drawFruit(f);
    }
    drawNext(scene.nextItem);
}

function drawFruit(a) {
    ctx.beginPath();
    ctx.strokeStyle = colors[a.ri];
    ctx.fillStyle = `${colors[a.ri]}66`;
    ctx.arc(a.pos.x, a.pos.y, a.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    //
    let dx = a.r * Math.cos(a.rotation);
    let dy = a.r * Math.sin(a.rotation);
    ctx.moveTo(a.pos.x, a.pos.y);
    ctx.lineTo(a.pos.x + dx, a.pos.y + dy);
    ctx.stroke();
}

function drawTriangle(x) {
    ctx.beginPath();
    ctx.strokeStyle = '#fafafaee';
    ctx.fillStyle = '#fafafa66';
    ctx.moveTo(x - 4, Y_ZERO - 8);
    ctx.lineTo(x + 4, Y_ZERO - 8);
    ctx.lineTo(x, Y_ZERO - 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function reDrawTopPart(triangleX, nextItem) {
    ctx.beginPath();
    ctx.fillStyle = '#111';
    // ctx.strokeStyle = '#fafafa66'
    ctx.rect(1, 1, WIDTH - 2, Y_ZERO - 2);
    ctx.fill();
    // ctx.stroke()
    drawTriangle(triangleX);
    drawNext(nextItem);
}

function clear() {
    ctx.beginPath();
    ctx.fillStyle = '#111';
    ctx.strokeStyle = '#fafafa66';
    ctx.rect(0, 0, WIDTH, HEIGHT);
    ctx.fill();
    ctx.stroke();
    ctx.moveTo(0, Y_ZERO);
    ctx.lineTo(WIDTH, Y_ZERO);
    ctx.stroke();
}

function drawNext(ri) {
    ctx.beginPath();
    ctx.strokeStyle = colors[ri];
    ctx.fillStyle = `${colors[ri]}66`;
    ctx.arc(WIDTH - rs[ri] - 4, Y_ZERO / 2, rs[ri], 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}