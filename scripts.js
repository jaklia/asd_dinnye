const WIDTH = 300;
const HEIGHT = 400;
const Y_ZERO = 60;
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
var rs = nums.map((e) => e ** 1.234 * 3.2 * Math.SQRT2);
var count = nums.map((e) => 0);


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
    }
    step() {
        //console.log(`fruit step: ${this.r}`)
        let diff = this.pos.newDiff(this.lastPos);
        // console.log(`asd  diff before:  ${diff.x} ${diff.y} `)
        // diff.diff(this.lastPos)
        // console.log(`asd  diff after:  ${diff.x} ${diff.y} `)
        this.lastPos = this.pos;
        diff.multiply(0.6);  //  cooling?
        this.pos = new Pos(this.pos.x + diff.x, this.pos.y + diff.y + 6);
    }
    collide(other) {
        let dist = this.pos.distance(other.pos);
        let rsum = this.r + other.r;

        if (dist <= rsum) {
            if (this.ri === other.ri) {
                ++count[this.ri];
                console.log(count);

                this.pos.add(other.pos.newDiff(this.pos).multiply(0.5));
                this.ri = (this.ri + 1) % rs.length;
                this.r = rs[this.ri];
                return true;
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

                //this.lastPos = this.pos.copy().diff(d1)
                this.pos.add(d1);

                //other.lastPos = other.pos.copy().diff(d2)
                other.pos.add(d2);
            }
        }
        return false;
    }
    keepInside(maxX, maxY) {
        if (this.pos.x < this.r) {
            // this.lastPos = this.pos.copy()
            this.pos.x = this.r;
        }
        if (this.pos.x > maxX - this.r) {
            //this.lastPos = this.pos.copy()
            this.pos.x = maxX - this.r;
        }
        if (this.pos.y > maxY - this.r) {
            let d_y = this.pos.y - this.lastPos.y;
            this.pos.y = maxY - this.r;
            this.lastPos.y = this.pos.y + d_y;
        }
    }
}

class Scene {
    constructor() {
        this.dropPoint = WIDTH / 2;
        this.nextItem = Math.floor(Math.random() * 5);

        // generate random fruits, 
        // need less from the bigger ones, and more from the smaller ones
        //  well, turns out, the +1  at the end is really important...  
        this.fruits = null;
        this.fruits = Array(16).fill().map((_) => {
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

        for (let it = 1; it <= 16; ++it) {
            //  wtf, black magic here
            for (let i = 0; i < this.fruits.length - 1; ++i) {
                for (let j = 0; j < this.fruits.length; ++j) {
                    if (i === j) continue;

                    let merged = this.fruits[i].collide(this.fruits[j]);
                    if (merged) {
                        this.fruits.splice(j, 1);
                        --j;
                    }
                }
            }

            for (let f of this.fruits) {
                // keep 'em inside the "box"
                f.keepInside(WIDTH, HEIGHT);
            }
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
    }, 40);
}
function reset() {
    console.log('-- RESET ----------');
    clearInterval(timer);
    timer = null;
    canvas = document.getElementById('cv');
    ctx = canvas.getContext('2d');
    scene = new Scene();
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