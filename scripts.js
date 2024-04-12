

var W = 10;
var H = 20;
var CELL_HEIGHT = 20;
var WIDTH = CELL_HEIGHT * (W + 2);
var HEIGHT = CELL_HEIGHT * (H + 2);

class Pos {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
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
        this.lastPos = pos
        // this.v = v
        this.r = r
        this.m = m
    }
    step(g) {
        console.log(`fruit step: ${this.r}`)
        let diff = this.pos.newDiff(this.lastPos)
        // console.log(`asd  diff before:  ${diff.x} ${diff.y} `)
        // diff.diff(this.lastPos)
        // console.log(`asd  diff after:  ${diff.x} ${diff.y} `)

        this.lastPos = this.pos
        this.pos = new Pos(this.pos.x + diff.x, this.pos.y + diff.y + g)
        //console.log(this.pos.y)
    }
    collide(other) {
        let dist = this.pos.distance(other.pos)

        if (dist <= this.r + other.r) {
            if (this.r === other.r) {
                //
            } else {
                let diff = this.r + other.r - dist
                let a1 = /*0.5 * diff * */other.r / (this.r + other.r)
                let a2 = /*0.5 * diff * */this.r / (this.r + other.r)
                console.log(`diff: ${diff}, a1: ${a1}, a2: ${a2}`)

                let d1 = this.pos.newDiff(other.pos).multiply(a1)
                let d2 = other.pos.newDiff(this.pos).multiply(a2)
                console.log('1')
                console.log(`d1(${d1.x},${d1.y}) `)
                console.log(`d2(${d2.x},${d2.y}) `)

                console.log('2')
                let randomAngle = Math.random() - 0.5

                this.lastPos = this.pos
                if (d1.x == 0) {
                    d1.x = randomAngle
                }
                this.pos.add(d1)
                console.log('3')

                other.lastPos = other.pos
                if (d2.x == 0) {
                    d2.x = -randomAngle
                }
                other.pos.add(d2)
                console.log('3')
            }
        }
    }
    keepInside(maxX, maxY) {
        if (this.pos.x < this.r) {
            this.pos.x = this.r
        }
        if (this.pos.x >= maxX - this.r) {
            this.pos.x = maxX - this.r - 1
        }
        if (this.pos.y >= maxY - this.r) {
            this.pos.y = maxY - this.r - 1
        }
    }
}
class Scene {
    constructor() {
        this.g = 2
        this.fruits = [
            // new Fruit(new Pos(100, 350), 2, 1),
            // new Fruit(new Pos(100, 400), 10, 1),

            new Fruit(new Pos(100, 100), 4, 1),
            new Fruit(new Pos(100, 150), 6, 1),
            new Fruit(new Pos(100, 200), 8, 1),
            new Fruit(new Pos(100, 250), 10, 1),
            new Fruit(new Pos(100, 300), 12, 1),
            new Fruit(new Pos(100, 350), 14, 1),
        ]
    }
    step() {
        console.log('scene step')
        for (let f of this.fruits) {
            f.step(this.g)
        }


        for (let it = 0; it < 1; ++it) {

            //  wft
            for (let i = 0; i < this.fruits.length - 1; ++i) {
                for (let j = i + 1; j < this.fruits.length; ++j) {
                    this.fruits[i].collide(this.fruits[j])
                }
            }

            for (let f of this.fruits) {
                // keep 'em inside
                f.keepInside(WIDTH, HEIGHT)
            }
        }
    }
}


var scene
var canvas = document.getElementById('cv');
var ctx = canvas.getContext('2d');
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
        reDrawScene()
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