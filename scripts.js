

var W = 10;
var H = 20;
var CELL_HEIGHT = 20;
var WIDTH = CELL_HEIGHT * (W + 2);
var HEIGHT = CELL_HEIGHT * (H + 2);
var rs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((e) => e * 2 * Math.SQRT2)

class Pos {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
    copy() {
        return new Pos(this.x, this.y)
    }
    add(other) {
        this.x += other.x
        this.y += other.y
        return this
    }
    diff(other) {
        this.x -= other.x
        this.y -= other.y
        return this
    }
    multiply(a) {
        this.x *= a
        this.y *= a
        return this
    }
    newMultiply(a) {
        return new Pos(this.x * a, this.y * a)
    }
    newAdd(other) {
        return new Pos(this.x + other.x, this.y + other.y)
    }
    newDiff(other) {
        return new Pos(this.x - other.x, this.y - other.y)
    }
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }
    distance(other) {
        return this.newDiff(other).length()
    }
}
class Fruit {
    constructor(pos, r, m) {
        this.pos = pos
        this.lastPos = pos// new Pos(pos.x, pos.y - 2)
        // this.v = v
        this.r = rs[r]
        this.ri = r
        this.m = m
    }
    step() {
        console.log(`fruit step: ${this.r}`)
        let diff = this.pos.newDiff(this.lastPos)
        // console.log(`asd  diff before:  ${diff.x} ${diff.y} `)
        // diff.diff(this.lastPos)
        // console.log(`asd  diff after:  ${diff.x} ${diff.y} `)

        this.lastPos = this.pos
        diff.multiply(0.6)  //  cooling?
        this.pos = new Pos(this.pos.x + diff.x, this.pos.y + diff.y + 5)
        //console.log(this.pos.y)
    }
    collide(other) {
        let dist = this.pos.distance(other.pos)

        if (dist <= this.r + other.r) {
            // if (this.ri === other.ri) {
            //    this.lastPos = this.pos.copy()

            //    return true
            // } else {
            let diff = this.r + other.r - dist
            let a1 =/* 1 * diff * */other.r / (this.r + other.r)
            let a2 =/* 1 * diff * */this.r / (this.r + other.r)
            console.log(`diff: ${diff}, a1: ${a1}, a2: ${a2}`)

            // let p1 = this.pos.newDiff(this.lastPos)
            // let p2 = other.pos.newDiff(other.lastPos)
            // let d1 = p1.newDiff(p2).multiply(a1)
            // let d2 = p2.newDiff(p1).multiply(a2)

            let v1 = this.pos.newDiff(this.lastPos)
            let v2 = other.pos.newDiff(other.lastPos)

            let u1 = v1.newMultiply((this.r - other.r) / (this.r + other.r)).add(
                v2.newMultiply((2 * other.r) / (this.r + other.r))
            )
            let u2 = v2.newMultiply((other.r - this.r) / (this.r + other.r)).add(
                v1.newMultiply((2 * this.r) / (this.r + other.r))
            )
            // let d1 = u1//.multiply(0.5)
            // let d2 = u2//.multiply(0.5)

            u1.multiply(0.05)
            u2.multiply(0.05)

            let d1 = this.pos.newDiff(other.pos).multiply(a1 * 0.05)//.add(u1).multiply(0.2)
            let d2 = other.pos.newDiff(this.pos).multiply(a2 * 0.05)//.add(u2).multiply(0.2)
            console.log('1')
            console.log(`d1(${d1.x},${d1.y}) `)
            console.log(`d2(${d2.x},${d2.y}) `)

            console.log('2')


            this.lastPos = this.pos.copy().diff(d1)

            //d1.multiply(0.8)
            this.pos.add(d1)
            console.log('3')

            other.lastPos = other.pos.copy().diff(d2)

            // d2.multiply(0.8)
            other.pos.add(d2)
            console.log('3')
            // }
        }
        return false
    }
    keepInside(maxX, maxY) {
        if (this.pos.x < this.r) {
            //  this.lastPos = this.pos.copy()
            this.pos.x = this.r
        }
        if (this.pos.x > maxX - this.r) {
            //  this.lastPos = this.pos.copy()
            this.pos.x = maxX - this.r
        }
        if (this.pos.y > maxY - this.r) {
            //  this.lastPos = this.pos.copy()
            this.pos.y = maxY - this.r
        }
    }
}

class Scene {
    constructor() {
        this.fruits = [
            // new Fruit(new Pos(101, 150), 4, 1),
            // new Fruit(new Pos(103, 400), 10, 1),

            new Fruit(new Pos(100, 100), 1, 1),
            new Fruit(new Pos(100, 150), 2, 1),
            new Fruit(new Pos(100, 200), 4, 1),
            new Fruit(new Pos(100, 250), 7, 1),
            new Fruit(new Pos(100, 300), 8, 1),
            new Fruit(new Pos(100, 350), 9, 1),
            //
            new Fruit(new Pos(50, 105), 2, 1),
            new Fruit(new Pos(33, 155), 9, 1),
            new Fruit(new Pos(50, 205), 1, 1),
            new Fruit(new Pos(70, 255), 8, 1),
            new Fruit(new Pos(50, 305), 3, 1),
            new Fruit(new Pos(50, 355), 7, 1),
            //
            new Fruit(new Pos(156, 50), 0, 1),
            new Fruit(new Pos(156, 90), 7, 1),
            new Fruit(new Pos(180, 150), 6, 1),
            new Fruit(new Pos(156, 218), 5, 1),
            new Fruit(new Pos(200, 308), 2, 1),
            new Fruit(new Pos(156, 358), 4, 1),
        ]
    }
    step() {
        console.log('scene step')
        for (let f of this.fruits) {
            f.step()
        }


        for (let it = 1; it <= 20; ++it) {

            //  wtf, black magic here
            for (let i = 0; i < this.fruits.length - 1; ++i) {
                for (let j = 0; j < this.fruits.length; ++j) {
                    if (i === j) continue
                    this.fruits[i].collide(this.fruits[j])
                }
            }

            for (let f of this.fruits) {
                // keep 'em inside the "box"
                f.keepInside(WIDTH, HEIGHT)
            }
        }
    }
}


var scene
var canvas = document.getElementById('cv');
var ctx //= canvas.getContext('2d');
var timer

function onLoad() {
    canvas = document.getElementById('cv');
    ctx = canvas.getContext('2d');
    reset();

}
function start() {
    timer = setInterval(() => {
        scene.step()
        // for (let f of scene.fruits) {
        //     //f.y += scene.g
        //     f.step(scene.g)
        // }
        requestAnimationFrame(reDrawScene)
        // reDrawScene()
    }, 50)
}

function reset() {
    clearInterval(timer)

    console.log('a1')
    scene = new Scene()

    canvas = document.getElementById('cv');
    ctx = canvas.getContext('2d');
    //  clear();
    // for (let i = 0; i < H + 2; ++i) {
    //     drawCell(0, i * CELL_HEIGHT, '#999');
    //     drawCell((W + 1) * CELL_HEIGHT, i * CELL_HEIGHT, '#999');
    // }
    // for (let i = 1; i < W + 1; ++i) {
    //     drawCell(i * CELL_HEIGHT, 0, '#999');
    //     drawCell(i * CELL_HEIGHT, (H + 1) * CELL_HEIGHT, '#999');
    // }
    console.log(scene.fruits)
    reDrawScene()

}

function reDrawScene() {
    clear()
    for (let f of scene.fruits) {
        drawFruit(f)
    }
}

function drawFruit(a) {
    ctx.beginPath();
    // ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'blue';
    ctx.arc(a.pos.x, a.pos.y, a.r, 0, 2 * Math.PI);
    // ctx.fill();

    // ctx.fillStyle = '#888';
    // ctx.lineWidth = 1;
    // ctx.rect(x, y, CELL_HEIGHT, CELL_HEIGHT/*, 0, 0, 2 * Math.PI*/);
    ctx.stroke();
    //ctx.closePath();
}

function clear() {
    ctx.beginPath();
    ctx.fillStyle = '#ccc';
    ctx.rect(0, 0, WIDTH, HEIGHT, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}